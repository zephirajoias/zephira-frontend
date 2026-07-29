"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

interface Endereco {
  CD_ENDERECO: number;
  NR_CEP: string;
  NM_LOGRADOURO: string;
  NR_NUMERO: string;
  NM_BAIRRO: string;
  NM_CIDADE: string;
  DS_UF: string;
}

interface ItemPedido {
  CD_ITEM: number;
  NM_PRODUTO_SNAPSHOT: string;
  QT_ITEM: number;
  VL_TOTAL_ITEM: string;
}

interface Pedido {
  CD_PEDIDO: number;
  VL_TOTAL: string;
  TP_STATUS: string;
  TS_CRIACAO: string;
  ITENS_PEDIDO: ItemPedido[];
}

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  PROCESSANDO: "Processando",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
  DEVOLVIDO: "Devolvido",
};

export default function MinhaContaPage() {
  return (
    <Suspense fallback={null}>
      <MinhaContaContent />
    </Suspense>
  );
}

function MinhaContaContent() {
  const { user, loading, logout, refetch } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pedidoRecemCriado = searchParams.get("pedido");

  const [activeTab, setActiveTab] = useState("pedidos");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [carregandoDados, setCarregandoDados] = useState(false);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagemPerfil, setMensagemPerfil] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setNome(user.NM_USUARIO);
      setTelefone(user.NR_TELEFONE ?? "");
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    if (activeTab === "pedidos") {
      setCarregandoDados(true);
      api
        .get<{ data: Pedido[] }>("/loja/pedidos")
        .then((res) => setPedidos(res.data))
        .catch(() => {})
        .finally(() => setCarregandoDados(false));
    }

    if (activeTab === "enderecos") {
      setCarregandoDados(true);
      api
        .get<Endereco[]>("/loja/enderecos")
        .then(setEnderecos)
        .catch(() => {})
        .finally(() => setCarregandoDados(false));
    }
  }, [activeTab, user]);

  const formatMoney = (v: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(v));

  const salvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemPerfil(null);
    try {
      await api.put("/loja/perfil", { NM_USUARIO: nome, NR_TELEFONE: telefone });
      await refetch();
      setMensagemPerfil("Dados atualizados com sucesso!");
    } catch (err) {
      setMensagemPerfil(
        err instanceof ApiError
          ? err.body?.message || "Não foi possível salvar."
          : "Não foi possível salvar.",
      );
    }
  };

  const excluirEndereco = async (id: number) => {
    await api.delete(`/loja/enderecos/${id}`);
    setEnderecos((prev) => prev.filter((e) => e.CD_ENDERECO !== id));
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg-light font-display flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-32 text-slate-400 font-bold">
          Carregando...
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light font-display text-text-main flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-8 py-10 sm:py-16">
        {pedidoRecemCriado && (
          <div className="bg-green-50 border border-green-100 text-green-600 font-bold text-sm rounded-2xl px-6 py-4 mb-8 text-center">
            Pedido #{pedidoRecemCriado} realizado com sucesso! Acompanhe o
            status abaixo.
          </div>
        )}

        {/* CABEÇALHO DO PERFIL */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 text-center md:text-left">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-bg-dark text-3xl font-black shadow-lg">
            {user.NM_USUARIO.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest">
              Olá, {user.NM_USUARIO.split(" ")[0]}!
            </h1>
            <p className="text-text-muted text-sm font-medium mt-1 uppercase tracking-wider italic opacity-70">
              {user.DS_EMAIL}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* MENU LATERAL (Abas) */}
          <aside className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            {[
              { id: "pedidos", label: "Meus Pedidos", icon: "local_mall" },
              { id: "dados", label: "Dados Pessoais", icon: "person_outline" },
              { id: "enderecos", label: "Endereços", icon: "location_on" },
              { id: "sair", label: "Sair da Conta", icon: "logout" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  tab.id === "sair" ? handleLogout() : setActiveTab(tab.id)
                }
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "bg-bg-dark text-primary shadow-xl"
                      : "bg-white text-slate-400 hover:text-primary border border-slate-100"
                  }
                  ${tab.id === "sair" ? "mt-auto text-red-400 hover:bg-red-50" : ""}
                `}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </aside>

          {/* CONTEÚDO DINÂMICO */}
          <section className="flex-1">
            {activeTab === "pedidos" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-black uppercase tracking-widest border-b border-slate-200 pb-4">
                  Histórico de Pedidos
                </h2>

                {carregandoDados && (
                  <p className="text-slate-400 font-bold text-sm">
                    Carregando...
                  </p>
                )}

                {!carregandoDados && pedidos.length === 0 && (
                  <p className="text-slate-400 font-bold text-sm">
                    Você ainda não fez nenhum pedido.
                  </p>
                )}

                {pedidos.map((pedido) => (
                  <div
                    key={pedido.CD_PEDIDO}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="size-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          package_2
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-text-main">
                          #{pedido.CD_PEDIDO}
                        </p>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-tighter">
                          {new Date(pedido.TS_CRIACAO).toLocaleDateString(
                            "pt-BR",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-12">
                      <div className="text-right">
                        <p className="text-sm font-black text-text-main">
                          {formatMoney(pedido.VL_TOTAL)}
                        </p>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${pedido.TP_STATUS === "ENTREGUE" ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"}`}
                        >
                          {STATUS_LABEL[pedido.TP_STATUS] ?? pedido.TP_STATUS}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "dados" && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-black uppercase tracking-widest mb-8">
                  Informações Pessoais
                </h2>

                {mensagemPerfil && (
                  <div className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-bold rounded-2xl px-4 py-3 mb-6">
                    {mensagemPerfil}
                  </div>
                )}

                <form
                  onSubmit={salvarPerfil}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      E-mail
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.DS_EMAIL}
                      className="w-full p-3 bg-slate-100 border border-slate-200 rounded-xl outline-none font-bold text-sm text-slate-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button
                      type="submit"
                      className="bg-primary text-bg-dark px-10 py-3 rounded-full font-black uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-all"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "enderecos" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-black uppercase tracking-widest border-b border-slate-200 pb-4">
                  Meus Endereços
                </h2>

                {carregandoDados && (
                  <p className="text-slate-400 font-bold text-sm">
                    Carregando...
                  </p>
                )}

                {!carregandoDados && enderecos.length === 0 && (
                  <p className="text-slate-400 font-bold text-sm">
                    Você ainda não tem endereços cadastrados. Adicione um na
                    hora de finalizar uma compra.
                  </p>
                )}

                {enderecos.map((e) => (
                  <div
                    key={e.CD_ENDERECO}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center gap-4"
                  >
                    <p className="text-sm font-bold text-text-main">
                      {e.NM_LOGRADOURO}, {e.NR_NUMERO} — {e.NM_BAIRRO},{" "}
                      {e.NM_CIDADE}/{e.DS_UF}
                      <br />
                      <span className="text-xs text-slate-400 font-medium">
                        CEP {e.NR_CEP}
                      </span>
                    </p>
                    <button
                      onClick={() => excluirEndereco(e.CD_ENDERECO)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        delete
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

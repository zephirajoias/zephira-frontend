"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api, ApiError } from "@/lib/api";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Endereco {
  CD_ENDERECO: number;
  NR_CEP: string;
  NM_LOGRADOURO: string;
  NR_NUMERO: string;
  NM_BAIRRO: string;
  NM_CIDADE: string;
  DS_UF: string;
}

export default function CarrinhoPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } =
    useCart();
  const { user, loading: carregandoAuth } = useAuth();
  const router = useRouter();

  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<number | null>(
    null,
  );
  const [mostrarNovoEndereco, setMostrarNovoEndereco] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState({
    NR_CEP: "",
    NM_LOGRADOURO: "",
    NR_NUMERO: "",
    NM_BAIRRO: "",
    NM_CIDADE: "",
    DS_UF: "",
  });
  const [erro, setErro] = useState<string | null>(null);
  const [finalizando, setFinalizando] = useState(false);

  useEffect(() => {
    if (!user) return;

    api
      .get<Endereco[]>("/loja/enderecos")
      .then((lista) => {
        setEnderecos(lista);
        if (lista.length > 0) setEnderecoSelecionado(lista[0].CD_ENDERECO);
        else setMostrarNovoEndereco(true);
      })
      .catch(() => {});
  }, [user]);

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  const salvarNovoEndereco = async () => {
    setErro(null);
    try {
      const endereco = await api.post<Endereco>(
        "/loja/enderecos",
        novoEndereco,
      );
      setEnderecos((prev) => [endereco, ...prev]);
      setEnderecoSelecionado(endereco.CD_ENDERECO);
      setMostrarNovoEndereco(false);
    } catch (err) {
      setErro(
        err instanceof ApiError
          ? err.body?.message || "Não foi possível salvar o endereço."
          : "Não foi possível salvar o endereço.",
      );
    }
  };

  const finalizarCompra = async () => {
    if (!enderecoSelecionado) {
      setErro("Selecione ou cadastre um endereço de entrega.");
      return;
    }

    setErro(null);
    setFinalizando(true);

    try {
      const pedido = await api.post<{ CD_PEDIDO: number }>(
        "/loja/pedidos/checkout",
        {
          CD_ENDERECO: enderecoSelecionado,
          itens: items.map((i) => ({
            CD_VARIACAO: i.CD_VARIACAO,
            QT_ITEM: i.quantidade,
          })),
        },
      );

      clearCart();
      router.push(`/minha-conta?pedido=${pedido.CD_PEDIDO}`);
    } catch (err) {
      setErro(
        err instanceof ApiError
          ? err.body?.message || "Não foi possível finalizar o pedido."
          : "Não foi possível finalizar o pedido.",
      );
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex flex-col font-display">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-text-main mb-10 text-center lg:text-left">
          Meu Carrinho <span className="text-primary">({totalItems})</span>
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm"
          >
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">
              shopping_bag
            </span>
            <p className="text-slate-500 font-bold mb-6">
              Seu carrinho está vazio.
            </p>
            <Link
              href="/"
              className="bg-primary text-bg-dark px-10 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:bg-opacity-80"
            >
              Continuar Comprando
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LISTA DE PRODUTOS */}
            <div className="flex-1 space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                <motion.div
                  key={item.CD_VARIACAO}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 sm:gap-6 overflow-hidden"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-text-main uppercase tracking-wider truncate mb-1">
                      {item.nome}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Tamanho: {item.tamanho}
                    </p>
                    <p className="text-primary font-black text-sm sm:text-base mb-3">
                      {formatMoney(item.preco)}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-slate-200 rounded-full px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.CD_VARIACAO,
                              item.quantidade - 1,
                            )
                          }
                          className="p-1 hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">
                            remove
                          </span>
                        </button>
                        <span className="w-8 text-center text-xs font-black">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.CD_VARIACAO,
                              item.quantidade + 1,
                            )
                          }
                          disabled={item.quantidade >= item.estoqueDisponivel}
                          className="p-1 hover:text-primary disabled:opacity-30"
                        >
                          <span className="material-symbols-outlined text-sm">
                            add
                          </span>
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.CD_VARIACAO)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* RESUMO DO PEDIDO */}
            <aside className="w-full lg:w-96 space-y-6">
              {!carregandoAuth && !user && (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <p className="text-sm font-bold text-slate-500 mb-4">
                    Entre na sua conta para finalizar a compra.
                  </p>
                  <Link
                    href="/login"
                    className="bg-bg-dark text-primary px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs inline-block"
                  >
                    Entrar / Cadastrar
                  </Link>
                </div>
              )}

              {user && (
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <h2 className="text-xs font-black uppercase tracking-widest mb-4">
                    Endereço de Entrega
                  </h2>

                  {enderecos.length > 0 && !mostrarNovoEndereco && (
                    <div className="space-y-2 mb-4">
                      {enderecos.map((e) => (
                        <label
                          key={e.CD_ENDERECO}
                          className={`flex items-start gap-3 p-3 rounded-2xl border-2 cursor-pointer text-xs font-medium ${
                            enderecoSelecionado === e.CD_ENDERECO
                              ? "border-primary bg-primary/5"
                              : "border-slate-100"
                          }`}
                        >
                          <input
                            type="radio"
                            className="mt-1 accent-primary"
                            checked={enderecoSelecionado === e.CD_ENDERECO}
                            onChange={() =>
                              setEnderecoSelecionado(e.CD_ENDERECO)
                            }
                          />
                          <span>
                            {e.NM_LOGRADOURO}, {e.NR_NUMERO} — {e.NM_BAIRRO},{" "}
                            {e.NM_CIDADE}/{e.DS_UF}
                          </span>
                        </label>
                      ))}
                      <button
                        onClick={() => setMostrarNovoEndereco(true)}
                        className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                      >
                        + Usar outro endereço
                      </button>
                    </div>
                  )}

                  {mostrarNovoEndereco && (
                    <div className="space-y-2">
                      <input
                        placeholder="CEP"
                        value={novoEndereco.NR_CEP}
                        onChange={(e) =>
                          setNovoEndereco({
                            ...novoEndereco,
                            NR_CEP: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                      />
                      <input
                        placeholder="Logradouro"
                        value={novoEndereco.NM_LOGRADOURO}
                        onChange={(e) =>
                          setNovoEndereco({
                            ...novoEndereco,
                            NM_LOGRADOURO: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                      />
                      <input
                        placeholder="Número"
                        value={novoEndereco.NR_NUMERO}
                        onChange={(e) =>
                          setNovoEndereco({
                            ...novoEndereco,
                            NR_NUMERO: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                      />
                      <input
                        placeholder="Bairro"
                        value={novoEndereco.NM_BAIRRO}
                        onChange={(e) =>
                          setNovoEndereco({
                            ...novoEndereco,
                            NM_BAIRRO: e.target.value,
                          })
                        }
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                      />
                      <div className="flex gap-2">
                        <input
                          placeholder="Cidade"
                          value={novoEndereco.NM_CIDADE}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              NM_CIDADE: e.target.value,
                            })
                          }
                          className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                        />
                        <input
                          placeholder="UF"
                          maxLength={2}
                          value={novoEndereco.DS_UF}
                          onChange={(e) =>
                            setNovoEndereco({
                              ...novoEndereco,
                              DS_UF: e.target.value,
                            })
                          }
                          className="w-16 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-primary uppercase"
                        />
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={salvarNovoEndereco}
                          className="flex-1 bg-bg-dark text-primary py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                          Salvar Endereço
                        </button>
                        {enderecos.length > 0 && (
                          <button
                            onClick={() => setMostrarNovoEndereco(false)}
                            className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-400"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-bg-dark text-white p-8 rounded-[2.5rem] shadow-xl">
                <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                  Resumo
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium opacity-70">
                    <span>Subtotal</span>
                    <span>{formatMoney(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-green-400">
                    <span>Frete</span>
                    <span className="uppercase font-black">Grátis</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatMoney(totalPrice)}
                    </span>
                  </div>
                </div>

                {erro && (
                  <div className="bg-red-500/20 border border-red-400/30 text-red-200 text-xs font-bold rounded-2xl px-4 py-3 mb-4">
                    {erro}
                  </div>
                )}

                <button
                  onClick={finalizarCompra}
                  disabled={!user || finalizando}
                  className="w-full bg-primary text-bg-dark py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {finalizando ? "Processando..." : "Finalizar Compra"}
                </button>

                <p className="text-[10px] text-center mt-6 opacity-40 uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xs">
                    lock
                  </span>{" "}
                  Ambiente Seguro
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

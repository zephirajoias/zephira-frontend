"use client";

import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

// --- Interfaces ---
interface ConfigData {
  NM_LOJA: string;
  DS_EMAIL_SUPORTE: string;
  NR_TELEFONE: string;
  SG_MOEDA: string;
  DS_FUSO_HORARIO: string;
  DS_URL_LOGO: string;
  DS_URL_FAVICON: string;
  // Remetente (SuperFrete)
  NM_REMETENTE: string;
  NR_CEP_REMETENTE: string;
  DS_ENDERECO_REMETENTE: string;
  NR_NUMERO_REMETENTE: string;
  NM_BAIRRO_REMETENTE: string;
  NM_CIDADE_REMETENTE: string;
  DS_UF_REMETENTE: string;
  // Pacote padrão (SuperFrete)
  NR_PACOTE_ALTURA: string;
  NR_PACOTE_LARGURA: string;
  NR_PACOTE_COMPRIMENTO: string;
  NR_PACOTE_PESO: string;
  // Barra de avisos da home (vazio = aviso desligado)
  VL_FRETE_GRATIS_MINIMO: string;
  NR_PARCELAS_SEM_JUROS: string;
  // Dados da empresa (rodapé / Fale Conosco)
  NM_RAZAO_SOCIAL: string;
  NR_CNPJ: string;
  DS_ENDERECO_LOJA: string;
  DS_INSTAGRAM: string;
  // Imagens da home e texto do rodapé (antes fixos no código da loja)
  // Banners do topo (carrossel) ficam fora do ConfigData: são geridos à
  // parte via /admin/configuracoes/banner-home (ver estado `banners`).
  DS_URL_FOTO_COMBINACAO_1: string;
  DS_URL_FOTO_COMBINACAO_2: string;
  DS_TEXTO_RODAPE: string;
}

const CONFIG_VAZIA: ConfigData = {
  NM_LOJA: "",
  DS_EMAIL_SUPORTE: "",
  NR_TELEFONE: "",
  SG_MOEDA: "BRL",
  DS_FUSO_HORARIO: "UTC-3",
  DS_URL_LOGO: "",
  DS_URL_FAVICON: "",
  NM_REMETENTE: "",
  NR_CEP_REMETENTE: "",
  DS_ENDERECO_REMETENTE: "",
  NR_NUMERO_REMETENTE: "",
  NM_BAIRRO_REMETENTE: "",
  NM_CIDADE_REMETENTE: "",
  DS_UF_REMETENTE: "",
  NR_PACOTE_ALTURA: "4",
  NR_PACOTE_LARGURA: "12",
  NR_PACOTE_COMPRIMENTO: "17",
  NR_PACOTE_PESO: "0.3",
  VL_FRETE_GRATIS_MINIMO: "",
  NR_PARCELAS_SEM_JUROS: "",
  NM_RAZAO_SOCIAL: "",
  NR_CNPJ: "",
  DS_ENDERECO_LOJA: "",
  DS_INSTAGRAM: "",
  DS_URL_FOTO_COMBINACAO_1: "",
  DS_URL_FOTO_COMBINACAO_2: "",
  DS_TEXTO_RODAPE: "",
};

export default function SettingsGeralPage() {
  const [formData, setFormData] = useState<ConfigData>(CONFIG_VAZIA);

  const [initialData, setInitialData] = useState<ConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const combinacao1InputRef = useRef<HTMLInputElement>(null);
  const combinacao2InputRef = useRef<HTMLInputElement>(null);
  const novoBannerInputRef = useRef<HTMLInputElement>(null);
  const [enviandoLogo, setEnviandoLogo] = useState(false);
  const [enviandoFavicon, setEnviandoFavicon] = useState(false);
  const [enviandoCombinacao1, setEnviandoCombinacao1] = useState(false);
  const [enviandoCombinacao2, setEnviandoCombinacao2] = useState(false);

  // Carrossel de banners do topo — gerido à parte do resto do formulário
  // (cada ação chama a API na hora, não espera o "Salvar" geral).
  const [banners, setBanners] = useState<{ url: string; link?: string | null }[]>([]);
  const [novoBannerFile, setNovoBannerFile] = useState<File | null>(null);
  const [novoBannerPreview, setNovoBannerPreview] = useState<string | null>(null);
  const [novoBannerLink, setNovoBannerLink] = useState("");
  const [enviandoNovoBanner, setEnviandoNovoBanner] = useState(false);
  const [removendoBannerIndice, setRemovendoBannerIndice] = useState<number | null>(null);

  // Busca as configurações
  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/admin/configuracoes/gerais");
      // Se a API retornar um array, pegamos o primeiro. Se objeto, direto.
      const config = Array.isArray(data) ? data[0] : data;

      const normalized: ConfigData = {
        NM_LOJA: config?.NM_LOJA || "",
        DS_EMAIL_SUPORTE: config?.DS_EMAIL_SUPORTE || "",
        NR_TELEFONE: config?.NR_TELEFONE || "",
        SG_MOEDA: config?.SG_MOEDA || "BRL",
        DS_FUSO_HORARIO: config?.DS_FUSO_HORARIO || "UTC-3",
        DS_URL_LOGO: config?.DS_URL_LOGO || "",
        DS_URL_FAVICON: config?.DS_URL_FAVICON || "",
        NM_REMETENTE: config?.NM_REMETENTE || "",
        NR_CEP_REMETENTE: config?.NR_CEP_REMETENTE || "",
        DS_ENDERECO_REMETENTE: config?.DS_ENDERECO_REMETENTE || "",
        NR_NUMERO_REMETENTE: config?.NR_NUMERO_REMETENTE || "",
        NM_BAIRRO_REMETENTE: config?.NM_BAIRRO_REMETENTE || "",
        NM_CIDADE_REMETENTE: config?.NM_CIDADE_REMETENTE || "",
        DS_UF_REMETENTE: config?.DS_UF_REMETENTE || "",
        NR_PACOTE_ALTURA: config?.NR_PACOTE_ALTURA?.toString() || "4",
        NR_PACOTE_LARGURA: config?.NR_PACOTE_LARGURA?.toString() || "12",
        NR_PACOTE_COMPRIMENTO:
          config?.NR_PACOTE_COMPRIMENTO?.toString() || "17",
        NR_PACOTE_PESO: config?.NR_PACOTE_PESO?.toString() || "0.3",
        VL_FRETE_GRATIS_MINIMO:
          config?.VL_FRETE_GRATIS_MINIMO?.toString() || "",
        NR_PARCELAS_SEM_JUROS:
          config?.NR_PARCELAS_SEM_JUROS?.toString() || "",
        NM_RAZAO_SOCIAL: config?.NM_RAZAO_SOCIAL || "",
        NR_CNPJ: config?.NR_CNPJ || "",
        DS_ENDERECO_LOJA: config?.DS_ENDERECO_LOJA || "",
        DS_INSTAGRAM: config?.DS_INSTAGRAM || "",
        DS_URL_FOTO_COMBINACAO_1: config?.DS_URL_FOTO_COMBINACAO_1 || "",
        DS_URL_FOTO_COMBINACAO_2: config?.DS_URL_FOTO_COMBINACAO_2 || "",
        DS_TEXTO_RODAPE: config?.DS_TEXTO_RODAPE || "",
      };

      setFormData(normalized);
      setInitialData(normalized);
    } catch (error) {
      toast.error("Erro ao carregar dados do servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBanners = async () => {
    try {
      const { data } = await api.get("/admin/configuracoes/banner-home");
      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      // Migração pendente ou erro pontual: deixa a lista vazia em vez de
      // travar a tela inteira (o resto do formulário continua normal).
      setBanners([]);
    }
  };

  useEffect(() => {
    fetchConfig();
    fetchBanners();
  }, []);

  // Verifica se houve alteração (comparação profunda simples)
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.put("/admin/configuracoes/gerais", formData);
      setInitialData(formData);
      if (data?._migracaoPendente) {
        toast.warn(
          "Salvo! Frete grátis, parcelas e dados da empresa ainda não (uma atualização do sistema precisa rodar primeiro — já avisei o Gustavo).",
        );
      } else {
        toast.success("Configurações atualizadas!");
      }
    } catch (error) {
      toast.error("Erro ao salvar alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadImagemMarca = async (
    tipo: "logo" | "favicon",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // permite selecionar o mesmo arquivo de novo depois
    if (!file) return;

    const setEnviando = tipo === "logo" ? setEnviandoLogo : setEnviandoFavicon;
    const campo = tipo === "logo" ? "DS_URL_LOGO" : "DS_URL_FAVICON";

    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      // A instância `api` não fixa Content-Type (ver src/lib/api.ts), mas
      // ainda assim é preciso remover explicitamente o padrão herdado
      // nessa chamada pra deixar o axios/navegador montar o multipart com
      // boundary sozinho (mesmo cuidado do upload de imagem de produto).
      const { data } = await api.post<{ url: string }>(
        `/admin/configuracoes/${tipo}`,
        fd,
        { headers: { "Content-Type": undefined } },
      );

      setFormData((prev) => ({ ...prev, [campo]: data.url }));
      setInitialData((prev) => (prev ? { ...prev, [campo]: data.url } : prev));
      toast.success(
        tipo === "logo" ? "Logo atualizada!" : "Favicon atualizado!",
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          `Erro ao enviar o ${tipo === "logo" ? "logo" : "favicon"}.`,
      );
    } finally {
      setEnviando(false);
    }
  };

  const IMAGEM_HOME = {
    combinacao_1: {
      rota: "combinacao-1",
      campo: "DS_URL_FOTO_COMBINACAO_1",
      setEnviando: setEnviandoCombinacao1,
      sucesso: "Foto atualizada!",
    },
    combinacao_2: {
      rota: "combinacao-2",
      campo: "DS_URL_FOTO_COMBINACAO_2",
      setEnviando: setEnviandoCombinacao2,
      sucesso: "Foto atualizada!",
    },
  } as const;

  const handleUploadImagemHome = async (
    tipo: keyof typeof IMAGEM_HOME,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const { rota, campo, setEnviando, sucesso } = IMAGEM_HOME[tipo];

    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const { data } = await api.post<{ url: string }>(
        `/admin/configuracoes/${rota}`,
        fd,
        { headers: { "Content-Type": undefined } },
      );

      setFormData((prev) => ({ ...prev, [campo]: data.url }));
      setInitialData((prev) => (prev ? { ...prev, [campo]: data.url } : prev));
      toast.success(sucesso);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao enviar a imagem.",
      );
    } finally {
      setEnviando(false);
    }
  };

  // Seleciona uma foto pro carrossel: fica "em preparo" (preview + campo de
  // link) até confirmar — só então sobe pra API, porque o link precisa ir
  // junto do arquivo no mesmo POST.
  const handleSelecionarBanner = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setNovoBannerFile(file);
    setNovoBannerPreview(URL.createObjectURL(file));
    setNovoBannerLink("");
  };

  const handleCancelarNovoBanner = () => {
    if (novoBannerPreview) URL.revokeObjectURL(novoBannerPreview);
    setNovoBannerFile(null);
    setNovoBannerPreview(null);
    setNovoBannerLink("");
  };

  const handleConfirmarNovoBanner = async () => {
    if (!novoBannerFile) return;
    setEnviandoNovoBanner(true);
    try {
      const fd = new FormData();
      fd.append("file", novoBannerFile);
      fd.append("link", novoBannerLink.trim());

      const { data } = await api.post(
        "/admin/configuracoes/banner-home",
        fd,
        { headers: { "Content-Type": undefined } },
      );
      setBanners(Array.isArray(data) ? data : []);
      handleCancelarNovoBanner();
      toast.success("Banner adicionado!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao adicionar o banner.",
      );
    } finally {
      setEnviandoNovoBanner(false);
    }
  };

  const handleRemoverBanner = async (indice: number) => {
    setRemovendoBannerIndice(indice);
    try {
      const { data } = await api.delete(
        `/admin/configuracoes/banner-home/${indice}`,
      );
      setBanners(Array.isArray(data) ? data : []);
      toast.success("Banner removido!");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao remover o banner.",
      );
    } finally {
      setRemovendoBannerIndice(null);
    }
  };

  const handleMoverBanner = async (de: number, para: number) => {
    if (para < 0 || para >= banners.length) return;
    try {
      const { data } = await api.put("/admin/configuracoes/banner-home/mover", {
        de,
        para,
      });
      setBanners(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Erro ao reordenar os banners.",
      );
    }
  };

  const handlePhoneChange = (val: string) => {
    let numbers = val.replace(/\D/g, "");
    if (numbers.length > 11) numbers = numbers.slice(0, 11);

    const masked = numbers
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");

    setFormData({ ...formData, NR_TELEFONE: masked });
  };

  if (isLoading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-slate-400">
        Sincronizando preferências...
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 pb-16">
      {/* 1. Top Header bar */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Configurações Gerais
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Defina a identidade, moeda e canais de contato da Zephira.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {isDirty && (
            <button
              onClick={() => setFormData(initialData!)}
              className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all"
            >
              Descartar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className={cn(
              "flex-1 md:flex-none px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-lg",
              isDirty
                ? "bg-[#11d4c4] text-[#0a1615] shadow-[#11d4c4]/20 hover:scale-[1.02] active:scale-95"
                : "bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed shadow-none",
            )}
          >
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* --- COLUNA ESQUERDA: Formulários --- */}
        <div className="lg:col-span-8 space-y-8">
          {/* Sessão: Identidade */}
          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <h3 className="font-black text-lg">Perfil da Loja</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nome Comercial da Loja
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                  value={formData.NM_LOJA}
                  onChange={(e) =>
                    setFormData({ ...formData, NM_LOJA: e.target.value })
                  }
                  placeholder="Ex: Zephira Joias"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    E-mail de Suporte
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#11d4c4]">
                      mail
                    </span>
                    <input
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                      value={formData.DS_EMAIL_SUPORTE}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          DS_EMAIL_SUPORTE: e.target.value,
                        })
                      }
                      placeholder="ajuda@zephira.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Telefone / WhatsApp
                  </label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-[#11d4c4]">
                      call
                    </span>
                    <input
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                      value={formData.NR_TELEFONE}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sessão: Regional */}
          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <h3 className="font-black text-lg">Localização & Moeda</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Moeda Padrão
                </label>
                <select
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 outline-none cursor-pointer font-bold"
                  value={formData.SG_MOEDA}
                  onChange={(e) =>
                    setFormData({ ...formData, SG_MOEDA: e.target.value })
                  }
                >
                  <option value="BRL">BRL - Real Brasileiro (R$)</option>
                  <option value="USD">USD - Dólar Americano ($)</option>
                  <option value="EUR">EUR - Euro (€)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Fuso Horário
                </label>
                <select
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 outline-none cursor-pointer font-bold"
                  value={formData.DS_FUSO_HORARIO}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      DS_FUSO_HORARIO: e.target.value,
                    })
                  }
                >
                  <option value="UTC-3">São Paulo (UTC-3)</option>
                  <option value="UTC-4">Manaus (UTC-4)</option>
                  <option value="UTC-5">Nova York (UTC-5)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Sessão: Remetente para Envio (SuperFrete) */}
          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <h3 className="font-black text-lg">Endereço de Remetente</h3>
              <p className="text-xs text-slate-500 mt-1">
                Usado como origem no cálculo de frete e na etiqueta gerada
                pelo SuperFrete.
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Nome do Remetente
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                  value={formData.NM_REMETENTE}
                  onChange={(e) =>
                    setFormData({ ...formData, NM_REMETENTE: e.target.value })
                  }
                  placeholder="Ex: Zephira Joias"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    CEP
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                    value={formData.NR_CEP_REMETENTE}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        NR_CEP_REMETENTE: e.target.value,
                      })
                    }
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Endereço
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                    value={formData.DS_ENDERECO_REMETENTE}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        DS_ENDERECO_REMETENTE: e.target.value,
                      })
                    }
                    placeholder="Rua, Avenida..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Número
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                    value={formData.NR_NUMERO_REMETENTE}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        NR_NUMERO_REMETENTE: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Bairro
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                    value={formData.NM_BAIRRO_REMETENTE}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        NM_BAIRRO_REMETENTE: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Cidade
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                    value={formData.NM_CIDADE_REMETENTE}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        NM_CIDADE_REMETENTE: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    UF
                  </label>
                  <input
                    maxLength={2}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none uppercase"
                    value={formData.DS_UF_REMETENTE}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        DS_UF_REMETENTE: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Sessão: Pacote Padrão (SuperFrete) */}
          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <h3 className="font-black text-lg">Pacote Padrão</h3>
              <p className="text-xs text-slate-500 mt-1">
                Dimensões e peso usados para calcular o frete de todo pedido,
                até que cada produto tenha seu próprio peso/dimensão.
              </p>
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                  value={formData.NR_PACOTE_ALTURA}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      NR_PACOTE_ALTURA: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Largura (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                  value={formData.NR_PACOTE_LARGURA}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      NR_PACOTE_LARGURA: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Comprimento (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                  value={formData.NR_PACOTE_COMPRIMENTO}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      NR_PACOTE_COMPRIMENTO: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                  value={formData.NR_PACOTE_PESO}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      NR_PACOTE_PESO: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </section>

          {/* Sessão: Barra de avisos da home */}
          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <h3 className="font-black text-lg">Barra de Avisos da Home</h3>
              <p className="text-xs text-slate-500 mt-1">
                A faixa colorida no topo da loja. Deixe um campo vazio pra
                não mostrar aquele aviso.
              </p>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Frete grátis a partir de (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                  value={formData.VL_FRETE_GRATIS_MINIMO}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      VL_FRETE_GRATIS_MINIMO: e.target.value,
                    })
                  }
                  placeholder="Deixe vazio pra não oferecer"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Parcelas sem juros (até quantas vezes)
                </label>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="24"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                  value={formData.NR_PARCELAS_SEM_JUROS}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      NR_PARCELAS_SEM_JUROS: e.target.value,
                    })
                  }
                  placeholder="Ex: 3"
                />
                <p className="text-[10px] text-slate-400">
                  Só prometa o número de parcelas que o Mercado Pago realmente
                  oferece sem juros na sua conta.
                </p>
              </div>
            </div>
          </section>

          {/* Sessão: Dados da empresa */}
          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <h3 className="font-black text-lg">Dados da Empresa</h3>
              <p className="text-xs text-slate-500 mt-1">
                Aparecem no rodapé e na página Fale Conosco da loja (o
                Decreto 7.962/2013 exige razão social, CNPJ e endereço numa
                loja online).
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Razão Social
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                    value={formData.NM_RAZAO_SOCIAL}
                    onChange={(e) =>
                      setFormData({ ...formData, NM_RAZAO_SOCIAL: e.target.value })
                    }
                    placeholder="Ex: Zephira Comércio de Joias LTDA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    CNPJ
                  </label>
                  <input
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-bold"
                    value={formData.NR_CNPJ}
                    onChange={(e) =>
                      setFormData({ ...formData, NR_CNPJ: e.target.value })
                    }
                    placeholder="00.000.000/0001-00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Endereço da loja
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                  value={formData.DS_ENDERECO_LOJA}
                  onChange={(e) =>
                    setFormData({ ...formData, DS_ENDERECO_LOJA: e.target.value })
                  }
                  placeholder="Rua, número, bairro, cidade - UF, CEP"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Instagram
                </label>
                <input
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                  value={formData.DS_INSTAGRAM}
                  onChange={(e) =>
                    setFormData({ ...formData, DS_INSTAGRAM: e.target.value })
                  }
                  placeholder="@zephirajoias"
                />
              </div>
            </div>
          </section>

          {/* Sessão: Texto do rodapé */}
          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
              <h3 className="font-black text-lg">Texto do Rodapé</h3>
              <p className="text-xs text-slate-500 mt-1">
                Aparece embaixo da logo, no rodapé da loja. Em branco, a loja
                mostra o texto padrão.
              </p>
            </div>
            <div className="p-8">
              <textarea
                className="w-full h-24 px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none resize-none font-medium"
                value={formData.DS_TEXTO_RODAPE}
                maxLength={300}
                onChange={(e) =>
                  setFormData({ ...formData, DS_TEXTO_RODAPE: e.target.value })
                }
                placeholder="A beleza atemporal da prata 925 em joias feitas para realçar o seu brilho único."
              />
            </div>
          </section>
        </div>

        {/* --- COLUNA DIREITA: Assets & Dicas --- */}
        <aside className="lg:col-span-4 space-y-8">
          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8">
            <h3 className="font-black text-lg mb-6">Assets da Marca</h3>

            <div className="space-y-8">
              {/* Logo Upload */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-slate-400">
                    Logo Principal
                  </span>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={enviandoLogo}
                    className="text-[#11d4c4] text-[10px] font-black uppercase hover:underline disabled:opacity-50"
                  >
                    {enviandoLogo ? "Enviando..." : "Alterar"}
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadImagemMarca("logo", e)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={enviandoLogo}
                  className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/2 group hover:border-[#11d4c4]/40 transition-all cursor-pointer overflow-hidden"
                >
                  {formData.DS_URL_LOGO ? (
                    <img
                      src={formData.DS_URL_LOGO}
                      alt="Logo da loja"
                      className="h-full w-full object-contain p-4"
                    />
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:scale-110 transition-transform">
                        image
                      </span>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">
                        PNG (Max 2MB)
                      </p>
                    </>
                  )}
                </button>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-slate-400">
                    Favicon
                  </span>
                  <button
                    type="button"
                    onClick={() => faviconInputRef.current?.click()}
                    disabled={enviandoFavicon}
                    className="text-[#11d4c4] text-[10px] font-black uppercase hover:underline disabled:opacity-50"
                  >
                    {enviandoFavicon ? "Enviando..." : "Alterar"}
                  </button>
                  <input
                    ref={faviconInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUploadImagemMarca("favicon", e)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={enviandoFavicon}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5 w-full hover:border-[#11d4c4]/40 transition-all"
                >
                  <div className="size-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-slate-100 dark:border-white/10 overflow-hidden shrink-0">
                    {formData.DS_URL_FAVICON ? (
                      <img
                        src={formData.DS_URL_FAVICON}
                        alt="Favicon"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400">
                        public
                      </span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-slate-500">
                      Ícone do Navegador
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">
                      Recomendado: 32x32px
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8">
            <h3 className="font-black text-lg mb-1">Imagens da Home</h3>
            <p className="text-xs text-slate-500 mb-6">
              Carrossel do banner do topo (cada foto pode ter um link
              próprio) e as 2 fotos de "Combinações Perfeitas". Em branco,
              a loja mostra uma foto de reserva.
            </p>

            <div className="space-y-8">
              {/* Carrossel do banner do topo */}
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-slate-400">
                  Banner do Topo (carrossel)
                </span>

                {banners.length > 0 && (
                  <div className="space-y-3">
                    {banners.map((banner, i) => (
                      <div
                        key={banner.url + i}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5"
                      >
                        <img
                          src={banner.url}
                          alt={`Banner ${i + 1}`}
                          className="w-20 h-12 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black uppercase text-slate-400">
                            Banner {i + 1}
                          </p>
                          <p className="text-xs font-bold truncate">
                            {banner.link || (
                              <span className="text-slate-400 font-medium">
                                Sem link
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoverBanner(i, i - 1)}
                            disabled={i === 0}
                            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-20 transition-colors"
                            title="Mover pra cima"
                          >
                            <span className="material-symbols-outlined text-base">
                              arrow_upward
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoverBanner(i, i + 1)}
                            disabled={i === banners.length - 1}
                            className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-20 transition-colors"
                            title="Mover pra baixo"
                          >
                            <span className="material-symbols-outlined text-base">
                              arrow_downward
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoverBanner(i)}
                            disabled={removendoBannerIndice === i}
                            className="size-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-40 transition-colors"
                            title="Remover"
                          >
                            <span className="material-symbols-outlined text-base">
                              {removendoBannerIndice === i
                                ? "hourglass_empty"
                                : "delete"}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {novoBannerFile ? (
                  <div className="p-4 rounded-2xl border border-[#11d4c4]/30 bg-[#11d4c4]/5 space-y-3">
                    <img
                      src={novoBannerPreview!}
                      alt="Prévia do novo banner"
                      className="w-full h-32 object-cover rounded-xl"
                    />
                    <input
                      className="w-full h-11 px-4 rounded-xl bg-white dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none text-sm"
                      value={novoBannerLink}
                      onChange={(e) => setNovoBannerLink(e.target.value)}
                      placeholder="Link ao clicar (opcional): /categoria/aneis"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmarNovoBanner}
                        disabled={enviandoNovoBanner}
                        className="flex-1 h-10 rounded-xl bg-[#11d4c4] text-white font-black text-xs uppercase disabled:opacity-50 transition-all"
                      >
                        {enviandoNovoBanner ? "Enviando..." : "Adicionar"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelarNovoBanner}
                        disabled={enviandoNovoBanner}
                        className="h-10 px-4 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-black text-xs uppercase disabled:opacity-50 transition-all"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => novoBannerInputRef.current?.click()}
                    className="w-full h-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/2 group hover:border-[#11d4c4]/40 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-2xl text-slate-300 group-hover:scale-110 transition-transform">
                      add_photo_alternate
                    </span>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                      Adicionar banner (recomendado 2000px de largura)
                    </p>
                  </button>
                )}
                <input
                  ref={novoBannerInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSelecionarBanner}
                />
              </div>

              {/* Combinações Perfeitas: 2 fotos */}
              <div className="space-y-4">
                <span className="text-xs font-black uppercase text-slate-400">
                  Combinações Perfeitas
                </span>
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      ["combinacao_1", combinacao1InputRef, enviandoCombinacao1, formData.DS_URL_FOTO_COMBINACAO_1],
                      ["combinacao_2", combinacao2InputRef, enviandoCombinacao2, formData.DS_URL_FOTO_COMBINACAO_2],
                    ] as const satisfies readonly [
                      keyof typeof IMAGEM_HOME,
                      React.RefObject<HTMLInputElement | null>,
                      boolean,
                      string,
                    ][]
                  ).map(([tipo, ref, enviando, url]) => (
                    <button
                      key={tipo}
                      type="button"
                      onClick={() => ref.current?.click()}
                      disabled={enviando}
                      className="aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/2 group hover:border-[#11d4c4]/40 transition-all cursor-pointer overflow-hidden relative"
                    >
                      <input
                        ref={ref}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadImagemHome(tipo, e)}
                      />
                      {url ? (
                        <img
                          src={url}
                          alt="Foto de combinações"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-2xl text-slate-300 group-hover:scale-110 transition-transform">
                          image
                        </span>
                      )}
                      <span className="absolute bottom-2 inset-x-2 text-center text-[9px] font-black uppercase bg-black/60 text-white rounded-lg py-1">
                        {enviando ? "Enviando..." : "Alterar"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Dica Sidebar */}
          <div className="bg-[#11d4c4]/5 rounded-3xl p-6 border border-[#11d4c4]/20 relative overflow-hidden group">
            <div className="flex gap-3 relative z-10">
              <span className="material-symbols-outlined text-[#11d4c4]">
                lightbulb
              </span>
              <div>
                <h4 className="font-black text-[#11d4c4] text-sm uppercase">
                  Dica de Identidade
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  O nome da loja e o e-mail de suporte serão exibidos nos
                  recibos de compra e e-mails de transação dos clientes.
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[#11d4c4]/5 text-8xl group-hover:rotate-12 transition-transform">
              auto_awesome
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

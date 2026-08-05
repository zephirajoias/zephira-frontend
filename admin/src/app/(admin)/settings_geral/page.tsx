"use client";

import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// --- Interfaces ---
interface ConfigData {
  NM_LOJA: string;
  DS_EMAIL_SUPORTE: string;
  NR_TELEFONE: string;
  SG_MOEDA: string;
  DS_FUSO_HORARIO: string;
  DS_LOGO: string;
  DS_FAVICON: string;
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
}

const CONFIG_VAZIA: ConfigData = {
  NM_LOJA: "",
  DS_EMAIL_SUPORTE: "",
  NR_TELEFONE: "",
  SG_MOEDA: "BRL",
  DS_FUSO_HORARIO: "UTC-3",
  DS_LOGO: "",
  DS_FAVICON: "",
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
};

export default function SettingsGeralPage() {
  const [formData, setFormData] = useState<ConfigData>(CONFIG_VAZIA);

  const [initialData, setInitialData] = useState<ConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        DS_LOGO: config?.DS_LOGO || "",
        DS_FAVICON: config?.DS_FAVICON || "",
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
      };

      setFormData(normalized);
      setInitialData(normalized);
    } catch (error) {
      toast.error("Erro ao carregar dados do servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Verifica se houve alteração (comparação profunda simples)
  const isDirty = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(initialData);
  }, [formData, initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/admin/configuracoes/gerais", formData);
      setInitialData(formData);
      toast.success("Configurações atualizadas!");
    } catch (error) {
      toast.error("Erro ao salvar alterações.");
    } finally {
      setIsSaving(false);
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
                  <button className="text-[#11d4c4] text-[10px] font-black uppercase hover:underline">
                    Alterar
                  </button>
                </div>
                <div className="h-32 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/2 group hover:border-[#11d4c4]/40 transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-3xl text-slate-300 group-hover:scale-110 transition-transform">
                    image
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">
                    PNG ou SVG (Max 2MB)
                  </p>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-slate-400">
                    Favicon
                  </span>
                  <button className="text-[#11d4c4] text-[10px] font-black uppercase hover:underline">
                    Alterar
                  </button>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-white/5">
                  <div className="size-12 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm border border-slate-100 dark:border-white/10">
                    <span className="material-symbols-outlined text-slate-400">
                      public
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-500">
                      Ícone do Navegador
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">
                      Recomendado: 32x32px
                    </p>
                  </div>
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

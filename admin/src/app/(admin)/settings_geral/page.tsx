"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface configuracoes {
  NM_LOJA: string;
  DS_EMAIL_SUPORTE: string;
  NR_TELEFONE: string;
  SG_MOEDA: string;
  DS_FUSO_HORARIO: string;
  DS_LOGO: string;
  DS_FAVICON: string;
}

export default function SettingsGeralPage() {
  // States para os campos
  const [config, setConfig] = useState<configuracoes[]>([]);
  const [storeName, setStoreName] = useState("Lumiere Fine Jewelry");
  const [supportEmail, setSupportEmail] = useState("concierge@lumiere.com");
  const [contactPhone, setContactPhone] = useState("+1 (555) 000-1234");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC-5");

  const handleConfig = async () => {
    try {
      const response = await api.get("/admin/configuracoes/gerais");

      const data = response.data;
      setConfig(data);

      setStoreName(data.NM_LOJA ?? "");
      setSupportEmail(data.DS_EMAIL_SUPORTE ?? "");
      setContactPhone(data.NR_TELEFONE ?? "");
      setCurrency(data.SG_MOEDA ?? "BRL");
      setTimezone(data.DS_FUSO_HORARIO ?? "UTC-3");
    } catch (error) {
      console.error("Erro ao buscar configurações", error);
      toast.error("Erro ao carregar configurações");
    }
  };

  const handleSave = async () => {
    try {
      const response = await api.put("/admin/configuracoes/gerais", {
        NM_LOJA: storeName,
        DS_EMAIL_SUPORTE: supportEmail,
        NR_TELEFONE: contactPhone,
        SG_MOEDA: currency,
        DS_FUSO_HORARIO: timezone,
      });
      console.log(response.data);
      if (response.status === 200) {
        toast.success("Configurações salvas com sucesso!");
      } else {
        toast.error("Erro ao salvar as configurações.");
      }
    } catch (error) {
      console.error("Erro ao salvar as configurações", error);
    }
  };

  const handleDiscard = () => {
    // Lógica para resetar ou voltar
    toast.info("Alterações descartadas.");
  };

  const formatPhone = (value: string) => {
    // remove tudo que não for número
    let numbers = value.replace(/\D/g, "");

    // garante o código do país
    if (!numbers.startsWith("55")) {
      numbers = "55" + numbers;
    }

    // limita o tamanho: 55 + DDD + 9 dígitos
    numbers = numbers.slice(0, 13);

    // aplica a máscara
    return numbers
      .replace(/^(\d{2})(\d{2})(\d{5})(\d{0,4})/, "+$1 ($2) $3-$4")
      .replace(/-$/, "");
  };

  useEffect(() => {
    const load = async () => {
      handleConfig();
    };

    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-10">
      {/* 1. Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--zephira-text)] dark:text-white">
            Configurações Gerais
          </h1>
          <p className="text-[var(--zephira-muted)] text-sm font-medium">
            Atualize a identidade da loja, configurações regionais e assets da
            marca.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all active:scale-95"
          >
            Salvar Alterações
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUNA ESQUERDA (PRINCIPAL) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Identidade da Loja */}
          <section className="bg-white dark:bg-[#102220] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Identidade da Loja
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Nome da Loja
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Digite o nome da loja"
                  className="w-full rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] text-sm transition-all dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Email de Suporte
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-[20px]">
                      mail
                    </span>
                    <input
                      type="email"
                      value={supportEmail}
                      onChange={(e) => setSupportEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full pl-10 pr-4 rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 py-3 outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] text-sm transition-all dark:text-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Telefone de Contato
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-3 text-gray-400 text-[20px]">
                      call
                    </span>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) =>
                        setContactPhone(formatPhone(e.target.value))
                      }
                      placeholder="+55 (00) 00000-0000"
                      className="w-full pl-10 pr-4 rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 py-3 outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] text-sm transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Configurações Regionais */}
          <section className="bg-white dark:bg-[#102220] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Configurações Regionais
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Moeda Principal
                </label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full appearance-none rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] text-sm transition-all cursor-pointer dark:text-white"
                  >
                    <option value="BRL">BRL - Real Brasileiro (R$)</option>
                    <option value="USD">USD - Dólar Americano ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Fuso Horário
                </label>
                <div className="relative">
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full appearance-none rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] text-sm transition-all cursor-pointer dark:text-white"
                  >
                    <option value="UTC-3">Horário de Brasília (UTC-3)</option>
                    <option value="UTC-4">Horário da Amazônia (UTC-4)</option>
                    <option value="UTC-5">Eastern Standard Time (UTC-5)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">
                    expand_more
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- COLUNA DIREITA (ASSETS) --- */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-[#102220] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Assets da Marca
              </h2>
            </div>
            <div className="p-6 space-y-8">
              {/* Logo Upload */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Logo Principal
                  </label>
                  <button className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline">
                    Substituir
                  </button>
                </div>
                <div className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 transition-all cursor-pointer group">
                  <div className="size-20 bg-white dark:bg-white/5 rounded-lg flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform border border-gray-100 dark:border-white/5">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-500">
                      image
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    PNG ou SVG até 2MB
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    Recomendado: 400x120px
                  </p>
                </div>
              </div>

              {/* Favicon Upload */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Favicon
                  </label>
                  <button className="text-xs font-bold text-blue-500 hover:text-blue-600 hover:underline">
                    Substituir
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-16 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-black/20 shrink-0">
                    <span className="material-symbols-outlined text-2xl text-gray-300 dark:text-gray-500">
                      public
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Ícone do Navegador
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                      Recomendado: 32x32px .ico ou .png
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Dica */}
          <div className="bg-[var(--zephira-primary)]/5 border border-[var(--zephira-primary)]/20 rounded-xl p-6">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-[var(--zephira-primary)] shrink-0">
                info
              </span>
              <div>
                <h3 className="text-sm font-bold text-[var(--zephira-primary)] mb-1">
                  Dica de Configuração
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Alterações na moeda e fuso horário afetarão apenas novos
                  pedidos e relatórios futuros. Dados históricos permanecem
                  inalterados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

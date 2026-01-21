"use client";

import { useState } from "react";
import { toast } from "react-toastify";

// Mock Data para Taxas
const initialTaxRates = [
  {
    id: 1,
    country: "United States",
    type: "Sales Tax",
    rate: 8.87,
    enabled: true,
    flag: "🇺🇸",
  },
  {
    id: 2,
    country: "United Kingdom",
    type: "VAT",
    rate: 20.0,
    enabled: true,
    flag: "🇬🇧",
  },
  {
    id: 3,
    country: "France",
    type: "VAT",
    rate: 20.0,
    enabled: false,
    flag: "🇫🇷",
  },
];

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState<"shipping" | "taxes">("shipping");
  const [isLoading, setIsLoading] = useState(false);

  // States de Envio
  const [flatRatePrice, setFlatRatePrice] = useState("15.00");
  const [handlingFee, setHandlingFee] = useState("2.50");

  // States de Taxas
  const [taxRates, setTaxRates] = useState(initialTaxRates);

  const handleSave = () => {
    setIsLoading(true);
    // Simulação de API
    setTimeout(() => {
      toast.success("Configurações salvas com sucesso!");
      setIsLoading(false);
    }, 800);
  };

  const handleTaxChange = (id: number, newValue: string) => {
    setTaxRates((prev) =>
      prev.map((rate) =>
        rate.id === id ? { ...rate, rate: Number(newValue) } : rate,
      ),
    );
  };

  const toggleTaxStatus = (id: number) => {
    setTaxRates((prev) =>
      prev.map((rate) =>
        rate.id === id ? { ...rate, enabled: !rate.enabled } : rate,
      ),
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-10">
      {/* 1. Page Heading & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--zephira-text)] dark:text-white">
            Envio & Taxas
          </h1>
          <p className="text-[var(--zephira-muted)] text-sm font-medium mt-1">
            Configure logística de entrega global e conformidade fiscal.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white dark:bg-[#102220] border border-gray-200 dark:border-white/10 font-bold text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[var(--zephira-muted)]">
            Descartar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-5 py-2.5 bg-[var(--zephira-primary)] text-[#111817] font-bold text-sm rounded-lg shadow-lg shadow-[var(--zephira-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:transform-none"
          >
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>

      {/* 2. Tabs Section */}
      <div className="border-b border-gray-200 dark:border-white/10">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("shipping")}
            className={`relative pb-4 group text-sm font-bold flex items-center gap-2 transition-colors ${
              activeTab === "shipping"
                ? "text-[var(--zephira-primary)]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              local_shipping
            </span>
            Regras de Envio
            {activeTab === "shipping" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--zephira-primary)] rounded-full animate-in fade-in zoom-in duration-200"></div>
            )}
          </button>

          <button
            onClick={() => setActiveTab("taxes")}
            className={`relative pb-4 group text-sm font-bold flex items-center gap-2 transition-colors ${
              activeTab === "taxes"
                ? "text-[var(--zephira-primary)]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              account_balance_wallet
            </span>
            Configurações Fiscais
            {activeTab === "taxes" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--zephira-primary)] rounded-full animate-in fade-in zoom-in duration-200"></div>
            )}
          </button>
        </div>
      </div>

      {/* 3. Content Area */}
      {activeTab === "shipping" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Left Column: Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--zephira-text)] dark:text-white">
                Métodos Ativos
                <span className="bg-[var(--zephira-primary)]/10 text-[var(--zephira-primary)] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Pro
                </span>
              </h3>
              <button className="text-[var(--zephira-primary)] font-bold text-sm flex items-center gap-1 hover:underline">
                <span className="material-symbols-outlined text-[18px]">
                  add
                </span>{" "}
                Nova Taxa
              </button>
            </div>

            {/* Card: Flat Rate */}
            <div className="bg-white dark:bg-[#102220] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/5 flex flex-col md:flex-row gap-6">
              {/* Imagem Placeholder */}
              <div className="w-full md:w-48 h-32 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">
                  local_shipping
                </span>
              </div>

              <div className="flex-1 w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white">
                      Taxa Fixa Padrão
                    </h4>
                    <p className="text-sm text-[var(--zephira-muted)] mt-1">
                      Entrega confiável de 3-5 dias para itens pequenos.
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    {/* Toggle Switch Mock */}
                    <div className="w-10 h-5 bg-[var(--zephira-primary)] rounded-full relative cursor-pointer shadow-inner">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                      Custo Base
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        R$
                      </span>
                      <input
                        className="w-full pl-9 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-[var(--zephira-primary)] focus:border-transparent outline-none transition-all font-bold text-[var(--zephira-text)] dark:text-white"
                        type="number"
                        value={flatRatePrice}
                        onChange={(e) => setFlatRatePrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-[120px]">
                    <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">
                      Taxa Manuseio
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                        R$
                      </span>
                      <input
                        className="w-full pl-9 py-2 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-[var(--zephira-primary)] focus:border-transparent outline-none transition-all font-bold text-[var(--zephira-text)] dark:text-white"
                        type="number"
                        value={handlingFee}
                        onChange={(e) => setHandlingFee(e.target.value)}
                      />
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-4 bg-gray-50 dark:bg-white/5 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">
                      delete
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card: Weight Based */}
            <div className="bg-white dark:bg-[#102220] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/5 flex flex-col md:flex-row gap-6 border-l-4 border-l-[var(--zephira-primary)]/40">
              <div className="w-full md:w-48 h-32 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-gray-600">
                  scale
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white">
                      Envio por Peso
                    </h4>
                    <p className="text-sm text-[var(--zephira-muted)] mt-1">
                      Recomendado para pedidos de alto volume ou atacado.
                    </p>
                  </div>
                  <div className="flex items-center h-6">
                    <div className="w-10 h-5 bg-gray-200 dark:bg-gray-700 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-[var(--zephira-primary)]/5 rounded-lg border border-[var(--zephira-primary)]/10">
                  <p className="text-xs text-[var(--zephira-primary)] font-medium italic flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">
                      info
                    </span>
                    "Ideal para proteção de remessas pesadas durante o
                    trânsito."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Settings Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#102220] rounded-xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider text-gray-400">
                Visão Geral Global
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-[var(--zephira-text)] dark:text-white">
                  <span className="opacity-70">Preço com Imposto Incluso</span>
                  <div className="w-8 h-4 bg-[var(--zephira-primary)] rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-[var(--zephira-text)] dark:text-white">
                  <span className="opacity-70">Unidade de Peso</span>
                  <select className="bg-transparent border-none py-0 pl-0 pr-6 text-sm font-bold focus:ring-0 cursor-pointer text-right outline-none">
                    <option>Gramas (g)</option>
                    <option>Onças (oz)</option>
                    <option>Quilogramas (kg)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between text-sm border-t border-gray-100 dark:border-white/5 pt-4 text-[var(--zephira-text)] dark:text-white">
                  <span className="opacity-70">Zonas Ativas</span>
                  <span className="font-bold">24 Regiões</span>
                </div>
              </div>
            </div>

            <div className="bg-[#111817] rounded-xl p-6 text-white overflow-hidden relative group shadow-lg">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-8xl">
                  public
                </span>
              </div>
              <h4 className="font-bold text-lg mb-2 relative z-10">
                Impostos Regionais
              </h4>
              <p className="text-xs text-gray-400 mb-4 relative z-10">
                Configure VAT, GST e Sales Tax para clientes internacionais.
              </p>
              <button
                onClick={() => setActiveTab("taxes")}
                className="w-full py-2.5 bg-[var(--zephira-primary)] text-[#111817] font-bold text-sm rounded-lg hover:brightness-110 transition-colors relative z-10 shadow-lg shadow-[var(--zephira-primary)]/20"
              >
                Gerenciar Regiões
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Tax Tab Content */
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-[#102220] rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 flex flex-wrap gap-4 justify-between items-center">
              <h3 className="font-bold text-lg text-[var(--zephira-text)] dark:text-white">
                Detalhamento Regional de Impostos
              </h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    file_download
                  </span>
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-gray-500 dark:text-gray-400 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    filter_list
                  </span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-black/20 text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-200 dark:border-white/5">
                  <tr>
                    <th className="px-6 py-4">Região / País</th>
                    <th className="px-6 py-4">Tipo de Taxa</th>
                    <th className="px-6 py-4">Taxa (%)</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                  {taxRates.map((rate) => (
                    <tr
                      key={rate.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="px-6 py-4 font-semibold text-[var(--zephira-text)] dark:text-white flex items-center gap-3">
                        <span className="text-xl">{rate.flag}</span>
                        {rate.country}
                      </td>
                      <td className="px-6 py-4 opacity-70 text-[var(--zephira-text)] dark:text-gray-300">
                        {rate.type}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 w-24 bg-gray-100 dark:bg-black/20 border border-transparent focus-within:border-[var(--zephira-primary)] px-2 py-1 rounded transition-colors">
                          <input
                            className="w-full bg-transparent border-none p-0 text-sm text-center focus:ring-0 outline-none font-mono font-bold text-[var(--zephira-text)] dark:text-white"
                            type="number"
                            value={rate.rate}
                            onChange={(e) =>
                              handleTaxChange(rate.id, e.target.value)
                            }
                          />
                          <span className="text-xs text-gray-500 font-bold">
                            %
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleTaxStatus(rate.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors ${
                            rate.enabled
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400"
                          }`}
                        >
                          {rate.enabled ? "Ativo" : "Inativo"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-[var(--zephira-primary)] transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                          <span className="material-symbols-outlined text-[20px]">
                            more_vert
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 bg-gray-50/50 dark:bg-black/20 flex items-center justify-center border-t border-gray-200 dark:border-white/5">
              <button className="text-sm font-bold text-gray-500 hover:text-[var(--zephira-primary)] transition-colors flex items-center gap-2">
                Ver todas as 42 Regiões
                <span className="material-symbols-outlined text-sm">
                  expand_more
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

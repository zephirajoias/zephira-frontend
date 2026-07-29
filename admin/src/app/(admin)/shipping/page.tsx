"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";

// --- Mock Data ---
const initialTaxRates = [
  {
    id: 1,
    country: "Brasil",
    type: "ICMS",
    rate: 18.0,
    enabled: true,
    flag: "🇧🇷",
  },
  {
    id: 2,
    country: "United States",
    type: "Sales Tax",
    rate: 8.87,
    enabled: true,
    flag: "🇺🇸",
  },
  {
    id: 3,
    country: "Portugal",
    type: "IVA",
    rate: 23.0,
    enabled: false,
    flag: "🇵🇹",
  },
];

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState<"shipping" | "taxes">("shipping");
  const [isLoading, setIsLoading] = useState(false);

  // States de Envio
  const [flatRatePrice, setFlatRatePrice] = useState("15.00");
  const [handlingFee, setHandlingFee] = useState("2.50");
  const [taxRates, setTaxRates] = useState(initialTaxRates);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success("Configurações aplicadas com sucesso!");
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-16">
      {/* 1. Header Fixo de Ações */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 dark:border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Envio & Taxas
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Controle a logística global e as obrigações fiscais da Zephira.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-6 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-all">
            Descartar
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 md:flex-none px-8 py-3 bg-[#11d4c4] text-[#0a1615] font-black text-sm rounded-2xl shadow-lg shadow-[#11d4c4]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {isLoading ? "Processando..." : "Salvar Alterações"}
          </button>
        </div>
      </header>

      {/* 2. Custom Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit">
        <TabButton
          active={activeTab === "shipping"}
          onClick={() => setActiveTab("shipping")}
          icon="local_shipping"
          label="Regras de Envio"
        />
        <TabButton
          active={activeTab === "taxes"}
          onClick={() => setActiveTab("taxes")}
          icon="account_balance_wallet"
          label="Configurações Fiscais"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 3. Área de Conteúdo Principal */}
        <main className="lg:col-span-8 space-y-6">
          {activeTab === "shipping" ? (
            <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
              <SectionHeader title="Métodos de Entrega" badge="3 Ativos" />

              {/* Card de Taxa Fixa */}
              <div className="bg-white dark:bg-[#102220] rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm group">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="size-20 rounded-2xl bg-[#11d4c4]/10 text-[#11d4c4] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-4xl">
                      local_shipping
                    </span>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white">
                          Taxa Fixa Padrão
                        </h4>
                        <p className="text-sm text-slate-500 mt-1">
                          Ideal para entregas domésticas com rastreamento.
                        </p>
                      </div>
                      <ToggleButton active={true} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <PricingInput
                        label="Custo da Remessa"
                        value={flatRatePrice}
                        onChange={setFlatRatePrice}
                      />
                      <PricingInput
                        label="Taxa de Manuseio"
                        value={handlingFee}
                        onChange={setHandlingFee}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card por Peso */}
              <div className="bg-white dark:bg-[#102220] rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-sm opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-not-allowed">
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-3xl">
                      scale
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Envio por Peso (Em breve)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Cálculo baseado no peso total do carrinho.
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                      Bloqueado
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Tabela de Impostos */
            <div className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden animate-in slide-in-from-right-4 duration-500">
              <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
                <h3 className="font-black text-lg">
                  Tabela de Impostos Globais
                </h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-white/5">
                  <tr>
                    <th className="p-5 pl-8">País / Região</th>
                    <th className="p-5">Tipo</th>
                    <th className="p-5 text-center">Taxa (%)</th>
                    <th className="p-5 text-right pr-8">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {taxRates.map((rate) => (
                    <tr
                      key={rate.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-5 pl-8 flex items-center gap-3">
                        <span className="text-2xl filter drop-shadow-sm">
                          {rate.flag}
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {rate.country}
                        </span>
                      </td>
                      <td className="p-5 text-slate-500 font-medium">
                        {rate.type}
                      </td>
                      <td className="p-5">
                        <div className="mx-auto w-24 bg-slate-100 dark:bg-white/5 rounded-xl px-3 py-2 flex items-center border border-transparent focus-within:border-[#11d4c4] transition-all">
                          <input
                            type="number"
                            value={rate.rate}
                            className="bg-transparent border-none p-0 w-full text-center font-black focus:ring-0"
                          />
                          <span className="text-[10px] font-bold text-slate-400">
                            %
                          </span>
                        </div>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <button
                          onClick={() =>
                            setTaxRates((prev) =>
                              prev.map((r) =>
                                r.id === rate.id
                                  ? { ...r, enabled: !r.enabled }
                                  : r,
                              ),
                            )
                          }
                          className={cn(
                            "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            rate.enabled
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-slate-100 text-slate-400",
                          )}
                        >
                          {rate.enabled ? "Ativo" : "Pausado"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        {/* 4. Sidebar de Resumo */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 dark:bg-[#11d4c4]/5 rounded-3xl p-8 text-white relative overflow-hidden group">
            <h4 className="text-sm font-black uppercase tracking-widest text-[#11d4c4] mb-4">
              Configuração Global
            </h4>
            <div className="space-y-4 relative z-10">
              <SummaryItem label="Zonas de Envio" value="24 Ativas" />
              <SummaryItem label="Moeda Base" value="BRL (R$)" />
              <SummaryItem label="Preços com Impostos" value="Sim" toggle />
              <SummaryItem label="Unidade de Peso" value="Gramas (g)" select />
            </div>
            <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/[0.03] text-[120px] group-hover:scale-110 transition-transform duration-700">
              public
            </span>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-3xl p-6">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-amber-600">
                info
              </span>
              <div>
                <h5 className="font-bold text-amber-900 dark:text-amber-400 text-sm">
                  Atenção Fiscal
                </h5>
                <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-1 leading-relaxed">
                  Alterações nas taxas de impostos podem levar até 10 minutos
                  para serem propagadas no checkout global.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// --- Sub-componentes Refinados ---

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
        active
          ? "bg-white dark:bg-[#102220] text-[#11d4c4] shadow-sm"
          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200",
      )}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      {label}
    </button>
  );
}

function SectionHeader({ title, badge }: any) {
  return (
    <div className="flex items-center justify-between px-2">
      <h3 className="text-xl font-black text-slate-900 dark:text-white">
        {title}
      </h3>
      <span className="bg-[#11d4c4]/10 text-[#11d4c4] text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest">
        {badge}
      </span>
    </div>
  );
}

function PricingInput({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
          R$
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 pl-10 pr-4 rounded-2xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all font-black text-slate-800 dark:text-white"
        />
      </div>
    </div>
  );
}

function ToggleButton({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "w-12 h-6 rounded-full relative cursor-pointer transition-colors p-1",
        active ? "bg-[#11d4c4]" : "bg-slate-200 dark:bg-slate-700",
      )}
    >
      <div
        className={cn(
          "size-4 bg-white rounded-full shadow-sm transition-all",
          active ? "translate-x-6" : "translate-x-0",
        )}
      />
    </div>
  );
}

function SummaryItem({ label, value, toggle, select }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-none">
      <span className="text-sm text-slate-400 font-medium">{label}</span>
      {toggle ? (
        <ToggleButton active={true} />
      ) : (
        <span className="text-sm font-black">{value}</span>
      )}
    </div>
  );
}

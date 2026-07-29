"use client";

import {
  TAXAS_PADRAO_MERCADO_PAGO,
  TaxasPagamento,
  getTaxasPagamento,
  restaurarTaxasPadrao,
  salvarTaxasPagamento,
} from "@/lib/taxasPagamento";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TaxasPagamentoPage() {
  const [taxas, setTaxas] = useState<TaxasPagamento>(
    TAXAS_PADRAO_MERCADO_PAGO,
  );

  useEffect(() => {
    setTaxas(getTaxasPagamento());
  }, []);

  const handleSalvar = () => {
    salvarTaxasPagamento(taxas);
    toast.success("Taxas atualizadas! A simulação de recebimento já usa os novos valores.");
  };

  const handleRestaurar = () => {
    restaurarTaxasPadrao();
    setTaxas(TAXAS_PADRAO_MERCADO_PAGO);
    toast.info("Taxas restauradas para o padrão do Mercado Pago.");
  };

  const updateCredito = (index: number, value: number) => {
    const novoCredito = [...taxas.credito];
    novoCredito[index] = value;
    setTaxas({ ...taxas, credito: novoCredito });
  };

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col gap-8 pb-16">
      <header className="flex flex-col gap-4">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/settings" className="hover:text-[#11d4c4] transition-colors">
            Configurações
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 dark:text-white">
            Taxas de Pagamento
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Taxas de Pagamento
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Usadas apenas para simular quanto você recebe ao cadastrar um
              produto. Não afetam o valor cobrado do cliente.
            </p>
          </div>
        </div>
      </header>

      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-5 flex gap-3">
        <span className="material-symbols-outlined text-amber-600">info</span>
        <p className="text-xs text-amber-700 dark:text-amber-500/80 leading-relaxed">
          Os valores abaixo são as taxas padrão publicadas pelo Mercado Pago
          para conta comum no Brasil. Se sua conta tem taxa negociada
          diferente, ajuste aqui — a simulação de recebimento no cadastro de
          produtos passa a usar esses valores.
        </p>
      </div>

      <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8 space-y-6">
        <h3 className="font-black text-lg">À Vista</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              PIX (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={taxas.pix}
              onChange={(e) =>
                setTaxas({ ...taxas, pix: Number(e.target.value) })
              }
              className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 outline-none font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Débito (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={taxas.debito}
              onChange={(e) =>
                setTaxas({ ...taxas, debito: Number(e.target.value) })
              }
              className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 outline-none font-bold"
            />
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8 space-y-6">
        <h3 className="font-black text-lg">Crédito Parcelado (%)</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {taxas.credito.map((taxa, i) => (
            <div key={i} className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {i + 1}x
              </label>
              <input
                type="number"
                step="0.01"
                value={taxa}
                onChange={(e) => updateCredito(i, Number(e.target.value))}
                className="w-full h-11 px-3 rounded-xl bg-slate-50 dark:bg-black/20 border-none focus:ring-2 focus:ring-[#11d4c4]/20 outline-none font-bold text-sm"
              />
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          onClick={handleRestaurar}
          className="px-6 py-3 rounded-2xl border border-slate-200 dark:border-white/10 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
        >
          Restaurar Padrão
        </button>
        <button
          onClick={handleSalvar}
          className="px-8 py-3 rounded-2xl bg-[#11d4c4] text-[#0a1615] font-black text-sm shadow-lg shadow-[#11d4c4]/20 hover:scale-[1.02] transition-all"
        >
          Salvar Taxas
        </button>
      </div>
    </div>
  );
}

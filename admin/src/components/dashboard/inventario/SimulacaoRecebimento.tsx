"use client";

import {
  calcularValorLiquido,
  getTaxasPagamento,
} from "@/lib/taxasPagamento";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface SimulacaoRecebimentoProps {
  preco: number;
}

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function SimulacaoRecebimento({ preco }: SimulacaoRecebimentoProps) {
  const [parcelaSelecionada, setParcelaSelecionada] = useState(1);
  const taxas = useMemo(() => getTaxasPagamento(), []);

  if (!preco || preco <= 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-white/10 p-4 text-center text-xs text-gray-400 font-medium">
        Informe o preço para simular o valor recebido via PIX e cartão.
      </div>
    );
  }

  const valorPix = calcularValorLiquido(preco, taxas.pix);
  const valorDebito = calcularValorLiquido(preco, taxas.debito);
  const taxaCreditoSelecionada = taxas.credito[parcelaSelecionada - 1];
  const valorCreditoLiquido = calcularValorLiquido(
    preco,
    taxaCreditoSelecionada,
  );
  const valorParcela = preco / parcelaSelecionada;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Você recebe (Mercado Pago)
        </p>
        <Link
          href="/settings/pagamento"
          className="text-[10px] font-bold text-[var(--zephira-primary)] hover:underline"
        >
          Ajustar taxas
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white dark:bg-white/5 rounded-lg p-2.5">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-0.5">
            PIX ({taxas.pix}%)
          </p>
          <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">
            {formatter.format(valorPix)}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 rounded-lg p-2.5">
          <p className="text-[9px] font-black uppercase text-gray-400 mb-0.5">
            Débito ({taxas.debito}%)
          </p>
          <p className="text-sm font-black text-gray-900 dark:text-white">
            {formatter.format(valorDebito)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-lg p-2.5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-black uppercase text-gray-400">
            Crédito ({taxaCreditoSelecionada}%)
          </p>
          <select
            value={parcelaSelecionada}
            onChange={(e) => setParcelaSelecionada(Number(e.target.value))}
            className="text-[10px] font-bold bg-transparent outline-none cursor-pointer text-gray-600 dark:text-gray-300"
          >
            {taxas.credito.map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}x{i === 0 ? " à vista" : " sem juros"}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end justify-between">
          <p className="text-[10px] text-gray-400 font-medium">
            {parcelaSelecionada}x de {formatter.format(valorParcela)}
          </p>
          <p className="text-sm font-black text-gray-900 dark:text-white">
            {formatter.format(valorCreditoLiquido)}
          </p>
        </div>
      </div>
    </div>
  );
}

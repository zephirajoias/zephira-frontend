// Simulação de "quanto você recebe" por meio de pagamento (Mercado Pago).
// São taxas padrão publicadas para conta comum no Brasil — se sua conta tiver
// taxa negociada diferente, ajuste em Configurações > Taxas de Pagamento.

export interface TaxasPagamento {
  pix: number;
  debito: number;
  credito: number[]; // índice 0 = 1x, índice 1 = 2x, ... índice 11 = 12x
}

export const TAXAS_PADRAO_MERCADO_PAGO: TaxasPagamento = {
  pix: 0.99,
  debito: 1.99,
  credito: [
    4.99, 5.49, 6.29, 6.99, 7.49, 7.99, 9.49, 9.99, 10.49, 10.99, 11.49, 11.99,
  ],
};

const STORAGE_KEY = "zephira_taxas_pagamento";

export function getTaxasPagamento(): TaxasPagamento {
  if (typeof window === "undefined") return TAXAS_PADRAO_MERCADO_PAGO;

  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) return TAXAS_PADRAO_MERCADO_PAGO;
    const parsed = JSON.parse(salvo);
    return {
      pix: parsed.pix ?? TAXAS_PADRAO_MERCADO_PAGO.pix,
      debito: parsed.debito ?? TAXAS_PADRAO_MERCADO_PAGO.debito,
      credito:
        Array.isArray(parsed.credito) && parsed.credito.length === 12
          ? parsed.credito
          : TAXAS_PADRAO_MERCADO_PAGO.credito,
    };
  } catch {
    return TAXAS_PADRAO_MERCADO_PAGO;
  }
}

export function salvarTaxasPagamento(taxas: TaxasPagamento) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taxas));
}

export function restaurarTaxasPadrao() {
  localStorage.removeItem(STORAGE_KEY);
}

export function calcularValorLiquido(
  precoVenda: number,
  taxaPercentual: number,
): number {
  return precoVenda * (1 - taxaPercentual / 100);
}

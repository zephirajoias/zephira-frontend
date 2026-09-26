export const formatarPreco = (valor: string | number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(valor),
  );

// Parcela mínima de R$ 10: peça barata não mostra "3x de R$ 4,90".
const PARCELA_MINIMA = 10;

/**
 * Parcelas sem juros pra mostrar junto do preço, ou null se não couber.
 * `maximo` vem de Configurações Gerais; sem ele, usa 3 (o que a loja
 * definiu em set/2026). A loja precisa ter o "parcelamento sem juros"
 * ligado na conta do Mercado Pago pra essa promessa ser verdadeira.
 */
export function parcelasSemJuros(
  preco: string | number,
  maximo?: number | null,
): { vezes: number; valor: string } | null {
  const total = Number(preco);
  const vezes = Math.min(maximo ?? 3, Math.floor(total / PARCELA_MINIMA));
  if (!total || vezes < 2) return null;
  return { vezes, valor: formatarPreco(total / vezes) };
}

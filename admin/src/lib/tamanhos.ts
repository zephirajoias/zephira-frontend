// Aros de anel mais vendidos no Brasil (numeração ABNT). Cobre a faixa que
// a maioria das joalherias vende; quem precisar de um aro fora daqui ainda
// pode digitar direto no campo de texto.
export const AROS_ANEL = Array.from({ length: 19 }, (_, i) => String(12 + i)); // 12–30

// A peça sabe a própria categoria pelo nome exibido no select (ex:
// "Anel > Prata"), não por um ID fixo — evita depender do CD_CATEGORIA
// mudar entre ambientes.
export function ehCategoriaAnel(nomeCategoria: string | undefined): boolean {
  if (!nomeCategoria) return false;
  const primeira = nomeCategoria.split(">")[0].trim().toLowerCase();
  return primeira === "anel" || primeira === "anéis";
}

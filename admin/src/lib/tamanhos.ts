// Aros de anel mais vendidos no Brasil (numeração ABNT). Cobre a faixa que
// a maioria das joalherias vende; quem precisar de um aro fora daqui ainda
// pode digitar direto no campo de texto.
export const AROS_ANEL = Array.from({ length: 19 }, (_, i) => String(12 + i)); // 12–30

// Comprimentos mais vendidos de pulseira, em cm (o exemplo da loja foi
// "Tamanho 17 e 18cm"). Igual ao aro: quem precisar de outro valor digita.
export const TAMANHOS_PULSEIRA = Array.from({ length: 7 }, (_, i) => `${15 + i}cm`); // 15–21cm

export interface SugestaoTamanho {
  rotulo: string; // como chamar o campo nessa categoria ("Aro", "Tamanho")
  valores: string[];
}

const SUGESTOES: { primeiraCategoria: string[]; sugestao: SugestaoTamanho }[] = [
  { primeiraCategoria: ["anel", "anéis"], sugestao: { rotulo: "Aro", valores: AROS_ANEL } },
  {
    primeiraCategoria: ["pulseira", "pulseiras"],
    sugestao: { rotulo: "Tamanho", valores: TAMANHOS_PULSEIRA },
  },
];

// A peça sabe a própria categoria pelo nome exibido no select (ex:
// "Anel > Prata"), não por um ID fixo — evita depender do CD_CATEGORIA
// mudar entre ambientes. Categoria sem lista conhecida (Brinco, Colar...)
// volta null e o campo continua texto livre.
export function sugestaoDeTamanho(
  nomeCategoria: string | undefined,
): SugestaoTamanho | null {
  if (!nomeCategoria) return null;
  const primeira = nomeCategoria.split(">")[0].trim().toLowerCase();
  return (
    SUGESTOES.find((s) => s.primeiraCategoria.includes(primeira))?.sugestao ??
    null
  );
}

// Mantido pelo nome antigo (usado antes de existir a Pulseira) por
// compatibilidade com quem só precisa saber se é Anel.
export function ehCategoriaAnel(nomeCategoria: string | undefined): boolean {
  return sugestaoDeTamanho(nomeCategoria)?.rotulo === "Aro";
}

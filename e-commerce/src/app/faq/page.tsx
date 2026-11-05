import { Contatos, PaginaInstitucional } from "@/components/PaginaInstitucional";
import { carregarDadosLoja } from "@/lib/loja";
import { buscarNoServidor } from "@/lib/site";
import type { Metadata } from "next";

interface Pergunta {
  p: string;
  r: string;
}

const RESERVA_PERGUNTAS: Pergunta[] = [
  {
    p: "Posso trocar ou devolver?",
    r: "Sim, em até 7 dias depois de receber, ou se a peça tiver defeito de fabricação.",
  },
];

export const metadata: Metadata = { title: "Perguntas frequentes | Zephira Joias" };

export default async function FaqPage() {
  const [pagina, { config }] = await Promise.all([
    buscarNoServidor<{ NM_TITULO: string; DS_CONTEUDO: string }>(
      "/paginas-institucionais/faq",
    ),
    carregarDadosLoja(),
  ]);

  let perguntas = RESERVA_PERGUNTAS;
  if (pagina?.DS_CONTEUDO) {
    try {
      const lista = JSON.parse(pagina.DS_CONTEUDO);
      if (Array.isArray(lista) && lista.length > 0) perguntas = lista;
    } catch {
      // Mantém a reserva se o conteúdo salvo não for um JSON válido.
    }
  }

  return (
    <PaginaInstitucional titulo={pagina?.NM_TITULO ?? "Perguntas frequentes"}>
      {perguntas.map(({ p, r }) => (
        <details
          key={p}
          className="group rounded-2xl border border-slate-200 px-5 py-4 open:border-primary"
        >
          <summary className="cursor-pointer font-bold text-text-main list-none flex justify-between gap-4">
            {p}
            <span className="material-symbols-outlined text-text-muted group-open:rotate-180 transition-transform">
              expand_more
            </span>
          </summary>
          <p className="mt-3">{r}</p>
        </details>
      ))}
      <h2>Não achou sua dúvida?</h2>
      <Contatos config={config} />
    </PaginaInstitucional>
  );
}

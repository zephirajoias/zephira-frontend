import { PaginaInstitucional } from "@/components/PaginaInstitucional";
import { renderizarConteudo } from "@/lib/conteudo";
import { buscarNoServidor } from "@/lib/site";
import type { Metadata } from "next";

// Texto de reserva: só aparece se a API não responder (nunca deixa a
// página em branco). O texto de verdade é editado no admin.
const RESERVA = {
  NM_TITULO: "Sobre a Zephira",
  DS_CONTEUDO:
    "A Zephira Joias é uma loja online de joias em prata 925, peças banhadas a ouro e aço inox.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await buscarNoServidor<typeof RESERVA>("/paginas-institucionais/sobre");
  return { title: `${(pagina ?? RESERVA).NM_TITULO} | Zephira Joias` };
}

export default async function SobrePage() {
  const pagina =
    (await buscarNoServidor<typeof RESERVA>("/paginas-institucionais/sobre")) ?? RESERVA;
  return (
    <PaginaInstitucional titulo={pagina.NM_TITULO}>
      {renderizarConteudo(pagina.DS_CONTEUDO)}
    </PaginaInstitucional>
  );
}

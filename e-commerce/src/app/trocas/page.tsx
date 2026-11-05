import { Contatos, PaginaInstitucional } from "@/components/PaginaInstitucional";
import { renderizarConteudo } from "@/lib/conteudo";
import { carregarDadosLoja } from "@/lib/loja";
import { buscarNoServidor } from "@/lib/site";
import type { Metadata } from "next";

const RESERVA = {
  NM_TITULO: "Trocas e devoluções",
  DS_CONTEUDO:
    "Você pode desistir da compra em até 7 dias depois de receber (Código de Defesa do Consumidor, art. 49).",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await buscarNoServidor<typeof RESERVA>("/paginas-institucionais/trocas");
  return { title: `${(pagina ?? RESERVA).NM_TITULO} | Zephira Joias` };
}

export default async function TrocasPage() {
  const [pagina, { config }] = await Promise.all([
    buscarNoServidor<typeof RESERVA>("/paginas-institucionais/trocas"),
    carregarDadosLoja(),
  ]);
  const { NM_TITULO, DS_CONTEUDO } = pagina ?? RESERVA;
  return (
    <PaginaInstitucional titulo={NM_TITULO}>
      {renderizarConteudo(DS_CONTEUDO)}
      <Contatos config={config} />
    </PaginaInstitucional>
  );
}

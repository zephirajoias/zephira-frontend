import { Contatos, PaginaInstitucional } from "@/components/PaginaInstitucional";
import { renderizarConteudo } from "@/lib/conteudo";
import { carregarDadosLoja } from "@/lib/loja";
import { buscarNoServidor } from "@/lib/site";
import type { Metadata } from "next";

const RESERVA = {
  NM_TITULO: "Garantia",
  DS_CONTEUDO: "Todas as peças têm garantia de 1 ano contra defeitos de fabricação.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await buscarNoServidor<typeof RESERVA>("/paginas-institucionais/garantia");
  return { title: `${(pagina ?? RESERVA).NM_TITULO} | Zephira Joias` };
}

export default async function GarantiaPage() {
  const [pagina, { config }] = await Promise.all([
    buscarNoServidor<typeof RESERVA>("/paginas-institucionais/garantia"),
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

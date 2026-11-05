import { PaginaInstitucional } from "@/components/PaginaInstitucional";
import { renderizarConteudo } from "@/lib/conteudo";
import { buscarNoServidor } from "@/lib/site";
import type { Metadata } from "next";

const RESERVA = {
  NM_TITULO: "Como comprar",
  DS_CONTEUDO:
    "Escolha a peça, calcule o frete pelo CEP no carrinho e pague pelo Mercado Pago.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await buscarNoServidor<typeof RESERVA>("/paginas-institucionais/como-comprar");
  return { title: `${(pagina ?? RESERVA).NM_TITULO} | Zephira Joias` };
}

export default async function ComoComprarPage() {
  const pagina =
    (await buscarNoServidor<typeof RESERVA>("/paginas-institucionais/como-comprar")) ?? RESERVA;
  return (
    <PaginaInstitucional titulo={pagina.NM_TITULO}>
      {renderizarConteudo(pagina.DS_CONTEUDO)}
    </PaginaInstitucional>
  );
}

import { Contatos, PaginaInstitucional } from "@/components/PaginaInstitucional";
import { carregarDadosLoja } from "@/lib/loja";
import { buscarNoServidor } from "@/lib/site";
import type { Metadata } from "next";

const RESERVA = {
  NM_TITULO: "Fale conosco",
  DS_CONTEUDO: "Dúvidas sobre uma peça, um pedido, troca ou garantia? Fale com a gente.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await buscarNoServidor<typeof RESERVA>("/paginas-institucionais/contato");
  return { title: `${(pagina ?? RESERVA).NM_TITULO} | Zephira Joias` };
}

export default async function ContatoPage() {
  const [pagina, { config }] = await Promise.all([
    buscarNoServidor<typeof RESERVA>("/paginas-institucionais/contato"),
    carregarDadosLoja(),
  ]);
  const { NM_TITULO, DS_CONTEUDO } = pagina ?? RESERVA;
  return (
    <PaginaInstitucional titulo={NM_TITULO}>
      <p>{DS_CONTEUDO}</p>
      <Contatos config={config} />
      {(config?.NM_RAZAO_SOCIAL || config?.NR_CNPJ || config?.DS_ENDERECO_LOJA) && (
        <>
          <h2>Dados da empresa</h2>
          <p>
            {config?.NM_RAZAO_SOCIAL && <>{config.NM_RAZAO_SOCIAL}<br /></>}
            {config?.NR_CNPJ && <>CNPJ {config.NR_CNPJ}<br /></>}
            {config?.DS_ENDERECO_LOJA}
          </p>
        </>
      )}
    </PaginaInstitucional>
  );
}

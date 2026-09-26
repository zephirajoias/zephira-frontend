import { Contatos, PaginaInstitucional } from "@/components/PaginaInstitucional";
import { carregarDadosLoja } from "@/lib/loja";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Fale conosco | Zephira Joias" };

export default async function ContatoPage() {
  const { config } = await carregarDadosLoja();
  return (
    <PaginaInstitucional titulo="Fale conosco">
      <p>
        Dúvidas sobre uma peça, um pedido, troca ou garantia? Fale com a gente
        por um dos canais abaixo. Se for sobre um pedido, tenha o número dele
        em mãos (está em Minha conta).
      </p>
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

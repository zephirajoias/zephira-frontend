import { buscarNoServidor, SITE_URL } from "@/lib/site";
import Produto, { type ProdutoDetalhe } from "./Produto";

// Busca o produto no servidor (ao lado da API): a página chega pronta pro
// cliente e pro Google. Também manda os dados estruturados de produto
// (nome, foto, preço, disponibilidade), que o Google usa nos resultados.
export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const produto = await buscarNoServidor<ProdutoDetalhe>(
    `/products/${encodeURIComponent(slug)}`,
    60,
  );

  const dadosEstruturados = produto && {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.NM_PRODUTO,
    description: produto.DS_DESCRICAO ?? undefined,
    image: produto.IMAGENS_PRODUTO?.map((i) => i.DS_URL),
    brand: { "@type": "Brand", name: "Zephira Joias" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/produto/${slug}`,
      priceCurrency: "BRL",
      price: Number(produto.VL_PRECO_PROMOCIONAL ?? produto.VL_PRECO).toFixed(2),
      availability: produto.VARIACOES_PRODUTO?.some((v) => v.QT_ESTOQUE > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      {dadosEstruturados && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dadosEstruturados).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Produto key={slug} inicial={produto} />
    </>
  );
}

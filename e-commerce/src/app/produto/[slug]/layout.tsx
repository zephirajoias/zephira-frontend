import { buscarNoServidor, resumirTexto } from "@/lib/site";
import type { Metadata } from "next";

interface ProdutoResumo {
  NM_PRODUTO: string;
  DS_DESCRICAO: string | null;
  VL_PRECO: string;
  VL_PRECO_PROMOCIONAL: string | null;
  IMAGENS_PRODUTO?: { DS_URL: string }[];
}

// A página do produto roda no navegador ("use client"), então o título, a
// descrição e a foto que aparecem ao compartilhar o link (WhatsApp,
// Instagram, Google) são gerados aqui, no servidor.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const produto = await buscarNoServidor<ProdutoResumo>(
    `/products/${encodeURIComponent(slug)}`,
  );
  if (!produto) return { title: "Zephira Joias" };

  const preco = Number(
    produto.VL_PRECO_PROMOCIONAL ?? produto.VL_PRECO,
  ).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const descricao =
    resumirTexto(produto.DS_DESCRICAO) ||
    `${produto.NM_PRODUTO} na Zephira Joias.`;
  const imagem = produto.IMAGENS_PRODUTO?.[0]?.DS_URL;
  const url = `/produto/${slug}`;

  return {
    title: `${produto.NM_PRODUTO} | Zephira Joias`,
    description: `${preco} · ${descricao}`,
    alternates: { canonical: url },
    openGraph: {
      title: `${produto.NM_PRODUTO} · ${preco}`,
      description: descricao,
      url,
      images: imagem ? [{ url: imagem, alt: produto.NM_PRODUTO }] : undefined,
    },
  };
}

export default function ProdutoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

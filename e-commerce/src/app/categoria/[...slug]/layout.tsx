import { buscarNoServidor, type CategoriaArvore } from "@/lib/site";
import type { Metadata } from "next";

// Título da categoria pro preview de link e pro Google. O slug da
// subcategoria não é único sozinho ("aco" existe embaixo de várias), então
// resolve o pai primeiro e procura o filho só dentro dele.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [slugPai, slugFilho] = slug;
  const arvore = await buscarNoServidor<CategoriaArvore[]>(
    "/products/categorias",
  );
  const pai = arvore?.find((c) => c.DS_SLUG === slugPai);
  if (!pai) return { title: "Zephira Joias" };

  const filho = slugFilho
    ? pai.other_CATEGORIA?.find((c) => c.DS_SLUG === slugFilho)
    : undefined;
  const nome = filho ? `${pai.NM_CATEGORIA} · ${filho.NM_CATEGORIA}` : pai.NM_CATEGORIA;
  const descricao = `${nome}: veja a coleção da Zephira Joias.`;
  const imagem = filho?.DS_URL_IMAGEM ?? pai.DS_URL_IMAGEM;
  const url = `/categoria/${slug.join("/")}`;

  return {
    title: `${nome} | Zephira Joias`,
    description: descricao,
    alternates: { canonical: url },
    openGraph: {
      title: nome,
      description: descricao,
      url,
      images: imagem ? [{ url: imagem, alt: nome }] : undefined,
    },
  };
}

export default function CategoriaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { buscarNoServidor, SITE_URL, type CategoriaArvore } from "@/lib/site";
import { PAGINAS_INSTITUCIONAIS } from "@/components/PaginaInstitucional";
import type { MetadataRoute } from "next";

// Lista de páginas pro Google. Gerada na hora do acesso (as buscas na API
// ficam 10 min em cache), pra não depender da API durante o build. Se a API
// não responder, sai só a home.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [produtos, categorias] = await Promise.all([
    buscarNoServidor<{ data: { DS_SLUG: string }[] }>("/products?limit=1000"),
    buscarNoServidor<CategoriaArvore[]>("/products/categorias"),
  ]);

  const paginas: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
  ];

  for (const { slug } of PAGINAS_INSTITUCIONAIS) {
    paginas.push({ url: `${SITE_URL}/${slug}`, changeFrequency: "monthly", priority: 0.3 });
  }

  for (const pai of categorias ?? []) {
    paginas.push({
      url: `${SITE_URL}/categoria/${pai.DS_SLUG}`,
      changeFrequency: "daily",
      priority: 0.8,
    });
    for (const filho of pai.other_CATEGORIA ?? []) {
      paginas.push({
        url: `${SITE_URL}/categoria/${pai.DS_SLUG}/${filho.DS_SLUG}`,
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  for (const produto of produtos?.data ?? []) {
    if (!produto.DS_SLUG) continue;
    paginas.push({
      url: `${SITE_URL}/produto/${produto.DS_SLUG}`,
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }

  return paginas;
}

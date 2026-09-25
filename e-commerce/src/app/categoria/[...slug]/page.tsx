import { buscarNoServidor } from "@/lib/site";
import Listagem, { type ListagemInicial } from "./Listagem";

// Busca a primeira página no servidor (que fica ao lado da API) pra tela
// abrir com os produtos já na página. Se a API falhar, cai no comportamento
// antigo: o navegador busca sozinho.
export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const [pai, filho] = slug;
  const query = new URLSearchParams({ page: "1", limit: "12" });
  if (filho) query.set("subcategoria", filho);

  const inicial = await buscarNoServidor<ListagemInicial>(
    `/products/categorias/${encodeURIComponent(pai)}?${query.toString()}`,
    30, // produto novo aparece na listagem em até 30s
  );

  return <Listagem key={slug.join("/")} inicial={inicial} />;
}

// Endereço público da loja, usado em links absolutos (preview de link no
// WhatsApp/Instagram, sitemap, robots).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.zephirajoias.com.br";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// No build, várias páginas buscam na API ao mesmo tempo e a primeira
// resposta pode demorar; 4s já fez a home sair vazia. Em produção, 4s.
const NO_BUILD = process.env.NEXT_PHASE === "phase-production-build";

// Busca na API a partir do servidor (páginas, metadados, sitemap). Null em
// qualquer falha: a página sai sem aquele dado em vez de quebrar.
export async function buscarNoServidor<T>(
  path: string,
  revalidar = 600,
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      signal: AbortSignal.timeout(NO_BUILD ? 15000 : 4000),
      next: { revalidate: revalidar },
    });
    if (!res.ok) {
      console.warn(`[api] ${path} respondeu ${res.status}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[api] ${path} falhou: ${String(err)}`);
    return null;
  }
}

export interface CategoriaArvore {
  NM_CATEGORIA: string;
  DS_SLUG: string;
  DS_URL_IMAGEM: string | null;
  other_CATEGORIA?: CategoriaArvore[];
}

// Tira HTML e espaços extras e corta num tamanho bom pra descrição de busca.
export function resumirTexto(texto: string | null | undefined, limite = 155) {
  const limpo = (texto ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (limpo.length <= limite) return limpo;
  return `${limpo.slice(0, limite - 1).trimEnd()}…`;
}

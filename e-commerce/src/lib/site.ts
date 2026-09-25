// Endereço público da loja, usado em links absolutos (preview de link no
// WhatsApp/Instagram, sitemap, robots).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.zephirajoias.com.br";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Busca na API a partir do servidor (metadados, sitemap). Timeout curto e
// null em qualquer falha: preview de link nunca pode derrubar a página.
export async function buscarNoServidor<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 600 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
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

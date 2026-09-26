import { buscarNoServidor, type CategoriaArvore } from "@/lib/site";

// Configuração pública da loja (Configurações Gerais no admin). Os campos
// comerciais (frete grátis, parcelas, CNPJ...) podem não vir: nesse caso a
// loja simplesmente não mostra a informação, em vez de inventar um valor.
export interface ConfigPublica {
  NM_LOJA: string | null;
  DS_URL_LOGO: string | null;
  DS_URL_FAVICON: string | null;
  NR_TELEFONE?: string | null;
  DS_EMAIL_SUPORTE?: string | null;
  VL_FRETE_GRATIS_MINIMO?: string | number | null;
  NR_PARCELAS_SEM_JUROS?: number | null;
  NM_RAZAO_SOCIAL?: string | null;
  NR_CNPJ?: string | null;
  DS_ENDERECO_LOJA?: string | null;
  DS_INSTAGRAM?: string | null;
}

export interface DadosLoja {
  config: ConfigPublica | null;
  categorias: CategoriaArvore[];
}

// Buscado no servidor pelo layout raiz e entregue pro resto da loja pelo
// LojaContext, então header, rodapé e cards não fazem pedido nenhum à API.
export async function carregarDadosLoja(): Promise<DadosLoja> {
  const [config, categorias] = await Promise.all([
    buscarNoServidor<ConfigPublica>("/configuracoes/publicas", 300),
    buscarNoServidor<CategoriaArvore[]>("/products/categorias", 300),
  ]);
  return { config, categorias: categorias ?? [] };
}

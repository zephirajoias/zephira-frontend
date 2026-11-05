import { BannerCarousel, type BannerSlide } from "@/components/BannerCarousel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProdutoCard, type ProdutoResumo } from "@/components/ProdutoCard";
import { formatarPreco } from "@/lib/formato";
import { carregarDadosLoja } from "@/lib/loja";
import { buscarNoServidor } from "@/lib/site";
import Link from "next/link";

type Lista = { data: ProdutoResumo[] };

// Fotos padrão dos círculos "Navegue por Categorias": usadas só enquanto a
// categoria não tiver foto própria cadastrada em admin → Categorias (a
// de Colares estava quebrada — Unsplash tirou do ar a foto antiga — por
// isso trocada por uma que existe). Assim que a loja subir uma foto pela
// categoria, essa foto daqui para de ser usada (ver CIRCULOS abaixo).
const FOTO_RESERVA: Record<string, string> = {
  aneis: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=400&h=400&fit=crop",
  brincos: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&h=400&fit=crop",
  colares: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=400&h=400&fit=crop",
  pulseiras: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&h=400&fit=crop",
};
const ORDEM_CIRCULOS = [
  { nome: "Anéis", slug: "aneis" },
  { nome: "Brincos", slug: "brincos" },
  { nome: "Colares", slug: "colares" },
  { nome: "Pulseiras", slug: "pulseiras" },
];

// Banner do topo (carrossel) e fotos de "Combinações Perfeitas": fotos de
// reserva usadas enquanto a loja não sobe as próprias em admin →
// Configurações Gerais → Imagens da Home (ver DS_BANNERS_HOME e
// DS_URL_FOTO_COMBINACAO_1/2 em ConfigPublica).
const BANNER_HOME_RESERVA: BannerSlide[] = [
  {
    url: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2070&auto=format&fit=crop",
    link: null,
  },
];
const COMBINACAO_1_RESERVA =
  "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=600&h=800&fit=crop";
const COMBINACAO_2_RESERVA =
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&h=800&fit=crop";


// Home montada no servidor (ao lado da API): chega pronta pro cliente e pro
// Google, sem "Carregando...".
export default async function ZephiraHome() {
  const [{ config, categorias }, novidades] = await Promise.all([
    carregarDadosLoja(),
    buscarNoServidor<Lista>("/products?limit=8", 60),
  ]);

  const produtos = novidades?.data ?? [];
  const CIRCULOS = ORDEM_CIRCULOS.map((c) => ({
    ...c,
    img:
      categorias.find((cat) => cat.DS_SLUG === c.slug)?.DS_URL_IMAGEM ||
      FOTO_RESERVA[c.slug],
  }));

  const banners = ((): BannerSlide[] => {
    if (!config?.DS_BANNERS_HOME) return BANNER_HOME_RESERVA;
    try {
      const lista = JSON.parse(config.DS_BANNERS_HOME);
      return Array.isArray(lista) && lista.length > 0
        ? lista
        : BANNER_HOME_RESERVA;
    } catch {
      return BANNER_HOME_RESERVA;
    }
  })();

  const freteGratis = Number(config?.VL_FRETE_GRATIS_MINIMO) || 0;
  const parcelas = config?.NR_PARCELAS_SEM_JUROS ?? 3;
  const avisos = [
    freteGratis > 0 && `Frete grátis acima de ${formatarPreco(freteGratis)}`,
    parcelas > 1 && `Até ${parcelas}x sem juros`,
    "Enviamos para todo Brasil",
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-bg-light font-display text-text-main flex flex-col">
      <div className="bg-primary text-bg-dark text-center py-2 px-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase flex flex-col sm:flex-row sm:justify-center sm:gap-4">
        {avisos.map((aviso, i) => (
          <span key={aviso} className="flex items-center justify-center gap-4">
            {i > 0 && <span className="hidden sm:inline opacity-50">|</span>}
            {aviso}
          </span>
        ))}
      </div>

      <Header />

      <main className="flex-1 flex flex-col">
        <BannerCarousel slides={banners} />

        <section className="py-16 sm:py-24 max-w-[1200px] mx-auto w-full px-4">
          <h2 className="text-center text-xl sm:text-2xl font-black text-text-main uppercase tracking-widest mb-12">
            Navegue por Categorias
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 justify-items-center">
            {CIRCULOS.map((cat) => (
              <Link
                key={cat.nome}
                href={`/categoria/${cat.slug}`}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border border-slate-200 p-2 group-hover:border-primary transition-colors duration-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-50">
                    <img
                      src={cat.img}
                      alt={cat.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <span className="mt-4 text-sm sm:text-base font-bold text-text-main group-hover:text-primary transition-colors">
                  {cat.nome}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-primary w-full py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 sm:gap-6">
              <img
                src={config?.DS_URL_FOTO_COMBINACAO_1 || COMBINACAO_1_RESERVA}
                alt="Combinação de Colares 1"
                className="w-full h-full object-cover rounded-xl sm:rounded-3xl shadow-lg"
              />
              <img
                src={config?.DS_URL_FOTO_COMBINACAO_2 || COMBINACAO_2_RESERVA}
                alt="Combinação de Colares 2"
                className="w-full h-full object-cover rounded-xl sm:rounded-3xl shadow-lg mt-8"
              />
            </div>

            <div className="w-full md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start text-white">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-widest mb-4">
                Combinações Perfeitas
              </h2>
              <p className="text-sm sm:text-base font-bold mb-10 tracking-widest opacity-90">
                Descubra nossos conjuntos
              </p>
              <Link
                href="/categoria/conjuntos"
                className="bg-white/40 hover:bg-white text-bg-dark font-black uppercase tracking-widest text-sm py-4 px-10 rounded-full transition-all shadow-md hover:shadow-xl"
              >
                Ver Conjuntos
              </Link>
            </div>
          </div>
        </section>

        <section
          id="novidades"
          className="py-16 sm:py-24 max-w-[1200px] mx-auto w-full px-4 scroll-mt-24"
        >
          <h2 className="text-center text-xl sm:text-2xl font-black text-text-main uppercase tracking-widest mb-12">
            Novidades
          </h2>

          {produtos.length === 0 ? (
            <p className="text-center text-slate-400 font-bold py-10">
              Nenhum produto cadastrado ainda.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16">
              {produtos.map((produto) => (
                <ProdutoCard
                  key={produto.CD_PRODUTO}
                  produto={produto}
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProdutoCard, type ProdutoResumo } from "@/components/ProdutoCard";
import { formatarPreco } from "@/lib/formato";
import { carregarDadosLoja } from "@/lib/loja";
import { buscarNoServidor } from "@/lib/site";
import Link from "next/link";

type Lista = { data: ProdutoResumo[] };

// Fotos e categorias da home definidas pela loja; não trocar pelas fotos
// dos produtos (já foi feito e revertido a pedido da loja em 2026-09-26).
const CIRCULOS = [
  {
    nome: "Anéis",
    slug: "aneis",
    img: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=400&h=400&fit=crop",
  },
  {
    nome: "Brincos",
    slug: "brincos",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&h=400&fit=crop",
  },
  {
    nome: "Colares",
    slug: "colares",
    img: "https://images.unsplash.com/photo-1599643478524-fb66f70000cb?q=80&w=400&h=400&fit=crop",
  },
  {
    nome: "Pulseiras",
    slug: "pulseiras",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&h=400&fit=crop",
  },
];


// Home montada no servidor (ao lado da API): chega pronta pro cliente e pro
// Google, sem "Carregando...".
export default async function ZephiraHome() {
  const [{ config }, novidades] = await Promise.all([
    carregarDadosLoja(),
    buscarNoServidor<Lista>("/products?limit=8", 60),
  ]);

  const produtos = novidades?.data ?? [];

  const freteGratis = Number(config?.VL_FRETE_GRATIS_MINIMO) || 0;
  const parcelas = config?.NR_PARCELAS_SEM_JUROS ?? 3;
  const avisos = [
    freteGratis > 0 && `Frete grátis acima de ${formatarPreco(freteGratis)}`,
    parcelas > 1 && `Até ${parcelas}x sem juros`,
    "Garantia de 1 ano",
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
        <section className="relative w-full h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden bg-bg-dark">
          <img
            src="https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=2070&auto=format&fit=crop"
            alt="Joias Zephira"
            className="w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-[2000ms]"
          />
        </section>

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
                src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=600&h=800&fit=crop"
                alt="Combinação de Colares 1"
                className="w-full h-full object-cover rounded-xl sm:rounded-3xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&h=800&fit=crop"
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

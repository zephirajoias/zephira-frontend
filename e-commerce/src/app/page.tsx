import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProdutoCard, type ProdutoResumo } from "@/components/ProdutoCard";
import { formatarPreco } from "@/lib/formato";
import { carregarDadosLoja } from "@/lib/loja";
import { buscarNoServidor } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

type Lista = { data: ProdutoResumo[] };

const CIRCULOS = [
  { nome: "Anéis", slug: "aneis" },
  { nome: "Brincos", slug: "brincos" },
  { nome: "Colares", slug: "colares" },
  { nome: "Pulseiras", slug: "pulseiras" },
];

const fotoDe = (p?: ProdutoResumo) => p?.IMAGENS_PRODUTO?.[0]?.DS_URL;

// Home montada no servidor (ao lado da API): chega pronta pro cliente e pro
// Google, sem "Carregando...". Todas as fotos são das peças da loja; uma
// categoria sem peça com foto simplesmente não aparece.
export default async function ZephiraHome() {
  const [{ config }, novidades, conjuntos, ...porCategoria] = await Promise.all([
    carregarDadosLoja(),
    buscarNoServidor<Lista>("/products?limit=8", 60),
    buscarNoServidor<Lista>("/products/categorias/conjuntos?limit=2", 300),
    ...CIRCULOS.map((c) =>
      buscarNoServidor<Lista>(`/products/categorias/${c.slug}?limit=1`, 300),
    ),
  ]);

  const produtos = novidades?.data ?? [];
  const destaque = produtos.filter((p) => fotoDe(p)).slice(0, 3);
  const circulos = CIRCULOS.map((c, i) => ({
    ...c,
    foto: fotoDe(porCategoria[i]?.data?.[0]),
  })).filter((c) => c.foto);
  const fotosConjuntos = (conjuntos?.data ?? []).map(fotoDe).filter(Boolean);

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
        {/* Banner: frase + fotos das peças mais novas */}
        <section className="bg-bg-dark text-white">
          <div className="max-w-[1200px] mx-auto px-4 py-14 sm:py-20 grid md:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <p className="text-primary text-xs font-black uppercase tracking-[0.3em] mb-4">
                Nova coleção
              </p>
              <h1 className="text-3xl sm:text-5xl font-black leading-tight text-balance mb-5">
                Joias para usar todo dia e guardar para sempre
              </h1>
              <p className="text-sm sm:text-base text-white/70 mb-8 max-w-md">
                Prata 925, banhadas a ouro e aço inox. Peças com garantia de 1
                ano e envio para todo o Brasil.
              </p>
              <Link
                href="#novidades"
                className="bg-primary text-bg-dark font-black uppercase tracking-widest text-sm py-4 px-10 rounded-full hover:brightness-110 transition-all"
              >
                Ver coleção
              </Link>
            </div>

            {destaque.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {destaque.map((p, i) => (
                  <Link
                    key={p.CD_PRODUTO}
                    href={`/produto/${p.DS_SLUG}`}
                    className={`relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl bg-white/5 ${i === 1 ? "mt-8" : ""}`}
                  >
                    <Image
                      src={fotoDe(p)!}
                      alt={p.NM_PRODUTO}
                      fill
                      sizes="(max-width: 768px) 33vw, 200px"
                      className="object-cover hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {circulos.length > 0 && (
          <section className="py-16 sm:py-24 max-w-[1200px] mx-auto w-full px-4">
            <h2 className="text-center text-xl sm:text-2xl font-black text-text-main uppercase tracking-widest mb-12">
              Navegue por Categorias
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 justify-items-center">
              {circulos.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="flex flex-col items-center group"
                >
                  <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border border-slate-200 p-2 group-hover:border-primary transition-colors duration-300">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-50">
                      <Image
                        src={cat.foto!}
                        alt={cat.nome}
                        fill
                        sizes="200px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
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
        )}

        <section className="bg-primary w-full py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {fotosConjuntos.length === 2 && (
              <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 sm:gap-6">
                {fotosConjuntos.map((foto, i) => (
                  <div
                    key={foto}
                    className={`relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-3xl shadow-lg ${i === 1 ? "mt-8" : ""}`}
                  >
                    <Image
                      src={foto!}
                      alt="Conjunto Zephira"
                      fill
                      sizes="(max-width: 768px) 50vw, 300px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
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

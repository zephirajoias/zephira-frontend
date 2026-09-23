"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ProdutoDestaque {
  CD_PRODUTO: number;
  NM_PRODUTO: string;
  DS_SLUG: string;
  VL_PRECO: string;
  VL_PRECO_PROMOCIONAL: string | null;
  IMAGENS_PRODUTO: { DS_URL: string }[];
}

export default function ZephiraHome() {
  const [produtos, setProdutos] = useState<ProdutoDestaque[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  useEffect(() => {
    let ativo = true;

    api
      .get<{ data: ProdutoDestaque[] }>("/products?limit=8")
      .then((res) => {
        if (ativo) setProdutos(res.data);
      })
      .catch(() => {
        if (ativo) setProdutos([]);
      })
      .finally(() => {
        if (ativo) setCarregandoProdutos(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const formatMoney = (v: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(v));

  const categoriasCirculares = [
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

  return (
    <div className="min-h-screen bg-bg-light font-display text-text-main flex flex-col">
      {/* 1. TOPO: PROMO BAR PRINCIPAL */}
      <div className="bg-primary text-bg-dark text-center py-2 px-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase flex flex-col sm:block">
        <span>Frete Grátis acima de R$199</span>
        <span className="hidden sm:inline mx-2">|</span>
        <span>Garantia de 1 ano</span>
        <span className="hidden sm:inline mx-2">|</span>
        <span>Prata 925</span>
      </div>

      {/* 2. HEADER PRINCIPAL */}
      <Header />

      {/* 3. HERO BANNER */}
      <main className="flex-1 flex flex-col">
        <section className="relative w-full h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden bg-bg-dark">
          <img
            src="https://images.unsplash.com/photo-1605100804763-247f67b2548e?q=80&w=2070&auto=format&fit=crop"
            alt="Joias Zephira"
            className="w-full h-full object-cover object-center opacity-85 hover:scale-105 transition-transform duration-[2000ms]"
          />
        </section>

        {/* 4. PROMO BAR CUPOM (Com um tom levemente mais claro de azul/verde) */}
        <section className="bg-[#81D8D0] py-3 sm:py-4 px-4 text-center">
          <p className="text-bg-dark font-bold text-xs sm:text-sm tracking-widest uppercase">
            Resgate o cupom para a sua primeira compra:
          </p>
        </section>

        {/* 5. NAVEGUE POR CATEGORIAS (Itens redondos) */}
        <section className="py-16 sm:py-24 max-w-[1200px] mx-auto w-full px-4">
          <h2 className="text-center text-xl sm:text-2xl font-black text-text-main uppercase tracking-widest mb-12">
            Navegue por Categorias
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 justify-items-center">
            {categoriasCirculares.map((cat) => (
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

        {/* 6. COMBINAÇÕES PERFEITAS (Bloco Azul) */}
        <section className="bg-primary w-full py-16 sm:py-24">
          <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Lado das Fotos */}
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4 sm:gap-6">
              <img
                src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=600&h=800&fit=crop"
                alt="Combinação de Colares 1"
                className="w-full h-full object-cover rounded-xl sm:rounded-3xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&h=800&fit=crop"
                alt="Combinação de Colares 2"
                className="w-full h-full object-cover rounded-xl sm:rounded-3xl shadow-lg mt-8" // Efeito de foto deslocada
              />
            </div>

            {/* Lado do Texto */}
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

        {/* 7. NOVIDADES (produtos reais, mais recentes) */}
        <section className="py-16 sm:py-24 max-w-[1200px] mx-auto w-full px-4">
          <h2 className="text-center text-xl sm:text-2xl font-black text-text-main uppercase tracking-widest mb-12">
            Novidades
          </h2>

          {carregandoProdutos && (
            <p className="text-center text-slate-400 font-bold py-10">
              Carregando...
            </p>
          )}

          {!carregandoProdutos && produtos.length === 0 && (
            <p className="text-center text-slate-400 font-bold py-10">
              Nenhum produto cadastrado ainda.
            </p>
          )}

          {!carregandoProdutos && produtos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16">
              {produtos.map((produto, i) => {
                const imagem =
                  produto.IMAGENS_PRODUTO?.[0]?.DS_URL ?? "/placeholder.png";
                const precoFinal =
                  produto.VL_PRECO_PROMOCIONAL ?? produto.VL_PRECO;

                return (
                  <Link
                    key={produto.CD_PRODUTO}
                    href={`/produto/${produto.DS_SLUG}`}
                    className="flex flex-col group"
                  >
                    <div className="relative aspect-square mb-4 overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100 ring-1 ring-slate-100 group-hover:shadow-xl transition-all duration-500">
                      <Image
                        src={imagem}
                        alt={produto.NM_PRODUTO}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        loading={i < 4 ? "eager" : "lazy"}
                      />
                    </div>
                    <div className="flex flex-col items-center text-center px-2">
                      <h3 className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {produto.NM_PRODUTO}
                      </h3>
                      <p className="text-base sm:text-lg font-black text-text-main tracking-tight">
                        {formatMoney(precoFinal)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* 8. FOOTER MELHORADO */}
      <Footer />
    </div>
  );
}

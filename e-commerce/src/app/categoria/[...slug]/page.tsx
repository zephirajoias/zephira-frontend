"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const FILTROS = {
  material: ["Prata (925)", "Ouro", "Aço"],
  publico: ["Feminino", "Masculino", "Infantil"],
  acabamento: ["Folheados", "Banhados"],
};

const PRODUTOS_MOCK = Array(12).fill({
  id: "80274",
  nome: "ARGOLA ZEPHIRA OURO - 80274",
  slug: "argola-zephira-ouro-80274",
  preco: 41.82,
  parcelas: "3x de R$ 13,94 sem juros",
  pix: "R$ 40,56 com PIX (-3%)",
  imagem:
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop",
});

export default function ListagemProdutosPage() {
  const [preco, setPreco] = useState(500);
  const params = useParams();

  const pathArray = Array.isArray(params.slug) ? params.slug : [params.slug];
  const categoriaNome = pathArray[0] || "Produtos";
  const subCategoriaNome = pathArray[1] || "";

  return (
    <div className="min-h-screen bg-white font-display text-text-main flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted mb-8 flex items-center">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-text-main font-bold">{categoriaNome}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* BARRA LATERAL COM FUNDO TURQUESA */}
          <aside className="w-full lg:w-72 shrink-0 bg-primary rounded-2xl p-6 sm:p-8 space-y-12 text-bg-dark h-fit shadow-lg">
            {/* Filtro: Material */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-center border-b border-bg-dark/10 pb-2">
                Tipo de Material
              </h3>
              <div className="space-y-4">
                {FILTROS.material.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-white rounded bg-white/20 checked:bg-white transition-all shadow-sm"
                      />
                      <span className="material-symbols-outlined absolute text-primary text-[18px] opacity-0 peer-checked:opacity-100 pointer-events-none font-black">
                        check
                      </span>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro: Público */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-center border-b border-bg-dark/10 pb-2">
                Público
              </h3>
              <div className="space-y-4">
                {FILTROS.publico.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-white rounded bg-white/20 checked:bg-white transition-all shadow-sm"
                      />
                      <span className="material-symbols-outlined absolute text-primary text-[18px] opacity-0 peer-checked:opacity-100 pointer-events-none font-black">
                        check
                      </span>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro: Faixa de Preço */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-center border-b border-bg-dark/10 pb-2">
                Faixa de Preço
              </h3>
              <div className="px-2">
                <div className="relative flex items-center h-1 bg-bg-dark rounded-full mb-6">
                  <div className="absolute left-0 w-2 h-2 bg-bg-dark rounded-full -translate-x-1/2"></div>
                  <div className="absolute right-0 w-2 h-2 bg-bg-dark rounded-full translate-x-1/2"></div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    value={preco}
                    onChange={(e) => setPreco(parseInt(e.target.value))}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {/* Slider visual handle */}
                  <div
                    className="absolute h-4 w-4 bg-white border-2 border-bg-dark rounded-full shadow-md"
                    style={{
                      left: `${(preco / 5000) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-widest bg-bg-dark/5 py-2 rounded-lg">
                    De R$ 50 até R$ {preco}
                  </p>
                </div>
              </div>
            </div>

            {/* Filtro: Acabamento */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-center border-b border-bg-dark/10 pb-2">
                Acabamento
              </h3>
              <div className="space-y-4">
                {FILTROS.acabamento.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-white rounded bg-white/20 checked:bg-white transition-all shadow-sm"
                      />
                      <span className="material-symbols-outlined absolute text-primary text-[18px] opacity-0 peer-checked:opacity-100 pointer-events-none font-black">
                        check
                      </span>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-tight group-hover:translate-x-1 transition-transform">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] bg-bg-dark text-white rounded-xl shadow-lg hover:bg-black transition-all active:scale-95">
              Limpar Filtros
            </button>
          </aside>

          {/* LISTAGEM DE PRODUTOS */}
          <section className="flex-1">
            <div className="text-center lg:text-left mb-12">
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-[0.1em] text-text-main">
                {categoriaNome}
              </h1>
              <p className="text-[11px] font-bold text-text-muted mt-3 uppercase tracking-[0.3em]">
                (3000 produtos encontrados)
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-20">
              {PRODUTOS_MOCK.map((produto, i) => (
                <Link
                  href={`/produto/${produto.slug}`}
                  key={i}
                  className="flex flex-col group animate-in fade-in slide-in-from-bottom-6 duration-700"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="relative aspect-square mb-6 overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-slate-100 ring-1 ring-slate-100 group-hover:shadow-2xl transition-all duration-500">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-5 left-5 bg-primary text-bg-dark text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-md">
                      Destaque
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center px-2">
                    <h3 className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                      {produto.nome}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-lg sm:text-xl font-black text-text-main tracking-tight">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {produto.parcelas}
                      </p>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                        {produto.pix}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Paginação */}
            <div className="mt-24 flex justify-center items-center gap-6">
              <button className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all shadow-sm">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="flex items-center gap-4">
                <span className="text-sm font-black text-primary border-b-2 border-primary pb-1">
                  01
                </span>
                <span className="text-sm font-bold text-slate-300 hover:text-text-main cursor-pointer transition-colors">
                  02
                </span>
                <span className="text-sm font-bold text-slate-300 hover:text-text-main cursor-pointer transition-colors">
                  03
                </span>
              </div>
              <button className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all shadow-sm">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useState } from "react";

export default function ZephiraHome() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categoriasMenu = [
    "Brincos",
    "Anéis",
    "Colares",
    "Pulseiras",
    "Conjuntos",
  ];

  const categoriasCirculares = [
    {
      nome: "Anéis",
      img: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=400&h=400&fit=crop",
    },
    {
      nome: "Brincos",
      img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&h=400&fit=crop",
    },
    {
      nome: "Colares",
      img: "https://images.unsplash.com/photo-1599643478524-fb66f70000cb?q=80&w=400&h=400&fit=crop",
    },
    {
      nome: "Pulseiras",
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
              <div
                key={cat.nome}
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
              </div>
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
              <button className="bg-white/40 hover:bg-white text-bg-dark font-black uppercase tracking-widest text-sm py-4 px-10 rounded-full transition-all shadow-md hover:shadow-xl">
                Ver Conjuntos
              </button>
            </div>
          </div>
        </section>

        {/* 7. MAIS VENDIDOS (Itens redondos idênticos à categoria) */}
        <section className="py-16 sm:py-24 max-w-[1200px] mx-auto w-full px-4">
          <h2 className="text-center text-xl sm:text-2xl font-black text-text-main uppercase tracking-widest mb-12">
            Mais Vendidos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12 justify-items-center">
            {categoriasCirculares.map((cat, i) => (
              <div
                key={i}
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
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 8. FOOTER MELHORADO */}
      <Footer />
    </div>
  );
}

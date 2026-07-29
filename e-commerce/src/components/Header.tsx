"use client";

import { Logo } from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

// Estrutura de dados baseada na sua lista
const MENU_ESTRUTURA = [
  {
    nome: "Brincos",
    slug: "brincos",
    sub: ["Prata", "Ouro", "Aço"],
  },
  {
    nome: "Colares",
    slug: "colares",
    sub: ["Prata", "Ouro", "Aço"],
  },
  {
    nome: "Pulseiras",
    slug: "pulseiras",
    sub: ["Prata", "Ouro", "Aço"],
  },
  {
    nome: "Anéis",
    slug: "aneis",
    sub: ["Prata", "Ouro", "Aço"],
  },
  {
    nome: "Conjuntos",
    slug: "conjuntos",
    sub: ["Prata", "Ouro", "Aço"],
  },
  {
    nome: "Tornozeleiras",
    slug: "tornozeleiras",
    sub: ["Prata", "Ouro", "Aço"],
  },
];

const CATEGORIAS_EXTRAS = [
  { nome: "Masculino", slug: "masculino" },
  { nome: "Feminino", slug: "feminino" },
  { nome: "Infantil", slug: "infantil" },
  { nome: "Prata 925", slug: "prata-925" },
  { nome: "Folheados", slug: "folheados" },
  { nome: "Banhados", slug: "banhados" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const { user } = useAuth();
  const { totalItems } = useCart();

  // Helper para fechar o menu mobile ao clicar em um link
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenMobileSub(null);
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm font-display">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24 gap-4 lg:gap-8">
          {/* LADO ESQUERDO: Hamburguer e Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-text-main focus:outline-none transition-transform active:scale-95"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>

            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center justify-center transition-transform hover:opacity-90 active:scale-95"
            >
              <Logo className="text-xl sm:text-2xl" />
            </Link>
          </div>

          {/* CENTRO: Menu Desktop com Dropdown */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-7">
            {MENU_ESTRUTURA.map((item) => (
              <div
                key={item.nome}
                className="relative group h-24 flex items-center"
              >
                <Link
                  href={`/categoria/${item.slug}`}
                  className="flex items-center gap-0.5 text-[13px] font-bold text-text-main group-hover:text-primary transition-colors uppercase tracking-wider"
                >
                  {item.nome}
                  <span className="material-symbols-outlined text-[18px] text-text-muted group-hover:rotate-180 transition-transform duration-300">
                    expand_more
                  </span>
                </Link>

                <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-slate-100 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="py-2 flex flex-col">
                    {item.sub.map((subItem) => (
                      <Link
                        key={subItem}
                        href={`/categoria/${item.slug}/${subItem
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")}`}
                        className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors border-b border-slate-50 last:border-0"
                      >
                        {item.nome} em {subItem}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="relative group h-24 flex items-center">
              <span className="flex items-center gap-0.5 text-[13px] font-bold text-text-main cursor-default uppercase tracking-wider group-hover:text-primary">
                Coleções
                <span className="material-symbols-outlined text-[18px] text-text-muted group-hover:rotate-180 transition-transform duration-300">
                  expand_more
                </span>
              </span>
              <div className="absolute top-full left-0 w-48 bg-white shadow-xl border border-slate-100 rounded-b-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div className="py-2 flex flex-col">
                  {CATEGORIAS_EXTRAS.map((extra) => (
                    <Link
                      key={extra.slug}
                      href={`/categoria/${extra.slug}`}
                      className="px-5 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors border-b border-slate-50 last:border-0"
                    >
                      {extra.nome}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* LADO DIREITO: Busca e Ícones */}
          <div className="flex items-center gap-3 lg:gap-5 flex-1 justify-end lg:flex-none lg:w-[320px]">
            <div className="hidden sm:flex items-center bg-slate-100 rounded-full px-4 py-2.5 flex-1 focus-within:bg-white focus-within:ring-1 focus-within:ring-primary transition-all shadow-inner">
              <span className="material-symbols-outlined text-text-muted mr-2 text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Buscar joias..."
                className="bg-transparent outline-none w-full text-sm font-medium text-text-main placeholder:text-text-muted"
              />
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={user ? "/minha-conta" : "/login"}
                className="text-text-main hover:text-primary transition-colors"
                title="Minha Conta"
              >
                <span className="material-symbols-outlined text-3xl">
                  person
                </span>
              </Link>

              <Link
                href="/carrinho"
                className="text-text-main hover:text-primary transition-colors relative"
                title="Carrinho"
              >
                <span className="material-symbols-outlined text-3xl">
                  shopping_cart
                </span>
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      key={totalItems}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white absolute w-full h-[calc(100vh-80px)] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2">
          <div className="p-4 space-y-2">
            {/* LINK DE USUÁRIO NO MENU MOBILE PARA FACILITAR O ACESSO */}
            <Link
              href={user ? "/minha-conta" : "/login"}
              onClick={closeMenu}
              className="flex items-center gap-3 py-4 px-2 text-sm font-bold text-text-main border-b border-slate-50 uppercase tracking-wider hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined">person</span>
              {user ? user.NM_USUARIO : "Minha Conta / Entrar"}
            </Link>

            {MENU_ESTRUTURA.map((item) => (
              <div key={item.nome} className="border-b border-slate-50">
                <button
                  onClick={() =>
                    setOpenMobileSub(
                      openMobileSub === item.nome ? null : item.nome,
                    )
                  }
                  className="flex items-center justify-between w-full py-4 px-2 text-sm font-bold text-text-main uppercase tracking-wider"
                >
                  {item.nome}
                  <span
                    className={`material-symbols-outlined transition-transform ${openMobileSub === item.nome ? "rotate-180" : ""}`}
                  >
                    expand_more
                  </span>
                </button>

                {openMobileSub === item.nome && (
                  <div className="bg-slate-50 rounded-lg mb-2 flex flex-col animate-in fade-in slide-in-from-top-1">
                    <Link
                      href={`/categoria/${item.slug}`}
                      onClick={closeMenu}
                      className="px-6 py-3 text-xs font-black text-primary border-b border-white"
                    >
                      Ver todos os {item.nome}
                    </Link>
                    {item.sub.map((sub) => (
                      <Link
                        key={sub}
                        href={`/categoria/${item.slug}/${sub
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")}`}
                        onClick={closeMenu}
                        className="px-6 py-3 text-xs font-bold text-slate-500 border-b border-white last:border-0"
                      >
                        {item.nome} em {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-4 pb-2 px-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
              Coleções
            </div>
            {CATEGORIAS_EXTRAS.map((extra) => (
              <Link
                key={extra.nome}
                href={`/categoria/${extra.slug}`}
                onClick={closeMenu}
                className="flex items-center justify-between py-4 px-2 text-sm font-bold text-text-main border-b border-slate-50 uppercase tracking-wider hover:text-primary"
              >
                {extra.nome}
                <span className="material-symbols-outlined text-text-muted">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

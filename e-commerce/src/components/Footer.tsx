"use client";

import { Logo } from "@/components/Logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-primary text-bg-dark pt-16 pb-8 border-t border-primary/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Topo do Footer: Logo, Links e Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Coluna 1: Logo */}
          <div className="flex flex-col items-center lg:items-start">
            <div className="w-36 h-36 bg-white rounded-full flex flex-col items-center justify-center shadow-xl mb-4 overflow-hidden p-4">
              <Logo className="text-base" />
            </div>
            <p className="text-xs font-bold opacity-80 text-center lg:text-left mt-2 px-4 lg:px-0 leading-relaxed">
              A beleza atemporal da prata 925 em joias feitas para realçar o seu
              brilho único.
            </p>
          </div>

          {/* Coluna 2: Institucional */}
          <div className="text-center lg:text-left">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">
              Institucional
            </h3>
            <ul className="space-y-4 text-xs font-bold opacity-80">
              <li>
                <Link
                  href="/sobre"
                  className="hover:underline hover:opacity-100 transition-opacity"
                >
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link
                  href="/garantia"
                  className="hover:underline hover:opacity-100 transition-opacity"
                >
                  Garantia
                </Link>
              </li>
              <li>
                <Link
                  href="/como-comprar"
                  className="hover:underline hover:opacity-100 transition-opacity"
                >
                  Como Comprar
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Ajuda e Suporte */}
          <div className="text-center lg:text-left">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">
              Ajuda e Suporte
            </h3>
            <ul className="space-y-4 text-xs font-bold opacity-80">
              <li>
                <Link
                  href="/faq"
                  className="hover:underline hover:opacity-100 transition-opacity"
                >
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link
                  href="/trocas"
                  className="hover:underline hover:opacity-100 transition-opacity"
                >
                  Trocas / Devoluções
                </Link>
              </li>
              <li>
                <Link
                  href="/contato"
                  className="hover:underline hover:opacity-100 transition-opacity"
                >
                  Fale Conosco
                </Link>
              </li>
            </ul>
          </div>

          {/* Coluna 4: Newsletter */}
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">
              Assine Nossa Newsletter
            </h3>
            <div className="w-full max-w-sm flex items-center bg-white/20 rounded-full px-4 py-2 border border-bg-dark/10 focus-within:border-bg-dark/30 transition-colors mb-4">
              <span className="material-symbols-outlined text-bg-dark mr-2 text-[18px]">
                mail
              </span>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="bg-transparent outline-none w-full text-xs font-bold text-bg-dark placeholder:text-bg-dark/60"
              />
            </div>
            <button className="bg-bg-light/40 hover:bg-bg-light text-bg-dark font-black uppercase tracking-widest text-xs py-3 px-8 rounded-full transition-colors w-full max-w-sm active:scale-95">
              Assinar
            </button>
          </div>
        </div>

        {/* Base do Footer: Pagamentos, Copyright e Selos */}
        <div className="border-t border-bg-dark/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Formas de Pagamento (Mock) */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-80">
              Formas de Pagamento
            </h4>
            <div className="flex gap-3">
              <div className="bg-white/20 px-3 py-1 rounded text-xs font-black">
                PIX
              </div>
              <div className="bg-white/20 px-3 py-1 rounded text-xs font-black">
                VISA
              </div>
              <div className="bg-white/20 px-3 py-1 rounded text-xs font-black">
                MASTER
              </div>
            </div>
          </div>

          <div className="text-[10px] font-bold opacity-60 text-center uppercase tracking-wider">
            © {new Date().getFullYear()} Zephira Joias. Todos os direitos
            reservados.
          </div>

          {/* Selos de Segurança (Mock) */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-80">
              Segurança
            </h4>
            <div className="flex gap-3">
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-[10px] font-black">
                <span className="material-symbols-outlined text-[14px]">
                  lock
                </span>{" "}
                SSL
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded text-[10px] font-black">
                <span className="material-symbols-outlined text-[14px]">
                  verified_user
                </span>{" "}
                Google Safe
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

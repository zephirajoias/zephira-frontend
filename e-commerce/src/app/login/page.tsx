"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-bg-light font-display text-text-main flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 py-12 sm:py-20">
        {/* CARD PRINCIPAL DE LOGIN/CADASTRO */}
        <div className="w-full max-w-[480px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* SELETOR DE ABAS */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${isLogin ? "text-primary bg-white border-b-2 border-primary" : "text-slate-300 hover:text-text-main"}`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${!isLogin ? "text-primary bg-white border-b-2 border-primary" : "text-slate-300 hover:text-text-main"}`}
            >
              Cadastrar
            </button>
          </div>

          <div className="p-8 sm:p-12">
            {/* CABEÇALHO DO FORMULÁRIO */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center size-14 bg-primary/10 rounded-full mb-4 text-primary">
                <span className="material-symbols-outlined text-3xl">
                  {isLogin ? "lock_open" : "person_add"}
                </span>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-bg-dark">
                {isLogin ? "Bem-vinda de volta" : "Crie sua conta"}
              </h2>
              <p className="text-text-muted text-[11px] font-bold uppercase tracking-wider mt-2 opacity-70">
                {isLogin
                  ? "Acesse seu brilho exclusivo"
                  : "Junte-se ao universo Zephira"}
              </p>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                    Nome Completo
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-4 text-slate-300">
                      person
                    </span>
                    <input
                      type="text"
                      placeholder="Seu nome completo"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-medium text-sm transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  E-mail
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-slate-300">
                    mail
                  </span>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-medium text-sm transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Senha
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-4 text-slate-300">
                    lock
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-medium text-sm transition-all"
                  />
                </div>
                {isLogin && (
                  <div className="text-right px-2">
                    <button className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider transition-all">
                      Esqueceu a senha?
                    </button>
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="flex items-start gap-3 px-2 py-2">
                  <input
                    type="checkbox"
                    className="mt-1 w-4 h-4 rounded border-slate-300 accent-primary cursor-pointer"
                    id="terms"
                  />
                  <label
                    htmlFor="terms"
                    className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed cursor-pointer"
                  >
                    Aceito os{" "}
                    <span className="text-primary underline">
                      termos de uso
                    </span>{" "}
                    e a{" "}
                    <span className="text-primary underline">
                      política de privacidade
                    </span>
                  </label>
                </div>
              )}

              {/* BOTÃO PRINCIPAL COM ESTILO DARK PREMIUM */}
              <button className="w-full bg-bg-dark text-primary py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4 h-14">
                {isLogin ? "Acessar Conta" : "Finalizar Cadastro"}
              </button>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-4 text-[10px] font-black text-slate-200 uppercase tracking-widest">
                  ou
                </span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* SOCIAL LOGIN */}
              <button className="w-full bg-white border border-slate-100 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all text-slate-600 shadow-sm">
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  className="w-4 h-4"
                  alt="Google"
                />
                Continuar com Google
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

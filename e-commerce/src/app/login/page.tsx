"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ApiError, useAuth } from "@/context/AuthContext";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    try {
      if (isLogin) {
        await login(email, senha);
      } else {
        await register(nome, email, senha);
      }
      router.push("/minha-conta");
    } catch (err) {
      if (err instanceof ApiError) {
        setErro(err.body?.message || "Não foi possível concluir. Tente novamente.");
      } else {
        setErro("Não foi possível concluir. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light font-display text-text-main flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-8 py-12 sm:py-20">
        {/* CARD PRINCIPAL DE LOGIN/CADASTRO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-[480px] bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
        >
          {/* SELETOR DE ABAS */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => {
                setIsLogin(true);
                setErro(null);
              }}
              className={`flex-1 py-6 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 ${isLogin ? "text-primary bg-white border-b-2 border-primary" : "text-slate-300 hover:text-text-main"}`}
            >
              Entrar
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErro(null);
              }}
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

            <form className="space-y-5" onSubmit={handleSubmit}>
              {erro && (
                <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-bold rounded-2xl px-4 py-3">
                  {erro}
                </div>
              )}

              <AnimatePresence initial={false}>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                      Nome Completo
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-4 text-slate-300">
                        person
                      </span>
                      <input
                        type="text"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-medium text-sm transition-all"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    required
                    minLength={6}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 font-medium text-sm transition-all"
                  />
                </div>
              </div>

              {/* BOTÃO PRINCIPAL COM ESTILO DARK PREMIUM */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full bg-bg-dark text-primary py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4 h-14 disabled:opacity-50 disabled:pointer-events-none"
              >
                {carregando
                  ? "Aguarde..."
                  : isLogin
                    ? "Acessar Conta"
                    : "Finalizar Cadastro"}
              </button>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

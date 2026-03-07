"use client";

import api from "@/lib/api";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // O Axios já converte para JSON e usa os headers do seu api.ts
      await api.post("/admin/forgot-password", { email });

      setMessage(
        "Se este e-mail estiver cadastrado, você receberá um link de recuperação em instantes.",
      );
      setEmail("");
    } catch (err: any) {
      // Captura a mensagem de erro que vem do NestJS, se existir
      setError(
        err.response?.data?.message ||
          "Não foi possível enviar a solicitação. Verifique o endereço e tente novamente.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-display bg-[#f6f8f8] dark:bg-[#102220] min-h-screen flex flex-col items-center justify-center p-4 relative z-0 overflow-hidden">
      {/* Elementos decorativos do fundo */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#11d4c4]/5 blur-[100px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-[#11d4c4]/5 blur-[80px]"></div>
      </div>

      <div className="w-full max-w-[480px] bg-white dark:bg-[#152a28] rounded-xl shadow-[0_4px_24px_rgba(17,212,196,0.08)] overflow-hidden">
        <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#11d4c4]/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[#11d4c4] text-4xl">
              diamond
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight mb-3">
            Recuperar Senha
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            Digite o e-mail do seu usuário administrador e enviaremos um link
            seguro para redefinir sua senha.
          </p>
        </div>

        <div className="px-8 pb-10">
          <form className="flex flex-col gap-6" onSubmit={handleResetPassword}>
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="p-3 bg-[#11d4c4]/10 border border-[#11d4c4]/20 text-[#0ebcb0] text-sm font-medium rounded-lg text-center">
                {message}
              </div>
            )}

            <label className="flex flex-col gap-2">
              <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
                Endereço de E-mail
              </span>
              <div className="relative">
                <input
                  className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 pl-11 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#11d4c4]/50 focus:border-[#11d4c4] transition-all duration-200"
                  placeholder="admin@zephira.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  mail
                </span>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[#11d4c4] hover:bg-[#0ebcb0] text-[#111817] h-12 font-bold text-sm tracking-wide transition-colors duration-200 shadow-sm shadow-[#11d4c4]/20 disabled:opacity-70"
            >
              {loading ? "Processando..." : "Enviar Link de Recuperação"}
            </button>

            <div className="flex justify-center pt-2">
              <Link
                href="/login"
                className="group flex items-center text-sm font-semibold text-slate-500 hover:text-[#11d4c4] transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-[1.125rem] mr-1 transition-transform group-hover:-translate-x-1">
                  arrow_back
                </span>
                Voltar para o Login
              </Link>
            </div>
          </form>
        </div>

        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#11d4c4]/40 to-transparent"></div>
      </div>
    </div>
  );
}

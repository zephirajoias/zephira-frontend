"use client";

import api from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // Pega o token da URL

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!token) {
      setError("Token de recuperação inválido ou ausente na URL.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      // Usando seu interceptor axios
      await api.post("/admin/reset-password", {
        token,
        newPassword: password,
      });

      setMessage(
        "Senha atualizada com sucesso! Redirecionando para o login...",
      );
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      // Se o NestJS mandar um 401 (token expirado), o Axios joga pra cá
      setError(
        err.response?.data?.message || "O link é inválido ou já expirou.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleUpdatePassword}>
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

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
            Nova Senha
          </span>
          <div className="relative">
            <input
              className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 pl-11 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#11d4c4]/50 focus:border-[#11d4c4]"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              lock
            </span>
          </div>
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">
            Confirmar Nova Senha
          </span>
          <div className="relative">
            <input
              className="w-full h-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-4 pl-11 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#11d4c4]/50 focus:border-[#11d4c4]"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              lock_check
            </span>
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center rounded-lg bg-[#11d4c4] hover:bg-[#0ebcb0] text-[#111817] h-12 font-bold text-sm tracking-wide disabled:opacity-70 mt-2"
      >
        {loading ? "Atualizando..." : "Atualizar Senha"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="font-display bg-[#f6f8f8] dark:bg-[#102220] min-h-screen flex flex-col items-center justify-center p-4 relative z-0 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full bg-[#11d4c4]/5 blur-[100px]"></div>
        <div className="absolute top-[40%] -left-[10%] w-[400px] h-[400px] rounded-full bg-[#11d4c4]/5 blur-[80px]"></div>
      </div>
      <div className="w-full max-w-[480px] bg-white dark:bg-[#152a28] rounded-xl shadow-[0_4px_24px_rgba(17,212,196,0.08)] overflow-hidden">
        <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#11d4c4]/10 flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[#11d4c4] text-4xl">
              lock_reset
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight mb-3">
            Criar Nova Senha
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            Digite sua nova senha abaixo. Certifique-se de usar uma senha forte
            e segura.
          </p>
        </div>
        <div className="px-8 pb-10">
          <Suspense
            fallback={
              <div className="text-center text-slate-500">Carregando...</div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#11d4c4]/40 to-transparent"></div>
      </div>
    </div>
  );
}

"use client";

import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Estado = "verificando" | "pronto" | "invalido";

function ResetPasswordForm() {
  const [estado, setEstado] = useState<Estado>("verificando");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    // O Supabase lê sozinho o token que veio no link do e-mail (embutido
    // na URL) assim que o cliente carrega, e cria uma sessão temporária
    // de recuperação. Esse evento avisa quando isso termina.
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setEstado("pronto");
      }
    });

    // Cobre o caso do evento acima já ter disparado antes desse listener
    // ser registrado (corrida entre o parse da URL e o useEffect).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setEstado((atual) => (atual === "verificando" ? "pronto" : atual));
      }
    });

    // Se depois de alguns segundos nada aconteceu, o link não é válido
    // (expirado, já usado, ou a página foi aberta sem vir de um e-mail).
    const timeout = setTimeout(() => {
      setEstado((atual) => (atual === "verificando" ? "invalido" : atual));
    }, 4000);

    return () => {
      listener.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setMessage(
        "Senha atualizada com sucesso! Redirecionando para o login...",
      );

      // Encerra a sessão de recuperação (temporária) pra forçar o login
      // normal com a senha nova, e não deixar essa sessão viva no navegador.
      await supabase.auth.signOut();

      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Não foi possível atualizar a senha.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (estado === "verificando") {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 py-4 text-sm">
        Validando o link de recuperação...
      </div>
    );
  }

  if (estado === "invalido") {
    return (
      <div className="flex flex-col gap-4">
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-lg text-center">
          Esse link é inválido ou já expirou. Peça um novo em &quot;Esqueci
          minha senha&quot;.
        </div>
        <Link
          href="/esqueceu-senha"
          className="flex w-full items-center justify-center rounded-lg bg-[#11d4c4] hover:bg-[#0ebcb0] text-[#111817] h-12 font-bold text-sm tracking-wide transition-colors duration-200"
        >
          Pedir novo link
        </Link>
      </div>
    );
  }

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
          <ResetPasswordForm />
        </div>
        <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#11d4c4]/40 to-transparent"></div>
      </div>
    </div>
  );
}

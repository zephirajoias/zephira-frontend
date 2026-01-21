"use client";

import joia from "@/assets/photo-1573408301185-9146fe634ad0.jpg";
import api from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/admin/login", {
        DS_EMAIL: email,
        DS_SENHA: password,
      });

      if (response.status === 200) {
        const { access_token } = response.data;

        const cookiesOptions = {
          path: "/",
          secure: true,
          sameSite: "lax" as const,
          maxAge: 60 * 60 * 24,
        };

        nookies.set(null, "zephira-token", access_token, cookiesOptions);
        router.push("/");
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-display">
      {/* LADO ESQUERDO: Branding & Visual (Desktop) */}
      <div className="relative hidden lg:flex w-1/2 flex-col justify-between overflow-hidden bg-[var(--zephira-dark)]">
        {/* Imagem de Fundo (Joalheria/Textura) */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={joia}
            alt="Textura luxuosa de diamante e esmeralda"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[var(--zephira-dark)]/90 via-[var(--zephira-dark)]/40 to-transparent"></div>
        </div>

        {/* Conteúdo Sobreposto */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="size-8 text-[var(--zephira-primary)]">
              {/* Ícone de Diamante Customizado */}
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.578 8.578C5.528 11.628 3.451 15.514 2.609 19.745c-.841 4.23.591 8.616 2.242 12.6 1.65 3.985 4.446 7.391 8.032 9.788C16.47 44.53 20.687 45.81 25 45.81c4.314 0 8.53-1.28 12.117-3.676 3.586-2.397 6.382-5.803 8.032-9.788 1.651-3.985 2.083-8.37 1.242-12.601-.842-4.23-2.919-8.116-5.969-11.166L25 24 8.578 8.578Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Zephira Admin
            </span>
          </div>

          {/* Citação Inspiracional */}
          <div className="max-w-md">
            <blockquote className="text-2xl font-medium leading-relaxed italic">
              &quot;A simplicidade é o último grau de sofisticação.&quot;
            </blockquote>
            <p className="mt-4 text-sm font-bold text-[var(--zephira-primary)] tracking-widest uppercase opacity-90">
              — Dashboard v2.5
            </p>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: Formulário de Login */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24 bg-[var(--zephira-light)]">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo Mobile (Aparece só em telas pequenas) */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="size-10 text-[var(--zephira-primary)]">
              <svg
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.578 8.578C5.528 11.628 3.451 15.514 2.609 19.745c-.841 4.23.591 8.616 2.242 12.6 1.65 3.985 4.446 7.391 8.032 9.788C16.47 44.53 20.687 45.81 25 45.81c4.314 0 8.53-1.28 12.117-3.676 3.586-2.397 6.382-5.803 8.032-9.788 1.651-3.985 2.083-8.37 1.242-12.601-.842-4.23-2.919-8.116-5.969-11.166L25 24 8.578 8.578Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>

          {/* Cabeçalho */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-[var(--zephira-text)]">
              Bem-vindo de volta
            </h2>
            <p className="mt-2 text-base text-[var(--zephira-muted)]">
              Acesse o painel administrativo da Zephira.
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input: Email */}
              <div>
                <label
                  className="block text-sm font-bold leading-6 text-[var(--zephira-text)]"
                  htmlFor="email"
                >
                  Email Corporativo
                </label>
                <div className="mt-2 relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-[var(--zephira-muted)] text-[20px]">
                      mail
                    </span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border-0 py-3 pl-10 text-[var(--zephira-text)] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--zephira-primary)] sm:text-sm sm:leading-6 transition-shadow"
                  />
                </div>
              </div>

              {/* Input: Senha */}
              <div>
                <label
                  className="block text-sm font-bold leading-6 text-[var(--zephira-text)]"
                  htmlFor="password"
                >
                  Senha
                </label>
                <div className="mt-2 relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-[var(--zephira-muted)] text-[20px]">
                      lock
                    </span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border-0 py-3 pl-10 pr-10 text-[var(--zephira-text)] ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[var(--zephira-primary)] sm:text-sm sm:leading-6 transition-shadow"
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer group"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-[var(--zephira-muted)] group-hover:text-[var(--zephira-primary)] transition-colors text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkbox e Esqueceu Senha */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[var(--zephira-primary)] focus:ring-[var(--zephira-primary)] cursor-pointer"
                  />
                  <label
                    className="ml-2 block text-sm text-[var(--zephira-text)]"
                    htmlFor="remember-me"
                  >
                    Lembrar-me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="#"
                    className="font-bold text-[var(--zephira-primary)] hover:opacity-80 transition-opacity"
                  >
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>

              {/* Botão de Submit */}
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-[var(--zephira-primary)] px-3 py-3.5 text-sm font-bold leading-6 text-white shadow-sm hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--zephira-primary)] transition-all duration-200"
                >
                  Acessar Sistema
                </button>
              </div>
            </form>
          </div>

          {/* Footer Mobile */}
          <div className="mt-10 text-center">
            <p className="text-xs text-[var(--zephira-muted)]">
              © 2024 Zephira Jewelry. Sistema seguro.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

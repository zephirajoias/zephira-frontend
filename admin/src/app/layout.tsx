import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const METADATA_BASE: Metadata = {
  title: "Zephira - Admin",
  description: "Exclusive access for store management.",
};

// Favicon é configurável em Configurações Gerais. Busca com timeout curto e
// cai pro ícone padrão se o backend estiver fora do ar ou lento (evita
// travar o carregamento do admin por causa disso).
export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/configuracoes/publicas`, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return METADATA_BASE;

    const config = await res.json();
    if (!config?.DS_URL_FAVICON) return METADATA_BASE;

    return { ...METADATA_BASE, icons: { icon: config.DS_URL_FAVICON } };
  } catch {
    return METADATA_BASE;
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        {/* Ícones do Google */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} font-display antialiased`}>
        {children}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light" // ou "dark"
        />
      </body>
    </html>
  );
}

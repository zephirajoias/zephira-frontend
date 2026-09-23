import { PageTransition } from "@/components/PageTransition";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

// Configuração da fonte Manrope mapeando para a variável que você usou no CSS
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

// Configuração de SEO base para a loja
const METADATA_BASE: Metadata = {
  title: "Zephira Joias | Elegância e Sofisticação",
  description:
    "Descubra a coleção exclusiva de joias em Prata 925 da Zephira. Brincos, anéis, colares e pulseiras com Frete Grátis e Garantia de 1 ano.",
  keywords: ["Joias", "Prata 925", "Anéis", "Colares", "Zephira", "Semijoias"],
};

// Favicon é configurável em Configurações Gerais no admin. Busca com timeout
// curto e cai pro ícone padrão do navegador se o backend estiver fora do ar
// ou lento (evita travar o carregamento da loja por causa disso).
export async function generateMetadata(): Promise<Metadata> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
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

// Viewport otimizado para e-commerce (evita que o usuário dê zoom ao clicar em inputs no iPhone)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* Importação dos ícones do Material Symbols (Versão Outlined que combinam com o design clean) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD@100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`
          ${manrope.variable} 
          antialiased 
          selection:bg-primary 
          selection:text-white
          flex 
          flex-col 
          min-h-screen
        `}
      >
        <AuthProvider>
          <CartProvider>
            <PageTransition>{children}</PageTransition>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

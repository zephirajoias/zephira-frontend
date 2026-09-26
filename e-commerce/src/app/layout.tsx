import { PageTransition } from "@/components/PageTransition";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { LojaProvider } from "@/context/LojaContext";
import { carregarDadosLoja } from "@/lib/loja";
import { SITE_URL } from "@/lib/site";
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
  metadataBase: new URL(SITE_URL),
  openGraph: {
    siteName: "Zephira Joias",
    locale: "pt_BR",
    type: "website",
    title: "Zephira Joias | Elegância e Sofisticação",
    description: "Joias em Prata 925, ouro e aço: brincos, anéis, colares e pulseiras.",
  },
  title: "Zephira Joias | Elegância e Sofisticação",
  description:
    "Descubra a coleção exclusiva de joias em Prata 925 da Zephira. Brincos, anéis, colares e pulseiras com Garantia de 1 ano.",
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

// Zoom liberado (acessibilidade). O zoom automático do iPhone ao tocar num
// campo é evitado pela fonte de 16px nos campos, em globals.css.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dadosLoja = await carregarDadosLoja();

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        {/* Ícones Material Symbols. display=block: até a fonte carregar o ícone
            fica invisível, em vez de aparecer a palavra ("shopping_cart"). */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD@100..700,0..1,-50..200&display=block"
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
        <LojaProvider value={dadosLoja}>
          <AuthProvider>
            <CartProvider>
              <PageTransition>{children}</PageTransition>
            </CartProvider>
          </AuthProvider>
        </LojaProvider>
      </body>
    </html>
  );
}

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import type { ConfigPublica } from "@/lib/loja";
import Link from "next/link";

export const PAGINAS_INSTITUCIONAIS = [
  { slug: "sobre", titulo: "Sobre a Zephira" },
  { slug: "como-comprar", titulo: "Como comprar" },
  { slug: "trocas", titulo: "Trocas e devoluções" },
  { slug: "garantia", titulo: "Garantia" },
  { slug: "faq", titulo: "Perguntas frequentes" },
  { slug: "contato", titulo: "Fale conosco" },
] as const;

export const apenasDigitos = (v?: string | null) => (v ?? "").replace(/\D/g, "");

// Contato vindo de Configurações Gerais. Só mostra o que estiver preenchido.
export function Contatos({ config }: { config: ConfigPublica | null }) {
  const whatsapp = apenasDigitos(config?.NR_TELEFONE);
  const instagram = (config?.DS_INSTAGRAM ?? "").replace(/^@/, "");
  const itens = [
    whatsapp && {
      rotulo: "WhatsApp",
      valor: config!.NR_TELEFONE!,
      href: `https://wa.me/${whatsapp.length <= 11 ? `55${whatsapp}` : whatsapp}`,
    },
    config?.DS_EMAIL_SUPORTE && {
      rotulo: "E-mail",
      valor: config.DS_EMAIL_SUPORTE,
      href: `mailto:${config.DS_EMAIL_SUPORTE}`,
    },
    instagram && {
      rotulo: "Instagram",
      valor: `@${instagram}`,
      href: `https://instagram.com/${instagram}`,
    },
  ].filter(Boolean) as { rotulo: string; valor: string; href: string }[];

  if (itens.length === 0) return null;
  return (
    <ul className="not-prose grid gap-3 sm:grid-cols-3 my-6">
      {itens.map((i) => (
        <li key={i.rotulo}>
          <a
            href={i.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl border border-slate-200 px-5 py-4 hover:border-primary transition-colors"
          >
            <span className="block text-[11px] font-black uppercase tracking-widest text-text-muted">
              {i.rotulo}
            </span>
            <span className="block font-bold text-text-main break-all">
              {i.valor}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PaginaInstitucional({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-display text-text-main flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <nav className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted mb-8">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-text-main font-bold">{titulo}</span>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-8 text-balance">
          {titulo}
        </h1>
        <div className="institucional space-y-5 text-[15px] leading-relaxed text-slate-600">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

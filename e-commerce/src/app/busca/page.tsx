import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProdutoCard, type ProdutoResumo } from "@/components/ProdutoCard";
import { buscarNoServidor } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Busca | Zephira Joias",
  robots: { index: false },
};

// Busca pelo nome da peça (a API já filtra com ?busca=). Montada no
// servidor, então o resultado chega pronto.
export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const termo = ((await searchParams).q ?? "").trim().slice(0, 80);
  const resultado = termo
    ? await buscarNoServidor<{ data: ProdutoResumo[]; meta: { total: number } }>(
        `/products?busca=${encodeURIComponent(termo)}&limit=48`,
        60,
      )
    : null;
  const produtos = resultado?.data ?? [];

  return (
    <div className="min-h-screen bg-white font-display text-text-main flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center lg:text-left mb-12">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-text-main text-balance">
            {termo ? `Resultados para "${termo}"` : "Buscar joias"}
          </h1>
          {termo && (
            <p className="text-[11px] font-bold text-text-muted mt-3 uppercase tracking-[0.3em]">
              {produtos.length === 1
                ? "1 produto encontrado"
                : `${produtos.length} produtos encontrados`}
            </p>
          )}
        </div>

        {termo && produtos.length === 0 && (
          <div className="text-center py-16 flex flex-col items-center gap-6">
            <p className="text-slate-500 font-medium max-w-md">
              Nenhuma peça com esse nome. Tente uma palavra só, como
              &quot;argola&quot; ou &quot;prata&quot;, ou veja as novidades.
            </p>
            <Link
              href="/#novidades"
              className="bg-primary text-bg-dark font-black uppercase tracking-widest text-xs py-3 px-8 rounded-full"
            >
              Ver novidades
            </Link>
          </div>
        )}

        {produtos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-16">
            {produtos.map((produto, i) => (
              <ProdutoCard
                key={produto.CD_PRODUTO}
                produto={produto}
                prioridade={i < 4}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

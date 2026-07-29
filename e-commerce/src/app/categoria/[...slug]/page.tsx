"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { api } from "@/lib/api";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Produto {
  CD_PRODUTO: number;
  NM_PRODUTO: string;
  DS_SLUG: string;
  VL_PRECO: string;
  VL_PRECO_PROMOCIONAL: string | null;
  IMAGENS_PRODUTO: { DS_URL: string }[];
}

interface ListaProdutosResponse {
  data: Produto[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export default function ListagemProdutosPage() {
  const params = useParams();
  const pathArray = Array.isArray(params.slug) ? params.slug : [params.slug];
  const categoriaSlug = pathArray[0] as string;

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [categoriaNome, setCategoriaNome] = useState(categoriaSlug);
  const [carregando, setCarregando] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setCarregando(true);
    setPage(1);
  }, [categoriaSlug]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      try {
        const res = await api.get<
          ListaProdutosResponse & { categoria?: { NM_CATEGORIA: string } }
        >(`/products/categorias/${categoriaSlug}?page=${page}&limit=12`);

        if (!ativo) return;
        setProdutos(res.data);
        setMeta(res.meta);
        if (res.categoria) setCategoriaNome(res.categoria.NM_CATEGORIA);
      } catch {
        if (!ativo) return;
        setProdutos([]);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [categoriaSlug, page]);

  const formatMoney = (v: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(v));

  return (
    <div className="min-h-screen bg-white font-display text-text-main flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted mb-8 flex items-center">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-text-main font-bold">{categoriaNome}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* LISTAGEM DE PRODUTOS */}
          <section className="flex-1">
            <div className="text-center lg:text-left mb-12">
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-[0.1em] text-text-main">
                {categoriaNome}
              </h1>
              <p className="text-[11px] font-bold text-text-muted mt-3 uppercase tracking-[0.3em]">
                {carregando
                  ? "Carregando..."
                  : `(${meta.total} produtos encontrados)`}
              </p>
            </div>

            {!carregando && produtos.length === 0 && (
              <p className="text-center text-slate-400 font-bold py-20">
                Nenhum produto encontrado nesta categoria.
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12 sm:gap-x-8 sm:gap-y-20">
              {produtos.map((produto, i) => {
                const imagem =
                  produto.IMAGENS_PRODUTO?.[0]?.DS_URL ??
                  "/placeholder.png";
                const precoFinal =
                  produto.VL_PRECO_PROMOCIONAL ?? produto.VL_PRECO;

                return (
                  <motion.div
                    key={produto.CD_PRODUTO}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.06 }}
                  >
                    <Link
                      href={`/produto/${produto.DS_SLUG}`}
                      className="flex flex-col group"
                    >
                      <div className="relative aspect-square mb-6 overflow-hidden rounded-[2.5rem] bg-white shadow-sm border border-slate-100 ring-1 ring-slate-100 group-hover:shadow-2xl transition-all duration-500">
                        <img
                          src={imagem}
                          alt={produto.NM_PRODUTO}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                      </div>

                      <div className="flex flex-col items-center text-center px-2">
                        <h3 className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                          {produto.NM_PRODUTO}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-lg sm:text-xl font-black text-text-main tracking-tight">
                            {formatMoney(precoFinal)}
                          </p>
                          {produto.VL_PRECO_PROMOCIONAL && (
                            <p className="text-[10px] font-bold text-slate-400 line-through">
                              {formatMoney(produto.VL_PRECO)}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Paginação */}
            {meta.totalPages > 1 && (
              <div className="mt-24 flex justify-center items-center gap-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all shadow-sm disabled:opacity-30"
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <span className="text-sm font-black text-primary">
                  {meta.page} / {meta.totalPages}
                </span>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  disabled={page >= meta.totalPages}
                  className="w-12 h-12 rounded-full border-2 border-slate-100 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary transition-all shadow-sm disabled:opacity-30"
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

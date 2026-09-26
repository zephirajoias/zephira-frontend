"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProdutoCard, type ProdutoResumo } from "@/components/ProdutoCard";
import { api } from "@/lib/api";
import { motion } from "motion/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Produto = ProdutoResumo;

interface ListaProdutosResponse {
  data: Produto[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ListagemInicial {
  data: Produto[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  categoria?: { NM_CATEGORIA: string };
}

// `inicial` é a primeira página, já buscada no servidor: a tela abre com os
// produtos prontos em vez de carregar a página e só depois pedir a lista.
export default function ListagemProdutosPage({
  inicial,
}: {
  inicial: ListagemInicial | null;
}) {
  const params = useParams();
  const pathArray = Array.isArray(params.slug) ? params.slug : [params.slug];
  const categoriaSlug = pathArray[0] as string;
  // /categoria/colares/aco -> categoriaSlug="colares", subcategoriaSlug="aco"
  const subcategoriaSlug = pathArray[1] as string | undefined;

  const [produtos, setProdutos] = useState<Produto[]>(inicial?.data ?? []);
  const [meta, setMeta] = useState(
    inicial?.meta ?? { total: 0, page: 1, totalPages: 1 },
  );
  const [categoriaNome, setCategoriaNome] = useState(
    inicial?.categoria?.NM_CATEGORIA ?? categoriaSlug,
  );
  const [carregando, setCarregando] = useState(!inicial);
  const [page, setPage] = useState(1);
  // A página 1 da categoria aberta já veio do servidor; só busca de novo
  // quando a pessoa troca de página ou de categoria.
  const usouInicial = useRef(Boolean(inicial));

  useEffect(() => {
    if (usouInicial.current) return;
    setCarregando(true);
    setPage(1);
  }, [categoriaSlug, subcategoriaSlug]);

  useEffect(() => {
    if (usouInicial.current) {
      usouInicial.current = false;
      return;
    }
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          limit: "12",
        });
        if (subcategoriaSlug) query.set("subcategoria", subcategoriaSlug);

        const res = await api.get<
          ListaProdutosResponse & { categoria?: { NM_CATEGORIA: string } }
        >(`/products/categorias/${categoriaSlug}?${query.toString()}`);

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
  }, [categoriaSlug, subcategoriaSlug, page]);


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
              {produtos.map((produto, i) => (
                <motion.div
                  key={produto.CD_PRODUTO}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.06 }}
                >
                  <ProdutoCard produto={produto} prioridade={i < 3} />
                </motion.div>
              ))}
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

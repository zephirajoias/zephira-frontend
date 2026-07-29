"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useCart } from "@/context/CartContext";
import { api, ApiError } from "@/lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Variacao {
  CD_VARIACAO: number;
  CD_SKU: string;
  DS_TAMANHO: string;
  QT_ESTOQUE: number;
}

interface Imagem {
  CD_IMAGEM: number;
  DS_URL: string;
  SN_PRINCIPAL: string;
}

interface ProdutoDetalhe {
  CD_PRODUTO: number;
  NM_PRODUTO: string;
  DS_SLUG: string;
  DS_DESCRICAO: string | null;
  VL_PRECO: string;
  VL_PRECO_PROMOCIONAL: string | null;
  IMAGENS_PRODUTO: Imagem[];
  VARIACOES_PRODUTO: Variacao[];
}

export default function ProdutoDetalhePage() {
  const params = useParams();
  const slug = params.slug as string;
  const { addToCart } = useCart();

  const [produto, setProduto] = useState<ProdutoDetalhe | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [naoEncontrado, setNaoEncontrado] = useState(false);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [variacaoSelecionada, setVariacaoSelecionada] = useState<number | null>(
    null,
  );
  const [adicionado, setAdicionado] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      setCarregando(true);
      setNaoEncontrado(false);
      try {
        const res = await api.get<ProdutoDetalhe>(`/products/${slug}`);
        if (!ativo) return;
        setProduto(res);
        const primeiraDisponivel = res.VARIACOES_PRODUTO.find(
          (v) => v.QT_ESTOQUE > 0,
        );
        setVariacaoSelecionada(primeiraDisponivel?.CD_VARIACAO ?? null);
      } catch (err) {
        if (!ativo) return;
        if (err instanceof ApiError && err.status === 404) {
          setNaoEncontrado(true);
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [slug]);

  const formatMoney = (v: string | number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(v));

  const handleAddToCart = () => {
    if (!produto || !variacaoSelecionada) return;

    const variacao = produto.VARIACOES_PRODUTO.find(
      (v) => v.CD_VARIACAO === variacaoSelecionada,
    );
    if (!variacao) return;

    const imagem =
      produto.IMAGENS_PRODUTO?.[0]?.DS_URL ?? "/placeholder.png";
    const preco = Number(
      produto.VL_PRECO_PROMOCIONAL ?? produto.VL_PRECO,
    );

    addToCart({
      CD_VARIACAO: variacao.CD_VARIACAO,
      slug: produto.DS_SLUG,
      nome: produto.NM_PRODUTO,
      tamanho: variacao.DS_TAMANHO,
      preco,
      imagem,
      estoqueDisponivel: variacao.QT_ESTOQUE,
    });

    setAdicionado(true);
    setTimeout(() => setAdicionado(false), 2000);
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-white font-display flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-32 text-slate-400 font-bold">
          Carregando...
        </main>
        <Footer />
      </div>
    );
  }

  if (naoEncontrado || !produto) {
    return (
      <div className="min-h-screen bg-white font-display flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-slate-500 font-bold">Produto não encontrado.</p>
          <Link
            href="/"
            className="bg-primary text-bg-dark px-10 py-3 rounded-full font-black uppercase tracking-widest text-xs"
          >
            Voltar para a loja
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const imagens = produto.IMAGENS_PRODUTO.length
    ? produto.IMAGENS_PRODUTO
    : [{ CD_IMAGEM: 0, DS_URL: "/placeholder.png", SN_PRINCIPAL: "1" }];
  const variacaoAtual = produto.VARIACOES_PRODUTO.find(
    (v) => v.CD_VARIACAO === variacaoSelecionada,
  );
  const semEstoque = produto.VARIACOES_PRODUTO.every(
    (v) => v.QT_ESTOQUE <= 0,
  );

  return (
    <div className="min-h-screen bg-white font-display text-text-main flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-[10px] sm:text-xs uppercase tracking-widest text-text-muted mb-8">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span className="mx-2 text-slate-300">/</span>
          <span className="text-text-main font-bold">{produto.NM_PRODUTO}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* GALERIA */}
          <div className="w-full lg:w-1/2">
            <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-100 mb-4">
              <img
                src={imagens[imagemAtiva]?.DS_URL}
                alt={produto.NM_PRODUTO}
                className="w-full h-full object-cover"
              />
            </div>
            {imagens.length > 1 && (
              <div className="flex gap-3">
                {imagens.map((img, i) => (
                  <button
                    key={img.CD_IMAGEM}
                    onClick={() => setImagemAtiva(i)}
                    className={`w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all ${i === imagemAtiva ? "border-primary" : "border-slate-100"}`}
                  >
                    <img
                      src={img.DS_URL}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMAÇÕES */}
          <div className="w-full lg:w-1/2">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-text-main mb-4">
              {produto.NM_PRODUTO}
            </h1>

            <div className="mb-8">
              <p className="text-3xl font-black text-primary">
                {formatMoney(produto.VL_PRECO_PROMOCIONAL ?? produto.VL_PRECO)}
              </p>
              {produto.VL_PRECO_PROMOCIONAL && (
                <p className="text-sm font-bold text-slate-400 line-through">
                  {formatMoney(produto.VL_PRECO)}
                </p>
              )}
            </div>

            {produto.DS_DESCRICAO && (
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                {produto.DS_DESCRICAO}
              </p>
            )}

            {produto.VARIACOES_PRODUTO.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                  Tamanho
                </h3>
                <div className="flex flex-wrap gap-3">
                  {produto.VARIACOES_PRODUTO.map((v) => (
                    <button
                      key={v.CD_VARIACAO}
                      disabled={v.QT_ESTOQUE <= 0}
                      onClick={() => setVariacaoSelecionada(v.CD_VARIACAO)}
                      className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                        variacaoSelecionada === v.CD_VARIACAO
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-100 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {v.DS_TAMANHO}
                      {v.QT_ESTOQUE <= 0 && " (esgotado)"}
                    </button>
                  ))}
                </div>
                {variacaoAtual && variacaoAtual.QT_ESTOQUE <= 5 && (
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-wider mt-2">
                    Últimas {variacaoAtual.QT_ESTOQUE} unidades
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!variacaoSelecionada || semEstoque}
              className="w-full bg-bg-dark text-primary py-4.5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl hover:scale-[1.02] active:scale-95 transition-all h-14 disabled:opacity-40 disabled:pointer-events-none"
            >
              {semEstoque
                ? "Produto esgotado"
                : adicionado
                  ? "Adicionado ✓"
                  : "Adicionar ao Carrinho"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

"use client";

import { useLoja } from "@/context/LojaContext";
import { descontoPromocao, formatarPreco, parcelasSemJuros } from "@/lib/formato";
import Image from "next/image";
import Link from "next/link";

export interface ProdutoResumo {
  CD_PRODUTO: number;
  NM_PRODUTO: string;
  DS_SLUG: string;
  VL_PRECO: string;
  VL_PRECO_PROMOCIONAL: string | null;
  IMAGENS_PRODUTO: { DS_URL: string }[];
}

// Card único de produto (home, categoria, busca). O nome vai em até duas
// linhas e em caixa normal: em caixa-alta de uma linha, "Colar ... Tamanho P"
// e "Tamanho G" ficavam iguais, cortados antes da parte que diferencia.
export function ProdutoCard({
  produto,
  prioridade = false,
  sizes = "(max-width: 640px) 50vw, (max-width: 768px) 33vw, 300px",
}: {
  produto: ProdutoResumo;
  prioridade?: boolean;
  sizes?: string;
}) {
  const { config } = useLoja();
  const imagem = produto.IMAGENS_PRODUTO?.[0]?.DS_URL ?? "/placeholder.png";
  const precoFinal = produto.VL_PRECO_PROMOCIONAL ?? produto.VL_PRECO;
  const parcelas = parcelasSemJuros(precoFinal, config?.NR_PARCELAS_SEM_JUROS);
  const desconto = descontoPromocao(produto.VL_PRECO, produto.VL_PRECO_PROMOCIONAL);

  return (
    <Link href={`/produto/${produto.DS_SLUG}`} className="flex flex-col group">
      <div className="relative aspect-square mb-4 overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100 ring-1 ring-slate-100 group-hover:shadow-xl transition-all duration-500">
        <Image
          src={imagem}
          alt={produto.NM_PRODUTO}
          fill
          sizes={sizes}
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
          priority={prioridade}
        />
        {desconto && (
          <span className="absolute top-3 right-3 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-bg-dark text-xs font-black shadow-md">
            -{desconto}%
          </span>
        )}
      </div>
      <div className="flex flex-col items-center text-center px-1">
        <h3 className="text-sm leading-snug font-semibold text-slate-600 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {produto.NM_PRODUTO}
        </h3>
        {/* Promoção: "de R$ 59,99 por" em cima do preço, pro cliente ver
            que baixou (pedido da loja em set/2026). */}
        {desconto && (
          <p className="text-xs font-medium text-slate-400">
            de <s>{formatarPreco(produto.VL_PRECO)}</s> por
          </p>
        )}
        <p
          className={`text-lg sm:text-xl font-black tracking-tight ${desconto ? "text-primary" : "text-text-main"}`}
        >
          {formatarPreco(precoFinal)}
        </p>
        {parcelas && (
          <p className="text-xs font-medium text-slate-500 mt-1">
            ou {parcelas.vezes}x de {parcelas.valor} sem juros
          </p>
        )}
      </div>
    </Link>
  );
}

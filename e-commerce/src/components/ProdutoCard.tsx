"use client";

import { useLoja } from "@/context/LojaContext";
import { formatarPreco, parcelasSemJuros } from "@/lib/formato";
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
      </div>
      <div className="flex flex-col items-center text-center px-1">
        <h3 className="text-sm leading-snug font-semibold text-slate-600 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {produto.NM_PRODUTO}
        </h3>
        <p className="text-lg sm:text-xl font-black text-text-main tracking-tight">
          {formatarPreco(precoFinal)}
        </p>
        {produto.VL_PRECO_PROMOCIONAL && (
          <p className="text-xs font-bold text-slate-400 line-through">
            {formatarPreco(produto.VL_PRECO)}
          </p>
        )}
        {parcelas && (
          <p className="text-xs font-medium text-slate-500 mt-1">
            ou {parcelas.vezes}x de {parcelas.valor} sem juros
          </p>
        )}
      </div>
    </Link>
  );
}

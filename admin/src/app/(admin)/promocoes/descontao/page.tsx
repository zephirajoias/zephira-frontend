"use client";

import api from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Categoria {
  CD_CATEGORIA: number;
  NM_CATEGORIA_DISPLAY: string;
}

// Percentuais mais usados numa liquidação, pra não precisar digitar.
const ATALHOS = [10, 15, 20, 25, 30, 40, 50];

export default function DescontaoPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaId, setCategoriaId] = useState("");
  const [percentual, setPercentual] = useState("20");
  const [aplicando, setAplicando] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const [ultimoResultado, setUltimoResultado] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("admin/buscaTodasCategorias")
      .then((res) => setCategorias(res.data))
      .catch(() => toast.error("Não consegui carregar as categorias."));
  }, []);

  const numero = Number(percentual);
  const valido = Number.isInteger(numero) && numero >= 1 && numero <= 90;
  const alvo = categoriaId
    ? categorias.find((c) => String(c.CD_CATEGORIA) === categoriaId)
        ?.NM_CATEGORIA_DISPLAY
    : "todas as peças ativas da loja";

  const aplicar = async () => {
    if (!valido) return;
    const confirmado = window.confirm(
      `Aplicar ${numero}% de desconto em ${alvo}?\n\nIsso substitui qualquer promoção já configurada nessas peças (não acumula).`,
    );
    if (!confirmado) return;

    setAplicando(true);
    try {
      const { data } = await api.post("admin/produtos/promocao-em-massa", {
        percentual: numero,
        ...(categoriaId ? { CD_CATEGORIA: Number(categoriaId) } : {}),
      });
      const msg = `${data.produtosAfetados} peça(s) com ${numero}% de desconto.`;
      toast.success(msg);
      setUltimoResultado(msg);
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.message ?? error?.message ?? "Erro desconhecido.";
      toast.error(
        `Não consegui aplicar: ${Array.isArray(mensagem) ? mensagem.join(", ") : mensagem}`,
      );
    } finally {
      setAplicando(false);
    }
  };

  const remover = async () => {
    const confirmado = window.confirm(
      `Encerrar a promoção em ${alvo}? Os preços voltam ao normal.`,
    );
    if (!confirmado) return;

    setRemovendo(true);
    try {
      const { data } = await api.delete("admin/produtos/promocao-em-massa", {
        params: categoriaId ? { cd_categoria: categoriaId } : undefined,
      });
      const msg = `Promoção encerrada em ${data.produtosAfetados} peça(s).`;
      toast.success(msg);
      setUltimoResultado(msg);
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.message ?? error?.message ?? "Erro desconhecido.";
      toast.error(
        `Não consegui encerrar: ${Array.isArray(mensagem) ? mensagem.join(", ") : mensagem}`,
      );
    } finally {
      setRemovendo(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8 pb-16">
      <header className="flex flex-col gap-2">
        <Link
          href="/promocoes"
          className="text-xs font-bold text-gray-400 hover:text-[var(--zephira-primary)] transition-colors w-fit"
        >
          ← Voltar pra Promoções
        </Link>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Descontão
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Aplica um desconto de uma vez em várias peças. Cada peça continua
          mostrando o preço normal riscado e o preço com desconto, como numa
          promoção individual.
        </p>
      </header>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
            Quais peças
          </label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] dark:text-white"
          >
            <option value="">Todas as peças ativas da loja</option>
            {categorias.map((c) => (
              <option key={c.CD_CATEGORIA} value={c.CD_CATEGORIA}>
                {c.NM_CATEGORIA_DISPLAY}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
            Desconto (%)
          </label>
          <div className="flex flex-wrap gap-2">
            {ATALHOS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPercentual(String(p))}
                className={`h-10 px-4 rounded-full text-sm font-bold transition-colors ${
                  percentual === String(p)
                    ? "bg-[var(--zephira-primary)] text-[#0f172a]"
                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
          <input
            type="number"
            min={1}
            max={90}
            value={percentual}
            onChange={(e) => setPercentual(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] dark:text-white"
          />
          {!valido && percentual !== "" && (
            <p className="text-xs font-bold text-red-500">
              Digite um número inteiro entre 1 e 90.
            </p>
          )}
        </div>

        <button
          onClick={aplicar}
          disabled={!valido || aplicando}
          className="w-full h-12 rounded-xl bg-[var(--zephira-primary)] text-[#0f172a] font-black uppercase tracking-widest text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-95 transition-all"
        >
          {aplicando ? "Aplicando..." : `Aplicar ${percentual || "—"}% em ${alvo}`}
        </button>

        <button
          onClick={remover}
          disabled={removendo}
          className="w-full h-11 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 font-bold text-sm hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-40"
        >
          {removendo ? "Encerrando..." : `Encerrar promoção em ${alvo}`}
        </button>

        {ultimoResultado && (
          <p className="text-center text-xs text-gray-400">{ultimoResultado}</p>
        )}
      </div>

      <p className="text-xs text-gray-400 leading-relaxed">
        O desconto sempre é calculado a partir do preço normal de cada peça —
        aplicar de novo com outro percentual substitui o anterior, não
        acumula. Peças que já tinham uma promoção individual (feita na edição
        do produto) recebem esse novo desconto no lugar. Pode levar até 1
        minuto pra loja mostrar os preços novos.
      </p>
    </div>
  );
}

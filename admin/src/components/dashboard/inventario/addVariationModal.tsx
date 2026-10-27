"use client";

import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import { sugestaoDeTamanho } from "@/lib/tamanhos";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// Interface simplificada do que vem da tabela pai
interface ProductParent {
  CD_PRODUTO: number; // ou cd_produto
  NM_PRODUTO: string;
  ds_imagem_thumb?: string;
  CD_SKU?: string; // Se tiver no pai
}

interface AddVariationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any; // Recebe o objeto do produto pai clicado na tabela
  onSuccess: () => void;
}

export function AddVariationModal({
  isOpen,
  onClose,
  product, // <--- Este produto vem pronto da tabela
  onSuccess,
}: AddVariationModalProps) {
  // Tamanhos marcados nos botões (toque em vários pra adicionar todos de
  // uma vez, ex: 17cm e 18cm da mesma pulseira) + um campo livre pra valor
  // fora da lista (aceita mais de um separado por vírgula).
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [valorExtra, setValorExtra] = useState("");
  const [estoque, setEstoque] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sugestaoTamanho = useMemo(
    () => sugestaoDeTamanho(product?.NM_CATEGORIA ?? product?.nm_categoria_principal),
    [product],
  );

  // Quando o modal abre com um produto, preenche os dados
  useEffect(() => {
    if (isOpen && product) {
      setSelecionados([]);
      setValorExtra("");
      setEstoque("");
    }
  }, [isOpen, product]);

  const toggleTamanho = (valor: string) => {
    setSelecionados((atual) =>
      atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor],
    );
  };

  // Junta os botões marcados com o que foi digitado no campo livre (aceita
  // vírgula pra mais de um: "40cm, 45cm"), sem repetir.
  const tamanhos = useMemo(() => {
    const doTexto = valorExtra
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    return Array.from(new Set([...selecionados, ...doTexto]));
  }, [selecionados, valorExtra]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productId = product?.CD_PRODUTO;

    if (!productId) {
      toast.error("Erro: Produto inválido.");
      return;
    }
    if (tamanhos.length === 0) return;

    setIsLoading(true);
    const falhas: string[] = [];
    // Uma chamada por tamanho (o backend cria uma variação de cada vez);
    // segue tentando os outros mesmo se um falhar, pra não perder o resto
    // do lote por causa de um SKU repetido, por exemplo.
    for (const tamanho of tamanhos) {
      try {
        await api.post(`/admin/produto/${productId}/variacao`, {
          DS_TAMANHO: tamanho,
          DS_SLUG: `${product.NM_PRODUTO}-${tamanho}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-"),
          QT_ESTOQUE: Number(estoque),
          NM_TIPO: "Tamanho",
        });
      } catch (error) {
        console.error(error);
        falhas.push(tamanho);
      }
    }
    setIsLoading(false);

    const sucessos = tamanhos.length - falhas.length;
    if (falhas.length === 0) {
      toast.success(
        sucessos === 1 ? "Variação adicionada!" : `${sucessos} variações adicionadas!`,
      );
    } else if (sucessos === 0) {
      toast.error("Não consegui adicionar. Verifique se esse tamanho já existe.");
    } else {
      toast.warn(
        `${sucessos} adicionada(s). Não deu pra adicionar: ${falhas.join(", ")} (já deve existir).`,
      );
    }

    if (sucessos > 0) {
      onSuccess();
      onClose();
    }
  };

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} panelClassName="max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#0c1a18]/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--zephira-primary)]/10 rounded-xl border border-[var(--zephira-primary)]/20">
              <span className="material-symbols-outlined text-[var(--zephira-primary)]">
                straighten
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Adicionar Variação
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Para: {product.NM_PRODUTO}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          {/* Preview do Produto (Estático, pois já sabemos qual é) */}
          <div className="flex items-center gap-4 p-4 bg-gray-50/80 dark:bg-white/5 rounded-xl border border-dashed border-gray-300 dark:border-white/10">
            <div className="relative size-14 rounded-lg overflow-hidden bg-white dark:bg-black/40 shadow-sm border border-gray-100 dark:border-white/5">
              <Image
                src={product.ds_imagem_thumb || "/placeholder.png"}
                alt={product.NM_PRODUTO}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                {product.NM_PRODUTO}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Categoria: {product.nm_categoria_principal}
              </p>
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-white/5 w-full"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tamanho */}
            <div className="col-span-2 group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                {sugestaoTamanho ? `${sugestaoTamanho.rotulo} / Tamanho *` : "Tamanho / Variação *"}
              </label>
              {sugestaoTamanho && (
                <>
                  <p className="text-[11px] text-gray-400 mb-2">
                    Toque em quantos precisar — todos entram de uma vez.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sugestaoTamanho.valores.map((valor) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => toggleTamanho(valor)}
                        className={`h-8 min-w-8 px-2 rounded-lg text-sm font-bold transition-colors ${
                          selecionados.includes(valor)
                            ? "bg-[var(--zephira-primary)] text-white"
                            : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                        }`}
                      >
                        {valor}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="relative">
                <input
                  value={valorExtra}
                  onChange={(e) => setValorExtra(e.target.value)}
                  placeholder={
                    sugestaoTamanho
                      ? "Outro valor? Separe por vírgula"
                      : "Ex: 18, 20, P, M, 45cm"
                  }
                  className="w-full h-11 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]/20 transition-all font-bold"
                  autoFocus
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                  format_size
                </span>
              </div>
            </div>

            {/* Estoque */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                Estoque Inicial *
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  placeholder="0"
                  className="w-full h-11 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]/20 transition-all"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                  inventory_2
                </span>
              </div>
              {tamanhos.length > 1 && (
                <p className="text-[11px] text-gray-400 mt-1.5">
                  Vale pra cada um dos {tamanhos.length} tamanhos marcados.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 mt-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || tamanhos.length === 0 || !estoque}
              className="px-6 py-2.5 rounded-xl bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold text-sm shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                "Salvando..."
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>{" "}
                  {tamanhos.length > 1 ? `Adicionar ${tamanhos.length}` : "Adicionar"}
                </>
              )}
            </button>
          </div>
        </form>
    </Modal>
  );
}

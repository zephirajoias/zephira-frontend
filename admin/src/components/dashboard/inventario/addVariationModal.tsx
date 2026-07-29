"use client";

import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import Image from "next/image";
import { useEffect, useState } from "react";
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
  // Form States
  const [valorVariacao, setValorVariacao] = useState("");
  const [estoque, setEstoque] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quando o modal abre com um produto, preenche os dados
  useEffect(() => {
    if (isOpen && product) {
      // Tenta gerar um SKU sugerido se o pai tiver SKU, senão deixa em branco
      const baseSku = product.CD_SKU || product.cd_sku || "";
      setValorVariacao("");
      setEstoque("");
    }
  }, [isOpen, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productId = product?.CD_PRODUTO;

    if (!productId) {
      toast.error("Erro: Produto inválido.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/admin/produto/${productId}/variacao`, {
        DS_TAMANHO: valorVariacao,
        DS_SLUG: `${product.NM_PRODUTO}-${valorVariacao}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
        QT_ESTOQUE: Number(estoque),
        NM_TIPO: "Tamanho",
      });

      toast.success("Variação adicionada!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao adicionar variação");
    } finally {
      setIsLoading(false);
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
                src={product.ds_imagem_thumb || "/assets/placeholder.png"}
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
                Tamanho / Variação *
              </label>
              <div className="relative">
                <input
                  value={valorVariacao}
                  onChange={(e) => setValorVariacao(e.target.value)}
                  placeholder="Ex: 18, 20, P, M, 45cm"
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
              disabled={isLoading || !valorVariacao || !estoque}
              className="px-6 py-2.5 rounded-xl bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold text-sm shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                "Salvando..."
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    add_circle
                  </span>{" "}
                  Adicionar
                </>
              )}
            </button>
          </div>
        </form>
    </Modal>
  );
}

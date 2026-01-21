"use client";

import api from "@/lib/api";
import { useState } from "react";

interface DeleteVariacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any; // Na verdade é a variação (InventoryItem)
  onSuccess: () => void;
}

export function DeleteVariacaoModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: DeleteVariacaoModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await api.delete(`admin/produtos/variacao/${product.CD_VARIACAO}`);

      // Feedback visual rápido
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir variação.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#102220] w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center border border-gray-100 dark:border-white/5">
        <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-2xl">delete</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Excluir Variação?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Você vai remover o tamanho <strong>{product?.DS_TAMANHO}</strong>{" "}
          (SKU: {product?.CD_SKU}). Esta ação não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? "Excluindo..." : "Sim, Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import api from "@/lib/api";
import { toast } from "react-toastify";

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess: () => void;
}

export function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: DeleteProductModalProps) {
  const handleDelete = async () => {
    try {
      console.log("Deleting product:", product);
      await api.delete(`admin/produtos/${product.CD_PRODUTO}`);

      toast.success("Produto excluído com sucesso!");

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Erro ao excluir produto.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#102220] w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center border border-gray-100 dark:border-white/5">
        <div className="size-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-2xl">delete</span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Excluir Produto?
        </h3>

        <p className="text-gray-500 text-sm mb-6">
          Você tem certeza que deseja excluir{" "}
          <strong>{product?.NM_PRODUTO}</strong>? Esta ação é irreversível.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold text-sm"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600"
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import api from "@/lib/api";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeletePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: any;
  onSuccess: () => void;
}

export function DeletePromotionModal({
  isOpen,
  onClose,
  promotion,
  onSuccess,
}: DeletePromotionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await api.delete(`/admin/promocoes/${promotion.CD_PROMOCAO}`);
      toast.success("Promoção excluída.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#102220] w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center border border-gray-100 dark:border-white/5 animate-in fade-in zoom-in-95">
        <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-2xl">
            delete_forever
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Excluir Promoção?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          A campanha <strong>{promotion?.NM_PROMOCAO}</strong> será removida
          permanentemente. O cupom <strong>{promotion?.CD_CUPOM}</strong>{" "}
          deixará de funcionar.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/20"
          >
            {isLoading ? "Excluindo..." : "Sim, Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}

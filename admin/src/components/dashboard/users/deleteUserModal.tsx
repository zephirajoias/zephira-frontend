"use client";

import api from "@/lib/api";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSuccess: () => void;
}

export function DeleteUserModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: DeleteUserModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await api.delete(`/admin/${user.CD_USUARIO}`);
      toast.success("Usuário removido com sucesso.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir usuário.");
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
            person_remove
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Remover Acesso?
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          O usuário <strong>{user?.NM_USUARIO}</strong> perderá o acesso ao
          painel administrativo imediatamente.
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
            className="flex-1 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
          >
            {isLoading ? "Excluindo..." : "Sim, Remover"}
          </button>
        </div>
      </div>
    </div>
  );
}

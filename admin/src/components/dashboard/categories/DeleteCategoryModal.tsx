"use client";

import api from "@/lib/api";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any;
  onSuccess: () => void;
}

export function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: DeleteCategoryModalProps) {
  const handleDelete = async () => {
    try {
      await api.delete(`admin/delete-categoria/${category.CD_CATEGORIA}`);
      alert("Categoria excluída com sucesso.");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir. Verifique se há produtos vinculados.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#102220] w-full max-w-sm rounded-xl p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-2xl">warning</span>
        </div>
        <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white mb-2">
          Excluir Categoria?
        </h3>
        <p className="text-[var(--zephira-muted)] text-sm mb-6">
          Você tem certeza que deseja excluir{" "}
          <strong>{category?.NM_CATEGORIA}</strong>? Esta ação não pode ser
          desfeita.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-[var(--zephira-text)] dark:text-white font-bold"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

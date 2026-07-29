"use client";

import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import { useEffect, useState } from "react";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: any; // A categoria selecionada
  onSuccess: () => void; // Para recarregar a lista
}

export function EditCategoryModal({
  isOpen,
  onClose,
  category,
  onSuccess,
}: EditCategoryModalProps) {
  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");

  // Atualiza o form quando a categoria muda
  useEffect(() => {
    if (category) {
      setNome(category.NM_CATEGORIA || "");
      setSlug(category.DS_SLUG || "");
    }
  }, [category]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`admin/update-categoria/${category.CD_CATEGORIA}`, {
        NM_CATEGORIA: nome,
        DS_SLUG: slug,
      });
      alert("Categoria atualizada!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} panelClassName="max-w-md">
      <div className="p-6">
        <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white mb-4">
          Editar Categoria
        </h3>
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-1 text-[var(--zephira-muted)]">
              Nome
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 bg-transparent text-[var(--zephira-text)] dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1 text-[var(--zephira-muted)]">
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border-gray-300 dark:border-white/10 bg-transparent text-[var(--zephira-text)] dark:text-white"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-[var(--zephira-text)] dark:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-[var(--zephira-primary)] text-white font-bold"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

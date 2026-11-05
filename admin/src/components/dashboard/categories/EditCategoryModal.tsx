"use client";

import { toast } from "react-toastify";
import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const [imagem, setImagem] = useState<string | null>(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Atualiza o form quando a categoria muda
  useEffect(() => {
    if (category) {
      setNome(category.NM_CATEGORIA || "");
      setSlug(category.DS_SLUG || "");
      setImagem(category.DS_URL_IMAGEM || null);
    }
  }, [category]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`admin/update-categoria/${category.CD_CATEGORIA}`, {
        NM_CATEGORIA: nome,
        DS_SLUG: slug,
      });
      toast.success("Categoria atualizada!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar.");
    }
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEnviandoFoto(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      // A instância `api` tem Content-Type: application/json como padrão
      // global, o que faz o axios converter o FormData pra JSON (perdendo
      // o arquivo). `undefined` aqui remove o padrão só nessa chamada.
      const res = await api.put(
        `admin/categorias/${category.CD_CATEGORIA}/imagem`,
        formData,
        { headers: { "Content-Type": undefined } },
      );
      setImagem(res.data.DS_URL_IMAGEM);
      toast.success("Foto da categoria atualizada!");
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar a foto.");
    } finally {
      setEnviandoFoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
            <label className="block text-sm font-bold mb-2 text-[var(--zephira-muted)]">
              Foto da categoria
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Aparece no círculo &quot;Navegue por Categorias&quot; da home,
              se essa for uma das 4 categorias mostradas ali.
            </p>
            <div className="flex items-center gap-4">
              <div className="relative size-16 rounded-full overflow-hidden border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 shrink-0">
                <Image
                  src={imagem || "/placeholder.png"}
                  alt={nome}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={enviandoFoto}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 text-sm font-bold text-[var(--zephira-text)] dark:text-white hover:border-[var(--zephira-primary)] disabled:opacity-50"
              >
                {enviandoFoto ? "Enviando..." : imagem ? "Trocar foto" : "Enviar foto"}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUploadFoto}
                accept="image/*,.heic,.heif"
                className="hidden"
              />
            </div>
          </div>
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

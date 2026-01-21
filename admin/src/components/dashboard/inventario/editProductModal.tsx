"use client";

import api from "@/lib/api";
import { Archive, Hash, Loader2, Package, Save, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onSuccess: () => void;
}

export function EditProductModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: EditProductModalProps) {
  const [nome, setNome] = useState("");
  const [sku, setSku] = useState("");
  const [tamanho, setTamanho] = useState<string>("");
  const [estoque, setEstoque] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [categorias, setCategorias] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api
        .get("admin/buscaTodasCategorias")
        .then((res) => setCategorias(res.data))
        .catch((err) => console.error(err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setNome(product.NM_PRODUTO ?? "");
      setSku(product.CD_SKU ?? "");
      setTamanho(product.DS_TAMANHO ? String(product.DS_TAMANHO) : "");
      setEstoque(product.QT_ESTOQUE ? String(product.QT_ESTOQUE) : "");
      setCategoriaId(product.CD_CATEGORIA ? String(product.CD_CATEGORIA) : "");
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put(`admin/produtos/variacao`, {
        CD_VARIACAO: product.CD_VARIACAO,
        QT_ESTOQUE: parseInt(estoque, 10),
        DS_TAMANHO: tamanho,
      });
      toast.success("Produto atualizado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Erro ao atualizar produto.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f1715]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#102220] rounded-[24px] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--zephira-primary)]/10 rounded-lg">
              <Package size={20} className="text-[var(--zephira-primary)]" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
              Editar Produto
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X
              size={20}
              className="text-gray-400 hover:text-red-500 transition-colors"
            />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Nome */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
              <Tag size={12} /> Nome do Produto
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-sm font-medium focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none transition-all text-gray-900 dark:text-white"
              placeholder="Ex: Teclado Mecânico"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SKU (Read Only) */}
            <div className="space-y-2 text-gray-400">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                <Hash size={12} /> SKU
              </label>
              <input
                value={sku}
                readOnly
                className="w-full h-12 rounded-xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 px-4 text-sm font-mono opacity-60 cursor-not-allowed text-gray-500 dark:text-gray-400 outline-none"
              />
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                <Archive size={12} /> Categoria
              </label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-medium focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white appearance-none cursor-pointer"
              >
                <option value="">Selecione...</option>
                {categorias.map((cat) => (
                  <option
                    key={cat.CD_CATEGORIA}
                    value={String(cat.CD_CATEGORIA)}
                  >
                    {cat.NM_CATEGORIA}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Preço */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                <Package size={12} /> Tamanho
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={tamanho}
                  onChange={(e) => setTamanho(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 pl-9 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none transition-all"
                />
              </div>
            </div>

            {/* Estoque */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                <Package size={12} /> Qtd. Estoque
              </label>
              <input
                type="number"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
                className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-medium focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none transition-all text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-2.5 bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] rounded-xl text-sm font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

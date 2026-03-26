"use client";

import api from "@/lib/api";
import {
  Archive,
  ChevronDown,
  DollarSign,
  FileText,
  Hash,
  ImagePlus,
  Loader2,
  Package,
  Save,
  Star,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [sku, setSku] = useState("");
  const [tamanho, setTamanho] = useState<string>("");
  const [estoque, setEstoque] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [categorias, setCategorias] = useState<any[]>([]);
  const [imagens, setImagens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setDescricao(product.DS_DESCRICAO ?? "");
      setPreco(product.VL_PRECO ? String(product.VL_PRECO) : "");
      setSku(product.CD_SKU ?? "");
      setTamanho(product.DS_TAMANHO ? String(product.DS_TAMANHO) : "");
      setEstoque(product.QT_ESTOQUE ? String(product.QT_ESTOQUE) : "");
      setCategoriaId(product.CD_CATEGORIA ? String(product.CD_CATEGORIA) : "");
      setImagens(product.IMAGENS ?? []);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Atualiza dados do produto
      await api.put(`admin/produtos/${product.CD_PRODUTO}`, {
        NM_PRODUTO: nome,
        DS_DESCRICAO: descricao,
        VL_PRECO: parseFloat(preco),
        CD_CATEGORIA: parseInt(categoriaId, 10),
      });

      // 2. Atualiza dados da variação (agora incluindo SKU)
      await api.put(`admin/produtos/variacao`, {
        CD_VARIACAO: product.CD_VARIACAO,
        CD_SKU: sku,
        QT_ESTOQUE: parseInt(estoque, 10),
        DS_TAMANHO: tamanho,
      });

      toast.success("Produto atualizado com sucesso!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar produto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("files", file);
    });
    formData.append("ds_slug", product.DS_SLUG);

    try {
      const res = await api.post(
        `admin/produtos/${product.CD_PRODUTO}/imagens`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      setImagens([...imagens, ...res.data]);
      toast.success("Imagens adicionadas com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao fazer upload das imagens.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (cd_imagem: number) => {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;

    try {
      await api.delete(`admin/produtos/imagens/${cd_imagem}`);
      setImagens(imagens.filter((img) => img.CD_IMAGEM !== cd_imagem));
      toast.success("Imagem removida!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover imagem.");
    }
  };

  const handleSetPrincipal = async (cd_imagem: number) => {
    try {
      await api.put(
        `admin/produtos/${product.CD_PRODUTO}/imagens/${cd_imagem}/principal`,
      );
      setImagens(
        imagens.map((img) => ({
          ...img,
          SN_PRINCIPAL: img.CD_IMAGEM === cd_imagem ? "1" : "0",
        })),
      );
      toast.success("Imagem principal definida!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao definir imagem principal.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-[#0f1715]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#102220] rounded-[24px] shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md sticky top-0 z-10">
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
            <X size={20} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <form
            id="edit-product-form"
            onSubmit={handleSubmit}
            className="p-8 space-y-6"
          >
            {/* Seção de Imagens */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                <ImagePlus size={12} /> Imagens do Produto
              </label>

              <div className="grid grid-cols-4 gap-4">
                {imagens.map((img) => (
                  <div
                    key={img.CD_IMAGEM}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
                  >
                    <Image
                      src={img.DS_URL}
                      alt="Produto"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSetPrincipal(img.CD_IMAGEM)}
                        className={`p-1.5 rounded-lg transition-colors ${img.SN_PRINCIPAL === "1" ? "bg-yellow-500 text-white" : "bg-white/20 text-white hover:bg-yellow-500"}`}
                      >
                        <Star
                          size={14}
                          fill={img.SN_PRINCIPAL === "1" ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.CD_IMAGEM)}
                        className="p-1.5 bg-white/20 text-white hover:bg-red-500 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 hover:border-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/5 text-gray-400 transition-all"
                >
                  {isUploading ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Upload size={24} />
                      <span className="text-[10px] font-bold uppercase">Adicionar</span>
                    </>
                  )}
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleUploadImages}
                  multiple
                  accept="image/*,.heic,.heif"
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Nome */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <Tag size={12} /> Nome do Produto
                </label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-sm font-medium focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* Preço */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <DollarSign size={12} /> Preço
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-sm font-bold focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                <FileText size={12} /> Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 p-4 text-sm font-medium focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Código SKU (Editável agora) */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <Hash size={12} /> Código SKU
                </label>
                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-mono focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white"
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <Archive size={12} /> Categoria
                </label>
                <div className="relative">
                  <select
                    value={categorias.length > 0 ? categoriaId : ""}
                    onChange={(e) => setCategoriaId(e.target.value)}
                    disabled={categorias.length === 0}
                    className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-medium focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="">{categorias.length === 0 ? "Carregando..." : "Selecione..."}</option>
                    {categorias.map((cat) => (
                      <option key={cat.CD_CATEGORIA} value={String(cat.CD_CATEGORIA)}>
                        {cat.NM_CATEGORIA_DISPLAY || cat.NM_CATEGORIA}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <Package size={12} /> Tamanho
                </label>
                <input
                  type="text"
                  value={tamanho}
                  onChange={(e) => setTamanho(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                  <Package size={12} /> Qtd. Estoque
                </label>
                <input
                  type="number"
                  value={estoque}
                  onChange={(e) => setEstoque(e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-medium focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="flex justify-end gap-3 p-8 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="edit-product-form"
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-2.5 bg-[var(--zephira-primary)] text-[#0f1715] rounded-xl text-sm font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

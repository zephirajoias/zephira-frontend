"use client";

import { Modal } from "@/components/ui/Modal";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { sugestaoDeTamanho } from "@/lib/tamanhos";
import { SimulacaoRecebimento } from "./SimulacaoRecebimento";

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
  const [promocao, setPromocao] = useState("");
  const [sku, setSku] = useState("");
  const [tamanho, setTamanho] = useState<string>("");
  const [estoque, setEstoque] = useState<string>("");
  // Tamanhos marcados pra criar como variação nova (além de editar a atual).
  const [novosTamanhos, setNovosTamanhos] = useState<string[]>([]);
  const [estoqueNovos, setEstoqueNovos] = useState<string>("");
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
      setPromocao(
        product.VL_PRECO_PROMOCIONAL ? String(product.VL_PRECO_PROMOCIONAL) : "",
      );
      setSku(product.CD_SKU ?? "");
      setTamanho(product.DS_TAMANHO ? String(product.DS_TAMANHO) : "");
      setEstoque(product.QT_ESTOQUE ? String(product.QT_ESTOQUE) : "");
      setNovosTamanhos([]);
      setEstoqueNovos("");
      setCategoriaId(product.CD_CATEGORIA ? String(product.CD_CATEGORIA) : "");
      setImagens(product.IMAGENS ?? []);
    }
  }, [product]);

  const sugestaoTamanho = useMemo(
    () =>
      sugestaoDeTamanho(
        categorias.find((c) => String(c.CD_CATEGORIA) === categoriaId)
          ?.NM_CATEGORIA_DISPLAY,
      ),
    [categoriaId, categorias],
  );

  const precoNormal = Number(preco) || 0;
  const precoPromo = Number(promocao) || 0;
  const promocaoValida = precoPromo > 0 && precoPromo < precoNormal;
  const descontoPct = promocaoValida
    ? Math.round((1 - precoPromo / precoNormal) * 100)
    : 0;
  const real = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Tamanhos que outras variações desse produto já usam — não dá pra
  // marcar esses pra criar de novo (duplicaria).
  const outrosTamanhos: string[] = product?._outrosTamanhos ?? [];

  const toggleNovoTamanho = (valor: string) => {
    if (valor === tamanho || outrosTamanhos.includes(valor)) return;
    setNovosTamanhos((atual) =>
      atual.includes(valor) ? atual.filter((v) => v !== valor) : [...atual, valor],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (precoPromo > 0 && !promocaoValida) {
      toast.error("O preço promocional precisa ser menor que o preço normal.");
      return;
    }
    if (novosTamanhos.length > 0 && !estoqueNovos) {
      toast.error("Preencha o estoque inicial dos tamanhos novos marcados.");
      return;
    }
    setIsLoading(true);
    try {
      // 1. Atualiza dados do produto
      await api.put(`admin/produtos/${product.CD_PRODUTO}`, {
        NM_PRODUTO: nome,
        DS_DESCRICAO: descricao,
        VL_PRECO: parseFloat(preco),
        // Vazio tira a promoção.
        VL_PRECO_PROMOCIONAL: precoPromo > 0 ? precoPromo : null,
        CD_CATEGORIA: parseInt(categoriaId, 10),
      });

      // 2. Atualiza dados da variação (agora incluindo SKU)
      await api.put(`admin/produtos/variacao`, {
        CD_VARIACAO: product.CD_VARIACAO,
        CD_SKU: sku,
        QT_ESTOQUE: parseInt(estoque, 10),
        DS_TAMANHO: tamanho,
      });

      // 3. Cria, uma por uma, as variações novas marcadas nos botões
      const falhas: string[] = [];
      for (const novoTamanho of novosTamanhos) {
        try {
          await api.post(`/admin/produto/${product.CD_PRODUTO}/variacao`, {
            DS_TAMANHO: novoTamanho,
            DS_SLUG: `${nome}-${novoTamanho}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            QT_ESTOQUE: Number(estoqueNovos),
            NM_TIPO: "Tamanho",
          });
        } catch (err) {
          console.error(err);
          falhas.push(novoTamanho);
        }
      }

      if (falhas.length > 0) {
        toast.warn(`Produto salvo, mas não deu pra criar: ${falhas.join(", ")}.`);
      } else if (novosTamanhos.length > 0) {
        toast.success(
          `Produto atualizado e ${novosTamanhos.length} tamanho(s) novo(s) criado(s)!`,
        );
      } else {
        toast.success("Produto atualizado com sucesso!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      const mensagem =
        error?.response?.data?.message ?? error?.message ?? "Erro desconhecido.";
      toast.error(
        `Erro ao atualizar produto: ${
          Array.isArray(mensagem) ? mensagem.join(", ") : mensagem
        }`,
      );
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
      // A instância `api` tem Content-Type: application/json como padrão
      // global, o que faz o axios converter o FormData pra JSON (perdendo
      // os arquivos) em vez de deixar o navegador montar o multipart com
      // boundary. `undefined` aqui remove o padrão só nessa chamada.
      const res = await api.post(
        `admin/produtos/${product.CD_PRODUTO}/imagens`,
        formData,
        { headers: { "Content-Type": undefined } },
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      panelClassName="max-w-2xl rounded-[24px] max-h-[90vh]"
    >
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

            {/* Preço promocional: a loja mostra "de/por" e o selo de desconto */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">
                <Tag size={12} /> Preço promocional (opcional)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={promocao}
                  onChange={(e) => setPromocao(e.target.value)}
                  placeholder="Sem promoção"
                  className="flex-1 min-w-[140px] h-12 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-sm font-bold focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white"
                />
                {promocao && (
                  <button
                    type="button"
                    onClick={() => setPromocao("")}
                    className="h-12 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-500 hover:text-red-500 hover:border-red-300 transition-colors"
                  >
                    Tirar promoção
                  </button>
                )}
              </div>
              {promocaoValida ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="inline-block rounded-full bg-[var(--zephira-primary)] text-[#0f172a] font-black px-2 py-0.5 mr-2">
                    -{descontoPct}%
                  </span>
                  Na loja: de <s>{real(precoNormal)}</s> por{" "}
                  <strong className="text-gray-900 dark:text-white">
                    {real(precoPromo)}
                  </strong>
                </p>
              ) : precoPromo > 0 ? (
                <p className="text-xs font-bold text-red-500">
                  Precisa ser menor que o preço normal ({real(precoNormal)}).
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  Preencha pra colocar a peça em promoção. Vazio = preço normal.
                </p>
              )}
            </div>

            {/* Simula o que a loja recebe pelo preço que o cliente paga */}
            <SimulacaoRecebimento
              preco={promocaoValida ? precoPromo : precoNormal}
            />

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
                  <Package size={12} /> {sugestaoTamanho ? `${sugestaoTamanho.rotulo} / Tamanho` : "Tamanho"}
                </label>
                {sugestaoTamanho && (
                  <>
                    <p className="text-[11px] text-gray-400 mb-1">
                      <span className="font-bold text-[var(--zephira-primary)]">
                        {tamanho || "destacado"}
                      </span>{" "}
                      é o tamanho desta variação (edite no campo abaixo pra
                      trocar). Toque em outros tamanhos pra criar como
                      variação nova junto ao salvar.
                    </p>
                    <div className="flex flex-wrap gap-2 pb-1">
                      {sugestaoTamanho.valores.map((valor) => {
                        const ehAtual = tamanho === valor;
                        const jaExiste = outrosTamanhos.includes(valor);
                        const marcadoPraCriar = novosTamanhos.includes(valor);
                        return (
                          <button
                            key={valor}
                            type="button"
                            disabled={ehAtual || jaExiste}
                            title={
                              ehAtual
                                ? "Tamanho desta variação"
                                : jaExiste
                                  ? "Já existe em outra variação"
                                  : undefined
                            }
                            onClick={() => toggleNovoTamanho(valor)}
                            className={`h-8 min-w-8 px-2 rounded-lg text-sm font-bold transition-colors ${
                              ehAtual
                                ? "bg-[var(--zephira-primary)] text-white cursor-default"
                                : jaExiste
                                  ? "bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                  : marcadoPraCriar
                                    ? "bg-[var(--zephira-primary)]/15 text-[var(--zephira-primary)] border-2 border-[var(--zephira-primary)]"
                                    : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
                            }`}
                          >
                            {jaExiste ? "✓ " : marcadoPraCriar ? "+ " : ""}
                            {valor}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
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

              {novosTamanhos.length > 0 && (
                <div className="col-span-2 space-y-2 rounded-xl border border-[var(--zephira-primary)]/30 bg-[var(--zephira-primary)]/5 p-4">
                  <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    <Package size={12} /> Estoque inicial dos tamanhos novos
                    ({novosTamanhos.join(", ")})
                  </label>
                  <input
                    type="number"
                    value={estoqueNovos}
                    onChange={(e) => setEstoqueNovos(e.target.value)}
                    placeholder="0"
                    className="w-full h-11 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-bold focus:ring-2 focus:ring-[var(--zephira-primary)] outline-none text-gray-900 dark:text-white"
                  />
                  <p className="text-[11px] text-gray-400">
                    Vale pra cada um dos {novosTamanhos.length} tamanhos marcados.
                  </p>
                </div>
              )}
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
    </Modal>
  );
}

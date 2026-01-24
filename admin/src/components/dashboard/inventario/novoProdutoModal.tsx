"use client";

import api from "@/lib/api";
import { useEffect, useMemo, useRef, useState } from "react";

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoriaTodos {
  CD_CATEGORIA: number;
  NM_CATEGORIA: string;
  NM_CATEGORIA_DISPLAY: string;
}

interface VariacaoItem {
  nome: string;
  qtd: number;
  sku: string; // Adicionado para consistência
}

export function NewProductModal({ isOpen, onClose }: NewProductModalProps) {
  // --- UI STATES ---
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- DATA STATES (Obrigatórios para o envio) ---
  const [todosCategorias, setTodosCategorias] = useState<CategoriaTodos[]>([]);

  // Campos do Formulário
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Variações
  const [tamanhoInput, setTamanhoInput] = useState("");
  const [qtdInput, setQtdInput] = useState("");
  const [variacoes, setVariacoes] = useState<VariacaoItem[]>([]);

  // --- COMPUTED ---
  const estoqueTotal = useMemo(() => {
    return variacoes.reduce((acc, curr) => acc + curr.qtd, 0);
  }, [variacoes]);

  // --- EFEITOS ---
  useEffect(() => {
    const fetchBuscaTodos = async () => {
      try {
        const response = await api.get("admin/buscaTodasCategorias");
        setTodosCategorias(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
      }
    };
    fetchBuscaTodos();
  }, []);

  // Limpar memória do preview ao desmontar
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // --- HANDLERS DE ARQUIVO ---
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setImagemFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // --- HANDLERS DE VARIAÇÃO ---
  const addVariacao = () => {
    if (tamanhoInput.trim() && qtdInput.trim()) {
      if (variacoes.some((v) => v.nome === tamanhoInput.trim())) {
        alert("Esta variação já foi adicionada.");
        return;
      }

      setVariacoes([
        ...variacoes,
        {
          nome: tamanhoInput.trim(),
          qtd: parseInt(qtdInput) || 0,
          sku: `SKU-${Date.now()}`, // Gerador temporário de SKU
        },
      ]);

      setTamanhoInput("");
      setQtdInput("");
      document.getElementById("tamanho-input")?.focus();
    }
  };

  const removeVariacao = (index: number) => {
    setVariacoes(variacoes.filter((_, i) => i !== index));
  };

  // --- SUBMIT PRINCIPAL ---
  const handleSubmit = async () => {
    // 1. Validação Básica
    if (!nome || !categoriaId || !imagemFile) {
      alert("Por favor, preencha Nome, Categoria e adicione uma Imagem.");
      return;
    }

    if (variacoes.length === 0) {
      alert("Adicione pelo menos uma variação de estoque.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Construção do FormData (Obrigatório para envio de Arquivo)
      const formData = new FormData();

      formData.append("NM_PRODUTO", nome);
      // Gera slug simples (idealmente fazer isso no backend ou usar lib)
      formData.append(
        "DS_SLUG",
        nome
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[^\w-]+/g, ""),
      );
      formData.append("CD_CATEGORIA", categoriaId);
      formData.append("DS_DESCRICAO", descricao);
      formData.append("VL_PRECO", preco); // Backend deve converter para number
      formData.append("SN_PRINCIPAL", "S");

      const variacoesPayload = variacoes.map((v) => ({
        DS_TAMANHO: v.nome,
        QT_ESTOQUE: v.qtd,
      }));

      // Enviamos como string JSON para evitar problemas com arrays aninhados no FormData
      formData.append("variacoes", JSON.stringify(variacoesPayload));

      // Anexa o arquivo
      formData.append("file", imagemFile);

      // 3. Chamada API
      await api.post("admin/produtos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Produto criado com sucesso!");
      onClose();
      // Opcional: Recarregar lista de produtos aqui
    } catch (error) {
      console.error(error);
      alert("Erro ao criar produto.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-[#0f1715]/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-[#102220] rounded-2xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-18 px-8 flex items-center justify-between border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Novo Produto
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Corpo Scrollável */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#FAFAFA] dark:bg-[#0b1816]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- COLUNA ESQUERDA --- */}
            <div className="lg:col-span-8 space-y-8">
              <section className="bg-white dark:bg-[#142826] rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-white/5">
                <h3 className="text-sm uppercase font-bold text-gray-400 mb-6">
                  Detalhes Principais
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">
                      Nome do Produto *
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Anel Solitário"
                      className="w-full rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">
                        Categoria *
                      </label>
                      <select
                        value={categoriaId}
                        onChange={(e) => setCategoriaId(e.target.value)}
                        className="w-full rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] dark:text-white"
                      >
                        <option value="">Selecione...</option>
                        {todosCategorias.map((cat) => (
                          <option
                            key={cat.CD_CATEGORIA}
                            value={cat.CD_CATEGORIA}
                          >
                            {cat.NM_CATEGORIA_DISPLAY}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1.5 dark:text-gray-200">
                      Descrição
                    </label>
                    <textarea
                      rows={4}
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      className="w-full rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] resize-none dark:text-white"
                    ></textarea>
                  </div>
                </div>
              </section>

              {/* Seção Variações */}
              <section className="bg-white dark:bg-[#142826] rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-white/5">
                <div className="flex justify-between mb-6">
                  <h3 className="text-sm uppercase font-bold text-gray-400">
                    Estoque por Variação
                  </h3>
                  {variacoes.length > 0 && (
                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">
                      Total: {estoqueTotal}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3 items-end">
                    <div className="flex-[2]">
                      <label className="block text-xs font-bold text-gray-500 mb-1">
                        VARIAÇÃO / TAMANHO
                      </label>
                      <input
                        id="tamanho-input"
                        type="text"
                        value={tamanhoInput}
                        onChange={(e) => setTamanhoInput(e.target.value)}
                        className="w-full rounded-lg bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 px-4 py-2.5 outline-none dark:text-white"
                        placeholder="Ex: P, M, G"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 mb-1">
                        QTD
                      </label>
                      <input
                        type="number"
                        value={qtdInput}
                        onChange={(e) => setQtdInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addVariacao()}
                        className="w-full rounded-lg bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/10 px-4 py-2.5 outline-none dark:text-white"
                      />
                    </div>
                    <button
                      onClick={addVariacao}
                      type="button"
                      className="h-[46px] px-4 rounded-lg bg-[var(--zephira-primary)]/10 text-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)] hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>

                  {variacoes.length > 0 && (
                    <div className="border border-gray-200 dark:border-white/10 rounded-lg overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                          {variacoes.map((item, index) => (
                            <tr key={index} className="dark:text-gray-200">
                              <td className="px-4 py-2 font-bold">
                                {item.nome}
                              </td>
                              <td className="px-4 py-2 text-center">
                                {item.qtd}
                              </td>
                              <td className="px-4 py-2 text-right">
                                <button
                                  onClick={() => removeVariacao(index)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <span className="material-symbols-outlined text-[18px]">
                                    delete
                                  </span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>

              {/* Seção Mídia (Imagem) */}
              <section className="bg-white dark:bg-[#142826] rounded-xl p-6 shadow-sm border border-gray-200/50 dark:border-white/5">
                <h3 className="text-sm uppercase font-bold text-gray-400 mb-4">
                  Galeria do Produto
                </h3>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  hidden
                />

                <div
                  onDragEnter={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-10 transition-all cursor-pointer overflow-hidden
                    ${
                      isDragging
                        ? "border-[var(--zephira-primary)] bg-[var(--zephira-primary)]/5"
                        : "border-gray-200 dark:border-white/10 hover:border-[var(--zephira-primary)]/50"
                    }
                  `}
                >
                  {previewUrl ? (
                    <div className="relative w-full h-48 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-h-full rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                        <span className="text-white font-bold">
                          Trocar Imagem
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center text-gray-500">
                      <span className="material-symbols-outlined text-3xl mb-2">
                        cloud_upload
                      </span>
                      <p className="font-bold">Clique ou arraste imagem aqui</p>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* --- COLUNA DIREITA --- */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#142826] rounded-xl p-5 border border-gray-200/50 dark:border-white/5 sticky top-6">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-4">
                  Configurações de Venda
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">
                      PREÇO (BRL)
                    </label>
                    <input
                      type="number"
                      value={preco}
                      onChange={(e) => setPreco(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 py-2 dark:text-white font-bold outline-none focus:ring-1 focus:ring-[var(--zephira-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5">
                      ESTOQUE TOTAL (AUTO)
                    </label>
                    <input
                      type="number"
                      value={estoqueTotal}
                      readOnly
                      className="w-full rounded-lg bg-gray-100 dark:bg-white/5 px-4 py-2 text-gray-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="h-20 flex items-center justify-between px-8 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#102220] shrink-0">
          <div className="text-xs text-gray-400 hidden sm:block">
            * Campos obrigatórios
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Salvando...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>
                  Salvar Produto
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { DeleteCategoryModal } from "@/components/dashboard/categories/DeleteCategoryModal";
import { EditCategoryModal } from "@/components/dashboard/categories/EditCategoryModal";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import api from "@/lib/api";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface categoriaDetalhes {
  CD_CATEGORIA: number;
  NM_CATEGORIA: string;
  DS_SLUG: string;
  QT_PRODUTOS: number;
  ST_CATEGORIA: string;
  DS_URL_IMAGEM: string;
  ds_css_status?: string;
}

interface categoriaTodos {
  CD_CATEGORIA: number;
  NM_CATEGORIA: string;
}

interface categoriaPainel {
  TOTAL_CATEGORIAS: number;
  TOTAL_PRODUTOS: number;
  TOTAL_CATEGORIAS_ATIVAS: number;
}

export default function CategoriesPage() {
  const [painelCategorias, setPainelCategorias] = useState<categoriaPainel[]>(
    []
  );
  const [detalhesCategoria, setDetalhesCategoria] = useState<
    categoriaDetalhes[]
  >([]);
  const [todosCategorias, setTodosCategorias] = useState<categoriaTodos[]>([]);
  const [nome, setNome] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPainel = async () => {
    try {
      const response = await api.get("admin/categorias-painel");
      setPainelCategorias(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDetalhes = async () => {
    try {
      const response = await api.get("admin/categoria-detalhes");
      setDetalhesCategoria(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBuscaTodos = async () => {
    try {
      const response = await api.get("admin/buscaTodasCategorias");
      setTodosCategorias(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createCategoria = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1. Validação Básica (Fail Fast)
    if (!nome || !slug) {
      alert("Preencha o Nome e o Slug da categoria.");
      return;
    }

    const formData = new FormData();

    // 2. Montagem Inteligente do FormData
    formData.append("NM_CATEGORIA", nome);
    formData.append("DS_SLUG", slug);
    formData.append("DS_URL_IMAGEM", ""); // O backend parece ignorar isso se vier arquivo, mas mantive
    formData.append("SN_ATIVO", "1");

    // Lógica para Categoria Pai (evita enviar string vazia se o backend esperar null/número)
    if (categoriaId) {
      formData.append("CD_CATEGORIA_PAI", categoriaId);
    } else {
      formData.append("CD_CATEGORIA_PAI", ""); // Ou remova esta linha se o backend aceitar ausência
    }

    // 3. Anexo Seguro de Arquivo
    if (imagemFile) {
      formData.append("file", imagemFile);
    } else {
      // Opcional: Alerta se imagem for obrigatória
      // alert("Selecione uma imagem de capa.");
      // return;
    }

    try {
      const response = await api.post("admin/create-categoria", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 4. Sucesso: Feedback e Limpeza Profunda
      console.log("Sucesso:", response.data);
      alert("Categoria criada com sucesso!"); // Considere usar um Toast no futuro

      // Reset de States
      setNome("");
      setSlug("");
      setCategoriaId("");
      setImagemFile(null);

      // Reset do Input HTML (Crítico para UX)
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Atualização dos dados em paralelo (Otimização de Performance)
      await Promise.all([fetchPainel(), fetchDetalhes(), fetchBuscaTodos()]);
    } catch (error: any) {
      console.error("Erro ao criar:", error);

      // 5. Tratamento de Erros Granular
      if (error.response) {
        const status = error.response.status;
        if (status === 409) {
          alert(
            `Conflito: Já existe uma categoria com o slug "${slug}" ou este nome.`
          );
        } else if (status === 400) {
          alert("Erro de Validação: Verifique os dados preenchidos.");
        } else if (status === 413) {
          alert("Erro: A imagem é muito pesada para o servidor.");
        } else {
          alert(`Erro no servidor: ${status}`);
        }
      } else {
        alert("Erro de conexão. Verifique se o servidor está rodando.");
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      fetchPainel();
      fetchDetalhes();
      fetchBuscaTodos();
    };

    loadData();
  }, []);

  const refreshData = () => {
    fetchPainel();
    fetchDetalhes();
    fetchBuscaTodos();
  };

  // Adicione isso para "vigiar" o state
  useEffect(() => {
    if (imagemFile) {
      console.log(
        "✅ ESTADO ATUALIZADO: Arquivo carregado na memória:",
        imagemFile.name
      );
    } else {
      console.log("⚪ ESTADO: Nenhum arquivo selecionado.");
    }
  }, [imagemFile]);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">
      <EditCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        category={editingCategory}
        onSuccess={refreshData}
      />

      <DeleteCategoryModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        category={deletingCategory}
        onSuccess={refreshData}
      />
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--zephira-text)] dark:text-white tracking-tight">
            Categorias
          </h1>
          <p className="text-[var(--zephira-muted)] mt-1">
            Organize as coleções da sua loja.
          </p>
        </div>
      </div>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- COLUNA ESQUERDA: FORMULÁRIO --- */}
        <div className="lg:col-span-1 h-fit bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-6 sticky top-6">
          <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white mb-4">
            Adicionar Categoria
          </h3>
          <form className="flex flex-col gap-4" onSubmit={createCategoria}>
            <div>
              <label className="block text-sm font-medium text-[var(--zephira-muted)] mb-1">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Anéis de Diamante"
                className="w-full rounded-lg bg-gray-50 dark:bg-[#0b1816] border-transparent focus:border-[var(--zephira-primary)] focus:bg-white dark:focus:bg-black focus:ring-0 text-[var(--zephira-text)] dark:text-white text-sm py-2.5 px-4 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--zephira-muted)] mb-1">
                Slug (URL)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: aneis-diamante"
                className="w-full rounded-lg bg-gray-50 dark:bg-[#0b1816] border-transparent focus:border-[var(--zephira-primary)] focus:bg-white dark:focus:bg-black focus:ring-0 text-[var(--zephira-text)] dark:text-white text-sm py-2.5 px-4 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--zephira-muted)] mb-1">
                Categoria Pai
              </label>

              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full rounded-lg bg-gray-50 dark:bg-[#0b1816] border-transparent focus:border-[var(--zephira-primary)] focus:bg-white dark:focus:bg-black focus:ring-0 text-[var(--zephira-text)] dark:text-white text-sm py-2.5 px-4 transition-all"
              >
                <option value="">Nenhuma (Nível Superior)</option>

                {todosCategorias.map((cate) => (
                  <option key={cate.CD_CATEGORIA} value={cate.CD_CATEGORIA}>
                    {cate.NM_CATEGORIA}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--zephira-muted)] mb-2">
                Imagem de Capa
              </label>

              <label
                htmlFor="imagem"
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer group ${
                  imagemFile
                    ? "border-green-500 bg-green-50 dark:bg-green-900/10" // Estilo quando tem arquivo
                    : "border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                {/* Lógica Condicional de Renderização */}
                {imagemFile ? (
                  <>
                    <span className="material-symbols-outlined text-green-500 mb-2">
                      check_circle
                    </span>
                    <p className="text-sm font-bold text-green-600 dark:text-green-400">
                      Arquivo Selecionado!
                    </p>
                    <p className="text-xs text-[var(--zephira-muted)] mt-1 break-all">
                      {imagemFile.name}
                    </p>
                    <p className="text-[10px] text-[var(--zephira-muted)] mt-2">
                      Clique para trocar
                    </p>
                  </>
                ) : (
                  <>
                    {/* O código original quando está vazio */}
                    <span className="material-symbols-outlined text-[var(--zephira-muted)] mb-2 group-hover:text-[var(--zephira-primary)]">
                      cloud_upload
                    </span>
                    <p className="text-xs text-[var(--zephira-muted)]">
                      Clique ou arraste para enviar
                    </p>
                    <p className="text-[10px] text-[var(--zephira-muted)] mt-1 opacity-60">
                      JPG, PNG (max. 2MB)
                    </p>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  id="imagem"
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 2 * 1024 * 1024) {
                        alert("Imagem maior que 2MB");
                        return;
                      }
                      setImagemFile(file);
                    }
                  }}
                />
              </label>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-[var(--zephira-text)] dark:text-white rounded-lg text-sm font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[var(--zephira-primary)] hover:brightness-105 text-white rounded-lg text-sm font-bold transition-colors shadow-md shadow-[var(--zephira-primary)]/20"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>

        {/* --- COLUNA DIREITA: ESTATÍSTICAS E TABELA --- */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[var(--zephira-dark)] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[var(--zephira-primary)]/10 text-[var(--zephira-primary)]">
                <span className="material-symbols-outlined">category</span>
              </div>
              <div>
                <p className="text-[var(--zephira-muted)] text-xs font-bold uppercase tracking-wide">
                  Total
                </p>
                <p className="text-xl font-bold text-[var(--zephira-text)] dark:text-white">
                  {painelCategorias[0]?.TOTAL_CATEGORIAS || 0}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-[var(--zephira-dark)] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-blue-500">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <div>
                <p className="text-[var(--zephira-muted)] text-xs font-bold uppercase tracking-wide">
                  Produtos
                </p>
                <p className="text-xl font-bold text-[var(--zephira-text)] dark:text-white">
                  {painelCategorias[0]?.TOTAL_PRODUTOS || 0}
                </p>
              </div>
            </div>
            <div className="bg-white dark:bg-[var(--zephira-dark)] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex items-center gap-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-500">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <div>
                <p className="text-[var(--zephira-muted)] text-xs font-bold uppercase tracking-wide">
                  Ativas
                </p>
                <p className="text-xl font-bold text-[var(--zephira-text)] dark:text-white">
                  {painelCategorias[0]?.TOTAL_CATEGORIAS_ATIVAS || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
            {/* Table Header Controls */}
            <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white">
                Lista de Categorias
              </h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-white/5 text-[var(--zephira-muted)] hover:text-[var(--zephira-primary)] transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    filter_list
                  </span>{" "}
                  Filtrar
                </button>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-white/5 text-[var(--zephira-muted)] hover:text-[var(--zephira-primary)] transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">
                    sort
                  </span>{" "}
                  Ordenar
                </button>
              </div>
            </div>

            {/* Actual Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#0b1816] text-[var(--zephira-muted)] text-sm">
                    <th className="pl-4 py-4 w-10 text-center"></th>
                    <th className="p-4 font-medium w-12">
                      <input
                        className="rounded border-gray-300 text-[var(--zephira-primary)] focus:ring-0 cursor-pointer"
                        type="checkbox"
                      />
                    </th>
                    <th className="p-4 font-medium">Nome</th>
                    <th className="p-4 font-medium">Slug</th>
                    <th className="p-4 font-medium">Itens</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
                  {detalhesCategoria.map((cat) => (
                    <tr
                      key={cat.CD_CATEGORIA}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="pl-4 py-4 text-center">
                        <span
                          className="material-symbols-outlined text-[var(--zephira-muted)]/40 hover:text-[var(--zephira-primary)] cursor-move text-[20px]"
                          title="Arraste para reordenar"
                        >
                          drag_indicator
                        </span>
                      </td>
                      <td className="p-4">
                        <input
                          className="rounded border-gray-300 text-[var(--zephira-primary)] focus:ring-0 cursor-pointer"
                          type="checkbox"
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-gray-200 relative overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10">
                            {cat.DS_URL_IMAGEM ? (
                              <Image
                                src={cat.DS_URL_IMAGEM}
                                alt={cat.NM_CATEGORIA}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-[20px]">
                                  image
                                </span>
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-[var(--zephira-text)] dark:text-white">
                              {cat.NM_CATEGORIA}
                            </p>
                            <p className="text-xs text-[var(--zephira-muted)]">
                              Coleção Principal
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[var(--zephira-muted)] font-mono text-xs">
                        {cat.DS_SLUG}
                      </td>
                      <td className="p-4 font-medium text-[var(--zephira-text)] dark:text-white">
                        {cat.QT_PRODUTOS}
                      </td>
                      <td className="p-4">
                        <StatusBadge cssStatus={cat.ds_css_status} />
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingCategory(cat)}
                            className="p-1.5 rounded-md hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-900/30 dark:text-blue-400 transition-colors"
                            title="Editar"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => setDeletingCategory(cat)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-600 dark:hover:bg-red-900/30 dark:text-red-400 transition-colors"
                            title="Excluir"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200 dark:border-white/5 flex items-center justify-between">
              <p className="text-xs text-[var(--zephira-muted)]">
                Mostrando 1 a 6 de 12
              </p>
              <div className="flex gap-1">
                <button
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-[var(--zephira-muted)] disabled:opacity-50"
                  disabled
                >
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_left
                  </span>
                </button>
                <button className="px-3 py-1 text-xs rounded bg-[var(--zephira-primary)] text-white font-medium">
                  1
                </button>
                <button className="px-3 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-white/10 text-[var(--zephira-muted)] font-medium">
                  2
                </button>
                <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-[var(--zephira-muted)]">
                  <span className="material-symbols-outlined text-[18px]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

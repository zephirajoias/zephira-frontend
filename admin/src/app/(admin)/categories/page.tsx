"use client";

import { DeleteCategoryModal } from "@/components/dashboard/categories/DeleteCategoryModal";
import { EditCategoryModal } from "@/components/dashboard/categories/EditCategoryModal";
import api from "@/lib/api";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

/* =======================
   INTERFACES
======================= */
interface CategoriaDetalhes {
  CD_CATEGORIA: number;
  NM_CATEGORIA: string;
  NM_CATEGORIA_PAI: string | null;
  DS_SLUG: string;
  QT_PRODUTOS: number;
  SN_ATIVO: number;
  DS_URL_IMAGEM: string;
}

interface CategoriaTodos {
  CD_CATEGORIA: number;
  NM_CATEGORIA_DISPLAY: string;
}

interface CategoriaPainel {
  TOTAL_CATEGORIAS: number;
  TOTAL_PRODUTOS: number;
  TOTAL_CATEGORIAS_ATIVAS: number;
}

/* =======================
   COMPONENTE
======================= */
export default function CategoriesPage() {
  /* -------- STATES -------- */
  const [painelCategorias, setPainelCategorias] = useState<CategoriaPainel[]>(
    [],
  );
  const [detalhesCategoria, setDetalhesCategoria] = useState<
    CategoriaDetalhes[]
  >([]);
  const [todosCategorias, setTodosCategorias] = useState<CategoriaTodos[]>([]);

  const [nome, setNome] = useState("");
  const [slug, setSlug] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CategoriaDetalhes;
    direction: "asc" | "desc";
  } | null>(null);

  const [editingCategory, setEditingCategory] =
    useState<CategoriaDetalhes | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<CategoriaDetalhes | null>(null);

  /* =======================
     FETCH
  ======================= */
  const refreshData = async () => {
    try {
      const [resPainel, resDetalhes, resTodos] = await Promise.all([
        api.get("admin/categorias-painel"),
        api.get("admin/categoria-detalhes"),
        api.get("admin/buscaTodasCategorias"),
      ]);
      setPainelCategorias(resPainel.data);
      setDetalhesCategoria(resDetalhes.data);
      setTodosCategorias(resTodos.data);
    } catch {
      toast.error("Erro ao carregar categorias.");
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  /* =======================
     HIERARQUIA
  ======================= */
  const organizarHierarquia = (categorias: CategoriaDetalhes[]) => {
    const pais = categorias.filter((c) => !c.NM_CATEGORIA_PAI);
    const filhos = categorias.filter((c) => c.NM_CATEGORIA_PAI);

    const resultado: CategoriaDetalhes[] = [];

    pais.forEach((pai) => {
      resultado.push(pai);
      filhos
        .filter((f) => f.NM_CATEGORIA_PAI === pai.NM_CATEGORIA)
        .forEach((f) => resultado.push(f));
    });

    return resultado;
  };

  /* =======================
     FILTRO + SORT
  ======================= */
  const filteredAndSortedCategories = useMemo(() => {
    let result = [...detalhesCategoria];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((cat) => {
        const nomeCompleto =
          `${cat.NM_CATEGORIA_PAI ?? ""} ${cat.NM_CATEGORIA}`.toLowerCase();
        return (
          nomeCompleto.includes(term) ||
          cat.DS_SLUG.toLowerCase().includes(term)
        );
      });
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key] ?? "";
        const valB = b[sortConfig.key] ?? "";
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return organizarHierarquia(result);
  }, [detalhesCategoria, searchTerm, sortConfig]);

  /* =======================
     CREATE
  ======================= */
  const createCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !slug) return toast.warn("Preencha nome e slug.");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("NM_CATEGORIA", nome);
    formData.append("DS_SLUG", slug);
    formData.append("SN_ATIVO", "1");
    if (categoriaId) formData.append("CD_CATEGORIA_PAI", categoriaId);
    if (imagemFile) formData.append("file", imagemFile);

    try {
      await api.post("admin/create-categoria", formData);
      toast.success("Categoria criada!");
      setNome("");
      setSlug("");
      setCategoriaId("");
      setImagemFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refreshData();
    } catch {
      toast.error("Erro ao criar categoria.");
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6 pb-10">
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

      {/* HEADER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--zephira-text)] dark:text-white">
          Categorias
        </h1>
        <p className="text-[var(--zephira-muted)] text-base font-medium">
          Gerencie a taxonomia e organização dos seus produtos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* =====================
            FORMULÁRIO (ESQUERDA)
        ===================== */}
        <div className="lg:col-span-1 h-fit bg-white dark:bg-[#102220] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-6 sticky top-6">
          <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[var(--zephira-primary)]">
              add_circle
            </span>
            Nova Categoria
          </h3>
          <form className="flex flex-col gap-5" onSubmit={createCategoria}>
            <InputField
              label="Nome da Categoria"
              value={nome}
              onChange={setNome}
              placeholder="Ex: Brincos"
            />
            <InputField
              label="Slug (URL)"
              value={slug}
              onChange={setSlug}
              placeholder="Ex: brincos-ouro"
            />

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Categoria Pai
              </label>
              <div className="relative">
                <select
                  value={categoriaId}
                  onChange={(e) => setCategoriaId(e.target.value)}
                  className="w-full h-11 appearance-none rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all cursor-pointer"
                >
                  <option value="">Nenhuma (Categoria Principal)</option>
                  {todosCategorias.map((c) => (
                    <option key={c.CD_CATEGORIA} value={c.CD_CATEGORIA}>
                      {c.NM_CATEGORIA_DISPLAY}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Upload de Imagem Personalizado */}
            <div>
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Imagem de Capa
              </label>
              <label
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group ${imagemFile ? "border-[var(--zephira-primary)] bg-[var(--zephira-primary)]/5" : "border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"}`}
              >
                <span
                  className={`material-symbols-outlined mb-2 text-3xl transition-colors ${imagemFile ? "text-[var(--zephira-primary)]" : "text-gray-400 group-hover:text-[var(--zephira-primary)]"}`}
                >
                  {imagemFile ? "check_circle" : "cloud_upload"}
                </span>
                <p
                  className={`text-sm font-bold ${imagemFile ? "text-[var(--zephira-primary)]" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {imagemFile ? imagemFile.name : "Clique para anexar imagem"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setImagemFile(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            <button
              disabled={isLoading || !nome || !slug}
              className="w-full h-11 bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all flex items-center justify-center gap-2 rounded-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                "Salvando..."
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>{" "}
                  Criar Categoria
                </>
              )}
            </button>
          </form>
        </div>

        {/* =====================
            TABELA (DIREITA)
        ===================== */}
        <div className="lg:col-span-3 bg-white dark:bg-[#102220] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          {/* Header & Filtro da Tabela */}
          <div className="p-4 border-b border-gray-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50 dark:bg-black/20">
            <h3 className="font-bold text-[var(--zephira-text)] dark:text-white">
              Estrutura de Categorias
            </h3>
            <div className="relative w-full sm:max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[var(--zephira-muted)]">
                search
              </span>
              <input
                className="w-full h-11 pl-10 pr-4 rounded-lg bg-white dark:bg-[#0b1816] border border-gray-200 dark:border-white/5 focus:border-[var(--zephira-primary)] text-sm text-[var(--zephira-text)] dark:text-white outline-none transition-all shadow-sm"
                placeholder="Buscar categoria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#0b1816] border-b border-gray-200 dark:border-white/5 text-[var(--zephira-muted)] text-xs uppercase">
                  <th className="px-6 py-4 font-bold tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider">Slug</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center">
                    Itens
                  </th>
                  <th className="px-6 py-4 font-bold tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredAndSortedCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-8 text-center text-[var(--zephira-muted)] font-medium"
                    >
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedCategories.map((cat) => {
                    const isSub = !!cat.NM_CATEGORIA_PAI;
                    return (
                      <tr
                        key={cat.CD_CATEGORIA}
                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <td className={`px-6 py-4 ${isSub ? "pl-14" : ""}`}>
                          <div className="flex items-center gap-3">
                            {isSub && (
                              <span className="material-symbols-outlined text-[var(--zephira-muted)]">
                                subdirectory_arrow_right
                              </span>
                            )}
                            <div>
                              <strong
                                className={`block text-sm font-bold ${isSub ? "text-gray-600 dark:text-gray-300" : "text-[var(--zephira-text)] dark:text-white"}`}
                              >
                                {cat.NM_CATEGORIA}
                              </strong>
                              {isSub && (
                                <span className="text-xs text-[var(--zephira-muted)] bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded">
                                  Pai: {cat.NM_CATEGORIA_PAI}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-[var(--zephira-muted)]">
                          {cat.DS_SLUG}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-white/10 text-[var(--zephira-text)] dark:text-white">
                            {cat.QT_PRODUTOS}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingCategory(cat)}
                              className="p-2 text-[var(--zephira-muted)] hover:text-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/10 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => setDeletingCategory(cat)}
                              className="p-2 text-[var(--zephira-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Excluir"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =======================
   COMPONENTES AUX
======================= */
const InputField = ({ label, value, onChange, placeholder }: any) => (
  <div className="group">
    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
    />
  </div>
);

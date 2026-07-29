"use client";

import api from "@/lib/api";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

// Modais
import { DeleteCategoryModal } from "@/components/dashboard/categories/DeleteCategoryModal";
import { EditCategoryModal } from "@/components/dashboard/categories/EditCategoryModal";

/* --- Interfaces --- */
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

export default function CategoriesPage() {
  const [painel, setPainel] = useState<CategoriaPainel | null>(null);
  const [detalhes, setDetalhes] = useState<CategoriaDetalhes[]>([]);
  const [todos, setTodos] = useState<CategoriaTodos[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Form States
  const [form, setForm] = useState({
    nome: "",
    slug: "",
    paiId: "",
    imagem: null as File | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal States
  const [modals, setModals] = useState({
    edit: null as CategoriaDetalhes | null,
    delete: null as CategoriaDetalhes | null,
  });

  const refreshData = async () => {
    try {
      const [resPainel, resDetalhes, resTodos] = await Promise.all([
        api.get("admin/categorias-painel"),
        api.get("admin/categoria-detalhes"),
        api.get("admin/buscaTodasCategorias"),
      ]);
      setPainel(resPainel.data[0]); // Pega o primeiro registro do painel
      setDetalhes(resDetalhes.data);
      setTodos(resTodos.data);
    } catch {
      toast.error("Erro ao sincronizar dados.");
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Lógica de Hierarquia Visual
  const hierarchicalCategories = useMemo(() => {
    let result = detalhes;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (cat) =>
          cat.NM_CATEGORIA.toLowerCase().includes(term) ||
          cat.DS_SLUG.toLowerCase().includes(term),
      );
    }

    const pais = result.filter((c) => !c.NM_CATEGORIA_PAI);
    const filhos = result.filter((c) => c.NM_CATEGORIA_PAI);
    const final: CategoriaDetalhes[] = [];

    pais.forEach((pai) => {
      final.push(pai);
      filhos
        .filter((f) => f.NM_CATEGORIA_PAI === pai.NM_CATEGORIA)
        .forEach((f) => final.push(f));
    });

    return final;
  }, [detalhes, searchTerm]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.slug)
      return toast.warn("Nome e Slug são obrigatórios.");

    setIsLoading(true);
    const formData = new FormData();
    formData.append("NM_CATEGORIA", form.nome);
    formData.append("DS_SLUG", form.slug);
    formData.append("SN_ATIVO", "1");
    if (form.paiId) formData.append("CD_CATEGORIA_PAI", form.paiId);
    if (form.imagem) formData.append("file", form.imagem);

    try {
      await api.post("admin/create-categoria", formData);
      toast.success("Categoria criada com sucesso!");
      setForm({ nome: "", slug: "", paiId: "", imagem: null });
      if (fileInputRef.current) fileInputRef.current.value = "";
      refreshData();
    } catch {
      toast.error("Erro ao processar criação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-8 pb-10">
      {/* Modais */}
      <EditCategoryModal
        isOpen={!!modals.edit}
        onClose={() => setModals({ ...modals, edit: null })}
        category={modals.edit}
        onSuccess={refreshData}
      />
      <DeleteCategoryModal
        isOpen={!!modals.delete}
        onClose={() => setModals({ ...modals, delete: null })}
        category={modals.delete}
        onSuccess={refreshData}
      />

      {/* 1. Header & Stats */}
      <header className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Categorias
          </h1>
          <p className="text-slate-500 font-medium">
            Organize a taxonomia da sua loja e melhore o SEO.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Categorias"
            value={painel?.TOTAL_CATEGORIAS || 0}
            icon="category"
            trend="Estrutura"
            trendLabel=""
          />
          <StatCard
            title="Produtos Vinculados"
            value={painel?.TOTAL_PRODUTOS || 0}
            icon="inventory_2"
            trend="Catálogo"
            trendLabel=""
          />
          <StatCard
            title="Ativas no Site"
            value={painel?.TOTAL_CATEGORIAS_ATIVAS || 0}
            icon="visibility"
            trend="Visíveis"
            trendLabel=""
          />
        </div> */}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 2. Formulário Lateral (Sticky) */}
        <aside className="lg:col-span-4 sticky top-6 bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-[#11d4c4]/20 text-[#11d4c4] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">add_box</span>
            </div>
            <h3 className="text-lg font-black tracking-tight">
              Nova Categoria
            </h3>
          </div>

          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Nome
              </label>
              <input
                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                placeholder="Ex: Anéis de Noivado"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                URL amigável (Slug)
              </label>
              <input
                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none font-mono text-xs"
                placeholder="aneis-de-noivado"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Hierarquia (Pai)
              </label>
              <select
                className="w-full h-12 px-4 rounded-xl bg-slate-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none cursor-pointer"
                value={form.paiId}
                onChange={(e) => setForm({ ...form, paiId: e.target.value })}
              >
                <option value="">Nenhuma (Principal)</option>
                {todos.map((c) => (
                  <option key={c.CD_CATEGORIA} value={c.CD_CATEGORIA}>
                    {c.NM_CATEGORIA_DISPLAY}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Imagem de Capa
              </label>
              <label
                className={cn(
                  "border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group",
                  form.imagem
                    ? "border-[#11d4c4] bg-[#11d4c4]/5"
                    : "border-slate-200 dark:border-white/10 hover:border-[#11d4c4]/50",
                )}
              >
                <span
                  className={cn(
                    "material-symbols-outlined text-3xl mb-2",
                    form.imagem ? "text-[#11d4c4]" : "text-slate-300",
                  )}
                >
                  {form.imagem ? "cloud_done" : "add_photo_alternate"}
                </span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                  {form.imagem ? form.imagem.name : "Clique para carregar"}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    setForm({ ...form, imagem: e.target.files?.[0] || null })
                  }
                />
              </label>
            </div>

            <button
              disabled={isLoading}
              className="w-full h-12 rounded-2xl bg-[#11d4c4] text-[#0a1615] font-black shadow-lg shadow-[#11d4c4]/20 hover:scale-[1.02] transition-all disabled:opacity-50 mt-4"
            >
              {isLoading ? "Salvando..." : "Salvar Categoria"}
            </button>
          </form>
        </aside>

        {/* 3. Tabela de Categorias */}
        <section className="lg:col-span-8 bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-white/2">
            <h3 className="font-black text-lg">Árvore de Categorias</h3>
            <div className="relative w-full sm:max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                search
              </span>
              <input
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-white dark:bg-black/20 border-none text-sm focus:ring-2 focus:ring-[#11d4c4]/20 transition-all outline-none"
                placeholder="Filtrar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto text-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-white/2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-5 pl-8">Nome da Categoria</th>
                  <th className="p-5">Slug / URL</th>
                  <th className="p-5 text-center">Produtos</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-right pr-8">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {hierarchicalCategories.map((cat) => {
                  const isSub = !!cat.NM_CATEGORIA_PAI;
                  return (
                    <tr
                      key={cat.CD_CATEGORIA}
                      className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className={cn("p-5 pl-8", isSub && "pl-14 relative")}>
                        {isSub && (
                          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-slate-300 text-lg">
                              subdirectory_arrow_right
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          {/* <div className="size-10 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0 border border-slate-200 dark:border-white/10 shadow-sm">
                            <img
                              src={cat.DS_URL_IMAGEM || "/placeholder.png"}
                              alt=""
                              className="object-cover w-full h-full"
                            />
                          </div> */}
                          <div>
                            <p
                              className={cn(
                                "font-black text-slate-900 dark:text-white",
                                isSub ? "text-sm" : "text-base",
                              )}
                            >
                              {cat.NM_CATEGORIA}
                            </p>
                            {isSub && (
                              <p className="text-[10px] font-bold text-slate-400 uppercase">
                                Pai: {cat.NM_CATEGORIA_PAI}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-5 font-mono text-xs text-slate-400">
                        {cat.DS_SLUG}
                      </td>
                      <td className="p-5 text-center">
                        <span className="font-black bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-lg text-slate-500">
                          {cat.QT_PRODUTOS}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <StatusBadge active={cat.SN_ATIVO === 1} />
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() => setModals({ ...modals, edit: cat })}
                            className="p-2 hover:bg-[#11d4c4]/10 text-[#11d4c4] rounded-lg"
                          >
                            <span className="material-symbols-outlined text-xl">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              setModals({ ...modals, delete: cat })
                            }
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                          >
                            <span className="material-symbols-outlined text-xl">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

// Componentes Auxiliares Refinados
function StatusBadge({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
        active
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "bg-emerald-500" : "bg-red-500",
        )}
      />
      {active ? "Ativa" : "Oculta"}
    </div>
  );
}

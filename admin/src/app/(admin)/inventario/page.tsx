"use client";

import api from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";

// Componentes de Modal
import { AddVariationModal } from "@/components/dashboard/inventario/addVariationModal";
import { DeleteProductModal } from "@/components/dashboard/inventario/deleteProductModal";
import { DeleteVariacaoModal } from "@/components/dashboard/inventario/deleteVariacaoModal";
import { EditProductModal } from "@/components/dashboard/inventario/editProductModal";
import { NewProductModal } from "@/components/dashboard/inventario/novoProdutoModal";

// --- Interfaces ---
interface InventoryItem {
  CD_VARIACAO: number;
  DS_TAMANHO: string;
  CD_PRODUTO: number;
  NM_PRODUTO: string;
  CD_SKU: string;
  ds_imagem_thumb: string;
  NM_CATEGORIA: string;
  VL_PRECO: number;
  QT_ESTOQUE: number;
  ds_status_texto: string;
  ds_css_status: string;
}

interface GroupedProduct {
  CD_PRODUTO: number;
  NM_PRODUTO: string;
  ds_imagem_thumb: string;
  NM_CATEGORIA: string;
  total_estoque: number;
  variations: InventoryItem[];
}

// --- Helpers de Estilo ---
const getStatusConfig = (status: string) => {
  const map: Record<string, { bg: string; text: string; dot: string }> = {
    "Em Estoque": {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    "Estoque Baixo": {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    Esgotado: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      dot: "bg-red-500",
    },
  };
  return (
    map[status] || {
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
    }
  );
};

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rawInventory, setRawInventory] = useState<InventoryItem[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modais e Ações
  const [modals, setModals] = useState({
    newProduct: false,
    variation: false,
    edit: null as any,
    deleteProduct: null as any,
    deleteVariation: null as any,
  });

  const [variationParent, setVariationParent] = useState<any>(null);
  const ITEMS_PER_PAGE = 8;

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/estoque-detalhes");
      setRawInventory(response.data);
    } catch (error) {
      console.error("Erro ao buscar estoque:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Agrupamento de Dados
  const groupedInventory = useMemo(() => {
    const groups: Record<number, GroupedProduct> = {};
    rawInventory.forEach((item) => {
      if (!groups[item.CD_PRODUTO]) {
        groups[item.CD_PRODUTO] = {
          CD_PRODUTO: item.CD_PRODUTO,
          NM_PRODUTO: item.NM_PRODUTO,
          ds_imagem_thumb: item.ds_imagem_thumb,
          NM_CATEGORIA: item.NM_CATEGORIA,
          total_estoque: 0,
          variations: [],
        };
      }
      groups[item.CD_PRODUTO].variations.push(item);
      groups[item.CD_PRODUTO].total_estoque += item.QT_ESTOQUE;
    });

    const list = Object.values(groups);
    return searchTerm
      ? list.filter(
          (p) =>
            p.NM_PRODUTO.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.variations.some((v) =>
              v.CD_SKU.toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        )
      : list;
  }, [rawInventory, searchTerm]);

  const paginatedData = groupedInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(groupedInventory.length / ITEMS_PER_PAGE);

  const toggleRow = (id: number) =>
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-6 pb-10 animate-in fade-in duration-500">
      {/* Modais */}
      <NewProductModal
        isOpen={modals.newProduct}
        onClose={() => setModals({ ...modals, newProduct: false })}
      />
      <AddVariationModal
        isOpen={modals.variation}
        product={variationParent}
        onClose={() => setModals({ ...modals, variation: false })}
        onSuccess={fetchInventory}
      />
      <EditProductModal
        isOpen={!!modals.edit}
        product={modals.edit}
        onClose={() => setModals({ ...modals, edit: null })}
        onSuccess={fetchInventory}
      />
      <DeleteProductModal
        isOpen={!!modals.deleteProduct}
        product={modals.deleteProduct}
        onClose={() => setModals({ ...modals, deleteProduct: null })}
        onSuccess={fetchInventory}
      />
      <DeleteVariacaoModal
        isOpen={!!modals.deleteVariation}
        product={modals.deleteVariation}
        onClose={() => setModals({ ...modals, deleteVariation: null })}
        onSuccess={fetchInventory}
      />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Estoque
          </h2>
          <p className="text-slate-500 font-medium">
            Controle total de produtos e SKUs.
          </p>
        </div>
        <button
          onClick={() => setModals({ ...modals, newProduct: true })}
          className="flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-[#11d4c4] text-[#0a1615] font-black shadow-lg shadow-[#11d4c4]/20 hover:scale-[1.02] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Novo Produto
        </button>
      </header>

      {/* Busca */}
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#11d4c4] transition-colors">
          search
        </span>
        <input
          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-[#102220] border border-slate-200 dark:border-white/5 focus:ring-4 focus:ring-[#11d4c4]/10 transition-all outline-none font-medium"
          placeholder="Pesquisar por nome do produto ou SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela */}
      <div className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/2 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                <th className="p-5 w-16" />
                <th className="p-5">Produto</th>
                <th className="p-5">Categoria</th>
                <th className="p-5 text-center">Variações</th>
                <th className="p-5 text-center">Total Estoque</th>
                <th className="p-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-20 text-center animate-pulse text-slate-400 font-bold"
                  >
                    Carregando inventário...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-20 text-center text-slate-400">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              ) : (
                paginatedData.map((product) => {
                  const isExpanded = expandedRows.includes(product.CD_PRODUTO);
                  return (
                    <Fragment key={product.CD_PRODUTO}>
                      <tr
                        className={cn(
                          "group cursor-pointer transition-colors",
                          isExpanded
                            ? "bg-slate-50/50 dark:bg-white/[0.03]"
                            : "hover:bg-slate-50 dark:hover:bg-white/5",
                        )}
                        onClick={() => toggleRow(product.CD_PRODUTO)}
                      >
                        <td className="p-5 text-center">
                          <span
                            className={cn(
                              "material-symbols-outlined text-slate-300 transition-transform duration-300",
                              isExpanded && "rotate-90 text-[#11d4c4]",
                            )}
                          >
                            chevron_right
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-slate-100 relative overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm">
                              <Image
                                src={
                                  product.ds_imagem_thumb || "/placeholder.png"
                                }
                                alt={product.NM_PRODUTO}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-black text-slate-900 dark:text-white text-base">
                              {product.NM_PRODUTO}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-slate-500 font-medium">
                          {product.NM_CATEGORIA}
                        </td>
                        <td className="p-5 text-center">
                          <span className="bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-500">
                            {product.variations.length} tipos
                          </span>
                        </td>
                        <td className="p-5 text-center font-black text-slate-900 dark:text-white">
                          {product.total_estoque}
                        </td>
                        <td
                          className="p-5 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setVariationParent(product);
                                setModals({ ...modals, variation: true });
                              }}
                              className="p-2 hover:bg-[#11d4c4]/10 text-[#11d4c4] rounded-xl transition-all"
                            >
                              <span className="material-symbols-outlined">
                                playlist_add
                              </span>
                            </button>
                            <button
                              onClick={() =>
                                setModals({ ...modals, deleteProduct: product })
                              }
                              className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                            >
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Linha Expandida (Variações) */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={6}
                            className="p-0 bg-slate-50/30 dark:bg-black/10"
                          >
                            <div className="p-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                              <div className="rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-inner">
                                <table className="w-full text-xs">
                                  <thead className="bg-slate-100 dark:bg-white/5 text-slate-400 font-black uppercase tracking-tighter">
                                    <tr>
                                      <th className="p-3 pl-5">SKU</th>
                                      <th className="p-3">Tamanho</th>
                                      <th className="p-3">Preço</th>
                                      <th className="p-3 text-center">
                                        Estoque
                                      </th>
                                      <th className="p-3 text-center">
                                        Status
                                      </th>
                                      <th className="p-3 pr-5 text-right">
                                        Ações
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-[#0d1a18]">
                                    {product.variations.map((variant) => {
                                      const style = getStatusConfig(
                                        variant.ds_status_texto,
                                      );
                                      return (
                                        <tr
                                          key={variant.CD_VARIACAO}
                                          className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                          <td className="p-3 pl-5 font-mono text-slate-400">
                                            #{variant.CD_SKU}
                                          </td>
                                          <td className="p-3 font-black">
                                            {variant.DS_TAMANHO}
                                          </td>
                                          <td className="p-3 font-medium text-slate-600 dark:text-slate-300">
                                            {formatter.format(
                                              Number(variant.VL_PRECO || 0),
                                            )}
                                          </td>
                                          <td className="p-3 text-center font-black">
                                            {variant.QT_ESTOQUE}
                                          </td>
                                          <td className="p-3 text-center">
                                            <div
                                              className={cn(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-black uppercase text-[9px]",
                                                style.bg,
                                                style.text,
                                              )}
                                            >
                                              <span
                                                className={cn(
                                                  "size-1 rounded-full",
                                                  style.dot,
                                                )}
                                              />
                                              {variant.ds_status_texto}
                                            </div>
                                          </td>
                                          <td className="p-3 pr-5 text-right">
                                            <div className="flex justify-end gap-1">
                                              <button
                                                onClick={() =>
                                                  setModals({
                                                    ...modals,
                                                    edit: variant,
                                                  })
                                                }
                                                className="p-2 hover:bg-[#11d4c4]/10 text-[#11d4c4] rounded-lg transition-all"
                                              >
                                                <span className="material-symbols-outlined text-lg">
                                                  edit
                                                </span>
                                              </button>
                                              <button
                                                onClick={() =>
                                                  setModals({
                                                    ...modals,
                                                    deleteVariation: variant,
                                                  })
                                                }
                                                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-all"
                                              >
                                                <span className="material-symbols-outlined text-lg">
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
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <footer className="p-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/20">
          <p className="text-xs font-bold text-slate-400">
            Página{" "}
            <span className="text-slate-900 dark:text-white">
              {currentPage}
            </span>{" "}
            de{" "}
            <span className="text-slate-900 dark:text-white">
              {totalPages || 1}
            </span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-all disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-all disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

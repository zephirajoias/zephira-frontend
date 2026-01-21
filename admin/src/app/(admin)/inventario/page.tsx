"use client";

import { AddVariationModal } from "@/components/dashboard/inventario/addVariationModal";
import { DeleteProductModal } from "@/components/dashboard/inventario/deleteProductModal";
import { DeleteVariacaoModal } from "@/components/dashboard/inventario/deleteVariacaoModal"; // Importe o novo modal
import { EditProductModal } from "@/components/dashboard/inventario/editProductModal";
import { NewProductModal } from "@/components/dashboard/inventario/novoProdutoModal";
import api from "@/lib/api";
import Image from "next/image";
import { Fragment, useEffect, useMemo, useState } from "react";

// Interface da API (Flat)
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

// Interface Agrupada
interface GroupedProduct {
  CD_PRODUTO: number;
  NM_PRODUTO: string;
  ds_imagem_thumb: string;
  NM_CATEGORIA: string;
  total_estoque: number;
  variations: InventoryItem[];
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Modais de Produto Pai
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVariationModalOpen, setIsVariationModalOpen] = useState(false);

  // States de Ação
  const [editingProduct, setEditingProduct] = useState<any>(null); // Editar (Pode ser usado para variação se a lógica for a mesma)
  const [deletingProduct, setDeletingProduct] = useState<any>(null); // Excluir Produto Pai
  const [deletingVariation, setDeletingVariation] =
    useState<InventoryItem | null>(null); // NOVO: Excluir Variação Específica

  const [variationParent, setVariationParent] = useState<any>(null);

  // Dados
  const [rawInventory, setRawInventory] = useState<InventoryItem[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const fetchInventory = async () => {
    try {
      const response = await api.get("/admin/estoque-detalhes");
      setRawInventory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // --- LÓGICA DE AGRUPAMENTO (MANTIDA IGUAL) ---
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
    if (!searchTerm) return list;

    return list.filter(
      (prod) =>
        prod.NM_PRODUTO.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.variations.some((v) =>
          v.CD_SKU.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [rawInventory, searchTerm]);

  const totalPages = Math.ceil(groupedInventory.length / ITEMS_PER_PAGE);
  const paginatedData = groupedInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleRow = (productId: number) => {
    setExpandedRows((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Helpers Visuais (MANTIDOS IGUAIS)
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Estoque":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Estoque Baixo":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      case "Esgotado":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "Em Estoque":
        return "bg-emerald-500";
      case "Estoque Baixo":
        return "bg-amber-500";
      case "Esgotado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddVariation = (product: GroupedProduct) => {
    setVariationParent({
      CD_PRODUTO: product.CD_PRODUTO,
      NM_PRODUTO: product.NM_PRODUTO,
      ds_imagem_thumb: product.ds_imagem_thumb,
    });
    setIsVariationModalOpen(true);
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
      {/* --- MODAIS --- */}
      <NewProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <AddVariationModal
        isOpen={isVariationModalOpen}
        onClose={() => setIsVariationModalOpen(false)}
        product={variationParent}
        onSuccess={fetchInventory}
      />

      <EditProductModal
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        product={editingProduct}
        onSuccess={fetchInventory}
      />

      {/* Modal para Excluir PRODUTO PAI (Tudo) */}
      <DeleteProductModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        product={deletingProduct}
        onSuccess={fetchInventory}
      />

      {/* Modal para Excluir VARIAÇÃO ESPECÍFICA (Filho) */}
      <DeleteVariacaoModal
        isOpen={!!deletingVariation} // CORRIGIDO: Usa o state correto
        onClose={() => setDeletingVariation(null)}
        product={deletingVariation} // Passa a variação
        onSuccess={fetchInventory}
      />

      {/* 1. Cabeçalho (MANTIDO) */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--zephira-text)] dark:text-white">
            Estoque
          </h2>
          <p className="text-[var(--zephira-muted)] text-base font-medium">
            Gerencie produtos e suas variações.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-[var(--zephira-primary)] hover:brightness-105 text-[#102220] font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add</span>
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* 2. Filtros (MANTIDO) */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-[var(--zephira-dark)] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex-1 min-w-[280px]">
          <label className="relative flex items-center w-full h-11">
            <span className="material-symbols-outlined absolute left-3 text-[var(--zephira-muted)]">
              search
            </span>
            <input
              className="w-full h-full pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-[#0b1816] border-transparent focus:border-[var(--zephira-primary)] focus:bg-white dark:focus:bg-black focus:ring-0 transition-colors text-sm text-[var(--zephira-text)] dark:text-white"
              placeholder="Buscar por produto, SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* 3. Tabela Hierárquica */}
      <div className="bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#0b1816] border-b border-gray-200 dark:border-white/5 text-[var(--zephira-muted)] text-xs uppercase">
                <th className="py-4 px-6 w-12" />
                <th className="py-4 px-6 font-bold">Produto</th>
                <th className="py-4 px-6 font-bold">Categoria</th>
                <th className="py-4 px-6 font-bold text-center">
                  Total Variações
                </th>
                <th className="py-4 px-6 font-bold text-center">
                  Estoque Total
                </th>
                <th className="py-4 px-6 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {paginatedData.map((product) => {
                const isExpanded = expandedRows.includes(product.CD_PRODUTO);

                return (
                  <Fragment key={product.CD_PRODUTO}>
                    {/* LINHA PAI (PRODUTO) */}
                    <tr
                      className={`group transition-colors cursor-pointer ${isExpanded ? "bg-gray-50 dark:bg-white/5" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
                      onClick={() => toggleRow(product.CD_PRODUTO)}
                    >
                      {/* Seta */}
                      <td className="py-4 px-6 text-center">
                        <button
                          className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        >
                          <span className="material-symbols-outlined text-gray-400">
                            chevron_right
                          </span>
                        </button>
                      </td>

                      {/* Info Produto */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-lg bg-gray-100 relative overflow-hidden shrink-0 border border-gray-200 dark:border-white/10">
                            <Image
                              src={
                                product.ds_imagem_thumb?.startsWith("http")
                                  ? product.ds_imagem_thumb
                                  : "/assets/placeholder.png"
                              }
                              alt={product.NM_PRODUTO}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-bold text-[var(--zephira-text)] dark:text-white">
                            {product.NM_PRODUTO}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-[var(--zephira-muted)]">
                        {product.NM_CATEGORIA}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                          {product.variations.length} Opções
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-[var(--zephira-text)] dark:text-white">
                        {product.total_estoque}
                      </td>

                      {/* Ações do Pai */}
                      <td
                        className="py-4 px-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleAddVariation(product)}
                            className="text-[var(--zephira-muted)] hover:text-[var(--zephira-primary)] p-2 hover:bg-[var(--zephira-primary)]/10 rounded-lg transition-colors"
                            title="Adicionar Variação"
                          >
                            <span className="material-symbols-outlined">
                              playlist_add
                            </span>
                          </button>
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="text-[var(--zephira-muted)] hover:text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Excluir Produto Completo"
                          >
                            <span className="material-symbols-outlined">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* LINHA FILHA (VARIAÇÕES) */}
                    {isExpanded && (
                      <tr className="bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-white/5 animate-in slide-in-from-top-2 fade-in duration-200">
                        <td colSpan={6} className="p-0">
                          <div className="px-6 pb-6 pt-2">
                            <div className="rounded-lg border border-gray-200 dark:border-white/5 overflow-hidden">
                              <table className="w-full text-sm text-left">
                                <thead className="bg-gray-100 dark:bg-white/5 text-[var(--zephira-muted)] text-xs uppercase">
                                  <tr>
                                    <th className="px-4 py-2 font-semibold">
                                      SKU
                                    </th>
                                    <th className="px-4 py-2 font-semibold">
                                      Tamanho
                                    </th>
                                    <th className="px-4 py-2 font-semibold">
                                      Preço
                                    </th>
                                    <th className="px-4 py-2 font-semibold text-center">
                                      Estoque
                                    </th>
                                    <th className="px-4 py-2 font-semibold text-center">
                                      Status
                                    </th>
                                    <th className="px-4 py-2 font-semibold text-right">
                                      Ações
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-white dark:bg-[#152321]">
                                  {product.variations.map((variant) => (
                                    <tr
                                      key={variant.CD_VARIACAO}
                                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                                        {variant.CD_SKU}
                                      </td>
                                      <td className="px-4 py-3 font-bold text-[var(--zephira-text)] dark:text-white">
                                        {variant.DS_TAMANHO}
                                      </td>
                                      <td className="px-4 py-3 text-white">
                                        R$ {variant.VL_PRECO}
                                      </td>
                                      <td className="px-4 py-3 text-center text-white">
                                        {variant.QT_ESTOQUE}
                                      </td>
                                      <td className="px-4 py-3 text-center">
                                        <span
                                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${getStatusColor(variant.ds_status_texto)}`}
                                        >
                                          <span
                                            className={`size-1 rounded-full ${getStatusDot(variant.ds_status_texto)}`}
                                          />
                                          {variant.ds_status_texto}
                                        </span>
                                      </td>

                                      {/* Ações da Variação (CORRIGIDO) */}
                                      <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                          <button
                                            onClick={() =>
                                              setEditingProduct(variant)
                                            }
                                            className="p-1.5 text-gray-400 hover:text-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/10 rounded"
                                          >
                                            <span className="material-symbols-outlined text-[16px]">
                                              edit
                                            </span>
                                          </button>

                                          {/* CORREÇÃO AQUI: Chama setDeletingVariation, não setDeletingProduct */}
                                          <button
                                            onClick={() =>
                                              setDeletingVariation(variant)
                                            }
                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded"
                                          >
                                            <span className="material-symbols-outlined text-[16px]">
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
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação (MANTIDO) */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200 dark:border-white/5 gap-4 bg-white dark:bg-[var(--zephira-dark)]">
          <p className="text-sm text-[var(--zephira-muted)]">
            Mostrando{" "}
            <span className="font-bold text-[var(--zephira-text)] dark:text-white">
              {groupedInventory.length === 0
                ? 0
                : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            a{" "}
            <span className="font-bold text-[var(--zephira-text)] dark:text-white">
              {Math.min(currentPage * ITEMS_PER_PAGE, groupedInventory.length)}
            </span>{" "}
            de {groupedInventory.length} produtos
          </p>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="px-3 py-1 bg-[var(--zephira-primary)]/10 text-[var(--zephira-primary)] font-bold rounded text-sm">
              {currentPage}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { DeletePromotionModal } from "@/components/dashboard/promocoes/deletePromotionModal";
import { EditPromotionModal } from "@/components/dashboard/promocoes/editPromotionModal";
import { NewPromotionModal } from "@/components/dashboard/promocoes/newPromotionModal";
import api from "@/lib/api";
import { useEffect, useState } from "react";

// Interface compatível com o Backend
interface Promotion {
  CD_PROMOCAO: number;
  NM_PROMOCAO: string;
  DS_CODIGO: string;
  TP_PROMOCAO: string; // Agora usa o nome correto vindo do banco (ex: PERCENTUAL)
  VL_DESCONTO: number;
  DT_INICIO: string;
  DT_FIM: string;
  QT_USO_ATUAL: number;
  SN_ATIVO: number;
}

const initialPromotions: Promotion[] = []; // Começa vazio para evitar flash de dados fake

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);

  // Estados dos Modais
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [deletingPromo, setDeletingPromo] = useState<Promotion | null>(null);

  // --- BUSCAR DADOS ---
  const fetchPromotions = async () => {
    try {
      const response = await api.get("/admin/promocoes");
      console.log("Promoções buscadas:", response.data);
      setPromotions(response.data);
    } catch (error) {
      console.error("Erro ao buscar promoções", error);
    }
  };

  useEffect(() => {
    const load = async () => {
      fetchPromotions();
    };
    load();
  }, []);

  // Filtragem Local
  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.NM_PROMOCAO.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.DS_CODIGO.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // --- HELPERS VISUAIS (CORRIGIDOS PARA OS TIPOS DA API) ---

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PERCENTUAL":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "FRETE_GRATIS":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "VALOR_FIXO":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      case "COMPRE_X_LEVE_Y":
        return "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300";
    }
  };

  const getTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      PERCENTUAL: "% Off",
      VALOR_FIXO: "Valor Fixo",
      FRETE_GRATIS: "Frete Grátis",
      COMPRE_X_LEVE_Y: "Leve + Pague -",
    };
    return map[type] || type; // Se não achar no mapa, mostra o original (fallback)
  };

  const formatDiscountValue = (promo: Promotion) => {
    if (promo.TP_PROMOCAO === "VALOR_FIXO") return `R$ ${promo.VL_DESCONTO}`;
    if (promo.TP_PROMOCAO === "PERCENTUAL") return `${promo.VL_DESCONTO}%`;
    return "-";
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
      {/* --- MODAIS --- */}
      <NewPromotionModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSuccess={fetchPromotions}
      />
      <EditPromotionModal
        isOpen={!!editingPromo}
        onClose={() => setEditingPromo(null)}
        promotion={editingPromo}
        onSuccess={fetchPromotions}
      />
      <DeletePromotionModal
        isOpen={!!deletingPromo}
        onClose={() => setDeletingPromo(null)}
        promotion={deletingPromo}
        onSuccess={fetchPromotions}
      />

      {/* 1. Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[var(--zephira-text)] dark:text-white">
            Promoções
          </h2>
          <p className="text-[var(--zephira-muted)] text-base font-medium">
            Gerencie descontos, cupons e ofertas especiais.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="h-11 px-5 flex items-center justify-center rounded-lg bg-[var(--zephira-primary)] hover:brightness-105 text-[#102220] font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined mr-2">add</span>
            Criar Promoção
          </button>
        </div>
      </div>

      {/* 2. Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#102220] p-5 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <p className="text-[var(--zephira-muted)] text-sm font-bold uppercase">
              Ativas
            </p>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">
              Status Atual
            </span>
          </div>
          <p className="text-[var(--zephira-text)] dark:text-white text-3xl font-black mt-2">
            {promotions.filter((p) => p.SN_ATIVO === 1).length}
          </p>
        </div>

        <div className="bg-white dark:bg-[#102220] p-5 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm flex flex-col gap-1">
          <div className="flex justify-between items-start">
            <p className="text-[var(--zephira-muted)] text-sm font-bold uppercase">
              Usos Totais
            </p>
            <span className="bg-[var(--zephira-primary)]/20 text-teal-800 dark:text-teal-200 text-xs font-bold px-2 py-1 rounded-full">
              Global
            </span>
          </div>
          <p className="text-[var(--zephira-text)] dark:text-white text-3xl font-black mt-2">
            {promotions.reduce(
              (acc, curr) => acc + (curr.QT_USO_ATUAL || 0),
              0,
            )}
          </p>
        </div>
      </div>

      {/* 3. Filtros */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-[#102220] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex-1 min-w-[280px]">
          <label className="relative flex items-center w-full h-11">
            <span className="material-symbols-outlined absolute left-3 text-[var(--zephira-muted)]">
              search
            </span>
            <input
              className="w-full h-full pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-[#0b1816] border-transparent focus:border-[var(--zephira-primary)] focus:bg-white dark:focus:bg-black focus:ring-0 transition-colors text-sm text-[var(--zephira-text)] dark:text-white placeholder-gray-400"
              placeholder="Buscar por nome ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* 4. Tabela */}
      <div className="bg-white dark:bg-[#102220] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-[#0b1816] border-b border-gray-200 dark:border-white/5 text-[var(--zephira-muted)] text-xs uppercase">
                <th className="px-6 py-4 font-bold tracking-wider">Nome</th>
                <th className="px-6 py-4 font-bold tracking-wider hidden md:table-cell">
                  Tipo
                </th>
                <th className="px-6 py-4 font-bold tracking-wider">Cupom</th>
                <th className="px-6 py-4 font-bold tracking-wider hidden lg:table-cell">
                  Validade
                </th>
                <th className="px-6 py-4 font-bold tracking-wider hidden xl:table-cell text-center">
                  Uso
                </th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">
                  Status
                </th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredPromotions.map((promo) => (
                <tr
                  key={promo.CD_PROMOCAO}
                  className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[var(--zephira-text)] dark:text-white">
                        {promo.NM_PROMOCAO}
                      </span>
                      {/* Valor Formatado */}
                      <span className="text-xs text-[var(--zephira-muted)] mt-0.5">
                        {formatDiscountValue(promo)}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getTypeColor(promo.TP_PROMOCAO)}`}
                    >
                      {getTypeLabel(promo.TP_PROMOCAO)}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-gray-100 dark:bg-white/10 rounded text-xs font-mono font-bold text-[var(--zephira-text)] dark:text-white border border-gray-200 dark:border-white/5">
                        {promo.DS_CODIGO}
                      </code>
                    </div>
                  </td>

                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-[var(--zephira-muted)] font-medium">
                      {new Date(promo.DT_FIM).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="px-6 py-4 hidden xl:table-cell text-center">
                    <span className="text-sm font-bold text-[var(--zephira-text)] dark:text-white">
                      {promo.QT_USO_ATUAL || 0}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div
                      className={`inline-flex size-3 rounded-full ${promo.SN_ATIVO === 1 ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"}`}
                      title={promo.SN_ATIVO === 1 ? "Ativo" : "Inativo"}
                    ></div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => setEditingPromo(promo)}
                        className="p-2 text-[var(--zephira-muted)] hover:text-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => setDeletingPromo(promo)}
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-200 dark:border-white/5 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Total: {filteredPromotions.length}
          </span>
        </div>
      </div>
    </div>
  );
}

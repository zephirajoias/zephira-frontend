"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

// Modais
import { DeletePromotionModal } from "@/components/dashboard/promocoes/deletePromotionModal";
import { EditPromotionModal } from "@/components/dashboard/promocoes/editPromotionModal";
import { NewPromotionModal } from "@/components/dashboard/promocoes/newPromotionModal";

interface Promotion {
  CD_PROMOCAO: number;
  NM_PROMOCAO: string;
  DS_CODIGO: string;
  TP_PROMOCAO: string;
  VL_DESCONTO: number;
  DT_INICIO: string;
  DT_FIM: string;
  QT_USO_ATUAL: number;
  SN_ATIVO: number;
}

// Configuração visual por tipo de promoção
const PROMO_TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; icon: string }
> = {
  PERCENTUAL: {
    label: "% Off",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    icon: "percent",
  },
  FRETE_GRATIS: {
    label: "Frete Grátis",
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-400",
    icon: "local_shipping",
  },
  VALOR_FIXO: {
    label: "Valor Fixo",
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-400",
    icon: "payments",
  },
  COMPRE_X_LEVE_Y: {
    label: "Leve + Pague -",
    bg: "bg-teal-100 dark:bg-teal-900/30",
    text: "text-teal-700 dark:text-teal-400",
    icon: "layers",
  },
  default: {
    label: "Promoção",
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: "sell",
  },
};

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [modals, setModals] = useState({
    new: false,
    edit: null as Promotion | null,
    delete: null as Promotion | null,
  });

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/promocoes");
      setPromotions(response.data);
    } catch (error) {
      console.error("Erro ao buscar promoções:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Filtro e Estatísticas
  const filteredPromotions = useMemo(() => {
    return promotions.filter(
      (p) =>
        p.NM_PROMOCAO.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.DS_CODIGO.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [promotions, searchTerm]);

  const stats = useMemo(
    () => ({
      ativas: promotions.filter((p) => p.SN_ATIVO === 1).length,
      usos: promotions.reduce((acc, curr) => acc + (curr.QT_USO_ATUAL || 0), 0),
    }),
    [promotions],
  );

  const formatDiscount = (promo: Promotion) => {
    if (promo.TP_PROMOCAO === "VALOR_FIXO") return `R$ ${promo.VL_DESCONTO}`;
    if (promo.TP_PROMOCAO === "PERCENTUAL") return `${promo.VL_DESCONTO}% OFF`;
    return "Grátis";
  };

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">
      {/* Modais */}
      <NewPromotionModal
        isOpen={modals.new}
        onClose={() => setModals({ ...modals, new: false })}
        onSuccess={fetchPromotions}
      />
      <EditPromotionModal
        isOpen={!!modals.edit}
        onClose={() => setModals({ ...modals, edit: null })}
        promotion={modals.edit}
        onSuccess={fetchPromotions}
      />
      <DeletePromotionModal
        isOpen={!!modals.delete}
        onClose={() => setModals({ ...modals, delete: null })}
        promotion={modals.delete}
        onSuccess={fetchPromotions}
      />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Promoções
          </h2>
          <p className="text-slate-500 font-medium">
            Crie campanhas de incentivo e impulsione suas vendas.
          </p>
        </div>
        <button
          onClick={() => setModals({ ...modals, new: true })}
          className="flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-[#11d4c4] text-[#0a1615] font-black shadow-lg shadow-[#11d4c4]/20 hover:scale-[1.02] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Criar Promoção
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total de Promoções"
          value={promotions.length}
          icon="sell"
          trend="Base Geral"
          trendLabel=""
        />
        <StatCard
          title="Cupons Ativos"
          value={stats.ativas}
          icon="verified"
          trend="No Ar"
          trendLabel=""
          isWarning={stats.ativas === 0}
        />
        <StatCard
          title="Usos Realizados"
          value={stats.usos}
          icon="auto_graph"
          trend="Conversão"
          trendLabel=""
        />
      </div>

      {/* Barra de Filtros */}
      <div className="relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#11d4c4] transition-colors">
          search
        </span>
        <input
          className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-[#102220] border border-slate-200 dark:border-white/5 focus:ring-4 focus:ring-[#11d4c4]/10 transition-all outline-none font-medium"
          placeholder="Pesquisar por nome da campanha ou código do cupom..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela de Promoções */}
      <div className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto text-sm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/2 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                <th className="p-5 pl-8 text-left">Campanha / Desconto</th>
                <th className="p-5 text-left hidden md:table-cell">Tipo</th>
                <th className="p-5 text-left">Código Cupom</th>
                <th className="p-5 text-left hidden lg:table-cell">Validade</th>
                <th className="p-5 text-center">Usos</th>
                <th className="p-5 text-center">Status</th>
                <th className="p-5 text-right pr-8">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-20 text-center animate-pulse text-slate-400 font-black"
                  >
                    Sincronizando ofertas...
                  </td>
                </tr>
              ) : filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center text-slate-400">
                    Nenhuma promoção encontrada.
                  </td>
                </tr>
              ) : (
                filteredPromotions.map((promo) => {
                  const config =
                    PROMO_TYPE_CONFIG[promo.TP_PROMOCAO] ||
                    PROMO_TYPE_CONFIG.default;
                  const isExpired = new Date(promo.DT_FIM) < new Date();

                  return (
                    <tr
                      key={promo.CD_PROMOCAO}
                      className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all"
                    >
                      <td className="p-5 pl-8">
                        <p className="font-black text-slate-900 dark:text-white text-base leading-tight">
                          {promo.NM_PROMOCAO}
                        </p>
                        <p className="text-[#11d4c4] font-black text-xs uppercase mt-1">
                          {formatDiscount(promo)}
                        </p>
                      </td>

                      <td className="p-5 hidden md:table-cell">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black uppercase text-[9px]",
                            config.bg,
                            config.text,
                          )}
                        >
                          <span className="material-symbols-outlined text-base">
                            {config.icon}
                          </span>
                          {config.label}
                        </div>
                      </td>

                      <td className="p-5">
                        <div className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-lg font-mono text-sm font-black text-slate-700 dark:text-slate-300">
                          {promo.DS_CODIGO}
                        </div>
                      </td>

                      <td className="p-5 hidden lg:table-cell font-medium">
                        <p
                          className={cn(
                            "text-xs",
                            isExpired ? "text-red-400" : "text-slate-500",
                          )}
                        >
                          Até{" "}
                          {new Date(promo.DT_FIM).toLocaleDateString("pt-BR")}
                        </p>
                        {isExpired && (
                          <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">
                            Expirado
                          </span>
                        )}
                      </td>

                      <td className="p-5 text-center font-black text-slate-900 dark:text-white">
                        {promo.QT_USO_ATUAL || 0}
                      </td>

                      <td className="p-5">
                        <div className="flex justify-center">
                          <StatusIndicator
                            active={promo.SN_ATIVO === 1 && !isExpired}
                          />
                        </div>
                      </td>

                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={() =>
                              setModals({ ...modals, edit: promo })
                            }
                            className="p-2 hover:bg-[#11d4c4]/10 text-[#11d4c4] rounded-xl"
                          >
                            <span className="material-symbols-outlined text-xl">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              setModals({ ...modals, delete: promo })
                            }
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl"
                          >
                            <span className="material-symbols-outlined text-xl">
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

        <footer className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/20">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {filteredPromotions.length} campanhas listadas
          </p>
        </footer>
      </div>
    </div>
  );
}

// Componente de Status Refinado
function StatusIndicator({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider",
        active
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active
            ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            : "bg-slate-400",
        )}
      />
      {active ? "Ativo" : "Inativo"}
    </div>
  );
}

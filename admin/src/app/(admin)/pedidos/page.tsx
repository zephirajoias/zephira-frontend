"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";

// --- Interfaces ---
interface DashboardMetric {
  quantidade?: number;
  valor?: number;
  tendencia: number;
}

interface DashboardData {
  pendentes: DashboardMetric;
  receitaHoje: DashboardMetric;
  aEnviar: DashboardMetric;
  devolucoes: DashboardMetric;
}

interface Pedido {
  cd_pedido: number;
  ds_data_formatada: string;
  nm_usuario: string;
  ds_email: string;
  nm_produto_exibicao: string;
  vl_total: number;
  tp_metodo_pagamento: string;
  tp_status: string;
  ds_cor_status_css: string;
}

// Mapeamento de Cores para Status
const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> =
  {
    amber: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      dot: "bg-amber-500",
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400",
      dot: "bg-blue-500",
    },
    gray: {
      bg: "bg-slate-100 dark:bg-slate-800",
      text: "text-slate-600 dark:text-slate-400",
      dot: "bg-slate-400",
    },
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-700 dark:text-red-400",
      dot: "bg-red-500",
    },
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
  };

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resPainel, resDetalhes] = await Promise.all([
        api.get("admin/painel-pedidos"),
        api.get("admin/pedidos-detalhes"),
      ]);
      setDashboard(resPainel.data.dashboard);
      setPedidos(resDetalhes.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Lógica de Filtro e Busca
  const filteredPedidos = useMemo(() => {
    return pedidos.filter((p) => {
      const matchesStatus =
        filterStatus === "Todos" || p.tp_status === filterStatus;
      const matchesSearch =
        p.nm_usuario.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.cd_pedido.toString().includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [pedidos, filterStatus, searchQuery]);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6 pb-10 animate-in fade-in duration-500">
      {/* 1. Breadcrumbs & Header */}
      <header className="flex flex-col gap-4">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-widest">
          <span className="hover:text-[#11d4c4] cursor-pointer transition-colors">
            Dashboard
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 dark:text-white">Pedidos</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Gerenciamento de Pedidos
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {filteredPedidos.length} pedidos encontrados na base.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">
                file_download
              </span>{" "}
              Exportar
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2.5 bg-[#11d4c4] text-white rounded-xl text-sm font-bold hover:brightness-105 transition-all shadow-lg shadow-[#11d4c4]/20">
              <span className="material-symbols-outlined text-lg">add</span>{" "}
              Criar Pedido
            </button> */}
          </div>
        </div>
      </header>

      {/* 2. KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pendentes"
          value={dashboard?.pendentes.quantidade ?? 0}
          trend={dashboard?.pendentes.tendencia ?? 0}
          icon="pending_actions"
          trendLabel="atrasados"
        />
        <StatCard
          title="Receita Hoje"
          value={new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(dashboard?.receitaHoje.valor ?? 0)}
          trend={`${dashboard?.receitaHoje.tendencia ?? 0}%`}
          icon="payments"
          trendLabel="vs ontem"
        />
        <StatCard
          title="A Enviar"
          value={dashboard?.aEnviar.quantidade ?? 0}
          trend={dashboard?.aEnviar.tendencia ?? 0}
          icon="local_shipping"
          trendLabel="hoje"
        />
        <StatCard
          title="Devoluções"
          value={dashboard?.devolucoes.quantidade ?? 0}
          trend={dashboard?.devolucoes.tendencia ?? 0}
          icon="assignment_return"
          trendLabel="este mês"
        />
      </div>

      {/* 3. Filters Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white dark:bg-[#102220] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por cliente ou ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#11d4c4]/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            className="pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-white/5 border-none rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#11d4c4]/20 cursor-pointer"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="Todos">Todos os Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Pago">Pago</option>
            <option value="Enviado">Enviado</option>
            <option value="Devolução">Devolução</option>
          </select>

          <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-xl">
            <input
              type="date"
              className="bg-transparent border-none text-xs font-medium focus:ring-0 p-1"
            />
            <span className="text-slate-300">|</span>
            <input
              type="date"
              className="bg-transparent border-none text-xs font-medium focus:ring-0 p-1"
            />
          </div>

          <button
            onClick={() => {
              setFilterStatus("Todos");
              setSearchQuery("");
            }}
            className="px-4 py-2.5 text-sm font-bold text-slate-500 hover:text-red-500 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>

      {/* 4. Data Table */}
      <div className="bg-white dark:bg-[#102220] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
                <th className="p-4 w-14 text-center">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-[#11d4c4] focus:ring-[#11d4c4]"
                  />
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  ID
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Cliente
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden md:table-cell">
                  Produto
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Total
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
                  Status
                </th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-20 text-center animate-pulse text-slate-400 font-medium"
                  >
                    Sincronizando pedidos...
                  </td>
                </tr>
              ) : filteredPedidos.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-20 text-center text-slate-400 font-medium"
                  >
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filteredPedidos.map((order) => {
                  const style =
                    STATUS_STYLES[order.ds_cor_status_css] ||
                    STATUS_STYLES.gray;
                  return (
                    <tr
                      key={order.cd_pedido}
                      className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all"
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-[#11d4c4] focus:ring-[#11d4c4]"
                        />
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-xs font-bold text-[#11d4c4]">
                          #{order.cd_pedido}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {order.ds_data_formatada}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {order.nm_usuario}
                        </div>
                        <div className="text-xs text-slate-400 hidden sm:block">
                          {order.ds_email}
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[200px] block">
                          {order.nm_produto_exibicao}
                        </span>
                      </td>
                      <td className="p-4 text-right font-black text-sm">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(order.vl_total)}
                      </td>
                      <td className="p-4">
                        <div
                          className={cn(
                            "mx-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit",
                            style.bg,
                            style.text,
                          )}
                        >
                          <span
                            className={cn("size-1.5 rounded-full", style.dot)}
                          />
                          {order.tp_status}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 hover:bg-[#11d4c4]/10 text-[#11d4c4] rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-xl">
                            visibility
                          </span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination - Refinada */}
        <footer className="p-4 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 dark:bg-white/2">
          <p className="text-xs font-bold text-slate-400">
            Mostrando{" "}
            <span className="text-slate-900 dark:text-white">
              {filteredPedidos.length}
            </span>{" "}
            de{" "}
            <span className="text-slate-900 dark:text-white">
              {pedidos.length}
            </span>{" "}
            registros
          </p>
          <div className="flex items-center gap-1">
            <PaginationButton disabled>Anterior</PaginationButton>
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
            <PaginationButton>Próximo</PaginationButton>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Sub-componente para Paginação
function PaginationButton({
  children,
  active,
  disabled,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className={cn(
        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
        active
          ? "bg-[#11d4c4] border-[#11d4c4] text-white shadow-sm"
          : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 hover:border-[#11d4c4] hover:text-[#11d4c4]",
        disabled && "opacity-30 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
}

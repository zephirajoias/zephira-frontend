"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import api from "@/lib/api";
import { useEffect, useState } from "react";

interface DashboardMetric {
  quantidade?: number;
  valor?: number;
  tendencia: number;
}

interface Dashboard {
  pendentes: DashboardMetric;
  receitaHoje: DashboardMetric;
  aEnviar: DashboardMetric;
  devolucoes: DashboardMetric;
}

interface Pedidos {
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

// Dados simulados para a tabela
const ORDERS = [
  {
    id: "#10234",
    date: "24 Out, 2023",
    customer: "Jane Doe",
    email: "jane.d@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100",
    product: "Pulseira Diamond Tennis",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=100",
    total: "R$ 1.200,00",
    payment: "Pago",
    status: "Pendente",
    statusColor: "amber",
  },
  {
    id: "#10233",
    date: "24 Out, 2023",
    customer: "John Smith",
    email: "john.s@example.com",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100",
    product: "Brincos de Ouro Argola",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=100",
    total: "R$ 350,00",
    payment: "Pago",
    status: "Enviado",
    statusColor: "blue",
  },
  {
    id: "#10232",
    date: "23 Out, 2023",
    customer: "Lisa Miller",
    email: "lisa.m@example.com",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100",
    product: "Colar de Pérolas",
    image:
      "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=100",
    total: "R$ 890,00",
    payment: "Não Pago",
    status: "Pendente",
    statusColor: "amber",
  },
  {
    id: "#10231",
    date: "23 Out, 2023",
    customer: "Robert Fox",
    email: "r.fox@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
    product: "Anel de Safira",
    image:
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=100",
    total: "R$ 2.450,00",
    payment: "Pago",
    status: "Entregue",
    statusColor: "gray",
  },
  {
    id: "#10230",
    date: "22 Out, 2023",
    customer: "Sarah Lee",
    email: "sarah.lee@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    product: "Pingente Ruby",
    image:
      "https://images.unsplash.com/photo-1602751584552-8ba420552259?auto=format&fit=crop&q=80&w=100",
    total: "R$ 550,00",
    payment: "Pago",
    status: "Enviado",
    statusColor: "blue",
  },
  {
    id: "#10229",
    date: "21 Out, 2023",
    customer: "David Wong",
    email: "d.wong@example.com",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100",
    product: "Pulseira Esmeralda",
    image:
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=100",
    total: "R$ 1.800,00",
    payment: "Pago",
    status: "Devolução",
    statusColor: "red",
  },
];

export default function OrdersPage() {
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [pedidos, setPedidos] = useState<Pedidos[]>([]);

  const painelPedidos = async () => {
    try {
      const response = await api.get("admin/painel-pedidos");
      console.log("Painel de Pedidos:", response.data);
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error("Erro ao buscar painel de pedidos:", error);
    }
  };

  const pedidosDetalhes = async () => {
    try {
      const response = await api.get("admin/pedidos-detalhes");
      console.log("Detalhes dos Pedidos:", response.data);
      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao buscar detalhes dos pedidos:", error);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      painelPedidos();
      pedidosDetalhes();
    };
    loadDashboard();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-6 pb-10">
      {/* 1. Breadcrumbs & Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-[var(--zephira-muted)]">
          <span className="hover:text-[var(--zephira-primary)] cursor-pointer">
            Dashboard
          </span>
          <span>/</span>
          <span className="text-[var(--zephira-text)] dark:text-white font-medium">
            Pedidos
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--zephira-text)] dark:text-white tracking-tight">
              Gerenciamento de Pedidos
            </h2>
            <p className="text-[var(--zephira-muted)] mt-1">
              Acompanhe e gerencie pedidos e envios.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[var(--zephira-dark)] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-[var(--zephira-text)] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[20px]">
                file_download
              </span>
              Exportar CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[var(--zephira-primary)] text-white rounded-lg text-sm font-bold hover:brightness-105 transition-colors shadow-md shadow-[var(--zephira-primary)]/20">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Criar Pedido
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pedidos Pendentes"
          value={dashboard?.pendentes.quantidade ?? 0}
          trend={dashboard?.pendentes.tendencia ?? 0}
          icon="pending_actions"
          trendLabel="vs mês passado"
        />
        <StatCard
          title="Receita Hoje"
          value={`R$ ${dashboard?.receitaHoje.valor?.toFixed(2) ?? "0.00"}`}
          trend={`${dashboard?.receitaHoje.tendencia ?? "0"}%`}
          icon="payments"
          trendLabel="vs ontem"
        />
        <StatCard
          title="A Enviar"
          value={dashboard?.aEnviar.quantidade ?? 0}
          trend={dashboard?.aEnviar.tendencia ?? 0}
          icon="local_shipping"
          trendLabel="vs mês passado"
        />
        <StatCard
          title="Devoluções"
          value={dashboard?.devolucoes.quantidade ?? 0}
          trend={dashboard?.devolucoes.tendencia ?? 0}
          icon="assignment_return"
          trendLabel="vs mês passado"
        />
      </div>

      {/* 3. Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm items-center">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--zephira-muted)] text-[20px]">
              filter_list
            </span>
            <select
              className="w-full pl-10 pr-8 py-2 bg-gray-50 dark:bg-[#0b1816] border-none rounded-lg text-sm text-[var(--zephira-text)] dark:text-white focus:ring-1 focus:ring-[var(--zephira-primary)]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Enviado">Enviado</option>
              <option value="Entregue">Entregue</option>
              <option value="Devolução">Devolução</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            className="w-full md:w-auto py-2 px-3 bg-gray-50 dark:bg-[#0b1816] border-none rounded-lg text-sm text-[var(--zephira-text)] dark:text-white focus:ring-1 focus:ring-[var(--zephira-primary)] text-[var(--zephira-muted)]"
            type="date"
          />
          <span className="text-[var(--zephira-muted)] text-sm">-</span>
          <input
            className="w-full md:w-auto py-2 px-3 bg-gray-50 dark:bg-[#0b1816] border-none rounded-lg text-sm text-[var(--zephira-text)] dark:text-white focus:ring-1 focus:ring-[var(--zephira-primary)] text-[var(--zephira-muted)]"
            type="date"
          />
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button className="px-3 py-2 text-sm font-medium text-[var(--zephira-muted)] hover:text-[var(--zephira-primary)] transition-colors">
            Limpar Filtros
          </button>
          <button className="px-4 py-2 bg-[var(--zephira-primary)]/10 text-[var(--zephira-primary)] rounded-lg text-sm font-bold hover:bg-[var(--zephira-primary)]/20 transition-colors">
            Aplicar
          </button>
        </div>
      </div>

      {/* 4. Data Table */}
      <div className="bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0b1816]">
                <th className="p-4 w-12 text-center">
                  <input
                    className="rounded border-gray-300 text-[var(--zephira-primary)] focus:ring-[var(--zephira-primary)]/20 bg-white dark:bg-[#162e2b] dark:border-gray-600"
                    type="checkbox"
                  />
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--zephira-muted)]">
                  ID Pedido
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--zephira-muted)]">
                  Data
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--zephira-muted)]">
                  Cliente
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--zephira-muted)]">
                  Itens
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--zephira-muted)] text-right">
                  Total
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--zephira-muted)] text-center">
                  Pagamento
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--zephira-muted)] text-center">
                  Status
                </th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-[var(--zephira-muted)] text-right">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {pedidos.map((order) => (
                <tr
                  key={order.cd_pedido}
                  className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <td className="p-4 w-12 text-center">
                    <input
                      className="rounded border-gray-300 text-[var(--zephira-primary)] focus:ring-[var(--zephira-primary)]/20 bg-white dark:bg-[#162e2b] dark:border-gray-600"
                      type="checkbox"
                    />
                  </td>
                  <td className="p-4 text-sm font-semibold text-[var(--zephira-primary)]">
                    {order.cd_pedido}
                  </td>
                  <td className="p-4 text-sm text-[var(--zephira-text)] dark:text-white">
                    {order.ds_data_formatada}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[var(--zephira-text)] dark:text-white">
                          {order.nm_usuario}
                        </span>
                        <span className="text-xs text-[var(--zephira-muted)]">
                          {order.ds_email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm text-[var(--zephira-text)] dark:text-white truncate max-w-[150px]">
                          {order.nm_produto_exibicao}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-semibold text-[var(--zephira-text)] dark:text-white text-right">
                    {order.vl_total}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold 
                      ${
                        order.tp_status === "Pago"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          order.tp_status === "Pago"
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      ></span>
                      {order.tp_status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold 
                      ${
                        order.ds_cor_status_css === "amber"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : ""
                      }
                      ${
                        order.ds_cor_status_css === "blue"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : ""
                      }
                      ${
                        order.ds_cor_status_css === "gray"
                          ? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                          : ""
                      }
                      ${
                        order.ds_cor_status_css === "red"
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : ""
                      }
                    `}
                    >
                      <span
                        className={`size-1.5 rounded-full 
                        ${
                          order.ds_cor_status_css === "amber"
                            ? "bg-amber-500"
                            : ""
                        }
                        ${
                          order.ds_cor_status_css === "blue"
                            ? "bg-blue-500"
                            : ""
                        }
                        ${
                          order.ds_cor_status_css === "gray"
                            ? "bg-gray-500"
                            : ""
                        }
                        ${order.ds_cor_status_css === "red" ? "bg-red-500" : ""}
                      `}
                      ></span>
                      {order.tp_status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-[var(--zephira-primary)] hover:text-teal-600 font-bold text-sm px-3 py-1.5 rounded-lg bg-[var(--zephira-primary)]/10 hover:bg-[var(--zephira-primary)]/20 transition-colors">
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--zephira-muted)]">
            Mostrando{" "}
            <span className="font-medium text-[var(--zephira-text)] dark:text-white">
              1
            </span>{" "}
            a{" "}
            <span className="font-medium text-[var(--zephira-text)] dark:text-white">
              6
            </span>{" "}
            de{" "}
            <span className="font-medium text-[var(--zephira-text)] dark:text-white">
              450
            </span>{" "}
            resultados
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium text-[var(--zephira-muted)] hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50">
              Anterior
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[var(--zephira-primary)] text-white text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium text-[var(--zephira-muted)] hover:bg-gray-50 dark:hover:bg-white/5">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium text-[var(--zephira-muted)] hover:bg-gray-50 dark:hover:bg-white/5">
              3
            </button>
            <span className="text-[var(--zephira-muted)]">...</span>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-sm font-medium text-[var(--zephira-muted)] hover:bg-gray-50 dark:hover:bg-white/5">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

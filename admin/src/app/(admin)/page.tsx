"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { usePedidosRecentes } from "@/contexts/PedidosRecentesContext";
import { useUserData } from "@/hooks/useUserData";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// --- Interfaces Melhoradas ---
interface DashboardKPIs {
  vendas: { valorAtual: string; porcentagem: string };
  pedidos: { quantidade: string; porcentagem: string };
  clientes: { total: string; porcentagem: string };
  estoque: { alertas: string };
}

interface EstoqueBaixo {
  NM_PRODUTO: string;
  CD_SKU: string;
  QT_ESTOQUE: string;
  DS_IMAGEM_THUMB: string;
}

interface ProdutoMaisVendido {
  NM_PRODUTO: string;
  qt_vendida: string;
}

// Utilitário de formatação (Pode ir para /lib/utils.ts)
const formatCurrency = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num);
};

export default function HomePage() {
  const router = useRouter();
  const { name } = useUserData();
  const { pedidosRecentesData, loading: loadingPedidos } = usePedidosRecentes();

  // Estados Agrupados
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [estoqueBaixo, setEstoqueBaixo] = useState<EstoqueBaixo[]>([]);
  const [maisVendido, setMaisVendido] = useState<ProdutoMaisVendido | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Dispara todas as chamadas em paralelo
      const [resPainel, resEstoque, resMaisVendido] = await Promise.all([
        api.get("/admin/painel"),
        api.get("/admin/estoque-baixo"),
        api.get("/admin/produto-mais-vendido"),
      ]);

      const d = resPainel.data.dashboard;
      setKpis({
        vendas: {
          valorAtual: d.vendas.valorAtual,
          porcentagem: d.vendas.porcentagemCrescimento,
        },
        pedidos: {
          quantidade: d.pedidos.quantidadeHoje,
          porcentagem: d.pedidos.porcentagemCrescimento,
        },
        clientes: {
          total: d.clientes.totalAtivos,
          porcentagem: d.clientes.porcentagemNovos,
        },
        estoque: { alertas: d.estoque.alertas },
      });
      setEstoqueBaixo(resEstoque.data);
      setMaisVendido(resMaisVendido.data);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-8 pb-10">
      {/* 1. Heading - Mais limpo */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Olá,{" "}
            <span className="text-[var(--zephira-primary)]">
              {name?.split(" ")[0]}
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Aqui está o que está acontecendo na sua loja hoje.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <span className="material-symbols-outlined text-lg">download</span>{" "}
            Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#11d4c4] text-white rounded-xl text-sm font-bold hover:brightness-105 transition-all shadow-lg shadow-[#11d4c4]/20">
            <span className="material-symbols-outlined text-lg">add</span> Nova
            Joia
          </button>
        </div>
      </header>

      {/* 2. KPI Cards - Renderização condicional para evitar 'undefined' */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Vendas Totais"
          value={formatCurrency(kpis?.vendas.valorAtual || 0)}
          trend={`+${kpis?.vendas.porcentagem}%`}
          trendLabel="vs mês anterior"
          icon="payments"
        />
        <StatCard
          title="Novos Pedidos"
          value={kpis?.pedidos.quantidade || "0"}
          trend={`+${kpis?.pedidos.porcentagem}%`}
          trendLabel="vs ontem"
          icon="shopping_cart"
        />
        <StatCard
          title="Clientes Ativos"
          value={kpis?.clientes.total || "0"}
          trend={`+${kpis?.clientes.porcentagem}%`}
          trendLabel="novos"
          icon="group"
        />
        <StatCard
          title="Alertas de Estoque"
          value={kpis?.estoque.alertas || "0"}
          trend="Urgente"
          trendLabel="itens baixos"
          icon="warning"
          isWarning={Number(kpis?.estoque.alertas) > 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 3. Tabela de Pedidos - Mais robusta */}
        <section className="xl:col-span-2 bg-white dark:bg-[#102220] rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="font-bold text-lg">Pedidos Recentes</h3>
            <button className="text-[#11d4c4] text-sm font-bold hover:underline">
              Ver relatório completo
            </button>
          </div>
          <div className="overflow-x-auto text-sm">
            <table className="w-full border-collapse">
              <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 text-[11px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Produto / Cliente</th>
                  <th className="p-4 text-left">Data</th>
                  <th className="p-4 text-left">Valor</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {loadingPedidos ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400">
                      Carregando pedidos...
                    </td>
                  </tr>
                ) : (
                  pedidosRecentesData.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4 font-mono text-xs text-slate-500">
                        #{order.id.slice(-6)}
                      </td>
                      <td className="p-4">
                        <div className="font-bold">{order.produto}</div>
                        <div className="text-xs text-slate-400">
                          {order.usuario}
                        </div>
                      </td>
                      <td className="p-4 text-slate-500">{order.data}</td>
                      <td className="p-4 font-bold">
                        {formatCurrency(order.valor)}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={order.status} cor={order.cor} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Widgets Laterais */}
        <aside className="flex flex-col gap-6">
          {/* Item mais vendido com estilo Premium */}
          <div className="bg-[#102220] rounded-2xl p-6 text-white relative overflow-hidden group shadow-xl">
            <div className="relative z-10">
              <span className="text-[#11d4c4] text-[10px] font-bold uppercase tracking-widest">
                Destaque de Vendas
              </span>
              <h3 className="text-xl font-bold mt-1 mb-4">
                {maisVendido?.NM_PRODUTO || "Calculando..."}
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-black">
                  {maisVendido?.qt_vendida || 0}
                </span>
                <span className="text-sm text-slate-400 mb-1">
                  unidades este mês
                </span>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined text-[120px]">
                workspace_premium
              </span>
            </div>
          </div>

          {/* Estoque Baixo */}
          <div className="bg-white dark:bg-[#102220] rounded-2xl border border-slate-200 dark:border-white/5 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Reposição Crítica</h3>
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Alerta
              </span>
            </div>
            <div className="space-y-4">
              {estoqueBaixo.map((item) => (
                <div
                  key={item.CD_SKU}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  <div className="size-12 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0">
                    <Image
                      src={item.DS_IMAGEM_THUMB || "/placeholder.png"}
                      alt={item.NM_PRODUTO}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {item.NM_PRODUTO}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {item.CD_SKU}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-red-500">
                      {item.QT_ESTOQUE}
                    </p>
                    <p className="text-[9px] uppercase font-bold text-slate-400">
                      Restam
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => router.push("/inventario")}
              className="w-full mt-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Ir para Inventário
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Sub-componente para os Badges de Status
function StatusBadge({ status, cor }: { status: string; cor: string }) {
  const styles: Record<string, string> = {
    yellow:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    green:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
        styles[cor] || "bg-slate-100 text-slate-600",
      )}
    >
      {status}
    </span>
  );
}

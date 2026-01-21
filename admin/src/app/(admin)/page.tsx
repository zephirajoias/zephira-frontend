"use client";
import { StatCard } from "@/components/dashboard/StatCard";
import { usePedidosRecentes } from "@/contexts/PedidosRecentesContext";
import { useUserData } from "@/hooks/useUserData";
import api from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface pedidosRecentes {
  id: string;
  produto: string;
  usuario: string;
  data: string;
  valor: string;
  status: string;
  cor: string;
}

interface estoqueBaixo {
  NM_PRODUTO: string;
  CD_SKU: string;
  QT_ESTOQUE: string;
  DS_IMAGEM_THUMB: string;
}

interface produtoMaisVendidoProps {
  NM_PRODUTO: string;
  qt_vendida: string;
}

export default function HomePage() {
  const [totalVendas, setTotalVendas] = useState("");
  const [porcentagemVendas, setPorcentagemVendas] = useState("");
  const [totalPedidos, setTotalPedidos] = useState("");
  const [porcentagemPedidos, setPorcentagemPedidos] = useState("");
  const [totalClientes, setTotalClientes] = useState("");
  const [porcentagemClientes, setPorcentagemClientes] = useState("");
  const [totalAlertas, setTotalAlertas] = useState("");
  const { pedidosRecentesData, loading } = usePedidosRecentes();
  const [estoqueBaixoData, setEstoqueBaixoData] = useState<estoqueBaixo[]>([]);
  const [produtoMaisVendido, setProdutoMaisVendido] =
    useState<produtoMaisVendidoProps | null>(null);

  const router = useRouter();
  const { name } = useUserData();

  const fetchTotalVendas = async () => {
    try {
      const response = await api.get("/admin/painel");
      console.log(response.data);
      setTotalVendas(response.data.dashboard.vendas.valorAtual);
      setPorcentagemVendas(
        response.data.dashboard.vendas.porcentagemCrescimento,
      );
      setTotalPedidos(response.data.dashboard.pedidos.quantidadeHoje);
      setPorcentagemPedidos(
        response.data.dashboard.pedidos.porcentagemCrescimento,
      );
      setTotalClientes(response.data.dashboard.clientes.totalAtivos);
      setPorcentagemClientes(response.data.dashboard.clientes.porcentagemNovos);
      setTotalAlertas(response.data.dashboard.estoque.alertas);
    } catch (err) {
      console.log(err);
    }
  };

  const estoqueBaixo = async () => {
    try {
      const response = await api.get("/admin/estoque-baixo");
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const produtoMaisVendidoFunc = async () => {
    try {
      const response = await api.get("/admin/produto-mais-vendido");
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleEstoque = () => {
    router.push("/inventario");
  };

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchTotalVendas();
      setEstoqueBaixoData(await estoqueBaixo());
      setProdutoMaisVendido(await produtoMaisVendidoFunc());
    };

    loadDashboard();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto flex flex-col gap-8 pb-10">
      {/* 1. Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--zephira-text)] dark:text-white tracking-tight">
            Olá, {name}
          </h1>
          <p className="text-[var(--zephira-muted)] mt-1">
            Aqui está o desempenho da Zephira hoje.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[var(--zephira-dark)] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-bold text-[var(--zephira-text)] dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>{" "}
            Exportar
          </button>
          <button className="px-4 py-2 bg-[var(--zephira-primary)] hover:brightness-105 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-[var(--zephira-primary)]/20 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">add</span>{" "}
            Nova Joia
          </button>
        </div>
      </div>

      {/* 2. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Vendas Totais"
          value={totalVendas}
          trend={`+${porcentagemVendas}%`}
          trendLabel="vs mês anterior"
          icon="payments"
        />
        <StatCard
          title="Novos Pedidos"
          value={totalPedidos}
          trend={`+${porcentagemPedidos}%`}
          trendLabel="vs ontem"
          icon="shopping_cart"
        />
        <StatCard
          title="Clientes Ativos"
          value={totalClientes}
          trend={`+${porcentagemClientes}%`}
          trendLabel="agora"
          icon="person"
        />
        <StatCard
          title="Alertas de Estoque"
          value={totalAlertas}
          trend="Urgente"
          trendLabel="reposição necessária"
          icon="warning"
          isWarning
        />
      </div>

      {/* 3. Main Chart Section */}
      <div className="bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white">
              Análise de Receita
            </h3>
            <p className="text-[var(--zephira-muted)] text-sm">
              Desempenho mensal de vendas
            </p>
          </div>
          {/* Chart Period Selector could be a component */}
        </div>
        <div className="w-full h-64 relative overflow-hidden">
          {/* Mantive o SVG para performance, boa escolha */}
          <svg
            className="w-full h-full"
            preserveAspectRatio="none"
            viewBox="0 0 1000 300"
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#11d4c4" stopOpacity="0.2"></stop>
                <stop offset="100%" stopColor="#11d4c4" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path
              d="M0,250 C100,200 200,220 300,150 C400,80 500,120 600,90 C700,60 800,100 900,50 L1000,80 L1000,300 L0,300 Z"
              fill="url(#chartGradient)"
            ></path>
            <path
              d="M0,250 C100,200 200,220 300,150 C400,80 500,120 600,90 C700,60 800,100 900,50 L1000,80"
              fill="none"
              stroke="#11d4c4"
              strokeLinecap="round"
              strokeWidth="3"
            ></path>
          </svg>
        </div>
      </div>

      {/* 4. Split Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white">
              Pedidos Recentes
            </h3>
            <a
              href="#"
              className="text-[var(--zephira-primary)] text-sm font-bold hover:underline"
            >
              Ver Todos
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/5 text-[var(--zephira-muted)] text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold">ID Pedido</th>
                  <th className="p-4 font-bold">Produto</th>
                  <th className="p-4 font-bold">Data</th>
                  <th className="p-4 font-bold">Valor</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-white/5">
                {pedidosRecentesData.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-medium text-[var(--zephira-text)] dark:text-white">
                      {order.id}
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-[var(--zephira-text)] dark:text-white">
                          {order.produto}
                        </p>
                        <p className="text-xs text-[var(--zephira-muted)]">
                          {order.usuario}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-[var(--zephira-muted)]">
                      {order.data}
                    </td>
                    <td className="p-4 font-bold text-[var(--zephira-text)] dark:text-white">
                      {order.valor}
                    </td>
                    <td className="p-4">
                      {/* Badge lógico simplificado - classes poderiam ser extraídas */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold 
                        ${
                          order.cor === "yellow"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200"
                            : ""
                        }
                        ${
                          order.cor === "blue"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
                            : ""
                        }
                        ${
                          order.cor === "green"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200"
                            : ""
                        }
                      `}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="xl:col-span-1 flex flex-col gap-6">
          {/* Top Item Widget */}
          <div className="bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-6">
            <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white mb-4">
              Item Mais Vendido
            </h3>
            <div className="relative rounded-lg overflow-hidden h-48 w-full bg-gray-800">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-bold text-lg">
                  {produtoMaisVendido?.NM_PRODUTO}
                </p>
                <p className="text-sm opacity-90">
                  {produtoMaisVendido?.qt_vendida} unidades vendidas
                </p>
              </div>
            </div>
          </div>

          {/* Low Stock Widget */}
          <div className="bg-white dark:bg-[var(--zephira-dark)] rounded-xl border border-gray-200 dark:border-white/5 shadow-sm p-6 flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-[var(--zephira-text)] dark:text-white">
                Estoque Baixo
              </h3>
              <button
                className="text-[var(--zephira-primary)] text-xs font-bold hover:underline"
                onClick={() => handleEstoque()}
              >
                Gerenciar
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {estoqueBaixoData.map((item) => (
                <div
                  key={item.CD_SKU}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-transparent"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded bg-gray-200 relative overflow-hidden">
                      {/* Image placeholder */}
                      <Image
                        src={
                          item.DS_IMAGEM_THUMB?.startsWith("http")
                            ? item.DS_IMAGEM_THUMB
                            : "/assets/placeholder.png"
                        }
                        alt={item.NM_PRODUTO}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[var(--zephira-text)] dark:text-white">
                        {item.NM_PRODUTO}
                      </p>
                      <p className="text-xs text-[var(--zephira-muted)]">
                        {item.CD_SKU}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500 font-bold text-sm">
                      {item.QT_ESTOQUE} Restantes
                    </p>
                    <button className="text-[10px] uppercase font-bold text-[var(--zephira-primary)] mt-0.5 hover:underline">
                      Repor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

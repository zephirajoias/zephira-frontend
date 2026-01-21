"use client";

import api from "@/lib/api";
import { createContext, useContext, useEffect, useState } from "react";

export interface PedidoRecente {
  id: string;
  produto: string;
  usuario: string;
  data: string;
  valor: string;
  status: string;
  cor: "yellow" | "blue" | "green";
}

interface ContextType {
  pedidosRecentesData: PedidoRecente[];
  carregarPedidosRecentes: () => Promise<void>;
  loading: boolean;
}

const PedidosRecentesContext = createContext<ContextType | null>(null);

export function PedidosRecentesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [pedidosRecentesData, setPedidosRecentesData] = useState<
    PedidoRecente[]
  >([]);
  const [loading, setLoading] = useState(true);

  const carregarPedidosRecentes = async () => {
    setLoading(true);
    const res = await api.get("/admin/pedidos-recentes");
    setPedidosRecentesData(res.data);
    setLoading(false);
  };

  // 🔑 efeito único, controlado
  useEffect(() => {
    carregarPedidosRecentes();
  }, []);

  return (
    <PedidosRecentesContext.Provider
      value={{ pedidosRecentesData, carregarPedidosRecentes, loading }}
    >
      {children}
    </PedidosRecentesContext.Provider>
  );
}

export function usePedidosRecentes() {
  const ctx = useContext(PedidosRecentesContext);
  if (!ctx) {
    throw new Error(
      "usePedidosRecentes must be used inside PedidosRecentesProvider"
    );
  }
  return ctx;
}

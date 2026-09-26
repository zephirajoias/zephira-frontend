"use client";

import type { DadosLoja } from "@/lib/loja";
import { createContext, useContext } from "react";

const LojaContext = createContext<DadosLoja>({ config: null, categorias: [] });

export function LojaProvider({
  value,
  children,
}: {
  value: DadosLoja;
  children: React.ReactNode;
}) {
  return <LojaContext.Provider value={value}>{children}</LojaContext.Provider>;
}

export const useLoja = () => useContext(LojaContext);

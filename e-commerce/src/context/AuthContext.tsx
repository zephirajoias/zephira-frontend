"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

interface Perfil {
  CD_USUARIO: number;
  NM_USUARIO: string;
  DS_EMAIL: string;
  NR_TELEFONE: string | null;
  TS_CRIACAO?: string;
}

interface AuthContextType {
  user: Perfil | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Perfil | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    try {
      const perfil = await api.get<Perfil>("/loja/perfil");
      setUser(perfil);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    refetch().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, senha: string) => {
    await api.post("/auth/login", { DS_EMAIL: email, DS_SENHA: senha });
    await refetch();
  };

  const register = async (nome: string, email: string, senha: string) => {
    await api.post("/auth/register", {
      NM_USUARIO: nome,
      DS_EMAIL: email,
      DS_SENHA: senha,
    });
    await refetch();
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};

export { ApiError };

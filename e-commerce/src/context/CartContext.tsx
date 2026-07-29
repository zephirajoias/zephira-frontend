"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  CD_VARIACAO: number;
  slug: string;
  nome: string;
  tamanho: string;
  preco: number;
  imagem: string;
  quantidade: number;
  estoqueDisponivel: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantidade">, quantidade?: number) => void;
  removeFromCart: (cdVariacao: number) => void;
  updateQuantity: (cdVariacao: number, qtd: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hidratado, setHidratado] = useState(false);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("zephira_cart");
    if (savedCart) setItems(JSON.parse(savedCart));
    setHidratado(true);
  }, []);

  // Salvar no localStorage sempre que mudar (depois da hidratação inicial)
  useEffect(() => {
    if (hidratado) {
      localStorage.setItem("zephira_cart", JSON.stringify(items));
    }
  }, [items, hidratado]);

  const addToCart = (
    item: Omit<CartItem, "quantidade">,
    quantidade = 1,
  ) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.CD_VARIACAO === item.CD_VARIACAO);
      if (existente) {
        return prev.map((i) =>
          i.CD_VARIACAO === item.CD_VARIACAO
            ? {
                ...i,
                quantidade: Math.min(
                  i.quantidade + quantidade,
                  i.estoqueDisponivel,
                ),
              }
            : i,
        );
      }
      return [...prev, { ...item, quantidade }];
    });
  };

  const removeFromCart = (cdVariacao: number) => {
    setItems((prev) => prev.filter((i) => i.CD_VARIACAO !== cdVariacao));
  };

  const updateQuantity = (cdVariacao: number, qtd: number) => {
    if (qtd < 1) return;
    setItems((prev) =>
      prev.map((i) =>
        i.CD_VARIACAO === cdVariacao
          ? { ...i, quantidade: Math.min(qtd, i.estoqueDisponivel) }
          : i,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.quantidade, 0);
  const totalPrice = items.reduce(
    (acc, i) => acc + i.preco * i.quantidade,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error("useCart deve ser usado dentro de um CartProvider");
  return context;
};

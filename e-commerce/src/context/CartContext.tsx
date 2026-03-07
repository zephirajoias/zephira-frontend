"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qtd: number) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("zephira_cart");
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("zephira_cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantidade: i.quantidade + 1 } : i,
        );
      }
      return [...prev, { ...product, quantidade: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, qtd: number) => {
    if (qtd < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantidade: qtd } : i)),
    );
  };

  const totalItems = items.reduce((acc, i) => acc + i.quantidade, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
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

"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CarrinhoPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems } =
    useCart();

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <div className="min-h-screen bg-bg-light flex flex-col font-display">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-text-main mb-10 text-center lg:text-left">
          Meu Carrinho <span className="text-primary">({totalItems})</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">
              shopping_bag
            </span>
            <p className="text-slate-500 font-bold mb-6">
              Seu carrinho está vazio.
            </p>
            <Link
              href="/"
              className="bg-primary text-bg-dark px-10 py-3 rounded-full font-black uppercase tracking-widest text-xs transition-all hover:bg-opacity-80"
            >
              Continuar Comprando
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* LISTA DE PRODUTOS */}
            <div className="flex-1 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 sm:gap-6"
                >
                  <div className="w-20 h-20 sm:w-28 sm:h-28 relative rounded-2xl overflow-hidden bg-slate-50 shrink-0">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-text-main uppercase tracking-wider truncate mb-1">
                      {item.nome}
                    </h3>
                    <p className="text-primary font-black text-sm sm:text-base mb-3">
                      {formatMoney(item.preco)}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-slate-200 rounded-full px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantidade - 1)
                          }
                          className="p-1 hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">
                            remove
                          </span>
                        </button>
                        <span className="w-8 text-center text-xs font-black">
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantidade + 1)
                          }
                          className="p-1 hover:text-primary"
                        >
                          <span className="material-symbols-outlined text-sm">
                            add
                          </span>
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RESUMO DO PEDIDO */}
            <aside className="w-full lg:w-96">
              <div className="bg-bg-dark text-white p-8 rounded-[2.5rem] shadow-xl sticky top-32">
                <h2 className="text-lg font-black uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                  Resumo
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm font-medium opacity-70">
                    <span>Subtotal</span>
                    <span>{formatMoney(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-green-400">
                    <span>Frete</span>
                    <span className="uppercase font-black">Grátis</span>
                  </div>
                  <div className="flex justify-between text-xl font-black pt-4 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatMoney(totalPrice)}
                    </span>
                  </div>
                </div>

                <button className="w-full bg-primary text-bg-dark py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg hover:scale-[1.02] transition-all active:scale-95">
                  Finalizar Compra
                </button>

                <p className="text-[10px] text-center mt-6 opacity-40 uppercase font-bold tracking-widest flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-xs">
                    lock
                  </span>{" "}
                  Ambiente Seguro
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

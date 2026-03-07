"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { useState } from "react";

export default function MinhaContaPage() {
  const [activeTab, setActiveTab] = useState("pedidos");

  // Dados simulados do cliente
  const cliente = {
    nome: "Ana Silva",
    email: "ana.silva@email.com",
    desde: "Janeiro de 2024",
  };

  const pedidos = [
    { id: "#10294", data: "12/02/2024", total: 450.0, status: "Entregue" },
    { id: "#09842", data: "05/01/2024", total: 189.9, status: "Em Transporte" },
  ];

  return (
    <div className="min-h-screen bg-bg-light font-display text-text-main flex flex-col">
      <Header />

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 sm:px-8 py-10 sm:py-16">
        {/* CABEÇALHO DO PERFIL */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 text-center md:text-left">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-bg-dark text-3xl font-black shadow-lg">
            {cliente.nome.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-widest">
              Olá, {cliente.nome.split(" ")[0]}!
            </h1>
            <p className="text-text-muted text-sm font-medium mt-1 uppercase tracking-wider italic opacity-70">
              Cliente Zephira desde {cliente.desde}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* MENU LATERAL (Abas) */}
          <aside className="w-full lg:w-64 shrink-0 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
            {[
              { id: "pedidos", label: "Meus Pedidos", icon: "local_mall" },
              { id: "dados", label: "Dados Pessoais", icon: "person_outline" },
              { id: "enderecos", label: "Endereços", icon: "location_on" },
              { id: "sair", label: "Sair da Conta", icon: "logout" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.id !== "sair" && setActiveTab(tab.id)}
                className={`
                  flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? "bg-bg-dark text-primary shadow-xl"
                      : "bg-white text-slate-400 hover:text-primary border border-slate-100"
                  }
                  ${tab.id === "sair" ? "mt-auto text-red-400 hover:bg-red-50" : ""}
                `}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </aside>

          {/* CONTEÚDO DINÂMICO */}
          <section className="flex-1">
            {activeTab === "pedidos" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-black uppercase tracking-widest border-b border-slate-200 pb-4">
                  Histórico de Pedidos
                </h2>

                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4"
                  >
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="size-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">
                          package_2
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-text-main">
                          {pedido.id}
                        </p>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-tighter">
                          {pedido.data}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-12">
                      <div className="text-right">
                        <p className="text-sm font-black text-text-main">
                          R$ {pedido.total.toFixed(2)}
                        </p>
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${pedido.status === "Entregue" ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"}`}
                        >
                          {pedido.status}
                        </span>
                      </div>
                      <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
                        Detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "dados" && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-xl font-black uppercase tracking-widest mb-8">
                  Informações Pessoais
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      defaultValue={cliente.nome}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                      E-mail
                    </label>
                    <input
                      type="email"
                      defaultValue={cliente.email}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary font-bold text-sm"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button className="bg-primary text-bg-dark px-10 py-3 rounded-full font-black uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-all">
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

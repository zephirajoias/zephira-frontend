"use client";

import { SettingsCard } from "@/components/dashboard/settings/SettingsCard";
import { useState } from "react";

export default function SettingsPage() {
  const [search, setSearch] = useState("");

  // Definição das seções para organização
  const settingsSections = [
    {
      group: "Operacional",
      items: [
        {
          title: "Gestão de Categorias",
          description:
            "Organize coleções de joias (Anéis, Colares) e a hierarquia do catálogo.",
          icon: "category",
          color: "teal",
          href: "/categories",
          badge: "12 Ativas",
        },
        {
          title: "Promoções e Ofertas",
          description:
            "Configure cupons de desconto, vendas sazonais e ofertas de combos.",
          icon: "percent",
          color: "blue",
          href: "/promocoes",
          badge: "2 Rodando",
        },
        {
          title: "Envio e Taxas",
          description:
            "Configure zonas de entrega, tarifas de frete e cálculos de impostos.",
          icon: "local_shipping",
          color: "amber",
          href: "/shipping",
        },
      ],
    },
    {
      group: "Sistema e Loja",
      items: [
        {
          title: "Configuração Geral",
          description:
            "Detalhes globais da loja, moeda padrão, idiomas e configurações de SEO.",
          icon: "settings_applications",
          color: "slate",
          href: "/settings_geral",
        },
        {
          title: "Integrações",
          description:
            "Conecte gateways de pagamento, analytics e redes sociais.",
          icon: "extension",
          color: "indigo",
          href: "/integracoes",
        },
        {
          title: "Segurança e Logs",
          description:
            "Histórico de acessos, chaves de API e backups do sistema.",
          icon: "admin_panel_settings",
          color: "red",
          href: "/seguranca",
        },
      ],
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-10 pb-16">
      {/* 1. Header Dinâmico */}
      <header className="flex flex-col gap-4">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span className="hover:text-[#11d4c4] cursor-pointer transition-colors">
            Dashboard
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 dark:text-white">Configurações</span>
        </nav>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Administração da Loja
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
              Gerencie os pilares da Zephira. Ajuste desde a hierarquia de
              produtos até integrações de pagamento.
            </p>
          </div>

          {/* Busca Funcional (Visual por enquanto) */}
          <div className="relative group min-w-[300px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#11d4c4] transition-colors">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar configuração..."
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-[#102220] border border-slate-200 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-[#11d4c4]/10 outline-none transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* 2. Grid de Seções */}
      <div className="flex flex-col gap-12">
        {settingsSections.map((section) => (
          <section key={section.group} className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                {section.group}
              </h2>
              <div className="h-[1px] flex-1 bg-slate-100 dark:bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items
                .filter((item) =>
                  item.title.toLowerCase().includes(search.toLowerCase()),
                )
                .map((item) => {
                  // Mapeamento de cores para os backgrounds (iconBg)
                  const bgMap: Record<string, string> = {
                    teal: "bg-teal-50 dark:bg-teal-900/20",
                    blue: "bg-blue-50 dark:bg-blue-900/20",
                    amber: "bg-yellow-50 dark:bg-yellow-900/20",
                    slate: "bg-slate-50 dark:bg-white/5",
                    indigo: "bg-indigo-50 dark:bg-indigo-900/20",
                    red: "bg-red-50 dark:bg-red-900/20",
                  };

                  // Mapeamento de cores para o texto do ícone (iconColor)
                  const colorMap: Record<string, string> = {
                    teal: "text-teal-600 dark:text-teal-400",
                    blue: "text-blue-600 dark:text-blue-400",
                    amber: "text-yellow-600 dark:text-yellow-400",
                    slate: "text-slate-600 dark:text-slate-300",
                    indigo: "text-indigo-600 dark:text-indigo-400",
                    red: "text-red-600 dark:text-red-400",
                  };

                  return (
                    <SettingsCard
                      key={item.title}
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                      primaryHref={item.href}
                      // Resolvendo o erro de props faltando:
                      iconBg={bgMap[item.color] || bgMap.slate}
                      iconColor={colorMap[item.color] || colorMap.slate}
                      primaryAction="Gerenciar" // Nome do botão que o TS estava pedindo
                      badgeText={item.badge}
                    />
                  );
                })}
            </div>
          </section>
        ))}
      </div>

      {/* 3. Footer de Suporte */}
      <footer className="mt-10 p-8 rounded-3xl bg-slate-900 dark:bg-[#11d4c4]/5 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-white text-xl font-bold">
            Precisa de ajuda avançada?
          </h3>
          <p className="text-slate-400 mt-1">
            Consulte nossa documentação técnica ou fale com o suporte.
          </p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">
            Documentação
          </button>
          <button className="px-6 py-3 rounded-xl bg-[#11d4c4] text-[#0a1615] font-black hover:brightness-110 transition-all">
            Abrir Ticket
          </button>
        </div>
        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-white/[0.03] text-[180px] pointer-events-none">
          support_agent
        </span>
      </footer>
    </div>
  );
}

"use client";

import { SettingsCard } from "@/components/dashboard/settings/SettingsCard";

export default function SettingsPage() {
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-10">
      {/* 1. Header & Breadcrumbs (Mantido igual) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-[var(--zephira-muted)]">
          <span className="hover:text-[var(--zephira-primary)] cursor-pointer">
            Dashboard
          </span>
          <span>/</span>
          <span className="text-[var(--zephira-text)] dark:text-white font-medium">
            Configurações
          </span>
        </div>

        <div>
          <h1 className="text-[var(--zephira-text)] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
            Administração da Loja
          </h1>
          <p className="text-[var(--zephira-muted)] text-base max-w-2xl mt-1">
            Hub central para gerenciar configurações globais, categorias de
            produtos, campanhas promocionais e permissões de usuários.
          </p>
        </div>
      </div>

      {/* 2. Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CATEGORIAS -> Linka para /dashboard/categories */}
        <SettingsCard
          title="Gestão de Categorias"
          description="Organize coleções de joias (Anéis, Colares) e gerencie a hierarquia do site."
          icon="category"
          iconBg="bg-teal-50 dark:bg-teal-900/20"
          iconColor="text-teal-600 dark:text-teal-400"
          // badgeText="12 Ativas"
          badgeColor="bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          primaryAction="Gerenciar"
          primaryHref="/categories"
          secondaryAction="Nova Categoria"
        />

        <SettingsCard
          title="Promoções e Ofertas"
          description="Configure cupons de desconto, vendas sazonais e ofertas de combos."
          icon="percent"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
          // badgeText="2 Rodando"
          badgeColor="bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
          primaryAction="Ver Campanhas"
          primaryHref="/promocoes"
          secondaryAction="Criar Nova"
        />

        <SettingsCard
          title="Configuração Geral"
          description="Detalhes globais da loja, moeda padrão, idiomas e configurações de SEO."
          icon="settings_applications"
          iconBg="bg-gray-50 dark:bg-white/5"
          iconColor="text-gray-600 dark:text-gray-300"
          primaryHref="/settings_geral"
          primaryAction="Editar Configs"
        />

        <SettingsCard
          title="Envio e Taxas"
          description="Configure zonas de entrega, tarifas de frete e cálculos automáticos de impostos."
          icon="local_shipping"
          iconBg="bg-yellow-50 dark:bg-yellow-900/20"
          iconColor="text-yellow-600 dark:text-yellow-400"
          // primaryHref="/shipping"
          primaryAction="Configurar"
        />

        <SettingsCard
          title="Integrações"
          description="Conecte-se com gateways de pagamento, ferramentas de análise e redes sociais."
          icon="extension"
          iconBg="bg-indigo-50 dark:bg-indigo-900/20"
          iconColor="text-indigo-600 dark:text-indigo-400"
          primaryAction="Ver Apps"
        />
      </div>
    </div>
  );
}

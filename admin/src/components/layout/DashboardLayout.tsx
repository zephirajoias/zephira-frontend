"use client";

import { ProfileModal } from "@/components/layout/profileModal"; // Ajuste o caminho se necessário
import { useUserData } from "@/hooks/useUserData";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

// Constantes de Navegação (Configuração)
const MENU_ITEMS = [
  { name: "Visão Geral", icon: "dashboard", href: "/" },
  { name: "Pedidos", icon: "shopping_bag", href: "/pedidos" },
  { name: "Inventário", icon: "inventory_2", href: "/inventario" },
  // { name: "Promoções", icon: "local_offer", href: "/dashboard/promotions" },
  { name: "Administradores", icon: "group", href: "/usuarios-admin" },
  { name: "Configurações", icon: "settings", href: "/settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  // Hook para dados do usuário (Nome, Email, Avatar)
  const { name, email } = useUserData();

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no botão "Sair" abra o modal de perfil
    try {
      document.cookie =
        "zephira-token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      localStorage.removeItem("zephira-token");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f6f8f8] dark:bg-[#102220]">
      {/* Modal de Perfil */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#102220] border-r border-gray-200 dark:border-white/5 
          transition-transform duration-300 lg:translate-x-0 lg:static flex flex-col
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 pb-2">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center size-10 rounded-lg bg-[#11d4c4]/10 text-[#11d4c4]">
              <span className="material-symbols-outlined">diamond</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#111817] dark:text-white text-lg font-bold leading-none">
                Zephira
              </h1>
              <p className="text-[#618986] text-xs font-normal mt-1">
                Admin Panel
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
                    isActive
                      ? "bg-[#11d4c4]/10 text-[#11d4c4] font-bold"
                      : "text-[#111817] dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 font-medium"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${isActive ? "fill-current" : ""}`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer */}
        <div className="mt-auto p-6 border-t border-gray-200 dark:border-white/5">
          <div
            onClick={() => setIsProfileModalOpen(true)} // Abre o modal
            className="flex items-center gap-3 w-full text-left group hover:bg-gray-50 dark:hover:bg-white/5 p-2 -ml-2 rounded-lg transition-colors cursor-pointer"
            title="Gerenciar Conta"
          >
            <div className="size-9 rounded-full bg-gray-200 relative overflow-hidden flex-shrink-0 border border-gray-200 dark:border-white/10">
              <div className="w-full h-full bg-gray-300 dark:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-sm">
                  person
                </span>
              </div>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <p className="text-sm font-medium text-[#111817] dark:text-white truncate">
                {name || "Carregando..."}
              </p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-xs text-[#618986] hover:text-red-500 transition-colors w-fit mt-0.5"
              >
                <span className="material-symbols-outlined text-[14px]">
                  logout
                </span>
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 lg:px-8 bg-white dark:bg-[#102220] border-b border-gray-200 dark:border-white/5 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-[#111817] dark:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Abrir menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-[#111817] dark:text-white text-lg font-bold hidden sm:block">
              {MENU_ITEMS.find((i) => i.href === pathname)?.name || "Painel"}
            </h2>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-white/5 rounded-lg px-3 py-2 w-64">
              <span className="material-symbols-outlined text-[#618986] text-[20px]">
                search
              </span>
              <input
                className="bg-transparent border-none text-sm text-[#111817] dark:text-white placeholder-gray-500 focus:ring-0 w-full ml-2 p-0 h-5 focus:outline-none"
                placeholder="Buscar..."
                type="text"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
              <span className="material-symbols-outlined text-[#111817] dark:text-white">
                notifications
              </span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#102220]"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth bg-[#f6f8f8] dark:bg-[#102220]">
          <div className="min-h-full">{children}</div>
        </main>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

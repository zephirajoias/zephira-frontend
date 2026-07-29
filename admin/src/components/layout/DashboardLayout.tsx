"use client";

import { ProfileModal } from "@/components/layout/profileModal";
import { useUserData } from "@/hooks/useUserData";
import { cn } from "@/lib/utils"; // Utilitário comum para concatenar classes (opcional)
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MENU_ITEMS = [
  { name: "Visão Geral", icon: "dashboard", href: "/" },
  { name: "Pedidos", icon: "shopping_bag", href: "/pedidos" },
  { name: "Inventário", icon: "inventory_2", href: "/inventario" },
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
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { name, email } = useUserData();

  console.log(name);

  // Efeito para detectar scroll e mudar estilo do header
  useEffect(() => {
    const handleScroll = (e: any) => {
      setIsScrolled(e.target.scrollTop > 10);
    };
    const mainArea = document.getElementById("main-content");
    mainArea?.addEventListener("scroll", handleScroll);
    return () => mainArea?.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    document.cookie =
      "zephira_token_admin=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    localStorage.removeItem("zephira_token_admin");
    router.push("/login");
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc] dark:bg-[#0a1615] text-slate-900 dark:text-slate-100">
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* --- SIDEBAR --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#102220] border-r border-slate-200 dark:border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col",
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3 px-2">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-[#11d4c4] to-[#0eb0a3] text-white shadow-lg shadow-[#11d4c4]/20">
              <span className="material-symbols-outlined text-2xl">
                diamond
              </span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">
                Zephira
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#618986] opacity-80">
                Admin Engine
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#11d4c4]/10 text-[#11d4c4]"
                    : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-[#11d4c4] rounded-r-full" />
                )}
                <span
                  className={cn(
                    "material-symbols-outlined transition-transform group-hover:scale-110",
                    isActive && "fill-current",
                  )}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Profile Footer */}
        <div className="p-4 mt-auto border-t border-slate-100 dark:border-white/5">
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer group"
          >
            <div className="size-10 rounded-full bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden flex-shrink-0">
              <span className="material-symbols-outlined text-slate-500">
                person
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-sm font-bold truncate">{name || "Usuário"}</p>
              <button
                onClick={handleLogout}
                className="text-[11px] flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors font-medium"
              >
                <span className="material-symbols-outlined text-[14px]">
                  logout
                </span>
                Sair da conta
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col relative min-w-0 h-full">
        {/* Header */}
        <header
          className={cn(
            "h-16 flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300",
            isScrolled
              ? "bg-white/80 dark:bg-[#102220]/80 backdrop-blur-md shadow-sm"
              : "bg-transparent",
          )}
        >
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Página
              </p>
              <h2 className="text-sm font-bold">
                {MENU_ITEMS.find((i) => i.href === pathname)?.name ||
                  "Painel Geral"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Bar - Expandível */}
            <div className="relative hidden md:flex items-center group">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-xl group-focus-within:text-[#11d4c4] transition-colors">
                search
              </span>
              <input
                type="text"
                placeholder="Pesquisar..."
                className="bg-slate-200/50 dark:bg-white/5 border-none rounded-xl pl-10 pr-4 py-2 text-sm w-48 lg:w-64 focus:w-80 transition-all focus:ring-2 focus:ring-[#11d4c4]/20 outline-none"
              />
            </div>

            {/* Notificações */}
            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:rotate-12 transition-transform">
                notifications
              </span>
              <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#102220]"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth"
        >
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}

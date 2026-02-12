"use client";

import { useUserData } from "@/hooks/useUserData";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [isLoading, setIsLoading] = useState(false);

  // Pega dados do Hook Global
  const { name: globalName, email: globalEmail } = useUserData();

  // Profile States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Security States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sincroniza estado local com dados do hook quando o modal abre
  useEffect(() => {
    if (isOpen) {
      setName(globalName || "");
      setEmail(globalEmail || "");
      // Limpa campos de senha
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setActiveTab("profile");
    }
  }, [isOpen, globalName, globalEmail]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.put("/admin/me/profile", {
        NM_USUARIO: name,
        DS_EMAIL: email,
      });
      toast.success("Perfil atualizado com sucesso!");
      // Aqui você idealmente atualizaria o contexto do usuário para refletir a mudança na UI
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("As novas senhas não conferem.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      await api.put("/admin/me/password", {
        email,
        currentPassword,
        newPassword,
      });
      toast.success("Senha alterada com sucesso!");

      // Limpar campos
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Erro ao alterar senha. Verifique a senha atual.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0f1715]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-[#102220] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--zephira-primary)]/10 rounded-lg">
              <span className="material-symbols-outlined text-[var(--zephira-primary)]">
                manage_accounts
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Minha Conta
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-white/5">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-3 text-sm font-bold text-center transition-colors border-b-2 ${
              activeTab === "profile"
                ? "text-[var(--zephira-primary)] border-[var(--zephira-primary)] bg-[var(--zephira-primary)]/5"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`flex-1 py-3 text-sm font-bold text-center transition-colors border-b-2 ${
              activeTab === "security"
                ? "text-[var(--zephira-primary)] border-[var(--zephira-primary)] bg-[var(--zephira-primary)]/5"
                : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            Segurança
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "profile" ? (
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Nome
                </label>
                <div className="relative">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                    badge
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  E-mail
                </label>
                <div className="relative">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                    mail
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <span className="size-4 border-2 border-[#0f1715]/30 border-t-[#0f1715] rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">
                    save
                  </span>
                )}
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Senha Atual
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
                    placeholder="••••••••"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                    lock_open
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                    key
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
                    placeholder="Repita a senha"
                  />
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                    check_circle
                  </span>
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? (
                  <span className="size-4 border-2 border-[#0f1715]/30 border-t-[#0f1715] rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">
                    lock_reset
                  </span>
                )}
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

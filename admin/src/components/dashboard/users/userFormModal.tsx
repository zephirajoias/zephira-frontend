"use client";

import { Modal } from "@/components/ui/Modal";
import { useUserData } from "@/hooks/useUserData";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any | null; // Se vier preenchido, é Edição. Se null, é Criação.
  onSuccess: () => void;
}

export function UserFormModal({
  isOpen,
  onClose,
  user,
  onSuccess,
}: UserFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!user;

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Senha (opcional na edição)
  const [role, setRole] = useState("Visualizador");

  const { userId } = useUserData();

  // Perfis disponíveis (Ajuste conforme seu banco)
  const roles = [
    "Super Admin",
    "Gerente de Estoque",
    "Editor",
    "Visualizador",
    "Suporte",
  ];

  // Preenche os dados se for edição
  useEffect(() => {
    if (isOpen) {
      if (user) {
        setName(user.NM_USUARIO || "");
        setEmail(user.DS_EMAIL || "");
        setRole(user.TP_PERFIL || "Visualizador");
        setPassword(""); // Reseta a senha na edição
      } else {
        // Reset para criação
        setName("");
        setEmail("");
        setRole("Visualizador");
        setPassword("");
      }
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica de criação
    if (!isEditing && !password) {
      toast.error("Senha é obrigatória para novos usuários.");
      return;
    }

    setIsLoading(true);

    try {
      // Só envia senha se foi digitada (criação ou alteração na edição)
      if (isEditing) {
        const payload: any = {
          NM_USUARIO: name,
        };
        if (password) payload.DS_SENHA = password;

        await api.put(`/admin/${user.CD_USUARIO}`, payload);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        await api.post("/admin", {
          NM_USUARIO: name,
          DS_EMAIL: email,
          DS_SENHA: password,
        });
        toast.success("Novo admin criado com sucesso!");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar usuário.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} panelClassName="max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--zephira-primary)]/10 rounded-lg">
              <span className="material-symbols-outlined text-[var(--zephira-primary)]">
                {isEditing ? "manage_accounts" : "person_add"}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                {isEditing ? "Editar Usuário" : "Novo Admin"}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {isEditing
                  ? "Atualize os dados de acesso"
                  : "Adicione um membro à equipe"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            {/* Nome */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Nome Completo
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
                  placeholder="Ex: Sarah Jenkins"
                  required
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                  badge
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                E-mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
                  placeholder="sarah@luxegem.com"
                  required
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                  mail
                </span>
              </div>
            </div>

            {/* Perfil */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Função / Perfil
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 appearance-none rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                  shield_person
                </span>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            {/* Senha */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                {isEditing ? "Alterar Senha (Opcional)" : "Senha Provisória"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-10 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all placeholder:text-gray-400"
                  placeholder={
                    isEditing
                      ? "Deixe em branco para manter a atual"
                      : "••••••••"
                  }
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">
                  lock
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all flex items-center gap-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="size-4 border-2 border-[#0f1715]/30 border-t-[#0f1715] rounded-full animate-spin"></span>
                  <span>Salvando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>
                  <span>{isEditing ? "Salvar" : "Criar"}</span>
                </>
              )}
            </button>
          </div>
        </form>
    </Modal>
  );
}

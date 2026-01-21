"use client";

import { DeleteUserModal } from "@/components/dashboard/users/deleteUserModal";
import { UserFormModal } from "@/components/dashboard/users/userFormModal";
import api from "@/lib/api";
import { useEffect, useState } from "react";

interface usersAdmin {
  CD_USUARIO: number;
  NM_USUARIO: string;
  DS_EMAIL: string;
  TP_PERFIL: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [userAdmin, setUserAdmin] = useState<usersAdmin[]>([]);

  // Estados para os Modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<usersAdmin | null>(null); // Se null, é criação
  const [deletingUser, setDeletingUser] = useState<usersAdmin | null>(null);

  const handleDados = async () => {
    try {
      const response = await api.get("/admin/listaAdmin");
      setUserAdmin(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleDados();
  }, []);

  // Handlers
  const handleOpenNew = () => {
    setEditingUser(null); // Garante que não tem usuário selecionado
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: usersAdmin) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (user: usersAdmin) => {
    setDeletingUser(user);
  };

  // Helper de Cores para Perfil
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800";
      case "Gerente de Estoque":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "Editor":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-6 pb-10">
      {/* --- MODAIS --- */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        user={editingUser}
        onSuccess={handleDados}
      />

      <DeleteUserModal
        isOpen={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        user={deletingUser}
        onSuccess={handleDados}
      />

      {/* 1. Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-black tracking-tight text-[var(--zephira-text)] dark:text-white">
            Usuários Admin
          </h2>
          <p className="text-[var(--zephira-muted)] text-base">
            Gerencie permissões de acesso e membros da equipe.
          </p>
        </div>
        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-[var(--zephira-primary)] hover:brightness-105 text-[#102220] font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          <span>Novo Admin</span>
        </button>
      </div>

      {/* 2. Filters */}
      <div className="bg-white dark:bg-[var(--zephira-dark)] p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Search */}
          <div className="w-full md:flex-1">
            <label className="block text-xs font-bold text-[var(--zephira-text)] dark:text-white uppercase tracking-wider mb-1.5 ml-1">
              Buscar Usuários
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0b1816] border-transparent focus:bg-white dark:focus:bg-black focus:border-[var(--zephira-primary)] focus:ring-0 rounded-lg text-sm transition-all text-[var(--zephira-text)] dark:text-white placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[var(--zephira-muted)] text-[20px]">
                search
              </span>
            </div>
          </div>

          {/* Role Filter (Visual Only - implemente a lógica se necessário) */}
          <div className="w-full md:w-64">
            <label className="block text-xs font-bold text-[var(--zephira-text)] dark:text-white uppercase tracking-wider mb-1.5 ml-1">
              Filtrar por Função
            </label>
            <div className="relative">
              <select className="w-full pl-10 pr-8 py-2.5 bg-gray-50 dark:bg-[#0b1816] border-transparent focus:bg-white dark:focus:bg-black focus:border-[var(--zephira-primary)] focus:ring-0 rounded-lg text-sm text-[var(--zephira-text)] dark:text-white appearance-none cursor-pointer transition-all">
                <option value="">Todas as Funções</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Gerente de Estoque">Gerente</option>
              </select>
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[var(--zephira-muted)] text-[20px]">
                filter_list
              </span>
              <span className="material-symbols-outlined absolute right-3 top-2.5 text-[var(--zephira-muted)] text-[20px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Table */}
      <div className="bg-white dark:bg-[var(--zephira-dark)] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap text-left">
            <thead className="bg-gray-50 dark:bg-[#0b1816] border-b border-gray-200 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[var(--zephira-muted)] uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--zephira-muted)] uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[var(--zephira-muted)] uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {userAdmin
                .filter(
                  (user) =>
                    user.NM_USUARIO.toLowerCase().includes(
                      searchTerm.toLowerCase(),
                    ) ||
                    user.DS_EMAIL.toLowerCase().includes(
                      searchTerm.toLowerCase(),
                    ),
                )
                .map((user) => (
                  <tr
                    key={user.CD_USUARIO}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                  >
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-full bg-[var(--zephira-primary)]/10 text-[var(--zephira-primary)] flex items-center justify-center font-bold text-sm">
                          {user.NM_USUARIO.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--zephira-text)] dark:text-white">
                            {user.NM_USUARIO}
                          </p>
                          <p className="text-xs text-[var(--zephira-muted)]">
                            {user.DS_EMAIL}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${getRoleBadge(user.TP_PERFIL)}`}
                      >
                        {user.TP_PERFIL}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 text-[var(--zephira-muted)] hover:text-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          onClick={() => handleOpenDelete(user)}
                          className="p-2 text-[var(--zephira-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Simple Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#102220] flex items-center justify-between">
          <p className="text-xs text-[var(--zephira-muted)]">
            Total: {userAdmin.length}
          </p>
        </div>
      </div>
    </div>
  );
}

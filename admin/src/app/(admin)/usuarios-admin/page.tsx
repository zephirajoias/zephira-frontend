"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

// Modais
import { DeleteUserModal } from "@/components/dashboard/users/deleteUserModal";
import { UserFormModal } from "@/components/dashboard/users/userFormModal";

interface UserAdmin {
  CD_USUARIO: number;
  NM_USUARIO: string;
  DS_EMAIL: string;
  TP_PERFIL: string;
}

// Configuração de Estilo por Função
const ROLE_CONFIG: Record<string, { bg: string; text: string; icon: string }> =
  {
    "Super Admin": {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-700 dark:text-purple-400",
      icon: "verified_user",
    },
    "Gerente de Estoque": {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-700 dark:text-blue-400",
      icon: "inventory_2",
    },
    Editor: {
      bg: "bg-amber-100 dark:bg-amber-900/30",
      text: "text-amber-700 dark:text-amber-400",
      icon: "edit_note",
    },
    default: {
      bg: "bg-slate-100 dark:bg-slate-800",
      text: "text-slate-600 dark:text-slate-400",
      icon: "person",
    },
  };

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todas");
  const [users, setUsers] = useState<UserAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estados dos Modais
  const [modals, setModals] = useState({
    form: false,
    editUser: null as UserAdmin | null,
    deleteUser: null as UserAdmin | null,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/admin/listaAdmin");
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar admins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtro inteligente
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.NM_USUARIO.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.DS_EMAIL.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole =
        roleFilter === "Todas" || user.TP_PERFIL === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Estatísticas para os Cards
  const stats = useMemo(
    () => ({
      total: users.length,
      superAdmins: users.filter((u) => u.TP_PERFIL === "Super Admin").length,
      gerentes: users.filter((u) => u.TP_PERFIL === "Gerente de Estoque")
        .length,
    }),
    [users],
  );

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col gap-8 pb-10">
      {/* Modais */}
      <UserFormModal
        isOpen={modals.form || !!modals.editUser}
        onClose={() => setModals({ ...modals, form: false, editUser: null })}
        user={modals.editUser}
        onSuccess={fetchUsers}
      />
      <DeleteUserModal
        isOpen={!!modals.deleteUser}
        onClose={() => setModals({ ...modals, deleteUser: null })}
        user={modals.deleteUser}
        onSuccess={fetchUsers}
      />

      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Equipe
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Gerencie acessos e permissões administrativas.
          </p>
        </div>
        <button
          onClick={() => setModals({ ...modals, form: true })}
          className="flex items-center justify-center gap-2 h-12 px-6 rounded-2xl bg-[#11d4c4] text-[#0a1615] font-black shadow-lg shadow-[#11d4c4]/20 hover:scale-[1.02] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">person_add</span>
          Novo Administrador
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total de Membros"
          value={stats.total}
          icon="group"
          trend="Equipe Ativa"
          trendLabel=""
        />
        <StatCard
          title="Super Admins"
          value={stats.superAdmins}
          icon="verified_user"
          trend="Acesso Total"
          trendLabel=""
        />
        <StatCard
          title="Gerentes"
          value={stats.gerentes}
          icon="manage_accounts"
          trend="Operacional"
          trendLabel=""
        />
      </div>

      {/* Filtros */}
      <section className="flex flex-col lg:flex-row gap-4 p-4 bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-none focus:ring-2 focus:ring-[#11d4c4]/20 outline-none text-sm font-medium transition-all"
            placeholder="Pesquisar por nome ou email do administrador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-12 px-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-none text-sm font-bold focus:ring-2 focus:ring-[#11d4c4]/20 outline-none cursor-pointer"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="Todas">Todas as Funções</option>
          <option value="Super Admin">Super Admin</option>
          <option value="Gerente de Estoque">Gerente de Estoque</option>
          <option value="Editor">Editor</option>
        </select>
      </section>

      {/* Tabela */}
      <div className="bg-white dark:bg-[#102220] rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/2 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-white/5">
                <th className="p-5 pl-8">Usuário</th>
                <th className="p-5">Função</th>
                <th className="p-5 text-right pr-8">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-20 text-center animate-pulse text-slate-400 font-bold"
                  >
                    Sincronizando equipe...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-20 text-center text-slate-400">
                    Nenhum administrador encontrado.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const config =
                    ROLE_CONFIG[user.TP_PERFIL] || ROLE_CONFIG.default;
                  return (
                    <tr
                      key={user.CD_USUARIO}
                      className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                    >
                      <td className="p-5 pl-8">
                        <div className="flex items-center gap-4">
                          {/* Avatar com Gradiente */}
                          <div className="size-11 rounded-full bg-gradient-to-tr from-[#11d4c4] to-teal-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-[#11d4c4]/20 border-2 border-white dark:border-slate-800">
                            {user.NM_USUARIO.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white leading-tight">
                              {user.NM_USUARIO}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {user.DS_EMAIL}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider",
                            config.bg,
                            config.text,
                          )}
                        >
                          <span className="material-symbols-outlined text-base">
                            {config.icon}
                          </span>
                          {user.TP_PERFIL}
                        </div>
                      </td>
                      <td className="p-5 pr-8 text-right">
                        <div className="flex justify-end gap-2 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300">
                          <button
                            onClick={() =>
                              setModals({ ...modals, editUser: user })
                            }
                            className="p-2 hover:bg-[#11d4c4]/10 text-[#11d4c4] rounded-xl transition-all"
                            title="Editar permissões"
                          >
                            <span className="material-symbols-outlined">
                              edit_square
                            </span>
                          </button>
                          <button
                            onClick={() =>
                              setModals({ ...modals, deleteUser: user })
                            }
                            className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                            title="Remover acesso"
                          >
                            <span className="material-symbols-outlined">
                              person_remove
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <footer className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50/20">
          <p className="text-xs font-bold text-slate-400 tracking-wide uppercase">
            Total de {filteredUsers.length} administradores listados
          </p>
        </footer>
      </div>
    </div>
  );
}

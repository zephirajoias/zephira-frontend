"use client";

import { EditPaginaModal, type Pagina } from "@/components/dashboard/paginas/EditPaginaModal";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "@/lib/toast";

const ICONES: Record<string, string> = {
  sobre: "storefront",
  "como-comprar": "shopping_bag",
  trocas: "sync_alt",
  garantia: "verified_user",
  faq: "quiz",
  contato: "chat",
};

export default function PaginasInstitucionaisPage() {
  const [paginas, setPaginas] = useState<Pagina[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState<Pagina | null>(null);

  const buscar = () => {
    setCarregando(true);
    api
      .get("admin/paginas-institucionais")
      .then((res) => setPaginas(res.data))
      .catch(() =>
        toast.error(
          "Não consegui carregar as páginas. Se isso for novo, pode ser que a atualização ainda não chegou — tente de novo em instantes.",
        ),
      )
      .finally(() => setCarregando(false));
  };

  useEffect(buscar, []);

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-16">
      <EditPaginaModal
        isOpen={!!editando}
        pagina={editando}
        onClose={() => setEditando(null)}
        onSuccess={buscar}
      />

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Páginas Institucionais
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          O texto do rodapé da loja — Sobre, Como Comprar, Trocas, Garantia,
          Perguntas Frequentes e Fale Conosco. Mudar aqui atualiza a loja em
          poucos minutos, sem precisar de um desenvolvedor.
        </p>
      </header>

      {carregando ? (
        <p className="text-sm text-gray-400">Carregando...</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {paginas.map((pagina) => (
            <button
              key={pagina.DS_SLUG}
              onClick={() => setEditando(pagina)}
              className="text-left rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-5 hover:border-[var(--zephira-primary)] transition-colors flex items-start gap-4"
            >
              <div className="p-2.5 bg-[var(--zephira-primary)]/10 rounded-xl border border-[var(--zephira-primary)]/20 shrink-0">
                <span className="material-symbols-outlined text-[var(--zephira-primary)]">
                  {ICONES[pagina.DS_SLUG] ?? "description"}
                </span>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">
                  {pagina.NM_TITULO}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {pagina.TS_ATUALIZACAO
                    ? `Atualizado em ${new Date(pagina.TS_ATUALIZACAO).toLocaleDateString("pt-BR")}`
                    : "Ainda não editado"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import { renderizarConteudo } from "@/lib/conteudo";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export interface Pagina {
  DS_SLUG: string;
  NM_TITULO: string;
  DS_CONTEUDO: string;
  TS_ATUALIZACAO: string | null;
}

interface EditPaginaModalProps {
  isOpen: boolean;
  onClose: () => void;
  pagina: Pagina | null;
  onSuccess: () => void;
}

interface Pergunta {
  p: string;
  r: string;
}

const LEGENDA = [
  "Linha em branco separa parágrafos.",
  "## Um título entre parágrafos",
  "- Um item de lista (uma linha por item)",
  "**negrito** e [texto](/link) funcionam em qualquer lugar.",
].join("\n");

export function EditPaginaModal({
  isOpen,
  onClose,
  pagina,
  onSuccess,
}: EditPaginaModalProps) {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [salvando, setSalvando] = useState(false);

  const ehFaq = pagina?.DS_SLUG === "faq";

  useEffect(() => {
    if (!pagina) return;
    setTitulo(pagina.NM_TITULO);
    if (pagina.DS_SLUG === "faq") {
      try {
        const lista = JSON.parse(pagina.DS_CONTEUDO);
        setPerguntas(Array.isArray(lista) && lista.length > 0 ? lista : [{ p: "", r: "" }]);
      } catch {
        setPerguntas([{ p: "", r: "" }]);
      }
    } else {
      setConteudo(pagina.DS_CONTEUDO);
    }
  }, [pagina]);

  if (!pagina) return null;

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    const conteudoFinal = ehFaq
      ? JSON.stringify(perguntas.filter((p) => p.p.trim() && p.r.trim()))
      : conteudo;

    if (ehFaq && JSON.parse(conteudoFinal).length === 0) {
      toast.error("Adicione pelo menos uma pergunta com resposta.");
      return;
    }

    setSalvando(true);
    try {
      await api.put(`admin/paginas-institucionais/${pagina.DS_SLUG}`, {
        NM_TITULO: titulo,
        DS_CONTEUDO: conteudoFinal,
      });
      toast.success("Página atualizada! A loja mostra a mudança em instantes.");
      onSuccess();
      onClose();
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.message ?? error?.message ?? "Erro desconhecido.";
      toast.error(
        `Não consegui salvar: ${Array.isArray(mensagem) ? mensagem.join(", ") : mensagem}`,
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} panelClassName="max-w-3xl max-h-[90vh]">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#0c1a18]/50">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Editar: {pagina.NM_TITULO}
        </h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <form
        id="edit-pagina-form"
        onSubmit={handleSalvar}
        className="overflow-y-auto flex-1 p-6 space-y-5"
      >
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
            Título da página
          </label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="w-full h-11 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
          />
        </div>

        {ehFaq ? (
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
              Perguntas e respostas
            </label>
            {perguntas.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 dark:border-white/10 p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-400">Pergunta {i + 1}</span>
                  {perguntas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPerguntas(perguntas.filter((_, j) => j !== i))}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Remover
                    </button>
                  )}
                </div>
                <input
                  value={item.p}
                  onChange={(e) =>
                    setPerguntas(
                      perguntas.map((p, j) => (j === i ? { ...p, p: e.target.value } : p)),
                    )
                  }
                  placeholder="Pergunta"
                  className="w-full h-10 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-3 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
                />
                <textarea
                  value={item.r}
                  onChange={(e) =>
                    setPerguntas(
                      perguntas.map((p, j) => (j === i ? { ...p, r: e.target.value } : p)),
                    )
                  }
                  placeholder="Resposta"
                  rows={2}
                  className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] resize-none"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() => setPerguntas([...perguntas, { p: "", r: "" }])}
              className="text-sm font-bold text-[var(--zephira-primary)] hover:underline"
            >
              + Adicionar pergunta
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                    Texto
                  </label>
                </div>
                <textarea
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  rows={16}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-4 text-sm font-mono text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] resize-none"
                />
                <pre className="text-[11px] text-gray-400 whitespace-pre-wrap leading-relaxed">
                  {LEGENDA}
                </pre>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-widest text-gray-400">
                  Como fica na loja
                </label>
                <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 text-sm text-gray-700 dark:text-gray-300 h-[calc(100%-1.75rem)] overflow-y-auto">
                  {conteudo.trim() ? (
                    renderizarConteudo(conteudo)
                  ) : (
                    <p className="text-gray-400 italic">Escreva algo pra ver a prévia.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </form>

      <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="edit-pagina-form"
          disabled={salvando}
          className="px-6 py-2.5 rounded-xl bg-[var(--zephira-primary)] text-[#0f1715] font-bold text-sm shadow-lg disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </Modal>
  );
}

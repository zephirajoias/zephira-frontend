"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface NewPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TipoPromocao {
  unnest: string; // A chave que vem do banco
}

export function NewPromotionModal({
  isOpen,
  onClose,
  onSuccess,
}: NewPromotionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  // States
  const [nmPromocao, setNmPromocao] = useState("");
  const [dsCodigo, setDsCodigo] = useState("");
  const [tpPromocao, setTpPromocao] = useState(""); // Começa vazio, preenche com o primeiro da lista
  const [vlDesconto, setVlDesconto] = useState("");
  const [vlPedidoMinimo, setVlPedidoMinimo] = useState("");
  const [dtInicio, setDtInicio] = useState("");
  const [dtFim, setDtFim] = useState("");
  const [qtLimiteUso, setQtLimiteUso] = useState("");

  // Lista de Tipos vindos da API
  const [tipos, setTipos] = useState<TipoPromocao[]>([]);

  // Carregar Tipos
  useEffect(() => {
    if (isOpen) {
      const fetchTipos = async () => {
        try {
          const response = await api.get("/admin/promocoes/tipos");
          setTipos(response.data);
          // Seleciona o primeiro por padrão se houver
          if (response.data.length > 0) {
            setTpPromocao(response.data[0].unnest);
          }
        } catch (error) {
          console.error("Erro ao buscar tipos de promoções", error);
          toast.error("Erro ao carregar tipos.");
        }
      };
      fetchTipos();
    }
  }, [isOpen]);

  // Helper para Labels Bonitos
  const formatTipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
      PERCENTUAL: "Porcentagem (%)",
      VALOR_FIXO: "Valor Fixo (R$)",
      FRETE_GRATIS: "Frete Grátis",
      COMPRE_X_LEVE_Y: "Leve + Pague -",
    };
    return map[tipo] || tipo; // Fallback para o valor original
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        NM_PROMOCAO: nmPromocao,
        DS_CODIGO: dsCodigo.toUpperCase(),
        TP_PROMOCAO: tpPromocao, // Envia exatamente como veio da API (ex: PERCENTUAL)
        VL_DESCONTO: Number(vlDesconto),
        VL_PEDIDO_MINIMO: Number(vlPedidoMinimo),
        DT_INICIO: new Date(dtInicio),
        DT_FIM: new Date(dtFim),
        QT_LIMITE_USO: Number(qtLimiteUso),
        SN_ATIVO: 1,
      };

      await api.post("/admin/promocoes", payload);

      toast.success("Promoção criada com sucesso!");
      onSuccess();
      onClose();

      // Reset
      setNmPromocao("");
      setDsCodigo("");
      setVlDesconto("");
      setVlPedidoMinimo("");
      setQtLimiteUso("");
      setDtInicio("");
      setDtFim("");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar promoção.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
    >
      <div
        className="absolute inset-0 bg-[#0f1715]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#102220] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--zephira-primary)]/10 rounded-lg">
              <span className="material-symbols-outlined text-[var(--zephira-primary)]">
                local_offer
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Nova Promoção
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Cadastre um cupom ou oferta
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
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 overflow-y-auto max-h-[70vh]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Nome da Promoção
              </label>
              <input
                type="text"
                value={nmPromocao}
                onChange={(e) => setNmPromocao(e.target.value)}
                placeholder="Ex: Oferta de Verão"
                className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all"
                required
              />
            </div>
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Código (Cupom)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={dsCodigo}
                  onChange={(e) => setDsCodigo(e.target.value.toUpperCase())}
                  placeholder="VERAO20"
                  className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all font-mono uppercase"
                  required
                />
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-400">
                  confirmation_number
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Tipo de Promoção
              </label>
              <div className="relative">
                <select
                  value={tpPromocao}
                  onChange={(e) => setTpPromocao(e.target.value)}
                  className="w-full h-11 appearance-none rounded-lg border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] cursor-pointer"
                >
                  {/* Se estiver carregando ou vazio */}
                  {tipos.length === 0 && (
                    <option value="">Carregando...</option>
                  )}

                  {tipos.map((t, index) => (
                    <option key={index} value={t.unnest}>
                      {formatTipoLabel(t.unnest)}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-400 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Valor do Desconto
              </label>
              <input
                type="number"
                value={vlDesconto}
                onChange={(e) => setVlDesconto(e.target.value)}
                placeholder={tpPromocao === "PERCENTUAL" ? "20" : "50.00"}
                disabled={tpPromocao === "FRETE_GRATIS"}
                className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                required={tpPromocao !== "FRETE_GRATIS"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Pedido Mínimo (R$)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm font-bold">
                  R$
                </span>
                <input
                  type="number"
                  value={vlPedidoMinimo}
                  onChange={(e) => setVlPedidoMinimo(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 pl-9 pr-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Limite de Uso (Qtd)
              </label>
              <input
                type="number"
                value={qtLimiteUso}
                onChange={(e) => setQtLimiteUso(e.target.value)}
                placeholder="Ex: 100"
                className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Data Início
              </label>
              <input
                type="date"
                value={dtInicio}
                onChange={(e) => setDtInicio(e.target.value)}
                className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
                required
              />
            </div>
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                Data Fim
              </label>
              <input
                type="date"
                value={dtFim}
                onChange={(e) => setDtFim(e.target.value)}
                className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
                required
              />
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
              className="px-6 py-2.5 rounded-lg bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold shadow-lg shadow-[var(--zephira-primary)]/20 transition-all flex items-center gap-2"
            >
              {isLoading ? (
                "Criando..."
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    check
                  </span>{" "}
                  Criar Promoção
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import api from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface EditPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: any;
  onSuccess: () => void;
}

export function EditPromotionModal({
  isOpen,
  onClose,
  promotion,
  onSuccess,
}: EditPromotionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("percentage");
  const [value, setValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    console.log("Promotion to edit:", promotion);
    if (promotion) {
      setName(promotion.NM_PROMOCAO || "");
      setCode(promotion.DS_CODIGO || "");
      setType(promotion.TP_DESCONTO || "percentage");
      setValue(promotion.VL_DESCONTO || "");
      setStartDate(
        promotion.DT_INICIO ? promotion.DT_INICIO.split("T")[0] : "",
      );
      setEndDate(promotion.DT_FIM ? promotion.DT_FIM.split("T")[0] : "");
      setUsageLimit(promotion.QT_LIMITE_USO || "");
      setIsActive(promotion.SN_ATIVO === 1);
    }
  }, [promotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.put(`/admin/promocoes/${promotion.CD_PROMOCAO}`, {
        NM_PROMOCAO: name,
        VL_DESCONTO: Number(value),
        SN_ATIVO: isActive ? "1" : "0",
      });

      toast.success("Promoção atualizada!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar.");
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
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--zephira-primary)]/10 rounded-lg">
              <span className="material-symbols-outlined text-[var(--zephira-primary)]">
                edit_square
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Editar Promoção
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 overflow-y-auto max-h-[70vh]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                Nome
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
              />
            </div>
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                Código (Leitura)
              </label>
              <input
                value={code}
                readOnly
                className="w-full h-11 rounded-lg border border-dashed border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5 px-4 text-gray-500 outline-none cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... Campos de Tipo e Valor (Iguais ao modal de criar) ... */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase">
                Valor
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-11 rounded-lg border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 px-4 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
              />
            </div>
            <div className="group flex items-end h-full pb-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--zephira-primary)]"></div>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-white">
                  Promoção Ativa
                </span>
              </label>
            </div>
          </div>

          {/* ... Datas e Limites (Iguais ao modal de criar) ... */}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg border border-gray-200 dark:border-white/10 font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-lg bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold shadow-lg flex items-center gap-2"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

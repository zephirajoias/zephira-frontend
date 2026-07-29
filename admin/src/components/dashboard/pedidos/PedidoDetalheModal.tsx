"use client";

import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface PedidoDetalheModalProps {
  cdPedido: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface ItemPedido {
  CD_ITEM: number;
  NM_PRODUTO_SNAPSHOT: string;
  CD_SKU_SNAPSHOT: string | null;
  QT_ITEM: number;
  VL_UNITARIO: number;
  VL_TOTAL_ITEM: number;
  VARIACOES_PRODUTO: {
    DS_TAMANHO: string;
    PRODUTOS: { NM_PRODUTO: string; DS_SLUG: string };
  } | null;
}

interface PedidoDetalhe {
  CD_PEDIDO: number;
  VL_SUBTOTAL: number;
  VL_DESCONTO: number;
  VL_FRETE: number;
  VL_TOTAL: number;
  TP_STATUS: string;
  TP_METODO_PAGAMENTO: string | null;
  CD_RASTREIO: string | null;
  DS_SNAPSHOT_ENDERECO: {
    NR_CEP: string;
    NM_LOGRADOURO: string;
    NR_NUMERO: string;
    DS_COMPLEMENTO: string;
    NM_BAIRRO: string;
    NM_CIDADE: string;
    DS_UF: string;
  };
  TS_CRIACAO: string;
  USUARIO: { NM_USUARIO: string; DS_EMAIL: string; NR_TELEFONE: string | null };
  ITENS_PEDIDO: ItemPedido[];
}

const STATUS_OPTIONS = [
  "PENDENTE",
  "PAGO",
  "PROCESSANDO",
  "ENVIADO",
  "ENTREGUE",
  "CANCELADO",
  "DEVOLVIDO",
];

const formatMoney = (v: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(v || 0));

export function PedidoDetalheModal({
  cdPedido,
  onClose,
  onSuccess,
}: PedidoDetalheModalProps) {
  const [pedido, setPedido] = useState<PedidoDetalhe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("PENDENTE");
  const [rastreio, setRastreio] = useState("");

  useEffect(() => {
    if (!cdPedido) return;

    setIsLoading(true);
    setPedido(null);

    api
      .get(`/admin/pedidos/${cdPedido}`)
      .then((res) => {
        setPedido(res.data);
        setStatus(res.data.TP_STATUS);
        setRastreio(res.data.CD_RASTREIO || "");
      })
      .catch(() => toast.error("Erro ao carregar pedido."))
      .finally(() => setIsLoading(false));
  }, [cdPedido]);

  const handleSalvarStatus = async () => {
    if (!cdPedido) return;

    setIsSaving(true);
    try {
      await api.put(`/admin/pedidos/${cdPedido}/status`, {
        TP_STATUS: status,
        CD_RASTREIO: rastreio || undefined,
      });
      toast.success("Status do pedido atualizado!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={!!cdPedido}
      onClose={onClose}
      panelClassName="max-w-2xl max-h-[88vh]"
    >
      <>
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--zephira-primary)]/10 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--zephira-primary)]">
                    receipt_long
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                    Pedido #{cdPedido}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Detalhes e atualização de status
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
            <div className="overflow-y-auto flex-1 p-8 space-y-6">
              {isLoading || !pedido ? (
                <div className="py-20 text-center text-slate-400 font-bold animate-pulse">
                  Carregando pedido...
                </div>
              ) : (
                <>
                  {/* Cliente */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Cliente
                      </p>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {pedido.USUARIO.NM_USUARIO}
                      </p>
                      <p className="text-xs text-slate-500">
                        {pedido.USUARIO.DS_EMAIL}
                      </p>
                      {pedido.USUARIO.NR_TELEFONE && (
                        <p className="text-xs text-slate-500">
                          {pedido.USUARIO.NR_TELEFONE}
                        </p>
                      )}
                    </div>
                    <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                        Endereço de Entrega
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {pedido.DS_SNAPSHOT_ENDERECO.NM_LOGRADOURO},{" "}
                        {pedido.DS_SNAPSHOT_ENDERECO.NR_NUMERO}
                        {pedido.DS_SNAPSHOT_ENDERECO.DS_COMPLEMENTO &&
                          ` - ${pedido.DS_SNAPSHOT_ENDERECO.DS_COMPLEMENTO}`}
                        <br />
                        {pedido.DS_SNAPSHOT_ENDERECO.NM_BAIRRO},{" "}
                        {pedido.DS_SNAPSHOT_ENDERECO.NM_CIDADE}/
                        {pedido.DS_SNAPSHOT_ENDERECO.DS_UF}
                        <br />
                        CEP {pedido.DS_SNAPSHOT_ENDERECO.NR_CEP}
                      </p>
                    </div>
                  </section>

                  {/* Itens */}
                  <section>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Itens do Pedido
                    </p>
                    <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                          {pedido.ITENS_PEDIDO.map((item) => (
                            <tr key={item.CD_ITEM}>
                              <td className="p-3">
                                <p className="font-bold text-slate-900 dark:text-white">
                                  {item.NM_PRODUTO_SNAPSHOT}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {item.CD_SKU_SNAPSHOT}
                                  {item.VARIACOES_PRODUTO &&
                                    ` · ${item.VARIACOES_PRODUTO.DS_TAMANHO}`}
                                </p>
                              </td>
                              <td className="p-3 text-center text-slate-500 font-bold">
                                x{item.QT_ITEM}
                              </td>
                              <td className="p-3 text-right font-black text-slate-900 dark:text-white">
                                {formatMoney(item.VL_TOTAL_ITEM)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  {/* Totais */}
                  <section className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Subtotal</span>
                      <span>{formatMoney(pedido.VL_SUBTOTAL)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Desconto</span>
                      <span>-{formatMoney(pedido.VL_DESCONTO)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium text-slate-500">
                      <span>Frete</span>
                      <span>{formatMoney(pedido.VL_FRETE)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-1.5 border-t border-slate-200 dark:border-white/10">
                      <span>Total</span>
                      <span>{formatMoney(pedido.VL_TOTAL)}</span>
                    </div>
                  </section>

                  {/* Status / Rastreio */}
                  <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Status do Pedido
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full h-11 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)] cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Código de Rastreio
                      </label>
                      <input
                        value={rastreio}
                        onChange={(e) => setRastreio(e.target.value)}
                        placeholder="Ex: BR123456789BR"
                        className="w-full h-11 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 px-4 text-sm font-mono text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[var(--zephira-primary)]"
                      />
                    </div>
                  </section>
                </>
              )}
            </div>

            {/* Footer */}
            {pedido && (
              <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-[#102220]/50 backdrop-blur-md">
                <button
                  onClick={onClose}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={handleSalvarStatus}
                  disabled={isSaving}
                  className={cn(
                    "px-6 py-2.5 rounded-xl bg-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/90 text-[#0f1715] font-bold text-sm shadow-lg shadow-[var(--zephira-primary)]/20 transition-all",
                    isSaving && "opacity-60",
                  )}
                >
                  {isSaving ? "Salvando..." : "Salvar Status"}
                </button>
              </div>
            )}
      </>
    </Modal>
  );
}

"use client";

import { Modal } from "@/components/ui/Modal";
import api from "@/lib/api";
import { ImagePlus, Loader2, Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Variacao {
  CD_VARIACAO: number;
  DS_TAMANHO: string;
}

interface VariationPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  variacao: Variacao | null;
  nomeProduto?: string;
}

interface Foto {
  CD_IMAGEM: number;
  DS_URL: string;
}

/**
 * Fotos só dessa variação (ex: a cor "Azul claro" de um brinco). A loja
 * troca a galeria do produto pra essas fotos quando o cliente escolhe essa
 * variação; sem foto aqui, continua mostrando as fotos gerais do produto.
 * Diferente do upload de "Imagens do Produto" (editProductModal), que é
 * geral — nenhuma foto daqui vira capa do produto.
 */
export function VariationPhotosModal({
  isOpen,
  onClose,
  variacao,
  nomeProduto,
}: VariationPhotosModalProps) {
  const [fotos, setFotos] = useState<Foto[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen || !variacao) return;
    setCarregando(true);
    api
      .get(`admin/produtos/variacao/${variacao.CD_VARIACAO}/imagens`)
      .then((res) => setFotos(res.data))
      .catch(() => toast.error("Não consegui carregar as fotos dessa variação."))
      .finally(() => setCarregando(false));
  }, [isOpen, variacao]);

  if (!variacao) return null;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setEnviando(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => formData.append("files", file));

    try {
      // Mesmo motivo do upload de imagens do produto: a instância `api` tem
      // Content-Type: application/json como padrão, e isso faz o axios
      // converter o FormData pra JSON (perdendo os arquivos) em vez de
      // deixar o navegador montar o multipart com boundary.
      const res = await api.post(
        `admin/produtos/variacao/${variacao.CD_VARIACAO}/imagens`,
        formData,
        { headers: { "Content-Type": undefined } },
      );
      setFotos((atual) => [...atual, ...res.data]);
      toast.success("Foto adicionada!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar a foto.");
    } finally {
      setEnviando(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (cd_imagem: number) => {
    if (!confirm("Excluir essa foto?")) return;
    try {
      await api.delete(`admin/produtos/imagens/${cd_imagem}`);
      setFotos((atual) => atual.filter((f) => f.CD_IMAGEM !== cd_imagem));
      toast.success("Foto removida.");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover a foto.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} panelClassName="max-w-lg">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#0c1a18]/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[var(--zephira-primary)]/10 rounded-xl border border-[var(--zephira-primary)]/20">
            <ImagePlus size={18} className="text-[var(--zephira-primary)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
              Fotos: {variacao.DS_TAMANHO}
            </h2>
            {nomeProduto && (
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {nomeProduto}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Essas fotos aparecem só quando a cliente escolhe{" "}
          <strong className="text-gray-700 dark:text-gray-300">
            {variacao.DS_TAMANHO}
          </strong>{" "}
          na página do produto. Sem foto aqui, a loja usa as fotos gerais do
          produto.
        </p>

        {carregando ? (
          <div className="flex items-center justify-center py-10 text-gray-400">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {fotos.map((foto) => (
              <div
                key={foto.CD_IMAGEM}
                className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 dark:border-white/10"
              >
                <Image src={foto.DS_URL} alt="" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(foto.CD_IMAGEM)}
                    className="p-1.5 bg-white/20 text-white hover:bg-red-500 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={enviando}
              className="aspect-square rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 hover:border-[var(--zephira-primary)] hover:bg-[var(--zephira-primary)]/5 text-gray-400 transition-all"
            >
              {enviando ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Upload size={20} />
                  <span className="text-[9px] font-bold uppercase">Adicionar</span>
                </>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              multiple
              accept="image/*,.heic,.heif"
              className="hidden"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

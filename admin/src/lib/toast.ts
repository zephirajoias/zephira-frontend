// Ponto único de configuração do react-toastify. Toda tela/modal importa
// daqui em vez de "react-toastify" direto, pra mudar tema/duração/posição
// num lugar só em vez de ~20 arquivos.
import { toast as reactToastify, type ToastOptions } from "react-toastify";

export { ToastContainer } from "react-toastify";

export const toast = {
  success: (msg: string, options?: ToastOptions) =>
    reactToastify.success(msg, options),
  error: (msg: string, options?: ToastOptions) =>
    reactToastify.error(msg, options),
  warn: (msg: string, options?: ToastOptions) =>
    reactToastify.warn(msg, options),
  info: (msg: string, options?: ToastOptions) =>
    reactToastify.info(msg, options),
};

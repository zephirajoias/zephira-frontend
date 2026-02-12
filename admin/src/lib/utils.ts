// @/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes do Tailwind de forma inteligente.
 * - clsx: permite lógica condicional (ex: isActive && "bg-red-500")
 * - twMerge: resolve conflitos (ex: "px-2 px-4" vira apenas "px-4")
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

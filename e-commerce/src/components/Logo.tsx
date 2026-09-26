"use client";

import { useLoja } from "@/context/LojaContext";
import Image from "next/image";

// Logo enviado em Configurações Gerais no admin; sem ele, o nome em texto.
export function Logo({
  className = "",
  altura = 40,
}: {
  className?: string;
  altura?: number;
}) {
  const { config } = useLoja();
  const nome = config?.NM_LOJA || "Zephira";

  if (config?.DS_URL_LOGO) {
    return (
      <Image
        src={config.DS_URL_LOGO}
        alt={nome}
        width={0}
        height={0}
        sizes={`${altura * 4}px`}
        style={{ height: altura, width: "auto" }}
        className="object-contain"
        priority
      />
    );
  }

  return (
    <span
      className={`font-black uppercase tracking-[0.15em] text-bg-dark ${className}`}
    >
      {nome}
    </span>
  );
}

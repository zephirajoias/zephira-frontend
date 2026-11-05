"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export interface BannerSlide {
  url: string;
  link?: string | null;
}

// Carrossel do banner do topo da home. Cada foto pode ter um link próprio
// (categoria, produto, página) — ver admin → Configurações Gerais →
// Imagens da Home. Gira sozinho a cada 6s quando tem mais de 1 foto.
export function BannerCarousel({ slides }: { slides: BannerSlide[] }) {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setAtual((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[650px] overflow-hidden bg-bg-dark">
      {slides.map((slide, i) => {
        const foto = (
          <img
            src={slide.url}
            alt="Joias Zephira"
            className="w-full h-full object-cover object-center"
          />
        );
        return (
          <div
            key={slide.url + i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === atual ? 1 : 0 }}
            aria-hidden={i !== atual}
          >
            {slide.link ? (
              <Link href={slide.link} className="block w-full h-full">
                {foto}
              </Link>
            ) : (
              foto
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setAtual(i)}
              aria-label={`Ver banner ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === atual ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

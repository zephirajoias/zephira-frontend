import { PaginaInstitucional } from "@/components/PaginaInstitucional";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Sobre | Zephira Joias" };

export default function SobrePage() {
  return (
    <PaginaInstitucional titulo="Sobre a Zephira">
      <p>
        A Zephira Joias é uma loja online de joias em prata 925, peças banhadas
        a ouro e aço inox: brincos, anéis, colares, pulseiras e conjuntos para
        usar no dia a dia e em ocasiões especiais.
      </p>
      <p>
        Todas as peças têm garantia de 1 ano contra defeitos de fabricação e
        são enviadas para todo o Brasil, com o prazo e o preço do frete
        mostrados antes de você pagar.
      </p>
      <p>
        <Link href="/#novidades">Conheça as novidades</Link> ou{" "}
        <Link href="/contato">fale com a gente</Link>.
      </p>
    </PaginaInstitucional>
  );
}

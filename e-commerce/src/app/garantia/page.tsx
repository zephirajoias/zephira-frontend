import { Contatos, PaginaInstitucional } from "@/components/PaginaInstitucional";
import { carregarDadosLoja } from "@/lib/loja";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Garantia | Zephira Joias" };

export default async function GarantiaPage() {
  const { config } = await carregarDadosLoja();
  return (
    <PaginaInstitucional titulo="Garantia">
      <p>
        Todas as peças têm <strong>garantia de 1 ano contra defeitos de
        fabricação</strong>, contada a partir do recebimento. Esse prazo já
        inclui a garantia legal de 90 dias do Código de Defesa do Consumidor.
      </p>

      <h2>O que a garantia cobre</h2>
      <ul className="lista">
        <li>Fechos, argolas e engates que se soltam ou quebram com o uso normal.</li>
        <li>Soldas que se abrem.</li>
        <li>Pedras que se soltam sem ter havido impacto.</li>
      </ul>

      <h2>O que ela não cobre</h2>
      <ul className="lista">
        <li>Danos por queda, impacto, puxão ou peça amassada.</li>
        <li>Desgaste do banho causado por contato com perfume, cremes, cloro, água do mar ou produtos de limpeza.</li>
        <li>Peças consertadas ou alteradas por terceiros.</li>
        <li>Perda de peças ou pedras.</li>
      </ul>

      <h2>Como cuidar</h2>
      <p>
        Coloque as joias depois de passar perfume e cremes, tire antes de
        dormir, tomar banho ou nadar, e guarde cada peça separada, num saquinho
        ou caixinha, longe da umidade. A prata 925 pode escurecer com o tempo;
        isso é natural do metal e sai com flanela própria para prata.
      </p>

      <h2>Como acionar</h2>
      <p>
        Fale com a gente pelos contatos abaixo com o número do pedido e fotos
        da peça. A troca segue os mesmos passos da página de{" "}
        <a href="/trocas">trocas e devoluções</a>.
      </p>
      <Contatos config={config} />
    </PaginaInstitucional>
  );
}

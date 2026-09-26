import { Contatos, PaginaInstitucional } from "@/components/PaginaInstitucional";
import { carregarDadosLoja } from "@/lib/loja";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trocas e devoluções | Zephira Joias" };

export default async function TrocasPage() {
  const { config } = await carregarDadosLoja();
  return (
    <PaginaInstitucional titulo="Trocas e devoluções">
      <h2>Desistência em até 7 dias</h2>
      <p>
        Toda compra feita pela internet pode ser cancelada em até{" "}
        <strong>7 dias corridos a partir do recebimento</strong>, sem precisar
        de justificativa (Código de Defesa do Consumidor, art. 49). Devolvemos
        o valor total pago, incluindo o frete, pela mesma forma de pagamento
        usada na compra.
      </p>

      <h2>Troca por defeito</h2>
      <p>
        Se a peça chegar com defeito ou apresentar defeito de fabricação
        dentro do prazo de garantia, fazemos a troca por outra igual ou, se não
        houver no estoque, devolvemos o valor. Veja a página de{" "}
        <a href="/garantia">garantia</a> para saber o que ela cobre.
      </p>

      <h2>Como pedir</h2>
      <ol className="lista">
        <li>Fale com a gente por um dos contatos abaixo e informe o número do pedido (está em Minha conta).</li>
        <li>Enviamos as instruções e o código de postagem para devolver a peça.</li>
        <li>A peça deve voltar na embalagem original, sem sinais de uso.</li>
        <li>Assim que a peça chegar e for conferida, fazemos a troca ou o reembolso.</li>
      </ol>

      <Contatos config={config} />
    </PaginaInstitucional>
  );
}

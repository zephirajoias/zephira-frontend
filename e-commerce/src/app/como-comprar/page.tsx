import { PaginaInstitucional } from "@/components/PaginaInstitucional";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Como comprar | Zephira Joias" };

export default function ComoComprarPage() {
  return (
    <PaginaInstitucional titulo="Como comprar">
      <ol className="lista">
        <li>
          <strong>Escolha a peça.</strong> Na página do produto, selecione o
          tamanho (quando houver) e toque em adicionar ao carrinho.
        </li>
        <li>
          <strong>Calcule o frete.</strong> No carrinho, informe o seu CEP para
          ver as opções de entrega, com preço e prazo de cada uma.
        </li>
        <li>
          <strong>Entre na sua conta.</strong> Se ainda não tiver cadastro, ele
          leva menos de um minuto. É por ela que você acompanha o pedido.
        </li>
        <li>
          <strong>Escolha o endereço e pague.</strong> O pagamento é feito no
          ambiente seguro do Mercado Pago, por Pix ou cartão de crédito.
        </li>
        <li>
          <strong>Acompanhe.</strong> Em Minha conta você vê o status do pedido
          e, depois do envio, o código de rastreio.
        </li>
      </ol>

      <h2>Pagamento</h2>
      <p>
        O Pix é aprovado na hora. No cartão, o valor pode ser parcelado; as
        parcelas disponíveis aparecem na tela de pagamento do Mercado Pago.
        Pedidos não pagos em 24 horas são cancelados automaticamente e as peças
        voltam para a loja.
      </p>
    </PaginaInstitucional>
  );
}

import { Contatos, PaginaInstitucional } from "@/components/PaginaInstitucional";
import { carregarDadosLoja } from "@/lib/loja";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Perguntas frequentes | Zephira Joias" };

const PERGUNTAS = [
  {
    p: "Qual o prazo de entrega?",
    r: "Depende da forma de envio e do seu CEP. No carrinho, ao informar o CEP, cada opção de frete mostra o preço e o prazo em dias úteis. O prazo começa a contar depois da confirmação do pagamento.",
  },
  {
    p: "Como acompanho meu pedido?",
    r: "Em Minha conta, na aba de pedidos. Depois que o pedido é enviado, o código de rastreio aparece ali.",
  },
  {
    p: "Quais as formas de pagamento?",
    r: "Pix e cartão de crédito, pelo Mercado Pago. O Pix é aprovado na hora.",
  },
  {
    p: "A prata 925 escurece?",
    r: "Pode escurecer com o tempo, principalmente em contato com umidade e produtos químicos. É natural do metal e sai com uma flanela própria para prata. Veja os cuidados na página de garantia.",
  },
  {
    p: "Posso trocar ou devolver?",
    r: "Sim. Você pode desistir da compra em até 7 dias depois de receber, e peças com defeito de fabricação têm garantia de 1 ano. Os detalhes estão na página de trocas e devoluções.",
  },
  {
    p: "O que acontece se eu não pagar o pedido?",
    r: "Pedidos não pagos em 24 horas são cancelados automaticamente. Você pode fazer um novo pedido quando quiser.",
  },
];

export default async function FaqPage() {
  const { config } = await carregarDadosLoja();
  return (
    <PaginaInstitucional titulo="Perguntas frequentes">
      {PERGUNTAS.map(({ p, r }) => (
        <details
          key={p}
          className="group rounded-2xl border border-slate-200 px-5 py-4 open:border-primary"
        >
          <summary className="cursor-pointer font-bold text-text-main list-none flex justify-between gap-4">
            {p}
            <span className="material-symbols-outlined text-text-muted group-open:rotate-180 transition-transform">
              expand_more
            </span>
          </summary>
          <p className="mt-3">{r}</p>
        </details>
      ))}
      <h2>Não achou sua dúvida?</h2>
      <Contatos config={config} />
    </PaginaInstitucional>
  );
}

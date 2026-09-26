import { redirect } from "next/navigation";

// Esta tela era só um modelo com dados de exemplo (zonas e tarifas fixas).
// O frete de verdade é calculado pelo SuperFrete a partir do remetente e do
// pacote padrão, que ficam em Configurações Gerais.
export default function ShippingPage() {
  redirect("/settings_geral");
}

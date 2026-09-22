import { createClient } from "@supabase/supabase-js";

// Faz fallback pra um valor qualquer (não vazio) se a env var não estiver
// configurada. Isso é só pra não derrubar o build inteiro do Next — o
// Next tenta pré-renderizar a página de reset de senha em build time, e
// createClient() lança erro se receber string vazia/undefined.
// Sem a env var de verdade configurada no Vercel (NEXT_PUBLIC_SUPABASE_URL
// e NEXT_PUBLIC_SUPABASE_ANON_KEY), o fluxo de recuperação de senha não
// funciona em produção — o build só passa a não quebrar por causa disso.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL não configurada — recuperação de senha não vai funcionar.",
  );
}

// Usado só pra fluxos de Auth que precisam rodar no navegador (ex: link de
// recuperação de senha). O admin continua autenticado via JWT próprio
// (ver src/lib/api.ts) para todas as chamadas normais à API.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

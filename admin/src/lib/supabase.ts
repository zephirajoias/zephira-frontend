import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Usado só pra fluxos de Auth que precisam rodar no navegador (ex: link de
// recuperação de senha). O admin continua autenticado via JWT próprio
// (ver src/lib/api.ts) para todas as chamadas normais à API.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

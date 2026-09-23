# Zephira — Frontends (admin + e-commerce)

Monorepo pnpm com dois apps Next.js 16 (Turbopack) separados, cada um
com seu próprio deploy no Vercel:

- `apps/admin` → projeto Vercel `zephira-frontend` →
  `admin.zephirajoias.com.br`
- `apps/e-commerce` → projeto Vercel `zephira-frontend-q934` →
  `zephirajoias.com.br` / `www.zephirajoias.com.br`

Os dois consomem a mesma API (repo `zephira-backend`, NestJS, deploy no
Render free tier — ver `back-end/CLAUDE.md` pra instabilidades de infra
e convenções de dados do lado do backend).

> Este arquivo deve ser mantido atualizado. Sempre que um bug de
> arquitetura, uma instabilidade de infra ou um padrão importante for
> descoberto, registrar aqui.

## `pnpm`, não `npm`

Monorepo pnpm de verdade (`pnpm-lock.yaml`). Rodar `npm install` aqui
quebra a resolução de dependências (peer deps do Next ficam
inconsistentes). Usar sempre `pnpm add`/`pnpm install`.

## admin: `src/lib/api.ts` — NUNCA fixar `Content-Type` na instância axios

Bug real que já custou duas rodadas de investigação: se a instância do
axios tiver `Content-Type: application/json` como header padrão, o
próprio axios (não é frontend "esquecendo" de configurar nada — é
comportamento documentado do `lib/defaults/index.js` do axios) deixa de
detectar `FormData` sozinho e **converte o FormData pra JSON**, perdendo
qualquer arquivo anexado (`files` vira `{}`). Isso quebrou upload de
imagem de produto/categoria por meses sem ninguém entender o motivo real
(o sintoma parecia "arquivo não chega", não "virou JSON").

A instância atual (`api.ts`) não fixa `Content-Type` de propósito. Se
algum dia alguém adicionar `headers: { "Content-Type": "application/json" }`
no `axios.create(...)`, todo upload de arquivo quebra de novo. Se for
necessário mesmo assim, cada chamada que manda `FormData` precisa
explicitamente `headers: { "Content-Type": undefined }` pra anular o
padrão da instância.

Também tem timeout de 60s configurado nessa instância — não é
capricho, é pra cobrir o cold-start do Render (ver abaixo) sem deixar a
tela presa em "Processando..." pra sempre sem feedback.

## Navegação por categoria é hierárquica

`/categoria/[pai]/[filho]` (ex: `/categoria/colares/aco`). O slug do
filho **não é único sozinho** (várias categorias-pai têm um filho
"aco"/"ouro"/"prata"), então a página sempre manda os dois segmentos pro
backend (`?subcategoria=`), nunca só o primeiro. Ver
`e-commerce/src/app/categoria/[...slug]/page.tsx` e a nota equivalente
em `back-end/CLAUDE.md`.

O menu (`Header.tsx`, `MENU_ESTRUTURA`) usa slugs "bonitos" fixos no
código (brincos, colares, pulseiras, aneis, conjuntos, tornozeleiras) —
esses têm que bater exatamente com o `DS_SLUG` das categorias de topo no
banco. Se alguém criar uma categoria de topo nova pelo admin, o slug
gerado automaticamente (kebab-case do nome) pode não bater com o que o
menu espera — checar os dois lados ao adicionar categoria nova.

## Favicon/Logo da loja

Configurável em Configurações Gerais no admin (upload de verdade, não é
mockup). Os dois layouts (`admin/src/app/layout.tsx`,
`e-commerce/src/app/layout.tsx`) buscam a URL via `generateMetadata`
(fetch em `GET /configuracoes/publicas`, sem auth, com timeout curto e
fallback pro ícone padrão — não deixar isso travar o build/carregamento
se o backend estiver fora do ar).

**Env vars obrigatórias pro build não quebrar**:
`NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no admin
(usadas também pelo fluxo de "esqueci minha senha", que fala direto com
o Supabase Auth pelo SDK, sem passar pelo backend). Se faltar no Vercel,
o `lib/supabase.ts` cai num placeholder pra não derrubar o build
inteiro, mas a funcionalidade de verdade (favicon dinâmico, reset de
senha) fica quebrada até configurar de verdade no Vercel → Settings →
Environment Variables.

## Imagem de produto: usar `next/image`, não `<img>`

Categoria, home e detalhe do produto usam `next/image` (lazy loading +
redimensionamento automático pro tamanho exibido + cache). O domínio do
Supabase Storage precisa estar em `images.remotePatterns` no
`next.config.ts` do e-commerce — se aparecer imagem quebrada depois de
trocar a URL do bucket/projeto Supabase, checar isso primeiro.

## Cold start do Render — sempre tratar timeout na UI

O backend dorme depois de ~15min sem uso; primeiro request pode levar
60-100s+. Qualquer tela nova que chama a API e tem estado de
"carregando" precisa: (1) timeout configurado (a instância `api.ts` do
admin já tem, 60s), (2) alguma mensagem avisando que pode demorar, em
vez de deixar parecendo travado. Já aconteceu de um admin real achar que
o sistema tinha quebrado por causa disso.

## Jeito de testar mudanças nesse repo

- `rm -rf .next && npx next build` em cada app antes de considerar a
  mudança pronta — os dois têm páginas que rodam fetch em build time
  (`generateMetadata`), então um build limpo pega erro que um
  `next dev` não pegaria.
- Pra simular o comportamento do Vercel com env var faltando, renomear
  `.env.local` temporariamente, rodar o build, devolver o nome.
- Upload de arquivo (produto, categoria, logo/favicon) só é validado de
  verdade testando contra o backend rodando (local ou Render) — ver
  `back-end/CLAUDE.md` pra como gerar um JWT de admin sem senha real.

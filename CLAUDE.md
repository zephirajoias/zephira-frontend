# Zephira — Frontends (admin + e-commerce)

Repositório com dois apps Next.js 16 (Turbopack) independentes, cada um
com seu `package.json` e `pnpm-lock.yaml`:

- `admin/` → `admin.zephirajoias.com.br`
- `e-commerce/` → `www.zephirajoias.com.br` (sem www redireciona pra www)

Os dois consomem a mesma API (repo `zephira-backend`, NestJS, em
`api.zephirajoias.com.br`). Ver `back-end/CLAUDE.md` pra infra e
convenções de dados do backend.

Hospedagem: desde 2026-09-25 os três (API, loja e admin) rodam na VPS
da loja, em Docker (ver "Deploy"). O domínio sem www ainda aponta pros
projetos Vercel `zephira-frontend-q934` (loja) e `zephira-frontend`
(admin), que redirecionam pro www, e a API antiga ainda está no Render.
Os dois vão ser desligados.

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

## Preview de link e Google (e-commerce)

As páginas de produto e categoria são `"use client"` e não podem exportar
metadados. Título, descrição e foto do preview (WhatsApp, Instagram,
Google) ficam no `layout.tsx` de cada segmento (`produto/[slug]`,
`categoria/[...slug]`), que roda no servidor. `sitemap.ts` e `robots.ts`
ficam em `src/app`. Tudo busca a API por `lib/site.ts`
(`buscarNoServidor`), que tem timeout de 4s e volta `null` em qualquer
falha, pra o preview nunca derrubar a página. O sitemap é
`force-dynamic`: gerado no build, ele saía vazio.

## Lentidão vem da distância, não do banco

A VPS fica nos EUA (Nova York, perto do Supabase, 10 ms). Cada ida e volta
do navegador no Brasil custa ~0,45s, mesmo num `/health` que não toca no
banco. Por isso a regra é **poucas viagens em fila**: a categoria busca a
1ª página no servidor (`categoria/[...slug]/page.tsx` → `Listagem.tsx`,
que recebe `inicial`) em vez de carregar a página e só depois pedir a
lista. A loja fala com a API pelo endereço público (0,18s de dentro da
VPS). Tela nova: buscar no servidor sempre que der.

## Dados da loja no servidor (e-commerce)

O layout raiz busca a configuração pública e a árvore de categorias
(`lib/loja.ts` → `carregarDadosLoja`) e entrega pelo `LojaContext`. Header
(menu vem das categorias, com nome no plural em `NOME_NO_MENU`), rodapé,
logo e `ProdutoCard` leem daí, sem pedido extra à API. Home, categoria,
produto, busca e páginas institucionais são montadas no servidor. Campo
comercial que não vier da API (frete grátis, parcelas, CNPJ) **não
aparece**: a loja nunca inventa um valor. Parcelas "sem juros" (3x por
padrão, parcela mínima R$ 10) só são verdade se a conta do Mercado Pago
tiver o parcelamento sem juros ligado.

`buscarNoServidor` (`lib/site.ts`) usa timeout de 15s durante o build e 4s
em produção: com 4s no build a home já saiu vazia uma vez.

Carrinho: só é esvaziado em `/minha-conta?pedido=...` (volta do Mercado
Pago), não antes de ir pagar. `clearCart` apaga também o `localStorage`.

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

## Deploy (VPS da loja, em Docker)

- `docker-compose.yml` na raiz deste repo sobe `loja` (`127.0.0.1:3000`)
  e `admin` (`127.0.0.1:3002`). Na VPS o repo fica em
  `/opt/zephira/front-end`, com um `.env` que só existe lá
  (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_API_BASE_URL`,
  `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`). Essas
  variáveis entram no JavaScript **no build**; mudar e só reiniciar o
  container não tem efeito, tem que rodar `docker compose build` de novo.
- `output: "standalone"` só liga com `NEXT_STANDALONE=1`, que o
  `Dockerfile` define. No Windows o standalone quebra criando links
  simbólicos (`EPERM: operation not permitted, symlink`), então o build
  local e o da Vercel continuam no modo normal.
- O workflow `.github/workflows/deploy.yml` faz `docker build` dos dois
  apps em todo push. O deploy por SSH só roda com a variável de
  repositório `DEPLOY_ENABLED=true` e os secrets `VPS_HOST`, `VPS_USER`,
  `VPS_SSH_KEY`. `docker compose up -d --wait` só termina quando os
  healthchecks passam (loja `/`, admin `/login`).
- nginx e HTTPS (certbot) da VPS: ver `back-end/CLAUDE.md`, "Deploy".
- Deploy manual, na VPS:
  ```bash
  cd /opt/zephira/front-end && git pull --ff-only
  docker compose build && docker compose up -d --wait
  ```

## Histórico de mudanças relevantes

- **2026-09-24** — Análise completa do projeto.
- **2026-09-25** — Loja e admin empacotados em Docker (Next standalone) e
  publicados na VPS da loja, ao lado da API.
- **2026-09-25** — DNS de `www`, `admin` e `api` trocado pra VPS. O
  cold start do Render deixou de afetar a produção.
- **2026-09-25** — Categoria abre com os produtos já na página (busca no servidor).
- **2026-09-26** — Loja montada no servidor (produto com dados
  estruturados), menu das categorias, busca, card único
  com parcelas, páginas institucionais, carrinho só esvazia depois do
  pagamento, zoom liberado. Admin sem `alert()` e sem telas de exemplo.
- **2026-09-26** — Banner, "Navegue por Categorias" e "Combinações
  Perfeitas" da home voltaram às fotos e categorias originais, a pedido da
  loja. Visual da vitrine é decisão da loja: não trocar sem pedir.

## Leeshmo MVP

MVP com:

- `Next.js` (App Router)
- `Clerk` para autenticacao
- `Neon Postgres` para persistencia serverless
- `Vercel` para deploy

## Getting Started

1) Copie variaveis de ambiente:

```bash
cp .env.example .env.local
```

2) Preencha `.env.local`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `DATABASE_URL` (Neon)

3) Rode o servidor:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Fluxo implementado

- Login/logout via Clerk
- Onboarding interativo (6 etapas) com autosave local
- Geracao mock de personas/conteudos em `POST /api/generate`
- Persistencia no Neon quando `DATABASE_URL` existe
- Calendario simples com persistencia em `POST /api/calendar`

## Deploy na Vercel

1) Importar repositorio na Vercel
2) Configurar env vars do Clerk e Neon (mesmas do `.env.local`)
3) Deploy

## Observacoes

- As tabelas sao criadas automaticamente pela API na primeira chamada.
- Se `DATABASE_URL` estiver ausente, o app continua funcionando em modo `mock-only`.
- O middleware protege `/` e `/api/*`, exigindo autenticacao.

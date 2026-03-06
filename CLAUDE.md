# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Sobre o projeto

**Aeterna** — Site de casamento full-stack premium com experiências 3D/WebGL, animações cinemáticas e lista de presentes universal com pagamento via PIX.

## Comandos

```bash
npm run dev          # Servidor de desenvolvimento (porta 3000)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # ESLint

npx prisma migrate dev --name <nome>   # Nova migração
npx prisma generate                    # Regenerar tipos do cliente
npx prisma studio                      # GUI do banco de dados
npx prisma db push                     # Sincronizar schema sem migração (dev rápido)
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilização | Tailwind CSS v4 |
| Banco de dados | SQLite via `better-sqlite3` |
| ORM | Prisma 7 (`@prisma/adapter-better-sqlite3`) |
| 3D/WebGL | React Three Fiber + Three.js + `@react-three/drei` |
| Animações | GSAP + ScrollTrigger + Lenis (smooth scroll) |
| Transições UI | Framer Motion |
| Estado global | Zustand |

## Arquitetura

```
src/
├── app/
│   ├── (public)/          # Rotas dos convidados (hero, história, RSVP, presentes)
│   ├── (admin)/           # Painel dos noivos (protegido)
│   └── api/
│       ├── rsvp/          # POST /api/rsvp — confirmação de presença
│       ├── gifts/         # GET/POST /api/gifts — lista de presentes + scraping
│       └── admin/         # Rotas administrativas
├── components/
│   ├── ui/                # Componentes genéricos (botões, modais, filtros)
│   ├── three/             # Cenas R3F: HeroScene, ParticlesCanvas
│   ├── animations/        # Wrappers GSAP: ScrollReveal, ParallaxLayer
│   └── registry/          # Lista de presentes: GiftCard, BentoGrid, FilterPanel
├── lib/
│   └── prisma.ts          # Singleton do PrismaClient com adapter SQLite
├── store/
│   └── registry.ts        # Zustand — filtros da lista de presentes
├── types/
│   └── index.ts           # GiftCategory, PaymentMethod, GiftFilters
└── generated/
    └── prisma/            # Auto-gerado pelo `prisma generate` (não editar)
```

## Banco de dados (Prisma + SQLite)

O arquivo de banco fica em `prisma/dev.db` (ignorado pelo git).

**Modelos principais:**
- `Guest` — convidados com flag `isVip` para acesso condicional ao itinerário
- `Rsvp` — confirmação 1:1 com Guest, inclui acompanhantes e restrições alimentares
- `Attendee` — acompanhantes de grupos familiares
- `GiftItem` — presentes com suporte a financiamento coletivo (`isGroupGift`, `targetAmount`, `raisedAmount`)
- `GiftContribution` — contribuições individuais para group gifting
- `Event` — eventos do itinerário com flag `isVipOnly`

**Configuração Prisma 7:** A URL do banco fica em `prisma.config.ts` (não no `schema.prisma`). O cliente usa o adapter `PrismaBetterSqlite3` — ver `src/lib/prisma.ts`. O import correto do client gerado é `@/generated/prisma/client` (não `@/generated/prisma`).

## Padrões importantes

**Componentes 3D (R3F):** Usar `"use client"` e lazy load com `next/dynamic` + `ssr: false` para evitar erros de hydration. Modelos `.glb` devem ser comprimidos com Draco e ter menos de 2.5 MB.

**Animações GSAP:** Inicializar dentro de `useEffect` com `useGSAP` do `@gsap/react`. Registrar plugins com `gsap.registerPlugin(ScrollTrigger)` uma única vez no layout raiz.

**Lenis:** Instanciar no layout raiz e sincronizar com GSAP via `lenis.on('scroll', ScrollTrigger.update)`.

**Lista de presentes:** Filtros client-side usando `useRegistryStore` (Zustand). O scraping de URLs externas acontece em `/api/gifts/scrape` (server-side, nunca no cliente).

**Rotas de API:** Toda lógica de banco de dados fica em Server Actions ou Route Handlers — nunca importar `prisma` em componentes client.

## Variáveis de ambiente

```env
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_PIX_KEY="chave-pix-dos-noivos"
```

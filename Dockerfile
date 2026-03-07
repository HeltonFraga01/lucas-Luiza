# ─────────────────────────────────────────────────────────────
# Stage 1: deps — instala apenas dependências de produção
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ─────────────────────────────────────────────────────────────
# Stage 2: builder — build da aplicação Next.js
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera o Prisma Client
RUN npx prisma generate

# Build Next.js standalone
# DATABASE_URL aponta para arquivo temporário — evita crash do Prisma
# durante a etapa de pré-renderização estática no build.
# O banco real é injetado em runtime via variável de ambiente no container.
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DATABASE_URL="file:/tmp/build-placeholder.db"
ENV NEXT_PHASE="phase-production-build"
RUN npm run build

# ─────────────────────────────────────────────────────────────
# Stage 3: runner — imagem final mínima
# ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat curl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3010
ENV HOSTNAME=0.0.0.0

# Usuário não-root
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

# O standalone output do Next.js já inclui tudo (Prisma, etc.)
# Só precisamos copiar o standalone, o static e o public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma schema para migrations no startup
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# better-sqlite3 precisa de binário nativo — copia do builder
# (standalone pode não incluir módulos nativos corretamente)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Seed do banco pré-populado — copiado do contexto de build (não do builder)
COPY --chown=nextjs:nodejs prisma/dev.db /app/seed.db

# Pasta de dados (SQLite será montado como volume Docker)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

# Uploads seed — guardados fora do mount point para não conflitar com o volume
COPY --from=builder --chown=nextjs:nodejs /app/public/uploads ./seed-uploads

# Script de inicialização do schema (CREATE TABLE IF NOT EXISTS para todas as tabelas)
COPY --chown=nextjs:nodejs scripts/init-db.js /app/scripts/init-db.js

# Entrypoint: inicializa o banco a partir do seed se o volume estiver vazio
COPY --chown=nextjs:nodejs docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

USER nextjs

EXPOSE 3010

HEALTHCHECK --interval=30s --timeout=10s --retries=5 --start-period=40s \
  CMD curl -f http://localhost:3010/api/health || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]

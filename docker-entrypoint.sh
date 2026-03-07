#!/bin/sh
set -e

DB_PATH="/app/data/lucaseluiza.db"
SEED_PATH="/app/seed.db"
UPLOADS_DIR="/app/public/uploads"
SEED_UPLOADS="/app/seed-uploads"

# ── Diretórios ────────────────────────────────────────────────────────────────
mkdir -p "$UPLOADS_DIR"

# ── Banco de dados ────────────────────────────────────────────────────────────
if [ ! -f "$DB_PATH" ]; then
  echo "[entrypoint] Banco não encontrado — copiando seed..."
  cp "$SEED_PATH" "$DB_PATH"
  echo "[entrypoint] Seed do banco copiado."
else
  echo "[entrypoint] Banco existente — mantendo dados."
fi

# ── Inicializar/migrar schema (CREATE TABLE IF NOT EXISTS) ─────────────────────
echo "[entrypoint] Inicializando schema do banco..."
node /app/scripts/init-db.js

# ── Uploads seed ──────────────────────────────────────────────────────────────
if [ -d "$SEED_UPLOADS" ]; then
  COUNT=$(find "$SEED_UPLOADS" -maxdepth 1 -type f 2>/dev/null | wc -l)
  if [ "$COUNT" -gt 0 ]; then
    echo "[entrypoint] Copiando $COUNT arquivo(s) de seed para uploads..."
    cp -n "$SEED_UPLOADS"/* "$UPLOADS_DIR"/ 2>/dev/null || true
    echo "[entrypoint] Uploads seed aplicados."
  fi
fi

exec node server.js

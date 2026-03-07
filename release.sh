#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# release.sh — Build multiarch + Push + Deploy Lucas & Luiza
# ─────────────────────────────────────────────────────────────
set -euo pipefail

# ── Variáveis ────────────────────────────────────────────────
IMAGE="heltonfraga/lucas-luiza"
VERSION="${1:-$(node -p "require('./package.json').version")}"
PLATFORMS="linux/amd64,linux/arm64"
STACK_NAME="lucas-luiza"
DOMAIN="lucashenriqueluiza.com.br"
HEALTH_URL="https://${DOMAIN}/api/health"

# Cores
GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓ $*${NC}"; }
fail() { echo -e "${RED}✗ $*${NC}"; exit 1; }
info() { echo -e "${YELLOW}► $*${NC}"; }

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║        Lucas & Luiza — Release ${VERSION}               ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

# ── T1: Auditoria ────────────────────────────────────────────
info "T1 — Auditando ambiente..."
command -v docker  >/dev/null || fail "docker não encontrado"
command -v npm     >/dev/null || fail "npm não encontrado"
docker buildx inspect multiarch >/dev/null 2>&1 || \
  docker buildx create --name multiarch --use --bootstrap
ok "Ambiente OK"

# ── T2: Versão no package.json ───────────────────────────────
info "T2 — Atualizando versão para ${VERSION}..."
npm version "${VERSION}" --no-git-tag-version --allow-same-version
ok "Versão atualizada: ${VERSION}"

# ── T3: Build de produção ────────────────────────────────────
info "T3 — Executando build de produção..."
npm run build || fail "Build falhou"
ok "Build OK"

# ── T4: Lint ─────────────────────────────────────────────────
info "T4 — Executando lint..."
npm run lint || fail "Lint falhou"
ok "Lint OK"

# ── T5+T6: Build multiarch Docker ────────────────────────────
info "T5/T6 — Build multiarch Docker (${PLATFORMS})..."
docker buildx build \
  --platform "${PLATFORMS}" \
  --build-arg APP_VERSION="${VERSION}" \
  --tag "${IMAGE}:${VERSION}" \
  --tag "${IMAGE}:latest" \
  --push \
  . || fail "Docker build/push falhou"
ok "Imagem publicada: ${IMAGE}:${VERSION}"

# ── T8: Validar manifest multiarch ───────────────────────────
info "T8 — Validando manifest multiarch..."
docker buildx imagetools inspect "${IMAGE}:${VERSION}" | grep -E "linux/amd64|linux/arm64" \
  || fail "Manifest multiarch incompleto"
ok "Manifest OK — amd64 + arm64"

# ── T9/T10: Orientações Portainer ────────────────────────────
echo ""
info "T9/T10 — Stack Portainer:"
echo "  • Abra o Portainer → Stacks → lucas-luiza"
echo "  • Atualize a variável APP_VERSION para: ${VERSION}"
echo "  • Clique em 'Update the stack'"
echo ""
echo "  Variáveis obrigatórias no Portainer:"
echo "    APP_VERSION=${VERSION}"
echo "    ADMIN_PASSWORD_HASH=<bcrypt hash>"
echo "    JWT_SECRET=<secret 32+ chars>"
echo ""

# ── T15/T16: Pós-deploy health check ─────────────────────────
read -r -p "  Pressione ENTER após atualizar o Portainer para validar o deploy..."

info "T15 — Aguardando health endpoint (${HEALTH_URL})..."
MAX=12
COUNT=0
until curl -sSf "${HEALTH_URL}" >/dev/null 2>&1; do
  COUNT=$((COUNT+1))
  if [ $COUNT -ge $MAX ]; then
    fail "Health check falhou após $((MAX*10))s"
  fi
  echo "    Aguardando... (${COUNT}/${MAX})"
  sleep 10
done
ok "Health endpoint respondendo"

# ── T16: Validar roteamento ──────────────────────────────────
info "T16 — Validando domínio e TLS..."
STATUS=$(curl -sSo /dev/null -w "%{http_code}" "https://${DOMAIN}")
[ "${STATUS}" = "200" ] || fail "Domínio retornou HTTP ${STATUS}"
ok "Domínio OK — HTTP ${STATUS} com TLS"

# ── T17: Pós-deploy check completo ───────────────────────────
info "T17 — Pós-deploy check..."
HEALTH=$(curl -sSf "${HEALTH_URL}")
DB_STATUS=$(echo "${HEALTH}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('database','?'))" 2>/dev/null || echo "?")
APP_VER=$(echo "${HEALTH}" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('version','?'))" 2>/dev/null || echo "?")
ok "Database: ${DB_STATUS}"
ok "App version reportada: ${APP_VER}"
[ "${APP_VER}" = "${VERSION}" ] || echo -e "${YELLOW}⚠ Versão divergente (esperado ${VERSION}, got ${APP_VER})${NC}"

# ── T18: Rollback Gate ───────────────────────────────────────
info "T18 — Rollback gate..."
DIGEST=$(docker buildx imagetools inspect "${IMAGE}:${VERSION}" 2>/dev/null | grep "Digest:" | head -1 | awk '{print $2}')
echo "  Imagem de rollback disponível:"
echo "    ${IMAGE}:${VERSION}  @${DIGEST}"
echo "  Comando de rollback:"
echo "    docker service update --image ${IMAGE}:<VERSAO_ANTERIOR> ${STACK_NAME}_app"
ok "Rollback gate OK"

# ── Resumo Final ─────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✓  Release ${VERSION} concluída com sucesso!       ║"
echo "╟──────────────────────────────────────────────────────╢"
echo "║  Imagem:  ${IMAGE}:${VERSION}"
echo "║  Digest:  ${DIGEST:-N/A}"
echo "║  Domínio: https://${DOMAIN}"
echo "║  Health:  ${HEALTH_URL}"
echo "╚══════════════════════════════════════════════════════╝"

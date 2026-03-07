# Tasks — Release e Deploy Produção
# Lucas & Luiza Wedding Experience v0.0.1

## Status Geral
**Versão:** `0.0.1`
**Domínio:** `lucashenriqueluiza.com.br`
**Imagem:** `heltonfraga/lucas-luiza:0.0.1`
**Stack:** `lucas-luiza`

---

## Checklist de Release

### Fase 1 — Preparação local
- [ ] **T1** — Auditar versão atual no `package.json` → deve ser `0.0.1`
- [ ] **T2** — Confirmar `next.config.ts` com `output: "standalone"`
- [ ] **T3** — Confirmar `src/app/api/health/route.ts` existe e retorna 200
- [ ] **T4** — Confirmar `Dockerfile` e `.dockerignore` existem

### Fase 2 — Validação de build
- [ ] **T5** — Executar `npm run build` → deve passar sem erros
- [ ] **T6** — Executar `npm run lint` → sem erros críticos
- [ ] **T7** — Confirmar `.next/standalone/server.js` foi gerado

### Fase 3 — Docker
- [ ] **T8** — Confirmar buildx builder multiarch disponível:
  ```bash
  docker buildx ls
  docker buildx create --name multiarch --use --bootstrap  # se não existir
  ```
- [ ] **T9** — Login no Docker Hub:
  ```bash
  docker login
  ```
- [ ] **T10** — Build + push multiarch:
  ```bash
  docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag heltonfraga/lucas-luiza:0.0.1 \
    --tag heltonfraga/lucas-luiza:latest \
    --push .
  ```
- [ ] **T11** — Validar manifest multiarch:
  ```bash
  docker buildx imagetools inspect heltonfraga/lucas-luiza:0.0.1
  # Deve conter linux/amd64 e linux/arm64
  ```

### Fase 4 — Portainer
- [ ] **T12** — Abrir Portainer → Stacks → **lucas-luiza**
- [ ] **T13** — Configurar variáveis de ambiente no Portainer:
  ```
  APP_VERSION=0.0.1
  DATABASE_URL=file:/app/data/prod.db
  ADMIN_PASSWORD_HASH=<bcrypt hash da senha admin>
  JWT_SECRET=<string segura 32+ chars>
  ```
- [ ] **T14** — Colar conteúdo do `docker-compose.yml` no editor da stack
- [ ] **T15** — Clicar em **Deploy the stack** (ou **Update the stack**)
- [ ] **T16** — Aguardar convergência — verificar que o serviço está `running`:
  ```bash
  docker service ls | grep lucas-luiza
  docker service ps lucas-luiza_app
  ```

### Fase 5 — Validação de deploy
- [ ] **T17** — Validar health endpoint externo:
  ```bash
  curl -sSf https://lucashenriqueluiza.com.br/api/health | python3 -m json.tool
  # Esperado: {"status":"healthy","database":"connected","version":"0.0.1",...}
  ```
- [ ] **T18** — Validar domínio principais:
  ```bash
  curl -I https://lucashenriqueluiza.com.br
  # Esperado: HTTP/2 200
  curl -I http://lucashenriqueluiza.com.br
  # Esperado: redirect 301/302 para HTTPS
  curl -I https://www.lucashenriqueluiza.com.br
  # Esperado: HTTP/2 200
  ```
- [ ] **T19** — Validar TLS (certificado Let's Encrypt):
  ```bash
  curl -vvI https://lucashenriqueluiza.com.br 2>&1 | grep -E "SSL|TLS|issuer|expire"
  ```
- [ ] **T20** — Confirmar volumes persistidos:
  ```bash
  docker volume ls | grep lucas_luiza
  # Esperado: lucas_luiza_data, lucas_luiza_uploads
  ```

### Fase 6 — Rollback Gate
- [ ] **T21** — Anotar digest da imagem publicada:
  ```bash
  docker buildx imagetools inspect heltonfraga/lucas-luiza:0.0.1 2>&1 | grep "Digest:"
  ```
- [ ] **T22** — Documentar comando de rollback:
  ```bash
  # Rollback para versão anterior (substituir <VERSAO_ANTERIOR>)
  docker service update \
    --image heltonfraga/lucas-luiza:<VERSAO_ANTERIOR> \
    lucas-luiza_app
  ```
- [ ] **T23** — Confirmar que o rollback é executável (sem erros de auth/pull)

### Fase 7 — Finalização
- [ ] **T24** — Atualizar este arquivo com evidências coletadas
- [ ] **T25** — Commit e push do código:
  ```bash
  git add -A
  git commit -m "chore: release v0.0.1 — deploy infra"
  git push origin main
  ```

---

## Testes Obrigatórios
```bash
# Build
npm run build

# Lint
npm run lint

# Multiarch manifest
docker buildx imagetools inspect heltonfraga/lucas-luiza:0.0.1

# Health externo
curl -sSf https://lucashenriqueluiza.com.br/api/health

# Domínio HTTPS
curl -I https://lucashenriqueluiza.com.br

# Redirect HTTP
curl -I http://lucashenriqueluiza.com.br
```

---

## Ou use o script automático
```bash
chmod +x release.sh
bash release.sh 0.0.1
```

---

## Evidências a Registrar
### code_evidence
- [ ] `package.json` → versão `0.0.1`
- [ ] `Dockerfile` → multistage, porta 3010, healthcheck
- [ ] `docker-compose.yml` → labels Traefik corretos
- [ ] `next.config.ts` → `output: "standalone"`
- [ ] `src/app/api/health/route.ts` → endpoint funcional

### test_evidence
- [ ] Output do `npm run build` (verde)
- [ ] Output do `docker buildx imagetools inspect` (amd64 + arm64)
- [ ] `curl https://lucashenriqueluiza.com.br/api/health` (HTTP 200, database: connected)

### operational_evidence
- [ ] `docker service ls` mostrando `lucas-luiza_app` running
- [ ] Domínio respondendo com TLS válido
- [ ] Digest da imagem `0.0.1` anotado
- [ ] Comando de rollback testado ou documentado

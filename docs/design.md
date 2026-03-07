# Design — Release e Deploy Produção
# Lucas & Luiza Wedding Experience v0.0.1

## Visão Geral
A release segue o padrão Córtexx:
1. validar build e lint
2. gerar imagem Docker multistage versionada
3. publicar imagem multiarch (amd64 + arm64)
4. atualizar stack no Portainer
5. validar Traefik, healthcheck e rollout
6. executar pós-deploy e rollback gate
7. registrar evidências

---

## Arquitetura de Deploy

### Stack
```
Internet → Traefik (websecure:443) → lucas-luiza_app:3010
                ↕ TLS (Let's Encrypt)
         lucashenriqueluiza.com.br
```

### Imagem Docker (Multistage)
| Propriedade | Valor |
|---|---|
| **Registry** | Docker Hub |
| **Imagem** | `heltonfraga/lucas-luiza` |
| **Tag** | `0.0.1` / `latest` |
| **Plataformas** | `linux/amd64`, `linux/arm64` |
| **Base** | `node:20-alpine` |
| **Estágio deps** | instala dependências npm |
| **Estágio builder** | gera Prisma client + `next build` standalone |
| **Estágio runner** | imagem mínima não-root, porta 3010 |

### Volumes Docker
| Volume | Mountpoint | Conteúdo |
|---|---|---|
| `lucas_luiza_data` | `/app/data` | SQLite `prod.db` |
| `lucas_luiza_uploads` | `/app/public/uploads` | Imagens do admin |

### Variáveis de Ambiente de Produção
| Variável | Descrição |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `3010` |
| `APP_VERSION` | `0.0.1` |
| `DATABASE_URL` | `file:/app/data/prod.db` |
| `ADMIN_PASSWORD_HASH` | bcrypt hash da senha admin |
| `JWT_SECRET` | secret JWT (32+ chars) |

---

## Traefik Labels

### HTTPS (obrigatório)
```yaml
- traefik.enable=true
- traefik.docker.network=traefik-public
- traefik.http.routers.lucas-luiza.rule=Host(`lucashenriqueluiza.com.br`) || Host(`www.lucashenriqueluiza.com.br`)
- traefik.http.routers.lucas-luiza.entrypoints=websecure
- traefik.http.routers.lucas-luiza.tls=true
- traefik.http.routers.lucas-luiza.tls.certresolver=letsencrypt
- traefik.http.services.lucas-luiza.loadbalancer.server.port=3010
```

### HTTP → HTTPS redirect
```yaml
- traefik.http.routers.lucas-luiza-http.rule=Host(`lucashenriqueluiza.com.br`) || Host(`www.lucashenriqueluiza.com.br`)
- traefik.http.routers.lucas-luiza-http.entrypoints=web
- traefik.http.routers.lucas-luiza-http.middlewares=lucas-luiza-https-redirect
- traefik.http.middlewares.lucas-luiza-https-redirect.redirectscheme.scheme=https
- traefik.http.middlewares.lucas-luiza-https-redirect.redirectscheme.permanent=true
```

---

## Healthcheck
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3010/api/health"]
  interval: 30s
  timeout: 10s
  retries: 5
  start_period: 40s
```

**Endpoint:** `GET /api/health`

**Resposta saudável (HTTP 200):**
```json
{
  "status": "healthy",
  "version": "0.0.1",
  "uptime": 1234.56,
  "timestamp": "2026-05-15T12:00:00.000Z",
  "database": "connected",
  "responseTime": "3ms"
}
```

---

## Política de Update (Swarm)
```yaml
deploy:
  replicas: 1
  update_config:
    order: start-first    # sobe novo antes de matar antigo (zero downtime)
    parallelism: 1
    delay: 10s
    failure_action: rollback
  rollback_config:
    order: stop-first
    parallelism: 1
```

---

## Estratégia de Rollback
O rollback pode ser executado de 3 formas:

### 1. Via Portainer
- Stacks → `lucas-luiza` → alterar `APP_VERSION` para a versão anterior → Update

### 2. Via Docker CLI
```bash
docker service update \
  --image heltonfraga/lucas-luiza:<VERSAO_ANTERIOR> \
  lucas-luiza_app
```

### 3. Via digest imutável
```bash
# Obter digest da versão anterior
docker buildx imagetools inspect heltonfraga/lucas-luiza:<VERSAO_ANTERIOR>

# Fazer rollback pelo digest
docker service update \
  --image heltonfraga/lucas-luiza@sha256:<DIGEST> \
  lucas-luiza_app
```

---

## Evidências Obrigatórias
| Tipo | O que registrar |
|---|---|
| `code_evidence` | `package.json` versão, Dockerfile, docker-compose.yml, labels Traefik |
| `test_evidence` | Output do `npm run build`, manifest multiarch, health OK |
| `operational_evidence` | Stack convergida, domínio HTTPS respondendo, rollback gate documentado |

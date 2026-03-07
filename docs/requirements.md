# Requirements — Release e Deploy Produção
# Lucas & Luiza Wedding Experience

## Resumo
Executar a release `0.0.1` de produção do sistema **Lucas & Luiza Wedding Experience**,
seguindo o padrão operacional Córtexx:
- build de produção validado
- imagem Docker multiarch publicada
- stack atualizada no Portainer
- roteamento Traefik configurado corretamente
- healthchecks e pós-deploy validados
- rollback pronto e verificável

## Contexto do Sistema
| Campo | Valor |
|---|---|
| **Nome** | Lucas & Luiza Wedding Experience |
| **Package** | `aeterna` |
| **Repo** | `HeltonFraga01/lucas-Luiza` |
| **Diretório local** | `/Users/heltonfraga/Documents/Develop/Lucas&Luiza` |
| **Imagem Docker** | `heltonfraga/lucas-luiza` |
| **Versão** | `0.0.1` |
| **Domínio** | `lucashenriqueluiza.com.br` |
| **Porta interna** | `3010` |
| **Stack Portainer** | `lucas-luiza` |
| **Framework** | Next.js 16 (App Router, standalone output) |
| **Banco** | SQLite via Prisma + better-sqlite3 |

## Objetivo
Deixar o sistema apto para produção com:
- imagem versionada `0.0.1` e reproduzível em amd64 + arm64
- deploy observável via health endpoint `/api/health`
- domínio `lucashenriqueluiza.com.br` roteado via Traefik com TLS
- SQLite persistido em volume Docker (`lucas_luiza_data`)
- uploads de imagens persistidos em volume Docker (`lucas_luiza_uploads`)
- rollback seguro para versão anterior
- documentação e roadmap atualizados

## Escopo
- atualizar versão para `0.0.1` no `package.json`
- validar build de produção Next.js standalone
- publicar imagem multiarch (`linux/amd64` + `linux/arm64`)
- atualizar stack `lucas-luiza` no Portainer
- configurar Traefik labels e router/service
- validar domínio, TLS, health endpoint e rollout
- registrar evidências

## Fora de Escopo
- refatorações não relacionadas ao deploy
- redesign de arquitetura do produto
- mudança de domínio
- migração de banco não prevista

## Critérios de Aceite
- [ ] `npm run build` passa sem erros
- [ ] `npm run lint` passa sem erros críticos
- [ ] imagem `heltonfraga/lucas-luiza:0.0.1` publicada no Docker Hub
- [ ] manifest multiarch contém `linux/amd64` e `linux/arm64`
- [ ] stack `lucas-luiza` atualizada no Portainer
- [ ] Traefik roteando `lucashenriqueluiza.com.br` com TLS via Let's Encrypt
- [ ] `GET https://lucashenriqueluiza.com.br/api/health` retorna HTTP 200
- [ ] rollback gate documentado com digest da imagem
- [ ] volumes `lucas_luiza_data` e `lucas_luiza_uploads` persistidos

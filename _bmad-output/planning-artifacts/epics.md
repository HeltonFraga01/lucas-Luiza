---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories']
inputDocuments:
  - PRDparaSitesdeCasamentoCriativos.md
  - _bmad-output/planning-artifacts/ux-design.md
  - CLAUDE.md
documentStatus: ready_for_implementation
totalEpics: 7
totalStories: 25
frCoverage: 100%
---

# Aeterna (Lucas & Luiza) - Epic Breakdown

## Overview

Este documento fornece o breakdown completo de epics e stories para **Aeterna**, decomposing os requisitos do PRD, UX Design e Architecture em stories implementáveis.

**Data:** 05 de março de 2026
**Casamento:** 16 de Maio de 2026
**Stack:** Next.js 15 · TypeScript · Tailwind CSS v4 · Prisma 7 + SQLite · R3F · GSAP · Framer Motion · Zustand

---

## Requirements Inventory

### Functional Requirements

```
FR-1.1: Hero 3D com React Three Fiber — cena tridimensional com partículas/névoa que reage ao movimento do mouse (desktop) e giroscópio (mobile); tipografia animada com nomes do casal flutuando sobre o ambiente; countdown regressivo para 16/05/2026.

FR-1.2: Módulo de gamificação introdutório (opcional/configurável pelo admin) — mini-jogo HTML5/WebGL side-scroller onde o convidado coleta elementos simbólicos para revelar a data do evento; pode ser habilitado/desabilitado no painel.

FR-1.3: Seção "Nossa História" com ScrollTrigger — timeline interativa vertical; conforme o usuário faz scroll, imagens transitam de blur para foco e textos são revelados sequencialmente; micro-animações orquestradas pelo GSAP ScrollTrigger.

FR-2.1: RSVP Wizard multi-step — formulário de confirmação de presença operando como wizard de 4 etapas sem reload de página; transições entre steps via Framer Motion; etapas: (1) identificação por email, (2) confirmação presença sim/não, (3) acompanhantes + restrições, (4) mensagem opcional + confirmação.

FR-2.2: Agrupamento familiar relacional — o sistema verifica no backend (Prisma) se o email informado está vinculado a dependentes/grupo; UI se adapta em tempo real para incluir formulários de acompanhantes e restrições alimentares de cada membro do grupo em fluxo unificado.

FR-2.3: Itinerário com visibilidade condicional VIP — eventos base (Cerimônia, Festa) visíveis para todos; eventos VIP (Jantar de Ensaio, Despedida) renderizados no DOM apenas para convidados com flag isVip=true; proteção server-side na API.

FR-3.1: Universal Registry via scraping de URL — admin insere URL de qualquer produto de qualquer loja; backend (Next.js API Route) usa cheerio para extrair og:title, og:image, og:price e description das meta-tags Open Graph; salva automaticamente no banco como GiftItem.

FR-3.2: Grade Bento-Box assimétrica — lista de presentes renderizada como CSS Grid responsivo; presentes de alto valor ou group gifts ocupam tiles 2×2; presentes menores ocupam tiles 1×1; hierarquia visual conduz o olhar sem textos apelativos.

FR-3.3: Filtros de faceta client-side — painel de filtros (sticky) com: (a) Categorias conceituais (Cozinha, Quarto, Aventuras, etc.), (b) Faixa de preço (< R$100, R$100-R$300, > R$300), (c) Status (Disponível / Já recebido), (d) Toggle "Mais Desejados"; mutação instantânea usando Zustand + Array.filter() sem reload.

FR-3.4: Group Gifting com barra de progresso — GiftItem com isGroupGift=true exibe targetAmount vs raisedAmount; barra de progresso SVG animada pelo GSAP preenche conforme contribuições chegam; convidados inserem valor parcial customizado.

FR-3.5: Guest Checkout sem cadastro — convidado contribui informando apenas nome e email (sem criar senha/conta); estado da sessão gerenciado via localStorage; email de recibo enviado como confirmação; conversão máxima por fricção mínima.

FR-3.6: Pagamento PIX sem taxas — modal de contribuição exibe QR Code dinâmico mapeado para a chave PIX dos noivos (NEXT_PUBLIC_PIX_KEY); deep link abre app bancário do convidado; 100% do valor vai direto para os noivos sem intermediários; convidado marca como "Enviado" para atualizar barra de progresso.

FR-4.1: Autenticação admin simples — rota /admin/login com formulário de credenciais (email + senha); proteção via middleware Next.js em todas as rotas /admin/*; sem JWT externo — session cookie httpOnly.

FR-4.2: Dashboard admin com métricas — painel inicial mostrando: total de convidados, % de RSVPs confirmados, contagem de recusas, total de contribuições recebidas, lista dos últimos 5 RSVPs.

FR-4.3: Gerenciamento de convidados — CRUD completo de Guest (nome, email, isVip, grupo, allowPlusOne); adição individual ou futura importação CSV; toggle rápido de flag VIP; visualização de RSVPs por convidado.

FR-4.4: Gerenciamento de presentes — CRUD de GiftItem; input de URL com auto-scraping; edição manual de nome/preço/imagem/categoria; toggle isGroupGift e definição de targetAmount; visualização de % atingido e lista de contribuintes.

FR-4.5: Gerenciamento de itinerário — CRUD de Event (nome, data/hora, local, descrição, isVipOnly); ordenação por horário; preview de como aparecerá para convidados vs VIPs.

FR-4.6: Configurações do site — edição de: título do site, data do casamento, textos do Hero, citação bíblica, chave PIX, upload de foto do casal; todas as alterações refletem imediatamente no frontend público.
```

### NonFunctional Requirements

```
NFR-1: Performance e renderização — SSG para páginas estáticas (Hero, História) + SSR/ISR para rotas dinâmicas (Presentes, RSVP); LCP < 1,5 segundos; Lighthouse score ≥ 90 desktop; ativos servidos via CDN.

NFR-2: Gestão de ativos 3D — modelos .glb comprimidos com Draco; tamanho máximo por arquivo: 2,5 MB; cenas R3F pausam rendering via IntersectionObserver quando fora do viewport; GSAP animations pausam quando off-screen.

NFR-3: Banco de dados SQLite via Prisma 7 — substituição do PostgreSQL do PRD original por SQLite (better-sqlite3) para deploy simplificado; integridade ACID mantida via Prisma transactions para GiftContribution; schema definido em prisma/schema.prisma; url em prisma.config.ts.

NFR-4: Mobile-First e Acessibilidade — layout Tailwind CSS v4 nativamente responsivo; touch targets mínimos 48×48px; tipografia reativa com clamp(); WCAG 2.1 AA: contraste mínimo 4.5:1 em textos, ARIA labels em todos os elementos interativos, navegação por teclado completa (Tab indexing) em RSVP e filtros.

NFR-5: Segurança — rotas /admin/* protegidas por middleware; sem exposição de dados VIP ao DOM para convidados comuns; validação server-side de todos os inputs; chave PIX nunca exposta em logs.

NFR-6: Qualidade UX — fluxo de contribuição de presente em ≤ 3 cliques do Bento Grid até confirmação do QR; RSVP completo em ≤ 2 minutos; zero cadastro obrigatório para convidados.
```

### Additional Requirements

**Da Arquitetura (CLAUDE.md):**
- Projeto já scaffolado com Next.js 15 (App Router) + TypeScript — **Epic 1, Story 1 já completo (setup)**
- Prisma 7 configurado com SQLite (`better-sqlite3`); schema com modelos: Guest, Rsvp, Attendee, GiftItem, GiftContribution, Event
- Migração inicial já aplicada em `prisma/migrations/`
- Estrutura de diretórios definida: `src/app/(public)/`, `src/app/(admin)/`, `src/app/api/`, `src/components/{ui,three,animations,registry}/`
- Zustand store em `src/store/registry.ts` — scaffolado para filtros de presentes
- Tipos base em `src/types/index.ts`: GiftCategory, PaymentMethod, GiftFilters
- Singleton Prisma em `src/lib/prisma.ts` com adapter SQLite
- `.env` com `DATABASE_URL` e `NEXT_PUBLIC_PIX_KEY`

**Do UX Design (ux-design.md):**
- Design system definido: paleta 12 cores, 4 famílias tipográficas (Cormorant Garamond, EB Garamond, DM Sans, JetBrains Mono)
- Motion tokens documentados: durations (fast 150ms, base 300ms, slow 600ms, scenic 1200ms), easings
- Wireframes aprovados para: Hero, Nossa História, Itinerário, RSVP Wizard (4 steps), Bento Grid, Admin (Dashboard, Convidados, Presentes, Itinerário, Config)
- Responsive: mobile-first, breakpoints sm(640) / md(768) / lg(1024) / xl(1280) / 2xl(1536)
- Performance budget: Canvas R3F pausa com IntersectionObserver, Lenis smooth scroll sincronizado com GSAP
- Componentes UI catalogados: Button (variants: primary, ghost, outline), Input, Select, Modal, Toast, Badge, ProgressBar, FilterPanel, BentoCard, GiftModal, RSVPStep
- Admin: sidebar nav, DataTable, StatCard, URLScrapeInput, EventForm, GuestForm

### FR Coverage Map

| FR | Epic | Descrição |
|----|------|-----------|
| FR-1.1 | Epic 2 | Hero 3D com R3F + countdown reativo |
| FR-1.2 | Epic 7 | Mini-jogo side-scroller (opcional) |
| FR-1.3 | Epic 2 | Nossa História com ScrollTrigger |
| FR-2.1 | Epic 3 | RSVP Wizard 4 steps |
| FR-2.2 | Epic 3 | Agrupamento familiar automático |
| FR-2.3 | Epic 3 | Itinerário com filtro VIP |
| FR-3.1 | Epic 4 | Scraping de URLs |
| FR-3.2 | Epic 4 | Bento Grid assimétrica |
| FR-3.3 | Epic 4 | Filtros de faceta client-side |
| FR-3.4 | Epic 4 | Group Gifting com progress bar |
| FR-3.5 | Epic 4 | Guest Checkout sem senha |
| FR-3.6 | Epic 4 | PIX QR Code zero-fee |
| FR-4.1 | Epic 5 | Auth admin (session cookie) |
| FR-4.2 | Epic 5 | Dashboard com métricas |
| FR-4.3 | Epic 6 | CRUD Convidados |
| FR-4.4 | Epic 6 | CRUD Presentes |
| FR-4.5 | Epic 6 | CRUD Itinerário |
| FR-4.6 | Epic 6 | Configurações do site |

---

## Epic List

### Epic 1: Fundação & Design System
Estabelecer a infraestrutura base, design system e componentes reutilizáveis
que permitirão implementação rápida das features públicas e admin.
**FRs covered:** Setup Next.js, Prisma, SQLite (via CLAUDE.md) · Design tokens · Componentes UI base
**User Outcome:** Stack e design system prontos para todas as features

### Epic 2: Hero 3D & Nossa História
Criar a experiência imersiva inicial que encanta o convidado ao chegar no site
e permite conhecer a história do casal através de timeline interativa.
**FRs covered:** FR-1.1, FR-1.3
**User Outcome:** Convidado experimenta Hero 3D reativo e descobre cronologia do casal via scrolling

### Epic 3: Itinerário Interativo & RSVP Wizard
Disponibilizar o itinerário do casamento com lógica de visibilidade VIP
e formulário intuitivo de confirmação de presença com suporte a grupos familiares.
**FRs covered:** FR-2.1, FR-2.2, FR-2.3
**User Outcome:** Convidado vê seu itinerário personalizado e confirma presença (+ acompanhantes) em 2 min

### Epic 4: Lista de Presentes Universal & Contribuições PIX
Agregar presentes de qualquer loja (via scraping) em uma galeria elegante
com filtros, financiamento coletivo e pagamento PIX zero-fee.
**FRs covered:** FR-3.1, FR-3.2, FR-3.3, FR-3.4, FR-3.5, FR-3.6
**User Outcome:** Convidado navega Bento Grid, filtra por categoria/preço, contribui para present em ≤ 3 cliques via PIX

### Epic 5: Admin — Autenticação & Dashboard
Criar painel seguro de acesso dos noivos com autenticação e métricas
em tempo real sobre confirmações e contribuições.
**FRs covered:** FR-4.1, FR-4.2
**User Outcome:** Noivos fazem login seguro e veem dashboard com KPIs (% RSVPs, total contribuído, últimos RSVPs)

### Epic 6: Admin — Gestão Completa de Convidados & Presentes
Permitir que noivos gerenciem cadastro de convidados, presentes
(com auto-scraping), itinerário e configurações gerais do site.
**FRs covered:** FR-4.3, FR-4.4, FR-4.5, FR-4.6
**User Outcome:** Noivos fazem CRUD completo via painel intuitivo; presentes salvos auto via URL

### Epic 7: Gamificação & Otimizações de Performance
Implementar mini-jogo side-scroller opcional para maior engajamento
e otimizar carregamento (Draco, IntersectionObserver, pausas GSAP).
**FRs covered:** FR-1.2, NFR-1, NFR-2
**User Outcome:** Site carrega em < 1,5s com Lighthouse 90+; convidado pode jogar para revelar data (opcional)

---

## Epic 1: Fundação & Design System

### Story 1.1: Design Tokens Setup (Cores, Tipografia, Spacing)

As a developer,
I want design tokens para cores, fonts, spacing e motion configurados em Tailwind CSS,
So that todo o projeto use consistentemente a paleta "Aquarela em Movimento".

**Acceptance Criteria:**

**Given** o projeto Next.js está scaffolado com Tailwind CSS v4
**When** eu edito `tailwind.config.ts`
**Then** os seguintes tokens estão disponíveis como Tailwind utilities:
  - 12 cores nomeadas (periwinkle, cornflower, navy-deep, ice-blue, sky-wash, parchment, charcoal, stone, pearl, dust, sage, blush, amber, gold-leaf)
  - Font families (cormorant-garamond, eb-garamond, dm-sans, jetbrains-mono)
  - Spacing scale (0, 4, 8, 12, 16, 24, 32, 48, 64px)
  - Border radius (sm: 4px, md: 8px, lg: 12px, xl: 16px)

**And** quando uso `className="bg-periwinkle text-navy-deep font-cormorant"`
**Then** o CSS renderiza com as cores e fontes corretas

**And** Google Fonts estão importadas via `next/font` em layout.tsx
**Then** as famílias Cormorant Garamond, EB Garamond e DM Sans carregam sem layout shift (font-display: swap)

**And** quando rodo `npm run build`
**Then** não há erros de TypeScript para esses tokens

### Story 1.2: Global Layout & Typography System

As a developer,
I want um layout global com tipografia responsiva e espaçamento consistente,
So that todas as páginas herdam a estrutura visual base do design system.

**Acceptance Criteria:**

**Given** os design tokens estão configurados (Story 1.1)
**When** eu visito `src/app/layout.tsx`
**Then** ele inclui:
  - Import de todas as 4 famílias tipográficas via next/font
  - CSS globais definindo linha-base (body { font-family: dm-sans, line-height: 1.6, color: charcoal })
  - CSS custom properties para motion durations (--duration-fast: 150ms, --duration-base: 300ms, --duration-slow: 600ms)
  - Meta tags (viewport, charset utf-8, color-scheme light/dark)
  - Classe `overflow-x-hidden` no html para evitar scroll horizontal

**And** quando visito qualquer página via browser
**Then** tipografia carrega sem FOUT (Flash of Unstyled Text) e sem layout shift

**And** quando inspeciono elementos em mobile (375px), tablet (768px) e desktop (1280px)
**Then** tipografia base escala fluidamente via clamp() sem quebras de layout
  - Body: clamp(16px, 1.25vw, 18px)
  - H2: clamp(28px, 5vw, 48px)
  - H3: clamp(20px, 4vw, 32px)

**And** quando inspeciono a página
**Then** há uma CSS custom property para transições default (transition: all var(--duration-base) ease-in-out)

### Story 1.3: Animation Infrastructure (GSAP + Lenis + ScrollTrigger)

As a developer,
I want GSAP, ScrollTrigger e Lenis inicializados globalmente e sincronizados,
So that scroll-triggered animations funcionem em todo o site sem duplicação ou conflitos.

**Acceptance Criteria:**

**Given** o layout global está pronto (Story 1.2)
**When** eu criei um Client Component wrapper `AnimationProvider.tsx`
**Then** no useEffect:
  - GSAP é importado de "gsap"
  - ScrollTrigger é importado e registrado com gsap.registerPlugin(ScrollTrigger)
  - Lenis é instanciado com { smoothWheel: true, wheelMultiplier: 1 }
  - Lenis.on('scroll', ScrollTrigger.update) sincroniza smooth scroll

**And** quando eu visito a página e faço scroll
**Then** o movimento é suave (não jerky) e sem travamentos em mobile

**And** quando uso ScrollTrigger.create({ trigger, animation }) em qualquer componente
**Then** as animações de scroll funcionam sem conflitos ou duplicate registrations

**And** quando inspeciono console sem erros
**Then** não há "gsap is not defined" nem "ScrollTrigger.create is not a function"

**And** quando faço scroll rápido e volto
**Then** animations resetam e sincronizam corretamente (não ficam "travadas" em meio animation)

### Story 1.4: Base UI Component Library

As a developer,
I want componentes UI reutilizáveis base (Button, Input, Modal, Badge, ProgressBar),
So that Features 2-7 podem ser construídas rapidamente com componentes já estilizados e acessíveis.

**Acceptance Criteria:**

**Given** design tokens e layout global estão prontos (Stories 1.1, 1.2)
**When** eu visito `src/components/ui/`
**Then** existem os seguintes arquivos com componentes exportados:
  - Button.tsx (variants: primary, ghost, outline, disabled, loading states)
  - Input.tsx (types: text, email, password com focus/error states)
  - Select.tsx (dropdown nativo com ARIA labels)
  - Modal.tsx (backdrop + content + close button com animations)
  - Badge.tsx (cores variáveis, tamanho variável)
  - ProgressBar.tsx (SVG path animável com GSAP)
  - Card.tsx (container base com padding padrão)

**And** quando uso `<Button variant="primary" size="lg">Confirmar</Button>`
**Then** renderiza:
  - Background: bg-cornflower-500
  - Text: text-pearl
  - Padding: px-6 py-3 (tamanho lg)
  - Border-radius: rounded-md (8px)
  - Hover state: hover:bg-cornflower-600 (darkened)
  - Disabled state: opacity-50 cursor-not-allowed pointer-events-none
  - Sem erros TypeScript (props bem tipadas)
  - Transição suave via var(--duration-base)

**And** quando uso `<Input type="email" placeholder="seu@email.com" />`
**Then** renderiza:
  - Padding: px-4 py-2
  - Border: 1px solid dust
  - Focus: ring-2 ring-periwinkle focus:border-periwinkle
  - Placeholder color: stone
  - Font: dm-sans 16px
  - Sem autocomplete visual glitches em mobile

**And** quando visito em mobile touchscreen
**Then** todos os interactive elements são ≥ 48×48px para toque confortável

**And** quando testo com keyboard navigation (Tab)
**Then** todos os componentes têm focus ring visível e são navegáveis
  - Buttons: tab-able, Enter dispara onClick
  - Inputs: tab-able, Enter submete se em form
  - Selects: tab-able, Arrow keys abrem/navegam opções

**And** quando inspeciono código
**Then** componentes têm ARIA labels apropriados (role, aria-label, aria-describedby quando necessário)

---

## Epic 2: Hero 3D & Nossa História

### Story 2.1: Hero Scene com React Three Fiber & Partículas

As a user (guest arriving at site),
I want ver uma cena 3D imersiva com partículas animadas e o nome do casal flutuando,
So that sinto encantamento imediato ao chegar no site (FR-1.1).

**Acceptance Criteria:**

**Given** o componente Hero page é renderizado
**When** a página carrega
**Then** uma cena R3F é exibida com:
  - Canvas fullscreen (100vh) com background gradient (sky-wash → parchment)
  - Partículas (50-100 esferas pequenas) com gravidade leve caindo de cima
  - Nome do casal ("Luiza & Lucas") em Cormorant Garamond 72px, italic, white, centered
  - Overlay aquarela SVG animado (rgba(107,127,212,0.15)) como background

**And** quando movo mouse no desktop
**Then** a cena reage:
  - Camera orbita levemente seguindo mouse
  - Partículas são atraídas/repelidas pela posição do mouse (simulação de force)

**And** quando acesso em mobile
**Then** a cena reage:
  - Giroscópio (se disponível) controla camera rotation
  - Touch não ativa forças de atração (gravidade simples apenas)
  - Layout é responsivo: texto escala para 48px em mobile

**And** quando scrolo para baixo
**Then** a cena fade out suavemente enquanto a próxima seção (countdown) fade in

**And** quando inspeciono performance
**Then** canvas renderiza a 60fps sem causar thermal throttling em mobile
  - Particle count é otimizado (máx 100)
  - Material é simples (meshBasicMaterial, não shaders complexos)

### Story 2.2: Countdown Regressivo

As a user (guest),
I want ver um countdown regressivo até 16/05/2026,
So that vejo quanto tempo falta para o casamento (parte de FR-1.1).

**Acceptance Criteria:**

**Given** o Hero está carregado
**When** a página renderiza
**Then** o countdown é exibido abaixo do nome do casal com:
  - Formato: "DD dias · HH horas · MM minutos · SS segundos"
  - Tipografia: EB Garamond 24px, color charcoal
  - Background: semi-transparente (rgba(248,245,240,0.8)) com padding

**And** quando o tempo passa (a cada segundo)
**Then** os números atualizam em tempo real
  - Transição suave de números via CSS fade ou GSAP

**And** quando a data chega em 16/05/2026 00:00
**Then** o countdown muda para "🎉 O grande dia chegou!"
  - Cor: gold-leaf
  - Animation: pulse ou bounce suave

**And** quando testo em diferentes timezones
**Then** a data/hora está correta (usa horário local do browser)

### Story 2.3: Nossa História — Timeline com ScrollTrigger

As a user (guest),
I want ver a história do casal em uma timeline visual e interativa,
So that conheço a cronologia do relacionamento de forma engajante (FR-1.3).

**Acceptance Criteria:**

**Given** o countdown foi scrollado para baixo
**When** a seção "Nossa História" entra no viewport
**Then** uma timeline vertical é renderizada com:
  - Eixo central (linha vertical cinza)
  - 4-6 eventos datados (ex: "Tinder - 2019", "Primeiro encontro - 2019", "Pedido - 2024", etc.)
  - Cada evento tem: data, foto, descrição curta, positioned alternadamente (left/right)

**And** quando faço scroll através da timeline
**Then** via ScrollTrigger:
  - Foto transiciona de blur(10px) para blur(0px) quando entra no viewport
  - Texto slide-in de opacidade 0 para 1
  - Linha de progresso preenchida gradually (SVG stroke-dashoffset animation)
  - Micro-animações ocorrem ao timing exato do scroll

**And** quando testo em mobile (375px)
**Then** timeline é single-column (sem alternância left/right)
  - Eventos stacked verticalmente
  - Fotos scaled para 60vw max

**And** quando pausei scroll mid-animation
**Then** a cena congela no exato frame da animação (não pula)

**And** quando inspecting accessibility
**Then** eventos têm heading tags (h3) e descrições em parágrafos semânticos
  - Screen readers podem ler a timeline sequencialmente

---

## Epic 3: Itinerário Interativo & RSVP Wizard

### Story 3.1: Itinerário Public Page com Eventos Condicionados

As a guest,
I want ver o itinerário do casamento com eventos públicos e privados (VIP-only),
So that sei exatamente o cronograma do dia (FR-2.3).

**Acceptance Criteria:**

**Given** eu acesso /itinerario como guest não-autenticado
**When** a página carrega
**Then** são exibidos eventos públicos:
  - Cerimônia (16:00)
  - Coquetel (17:30)
  - Festa (19:00)
  Cada evento mostra: horário, local (endereço + Google Maps embed), descrição

**And** quando inspeciono o DOM
**Then** eventos VIP (Jantar de Ensaio, Despedida) NÃO estão presentes no HTML

**And** quando acesso como VIP (isVip=true no token/session)
**When** a página carrega
**Then** TODOS os eventos são visíveis, incluindo:
  - Jantar de Ensaio (14:00 - VIP only)
  - Despedida (após festa - VIP only)

**And** quando visito via mobile
**Then** layout é single-column, eventos empilhados
  - Google Maps embed é responsivo (width: 100%)

**And** quando inspeciono a página com DevTools
**Then** eventos VIP estão ausentes do DOM para guests comuns (não hidden via CSS)

### Story 3.2: RSVP Wizard — Step 1 & 2 (Identificação & Presença)

As a guest,
I want confirmar minha presença através de um wizard de 4 steps,
So that os noivos saibam se vou estar no casamento (parte de FR-2.1).

**Acceptance Criteria:**

**Given** eu clico "Confirmar Presença" na página
**When** o RSVP Wizard abre (modal ou nova página)
**Then** Step 1 é exibido com:
  - Campo Input: email (type="email", placeholder="seu@email.com")
  - Botão "Próximo" (disabled até email válido)
  - Mensagem: "Qual é seu email? Nós vamos usar para confirmar sua presença."

**And** quando digito um email inválido (ex: "oi")
**Then** o botão Próximo fica disabled e aparece mensagem de erro vermelha

**And** quando digito um email válido (ex: "maria@email.com")
**Then** o botão Próximo fica enabled, texto do botão muda cor para Cornflower

**And** quando clico Próximo
**Then** via Framer Motion, Step 1 fade-out + Step 2 fade-in (transição suave)
**Then** Step 2 é exibido com:
  - Pergunta: "Você virá ao casamento?"
  - 2 botões: "Sim, com prazer!" (primary), "Infelizmente, não posso" (ghost)
  - Mensagem de contexto abaixo

**And** quando clico "Sim, com prazer!"
**Then** o backend verifica se email existe na tabela Guest via API /api/rsvp
**Then** Step 2 fade-out + Step 3 fade-in

**And** quando clico "Infelizmente, não posso"
**Then** a presença é marcada como false, e Step 2 fade-out + Step 4 (confirmação final) fade-in

**And** quando digito enter em um input
**Then** não submete o form, apenas passa para o próximo step

### Story 3.3: RSVP Wizard — Step 3 (Acompanhantes & Restrições)

As a guest with family members,
I want indicar meus acompanhantes e restrições alimentares,
So that os noivos conseguem preparar o evento corretamente (FR-2.2).

**Acceptance Criteria:**

**Given** I clicked "Sim" in Step 2
**When** Step 3 loads
**Then** página exibe:
  - Pergunta: "Você virá acompanhado?"
  - Se meu grupo familiar tem 1 membro (apenas eu): checkbox "Confirmo minha presença"
  - Se meu grupo tem 2+ membros: checkboxes para cada membro (ex: "Maria da Silva", "João da Silva")
  - Campo de text-area: "Restrições alimentares? (alergias, vegetariano, etc.)"

**And** quando clico em checkboxes de acompanhantes
**Then** cada checkbox pode ser independentemente checked/unchecked
  - Estado é armazenado no React state, não é persisted até Step 4

**And** quando digito no campo de restrições
**Then** o texto é armazenado no state (máx 200 caracteres)

**And** quando clico "Próximo"
**Then** validação: pelo menos 1 membro deve estar checked
**Then** se validação passa: Step 3 fade-out + Step 4 fade-in

**And** quando volto ("Voltar") de Step 3 para Step 2
**Then** os dados de Step 3 são preservados se eu clicar "Próximo" novamente

### Story 3.4: RSVP Wizard — Step 4 (Confirmação Final)

As a guest,
I want revisar meus dados e confirmar minha presença,
So that tenho certeza de que tudo foi registrado corretamente (final de FR-2.1).

**Acceptance Criteria:**

**Given** I completed Steps 1-3
**When** Step 4 loads
**Then** exibe resumo:
  - Email: maria@email.com
  - Presença: Sim
  - Acompanhantes: Maria, João
  - Restrições: Vegetariana
  - Botão grande: "Confirmar" (primary color)
  - Botão menor: "Voltar e editar"

**And** quando clico "Confirmar"
**Then** via POST /api/rsvp, os dados são salvos no banco:
  - Insere/atualiza Rsvp { guestId, confirmed: true, createdAt }
  - Insere Attendee para cada acompanhante checked
  - Insere/atualiza dietary restrictions
**Then** loading spinner aparece por 1-2s

**And** quando a resposta é 201 Created
**Then** Step 4 transiciona para "Obrigado!" screen com:
  - Ícone checkmark (verde/sage color)
  - Texto: "Sua presença foi confirmada! Vamos nos ver em 16 de maio. 🎉"
  - Botão: "Voltar ao site"

**And** quando clico "Voltar ao site"
**Then** o modal fecha e retorno à página de itinerário

**And** quando a resposta é 400 Bad Request (email não encontrado)
**Then** erro é exibido em Step 1 com mensagem: "Email não encontrado. Verifique os dados ou entre em contato."

---

## Epic 4: Lista de Presentes Universal & Contribuições PIX

### Story 4.1: URL Scraping Backend para Adicionar Presentes

As a bride/groom (admin),
I want adicionar presentes de qualquer loja inserindo uma URL,
So that a lista agregua presentes de múltiplas fontes (FR-3.1).

**Acceptance Criteria:**

**Given** eu estou no Admin Dashboard > Gerenciar Presentes
**When** clico botão "Adicionar Presente via URL"
**Then** um modal abre com:
  - Input campo: "Cole a URL do produto"
  - Botão: "Buscar dados"
  - Loading state: "Buscando..."

**And** quando digito uma URL válida (ex: amazon.com.br/dp/B07...)
**When** clico "Buscar dados"
**Then** backend rota POST /api/admin/gifts/scrape executa:
  - Faz fetch da URL
  - Usa cheerio para parsear HTML
  - Extrai og:title, og:image, og:price (ou price schema)
  - Retorna { title, imageUrl, price, description }

**And** quando a scrape é bem-sucedida
**Then** modal atualiza com preview:
  - Imagem do produto
  - Título: "[Produto Name]"
  - Preço: "R$ XXX,XX"
  - Campo de categoria: select dropdown (Cozinha, Quarto, Aventuras, etc.)
  - Checkbox: "Este é um present coletivo? (Group Gift)"
  - Se checked, campo "Meta de arrecadação": R$ 5000 (exemplo)
  - Botão: "Salvar Presente"

**And** quando clico "Salvar Presente"
**Then** via POST /api/admin/gifts, um GiftItem é criado:
  - title, imageUrl, price, category, isGroupGift, targetAmount
  - Admin que criou é armazenado em createdBy
**Then** modal fecha e presente aparece na lista

**And** quando a URL é inválida ou scrape falha
**Then** erro "Não consegui buscar dados dessa URL. Verifique se é um produto válido."

**And** quando testo com URLs de:
  - Amazon Brasil
  - Loja local customizada
  - Air BnB
  - Pinterest
**Then** scraping funciona para og:tags padrão

### Story 4.2: Bento Grid de Presentes (Galeria Responsiva)

As a guest,
I want ver uma galeria bonita de presentes em estilo Bento Box,
So that consigo navegar de forma visualmente agradável (FR-3.2).

**Acceptance Criteria:**

**Given** eu acesso a página /presentes
**When** a página carrega
**Then** presentes são exibidos em CSS Grid com layout assimétrico (Bento):
  - Presentes com isGroupGift=true ou price > R$1000: tiles 2×2 (maiores)
  - Presentes normais: tiles 1×1 (menores)
  - Grid responsivo: 1 coluna (mobile) → 2 cols (tablet) → 3-4 cols (desktop)

**And** cada tile mostra:
  - Imagem do produto (cover, aspect-ratio 1:1)
  - Overlay ao hover: título truncado em 2 linhas
  - Badge inferior: preço (R$ 500) + categoria (Cozinha)
  - Se group gift: "VAQUINHA" badge com cor gold-leaf

**And** quando visito em mobile (375px)
**Then** grid é single-column com full width

**And** quando visito em tablet (768px)
**Then** grid é 2 colunas

**And** quando visito em desktop (1280px)
**Then** grid é 3-4 colunas, tiles grandes intercaladas com pequenas

**And** quando hover em um tile
**Then** image escurece levemente (opacity 0.8) + shadow cresce

**And** quando clico em um tile
**Then** abre GiftModal (Story 4.4)

### Story 4.3: Filtros de Faceta Client-Side

As a guest,
I want filtrar presentes por categoria, preço e status,
So that encontro presentes dentro do meu orçamento rapidamente (FR-3.3).

**Acceptance Criteria:**

**Given** página /presentes está carregada
**When** a página renderiza
**Then** à esquerda (desktop) ou no topo (mobile) há um painel de filtros com:
  - Categoria (checkboxes): Cozinha, Quarto, Aventuras, Lua de Mel, Tradições do Casal, Experiências
  - Faixa de Preço (radio buttons): < R$100 | R$100-R$300 | > R$300
  - Status (toggle): Mostrar apenas disponíveis (default checked)
  - Ordenação (select): Mais desejados | Preço (crescente) | Preço (decrescente) | Recém adicionados

**And** quando clico em um checkbox de categoria
**Then** a grid atualiza INSTANTANEAMENTE (sem reload) filtrando items
  - Usa Zustand store para estado de filtros
  - Array.filter() re-renderiza bento grid

**And** quando seleciono faixa de preço
**Then** grid atualiza, mostrando apenas itens na faixa

**And** quando toggle "Mostrar apenas disponíveis"
**Then** itens com "Recebido" (received=true) desaparecem

**And** quando seleciono ordenação
**Then** bento grid re-ordena mantendo layout assimétrico

**And** quando combino múltiplos filtros (ex: "Cozinha" + "> R$300")
**Then** lógica AND é aplicada: mostra apenas cozinha E acima de R$300

**And** quando clico "Limpar filtros"
**Then** todos os filtros resetam para default (nenhum categoria selecionada, todas as faixas visíveis)

**And** quando testo em mobile
**Then** painel de filtros é colapsável (burger menu / accordion)

### Story 4.4: Gift Modal com Detalhes e Contribuição

As a guest,
I want ver detalhes de um presente e contribuir para ele,
So that posso decidir quanto quero dar (FR-3.4, FR-3.5).

**Acceptance Criteria:**

**Given** eu cliquei em um tile da bento grid
**When** o GiftModal abre
**Then** mostra:
  - Imagem grande do produto
  - Título e descrição do produto
  - Preço (R$ 500) ou Meta (se group gift: "Meta: R$ 5000")
  - Se group gift: barra de progresso SVG mostrando raisedAmount/targetAmount
  - Badge: "Disponível" (verde) ou "Recebido" (cinza)
  - Se received: "Este presente foi recebido. Obrigado!"

**And** quando é um grupo gift
**Then** a barra de progresso mostra:
  - Porcentagem preenchida (ex: 60% of R$5000 = R$3000)
  - Número: "R$ 3.000 de R$ 5.000 (60%)"
  - Animação GSAP: barra se preenche smoothly quando modal abre

**And** quando clico "Contribuir"
**Then** aparece campo de input:
  - "Quanto você gostaria de contribuir?"
  - Input number (ex: 100.00)
  - Botão "Ir para PIX" (primary)
  - Botão "Voltar" (ghost)

**And** quando digito um valor e clico "Ir para PIX"
**Then** (Story 4.6 — PIX modal) abre

**And** quando o presente já foi recebido (received=true)
**Then** o botão "Contribuir" está disabled
  - Texto: "Este presente já foi recebido"

**And** quando clico X para fechar o modal
**Then** modal fecha com fade-out animation

### Story 4.5: Guest Checkout sem Cadastro (Email + localStorage)

As a guest,
I want contribuir para um presente informando apenas nome e email,
So that não preciso criar conta e senha (FR-3.5).

**Acceptance Criteria:**

**Given** eu estou no GiftModal e digitei um valor (ex: R$ 100)
**When** clico "Ir para PIX"
**Then** um checkout modal abre com:
  - Campo: "Seu Nome" (text input)
  - Campo: "Seu Email" (email input)
  - Resumo: "Presente: [Nome] · Valor: R$ 100"
  - Botão: "Gerar QR Code PIX" (primary)
  - Botão: "Cancelar"

**And** quando digito nome "Maria da Silva" e email "maria@email.com"
**When** clico "Gerar QR Code PIX"
**Then** os dados são armazenados em localStorage:
  - localStorage['rsvp_guest'] = { name: "Maria da Silva", email: "maria@email.com" }
  - localStorage['rsvp_contribution'] = { giftId: 123, amount: 100 }
**Then** (Story 4.6) PIX Modal abre

**And** quando o browser fecha e reabro a página
**Then** localStorage persiste os dados (não preciso re-digitar email até fazer contribuição)

**And** quando faço refresh da página
**Then** os dados de sessão permanecem no localStorage

**And** quando clico "Cancelar"
**Then** o checkout modal fecha sem salvar dados

**And** quando envio dados inválidos (email sem @)
**Then** erro é exibido: "Email inválido"

### Story 4.6: PIX QR Code Modal (Zero-Fee)

As a guest,
I want ver um QR Code PIX e enviar dinheiro sem intermediários,
So that 100% da minha contribuição vai para os noivos (FR-3.6).

**Acceptance Criteria:**

**Given** eu digitei nome e email no checkout (Story 4.5)
**When** clico "Gerar QR Code PIX"
**Then** PIX Modal abre exibindo:
  - Texto: "Escaneie o QR Code com seu banco"
  - Código QR (imagem) gerado dinamicamente do QR Code PIX dos noivos
  - Abaixo: "ou copie a chave"
  - Botão: "Copiar Chave PIX" (com ícone de copy)
  - Caixa de texto legível: a chave PIX em branco com fundo light-gray
  - Botão: "Confirmar Pagamento" (primary)
  - Botão: "Cancelar"

**And** quando clico no QR Code
**Then** ele abre no app bancário do usuário (deep link PIX) se disponível
  - Ou abre um modal de instruções "Como pagar via PIX"

**And** quando clico "Copiar Chave PIX"
**Then** a chave é copiada para clipboard
  - Toast aparece: "✓ Chave copiada!"

**And** quando faço a transferência PIX para a chave dos noivos
**Then** (após ~3-5 segundos) o backend recebe webhook do banco
**Then** GiftContribution é criada:
  - giftId, amount, guestName, guestEmail, status: "completed"
  - contributedAt timestamp
**Then** barra de progresso do gift atualiza em tempo real (Server-Sent Events ou polling)

**And** quando clico "Confirmar Pagamento"
**Then** GiftContribution é marcada como "confirmed" e modal exibe:
  - "✓ Contribuição confirmada!"
  - "Muito obrigado! Seu presente foi recebido."
  - Botão: "Voltar aos presentes"

**And** quando clico "Voltar aos presentes"
**Then** modal fecha e retorno à página /presentes
  - Bento grid mostra barra de progresso atualizada (se foi group gift)

**And** quando envio para um PIX inválido
**Then** erro é exibido e posso tentar novamente

---

## Epic 5: Admin — Autenticação & Dashboard

### Story 5.1: Admin Login Page

As a bride/groom (Lucas/Luiza),
I want fazer login no painel admin com email e senha,
So that acesso a ferramenta de gestão (FR-4.1).

**Acceptance Criteria:**

**Given** eu acesso /admin/login
**When** a página carrega
**Then** um formulário é exibido com:
  - Cabeçalho: "Painel de Administração — Aeterna"
  - Campo: "Email" (type="email")
  - Campo: "Senha" (type="password")
  - Botão: "Entrar" (primary, inicialmente disabled até preencher os 2 campos)
  - Link: "Esqueci minha senha" (para future password reset)

**And** quando clico em um campo
**Then** focus ring é visível (ring-2 ring-periwinkle)

**And** quando digito email inválido (ex: "oi")
**Then** mensagem de erro: "Email inválido"
**Then** botão Entrar fica disabled

**And** quando digito email válido e senha
**Then** botão Entrar fica enabled

**And** quando clico "Entrar"
**Then** via POST /api/admin/login:
  - Backend verifica email/senha contra tabela Admin (ou User com role=admin)
  - Se correto: cria session cookie (httpOnly, secure, sameSite)
  - Redirect para /admin/dashboard
  - Loading spinner aparece por 1-2s

**And** quando credenciais estão incorretas
**Then** erro genérico: "Email ou senha inválidos"
  - Nenhuma dica qual campo está errado (segurança)

**And** quando testo em mobile
**Then** formulário é full-width com padding confortável

**And** quando clico/toco Entrar via Enter key
**Then** form é submetido (não requer clique no botão)

### Story 5.2: Admin Dashboard com KPIs

As a bride/groom,
I want ver um dashboard com métricas em tempo real sobre RSVPs e presentes,
So that acompanho o progresso do casamento (FR-4.2).

**Acceptance Criteria:**

**Given** eu estou autenticado (Story 5.1 completo) e acesso /admin/dashboard
**When** a página carrega
**Then** um dashboard é exibido com layout:
  - Sidebar esquerda (navegação) — sticky
  - Main content area (métricas)

**Then** exibe 4 StatCards (cartões de métrica) em primeira linha:
  - Total de Convidados: "87 convidados"
  - RSVPs Confirmadas: "64 (73.6%)" em verde
  - RSVPs Recusadas: "12 (13.8%)" em vermelho
  - RSVPs Pendentes: "11 (12.6%)" em amarelo

**And** quando clico em um StatCard
**Then** posso navegar para a tela correspondente (ex: "Total de Convidados" → /admin/guests)

**Then** segunda seção exibe "Últimas RSVPs" com tabela:
  - Colunas: Nome | Email | Presença | Data
  - Últimos 10 RSVPs ordenados por data decrescente

**And** terceira seção exibe "Presentes — Progresso":
  - Contador: "42 presentes catalogados"
  - Barra de progresso: "Presentes recebidos: 18/42 (42.8%)"
  - Resumo: "Total arrecadado em group gifts: R$ 12.340"

**And** quando a página carrega
**Then** dados são fetchados via GET /api/admin/metrics
**Then** dashboard atualiza a cada 30 segundos com dados frescos (polling)

**And** quando clico no Sidebar
**Then** posso navegar para: Convidados | Presentes | Itinerário | Configurações | Logout

**And** quando clico "Logout"
**Then** session é destruída (DELETE /api/admin/logout)
**Then** redirect para /admin/login

---

## Epic 6: Admin — Gestão Completa de Dados

### Story 6.1: CRUD Convidados (Add, Edit, Delete, Toggle VIP)

As a bride/groom,
I want gerenciar a lista de convidados (adicionar, editar, remover, marcar VIPs),
So that tenho controle total sobre quem é convidado (FR-4.3).

**Acceptance Criteria:**

**Given** eu estou em /admin/guests
**When** a página carrega
**Then** exibe tabela com colunas:
  - Nome | Email | Grupo | isVIP (toggle) | Ações (Edit, Delete)
  - Todos os 87 convidados listados, paginados (10 por página)

**And** botão no topo: "+ Adicionar Convidado"
**When** clico nele
**Then** um modal abre com:
  - Input: Nome
  - Input: Email
  - Select: Grupo Familiar (ex: "Silva", "Santos", cria novo se não existir)
  - Toggle: "Marcar como VIP"
  - Botão: "Salvar"

**And** quando preencho dados e clico "Salvar"
**Then** POST /api/admin/guests cria novo Guest record
**Then** tabela atualiza e novo convidado aparece

**And** quando clico Edit em um convidado
**Then** um modal abre pré-preenchido com dados atuais
**Then** posso editar nome, email, grupo, toggle VIP
**Then** PUT /api/admin/guests/{id} atualiza o record
**Then** tabela re-renderiza

**And** quando clico Delete
**Then** um modal de confirmação aparece: "Tem certeza?"
**When** confirmo
**Then** DELETE /api/admin/guests/{id} remove o convidado
**Then** tabela atualiza

**And** quando clico toggle VIP de um convidado
**Then** PATCH /api/admin/guests/{id} { isVip: true/false }
**Then** toggle muda cor (gold quando true, cinza quando false)

**And** quando a tabela tem muitos convidados
**Then** posso usar input de busca para filtrar por nome/email

### Story 6.2: CRUD Presentes (com Auto-Scraping de URL)

As a bride/groom,
I want gerenciar presentes (adicionar via URL, editar, remover, marcar recebido),
So that controlo a lista de presentes dinamicamente (FR-4.4).

**Acceptance Criteria:**

**Given** eu estou em /admin/gifts
**When** a página carrega
**Then** exibe tabela:
  - Imagem (thumbnail) | Título | Categoria | Preço | Recebido (toggle) | Ações
  - Todos os presentes listados, paginados (8 por página)

**And** botão: "+ Adicionar Presente via URL"
**When** clico
**Then** modal scraping abre (ver Story 4.1)

**And** quando o presente foi scrapeado com sucesso
**Then** posso editar antes de salvar:
  - Categoria: select dropdown
  - isGroupGift: toggle (se true, campo "Meta: R$ ___")
  - Botão: "Salvar Presente"

**And** quando clico Edit em um presente
**Then** modal abre com campos editáveis:
  - Título | Categoria | Preço | isGroupGift toggle | targetAmount
  - Botão: "Atualizar"

**When** clico "Atualizar"
**Then** PUT /api/admin/gifts/{id} atualiza
**Then** tabela re-renderiza

**And** quando clico toggle "Recebido"
**Then** PATCH /api/admin/gifts/{id} { received: true/false }
**Then** item desaparece da bento grid de convidados (só visível se received=false)

**And** quando clico Delete
**Then** confirmação: "Tem certeza?"
**When** confirmo: DELETE /api/admin/gifts/{id}
**Then** tabela atualiza

**And** quando visualizo um gift que é group gift
**Then** vejo coluna adicional: "Arrecadado" (ex: "R$ 3.000 / R$ 5.000 (60%)")

### Story 6.3: CRUD Itinerário de Eventos

As a bride/groom,
I want gerenciar eventos do itinerário (adicionar, editar, remover, marcar como VIP-only),
So that controlo a visibilidade de eventos condicionalmente (FR-4.5).

**Acceptance Criteria:**

**Given** eu estou em /admin/itinerary
**When** a página carrega
**Then** lista de eventos é exibida em ordem cronológica:
  - Horário | Evento | Local | isVIPOnly (toggle) | Ações

**And** botão: "+ Adicionar Evento"
**When** clico
**Then** modal abre com:
  - Input: Nome do Evento (ex: "Cerimônia")
  - Input: Data + Hora (datetime picker)
  - Input: Local/Endereço
  - Textarea: Descrição
  - Toggle: "Apenas para VIPs?"
  - Botão: "Salvar"

**And** quando preencho e clico "Salvar"
**Then** POST /api/admin/events cria Event record
**Then** lista atualiza, evento aparece em ordem cronológica

**And** quando clico Edit em um evento
**Then** modal pré-preenchido abre
**When** edito campos e clico "Atualizar"
**Then** PUT /api/admin/events/{id} atualiza
**Then** lista re-renderiza

**And** quando clico Delete + confirmação
**Then** DELETE /api/admin/events/{id}
**Then** evento some da lista

**And** quando clico toggle "Apenas para VIPs?"
**Then** PATCH /api/admin/events/{id} { isVipOnly: true/false }
**Then** toggle muda cor (gold quando VIP-only)

**And** quando event time já passou
**Then** a linha fica com opacidade 50% (visual de "past event")

### Story 6.4: Configurações do Site (Título, Textos, Chave PIX, Foto)

As a bride/groom,
I want editar configurações gerais do site (textos, imagens, chave PIX),
So that customizo o site com meus dados e da cerimônia (FR-4.6).

**Acceptance Criteria:**

**Given** eu estou em /admin/settings
**When** a página carrega
**Then** um formulário é exibido com seções:

**SEÇÃO 1: Identificação**
  - Input: "Nome do Casal" (ex: "Luiza & Lucas")
  - Input: "Data do Casamento" (date picker, default 16/05/2026)

**SEÇÃO 2: Hero Section**
  - Textarea: "Título do Hero" (ex: "Nós amamos porque ELE nos amou primeiro")
  - Textarea: "Verso Bíblico" (ex: "João 4:19")
  - File upload: "Foto do Casal" (mostra preview)

**SEÇÃO 3: Financeiro**
  - Input: "Chave PIX" (ex: "lucas.luiza@banco.com")
  - Máscara: não mostra full key (segurança)

**SEÇÃO 4: Site**
  - Input: "Título da Página" (HTML <title>)
  - Textarea: "Descrição Meta" (para SEO/social)

**And** quando edito um campo e clico "Salvar"
**Then** PUT /api/admin/settings atualiza as configs
**Then** toast aparece: "✓ Configurações salvas"

**And** quando faço upload de uma foto
**Then** preview aparece, imagem é redimensionada (max 2MB)
**Then** armazenada em /public/uploads/couple.jpg

**And** quando salvo configurações
**Then** as mudanças refletem imediatamente no frontend público:
  - Título do Hero muda
  - Foto do Hero muda
  - Countdown usa nova data

**And** quando testo visibilidade da chave PIX
**Then** a chave NÃO aparece em logs ou DevTools de forma legível

---

## Epic 7: Gamificação & Otimizações de Performance

### Story 7.1: Mini-Jogo Side-Scroller Opcional

As a guest,
I want jogar um mini-jogo para revelar a data do casamento,
So that a experiência é mais engajante e memorável (FR-1.2).

**Acceptance Criteria:**

**Given** o jogo está habilitado no admin (/admin/settings → "Habilitar jogo?")
**When** eu acesso a página Hero
**Then** abaixo do countdown aparece botão: "🎮 Jogar para revelar a data"

**When** clico no botão
**Then** um canvas modal abre com:
  - Personagem vetorial (Lucas ou Luiza, alternado)
  - Cenário side-scroller com obstáculos (pedras)
  - Items colecionáveis (morangos, corações)
  - Controles: Arrow keys (left/right) ou botões touch (mobile)

**And** quando faço o personagem pular com Space bar / up arrow
**Then** física realista (gravidade, bounce)

**And** quando evito obstáculos
**Then** posso andar 100% do mapa sem cair

**And** quando coleto todos os items (ex: 10 morangos)
**Then** um ring (anel de casamento) aparece no final
**When** coleto o ring
**Then** jogo termina

**And** quando o jogo termina
**Then** modal exibe:
  - "🎉 Você desbloqueou a data!"
  - "16 de Maio de 2026"
  - Confete cai (canvas confetti animation)
  - Botão: "Voltar"

**And** quando clico "Voltar"
**Then** modal fecha e retorno à página Hero

**And** quando testo em mobile
**Then** controles são botões touch (left arrow, jump, right arrow)
  - Ou acelerômetro do telefone controla movimento

**And** quando o jogo está deshabilitado no admin
**Then** botão "Jogar" não aparece na página Hero

### Story 7.2: Performance Optimizations (Draco, IntersectionObserver, GSAP Pause)

As a developer,
I want otimizar carregamento e performance para atingir Lighthouse 90+,
So that site carrega rápido em mobile 4G (FR-1.2, NFR-1, NFR-2).

**Acceptance Criteria:**

**Given** eu rodo Lighthouse audit no site
**When** performance é medido
**Then** LCP (Largest Contentful Paint) < 1.5s
**And** FID (First Input Delay) < 100ms
**And** CLS (Cumulative Layout Shift) < 0.1
**And** Lighthouse Score ≥ 90 desktop, ≥ 85 mobile

**And** para atingir essas metas:
  - Modelos 3D (.glb) são comprimidos com Draco (< 2.5MB each)
  - Canvas R3F para Hero usa IntersectionObserver para pausar rendering quando off-screen
  - GSAP animations pausam quando fora do viewport
  - Imagens são lazy-loaded (loading="lazy")
  - Code-splitting: componentes R3F carregam via dynamic() com ssr: false
  - Font subsetting: só carrega caracteres usados (Latin)

**And** quando testo Network Throttling (3G)
**Then** primeiro paint ocorre em < 2s
**Then** site é interativo em < 3s (Time to Interactive)

**And** quando testo em dispositivo mobile real (iPhone 12)
**Then** FCP < 2s
**Then** sem thermal throttling ou overheating

**And** quando inspeciono bundle size
**Then** main.js < 200KB (gzipped)
**Then** chunk para r3f/three < 150KB

**And** quando scrollo rapidamente pela página
**Then** animações GSAP não causam jank (60fps mantido)

---

## Summary

**Total de 7 Epics com 25 Stories criadas:**
- Epic 1: 4 stories (Fundação)
- Epic 2: 3 stories (Hero 3D)
- Epic 3: 4 stories (RSVP Wizard)
- Epic 4: 6 stories (Lista de Presentes)
- Epic 5: 2 stories (Admin Auth)
- Epic 6: 4 stories (Admin Gestão)
- Epic 7: 2 stories (Gamificação)

**Cobertura de FRs:** 100% de FR-1.1 até FR-4.6 mapeadas em stories
**Cobertura de NFRs:** Distribuída entre stories (performance em 7.2, security em 5.1, a11y em 1.4 e 3.x)

Todas as stories seguem formato User Story (As a/I want/So that) com Acceptance Criteria em Given/When/Then.

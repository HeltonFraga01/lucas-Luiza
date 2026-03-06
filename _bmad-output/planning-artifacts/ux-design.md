# UX Design Document — Aeterna
### Luiza & Lucas · 16.05.2026
> *"Nós amamos porque ELE nos amou primeiro." — João 4:19*

**Versão:** 1.0
**Autora:** Sally · UX Designer (BMad Agent)
**Data:** 05 de março de 2026
**Status:** Aprovado para implementação

---

## 1. Identidade Visual & DNA de Design

### 1.1 Leitura do Save the Date

O Save the Date de Luiza e Lucas é uma declaração de intenção estética que deve guiar cada pixel do Aeterna:

| Elemento | Observação | Decisão de Design |
|----------|------------|-------------------|
| **Mancha aquarela** | Blob azul orgânico em fundo texturizado | Hero usa overlay aquarela SVG animado |
| **Tipografia cursiva** | Script fluido para os nomes | Fonte display script para títulos emocionais |
| **Botanicals azuis** | Rosas e folhagens em tons navy/periwinkle | Elementos SVG decorativos nos separadores de seção |
| **Foto do casal** | Clipping em forma orgânica, semi-transparente | Hero background com blend-mode overlay |
| **Verso bíblico** | Subtítulo pequeno, itálico, elegante | Citação recorrente no rodapé e na seção de história |
| **Paleta** | Azul celeste · Periwinkle · Navy · Off-white | Aplicada no design system inteiro |

### 1.2 Conceito Criativo Central

**"Aquarela em Movimento"** — o site deve sentir como folhear um álbum artesanal de luxo que ganhou vida. Cada seção é uma nova página com textura, cada scroll revela um novo capítulo. A 3D não compete com a delicadeza da aquarela — ela a *amplifica*.

### 1.3 Emoção Alvo por Seção

```
Hero          → Encantamento / Suspiro
Nossa História → Cumplicidade / Sorriso
Itinerário    → Antecipação / Clareza
RSVP          → Pertencimento / Facilidade
Presentes     → Generosidade / Alegria
Admin         → Controle / Confiança
```

---

## 2. Design System

### 2.1 Paleta de Cores

```
── PRIMÁRIAS ──────────────────────────────────────
  Periwinkle      #6B7FD4   (azul médio, tom principal)
  Cornflower      #4A6FA5   (azul mais saturado, CTAs)
  Navy Deep       #2C3E6B   (texto escuro, contraste)

── SECUNDÁRIAS ────────────────────────────────────
  Ice Blue        #D6E4F7   (backgrounds suaves)
  Sky Wash        #EBF3FC   (surface cards, modais)
  Parchment       #F8F5F0   (fundo geral, textura papel)

── NEUTROS ────────────────────────────────────────
  Charcoal        #2D2D2D   (texto corpo principal)
  Stone           #6B6B6B   (texto secundário)
  Pearl           #FFFFFF   (branco puro)
  Dust            #E8E5E0   (bordas e divisores)

── FEEDBACK ───────────────────────────────────────
  Sage            #7BAE8A   (sucesso, confirmação RSVP)
  Blush           #E8A0A0   (erro, validação)
  Amber           #D4A843   (aviso, progresso)

── ESPECIAIS ──────────────────────────────────────
  Gold Leaf       #C9A84C   (badges "Mais Desejado", destaques premium)
  Watercolor-1    rgba(107,127,212,0.15)  (overlay hero)
  Watercolor-2    rgba(214,228,247,0.30)  (layer aquarela secundária)
```

### 2.2 Tipografia

```
── DISPLAY (títulos emocionais, nomes do casal) ────
  Font: "Cormorant Garamond" · Italic · weights: 300, 400, 600
  Uso: Hero heading, "Nossa História" títulos, nomes de seção
  Exemplo: "Luiza & Lucas" em 72px / Italic / Light

── SERIF (subtítulos, datas, citações) ──────────────
  Font: "EB Garamond" · weights: 400, 500
  Uso: Subtítulos, datas, labels de evento, citações bíblicas
  Exemplo: "16 de Maio de 2026" em 18px / Regular

── SANS (corpo, UI, formulários) ────────────────────
  Font: "DM Sans" · weights: 300, 400, 500, 600
  Uso: Parágrafos, labels de input, botões, navegação
  Exemplo: "Confirmar presença" em 14px / Medium

── MONO (admin, dados) ──────────────────────────────
  Font: "JetBrains Mono" · weight: 400
  Uso: Valores monetários, códigos, painel admin tabelas
```

**Install (Google Fonts + next/font):**
```typescript
// src/app/layout.tsx
import { Cormorant_Garamond, DM_Sans, EB_Garamond } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display'
})
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const ebGaramond = EB_Garamond({ subsets: ['latin'], variable: '--font-serif' })
```

### 2.3 Escala Tipográfica (Tailwind CSS v4)

```css
/* src/app/globals.css */
@theme {
  --font-display: var(--font-cormorant);
  --font-sans: var(--font-dm-sans);
  --font-serif: var(--font-eb-garamond);

  /* Type scale */
  --text-hero:    clamp(3.5rem, 8vw, 6rem);    /* 56–96px */
  --text-section: clamp(2rem, 4vw, 3rem);       /* 32–48px */
  --text-title:   clamp(1.5rem, 2.5vw, 2rem);   /* 24–32px */
  --text-body:    clamp(0.875rem, 1.2vw, 1rem); /* 14–16px */
  --text-small:   0.75rem;                       /* 12px */
}
```

### 2.4 Spacing & Layout Grid

```
Base unit: 4px (0.25rem)
Grid: 12 colunas, gutter 24px mobile / 32px tablet / 48px desktop
Max-width container: 1280px
Section padding: 80px vertical (mobile: 48px)

Breakpoints:
  sm:  640px
  md:  768px
  lg:  1024px
  xl:  1280px
```

### 2.5 Motion & Animation Tokens

```typescript
// src/lib/motion.ts
export const transitions = {
  entrance:  { duration: 0.8, ease: [0.22, 1, 0.36, 1] }, // ease-out-expo
  exit:      { duration: 0.4, ease: [0.55, 0, 1, 0.45] },
  gentle:    { duration: 1.2, ease: [0.16, 1, 0.3, 1] },  // página carregando
  snap:      { duration: 0.25, ease: 'easeOut' },           // feedback UI
}

export const scrollReveal = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: transitions.entrance }
}
```

### 2.6 Elevação & Sombras

```css
--shadow-card:    0 2px 12px rgba(44,62,107,0.08);
--shadow-hover:   0 8px 32px rgba(44,62,107,0.14);
--shadow-modal:   0 24px 64px rgba(44,62,107,0.20);
--shadow-3d:      0 0 80px rgba(107,127,212,0.15);  /* glow cenas R3F */
```

### 2.7 Border Radius

```
pill:    9999px  (botões primários, badges)
card:    16px    (cards de presentes, modais)
input:   8px     (campos de formulário)
subtle:  4px     (micro-elementos, tags)
```

---

## 3. Arquitetura da Informação

### 3.1 Sitemap Completo

```
FRONT-END (Convidados)
├── / (Home — One-page scroll)
│   ├── #hero          ← Cena 3D + nomes + countdown
│   ├── #nossa-historia ← Timeline ScrollTrigger
│   ├── #itinerario    ← Eventos (condicional VIP)
│   ├── #local         ← Mapa + informações de acesso
│   ├── #rsvp          ← Wizard de confirmação
│   └── #presentes     ← Bento grid + filtros
│
└── /presentes         ← Página dedicada (deep link)

ADMIN (Noivos — autenticado)
├── /admin
│   ├── /dashboard     ← Overview + métricas
│   ├── /convidados    ← Lista, VIP toggle, grupos
│   ├── /rsvp          ← Respostas confirmadas
│   ├── /presentes     ← Gerenciar lista (CRUD + scraping)
│   ├── /itinerario    ← Eventos + VIP toggle
│   └── /configuracoes ← Site settings (cores, textos, fotos)
│
└── /admin/login       ← Autenticação
```

### 3.2 User Flow — Convidado Convencional

```
Landing → [Scroll] → Nossa História → [Scroll] → Itinerário
    ↓
[CTA: "Confirmar Presença"] → RSVP Step 1 (Email)
    ↓
→ Step 2 (Você vai? ✓/✗) → Step 3 (Acompanhante?) → Step 4 (Restrições)
    ↓
→ [Confirmado! 🎉] → Redirect para #presentes
    ↓
→ [Browse presentes] → [Card clicado] → Modal PIX/contribuição → Concluído
```

### 3.3 User Flow — Convidado VIP

```
Landing → [Login VIP — email token] → Itinerário Completo (Jantar de Ensaio visível)
```

### 3.4 User Flow — Admin (Noivos)

```
/admin/login → Dashboard → [Tab: Convidados] → Adicionar/Editar/Exportar CSV
                         → [Tab: Presentes]  → Colar URL → Scraping → Revisar → Salvar
                         → [Tab: RSVP]       → Ver confirmações em tempo real
                         → [Tab: Config]     → Editar textos, subir fotos
```

---

## 4. Screens — Front-End (Convidados)

### 4.1 Hero Section

**Conceito:** A primeira impressão deve ser um *suspiro*. A cena 3D não é tecnologia pela tecnologia — é a aquarela ganhando vida. Partículas luminosas flutuam como pétalas de papel.

```
╔══════════════════════════════════════════════════════════════╗
║  [nav: nomes logo esquerda]          [RSVP] [Presentes]  ≡  ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║   ·  ·    ·         ·   ·    ·  ·       ·    ·              ║
║      ·  [CANVAS R3F: partículas azuis + watercolor blob]     ║
║  ·              ·       ·         ·  ·                       ║
║                                                              ║
║           ┌─────────────────────────────┐                   ║
║           │   [ foto casal — blur     ] │                   ║
║           │   aquarela overlay         │                   ║
║           └─────────────────────────────┘                   ║
║                                                              ║
║         Luiza  &  Lucas                                      ║
║         [Cormorant Garamond 72px Italic]                     ║
║                                                              ║
║         16 de Maio de 2026                                   ║
║         [EB Garamond 20px]                                   ║
║                                                              ║
║         ┌──────────┐  ┌──────────┐  ┌──────────┐           ║
║         │  XX dias │  │ XX horas │  │ XX min   │           ║
║         └──────────┘  └──────────┘  └──────────┘           ║
║                                                              ║
║         [─── Confirmar Presença ──►]   [Ver Presentes]      ║
║                                                              ║
║    ∨  scroll para descobrir  ∨                               ║
╚══════════════════════════════════════════════════════════════╝
```

**Decisões técnicas:**
- Canvas R3F ocupa 100vh, z-index -1, pointer-events: none
- Partículas: ~800 pontos, color #6B7FD4, opacity 0.4–0.8, random drift
- Mouse parallax: `useFrame` + `lerp` para suavizar o movimento
- Mobile: giroscópio via `DeviceOrientationEvent`, fallback static
- Countdown: `date-fns` + `useEffect` com interval de 1s
- Lazy load canvas com `next/dynamic` + `ssr: false`

---

### 4.2 Nossa História — Timeline ScrollTrigger

**Conceito:** Cada marco do relacionamento surge como se alguém estivesse *escrevendo ao vivo*. O usuário não lê — ele *descobre*.

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   Nossa História                                             ║
║   [Cormorant 48px Italic]                                    ║
║   ─────────────── [linha aquarela SVG] ───────────────       ║
║                                                              ║
║   [scroll trigger zone]                                      ║
║                                                              ║
║   ●─────────────────────────────────────────                 ║
║   │  2020                                                    ║
║   │  ┌──────────────────┐   O Primeiro Encontro             ║
║   │  │  [ foto ]        │   [texto aparece letra por letra] ║
║   │  │  blur → focus    │                                   ║
║   │  └──────────────────┘                                   ║
║   │                                                          ║
║   ●─────────────────────────────────────────                 ║
║   │  2022                                                    ║
║   │                   ┌──────────────────┐                  ║
║   │  [texto esquerda] │   [ foto ]        │                  ║
║   │                   └──────────────────┘                  ║
║   │                                                          ║
║   ●─────────────────────────────────────────                 ║
║   │  2025 · O Pedido                                         ║
║   │  ┌──────────────────┐   [texto com ✦ animado]           ║
║   │  │   [ video/gif ]  │                                   ║
║   │  └──────────────────┘                                   ║
║   │                                                          ║
║   ◉  16.05.2026 · O Grande Dia  ← pulsa lentamente          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

**GSAP ScrollTrigger config:**
```typescript
// Cada marco da timeline
gsap.from(marcoRef.current, {
  scrollTrigger: {
    trigger: marcoRef.current,
    start: 'top 80%',
    toggleActions: 'play none none reverse'
  },
  opacity: 0, x: isLeft ? -60 : 60, duration: 0.8,
  ease: 'power3.out'
})

// Imagem blur → focus
gsap.fromTo(imgRef.current,
  { filter: 'blur(8px)', scale: 0.95 },
  { filter: 'blur(0px)', scale: 1, duration: 1.2,
    scrollTrigger: { trigger: imgRef.current, start: 'top 75%' } }
)

// Linha de progresso da timeline
gsap.to(lineRef.current, {
  scaleY: 1, transformOrigin: 'top',
  scrollTrigger: { trigger: containerRef.current, scrub: 1,
    start: 'top 60%', end: 'bottom 80%' }
})
```

---

### 4.3 Itinerário

**Conceito:** Uma *linha do dia* elegante que dá ao convidado clareza total sem parecer um schedule corporativo.

```
╔══════════════════════════════════════════════════════════════╗
║   O Grande Dia · 16 de Maio de 2026                         ║
║                                                              ║
║   ┌─────────────────────────────────────────────────────┐   ║
║   │  ♦ 16:00 · Cerimônia                                │   ║
║   │  📍 Igreja Nossa Senhora da Graça                   │   ║
║   │  Rua dos Ipês, 450 · [Ver no Maps ↗]               │   ║
║   └─────────────────────────────────────────────────────┘   ║
║                                                              ║
║   ┌─────────────────────────────────────────────────────┐   ║
║   │  ♦ 19:30 · Recepção & Jantar                        │   ║
║   │  📍 Espaço Villa Noblesse                           │   ║
║   └─────────────────────────────────────────────────────┘   ║
║                                                              ║
║   [VIP ONLY — renderizado apenas se isVip === true]          ║
║   ┌─────────────────────────────────────────────────────┐   ║
║   │  ✦ VIP · 14:00 · Jantar de Ensaio                  │   ║
║   │  [badge: Padrinhos e Família]                       │   ║
║   └─────────────────────────────────────────────────────┘   ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

### 4.4 RSVP — Wizard Multi-etapas

**Conceito:** Confirmar presença deve sentir como receber um convite em mãos — *cuidado e consideração*, não um formulário burocrático.

```
╔══════════════════════════════════════════════════════════════╗
║   Sua Presença é o Maior Presente                           ║
║                                                              ║
║   ●──────●──────○──────○   [progress indicator]            ║
║   1      2      3      4                                     ║
║                                                              ║
║   ┌─── STEP 1 ────────────────────────────────────────┐    ║
║   │                                                    │    ║
║   │   Qual é o seu e-mail?                            │    ║
║   │                                                    │    ║
║   │   ┌────────────────────────────────────────────┐  │    ║
║   │   │  luiza.amiga@email.com                     │  │    ║
║   │   └────────────────────────────────────────────┘  │    ║
║   │                                                    │    ║
║   │   [Continuar →]                                   │    ║
║   └────────────────────────────────────────────────────┘    ║
║                                                              ║
║   [Framer Motion AnimatePresence — slide lateral entre steps]║
╚══════════════════════════════════════════════════════════════╝
```

**Wizard Steps:**

| Step | Pergunta | Input Type | Lógica |
|------|----------|------------|--------|
| **1** | E-mail | text input | Busca convidado no DB |
| **2** | Você vai conseguir estar lá? | 2 botões grandes (✓ Sim / ✗ Não) | Se não → skip para step final |
| **3** | Vai levar acompanhante? | toggle + nome | Só se `plusOneAllowed` |
| **3b** | Nomes dos acompanhantes | campos dinâmicos | Se há `Attendee`s vinculados |
| **4** | Alguma restrição alimentar? | chips selecionáveis | Vegetariano / Vegano / Sem glúten / Alergia |
| **Final** | Confirmação animada | celebração 🎉 | Confetti GSAP + mensagem personalizada |

**Transição entre steps (Framer Motion):**
```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={step}
    initial={{ opacity: 0, x: 60 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -60 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
  >
    {renderStep(step)}
  </motion.div>
</AnimatePresence>
```

---

### 4.5 Lista de Presentes — Bento Grid

**Conceito:** Não é um catálogo. É uma *galeria de sonhos*. O convidado deve sentir que está escolhendo um capítulo da nova vida do casal.

```
╔══════════════════════════════════════════════════════════════╗
║   Nossos Sonhos · Lista de Presentes                        ║
║                                                              ║
║   [Filtros sticky]                                           ║
║   [Todos] [Cozinha] [Casa] [Aventuras] [Lua de Mel]        ║
║   [─── Até R$100 ───] [Disponíveis] [✦ Mais Desejados]     ║
║                                                              ║
║   ┌─────────────────────────┬───────────┬───────────────┐  ║
║   │                         │  [card    │  [card 1x1]   │  ║
║   │   [card 2x2]            │   1x1]   │               │  ║
║   │   Viagem Lua de Mel     │          │  Panela Le    │  ║
║   │   ✦ Mais Desejado       │  Raquete │  Creuset      │  ║
║   │   Meta: R$3.000         │  de Beach│               │  ║
║   │   ████████░░░ 75%       │  Vôlei   │  R$ 890       │  ║
║   │   Contribuir →          │  R$120   │  [Dar este]   │  ║
║   ├─────────────────────────┼───────────┴───────────────┤  ║
║   │  [card 1x1]  │ [1x2]   │  [card 1x1]  │ [card 1x1] │  ║
║   │  Cafeteira   │ Kit     │  Jogo de     │  Airfryer   │  ║
║   │  Nespresso   │ Churrasco│  Toalhas     │             │  ║
║   └──────────────┴──────────┴──────────────┴─────────────┘  ║
╚══════════════════════════════════════════════════════════════╝
```

**Modal de Contribuição (Group Gifting):**
```
╔══════════════════════════════╗
║  ✈ Viagem Lua de Mel        ║
║                              ║
║  Maldivas · 7 noites        ║
║  Meta: R$ 3.000              ║
║                              ║
║  ████████████░░░░  75%       ║
║  R$ 2.250 de R$ 3.000       ║
║                              ║
║  Quanto você quer contribuir?║
║  [R$  _______  ]            ║
║                              ║
║  Seu nome: [___________]    ║
║  Seu email: [__________]    ║
║                              ║
║  ┌──────────────────────┐   ║
║  │  [QR Code PIX]       │   ║
║  │  Chave: ...@pix.com  │   ║
║  └──────────────────────┘   ║
║                              ║
║  Após pagar, clique abaixo:  ║
║  [✓ Já enviei o PIX]        ║
╚══════════════════════════════╝
```

**Card de Presente — estados:**
```
Estado NORMAL:              Estado HOVER:              Estado COMPRADO:
┌──────────────┐            ┌──────────────┐           ┌──────────────┐
│  [ imagem ]  │            │  [ imagem ]  │           │ [ imagem ✓ ] │
│              │  →hover→   │  zoom 1.03x  │           │  overlay 40% │
│  Cafeteira   │            │  shadow ↑    │           │  Presente    │
│  R$ 450      │            │  [Dar este→] │           │  Recebido    │
└──────────────┘            └──────────────┘           └──────────────┘
```

**Badge "Mais Desejado":**
```css
.badge-most-wanted {
  background: linear-gradient(135deg, #C9A84C, #F0C665);
  color: #2D2D2D;
  font: 500 11px/1 'DM Sans';
  padding: 4px 10px;
  border-radius: 9999px;
  position: absolute;
  top: 12px; left: 12px;
  box-shadow: 0 2px 8px rgba(201,168,76,0.4);
}
```

---

## 5. Screens — Admin Panel

### 5.1 Design Philosophy — Admin

O admin não é um produto bonito de se ver — é uma **ferramenta de trabalho**. Mas pode ser elegante. Inspiração: Linear + Notion + painel de analytics minimalista. Tons neutros com acentos em Cornflower.

### 5.2 Layout Global Admin

```
╔══════════════════════════════════════════════════════════════╗
║  ◈ Aeterna Admin                          Luiza & Lucas ▾   ║
╠════════════╦═════════════════════════════════════════════════╣
║ Dashboard  ║                                                  ║
║            ║  [conteúdo principal da página]                  ║
║ Convidados ║                                                  ║
║            ║                                                  ║
║ RSVP       ║                                                  ║
║            ║                                                  ║
║ Presentes  ║                                                  ║
║            ║                                                  ║
║ Itinerário ║                                                  ║
║            ║                                                  ║
║ Config     ║                                                  ║
╚════════════╩═════════════════════════════════════════════════╝
```

### 5.3 Dashboard

```
╔══════════════════════════════════════════════════════════════╗
║  Bom dia, Luiza 👋   Faltam 72 dias para o casamento        ║
║                                                              ║
║  ┌──────────────┐ ┌──────────────┐ ┌────────────────────┐  ║
║  │  Convidados  │ │  Confirmados │ │  Presentes         │  ║
║  │     120      │ │    87 (72%)  │ │   43 / 58          │  ║
║  │  [▓▓▓▓▓░░░] │ │  [▓▓▓▓▓▓░░] │ │  [████████░░░] 74% │  ║
║  └──────────────┘ └──────────────┘ └────────────────────┘  ║
║                                                              ║
║  ┌───────────────────────────────────────────────────────┐  ║
║  │  Confirmações recentes                                │  ║
║  │  · Ana Lima confirmou · 2 pessoas · há 10min          │  ║
║  │  · Carlos & Maria confirmaram · 4 pessoas · há 1h     │  ║
║  │  · Pai do Lucas confirmou · 1 pessoa · há 3h          │  ║
║  └───────────────────────────────────────────────────────┘  ║
║                                                              ║
║  ┌───────────────────────────────────────────────────────┐  ║
║  │  Restrições alimentares                               │  ║
║  │  Vegetarianos: 8  |  Sem glúten: 3  |  Veganos: 2    │  ║
║  └───────────────────────────────────────────────────────┘  ║
╚══════════════════════════════════════════════════════════════╝
```

### 5.4 Gerenciar Convidados

```
╔══════════════════════════════════════════════════════════════╗
║  Convidados                   [+ Adicionar]  [↓ Exportar CSV]║
║                                                              ║
║  [Buscar por nome ou email...]    [Grupo ▾]  [VIP ▾]        ║
║                                                              ║
║  ┌─────┬──────────────────┬───────────────┬──────┬────────┐ ║
║  │  ✓  │  Nome            │  Email        │  VIP │  RSVP  │ ║
║  ├─────┼──────────────────┼───────────────┼──────┼────────┤ ║
║  │  ○  │  Ana Lima        │ ana@...       │  ○   │  ✓ 2px │ ║
║  │  ○  │  Carlos Mendes   │ carlos@...    │  ●   │  ✓ 4px │ ║
║  │  ○  │  Mariana Costa   │ mari@...      │  ○   │  ✗     │ ║
║  └─────┴──────────────────┴───────────────┴──────┴────────┘ ║
║                                                              ║
║  [← 1 2 3 ... →]                           120 convidados   ║
╚══════════════════════════════════════════════════════════════╝
```

### 5.5 Gerenciar Presentes — Universal Registry

```
╔══════════════════════════════════════════════════════════════╗
║  Lista de Presentes              [+ Adicionar por URL]       ║
║                                                              ║
║  ┌──────────────────────────────────────────────────────┐   ║
║  │  🔗 Cole a URL de qualquer produto                   │   ║
║  │  ┌────────────────────────────────┐  [Buscar ✦]     │   ║
║  │  │ https://amazon.com.br/...     │                  │   ║
║  │  └────────────────────────────────┘                  │   ║
║  │                                                      │   ║
║  │  [Preview após scraping:]                            │   ║
║  │  ┌──────────┐  Cafeteira Nespresso Vertuo           │   ║
║  │  │ [imagem] │  R$ 449,90  ·  Amazon                 │   ║
║  │  └──────────┘  Categoria: [Cozinha      ▾]          │   ║
║  │                ✦ Mais Desejado: [ toggle ]           │   ║
║  │                [Salvar na Lista]                     │   ║
║  └──────────────────────────────────────────────────────┘   ║
║                                                              ║
║  ┌─────┬──────────────────────┬────────────┬────────┬─────┐ ║
║  │ Img │ Produto              │ Preço      │ Status │ Ação│ ║
║  ├─────┼──────────────────────┼────────────┼────────┼─────┤ ║
║  │ 🖼  │ Viagem Lua de Mel    │ R$3.000    │ 75% 💰 │ ✏ 🗑│ ║
║  │ 🖼  │ Cafeteira Nespresso  │ R$450      │ ✓ Rec. │ ✏ 🗑│ ║
║  │ 🖼  │ Jogo Toalhas         │ R$180      │ Disp.  │ ✏ 🗑│ ║
║  └─────┴──────────────────────┴────────────┴────────┴─────┘ ║
╚══════════════════════════════════════════════════════════════╝
```

### 5.6 Configurações do Site

```
╔══════════════════════════════════════════════════════════════╗
║  Configurações do Site                     [Salvar Tudo]    ║
║                                                              ║
║  ── CONTEÚDO ────────────────────────────────────────────   ║
║                                                              ║
║  Título do Hero                                             ║
║  ┌─────────────────────────────────────┐                   ║
║  │ Lucas & Luiza                       │                   ║
║  └─────────────────────────────────────┘                   ║
║                                                              ║
║  Data do Casamento                                          ║
║  ┌─────────────────┐                                       ║
║  │ 16/05/2026      │                                       ║
║  └─────────────────┘                                       ║
║                                                              ║
║  ── FOTO DO CASAL ──────────────────────────────────────   ║
║  ┌──────────────────┐                                      ║
║  │  [preview foto]  │  [Trocar foto ↑]                     ║
║  └──────────────────┘                                      ║
║                                                              ║
║  ── CHAVE PIX ──────────────────────────────────────────   ║
║  ┌─────────────────────────────────────┐                   ║
║  │ luizaelucas@pix.com                 │                   ║
║  └─────────────────────────────────────┘                   ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 6. Componentes UI — Biblioteca

### 6.1 Botões

```
── PRIMÁRIO ────────────────────────────────────────────
  ╔═══════════════════════════════╗
  ║  Confirmar Presença  →        ║   bg: Cornflower #4A6FA5
  ╚═══════════════════════════════╝   hover: darken 8%
                                       border-radius: pill
                                       height: 48px (touch target)

── SECUNDÁRIO ──────────────────────────────────────────
  ┌───────────────────────────────┐
  │  Ver Presentes                │   bg: transparent
  └───────────────────────────────┘   border: 1.5px Cornflower
                                       hover: Ice Blue fill

── GHOST ───────────────────────────────────────────────
  Ver mais informações →              underline animate on hover

── DANGER (admin) ──────────────────────────────────────
  ╔═════════╗
  ║  Remover║                         bg: Blush #E8A0A0
  ╚═════════╝
```

### 6.2 Form Inputs

```
Label [DM Sans 12px · Stone · uppercase · tracking-wide]
┌────────────────────────────────────────────────────┐
│  Placeholder ou valor                              │
└────────────────────────────────────────────────────┘
border: 1.5px Dust / focus: Periwinkle / error: Blush
border-radius: 8px / height: 48px (mobile ergonomia)

── CHIP SELECT (restrições alimentares) ─────────────
  [Vegetariano] [Vegano] [Sem Glúten] [Sem Lactose]
  → tap: fill Periwinkle + texto Pearl
```

### 6.3 Cards de Presente

```
┌──────────────────────────────┐
│  [badge: ✦ Mais Desejado]    │  ← position: absolute, top-left
│                              │
│  ┌────────────────────────┐  │
│  │     imagem produto     │  │  aspect-ratio: 4/3, object-cover
│  └────────────────────────┘  │
│                              │
│  Cafeteira Nespresso         │  Cormorant 18px
│  R$ 450,00                   │  DM Sans 14px · Stone
│                              │
│  [Dar este presente →]       │  botão ghost
└──────────────────────────────┘
border-radius: 16px
box-shadow: --shadow-card
hover: translateY(-4px) + --shadow-hover (200ms ease)
```

### 6.4 Progress Bar (Group Gifting)

```html
<!-- SVG animado via GSAP -->
<svg viewBox="0 0 300 8">
  <!-- Track -->
  <rect x="0" y="0" width="300" height="8" rx="4" fill="#E8E5E0"/>
  <!-- Fill — animado por GSAP de 0 → percentual -->
  <rect x="0" y="0" width="225" height="8" rx="4" fill="url(#gradient-gold)"/>
  <defs>
    <linearGradient id="gradient-gold" x1="0" x2="1">
      <stop offset="0%" stop-color="#C9A84C"/>
      <stop offset="100%" stop-color="#F0C665"/>
    </linearGradient>
  </defs>
</svg>
```

### 6.5 Navegação Principal

```
Mobile:                              Desktop:
                                     ╔══════════════════════════════╗
╔══════════════════════════╗         ║  L&L  História  Itinerário  ║
║  L&L                   ☰║         ║       Local  RSVP Presentes ║
╚══════════════════════════╝         ╚══════════════════════════════╝
↓ drawer off-canvas                  sticky após scroll 80vh
                                     backdrop-blur + bg 80% opaco
```

---

## 7. Micro-interações & Detalhes

### 7.1 Inventário de Micro-animações

| Elemento | Trigger | Animação |
|----------|---------|----------|
| Botão CTA | hover | scale 1.02 + sombra cresce |
| Card presente | hover | translateY -4px + shadow |
| Input focus | focus | border → Periwinkle + label sobe (floating) |
| RSVP step change | next/prev | slide lateral Framer Motion |
| Confirmação RSVP | submit | confetti burst (GSAP) + scale 1 → 1.05 → 1 |
| Badge "Mais Desejado" | mount | fadeIn + scale de 0.5 → 1 |
| Progress bar | visible in viewport | GSAP fill da esquerda 0 → % |
| Nav link | hover | underline slide da esquerda |
| Modal PIX | open | scale 0.9 → 1 + fade + blur background |
| Partículas hero | scroll down | opacity 0.8 → 0 (parallax out) |
| Timeline dots | scroll trigger | pulse + color fill |

### 7.2 Loading States

```
Skeleton card:                 Loading button:
┌──────────────────────┐       ╔═══════════════════════╗
│  ░░░░░░░░░░░░░░░░░░  │       ║  [●  Buscando...     ]║
│  ░░░░░░░░░░           │       ╚═══════════════════════╝
│  ░░░░░                │
└──────────────────────┘       shimmer animation via CSS
```

### 7.3 Empty States

```
Lista de presentes vazia (admin):
╔═══════════════════════════════════════╗
║                                       ║
║    🎁                                 ║
║    Nenhum presente ainda             ║
║    Cole uma URL para começar          ║
║    [+ Adicionar primeiro presente]   ║
║                                       ║
╚═══════════════════════════════════════╝
```

---

## 8. Acessibilidade (WCAG 2.1 AA)

| Requisito | Implementação |
|-----------|--------------|
| Contraste mínimo 4.5:1 | Charcoal #2D2D2D sobre Parchment #F8F5F0 = 12:1 ✓ |
| Touch targets ≥ 48×48px | Todos os botões: height min 48px |
| Focus visible | `outline: 2px solid #6B7FD4; outline-offset: 2px` |
| Alt text imagens | Obrigatório no admin ao fazer upload |
| Screen reader | `aria-live="polite"` no wizard RSVP para anunciar step |
| Reduced motion | `@media (prefers-reduced-motion)` → desativa GSAP ScrollTrigger |
| Keyboard nav | Tab order lógico em todos os formulários |
| Labels associados | `<label htmlFor>` em todos os inputs |

```css
/* Reduced motion global */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Performance Budget

| Asset | Limite | Estratégia |
|-------|--------|-----------|
| Hero canvas JS | < 80kb gzip | Code splitting, lazy |
| Modelos .glb | < 2.5 MB | Compressão Draco |
| Fontes web | < 100kb | `display: swap`, subset latin |
| Imagens casal | < 200kb/img | Next.js `<Image>` + WebP |
| LCP alvo | < 1.5s | SSG + CDN |
| CLS | < 0.1 | Reservar espaço canvas no SSR |

---

## 10. Checklist de Implementação

### Front-End

- [ ] Configurar fontes Cormorant + DM Sans + EB Garamond via `next/font`
- [ ] Criar CSS tokens no `globals.css` (cores, shadow, radius)
- [ ] Implementar layout `(public)/layout.tsx` com Lenis + GSAP init
- [ ] **Hero:** Canvas R3F com partículas + mouse parallax + countdown
- [ ] **Nossa História:** Componente timeline com ScrollTrigger alternado
- [ ] **Itinerário:** Cards de evento com renderização condicional VIP
- [ ] **RSVP Wizard:** 4 steps com AnimatePresence + validação por email
- [ ] **Lista Presentes:** BentoGrid + FilterPanel (Zustand) + filtros client-side
- [ ] **Card Presente:** hover states + badge + progress bar SVG
- [ ] **Modal PIX:** QR code estático + confirm "já paguei"
- [ ] **Navegação:** Sticky com backdrop-blur + off-canvas mobile

### Admin

- [ ] Layout admin com sidebar fixa + mobile collapsible
- [ ] `/admin/login` — autenticação simples (env secret)
- [ ] `/admin/dashboard` — métricas cards + feed de RSVPs recentes
- [ ] `/admin/convidados` — tabela com busca/filtro + toggle VIP + CSV export
- [ ] `/admin/rsvp` — view-only das respostas com filtros
- [ ] `/admin/presentes` — input URL → scraping → preview → salvar + tabela CRUD
- [ ] `/admin/itinerario` — CRUD eventos + toggle VIP
- [ ] `/admin/configuracoes` — form com upload foto + chave PIX + textos

### APIs

- [ ] `POST /api/rsvp` — salvar confirmação
- [ ] `GET /api/gifts` — listar presentes
- [ ] `POST /api/gifts` — criar presente
- [ ] `POST /api/gifts/scrape` — scraping de URL externa
- [ ] `POST /api/gifts/[id]/contribute` — registrar contribuição PIX
- [ ] `GET /api/admin/guests` — listar convidados (protegido)
- [ ] `PATCH /api/admin/guests/[id]` — editar convidado

---

## Apêndice — Referências de Design

| Referência | O que tomar emprestado |
|------------|------------------------|
| **Willardson Wedding** (CSSDA) | Espaço negativo generoso, tipografia editorial dominante |
| **Kloi & Patrick** (Joy) | Estrutura da timeline com scroll-triggered reveals |
| **katmattwedding.com** | Engajamento lúdico antes do RSVP (inspiração futura) |
| **Zola Registry** | Filtros facetados sem fricção, bento grid assimétrico |
| **Linear** | Admin UI: tipografia pequena e densa, ações claras |
| **LookBook** (Kettelkamp) | Proof of concept: 3D não compete com emoção, amplifica |

---

*Documento gerado por Sally 🎨 — BMad UX Designer Agent*
*Projeto: Aeterna · Lucas & Luiza · 16.05.2026*

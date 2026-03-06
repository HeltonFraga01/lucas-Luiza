# Projeto Lucas & Luiza - Wedding Experience

Este é um ecossistema digital imersivo para o casamento de Lucas & Luiza, construído com foco em design de luxo, interatividade tridimensional e uma experiência de usuário sem fricção. O projeto utiliza as tecnologias mais modernas do ecossistema Web para entregar uma narrativa cinematográfica.

## 🚀 Tecnologias Principais

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/) com React 19.
- **Linguagem:** TypeScript para tipagem estática e segurança.
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) para design responsivo e utilitário.
- **3D & Gráficos:** [Three.js](https://threejs.org/) via [React Three Fiber (R3F)](https://docs.pmnd.rs/react-three-fiber) e [@react-three/drei](https://github.com/pmndrs/drei).
- **Animações:** [GSAP (GreenSock)](https://gsap.com/) para coreografia de scroll e [Framer Motion](https://www.framer.com/motion/) para transições de UI.
- **Banco de Dados:** [SQLite](https://sqlite.org/) (Better-SQLite3) com [Prisma ORM](https://www.prisma.io/).
- **Estado:** [Zustand](https://docs.pmnd.rs/zustand) para gerenciamento de estado global (ex: Carrinho/Lista de Presentes).
- **Autenticação:** [Jose](https://github.com/panva/jose) para manipulação de tokens JWT leves.

## 📁 Estrutura de Pastas Relevante

- `src/app/`: Rotas da aplicação (App Router).
    - `(admin)/`: Rotas administrativas protegidas.
    - `(public)/`: Experiência do convidado.
    - `api/`: Endpoints de API (RSVP, Gifts, Auth).
- `src/components/`: Componentes modulares.
    - `canvas/`: Componentes R3F/Three.js (Cenas 3D).
    - `sections/`: Grandes seções da página principal (Hero, Story, etc).
    - `registry/`: Módulos da Lista de Presentes.
    - `rsvp/`: Fluxo de confirmação de presença (Wizard).
    - `ui/`: Componentes de interface base (Botões, Modais).
- `src/lib/`: Utilitários e instâncias de bibliotecas (Prisma client, Auth logic).
- `prisma/`: Definições de esquema e migrações.
- `public/`: Ativos estáticos (Modelos 3D, Imagens, Fontes).

## 🛠️ Comandos de Desenvolvimento

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Compila o projeto para produção. |
| `npx prisma generate` | Gera o cliente Prisma (após mudanças no schema). |
| `npx prisma db push` | Sincroniza o schema com o banco de dados SQLite. |
| `npx prisma studio` | Abre o explorador visual do banco de dados. |
| `npm run lint` | Executa a verificação do ESLint. |

## 📐 Convenções de Desenvolvimento

1.  **Componentes 3D:** Devem ser mantidos em `src/components/canvas`. Utilize `Suspense` para carregamento de assets pesados e `drei` para utilitários comuns.
2.  **Server Components:** Priorize o uso de Server Components no App Router para busca de dados (ex: `src/app/page.tsx`). Use `"use client"` apenas quando necessário (interatividade, hooks do R3F/GSAP).
3.  **Estilização:** Utilize classes utilitárias do Tailwind 4. Evite CSS externo a menos que estritamente necessário para animações complexas.
4.  **Banco de Dados:** Todas as interações devem passar pelo Prisma. O client singleton está em `src/lib/prisma.ts`.
5.  **Performance:** Otimize modelos 3D (.glb) usando compressão Draco antes de colocar em `public/`. Use `next/image` para todas as imagens estáticas.
6.  **Animações de Scroll:** Utilize `GSAP ScrollTrigger` para animações vinculadas à rolagem, garantindo que o cleanup seja feito em `useEffect` (ou use `@gsap/react`).

## 📋 Funcionalidades em Implementação (PRD)

- [x] **Hero Scene 3D:** Cabeçalho interativo com R3F.
- [x] **Nossa História:** Timeline interativa via GSAP.
- [ ] **RSVP Wizard:** Formulário multi-etapas com reconhecimento de grupo familiar.
- [ ] **Gift Registry:** Lista estilo "Bento Box" com suporte a Web Scraping e doações via PIX (taxa zero).
- [ ] **Painel Admin:** Gestão de convidados, presentes e métricas de RSVP.

---
*Este documento serve como guia de contexto para a IA e desenvolvedores. Mantenha-o atualizado ao introduzir novas arquiteturas ou dependências críticas.*

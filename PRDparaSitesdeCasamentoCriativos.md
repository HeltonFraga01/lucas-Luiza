# **Arquitetura de Experiências Digitais Matrimoniais: Análise de Inovação Global e Documento de Requisitos de Produto (PRD)**

A convergência entre o design de experiências de alto luxo, a engenharia web moderna e a psicologia do consumidor transformou radicalmente a concepção de plataformas digitais voltadas para casamentos. O que outrora consistia em meros folhetos informativos estáticos com formulários de contato rudimentares evoluiu para ecossistemas digitais imersivos, narrativas interativas tridimensionais e complexos sistemas de comércio eletrônico (e-commerce) para a gestão de listas de presentes. A análise do estado da arte do mercado digital de casamentos — um setor cuja projeção de mercado na internet aponta para um valor de US$ 18,7 bilhões até 2033 1 — revela uma transição do design utilitário para abordagens avançadas de desenvolvimento de software, incorporando gamificação, renderização em tempo real e arquiteturas escaláveis.  
Esta investigação exaustiva disseca as experiências digitais matrimoniais mais criativas e premiadas do mundo, mapeando as URLs de origem, explorando a arquitetura de software subjacente, as linguagens de programação utilizadas e as melhores práticas de User Experience (UX) e User Interface (UI). O foco recai expressamente sobre a mecânica de interatividade e a arquitetura informacional das listas de presentes, detalhando como categorias, filtros e módulos de pagamento são estruturados para criar experiências sem fricção. O documento culmina na elaboração de um Documento de Requisitos de Produto (PRD) rigoroso e prescritivo, estruturado para orientar o desenvolvimento da plataforma de casamento tecnologicamente mais avançada do mercado.

## **Benchmarks Globais: As Experiências Mais Criativas e Diferenciadas do Mundo**

A excelência em design web para casamentos é sistematicamente validada por painéis de jurados internacionais, como o Awwwards (awwwards.com) e o CSS Design Awards (cssdesignawards.com), que avaliam as plataformas com base em design de interface (UI), experiência do usuário (UX) e inovação tecnológica.2 A análise de projetos premiados e estudos de caso independentes demonstra que a criatividade excepcional não reside unicamente na estética visual, mas na forma audaciosa como a tecnologia é manipulada para subverter as expectativas do usuário e evocar respostas emocionais profundas.

### **Gamificação e Engajamento Interativo**

A vanguarda da criatividade digital rejeita a passividade. O projeto desenvolvido pela designer e ilustradora Katherine Liu, acessível em katmattwedding.com, representa um marco na gamificação de convites de casamento.5 Em vez de apresentar um convite digital tradicional simulando papel, os desenvolvedores construíram um jogo completo no estilo "side-scroller" bidimensional.5  
A mecânica do site exige que o convidado interaja ativamente com a narrativa:

1. **Seleção de Avatar:** O usuário inicia a jornada escolhendo jogar como a noiva ou o noivo.5  
2. **Desafio Lúdico:** O personagem deve pular sobre obstáculos (descritos como "pedras zangadas") e coletar uma série de morangos dispostos pelo cenário. Colisões resultam em feedback visual (o personagem pisca em vermelho) e perda de itens.5  
3. **Sistema de Recompensa e Desbloqueio:** Apenas após a coleta de todos os itens, um anel de casamento surge no cenário. A captura do anel reúne os personagens e, como recompensa, atua como o gatilho de roteamento que direciona o usuário para o formulário de RSVP e para as informações logísticas do evento.5

Este nível de interatividade transforma um processo administrativo frequentemente percebido como monótono (confirmar presença) em uma experiência lúdica, imersiva e memorável, garantindo níveis altíssimos de retenção na página.

### **Storytelling Tridimensional e Renderização Imersiva**

O projeto denominado *LookBook*, concebido e desenvolvido pelo engenheiro de software Matt Kettelkamp (documentado em mattkettelkamp.com/projects/lookbook), ilustra a aplicação de renderização gráfica complexa em memórias matrimoniais.6 O site abandona a clássica galeria de imagens bidimensional (grid de fotos) em favor de um álbum de fotos digital 100% tridimensional e interativo.6  
A criatividade deste projeto advém da simulação física realista:

* **Manipulação de Malhas:** O livro tridimensional permite que os usuários "virem" as páginas digitalmente. Para isso, o desenvolvedor utilizou bibliotecas de cinemática para integrar um sistema de esqueleto nas malhas (meshes) das páginas, permitindo animações de flexão incrivelmente suaves conforme a página é manipulada pelo cursor do mouse.6  
* **Materiais e Shaders Customizados:** As capas do livro interativo utilizam mapas alfa para gerar reflexos brilhantes detalhados, adicionando fotorrealismo.6 As páginas combinam texturas de imagem com reflexos emissivos que reagem dinamicamente à iluminação do ambiente virtual.6

### **Excelência em UI/UX e Personalização Narrativa**

Plataformas reconhecidas pelo CSS Design Awards, como o *Willardson Wedding*, exemplificam a fusão entre minimalismo luxuoso e responsividade técnica.4 Este site alcançou pontuações notáveis em UI e Inovação ao adotar uma estética editorial clean, utilizando amplos espaços negativos e navegação fluida que prioriza a fotografia em alta resolução.4 Semelhantemente, projetos de estúdios renomados, como a página da agência fotográfica de casamentos *Adovasio* (premiada no Awwwards), utilizam scroll horizontal atípico e transições de página cinematográficas para simular a sensação tátil de folhear uma revista de alta costura.7  
A criatividade também se manifesta na subversão de tropos clássicos. O site do casal *Rush & Danit* (destacado em curadorias de design de plataformas como Squarespace e Sitebuilder Report) inovou ao substituir as convencionais e altamente produzidas fotografias de noivado na seção "Hero" (topo da página) por fotos da infância de ambos, estabelecendo um tom de intimidade e humor imediato.8 O projeto *Jaime and Meli* investiu pesadamente em ilustrações vetoriais sob medida, desenvolvendo não apenas um logotipo e cabeçalho exclusivos, mas também ilustrações detalhadas que mapeiam visualmente a linha do tempo do dia do casamento, acompanhadas de uma página de Perguntas Frequentes (FAQ) abrangente e bilíngue.9  
Além disso, a seção "Nossa História" sofreu uma evolução significativa. O caso de *Kloi and Patrick*, documentado pela plataforma Joy (withjoy.com), demonstra a substituição de parágrafos textuais exaustivos por uma linha do tempo visual interativa.10 Os convidados rolam a página e acompanham o desdobramento do relacionamento passo a passo, desde o primeiro encontro no Tinder até o pedido de casamento em uma montanha, com entradas datadas e micro-animações que surgem no viewport, tornando a leitura dinâmica e engajadora.10

| Exemplo de Referência / Fonte | Principal Fator Criativo | Mecânica de Interatividade | Impacto Psicológico no Usuário |
| :---- | :---- | :---- | :---- |
| **katmattwedding.com** (Katherine Liu) 5 | Gamificação do convite via jogo side-scroller. | Controles de teclado para desviar de obstáculos e coletar recompensas para desbloquear o RSVP.5 | Alta retenção, construção de memória lúdica afetiva, redução de abandono.5 |
| **LookBook** (Matt Kettelkamp) 6 | Álbum de fotografias 100% tridimensional com física de tecidos. | Interação via cursor para manipular e dobrar malhas 3D simulando páginas de papel.6 | Imersão tátil profunda, percepção de inovação e alto luxo tecnológico.6 |
| **Willardson Wedding** (CSSDA) 4 | Minimalismo brutalista e design editorial. | Scroll fluido, transições de opacidade e revelação tipográfica. | Transmissão de elegância irrestrita, redução de carga cognitiva. |
| **Kloi & Patrick** (via Joy) 10 | Timeline narrativa visual cronológica. | Revelação de eventos e datas vinculada à posição da barra de rolagem (Scroll-triggered). | Consumo de conteúdo transformado em descoberta gradual e curiosidade.10 |
| **Jaime & Meli** 9 | Ilustrações vetoriais personalizadas ponta a ponta. | Infográficos ilustrados interativos para o cronograma do dia.9 | Extrema personalização, clareza logística mitigando dúvidas dos convidados. |

## **Engenharia e Arquitetura de Software: Como os Melhores Sites São Construídos**

A viabilização dessas experiências cinemáticas e interativas exige um afastamento drástico dos construtores de sites monolíticos baseados em templates engessados. A análise da base de código e da arquitetura dos projetos supramencionados revela um ecossistema dominado por tecnologias JavaScript modernas, renderização de gráficos complexos e otimização de performance no lado do servidor.

### **O Ecossistema React e Next.js**

A arquitetura fundamental da vasta maioria dos projetos digitais de alto desempenho no universo de casamentos é baseada no framework **React**.11 O React, uma biblioteca JavaScript declarativa, permite a construção de interfaces de usuário (UI) a partir de componentes encapsulados (ex: um botão de RSVP, um card de presente, um contador regressivo) que gerenciam seu próprio estado interno. Esta modularidade é crucial para lidar com a complexidade de listas de presentes dinâmicas e formulários de presença multifásicos que exigem atualizações em tempo real sem recarregar a página.12  
No entanto, Single Page Applications (SPAs) construídas puramente em React enfrentam desafios crônicos de otimização para motores de busca (SEO) e latência na renderização inicial (First Contentful Paint). Para o segmento de luxo, onde a velocidade e o compartilhamento social são vitais, o mercado convergiu para o uso do **Next.js**.11  
O Next.js atua como um framework full-stack sobre o React, fornecendo Renderização do Lado do Servidor (SSR) e Geração de Sites Estáticos (SSG).12 A adoção do Next.js garante que, quando um noivo compartilha o link do seu site de casamento no WhatsApp ou iMessage, o servidor pré-renderize as tags de metadados Open Graph (imagem de capa, título romântico e descrição) e as envie imediatamente ao aplicativo de mensagens, gerando um cartão de visualização rico e convidativo.11 Além disso, a arquitetura baseada no App Router do Next.js permite a integração nativa de APIs, facilitando a comunicação segura com o banco de dados para submissões de formulários.11

### **Coreografia Visual e Animações de Alta Performance (GSAP)**

Transições CSS nativas são insuficientes para a coreografia visual complexa exigida por sites de casamento premiados. Para orquestrar animações de nível industrial, a tecnologia onipresente identificada nas pesquisas é o **GSAP (GreenSock Animation Platform)**.14  
O GSAP é uma biblioteca JavaScript robusta que manipula propriedades do Document Object Model (DOM) de forma altamente otimizada, evitando "reflows" custosos que causam travamentos em dispositivos móveis. A mágica da interatividade em sites como o de *Kloi & Patrick* ou vencedores do Awwwards advém primariamente do plugin ScrollTrigger do GSAP.14  
O ScrollTrigger vincula a execução de animações à posição exata da barra de rolagem do usuário, habilitando:

1. **Parallax Assíncrono:** Múltiplas camadas de imagens de fundo movimentando-se em velocidades diferentes em relação aos textos em primeiro plano, criando uma ilusão óptica de profundidade espacial e imersão 3D falsa.17  
2. **Revelações Tipográficas Textuais:** Títulos e citações amorosas que emergem do infinito, ou textos divididos em arrays de caracteres que se materializam letra por letra conforme o usuário faz o scroll.14  
3. **Controle de Linha do Tempo (Timelines):** A capacidade de agrupar animações em uma sequência lógica inquebrável. Por exemplo: o usuário rola a página, a imagem do casal desvanece suavemente para o fundo, a tela escurece e, logo em seguida, o itinerário do casamento surge flutuando a partir do eixo Y inferior. Essa precisão garante um ritmo narrativo impecável.14

Bibliotecas auxiliares, como o *Lenis*, são frequentemente acopladas ao GSAP para sequestrar o comportamento de rolagem nativo do navegador e aplicar uma inércia matemática, resultando em um "smooth scroll" amanteigado, sinônimo de design de luxo contemporâneo.15

### **O Metaverso no Navegador: WebGL, Three.js e React Three Fiber**

A fronteira final da criatividade técnica, evidenciada pelo projeto *LookBook*, reside na introdução de elementos espaciais genuínos através da renderização gráfica via GPU no navegador, utilizando a API WebGL.6 A manipulação direta do WebGL é matematicamente complexa; portanto, os desenvolvedores empregam o **Three.js**, uma biblioteca que abstrai as complexidades de câmeras, luzes e materiais tridimensionais.6  
Dentro do ecossistema React, o Three.js é consumido através do **React Three Fiber (R3F)**.6 O R3F é um renderizador que permite instanciar objetos 3D usando a sintaxe declarativa de componentes JSX do React.6 Esta arquitetura permite uma simbiose perfeita entre a interface bidimensional (botões, formulários) e o mundo 3D.11  
Aplicações práticas destas tecnologias em sites de casamento incluem:

* **Partículas Dinâmicas e Shaders GLSL:** Simulação de confetes dourados, pétalas de rosas caindo com gravidade realista ou efeitos de ondulação na água interagindo com o movimento do cursor do mouse, codificados através de *shaders* em linguagem GLSL processados diretamente na placa de vídeo.18  
* **Modelos 3D Importados:** Carregamento de arquivos .gltf ou .glb representando, por exemplo, o local histórico do evento em 3D, convites virtuais que podem ser girados 360 graus na tela ou simulações fotográficas complexas.22  
* **Física Interativa:** Utilização de motores de física integrados (como o Rapier via @react-three/rapier) para permitir que os usuários "joguem" com elementos flutuantes na tela que colidem entre si.11

O imperativo técnico no uso de WebGL é a otimização extrema. Texturas devem ser pré-carregadas e geometrias compactadas (ex: compressão Draco) para garantir que a aplicação não esgote a memória RAM ou a bateria dos dispositivos móveis dos convidados.6

### **Infraestrutura de Backend e Gestão de Estado**

Para gerenciar o estado mutável do evento — que engloba as confirmações de presença (RSVP), a contagem de acompanhantes, o mapeamento de restrições alimentares e a liquidez transacional da lista de presentes — a arquitetura demanda um backend de alta confiabilidade.  
Estudos de caso de desenvolvimento moderno (como aplicações Next.js para casamentos) frequentemente apontam para o uso do **PostgreSQL** hospedado em plataformas de Banco de Dados como Serviço (DBaaS), como Supabase ou Neon.11 A interação com esse banco de dados é modernamente feita utilizando um Object-Relational Mapping (ORM) avançado como o **Prisma**.11 O Prisma fornece segurança de tipagem (type-safety) ponta a ponta com TypeScript, garantindo que o formulário de frontend não envie dados malformados ao banco, prevenindo erros críticos na compilação da lista de convidados. A estilização final desses componentes é invariavelmente executada utilizando o framework de utilitários CSS **Tailwind CSS**, permitindo o desenvolvimento rápido de designs customizados sem inflar o tamanho final do arquivo de estilos.11

## **Engenharia da Lista de Presentes (Registry): UX/UI para Conversão e Encantamento**

A demanda explícita por "uma aba para poder cadastrar produtos" introduz o componente mais complexo do sistema: a Lista de Presentes. Sob a ótica da engenharia de software e do design de produto, a lista de presentes de casamento deixou de ser um mero catálogo estático atrelado a uma loja física. Ela evoluiu para uma aplicação de comércio eletrônico altamente sofisticada que deve equilibrar perfeitamente a eficiência transacional pragmática (usabilidade) com a sutileza e a conexão emocional exigidas pela etiqueta nupcial.24  
Estudos de caso aprofundados sobre o redesign de UX em plataformas colossais, como a reestruturação da lista de presentes da Amazon e pesquisas de produto realizadas pela Zola, concluem que a plataforma deve combater a "paralisia de decisão" do convidado e minimizar a fricção nas doações financeiras.24

### **A Revolução do "Universal Registry" e Categorização Inteligente**

O padrão-ouro atual do mercado (exemplificado por gigantes como Joy, Zola e MyRegistry) é a arquitetura de **Lista de Presentes Universal (Universal Registry)**.26 Em termos práticos de software, isso significa que a aba de presentes não é um catálogo de loja fechado, mas um agregador agnóstico de dados.  
Para viabilizar isso tecnicamente "de uma maneira legal", a plataforma deve incorporar uma funcionalidade de **Web Scraping**. Através de um painel de administração, os noivos inserem a URL de qualquer produto de qualquer loja online do mundo (seja uma batedeira na Amazon, louças em uma boutique artesanal local ou passagens aéreas em uma companhia de aviação). O servidor da plataforma (utilizando bibliotecas como Cheerio ou Puppeteer em Node.js) intercepta a URL, faz o parse das meta-tags *Open Graph* e esquemas *schema.org* da página alvo, e extrai automaticamente o título do produto, a imagem principal, o preço e a descrição, populando a tabela do banco de dados da lista de casamento instantaneamente.11  
**Arquitetura da Informação e Filtros:**  
Um convidado confrontado com uma lista de 150 itens sofrerá fadiga cognitiva. A organização sistêmica é obrigatória.

1. **Categorização Taxonômica:** Os produtos devem ser organizados em coleções semânticas. Experiências de UX refinadas abandonam listas lineares e agrupam itens em categorias como "Coração da Casa" (Cozinha), "Oásis" (Quarto e Banho), "Aventuras" (Itens para Lua de Mel) ou "Tradições do Casal" (Hobbies).29  
2. **Filtros de Faceta Dinâmicos (Client-side Filtering):** A interface deve possuir um painel de filtragem responsivo. Tecnologicamente, utilizando o gerenciamento de estado do React (ex: useContext ou Zustand), os convidados podem filtrar a matriz de produtos renderizada em tempo real, sem recarregar a página.11 Os filtros essenciais incluem:  
   * **Faixa de Preço (Price Tiers):** Deslizadores ou botões rápidos delimitando segmentos ($0-$50, $50-$150, $150+), garantindo que convidados com orçamentos restritos encontrem opções adequadas sem constrangimento.11  
   * **Status de Compra:** Um "toggle" para ocultar itens já adquiridos (Sold Out), limpando a interface de poluição visual de produtos indisponíveis.11  
   * **Rótulo de Prioridade ("Most Wanted"):** Um atributo booleano ativado pelos noivos no banco de dados que fixa uma insígnia visual atraente sobre o card do produto e orienta o algoritmo de ordenação para exibir esses itens no topo da grade.31

### **O Design "Bento Box" e Apresentação Visual**

As pesquisas de usabilidade demonstram que usuários modernos consomem conteúdo de planejamento de casamento em micro-momentos diários (o conceito de "snacking").24 Para maximizar o apelo visual, plataformas contemporâneas abandonaram a clássica lista em tabela em favor de layouts assimétricos no estilo **Bento-Box** ou Masonry Grid.24  
Na engenharia do frontend, isso significa utilizar CSS Grid (grid-template-areas) onde certos itens de alto valor ou experiências de lua de mel ocupam "tiles" (cartões) que se expandem por duas colunas ou duas linhas, enquanto itens menores de cozinha preenchem os espaços intersticiais menores. Esta hierarquia visual conduz o olhar do usuário e destaca presentes críticos sem necessitar de textos apelativos.

### **Engenharia Financeira: Financiamento Coletivo e Fundos em Dinheiro**

O maior obstáculo na conversão de uma lista de presentes envolve produtos de alto custo (ex: uma geladeira premium de R$ 5.000) e a solicitação de dinheiro vivo (Cash Funds), que historicamente carrega um estigma de falta de educação.31 A solução digital para isso divide-se em duas funcionalidades primárias:  
**1\. Financiamento Coletivo (Group Gifting):** Para itens caros, a lógica booleana do banco de dados (Comprado: Sim/Não) é substituída por uma arquitetura de financiamento coletivo (Crowdfunding). O item possui uma variável de "Preço Alvo" e "Valor Acumulado". Na interface (UI), isso se traduz em uma barra de progresso elegante em formato SVG, animada pelo GSAP, que preenche conforme as contribuições são registradas.11 Múltiplos convidados podem inserir frações monetárias (ex: R$ 100\) em direção ao preço total, permitindo que a compra de um item de luxo seja rateada entre amigos sem organização manual.11  
**2\. Fundos de Experiência e Gateways com Taxa Zero:** Para contornar o constrangimento de pedir dinheiro, plataformas inteligentes criam produtos virtuais atrelados a experiências intangíveis ("Jantar à Luz de Velas nas Maldivas", "Mergulho de Cilindro", "Fundo para o Novo Cachorrinho").31  
O grande diferencial competitivo (popularizado pela Joy) é a engenharia financeira do checkout. Em vez de utilizar processadores de cartão de crédito tradicionais (como Stripe) que cobram taxas retidas da doação (em torno de 2.5% a 3%), a plataforma integra-se diretamente via APIs de transferência Peer-to-Peer (P2P), como Venmo, PayPal, CashApp ou o equivalente local PIX.27 O fluxo de UX opera assim: o convidado seleciona a experiência de R$ 200, clica em "Contribuir", e um Modal limpo (Pop-up) exibe um QR Code dinâmico ou botão de integração profunda (Deep Link) que abre o aplicativo de banco do próprio convidado no celular, direcionando o valor integral e livre de taxas diretamente para a conta dos noivos. O sistema backend então escuta o webhook de confirmação ou permite que o usuário marque a contribuição como "Enviada" para atualizar a barra de progresso no site.27

## ---

**Documento de Requisitos de Produto (PRD)**

A seção a seguir materializa todo o escopo de inovação teórica e técnica discutido anteriormente em um Documento de Requisitos de Produto (Product Requirements Document) abrangente, prescritivo e acionável. Com este PRD em mãos, equipes de engenharia de software e design de produto possuirão a planta arquitetônica necessária para construir um portal de casamentos que se posicione no ápice do mercado global.

### **1\. Visão Geral do Produto e Objetivos Estratégicos**

A Plataforma "Aeterna" (Codinome provisório do Projeto) é uma aplicação web full-stack, com arquitetura "mobile-first", projetada para atuar simultaneamente como um hub logístico impecável, uma narrativa visual cinematográfica interativa e um terminal de e-commerce sem fricção.  
**Objetivo Primário:** Fornecer aos anfitriões (noivos) um painel de administração autônomo para gerenciamento granular de convidados e itens de desejo, enquanto entrega aos convidados uma interface frontend tridimensional, gamificada e de alto apelo emocional, coroada por um módulo de Lista de Presentes Universal com filtragem facetada e pagamentos com taxa zero.

### **2\. Perfis de Usuário (User Personas)**

| Persona de Usuário | Motivações e Objetivos Principais | Dores e Fricções Históricas a Resolver |
| :---- | :---- | :---- |
| **Os Anfitriões (Admins)** | Comunicar o itinerário visualmente, compilar RSVPs sem esforço manual, unificar presentes físicos e fundos monetários. | Lidar com taxas extorsivas em dinheiro; frustração com templates visuais rígidos; caos no acompanhamento de dietas de convidados.11 |
| **O Convidado Convencional** | Confirmar presença via celular em segundos, acessar o mapa do local, adquirir um presente digno dentro do próprio orçamento financeiro. | Lentidão de carregamento móvel; obrigação de criar contas e senhas apenas para comprar um presente; navegação confusa em catálogos de presentes infinitos.38 |
| **O Convidado VIP (Padrinhos)** | Ter acesso a eventos exclusivos (ex: Jantar de Ensaio), articular a compra de presentes de altíssimo valor de forma conjunta. | Falta de privacidade da informação logística; ausência de infraestrutura segura para "vaquinhas" (crowdfunding) integradas ao site.36 |

### **3\. Requisitos Funcionais Principais (Core Features)**

O escopo do software é subdividido em Épicos de Produto lógicos.

#### **Épico 1: O Motor de Storytelling Imersivo e Gamificação Front-end**

A aplicação do convidado deve evocar encantamento imediato por intermédio de técnicas visuais de ponta baseadas em WebGL e animações atreladas à rolagem.

* **FR-1.1 Header Tridimensional & Parallax Atmosférico:** A seção de abertura (Hero) deve implementar uma cena desenvolvida em React Three Fiber. A tipografia com os nomes do casal flutuará sobre um ambiente reativo (ex: partículas de luz, simulação de água ou folhas). A cena em 3D reage continuamente ao movimento do mouse no desktop ou aos dados do giroscópio no dispositivo móvel.6  
* **FR-1.2 Gamificação Introdutória (Opcional):** Inspirado no case *katmattwedding.com*, os noivos podem habilitar um módulo de mini-jogo em HTML5 Canvas/WebGL substituindo a leitura passiva. Os usuários controlam avatares vetorizados em progressão lateral (side-scroller), coletando elementos simbólicos para revelar a data oficial do evento ao final do estágio.5  
* **FR-1.3 Nossa História Dirigida por ScrollTrigger:** A biografia do casal será um componente interativo vertical manipulado pelo framework GSAP. O design abandonará longos parágrafos estáticos. Conforme o usuário realiza o scroll, o componente ScrollTrigger orquestra micro-animações onde imagens sofrem transições focais (blur para foco) e sentenças de texto são reveladas sequencialmente em uma linha do tempo gráfica que guia o olhar para baixo.10

#### **Épico 2: Motor Lógico de RSVP e Controle Restrito de Itinerário**

O núcleo administrativo de confirmação de presença.

* **FR-2.1 Formulário Dinâmico Single-Page:** A interface de RSVP operará como um "Wizard" por etapas, renderizado sem recarregamento da página (usando o estado nativo do React e Framer Motion para transições visuais entre perguntas de múltipla escolha).12  
* **FR-2.2 Agrupamento Familiar e Lógica Relacional:** O sistema de banco de dados (via Prisma) processará a checagem com base no e-mail inserido. Se o e-mail estiver atrelado a dependentes no backend, a UI se adaptará em tempo real expandindo os formulários para solicitar a confirmação de acompanhantes específicos e suas restrições dietéticas em um único fluxo unificado.41  
* **FR-2.3 Visibilidade Logística Condicional (JWT Authorization):** A página de cronograma possuirá renderização condicional rígida. Eventos da lista base (Cerimônia, Festa) são visíveis globalmente. Contudo, nós de dados sobre eventos restritos (ex: Jantar de Ensaio, Despedida de Solteiro) só serão renderizados no Document Object Model (DOM) se o token JWT de autenticação do usuário logado pertencer ao grupo de "Convidados VIP" configurado pelos noivos.40

#### **Épico 3: O Ecossistema de E-commerce e Lista de Presentes**

A arquitetura do "Registry" deve operar de forma híbrida: atuando como um agregador de URLs externas e um gateway processador nativo para transações.

| ID do Requisito | Funcionalidade Específica | Detalhamento Técnico & Engenharia UI/UX |
| :---- | :---- | :---- |
| **FR-3.1** | **Scraping de Lista Universal** | Os noivos possuirão um painel de input de URLs no dashboard administrativo. O backend (Next.js API route) executa um script de web scraping (cheerio ou API de enriquecimento de links) focado em extrair meta-tags Open Graph (og:title, og:image) da URL inserida, salvando automaticamente o produto de qualquer site da internet (Amazon, boutiques locais) diretamente no banco de dados da plataforma.11 |
| **FR-3.2** | **Grade Bento-Box Assimétrica** | Na página do convidado, a lista é renderizada não como uma tabela, mas como um grid responsivo em estilo "Bento Box". O algoritmo de frontend de CSS Grid alocará itens de alto valor ou experiências em cartões (cards) de tamanhos proeminentes (2x2), intercalados harmoniosamente com presentes menores (1x1), facilitando a leitura visual.24 |
| **FR-3.3** | **Filtros de Faceta com Mutação Instantânea** | Integração de um painel lateral fixo (sticky menu) no topo contendo opções de filtro. Utilizando Array.filter() combinado ao Contexto do React, os convidados podem segmentar a matriz de presentes instantaneamente por: Categorias conceituais ("Cozinha", "Aventuras"), Faixa de Preço (ex: Abaixo de R$100), Status de Disponibilidade, e Rótulo especial de "Mais Desejados".11 |
| **FR-3.4** | **Módulo de Financiamento Coletivo Dinâmico** | Suporte arquitetural para o padrão "Group Gifting". Para itens configurados com valor alto no banco, o cartão exibe uma meta matemática. A interface do React utiliza barras progressivas dinâmicas (tags \<progress\> ou construções SVG animadas) que visualizam a porcentagem financiada em tempo real. Convidados imputam frações customizadas para preencher o alvo.11 |
| **FR-3.5** | **Fluxo de "Guest Checkout" sem Fricção** | Capacidade de concretizar pagamentos (sejam parciais para grupos ou fundos totais em dinheiro) descartando a necessidade de cadastro de senha do usuário. O estado de identificação do comprador baseia-se em armazenamento de sessão (localStorage), atrelando um e-mail de recebimento do recibo, garantindo conversão máxima.36 |
| **FR-3.6** | **Gateway P2P Sem Taxas de Intermediação** | Integração direta para contribuições de "Lua de Mel" e afins que burle os 3% de processamento de provedoras de cartão. A UI de pagamento gera um código QR dinâmico gerado nativamente no backend mapeando para o identificador PIX, Venmo ou PayPal do casal. A doação é processada em infraestrutura paralela de conta bancária, entregando 100% do fundo de forma gratuita.27 |

### **4\. Requisitos Não Funcionais (Arquitetura, Performance e Segurança)**

Para suportar as pesadas bibliotecas de animação e 3D de maneira estável, a infraestrutura deve ser implacavelmente polida.

* **NFR-1 Renderização Híbrida e Hospedagem Edge:** A plataforma exigirá a utilização de um ambiente de implantação otimizado para o framework Next.js, como a rede Vercel.42 Páginas com alto tráfego contendo narrativas gráficas e imagens do casal devem passar pelo processo de Geração de Site Estático (SSG), assegurando que ativos visuais e HTML bruto sejam servidos a partir de nós da Content Delivery Network (CDN) globais, atingindo um tempo de resposta de primeira pintura visual inferior a 1,5 segundos. Em contrapartida, a rota da Lista de Presentes e da validação do RSVP necessita de Server-Side Rendering (SSR) e revalidação estática incremental (ISR) para garantir que o banco de dados assegure que dois usuários simultâneos não possam comprar o mesmo presente por causa de armazenamento de cache obsoleto.11  
* **NFR-2 Gestão e Compressão de Ativos Tridimensionais:** Qualquer modelo geométrico de extensão .gltf ou .glb demandado pelo React Three Fiber (seja a capa reflexiva do álbum no estilo LookBook ou elementos decorativos flutuantes) deve ser processado com o algoritmo de compressão agressivo Draco.6 Nenhum arquivo singular deve superar a cota de 2.5 MB para manter o site utilizável via redes celulares 4G e evitar o superaquecimento do dispositivo do usuário (thermal throttling). A interface também instanciará funções baseadas em IntersectionObserver, paralisando renderizações 3D em Canvas e animações do GSAP sempre que o usuário realizar rolagem para longe da área visível.22  
* **NFR-3 Escalabilidade de Banco de Dados Relacional:** Devido à natureza interconectada das informações vitais do casamento (Tabela de Convidado \-\> Tabela de Grupo Familiar \-\> Tabela de RSVP \-\> Tabela de Restrição Alimentar \-\> Tabela de Transações de Presentes), bancos não-relacionais estritos são desaconselhados. A arquitetura utilizará de preferência instâncias de **PostgreSQL** orquestradas através do ORM **Prisma**, garantindo que as transações de pagamento via Grupo sejam blindadas pelo conceito ACID (Atomicidade, Consistência, Isolamento e Durabilidade).11  
* **NFR-4 UX Responsiva Mobile-First:** Sabendo que a gigantesca parcela do tráfego das listas de convidados acontece via smartphones 9, o esqueleto principal construído com Tailwind CSS precisa ser nativamente mobile.11 Isso implica na adoção de tipografia reativa (uso de valores clamp() em propriedades CSS font-size), menus colapsáveis "off-canvas", e superfícies de botões tateáveis ("touch targets") com dimensionamento ergonômico mínimo de 48x48 pixels, principalmente nos pontos de conversão críticos: Confirmar Presença e Proceder ao Checkout de Presentes.12

### **5\. Critérios de Aceite Sistêmico e Validação Final**

A aprovação do desenvolvimento do software ficará condicionada ao cumprimento das métricas a seguir:

1. **Índice de Performance (Google Lighthouse):** Nas métricas fundamentais de experiência da página (Core Web Vitals) compreendendo *Largest Contentful Paint* (LCP), *First Input Delay* (FID) e *Cumulative Layout Shift* (CLS), a pontuação orgânica não poderá ser inferior a 90 pontos na auditoria Desktop, não obstante o alto carregamento de WebGL e Scripts de animação do GSAP.  
2. **Taxa de Sucesso na Transação Frontend:** No tocante à funcionalidade descrita de Financiamento Coletivo de Presentes via P2P/Modal QR, o fluxo de design para o checkout (após o clique na grade Bento) deve envolver não mais do que 3 cliques até a consolidação gráfica da meta financeira atualizada.  
3. **Acessibilidade Universal (a11y):** Considerando que as festividades nupciais abrigam convidados através de grande espectro geracional (dos avós do casal aos parceiros corporativos), a aplicação acatará fielmente os padrões de acessibilidade WCAG 2.1 nível AA. Isso envolve legibilidade estrita nas opções de cor da fonte sobre fundos parallax e garantia de navegação integral do teclado (Tab Indexing) para convidados que interajam com formulários complexos de RSVP ou naveguem pelos filtros da lista de presentes sem utilização de mouse.45

## **Síntese Arquitetural Final**

O abismo evolutivo entre plataformas casuais e a concepção de um site de casamento tecnologicamente luxuoso está centralizado na execução primorosa de customização algorítmica. Conforme elucidado nesta pesquisa global e parametrizado através do Documento de Requisitos (PRD), a fórmula matemática para atingir uma excelência indisputável envolve a conjugação de um gerenciamento de conteúdo e backend implacável, robusto e relacional (abstraído pela stack de Next.js, Prisma e Postgres) com a orquestração cenográfica imersiva liderada pelo trio Three.js, React e GSAP ScrollTrigger. O balanço magistral entre a engenhosidade transacional da "Lista de Presentes Universal" – desprovida de taxas e com categorização fluidamente responsiva – e o magnetismo do storytelling tridimensional assegura que a plataforma final transcenderá sua utilidade básica. A aplicação se consolidará, de fato, na primeira experiência cinematográfica e inesquecível da celebração, forjando o elo inicial autêntico entre os anfitriões e todos os envolvidos em sua narrativa.

#### **Referências citadas**

1. How to Create a Wedding Website Builder Platform: The CIS Guide, acessado em março 5, 2026, [https://www.cisin.com/coffee-break/how-to-create-a-website-for-wedding.html](https://www.cisin.com/coffee-break/how-to-create-a-website-for-wedding.html)  
2. CSS Design Awards \- Website Awards \- Best Web Design Inspiration \- CSS Awards, acessado em março 5, 2026, [https://www.cssdesignawards.com/](https://www.cssdesignawards.com/)  
3. Awwwards \- Website Awards \- Best Web Design Trends, acessado em março 5, 2026, [https://www.awwwards.com/](https://www.awwwards.com/)  
4. Willardson Wedding \- CSS Design Awards, acessado em março 5, 2026, [https://www.cssdesignawards.com/sites/willardson-wedding/45858/](https://www.cssdesignawards.com/sites/willardson-wedding/45858/)  
5. Wedding Invite Game (2023) \- Katherine Liu, acessado em março 5, 2026, [https://katherineliu.me/wedding-game](https://katherineliu.me/wedding-game)  
6. LookBook, acessado em março 5, 2026, [https://www.mattkettelkamp.com/projects/lookbook](https://www.mattkettelkamp.com/projects/lookbook)  
7. Louis Paquet \- Awwwards, acessado em março 5, 2026, [https://www.awwwards.com/louispaquet/](https://www.awwwards.com/louispaquet/)  
8. 25+ Beautiful Wedding Website Examples For Inspiration (2026) \- Site Builder Report, acessado em março 5, 2026, [https://www.sitebuilderreport.com/inspiration/wedding-websites-examples](https://www.sitebuilderreport.com/inspiration/wedding-websites-examples)  
9. 27 Beautiful Wedding Website Examples to Inspire Your Own \- WedSites Blog, acessado em março 5, 2026, [https://blog.wedsites.com/21-beautiful-wedding-website-examples-to-inspire-you/](https://blog.wedsites.com/21-beautiful-wedding-website-examples-to-inspire-you/)  
10. 23 Beautiful Wedding Website "Our Story" Examples That Wow Guests \- Joy, acessado em março 5, 2026, [https://withjoy.com/blog/23-beautiful-wedding-website-our-story-examples-that-wow-guests/](https://withjoy.com/blog/23-beautiful-wedding-website-our-story-examples-that-wow-guests/)  
11. fderuiter/wedding\_website: Next.js wedding site. Vercel Hobby. Tailwind. Prisma. TypeScript. Data scraper. \- GitHub, acessado em março 5, 2026, [https://github.com/fderuiter/wedding\_website](https://github.com/fderuiter/wedding_website)  
12. Building a Wedding Website with Next.js, Supabase, and Tailwind CSS \- DEV Community, acessado em março 5, 2026, [https://dev.to/mmmagicmike/building-a-wedding-website-with-nextjs-supabase-and-tailwind-css-2k8o](https://dev.to/mmmagicmike/building-a-wedding-website-with-nextjs-supabase-and-tailwind-css-2k8o)  
13. A wedding website in ReactJS \- by Rossella Ferrandino \- Medium, acessado em março 5, 2026, [https://medium.com/@rferrandino.tokyo/a-wedding-website-in-reactjs-9b05f112e56d](https://medium.com/@rferrandino.tokyo/a-wedding-website-in-reactjs-9b05f112e56d)  
14. Elevating My Developer Portfolio: A Deep Dive into Next.js, Three.js, GSAP, and SCSS, acessado em março 5, 2026, [https://medium.com/@ahmadfaraz00710/elevating-my-developer-portfolio-a-deep-dive-into-next-js-three-js-gsap-and-scss-bac5f711401d](https://medium.com/@ahmadfaraz00710/elevating-my-developer-portfolio-a-deep-dive-into-next-js-three-js-gsap-and-scss-bac5f711401d)  
15. Joffrey Spitzer Portfolio: A Minimalist Astro \+ GSAP Build with Reveals, Flip Transitions and Subtle Motion | Codrops, acessado em março 5, 2026, [https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/](https://tympanus.net/codrops/2026/02/18/joffrey-spitzer-portfolio-a-minimalist-astro-gsap-build-with-reveals-flip-transitions-and-subtle-motion/)  
16. gsap-scrolltrigger · GitHub Topics, acessado em março 5, 2026, [https://github.com/topics/gsap-scrolltrigger?l=javascript](https://github.com/topics/gsap-scrolltrigger?l=javascript)  
17. Wedding Website Design Trends for 2025 \- petalandbloomtechmarketing.com, acessado em março 5, 2026, [https://petalandbloomtechmarketing.com/2025/04/02/2025s-most-captivating-wedding-website-design-trends-a-luxury-perspective/](https://petalandbloomtechmarketing.com/2025/04/02/2025s-most-captivating-wedding-website-design-trends-a-luxury-perspective/)  
18. Sites Of The Year \- Awwwards, acessado em março 5, 2026, [https://www.awwwards.com/websites/sites\_of\_the\_year/](https://www.awwwards.com/websites/sites_of_the_year/)  
19. Best Three.js Websites | Web Design Inspiration \- Awwwards, acessado em março 5, 2026, [https://www.awwwards.com/websites/three-js/](https://www.awwwards.com/websites/three-js/)  
20. Animated Wedding Invitations | 7 Card Reveals & 33 Effects | Invyt, acessado em março 5, 2026, [https://invyt.io/animated-wedding-invitations](https://invyt.io/animated-wedding-invitations)  
21. Three.js \- Codrops, acessado em março 5, 2026, [https://tympanus.net/codrops/tag/three-js/](https://tympanus.net/codrops/tag/three-js/)  
22. Build React 3D Animation Website | ThreeJS (WebGi), GSAP \- YouTube, acessado em março 5, 2026, [https://www.youtube.com/watch?v=ZFGX29ZI52U](https://www.youtube.com/watch?v=ZFGX29ZI52U)  
23. WIP: My Interactive Portfolio with Three.js, GSAP, and ES6 \- Showcase, acessado em março 5, 2026, [https://discourse.threejs.org/t/wip-my-interactive-portfolio-with-three-js-gsap-and-es6/78377](https://discourse.threejs.org/t/wip-my-interactive-portfolio-with-three-js-gsap-and-es6/78377)  
24. A Streamlined User Experience for Zola's Registry & Wedding Planning Tools \- Everyday Industries, acessado em março 5, 2026, [https://everydayindustries.com/casestudy/zola/](https://everydayindustries.com/casestudy/zola/)  
25. Amazon Wedding Registry Redesign Cross Functional Team Project | UX Design, acessado em março 5, 2026, [https://www.yanquanchen.com/project/amzwrredesign/](https://www.yanquanchen.com/project/amzwrredesign/)  
26. Create the Best Universal Wedding Registry \- MyRegistry.com, acessado em março 5, 2026, [https://www.myregistry.com/wedding-registry.aspx](https://www.myregistry.com/wedding-registry.aspx)  
27. 17 Best Wedding Registry Sites That Make Gift Lists Easy (2026) \- Joy, acessado em março 5, 2026, [https://withjoy.com/blog/17-best-wedding-registry-sites-that-make-gift-lists-easy-2026/](https://withjoy.com/blog/17-best-wedding-registry-sites-that-make-gift-lists-easy-2026/)  
28. 23 Coolest Modern Wedding Registry Picks of 2025 \- Joy, acessado em março 5, 2026, [https://withjoy.com/blog/23-coolest-modern-wedding-registry-picks-of-2025/](https://withjoy.com/blog/23-coolest-modern-wedding-registry-picks-of-2025/)  
29. 75 Amazing Amazon Wedding Registry Ideas \- Junebug Weddings, acessado em março 5, 2026, [https://junebugweddings.com/wedding-blog/amazing-amazon-wedding-registry-ideas/](https://junebugweddings.com/wedding-blog/amazing-amazon-wedding-registry-ideas/)  
30. Top Wedding Registry Ideas \+ Advice for Curating Your Gift List \- Zola, acessado em março 5, 2026, [https://www.zola.com/expert-advice/wedding-registry-ideas](https://www.zola.com/expert-advice/wedding-registry-ideas)  
31. 15 Wedding Registry Secrets to Get the Gifts You Really Want \- Zola, acessado em março 5, 2026, [https://www.zola.com/expert-advice/wedding-registry-tips](https://www.zola.com/expert-advice/wedding-registry-tips)  
32. Wedding Website Examples and Designs That Are \*Actually\* Helpful \- The Knot, acessado em março 5, 2026, [https://www.theknot.com/content/creative-wedding-websites](https://www.theknot.com/content/creative-wedding-websites)  
33. Browse wedding ui ux designs \- Dribbble, acessado em março 5, 2026, [https://dribbble.com/search/wedding-ui-ux](https://dribbble.com/search/wedding-ui-ux)  
34. Curating a Luxury Wedding Gift Registry: Tips and Trends, acessado em março 5, 2026, [https://curatedevents.com/blog/curating-a-luxury-wedding-gift-registry-tips-and-trends/](https://curatedevents.com/blog/curating-a-luxury-wedding-gift-registry-tips-and-trends/)  
35. How to Build a Wedding Registry Everyone Will Love \- \- Chateau Bee, acessado em março 5, 2026, [https://chateaubeeselection.com/how-to-build-a-wedding-registry/](https://chateaubeeselection.com/how-to-build-a-wedding-registry/)  
36. Create a wedding gift list online \- your guide to building a dream registry, acessado em março 5, 2026, [https://www.weddingshop.com/inspiration/wedding-planning/wedding-gift-list-online](https://www.weddingshop.com/inspiration/wedding-planning/wedding-gift-list-online)  
37. The magic of wedding registry group gifting, acessado em março 5, 2026, [https://www.weddingshop.com/inspiration/wedding-planning/wedding-registry-group-gifting](https://www.weddingshop.com/inspiration/wedding-planning/wedding-registry-group-gifting)  
38. Create Your Dream Wedding Registry \- Joy, acessado em março 5, 2026, [https://withjoy.com/registry/](https://withjoy.com/registry/)  
39. Best Wedding Websites & Registries for 2026: Top Picks for Your Big Day \- GuestCam, acessado em março 5, 2026, [https://guestcam.co/blog/best-wedding-websites-and-registries](https://guestcam.co/blog/best-wedding-websites-and-registries)  
40. 7 Best Wedding Websites of 2025 | Paperless Post, acessado em março 5, 2026, [https://www.paperlesspost.com/blog/best-wedding-websites/](https://www.paperlesspost.com/blog/best-wedding-websites/)  
41. 11 Top-Rated Wedding Websites with RSVP Features (Real Couples' Picks) \- Joy, acessado em março 5, 2026, [https://withjoy.com/blog/11-top-rated-wedding-websites-with-rsvp-features-real-couples-picks/](https://withjoy.com/blog/11-top-rated-wedding-websites-with-rsvp-features-real-couples-picks/)  
42. Building a wedding website \- Mapsam, acessado em março 5, 2026, [https://mapsam.com/posts/building-a-wedding-website](https://mapsam.com/posts/building-a-wedding-website)  
43. A 3D Interactive Portfolio Website Built with Three.js, React, and Vite \- Showcase, acessado em março 5, 2026, [https://discourse.threejs.org/t/a-3d-interactive-portfolio-website-built-with-three-js-react-and-vite/87997](https://discourse.threejs.org/t/a-3d-interactive-portfolio-website-built-with-three-js-react-and-vite/87997)  
44. Three.js and Gsap, acessado em março 5, 2026, [https://gsap.com/community/forums/topic/29721-threejs-and-gsap/](https://gsap.com/community/forums/topic/29721-threejs-and-gsap/)  
45. Andrew Grano \- UI Developer and Designer, acessado em março 5, 2026, [https://www.andrewgrano.com/](https://www.andrewgrano.com/)
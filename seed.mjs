const API_URL = "https://dev.codeleap.co.uk/careers/";

const usernames = [
  "alice_dev",
  "bob_labs",
  "carol_io",
  "dan_codes",
  "eve_tech",
  "frank_hacks",
];

const posts = [
  {
    username: "alice_dev",
    title: "Por que TypeScript mudou minha vida",
    content:
      "Depois de anos escrevendo JavaScript sem tipos, finalmente adotei TypeScript no meu projeto principal. A quantidade de bugs que pego em tempo de compilação é surreal. Nunca mais volto.",
  },
  {
    username: "bob_labs",
    title: "Docker para devs iniciantes",
    content:
      "Se você ainda não usa Docker no seu fluxo de desenvolvimento, está perdendo tempo. Containerizar sua aplicação resolve o clássico 'funciona na minha máquina' de uma vez por todas.",
  },
  {
    username: "carol_io",
    title: "React vs Vue em 2026",
    content:
      "Trabalhei com ambos em projetos reais esse ano. React tem ecossistema maior, mas Vue tem uma curva de aprendizado bem mais suave. Para times pequenos, Vue entrega mais velocidade inicial.",
  },
  {
    username: "dan_codes",
    title: "Git rebase ou merge? A resposta definitiva",
    content:
      "Depois de muito debate no time, chegamos num consenso: rebase para branches de feature, merge para integração na main. Histórico limpo sem perder contexto das integrações.",
  },
  {
    username: "eve_tech",
    title: "Minha stack favorita para APIs REST",
    content:
      "Node.js + Fastify + Prisma + PostgreSQL. Simples, performático e com ótima DX. O Fastify em especial surpreende pela velocidade comparado ao Express.",
  },
  {
    username: "frank_hacks",
    title: "CSS Grid finalmente faz sentido pra mim",
    content:
      "Passei anos evitando Grid e usando Flexbox pra tudo. Um dia resolvi aprender de verdade e percebi que Grid resolve em 3 linhas o que o Flexbox precisaria de 15.",
  },
  {
    username: "alice_dev",
    title: "Burnout técnico: como identifiquei e saí",
    content:
      "Chegou um ponto que abrir o VSCode me dava ansiedade. Tirei duas semanas sem codar, li livros físicos, saí pra caminhar. Voltei com energia renovada e perspectiva diferente sobre prazos.",
  },
  {
    username: "bob_labs",
    title: "Porque ainda uso PostgreSQL em tudo",
    content:
      "NoSQL tem seu lugar, mas para 90% dos projetos que faço, PostgreSQL resolve com elegância. JSONB quando preciso de flexibilidade, relações quando preciso de consistência. Best of both worlds.",
  },
  {
    username: "carol_io",
    title: "Automatizando tarefas chatas com Node.js",
    content:
      "Criei um script que formata, valida e sobe meus posts de blog automaticamente. O que levava 20 minutos agora leva 30 segundos. Automação bem feita é libertadora.",
  },
  {
    username: "dan_codes",
    title: "Code review: como dar feedback sem destruir ninguém",
    content:
      "Aprendi que 'isso está errado' mata motivação. Prefiro: 'que tal tentar X aqui? Tive boa experiência com isso porque Y'. Mesma informação, muito mais receptividade.",
  },
  {
    username: "eve_tech",
    title: "Monorepo com Turborepo: vale a pena?",
    content:
      "Migrei um projeto com 4 pacotes separados para um monorepo com Turborepo. Setup inicial doeu, mas o cache de builds e a consistência entre pacotes compensaram em 2 semanas.",
  },
  {
    username: "frank_hacks",
    title: "Vim keybindings: produtividade real ou placebo?",
    content:
      "Passei 1 mês usando Vim keybindings no VSCode. Resultado: navego muito mais rápido em arquivos grandes, mas o ganho em arquivos pequenos é marginal. Vale se você lida com muito código legado.",
  },
  {
    username: "alice_dev",
    title: "Testes unitários vs integração: onde investir?",
    content:
      "Depois de várias experiências, prefiro menos testes unitários e mais testes de integração. Unitários testam implementação, integração testa comportamento. Comportamento é o que importa pro usuário.",
  },
  {
    username: "bob_labs",
    title: "WebSockets em 2026: ainda relevante?",
    content:
      "Com SSE e HTTP/2 push resolvendo muitos casos de uso, WebSockets parece overkill às vezes. Mas para apps com comunicação bidirecional real (jogos, colaboração), ainda não tem substituto.",
  },
  {
    username: "carol_io",
    title: "Como aprendo uma nova tecnologia do zero",
    content:
      "Meu método: 1) documentação oficial por 1 hora, 2) projeto pequeno do zero sem tutorial, 3) só depois videos/cursos para preencher gaps. Aprender fazendo retém muito mais.",
  },
  {
    username: "dan_codes",
    title: "O dia que um regex destruiu nosso banco",
    content:
      "Um regex mal feito em validação de input causou ReDoS e derrubou a API por 40 minutos. Desde então: regex simples ou bibliotecas de validação. Nunca mais escrevo regex complexo sem testar carga.",
  },
  {
    username: "eve_tech",
    title: "Tailwind CSS: o que ninguém te conta",
    content:
      "A produtividade inicial é real, mas o HTML fica verboso. A solução: componentes. Quando você extrai components bem, o Tailwind brilha. Sem abstração de componentes, vira pesadelo de manutenção.",
  },
  {
    username: "frank_hacks",
    title: "Café e código: minha rotina matinal",
    content:
      "Acordo às 6h, café sem tela por 30 minutos, depois 90 minutos de deep work antes de abrir Slack ou email. Esse bloco matinal vale mais que o resto do dia. Protejo ele como reunião sagrada.",
  },
  {
    username: "alice_dev",
    title: "Por que documentação inline é subestimada",
    content:
      "Não é sobre comentar o óbvio. É sobre explicar o POR QUE de decisões não óbvias. '// Workaround para bug X no Safari 15.3' salva horas de investigação futura.",
  },
  {
    username: "bob_labs",
    title: "Kubernetes: preciso mesmo disso?",
    content:
      "Para a maioria dos projetos: não. Um VPS com Docker Compose resolve, custa menos e você entende o que está acontecendo. K8s faz sentido com múltiplos serviços, múltiplos devs e necessidade real de escala.",
  },
  {
    username: "carol_io",
    title: "Acessibilidade não é opcional",
    content:
      "Passei a adicionar aria-labels e testar com leitor de tela em todo projeto. Além do impacto real na vida de usuários, melhora a estrutura semântica do HTML e ajuda em SEO. Win-win-win.",
  },
  {
    username: "dan_codes",
    title: "O mito do 10x developer",
    content:
      "O 10x developer não é o que digita mais rápido. É o que faz as perguntas certas antes de codar, encontra a solução simples, e multiplica a produtividade do time ao redor dele.",
  },
  {
    username: "eve_tech",
    title: "GraphQL no frontend: quando faz sentido",
    content:
      "GraphQL brilha quando o frontend precisa de queries flexíveis e o backend tem muitos domínios. Para APIs simples com 5 endpoints, REST é mais direto e fácil de debugar.",
  },
  {
    username: "frank_hacks",
    title: "Lendo código alheio: uma habilidade negligenciada",
    content:
      "Passei uma semana lendo o código-fonte do Fastify. Aprendi mais sobre design de APIs Node.js do que em qualquer curso. Ler código de projetos maduros ensina padrões que documentação não cobre.",
  },
  {
    username: "alice_dev",
    title: "Open source: minha primeira contribuição",
    content:
      "Sempre pareceu intimidador. Comecei corrigindo um typo na documentação de um projeto. Depois um bug pequeno. Hoje tenho 3 PRs mergeados em projetos relevantes. Comece pequeno, mas comece.",
  },
  {
    username: "bob_labs",
    title: "Segurança em APIs: o básico que muitos ignoram",
    content:
      "Rate limiting, validação de input, CORS configurado direito, headers de segurança. Não é difícil e evita 80% dos ataques comuns. OWASP Top 10 deveria ser leitura obrigatória para todo dev backend.",
  },
  {
    username: "carol_io",
    title: "Como estruturo meus projetos React",
    content:
      "Feature-based folders ao invés de type-based. /auth, /dashboard, /settings cada um com seus components, hooks e utils. Quando um feature cresce, está tudo junto. Quando deletar, deleta uma pasta.",
  },
  {
    username: "dan_codes",
    title: "SQL ainda é subestimado pelos devs modernos",
    content:
      "Window functions, CTEs, e queries analíticas fazem coisas em SQL que você levaria 50 linhas de JavaScript para replicar. Investir em SQL avançado é um dos melhores ROIs técnicos que tive.",
  },
  {
    username: "eve_tech",
    title: "Deploy contínuo: como chegamos lá",
    content:
      "Começamos com deploy manual quinzenal. Hoje fazemos 5-10 deploys por dia com confiança. A jornada: testes automatizados, feature flags, rollback automático. Cada passo tomou tempo, mas valeu.",
  },
  {
    username: "frank_hacks",
    title: "O que aprendi depois de 5 anos como dev",
    content:
      "Soft skills importam tanto quanto técnicas. Comunicar claramente um problema vale mais que resolver em silêncio. Pedir ajuda cedo é sinal de maturidade. E o melhor código é o que não precisa existir.",
  },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createPost(post) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  console.log(`Criando ${posts.length} posts na API CodeLeap...\n`);

  const createdIds = [];
  const total = posts.length;

  for (let i = 0; i < total; i++) {
    const post = posts[i];
    try {
      const result = await createPost(post);
      createdIds.push(result.id);
      console.log(`✓ [${i + 1}/${total}] "${post.title}"`);
    } catch (err) {
      console.error(`✗ [${i + 1}/${total}] Falha em "${post.title}": ${err.message}`);
    }

    if (i < total - 1) {
      await sleep(200);
    }
  }

  console.log(`\n─────────────────────────────────────`);
  console.log(`Posts criados: ${createdIds.length}/${total}`);
  console.log(`IDs: ${createdIds.join(", ")}`);
}

main();

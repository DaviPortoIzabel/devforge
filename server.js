const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : (process.env.RENDER ? "/tmp/devforge" : ROOT);
const DB_PATH = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : path.join(DATA_DIR, "devforge.db");

const ROUTES = {
  "/": "index.html",
  "/explore": path.join("explore", "index.html"),
  "/explore/": path.join("explore", "index.html"),
  "/messages": path.join("messages", "index.html"),
  "/messages/": path.join("messages", "index.html"),
  "/notifications": path.join("notifications", "index.html"),
  "/notifications/": path.join("notifications", "index.html"),
  "/settings": path.join("settings", "index.html"),
  "/settings/": path.join("settings", "index.html"),
  "/profile": path.join("profile", "index.html"),
  "/profile/": path.join("profile", "index.html"),
  "/profile/edit": path.join("profile", "edit", "index.html"),
  "/profile/edit/": path.join("profile", "edit", "index.html"),
  "/communities": path.join("communities", "index.html"),
  "/communities/": path.join("communities", "index.html"),
};

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const SEEDED_COMMUNITIES = [
  {
    id: "react-brasil",
    name: "React Brasil",
    shortName: "RB",
    description: "Frontend, React, Next.js e design systems para quem quer discutir codigo sem bagunca.",
    iconUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=240&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
    channels: [
      { id: "avisos", nome: "avisos" },
      { id: "geral", nome: "geral" },
      { id: "react-help", nome: "react-help" },
      { id: "portfolio", nome: "portfolio" },
    ],
  },
  {
    id: "nodejs-devs",
    name: "Node.js Devs",
    shortName: "ND",
    description: "Back-end, APIs, filas, workers e arquitetura para quem gosta de servico bem feito.",
    iconUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=240&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=80",
    channels: [
      { id: "avisos", nome: "avisos" },
      { id: "geral", nome: "geral" },
      { id: "apis", nome: "apis" },
      { id: "deploy", nome: "deploy" },
    ],
  },
  {
    id: "open-source",
    name: "Open Source",
    shortName: "OS",
    description: "Mantainers, documentacao, contribuicao e projetos abertos com ritmo saudavel.",
    iconUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=240&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    channels: [
      { id: "avisos", nome: "avisos" },
      { id: "geral", nome: "geral" },
      { id: "contribuicoes", nome: "contribuicoes" },
      { id: "docs", nome: "docs" },
    ],
  },
];

const SEEDED_USERS = [
  {
    name: "Lucas Silva",
    username: "lucassilva",
    password: "123456",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
    bannerColor: "#4159c7",
    title: "Desenvolvedor full stack focado em comunidade e portfolio",
    bio: "Crio produtos para devs com interface simples, portfolio forte e conversa clara entre comunidades.",
    githubUrl: "https://github.com/lucassilva",
    communities: ["react-brasil", "nodejs-devs", "open-source"],
    profile: {
      principais: [
        {
          id: "lucas-main-1",
          titulo: "Arquitetura para comunidades de programadores",
          subtitulo: "Case principal",
          descricao: "Estruturei fluxos de comunidade, exploracao e portfolio para um produto social com cara de ferramenta real.",
          imagem: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          link: "https://github.com/lucassilva",
          animacao: "suave",
        },
        {
          id: "lucas-main-2",
          titulo: "Sistema de portfolio editavel",
          subtitulo: "Produto e UX",
          descricao: "Modelei um portfolio modular com principais, honras e experiencias para cada pessoa mostrar prova visual do proprio trabalho.",
          imagem: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "rolagem",
        },
        {
          id: "lucas-main-3",
          titulo: "Fluxo de conta local com SQLite",
          subtitulo: "Base escalavel",
          descricao: "Preparei cadastro, login, sessoes, comunidades e persistencia local para depois subir o produto com mais seguranca.",
          imagem: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "zoom",
        },
      ],
      honras: [
        {
          id: "lucas-honor-1",
          titulo: "Top contribuidor no React Brasil",
          subtitulo: "Destaque da comunidade",
          descricao: "Reconhecido por ajudar no refinamento de interfaces, portfolios e clareza de produto.",
          imagem: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "suave",
        },
        {
          id: "lucas-honor-2",
          titulo: "Mentoria de portfolio para devs iniciantes",
          subtitulo: "Impacto real",
          descricao: "Conduzi revisoes praticas para transformar perfis genericos em apresentacoes mais fortes e objetivas.",
          imagem: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "rolagem",
        },
      ],
      experiencias: [
        {
          id: "lucas-exp-1",
          titulo: "Senior Full Stack Developer",
          subtitulo: "TechCorp Solutions",
          descricao: "Liderei entregas com foco em produto, front-end estruturado e servicos locais para acelerar validacao.",
          imagem: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "normal",
        },
        {
          id: "lucas-exp-2",
          titulo: "Platform Engineer",
          subtitulo: "Studio Atlas",
          descricao: "Padronizei componentes, organizacao visual e regras de persistencia para dashboards e comunidades internas.",
          imagem: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "zoom",
        },
      ],
    },
  },
  {
    name: "Beatriz Ramos",
    username: "beatrizramos",
    password: "123456",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    bannerUrl: "",
    bannerColor: "#5b4fd7",
    title: "Mentora de front-end e design systems",
    bio: "Ajudo times a deixarem interfaces mais claras, consistentes e faceis de usar.",
    githubUrl: "https://github.com/beatrizramos",
    communities: ["react-brasil"],
    profile: {
      principais: [
        {
          id: "bia-main-1",
          titulo: "Design system para squads pequenos",
          subtitulo: "React Brasil",
          descricao: "Criei um conjunto de componentes e regras visuais para diminuir retrabalho e acelerar entregas.",
          imagem: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
          link: "https://github.com/beatrizramos",
          animacao: "suave",
        },
      ],
      honras: [
        {
          id: "bia-honor-1",
          titulo: "Mentora destaque",
          subtitulo: "React Brasil",
          descricao: "Reconhecida por ajudar devs iniciantes a organizarem portfolio e apresentacao profissional.",
          imagem: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "rolagem",
        },
      ],
      experiencias: [
        {
          id: "bia-exp-1",
          titulo: "Lead Front-end Engineer",
          subtitulo: "Studio Bolt",
          descricao: "Atuo com bibliotecas de componentes, acessibilidade e produtos orientados a comunidade.",
          imagem: "https://images.unsplash.com/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "normal",
        },
      ],
    },
  },
  {
    name: "Marina Costa",
    username: "marinacosta",
    password: "123456",
    avatarUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
    bannerUrl: "",
    bannerColor: "#3b728f",
    title: "Open source strategist",
    bio: "Transformo contribuicoes em processos simples e portfolios com prova de trabalho.",
    githubUrl: "https://github.com/marinacosta",
    communities: ["open-source", "react-brasil"],
    profile: {
      principais: [
        {
          id: "mar-main-1",
          titulo: "Playbook de contribuicao aberta",
          subtitulo: "Open Source",
          descricao: "Organizei onboarding, issues e trilhas de contribuicao para facilitar entrada de novos membros.",
          imagem: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
          link: "https://github.com/marinacosta",
          animacao: "suave",
        },
      ],
      honras: [
        {
          id: "mar-honor-1",
          titulo: "Curadoria de docs",
          subtitulo: "Comunidade open source",
          descricao: "Destaque por reduzir ruido e transformar explicacoes longas em orientacoes objetivas.",
          imagem: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "zoom",
        },
      ],
      experiencias: [
        {
          id: "mar-exp-1",
          titulo: "Community Programs Lead",
          subtitulo: "Open Collective Lab",
          descricao: "Coordeno experiencias de comunidade e definicao de trilhas para contribuidores recorrentes.",
          imagem: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "normal",
        },
      ],
    },
  },
  {
    name: "Rafael Souza",
    username: "rafaelsouza",
    password: "123456",
    avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    bannerUrl: "",
    bannerColor: "#384f9b",
    title: "Moderador e engenheiro de produto",
    bio: "Gosto de interfaces enxutas, comunidades bem organizadas e produto sem ruido.",
    githubUrl: "https://github.com/rafaelsouza",
    communities: ["react-brasil"],
    profile: {
      principais: [
        {
          id: "raf-main-1",
          titulo: "Fluxo de comunidade sem excesso visual",
          subtitulo: "Moderacao",
          descricao: "Desenhei canais e regras simples para que qualquer pessoa entenda rapido onde falar.",
          imagem: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "rolagem",
        },
      ],
      honras: [],
      experiencias: [
        {
          id: "raf-exp-1",
          titulo: "Product Engineer",
          subtitulo: "React Brasil",
          descricao: "Uno estrutura de comunidade com entregas de produto e feedback continuo.",
          imagem: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "normal",
        },
      ],
    },
  },
  {
    name: "Marcos Lima",
    username: "marcoslima",
    password: "123456",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
    bannerUrl: "",
    bannerColor: "#2b6d87",
    title: "Back-end engineer",
    bio: "Prefiro fluxo claro, APIs simples e deploy sem surpresas.",
    githubUrl: "https://github.com/marcoslima",
    communities: ["nodejs-devs"],
    profile: {
      principais: [
        {
          id: "marcos-main-1",
          titulo: "APIs locais com SQLite",
          subtitulo: "Node.js Devs",
          descricao: "Monto bases simples para validar produto, sessao e persistencia antes de escalar.",
          imagem: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "suave",
        },
      ],
      honras: [],
      experiencias: [
        {
          id: "marcos-exp-1",
          titulo: "Backend Engineer",
          subtitulo: "Cloud Dock",
          descricao: "Atuo com servicos HTTP, filas, automacao e modelagem orientada a produto.",
          imagem: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
          link: "",
          animacao: "normal",
        },
      ],
    },
  },
];

const USER_ALIASES = {
  lucas: "lucassilva",
  voce: "lucassilva",
  beatriz: "beatrizramos",
  marina: "marinacosta",
  rafael: "rafaelsouza",
  marcos: "marcoslima",
};

const SEEDED_MESSAGES = [
  { kind: "community", communityId: "react-brasil", channelId: "geral", authorUsername: "rafaelsouza", body: "O ideal aqui e manter tudo pequeno e claro, sem muita informacao jogada.", time: "11:00" },
  { kind: "community", communityId: "react-brasil", channelId: "geral", authorUsername: "lucassilva", body: "Concordo. O perfil precisa parecer portfolio, nao painel generico.", time: "11:06" },
  { kind: "community", communityId: "react-brasil", channelId: "geral", authorUsername: "beatrizramos", body: "Se o canal estiver claro, a pessoa entende rapido onde perguntar e onde mostrar trabalho.", time: "11:12" },
  { kind: "community", communityId: "react-brasil", channelId: "portfolio", authorUsername: "marinacosta", body: "Seu perfil precisa mostrar prova do que voce fez logo de cara.", time: "14:10" },
  { kind: "community", communityId: "react-brasil", channelId: "portfolio", authorUsername: "beatrizramos", body: "Menos texto solto e mais imagem com contexto muda tudo.", time: "14:18" },
  { kind: "community", communityId: "react-brasil", channelId: "react-help", authorUsername: "beatrizramos", body: "Para formularios longos, eu separo persistencia, validacao e apresentacao.", time: "13:16" },
  { kind: "community", communityId: "nodejs-devs", channelId: "geral", authorUsername: "marcoslima", body: "Quando o fluxo esta claro, o back-end fica muito mais previsivel.", time: "10:42" },
  { kind: "community", communityId: "nodejs-devs", channelId: "apis", authorUsername: "marcoslima", body: "Comecar com SQLite local ajuda muito a validar schema antes de qualquer deploy.", time: "12:01" },
  { kind: "community", communityId: "open-source", channelId: "geral", authorUsername: "marinacosta", body: "A melhor contribuicao continua sendo clareza: issue boa, docs boas e review bom.", time: "10:50" },
  { kind: "community", communityId: "open-source", channelId: "contribuicoes", authorUsername: "marinacosta", body: "Se o portfolio da pessoa tem prova visual, fica mais facil confiar no trabalho dela.", time: "15:11" },
  { kind: "direct", conversationWith: "beatrizramos", authorUsername: "beatrizramos", body: "A ideia esta boa, mas precisa ficar muito mais simples.", time: "09:10" },
  { kind: "direct", conversationWith: "beatrizramos", authorUsername: "lucassilva", body: "Sim. Quero deixar com cara de produto mesmo.", time: "09:11" },
  { kind: "direct", conversationWith: "beatrizramos", authorUsername: "beatrizramos", body: "Se quiser, eu reviso o portfolio depois que voce deixar os cards mais visuais.", time: "09:14" },
  { kind: "direct", conversationWith: "marinacosta", authorUsername: "marinacosta", body: "Quando o perfil virar portfolio de verdade, vai ficar muito mais forte.", time: "11:24" },
  { kind: "direct", conversationWith: "marinacosta", authorUsername: "lucassilva", body: "Boa. Quero que cada item tenha imagem, contexto e link quando fizer sentido.", time: "11:28" },
];

ensureDataDir();

const db = new DatabaseSync(DB_PATH);

initDatabase();
seedCommunities();
seedUsers();
seedMemberships();
migrateLegacyMessages();
seedMessages();
repairLegacyProfiles();

const server = http.createServer(async function handleRequest(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || HOST}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/api/")) {
      await handleApi(req, res, pathname);
      return;
    }

    serveStatic(res, pathname);
  } catch (error) {
    sendJson(res, 500, {
      error: "server_error",
      message: "Erro interno no servidor local.",
    });
  }
});

server.listen(PORT, HOST, function onListen() {
  console.log(`DevForge em http://${HOST}:${PORT}`);
  console.log("Conta demo: lucassilva / 123456");
  console.log(`Banco em: ${DB_PATH}`);
});

function ensureDataDir() {
  const targetDir = path.dirname(DB_PATH);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
}

function initDatabase() {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      avatar_url TEXT NOT NULL DEFAULT '',
      banner_url TEXT NOT NULL DEFAULT '',
      banner_color TEXT NOT NULL DEFAULT '#3d5afe',
      title TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      github_url TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id INTEGER PRIMARY KEY,
      principais_json TEXT NOT NULL DEFAULT '[]',
      honras_json TEXT NOT NULL DEFAULT '[]',
      experiencias_json TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS memberships (
      user_id INTEGER NOT NULL,
      community_id TEXT NOT NULL,
      joined_at TEXT NOT NULL,
      PRIMARY KEY (user_id, community_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kind TEXT NOT NULL,
      scope_id TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_avatar TEXT NOT NULL DEFAULT '',
      author_username TEXT NOT NULL DEFAULT '',
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS communities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon_url TEXT NOT NULL DEFAULT '',
      banner_url TEXT NOT NULL DEFAULT '',
      channels_json TEXT NOT NULL DEFAULT '[]',
      created_by_user_id INTEGER,
      created_at TEXT NOT NULL
    );
  `);

  ensureColumn("messages", "author_username", "TEXT NOT NULL DEFAULT ''");
  ensureColumn("communities", "created_by_user_id", "INTEGER");
  ensureColumn("communities", "channels_json", "TEXT NOT NULL DEFAULT '[]'");
  ensureColumn("users", "banner_url", "TEXT NOT NULL DEFAULT ''");
  ensureColumn("users", "banner_color", "TEXT NOT NULL DEFAULT '#3d5afe'");
}

function ensureColumn(tableName, columnName, definition) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  const exists = columns.some(function someColumn(column) {
    return column.name === columnName;
  });

  if (!exists) {
    db.exec(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
}

function seedCommunities() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO communities (
      id, name, short_name, description, icon_url, banner_url, channels_json, created_by_user_id, created_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  SEEDED_COMMUNITIES.forEach(function eachCommunity(community) {
    insert.run(
      community.id,
      community.name,
      community.shortName,
      community.description,
      community.iconUrl,
      community.bannerUrl,
      JSON.stringify(community.channels),
      null,
      new Date().toISOString(),
    );
  });
}

function seedUsers() {
  SEEDED_USERS.forEach(function eachUser(definition) {
    const userId = ensureUser(definition);
    ensureProfileRow(userId);
    ensureProfileSeed(userId, definition.profile, true);
  });
}

function ensureUser(definition) {
  const existing = db.prepare(`
    SELECT id, title, bio, github_url, avatar_url, banner_url, banner_color
    FROM users
    WHERE username = ?
  `).get(definition.username);

  if (!existing) {
    const result = db.prepare(`
      INSERT INTO users (name, username, password_hash, avatar_url, banner_url, banner_color, title, bio, github_url, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      definition.name,
      definition.username,
      hashPassword(definition.password),
      definition.avatarUrl,
      definition.bannerUrl || "",
      definition.bannerColor || "#3d5afe",
      definition.title,
      definition.bio,
      definition.githubUrl,
      new Date().toISOString(),
    );
    return Number(result.lastInsertRowid);
  }

  if (
    definition.username === "lucassilva" ||
    !existing.title ||
    !existing.bio ||
    !existing.github_url ||
    !existing.avatar_url ||
    !existing.banner_color
  ) {
    db.prepare(`
      UPDATE users
      SET name = ?, avatar_url = ?, banner_url = ?, banner_color = ?, title = ?, bio = ?, github_url = ?
      WHERE id = ?
    `).run(
      definition.name,
      definition.avatarUrl,
      definition.bannerUrl || existing.banner_url || "",
      definition.bannerColor || existing.banner_color || "#3d5afe",
      definition.title,
      definition.bio,
      definition.githubUrl,
      existing.id,
    );
  }

  return existing.id;
}

function ensureProfileRow(userId) {
  db.prepare(`
    INSERT OR IGNORE INTO profiles (user_id, principais_json, honras_json, experiencias_json)
    VALUES (?, '[]', '[]', '[]')
  `).run(userId);
}

function ensureProfileSeed(userId, profile, forceIfSparse) {
  const row = db.prepare(`
    SELECT principais_json, honras_json, experiencias_json
    FROM profiles
    WHERE user_id = ?
  `).get(userId);

  const current = {
    principais: normalizePortfolioItems(safeJsonArray(row && row.principais_json)),
    honras: normalizePortfolioItems(safeJsonArray(row && row.honras_json)),
    experiencias: normalizePortfolioItems(safeJsonArray(row && row.experiencias_json)),
  };

  const looksBroken = hasBrokenLegacyProfile(current);
  const sparse = totalPortfolioItems(current) < 2;

  if (!looksBroken && !(forceIfSparse && sparse)) {
    return;
  }

  saveProfile(userId, profile);
}

function hasBrokenLegacyProfile(profile) {
  return ["principais", "honras", "experiencias"].some(function someSection(section) {
    return (profile[section] || []).some(function someItem(item) {
      return String(item.titulo || "").trim() === "[object Object]";
    });
  });
}

function totalPortfolioItems(profile) {
  return ["principais", "honras", "experiencias"].reduce(function reduceTotal(total, section) {
    return total + (Array.isArray(profile[section]) ? profile[section].length : 0);
  }, 0);
}

function saveProfile(userId, profile) {
  db.prepare(`
    UPDATE profiles
    SET principais_json = ?, honras_json = ?, experiencias_json = ?
    WHERE user_id = ?
  `).run(
    JSON.stringify(normalizePortfolioItems(profile.principais)),
    JSON.stringify(normalizePortfolioItems(profile.honras)),
    JSON.stringify(normalizePortfolioItems(profile.experiencias)),
    userId,
  );
}

function seedMemberships() {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO memberships (user_id, community_id, joined_at)
    VALUES (?, ?, ?)
  `);

  SEEDED_USERS.forEach(function eachUser(definition) {
    const user = db.prepare("SELECT id FROM users WHERE username = ?").get(definition.username);
    if (!user) {
      return;
    }

    definition.communities.forEach(function eachCommunity(communityId) {
      insert.run(user.id, communityId, new Date().toISOString());
    });
  });
}

function migrateLegacyMessages() {
  const messages = db.prepare(`
    SELECT id, kind, scope_id, author_name, author_username
    FROM messages
    ORDER BY id ASC
  `).all();

  const update = db.prepare(`
    UPDATE messages
    SET scope_id = ?, author_name = ?, author_avatar = ?, author_username = ?
    WHERE id = ?
  `);

  messages.forEach(function eachMessage(message) {
    const resolvedUsername = resolveUsername(message.author_username || message.author_name || "");
    const authorUser = resolvedUsername ? getUserByUsername(resolvedUsername) : null;
    let scopeId = message.scope_id;

    if (message.kind === "direct" && !String(scopeId).startsWith("dm:")) {
      const otherUsername = resolveUsername(scopeId);
      if (otherUsername) {
        scopeId = getDirectScope("lucassilva", otherUsername);
      }
    }

    if (message.kind === "community" && !String(scopeId).includes(":")) {
      const guessedCommunity = resolveCommunity(scopeId);
      if (guessedCommunity) {
        scopeId = `${guessedCommunity.id}:geral`;
      }
    }

    if (!authorUser && scopeId === message.scope_id && resolvedUsername === (message.author_username || "")) {
      return;
    }

    update.run(
      scopeId,
      authorUser ? authorUser.name : String(message.author_name || "").trim() || "Membro",
      authorUser ? authorUser.avatar_url : "",
      authorUser ? authorUser.username : resolvedUsername,
      message.id,
    );
  });
}

function resolveCommunity(value) {
  const normalized = slugify(value);
  return getCommunityRow(normalized);
}

function resolveUsername(value) {
  const key = normalizeKey(value);
  if (!key) {
    return "";
  }

  if (USER_ALIASES[key]) {
    return USER_ALIASES[key];
  }

  const exact = db.prepare("SELECT username FROM users WHERE username = ?").get(key);
  if (exact) {
    return exact.username;
  }

  const byUsers = db.prepare("SELECT username, name FROM users").all();
  const match = byUsers.find(function findMatch(user) {
    return normalizeKey(user.name) === key || normalizeKey(user.username) === key;
  });
  return match ? match.username : "";
}

function seedMessages() {
  const selectExisting = db.prepare(`
    SELECT id
    FROM messages
    WHERE kind = ? AND scope_id = ? AND author_username = ? AND body = ?
  `);
  const insert = db.prepare(`
    INSERT INTO messages (kind, scope_id, author_name, author_avatar, author_username, body, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  SEEDED_MESSAGES.forEach(function eachSeed(message) {
    const author = getUserByUsername(message.authorUsername);
    if (!author) {
      return;
    }

    const scopeId = message.kind === "community"
      ? `${message.communityId}:${message.channelId}`
      : getDirectScope("lucassilva", message.conversationWith);

    if (selectExisting.get(message.kind, scopeId, author.username, message.body)) {
      return;
    }

    insert.run(
      message.kind,
      scopeId,
      author.name,
      author.avatar_url,
      author.username,
      message.body,
      message.time,
    );
  });
}

function repairLegacyProfiles() {
  const profiles = db.prepare(`
    SELECT user_id, principais_json, honras_json, experiencias_json
    FROM profiles
  `).all();

  profiles.forEach(function eachProfile(profileRow) {
    const normalized = {
      principais: normalizePortfolioItems(safeJsonArray(profileRow.principais_json)),
      honras: normalizePortfolioItems(safeJsonArray(profileRow.honras_json)),
      experiencias: normalizePortfolioItems(safeJsonArray(profileRow.experiencias_json)),
    };

    if (hasBrokenLegacyProfile(normalized)) {
      const user = db.prepare("SELECT username FROM users WHERE id = ?").get(profileRow.user_id);
      const seed = SEEDED_USERS.find(function findSeed(item) {
        return item.username === (user && user.username);
      });
      if (seed) {
        saveProfile(profileRow.user_id, seed.profile);
        return;
      }
    }

    db.prepare(`
      UPDATE profiles
      SET principais_json = ?, honras_json = ?, experiencias_json = ?
      WHERE user_id = ?
    `).run(
      JSON.stringify(normalized.principais),
      JSON.stringify(normalized.honras),
      JSON.stringify(normalized.experiencias),
      profileRow.user_id,
    );
  });
}

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/session") {
    const session = getSession(req);
    if (!session) {
      sendJson(res, 200, {
        authenticated: false,
        demo: {
          username: "lucassilva",
          password: "123456",
        },
      });
      return;
    }

    sendJson(res, 200, buildSessionPayload(session.user_id));
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/api/users/")) {
    const username = decodeURIComponent(pathname.slice("/api/users/".length));
    const payload = buildPublicProfilePayload(username);
    if (!payload) {
      sendJson(res, 404, {
        error: "user_not_found",
        message: "Perfil nao encontrado.",
      });
      return;
    }

    sendJson(res, 200, payload);
    return;
  }

  if (req.method === "POST" && pathname === "/api/register") {
    const body = await readJsonBody(req);
    const name = String(body.name || "").trim();
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");

    if (!name || !username || password.length < 4) {
      sendJson(res, 400, {
        error: "invalid_register",
        message: "Preencha nome, usuario e uma senha com pelo menos 4 caracteres.",
      });
      return;
    }

    if (db.prepare("SELECT id FROM users WHERE username = ?").get(username)) {
      sendJson(res, 409, {
        error: "username_taken",
        message: "Esse nome de usuario ja existe.",
      });
      return;
    }

    const result = db.prepare(`
      INSERT INTO users (name, username, password_hash, avatar_url, banner_url, banner_color, title, bio, github_url, created_at)
      VALUES (?, ?, ?, '', '', '#3d5afe', '', '', '', ?)
    `).run(name, username, hashPassword(password), new Date().toISOString());

    const userId = Number(result.lastInsertRowid);
    ensureProfileRow(userId);

    createSession(res, userId);
    sendJson(res, 201, buildSessionPayload(userId));
    return;
  }

  if (req.method === "POST" && pathname === "/api/login") {
    const body = await readJsonBody(req);
    const username = normalizeUsername(body.username);
    const password = String(body.password || "");
    const user = db.prepare("SELECT id, password_hash FROM users WHERE username = ?").get(username);

    if (!user || !verifyPassword(password, user.password_hash)) {
      sendJson(res, 401, {
        error: "invalid_login",
        message: "Usuario ou senha invalidos.",
      });
      return;
    }

    createSession(res, user.id);
    sendJson(res, 200, buildSessionPayload(user.id));
    return;
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    const session = getSession(req);
    if (session) {
      db.prepare("DELETE FROM sessions WHERE token = ?").run(session.token);
    }
    clearSession(res);
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && pathname === "/api/profile") {
    const session = requireSession(req, res);
    if (!session) {
      return;
    }

    const body = await readJsonBody(req);
    const name = String(body.name || "").trim() || "Novo usuario";
    const title = String(body.title || "").trim();
    const bio = String(body.bio || "").trim();
    const githubUrl = String(body.githubUrl || "").trim();
    const avatarUrl = String(body.avatarUrl || "").trim();
    const bannerUrl = String(body.bannerUrl || "").trim();
    const bannerColor = normalizeColor(body.bannerColor) || "#3d5afe";

    db.prepare(`
      UPDATE users
      SET name = ?, title = ?, bio = ?, github_url = ?, avatar_url = ?, banner_url = ?, banner_color = ?
      WHERE id = ?
    `).run(name, title, bio, githubUrl, avatarUrl, bannerUrl, bannerColor, session.user_id);

    saveProfile(session.user_id, {
      principais: body.principais,
      honras: body.honras,
      experiencias: body.experiencias,
    });

    sendJson(res, 200, buildSessionPayload(session.user_id));
    return;
  }

  if (req.method === "POST" && pathname === "/api/communities/join") {
    const session = requireSession(req, res);
    if (!session) {
      return;
    }

    const body = await readJsonBody(req);
    const communityId = String(body.communityId || "");
    const community = getCommunityRow(communityId);

    if (!community) {
      sendJson(res, 400, {
        error: "invalid_community",
        message: "Comunidade invalida.",
      });
      return;
    }

    db.prepare(`
      INSERT OR IGNORE INTO memberships (user_id, community_id, joined_at)
      VALUES (?, ?, ?)
    `).run(session.user_id, communityId, new Date().toISOString());

    sendJson(res, 200, buildSessionPayload(session.user_id));
    return;
  }

  if (req.method === "POST" && pathname === "/api/communities") {
    const session = requireSession(req, res);
    if (!session) {
      return;
    }

    const body = await readJsonBody(req);
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const iconUrl = String(body.iconUrl || "").trim();
    const bannerUrl = String(body.bannerUrl || "").trim();

    if (name.length < 3 || description.length < 10) {
      sendJson(res, 400, {
        error: "invalid_community",
        message: "Informe um nome e uma descricao curta para criar o servidor.",
      });
      return;
    }

    const communityId = createUniqueCommunityId(name);
    const channels = [
      { id: "avisos", nome: "avisos" },
      { id: "geral", nome: "geral" },
      { id: "projetos", nome: "projetos" },
      { id: "portfolio", nome: "portfolio" },
    ];

    db.prepare(`
      INSERT INTO communities (
        id, name, short_name, description, icon_url, banner_url, channels_json, created_by_user_id, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      communityId,
      name,
      buildShortName(name),
      description,
      iconUrl,
      bannerUrl,
      JSON.stringify(channels),
      session.user_id,
      new Date().toISOString(),
    );

    db.prepare(`
      INSERT OR IGNORE INTO memberships (user_id, community_id, joined_at)
      VALUES (?, ?, ?)
    `).run(session.user_id, communityId, new Date().toISOString());

    sendJson(res, 201, buildSessionPayload(session.user_id));
    return;
  }

  if (req.method === "POST" && pathname === "/api/messages/community") {
    const session = requireSession(req, res);
    if (!session) {
      return;
    }

    const body = await readJsonBody(req);
    const communityId = String(body.communityId || "");
    const channelId = String(body.channelId || "");
    const message = String(body.body || "").trim();

    if (!communityId || !channelId || !message) {
      sendJson(res, 400, {
        error: "invalid_message",
        message: "Mensagem invalida.",
      });
      return;
    }

    const membership = db.prepare(`
      SELECT 1
      FROM memberships
      WHERE user_id = ? AND community_id = ?
    `).get(session.user_id, communityId);

    if (!membership) {
      sendJson(res, 403, {
        error: "forbidden",
        message: "Entre no servidor antes de mandar mensagem.",
      });
      return;
    }

    const user = db.prepare("SELECT name, username, avatar_url FROM users WHERE id = ?").get(session.user_id);
    db.prepare(`
      INSERT INTO messages (kind, scope_id, author_name, author_avatar, author_username, body, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      "community",
      `${communityId}:${channelId}`,
      user.name,
      user.avatar_url,
      user.username,
      message,
      getClockTime(),
    );

    sendJson(res, 200, buildSessionPayload(session.user_id));
    return;
  }

  if (req.method === "POST" && pathname === "/api/messages/direct") {
    const session = requireSession(req, res);
    if (!session) {
      return;
    }

    const body = await readJsonBody(req);
    const conversationId = normalizeUsername(body.conversationId);
    const message = String(body.body || "").trim();

    if (!conversationId || !message) {
      sendJson(res, 400, {
        error: "invalid_message",
        message: "Mensagem invalida.",
      });
      return;
    }

    const peer = getUserByUsername(conversationId);
    if (!peer) {
      sendJson(res, 404, {
        error: "user_not_found",
        message: "Conversa nao encontrada.",
      });
      return;
    }

    const user = db.prepare("SELECT name, username, avatar_url FROM users WHERE id = ?").get(session.user_id);
    db.prepare(`
      INSERT INTO messages (kind, scope_id, author_name, author_avatar, author_username, body, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      "direct",
      getDirectScope(user.username, peer.username),
      user.name,
      user.avatar_url,
      user.username,
      message,
      getClockTime(),
    );

    sendJson(res, 200, buildSessionPayload(session.user_id));
    return;
  }

  sendJson(res, 404, {
    error: "not_found",
    message: "Rota da API nao encontrada.",
  });
}

function buildSessionPayload(userId) {
  const user = db.prepare(`
    SELECT id, name, username, avatar_url, banner_url, banner_color, title, bio, github_url, created_at
    FROM users
    WHERE id = ?
  `).get(userId);
  const profile = getProfileByUserId(userId);
  const memberships = db.prepare(`
    SELECT community_id
    FROM memberships
    WHERE user_id = ?
    ORDER BY joined_at ASC
  `).all(userId).map(function mapMembership(item) {
    return item.community_id;
  });
  const communities = getCommunitiesForUser(user.id);
  const messages = getMessagesForUser(user);

  return {
    authenticated: true,
    user: mapUser(user),
    profile: profile,
    memberships: memberships,
    communities: communities,
    conversations: getConversationsForUser(user.username, messages.direct),
    communityMembers: getCommunityMembersMap(),
    messages: messages,
  };
}

function buildPublicProfilePayload(username) {
  const user = getUserByUsername(normalizeUsername(username));
  if (!user) {
    return null;
  }

  return {
    user: mapUser(user),
    profile: getProfileByUserId(user.id),
    communities: getCommunitiesForMember(user.id).map(function mapCommunity(item) {
      return {
        id: item.id,
        nome: item.name,
        icone: item.icon_url,
      };
    }),
  };
}

function getCommunitiesForUser(userId) {
  const joinedIds = new Set(db.prepare(`
    SELECT community_id
    FROM memberships
    WHERE user_id = ?
  `).all(userId).map(function mapRow(item) {
    return item.community_id;
  }));

  return db.prepare(`
    SELECT
      communities.id,
      communities.name,
      communities.short_name,
      communities.description,
      communities.icon_url,
      communities.banner_url,
      communities.channels_json,
      communities.created_by_user_id,
      COUNT(memberships.user_id) AS member_count
    FROM communities
    LEFT JOIN memberships ON memberships.community_id = communities.id
    GROUP BY communities.id
    ORDER BY communities.created_at ASC, communities.name ASC
  `).all().map(function mapCommunity(row) {
    return {
      id: row.id,
      nome: row.name,
      sigla: row.short_name,
      descricao: row.description,
      icone: sanitizeImageUrl(row.icon_url) || "",
      capa: sanitizeImageUrl(row.banner_url) || "",
      canais: safeJsonArray(row.channels_json).map(function mapChannel(channel, index) {
        return {
          id: String(channel.id || `canal-${index}`),
          nome: String(channel.nome || channel.name || `canal-${index + 1}`),
        };
      }),
      memberCount: Number(row.member_count || 0),
      membros: formatMemberCount(Number(row.member_count || 0)),
      joined: joinedIds.has(row.id),
      createdByUserId: row.created_by_user_id ? Number(row.created_by_user_id) : null,
    };
  });
}

function getCommunitiesForMember(userId) {
  return db.prepare(`
    SELECT communities.id, communities.name, communities.icon_url
    FROM memberships
    JOIN communities ON communities.id = memberships.community_id
    WHERE memberships.user_id = ?
    ORDER BY memberships.joined_at ASC
  `).all(userId);
}

function getCommunityMembersMap() {
  const rows = db.prepare(`
    SELECT memberships.community_id, users.name, users.username, users.avatar_url, users.title
    FROM memberships
    JOIN users ON users.id = memberships.user_id
    ORDER BY users.name ASC
  `).all();

  return rows.reduce(function reduceMap(acc, row) {
    if (!acc[row.community_id]) {
      acc[row.community_id] = [];
    }
    acc[row.community_id].push({
      name: row.name,
      username: row.username,
      avatarUrl: row.avatar_url,
      title: row.title,
    });
    return acc;
  }, {});
}

function getMessagesForUser(user) {
  const directMessages = {};
  db.prepare(`
    SELECT scope_id, author_name, author_avatar, author_username, body, created_at
    FROM messages
    WHERE kind = 'direct'
    ORDER BY id ASC
  `).all().forEach(function eachMessage(item) {
    const otherUsername = getOtherDirectParticipant(item.scope_id, user.username);
    if (!otherUsername) {
      return;
    }

    if (!directMessages[otherUsername]) {
      directMessages[otherUsername] = [];
    }

    directMessages[otherUsername].push({
      author: item.author_name,
      authorUsername: item.author_username,
      avatar: item.author_avatar,
      text: item.body,
      time: item.created_at,
      own: item.author_username === user.username,
    });
  });

  const communityMessages = {};
  db.prepare(`
    SELECT scope_id, author_name, author_avatar, author_username, body, created_at
    FROM messages
    WHERE kind = 'community'
    ORDER BY id ASC
  `).all().forEach(function eachMessage(item) {
    if (!communityMessages[item.scope_id]) {
      communityMessages[item.scope_id] = [];
    }

    communityMessages[item.scope_id].push({
      author: item.author_name,
      authorUsername: item.author_username,
      avatar: item.author_avatar,
      text: item.body,
      time: item.created_at,
      own: item.author_username === user.username,
    });
  });

  return {
    direct: directMessages,
    community: communityMessages,
  };
}

function getConversationsForUser(username, directMap) {
  return Object.keys(directMap || {}).map(function mapConversation(otherUsername) {
    const peer = getUserByUsername(otherUsername);
    const thread = directMap[otherUsername] || [];
    const last = thread[thread.length - 1] || {};
    return {
      id: otherUsername,
      username: otherUsername,
      nome: peer ? peer.name : otherUsername,
      cargo: peer ? peer.title || "Membro" : "Membro",
      avatar: peer ? peer.avatar_url : "",
      lastMessage: last.text || "",
      lastTime: last.time || "",
    };
  }).sort(function sortConversations(a, b) {
    return String(b.lastTime).localeCompare(String(a.lastTime));
  });
}

function getProfileByUserId(userId) {
  const profile = db.prepare(`
    SELECT principais_json, honras_json, experiencias_json
    FROM profiles
    WHERE user_id = ?
  `).get(userId);

  return {
    principais: normalizePortfolioItems(safeJsonArray(profile && profile.principais_json)),
    honras: normalizePortfolioItems(safeJsonArray(profile && profile.honras_json)),
    experiencias: normalizePortfolioItems(safeJsonArray(profile && profile.experiencias_json)),
  };
}

function getCommunityRow(communityId) {
  return db.prepare("SELECT * FROM communities WHERE id = ?").get(communityId) || null;
}

function getUserByUsername(username) {
  return db.prepare(`
    SELECT id, name, username, avatar_url, banner_url, banner_color, title, bio, github_url, created_at
    FROM users
    WHERE username = ?
  `).get(username) || null;
}

function mapUser(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatar_url,
    bannerUrl: user.banner_url,
    bannerColor: user.banner_color,
    title: user.title,
    bio: user.bio,
    githubUrl: user.github_url,
    createdAt: user.created_at,
  };
}

function createUniqueCommunityId(name) {
  const base = slugify(name).slice(0, 32) || "servidor";
  let candidate = base;
  let index = 2;

  while (getCommunityRow(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }

  return candidate;
}

function buildShortName(name) {
  const letters = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(function mapPart(part) {
      return part[0].toUpperCase();
    })
    .join("");

  return letters || "SV";
}

function getDirectScope(usernameA, usernameB) {
  const pair = [normalizeUsername(usernameA), normalizeUsername(usernameB)].sort();
  return `dm:${pair[0]}:${pair[1]}`;
}

function getOtherDirectParticipant(scopeId, currentUsername) {
  const parts = String(scopeId || "").split(":");
  if (parts.length !== 3 || parts[0] !== "dm") {
    return "";
  }

  if (parts[1] === currentUsername) {
    return parts[2];
  }

  if (parts[2] === currentUsername) {
    return parts[1];
  }

  return "";
}

function getSession(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies.devforge_session;
  if (!token) {
    return null;
  }
  return db.prepare("SELECT token, user_id FROM sessions WHERE token = ?").get(token) || null;
}

function requireSession(req, res) {
  const session = getSession(req);
  if (!session) {
    sendJson(res, 401, {
      error: "unauthorized",
      message: "Voce precisa entrar na sua conta.",
    });
    return null;
  }
  return session;
}

function createSession(res, userId) {
  const token = crypto.randomBytes(24).toString("hex");
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
  db.prepare(`
    INSERT INTO sessions (token, user_id, created_at)
    VALUES (?, ?, ?)
  `).run(token, userId, new Date().toISOString());
  res.setHeader("Set-Cookie", `devforge_session=${token}; HttpOnly; Path=/; SameSite=Lax`);
}

function clearSession(res) {
  res.setHeader("Set-Cookie", "devforge_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
}

function serveStatic(res, pathname) {
  const routeFile = ROUTES[pathname] || pathname.slice(1);
  const filePath = path.normalize(path.join(ROOT, routeFile || ""));

  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    sendText(res, 404, "Pagina nao encontrada.");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const type = CONTENT_TYPES[extension] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
}

function parseCookies(cookieHeader) {
  return cookieHeader.split(";").reduce(function reduceCookies(acc, part) {
    const [rawKey, ...rawValue] = part.trim().split("=");
    if (!rawKey) {
      return acc;
    }
    acc[rawKey] = rawValue.join("=");
    return acc;
  }, {});
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  const [salt, expected] = String(storedHash || "").split(":");
  if (!salt || !expected) {
    return false;
  }
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(derived, "hex"));
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
}

function normalizeKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePortfolioItems(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(function mapItem(item, index) {
    if (typeof item === "string") {
      const text = item.trim();
      if (!text || text === "[object Object]") {
        return null;
      }

      return {
        id: `legacy-${index}`,
        titulo: text,
        subtitulo: "",
        descricao: "",
        imagem: "",
        link: "",
        animacao: "normal",
        bgColor: "",
        textColor: "",
      };
    }

    if (!item || typeof item !== "object") {
      return null;
    }

    const titulo = String(item.titulo || "").trim();
    const subtitulo = String(item.subtitulo || "").trim();
    const descricao = String(item.descricao || "").trim();
    const imagem = sanitizeImageUrl(item.imagem);
    const link = sanitizeUrl(item.link);
    const bgColor = normalizeColor(item.bgColor || item.corFundo || "");
    const textColor = normalizeColor(item.textColor || item.corTexto || "");
    const animacao = ["normal", "suave", "rolagem", "zoom"].includes(String(item.animacao || "").trim())
      ? String(item.animacao || "").trim()
      : "normal";

    if (!titulo && !descricao && !imagem) {
      return null;
    }

    return {
      id: String(item.id || `item-${index}`),
      titulo: titulo,
      subtitulo: subtitulo,
      descricao: descricao,
      imagem: imagem,
      link: link,
      animacao: animacao,
      bgColor: bgColor,
      textColor: textColor,
    };
  }).filter(Boolean);
}

function safeJsonArray(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function sanitizeUrl(value) {
  const stringValue = String(value || "").trim();
  if (!stringValue) {
    return "";
  }

  try {
    const parsed = new URL(stringValue);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : "";
  } catch (error) {
    return stringValue.startsWith("data:image/") ? stringValue : "";
  }
}

function sanitizeImageUrl(value) {
  return sanitizeUrl(value) || "";
}

function normalizeColor(value) {
  const stringValue = String(value || "").trim();
  if (!stringValue) {
    return "";
  }

  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(stringValue) ? stringValue : "";
}

function getClockTime() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function formatMemberCount(value) {
  if (value >= 1000) {
    const rounded = value >= 10000 ? Math.round(value / 1000) : Math.round((value / 1000) * 10) / 10;
    return `${String(rounded).replace(".", ",")} mil membros`;
  }
  return `${value} membros`;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  res.end(message);
}

function readJsonBody(req) {
  return new Promise(function resolveBody(resolve, reject) {
    let raw = "";
    req.on("data", function onData(chunk) {
      raw += chunk;
      if (raw.length > 1_000_000) {
        reject(new Error("payload_too_large"));
      }
    });
    req.on("end", function onEnd() {
      if (!raw) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

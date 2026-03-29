window.DevForge = window.DevForge || {};

(function registerData(ns) {
  const CHANNEL_META = {
    avisos: { titulo: "Avisos", subtitulo: "Atualizacoes importantes da comunidade" },
    geral: { titulo: "Geral", subtitulo: "Conversa aberta sobre codigo, produto e carreira" },
    "react-help": { titulo: "React Help", subtitulo: "Ajuda pratica para React e componentes" },
    portfolio: { titulo: "Portfolio", subtitulo: "Mostre trabalho, peca feedback e refine seu perfil" },
    apis: { titulo: "APIs", subtitulo: "Modelagem, integracao e clareza no back-end" },
    deploy: { titulo: "Deploy", subtitulo: "Infra simples, previsivel e facil de manter" },
    contribuicoes: { titulo: "Contribuicoes", subtitulo: "PRs, issues e colaboracao aberta" },
    docs: { titulo: "Docs", subtitulo: "Documentacao objetiva e onboarding sem ruido" },
    projetos: { titulo: "Projetos", subtitulo: "Espaco para ideias, demos e progresso de produto" },
  };

  ns.STORAGE_KEYS = {
    selectedCommunity: "devforge:selected-community",
    selectedChannel: "devforge:selected-channel",
    selectedConversation: "devforge:selected-conversation",
    profileView: "devforge:profile-view",
    tabPrefix: "devforge:tab:",
  };

  ns.NOTIFICACOES = [
    { id: "n1", tipo: "mencao", titulo: "Beatriz mencionou voce", texto: "Ela comentou no canal portfolio do React Brasil.", hora: "5 min" },
    { id: "n2", tipo: "comunidade", titulo: "Novo aviso no Node.js Devs", texto: "Entrou um assunto novo sobre APIs locais com SQLite.", hora: "24 min" },
    { id: "n3", tipo: "sistema", titulo: "Perfil salvo com sucesso", texto: "Suas alteracoes continuam persistidas no banco local.", hora: "1 h" },
  ];

  ns.PAGE_META = {
    community: { eyebrow: "Comunidade", title: "Comunidade", description: "Canais claros, conversa simples e pessoas acessiveis." },
    explore: { eyebrow: "Explorar", title: "Explorar", description: "Descubra servidores, entre em comunidades e crie as suas." },
    messages: { eyebrow: "Mensagens", title: "Mensagens", description: "Conversas privadas em um fluxo simples e direto." },
    notifications: { eyebrow: "Notificacoes", title: "Notificacoes", description: "Avisos importantes sem excesso visual." },
    settings: { eyebrow: "Configuracoes", title: "Configuracoes", description: "Sessao, conta e preferencias basicas." },
    profile: { eyebrow: "Perfil", title: "Portfolio", description: "Seu perfil funciona como portfolio dentro da rede." },
    "profile-edit": { eyebrow: "Editar perfil", title: "Editar portfolio", description: "Adicione titulo, imagem, descricao, link e animacao nos seus cards." },
  };

  ns.escapeHtml = function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, function replace(character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[character];
    });
  };

  ns.escapeAttr = ns.escapeHtml;

  ns.sanitizeUrl = function sanitizeUrl(value) {
    const stringValue = String(value || "").trim();
    if (!stringValue) {
      return "";
    }

    try {
      const parsed = new URL(stringValue);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString();
      }
    } catch (error) {
      if (stringValue.startsWith("data:image/")) {
        return stringValue;
      }
      return "";
    }

    return "";
  };

  ns.sanitizeImageUrl = function sanitizeImageUrl(value) {
    return ns.sanitizeUrl(value) || "";
  };

  ns.getInitials = function getInitials(value) {
    const parts = String(value || "").trim().split(/\s+/).filter(Boolean).slice(0, 2);
    if (!parts.length) {
      return "DF";
    }
    return parts.map(function mapPart(part) {
      return part[0].toUpperCase();
    }).join("");
  };

  ns.getFirstName = function getFirstName(value) {
    return String(value || "").trim().split(/\s+/)[0] || "";
  };

  ns.loadStorage = function loadStorage(key, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  };

  ns.saveStorage = function saveStorage(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  };

  ns.removeStorage = function removeStorage(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      return;
    }
  };

  ns.createPortfolioItem = function createPortfolioItem() {
    return {
      id: "item-" + Date.now() + "-" + Math.random().toString(16).slice(2, 8),
      titulo: "",
      subtitulo: "",
      descricao: "",
      imagem: "",
      link: "",
      animacao: "normal",
      bgColor: "",
      textColor: "",
    };
  };

  ns.getCommunities = function getCommunities(session) {
    return (session && Array.isArray(session.communities)) ? session.communities : [];
  };

  ns.getJoinedCommunities = function getJoinedCommunities(session) {
    return ns.getCommunities(session).filter(function filterCommunity(item) {
      return item.joined;
    });
  };

  ns.getCommunity = function getCommunity(session, communityId) {
    return ns.getCommunities(session).find(function findCommunity(item) {
      return item.id === communityId;
    }) || null;
  };

  ns.getConversations = function getConversations(session) {
    return (session && Array.isArray(session.conversations)) ? session.conversations : [];
  };

  ns.getConversation = function getConversation(session, conversationId) {
    return ns.getConversations(session).find(function findConversation(item) {
      return item.id === conversationId;
    }) || null;
  };

  ns.getChannelMeta = function getChannelMeta(communityId, channelId, channelName) {
    const base = CHANNEL_META[channelId] || {};
    return {
      titulo: base.titulo || formatChannelName(channelName || channelId || "geral"),
      subtitulo: base.subtitulo || "Conversa simples para a comunidade " + formatChannelName(communityId || "servidor"),
    };
  };

  ns.formatCount = function formatCount(value) {
    if (value >= 1000) {
      const rounded = value >= 10000 ? Math.round(value / 1000) : Math.round((value / 1000) * 10) / 10;
      return String(rounded).replace(".", ",") + " mil";
    }
    return String(value || 0);
  };

  ns.profilePath = function profilePath(username) {
    return username ? "/profile/?user=" + encodeURIComponent(username) : "/profile/";
  };

  ns.api = async function api(pathname, options) {
    if (window.location.protocol === "file:") {
      throw new Error("Abra o projeto pelo servidor local. Execute `node server.js` ou `start-devforge.bat` e entre em http://127.0.0.1:3000/");
    }

    const response = await window.fetch(pathname, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    }).catch(function onFetchError() {
      throw new Error("Servidor local indisponivel. Execute `node server.js` ou `start-devforge.bat` e abra http://127.0.0.1:3000/");
    });

    const data = await response.json().catch(function onError() {
      return {};
    });

    if (!response.ok) {
      const error = new Error(data.message || "Erro ao falar com o servidor local.");
      error.data = data;
      throw error;
    }

    return data;
  };

  function formatChannelName(value) {
    return String(value || "")
      .split("-")
      .map(function mapChunk(chunk) {
        return chunk ? chunk[0].toUpperCase() + chunk.slice(1) : "";
      })
      .join(" ")
      .trim();
  }
})(window.DevForge);

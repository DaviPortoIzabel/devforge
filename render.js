window.DevForge = window.DevForge || {};

(function registerRender(ns) {
  const ICONS = {
    explore: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"></circle><path d="m15.5 8.5-2.8 7-7 2.8 2.8-7z"></path></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-4 3V7a1 1 0 0 1 1-1Z"></path></svg>',
    bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a5 5 0 0 1 5 5v2.5c0 1.3.4 2.6 1.2 3.6l.8 1H5l.8-1A5.8 5.8 0 0 0 7 11.5V9a5 5 0 0 1 5-5Z"></path><path d="M10 19a2 2 0 1 0 4 0"></path></svg>',
    settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9v.2a1.9 1.9 0 1 1-3.8 0v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1.9 1.9 0 1 1 0-3.8h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1.9 1.9 0 1 1 3.8 0v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.2a1.9 1.9 0 1 1 0 3.8h-.2a1 1 0 0 0-.9.6Z"></path></svg>',
    hash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h14"></path><path d="M4 15h14"></path><path d="M10 3 8 21"></path><path d="m16 3-2 18"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>',
    logout: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 17l5-5-5-5"></path><path d="M20 12H9"></path><path d="M11 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5"></path></svg>',
    save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 13 4 4L19 7"></path></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4s2 .1 3 .4c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z"></path></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 3 18 18"></path><path d="M10.6 10.6A2 2 0 0 0 12 16a2 2 0 0 0 1.4-.6"></path><path d="M9.9 5.1A11.3 11.3 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-4 4.9"></path><path d="M6 6C3.7 7.7 2 12 2 12a16 16 0 0 0 10 7c1.3 0 2.4-.2 3.5-.6"></path></svg>',
    upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4"></path><path d="m7 9 5-5 5 5"></path><path d="M4 20h16"></path></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 1 0-7l1.5-1.5a5 5 0 0 1 7 7L17 13"></path><path d="M14 11a5 5 0 0 1 0 7L12.5 19.5a5 5 0 0 1-7-7L7 11"></path></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12"></path><path d="M18 6 6 18"></path></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7Z"></path></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>',
  };

  ns.icon = function icon(name) {
    return ICONS[name] || "";
  };

  ns.renderAvatar = function renderAvatar(name, imageUrl, size) {
    const safe = ns.sanitizeImageUrl(imageUrl);
    return `
      <span class="avatar avatar--${ns.escapeAttr(size || "md")}">
        ${safe ? `<img src="${ns.escapeAttr(safe)}" alt="${ns.escapeAttr(name)}">` : `<span class="avatar__fallback">${ns.escapeHtml(ns.getInitials(name))}</span>`}
      </span>
    `;
  };

  ns.renderPortfolioEditorRow = function renderPortfolioEditorRow(section, item) {
    const entry = { ...ns.createPortfolioItem(), ...(item || {}) };
    const animationLabels = {
      normal: "Sem animacao",
      suave: "Entrada suave",
      rolagem: "Ao rolar",
      zoom: "Zoom leve",
    };

    return `
      <article class="editor-card">
        <input type="hidden" data-field="id" value="${ns.escapeAttr(entry.id)}">
        <div class="field-grid">
          <label class="form-field">
            <span>Titulo</span>
            <input class="input" type="text" data-field="titulo" value="${ns.escapeAttr(entry.titulo)}" placeholder="Ex.: Top contributor">
          </label>
          <label class="form-field">
            <span>Subtitulo</span>
            <input class="input" type="text" data-field="subtitulo" value="${ns.escapeAttr(entry.subtitulo)}" placeholder="Ex.: Certificado ou contexto">
          </label>
          <label class="form-field field-grid__full">
            <span>Descricao</span>
            <textarea class="input input--textarea" data-field="descricao" placeholder="Explique esse item de forma objetiva">${ns.escapeHtml(entry.descricao)}</textarea>
          </label>
          <label class="form-field">
            <span>Imagem por URL</span>
            <input class="input" type="url" data-field="imagem" value="${ns.escapeAttr(entry.imagem)}" placeholder="https://">
          </label>
          <label class="form-field">
            <span>Link ou certificado</span>
            <input class="input" type="url" data-field="link" value="${ns.escapeAttr(entry.link)}" placeholder="https://">
          </label>
          <label class="form-field">
            <span>Imagem do arquivo</span>
            <label class="file-picker">
              <input class="file-picker__input" type="file" accept="image/*" data-image-file data-target-field="imagem">
              <span class="file-picker__button">${ns.icon("upload")}Escolher imagem</span>
              <span class="file-picker__text" data-file-name>Nenhum arquivo</span>
            </label>
          </label>
          <label class="form-field">
            <span>Animacao</span>
            <span class="select-shell">
              <select class="input input--select" data-field="animacao">
                ${Object.keys(animationLabels).map(function mapOption(option) {
                  return `<option value="${option}"${entry.animacao === option ? " selected" : ""}>${animationLabels[option]}</option>`;
                }).join("")}
              </select>
            </span>
          </label>
          <label class="form-field">
            <span>Fundo do bloco</span>
            <input class="input input--color" type="color" data-field="bgColor" value="${ns.escapeAttr(entry.bgColor || "#1b2438")}">
          </label>
          <label class="form-field">
            <span>Cor da fonte</span>
            <input class="input input--color" type="color" data-field="textColor" value="${ns.escapeAttr(entry.textColor || "#eef3ff")}">
          </label>
        </div>
        <div class="editor-card__actions">
          <button class="button button--secondary" type="button" data-remove-row>Remover</button>
        </div>
      </article>
    `;
  };

  ns.renderApp = function renderApp(ctx) {
    if (ctx.state.loading) {
      return '<div class="screen-center"><div class="loading-card">Carregando DevForge...</div></div>';
    }

    if (!ctx.state.session || !ctx.state.session.authenticated) {
      return renderAuth(ctx);
    }

    const meta = ns.PAGE_META[ctx.page] || ns.PAGE_META.community;

    return `
      <div class="shell page--${ns.escapeAttr(ctx.page)}">
        ${renderServerRail(ctx)}
        ${renderSidebar(ctx)}
        <div class="main-shell">
          <header class="topbar">
            <div>
              <p class="eyebrow">${ns.escapeHtml(meta.eyebrow)}</p>
              <h1>${ns.escapeHtml(meta.title)}</h1>
              <p class="topbar__description">${ns.escapeHtml(meta.description)}</p>
            </div>
            <a class="topbar__profile" href="${ctx.linkTo("profile")}">
              ${ns.renderAvatar(ctx.state.session.user.name, ctx.state.session.user.avatarUrl, "sm")}
              <span>${ns.escapeHtml(ns.getFirstName(ctx.state.session.user.name))}</span>
            </a>
          </header>
          <main class="main-content">
            ${renderPage(ctx)}
          </main>
        </div>
        ${ctx.state.previewProfile ? renderPreviewModal(ctx.state.previewProfile) : ""}
        ${ctx.state.showCreateCommunity ? renderCreateCommunityModal() : ""}
        ${ctx.state.showMembersPanel ? renderMembersDrawer(ctx) : ""}
      </div>
    `;
  };

  function renderAuth(ctx) {
    const isRegister = ctx.state.authMode === "register";
    return `
      <div class="screen-center">
        <section class="auth-card">
          <div class="auth-card__brand">
            <span class="brand-mark">DF</span>
            <div>
              <h1>DevForge</h1>
              <p>Rede social para programadores com comunidades, portfolio e conversa em portugues.</p>
            </div>
          </div>
          <div class="segment-control">
            <button class="segment-button ${!isRegister ? "is-active" : ""}" type="button" data-auth-mode="login">Entrar</button>
            <button class="segment-button ${isRegister ? "is-active" : ""}" type="button" data-auth-mode="register">Criar conta</button>
          </div>
          <form class="auth-form" data-auth-form="${isRegister ? "register" : "login"}">
            ${isRegister ? `
              <label class="form-field">
                <span>Nome</span>
                <input class="input" type="text" name="name" placeholder="Seu nome">
              </label>
            ` : ""}
            <label class="form-field">
              <span>Usuario</span>
              <input class="input" type="text" name="username" placeholder="lucassilva">
            </label>
            <label class="form-field">
              <span>Senha</span>
              <div class="password-field">
                <input class="input" type="password" name="password" placeholder="Sua senha">
                <button class="icon-button icon-button--inside" type="button" data-toggle-password aria-label="Mostrar senha">${ns.icon("eye")}</button>
              </div>
            </label>
            <button class="button button--primary" type="submit">${isRegister ? "Criar conta" : "Entrar"}</button>
          </form>
          <div class="auth-tip">
            <strong>Conta demo</strong>
            <span>Usuario: <code>lucassilva</code> / Senha: <code>123456</code></span>
          </div>
          ${ctx.state.error ? `<p class="error-text">${ns.escapeHtml(ctx.state.error)}</p>` : ""}
        </section>
      </div>
    `;
  }

  function renderServerRail(ctx) {
    const joined = ns.getJoinedCommunities(ctx.state.session);
    return `
      <aside class="server-rail">
        <a class="rail-button ${ctx.page === "explore" ? "is-active" : ""}" href="${ctx.linkTo("explore")}" title="Explorar">${ns.icon("explore")}</a>
        <div class="rail-list">
          ${joined.map(function mapCommunity(community) {
            const active = ctx.page === "community" && ctx.state.selectedCommunityId === community.id;
            return `
              <a class="rail-button rail-button--server ${active ? "is-active" : ""}" href="${ctx.linkTo("")}" data-community-switch data-community-id="${ns.escapeAttr(community.id)}" title="${ns.escapeAttr(community.nome)}">
                ${community.icone ? `<img src="${ns.escapeAttr(community.icone)}" alt="${ns.escapeAttr(community.nome)}">` : `<span class="rail-button__text">${ns.escapeHtml(community.sigla || ns.getInitials(community.nome))}</span>`}
              </a>
            `;
          }).join("")}
          <button class="rail-button rail-button--add" type="button" title="Criar servidor" data-open-create-community>${ns.icon("plus")}</button>
        </div>
        <div class="rail-bottom">
          <a class="rail-button ${ctx.page === "messages" ? "is-active" : ""}" href="${ctx.linkTo("messages")}" title="Mensagens">${ns.icon("chat")}</a>
          <a class="rail-button ${ctx.page === "notifications" ? "is-active" : ""}" href="${ctx.linkTo("notifications")}" title="Notificacoes">${ns.icon("bell")}</a>
          <a class="rail-button ${ctx.page === "settings" ? "is-active" : ""}" href="${ctx.linkTo("settings")}" title="Configuracoes">${ns.icon("settings")}</a>
        </div>
      </aside>
    `;
  }

  function renderSidebar(ctx) {
    if (ctx.page === "community") {
      return renderCommunitySidebar(ctx);
    }

    if (ctx.page === "messages") {
      const conversations = ns.getConversations(ctx.state.session);
      return `
        <aside class="sidebar">
          <div class="sidebar__header">
            <h2>Mensagens</h2>
            <p>Conversas privadas entre pessoas.</p>
          </div>
          <div class="list-simple">
            ${conversations.length ? conversations.map(function mapConversation(item) {
              const active = item.id === ctx.state.selectedConversationId;
              return `
                <button class="list-button ${active ? "is-active" : ""}" type="button" data-conversation-id="${ns.escapeAttr(item.id)}">
                  ${ns.renderAvatar(item.nome, item.avatar, "sm")}
                  <div>
                    <strong>${ns.escapeHtml(item.nome)}</strong>
                    <span>${ns.escapeHtml(item.lastMessage || item.cargo)}</span>
                  </div>
                </button>
              `;
            }).join("") : '<div class="empty-text">Suas conversas privadas vao aparecer aqui.</div>'}
          </div>
        </aside>
      `;
    }

    if (ctx.page === "explore") {
      return `
        <aside class="sidebar">
          <div class="sidebar__header">
            <h2>Explorar</h2>
            <p>Entre em servidores pelo nome ou crie o seu.</p>
          </div>
          <div class="sidebar-note">
            <strong>${ns.escapeHtml(String((ctx.state.session.memberships || []).length))} servidores</strong>
            <span>Quem cria conta nova comeca sem nenhum servidor.</span>
          </div>
        </aside>
      `;
    }

    if (ctx.page === "profile" || ctx.page === "profile-edit" || ctx.page === "settings") {
      return renderProfileSidebar(ctx);
    }

    return `
      <aside class="sidebar">
        <div class="sidebar__header">
          <h2>Notificacoes</h2>
          <p>Avisos importantes e atualizacoes da conta.</p>
        </div>
      </aside>
    `;
  }

  function renderProfileSidebar(ctx) {
    const isOwn = !ctx.state.viewedUsername || ctx.state.viewedUsername === ctx.state.session.user.username;
    const source = getProfileSource(ctx);
    return `
      <aside class="sidebar">
        <div class="sidebar-profile">
          ${ns.renderAvatar(source.user.name, source.user.avatarUrl, "lg")}
          <strong>${ns.escapeHtml(source.user.name)}</strong>
          <span>@${ns.escapeHtml(source.user.username)}</span>
        </div>
        <div class="list-simple">
          <a class="list-button ${ctx.page === "profile" ? "is-active" : ""}" href="${isOwn ? ctx.linkTo("profile") : ns.profilePath(source.user.username)}"><strong>Perfil</strong><span>Portfolio publico</span></a>
          ${isOwn ? `<a class="list-button ${ctx.page === "profile-edit" ? "is-active" : ""}" href="${ctx.linkTo("profile/edit")}"><strong>Editar perfil</strong><span>Cards, imagem e animacao</span></a>` : ""}
          <a class="list-button ${ctx.page === "settings" ? "is-active" : ""}" href="${ctx.linkTo("settings")}"><strong>Configuracoes</strong><span>Sessao e conta</span></a>
        </div>
      </aside>
    `;
  }

  function renderCommunitySidebar(ctx) {
    const joined = ns.getJoinedCommunities(ctx.state.session);
    const community = ns.getCommunity(ctx.state.session, ctx.state.selectedCommunityId || (joined[0] && joined[0].id));

    if (!community) {
      return `
        <aside class="sidebar">
          <div class="sidebar__header">
            <h2>Sem servidor</h2>
            <p>Entre em um servidor no explorar para comecar.</p>
          </div>
          <a class="button button--primary button--full" href="${ctx.linkTo("explore")}">Ir para explorar</a>
        </aside>
      `;
    }

    return `
      <aside class="sidebar">
        <div class="server-card">
          ${community.capa ? `<img class="server-card__cover" src="${ns.escapeAttr(community.capa)}" alt="${ns.escapeAttr(community.nome)}">` : ""}
          <div class="server-card__body">
            <strong>${ns.escapeHtml(community.nome)}</strong>
            <span>${ns.escapeHtml(community.membros)}</span>
            <p>${ns.escapeHtml(community.descricao)}</p>
          </div>
        </div>
        <div class="channel-list">
          ${community.canais.map(function mapChannel(channel) {
            const active = channel.id === ctx.state.selectedChannelId;
            return `
              <button class="channel-button ${active ? "is-active" : ""}" type="button" data-channel-id="${ns.escapeAttr(channel.id)}">
                ${ns.icon("hash")}
                <span>${ns.escapeHtml(channel.nome)}</span>
              </button>
            `;
          }).join("")}
        </div>
      </aside>
    `;
  }

  function renderPage(ctx) {
    switch (ctx.page) {
      case "explore":
        return renderExplorePage(ctx);
      case "messages":
        return renderMessagesPage(ctx);
      case "notifications":
        return renderNotificationsPage();
      case "settings":
        return renderSettingsPage();
      case "profile":
        return renderProfilePage(ctx);
      case "profile-edit":
        return renderProfileEditPage(ctx);
      default:
        return renderCommunityPage(ctx);
    }
  }

  function renderCommunityPage(ctx) {
    const joined = ns.getJoinedCommunities(ctx.state.session);
    const community = ns.getCommunity(ctx.state.session, ctx.state.selectedCommunityId || (joined[0] && joined[0].id));

    if (!community) {
      return `
        <section class="panel empty-panel">
          <h2>Voce ainda nao entrou em nenhum servidor</h2>
          <p>Explore comunidades, encontre gente da area e entre nas que fizerem sentido para voce.</p>
          <a class="button button--primary" href="${ctx.linkTo("explore")}">Explorar servidores</a>
        </section>
      `;
    }

    const channel = community.canais.find(function findChannel(item) {
      return item.id === ctx.state.selectedChannelId;
    }) || community.canais[0];
    const meta = ns.getChannelMeta(community.id, channel.id, channel.nome);
    const scope = `${community.id}:${channel.id}`;
    const messages = (ctx.state.session.messages && ctx.state.session.messages.community && ctx.state.session.messages.community[scope]) || [];

    return `
        <section class="panel community-panel">
          <div class="community-panel__head community-panel__head--stack">
            <div>
              <h2># ${ns.escapeHtml(meta.titulo)}</h2>
              <p>${ns.escapeHtml(meta.subtitulo)}</p>
            </div>
            <button class="icon-button section-action" type="button" data-toggle-members aria-label="Mostrar membros">${ns.icon("menu")}</button>
          </div>
        <div class="message-list">
          ${messages.length ? messages.map(renderCommunityMessage).join("") : '<div class="empty-text">Ainda nao ha mensagens nesse canal.</div>'}
        </div>
        <form class="composer" data-community-message-form>
          <input type="text" class="input" name="message" placeholder="Mandar mensagem em #${ns.escapeAttr(meta.titulo)}">
          <button class="button button--primary" type="submit">Enviar</button>
        </form>
      </section>
    `;
  }

  function renderExplorePage(ctx) {
    const communities = ns.getCommunities(ctx.state.session);
    return `
      <div class="stack">
        <section class="panel">
          <p class="eyebrow">Explorar</p>
          <h2>Encontre comunidades para entrar</h2>
          <p>O botao de criar servidor agora fica na rail da esquerda, logo abaixo dos servidores em que voce ja esta.</p>
        </section>
        <div class="community-grid">
          ${communities.map(function mapCommunity(community) {
            return `
              <article class="community-card">
                ${community.capa ? `<img class="community-card__cover" src="${ns.escapeAttr(community.capa)}" alt="${ns.escapeAttr(community.nome)}">` : ""}
                <div class="community-card__body">
                  <div class="community-card__top">
                    ${ns.renderAvatar(community.nome, community.icone, "md")}
                    <div>
                      <strong>${ns.escapeHtml(community.nome)}</strong>
                      <span>${ns.escapeHtml(community.membros)}</span>
                    </div>
                  </div>
                  <p>${ns.escapeHtml(community.descricao)}</p>
                  ${community.joined
                    ? `<a class="button button--secondary button--full" href="${ctx.linkTo("")}" data-community-switch data-community-id="${ns.escapeAttr(community.id)}">Abrir servidor</a>`
                    : `<button class="button button--primary button--full" type="button" data-join-community="${ns.escapeAttr(community.id)}">Entrar no servidor</button>`
                  }
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderMessagesPage(ctx) {
    const conversations = ns.getConversations(ctx.state.session);
    const active = ns.getConversation(ctx.state.session, ctx.state.selectedConversationId) || conversations[0];

    if (!active) {
      return `
        <section class="panel empty-panel">
          <h2>Sem conversas ainda</h2>
          <p>Quando alguem falar com voce ou quando voce criar uma conversa, ela aparece aqui.</p>
        </section>
      `;
    }

    const messages = (ctx.state.session.messages && ctx.state.session.messages.direct && ctx.state.session.messages.direct[active.id]) || [];
    return `
      <section class="panel message-thread-panel">
        <div class="thread-top">
          ${ns.renderAvatar(active.nome, active.avatar, "md")}
          <div>
            <strong>${ns.escapeHtml(active.nome)}</strong>
            <span>${ns.escapeHtml(active.cargo)}</span>
          </div>
          <button class="link-chip" type="button" data-open-profile="${ns.escapeAttr(active.username)}">Ver perfil</button>
        </div>
        <div class="thread-messages">
          ${messages.map(function mapMessage(item) {
            return `
              <div class="bubble ${item.own ? "is-own" : ""}">
                <div class="bubble__top">
                  ${ns.renderAvatar(item.author, item.avatar, "sm")}
                  <button class="message-author" type="button" data-open-profile="${ns.escapeAttr(item.authorUsername)}">
                    <strong>${ns.escapeHtml(item.author)}</strong>
                    <span>${ns.escapeHtml(item.time)}</span>
                  </button>
                </div>
                <p>${ns.escapeHtml(item.text)}</p>
              </div>
            `;
          }).join("")}
        </div>
        <form class="composer" data-direct-message-form>
          <input type="text" class="input" name="message" placeholder="Mandar mensagem para ${ns.escapeAttr(active.nome)}">
          <button class="button button--primary" type="submit">Enviar</button>
        </form>
      </section>
    `;
  }

  function renderNotificationsPage() {
    return `
      <section class="stack">
        ${ns.NOTIFICACOES.map(function mapItem(item) {
          return `
            <article class="panel notification-card">
              <p class="eyebrow">${ns.escapeHtml(item.tipo)}</p>
              <h2>${ns.escapeHtml(item.titulo)}</h2>
              <p>${ns.escapeHtml(item.texto)}</p>
              <span>${ns.escapeHtml(item.hora)}</span>
            </article>
          `;
        }).join("")}
      </section>
    `;
  }

  function renderProfilePage(ctx) {
    const source = getProfileSource(ctx);
    const isOwn = source.user.username === ctx.state.session.user.username;
    const activeTab = ctx.state.activeProfileTab || "principais";
    const mode = ctx.state.profileView || "full";
    const sections = source.profile || {};
    const tabItems = sections[activeTab] || [];
    const visibleItems = mode === "summary" ? tabItems.slice(0, 3) : tabItems;
    const scrollClass = visibleItems.length > 4 ? " portfolio-grid--scroll" : "";
    const communities = source.communities || [];
    const bannerStyle = renderBannerStyle(source.user);

    return `
      <div class="stack">
        <section class="panel profile-panel profile-panel--hero">
          <div class="profile-banner"${bannerStyle ? ` style="${bannerStyle}"` : ""}></div>
          <div class="profile-hero profile-hero--compact">
            <div class="profile-identity">
              ${ns.renderAvatar(source.user.name, source.user.avatarUrl, "xl")}
              <div class="profile-identity__body">
                <div class="profile-title-group">
                  <h2>${ns.escapeHtml(source.user.name)}</h2>
                  <small class="profile-handle">@${ns.escapeHtml(source.user.username)}</small>
                </div>
                <p class="profile-role">${ns.escapeHtml(source.user.title || "Perfil em construcao")}</p>
                <p class="profile-bio">${ns.escapeHtml(source.user.bio || "Esse portfolio ainda esta sendo montado.")}</p>
                <div class="profile-meta">
                  ${source.user.githubUrl ? `<a class="github-link" href="${ns.escapeAttr(ns.sanitizeUrl(source.user.githubUrl))}" target="_blank" rel="noreferrer">${ns.icon("github")}GitHub</a>` : ""}
                  ${communities.map(function mapCommunity(item) {
                    return `<span class="profile-chip">${ns.escapeHtml(item.nome || item.name || "")}</span>`;
                  }).join("")}
                </div>
              </div>
            </div>
            <div class="profile-actions">
              <button class="segment-button ${mode === "summary" ? "is-active" : ""}" type="button" data-profile-view="summary">Resumo</button>
              <button class="segment-button ${mode === "full" ? "is-active" : ""}" type="button" data-profile-view="full">Completo</button>
              ${isOwn ? `<a class="button button--secondary" href="${ctx.linkTo("profile/edit")}">Editar</a>` : `<a class="button button--secondary" href="${ns.profilePath(source.user.username)}">Ver perfil</a>`}
            </div>
          </div>
        </section>

        <section class="panel">
          <div class="segment-control">
            <button class="segment-button ${activeTab === "principais" ? "is-active" : ""}" type="button" data-profile-tab="principais">Principais</button>
            <button class="segment-button ${activeTab === "honras" ? "is-active" : ""}" type="button" data-profile-tab="honras">Honras</button>
            <button class="segment-button ${activeTab === "experiencias" ? "is-active" : ""}" type="button" data-profile-tab="experiencias">Experiencias</button>
          </div>
          <div class="portfolio-grid${scrollClass}">
            ${visibleItems.length ? visibleItems.map(renderPortfolioCard).join("") : '<div class="empty-text">Nada adicionado ainda.</div>'}
          </div>
        </section>
      </div>
    `;
  }

  function renderPortfolioCard(item) {
    const style = renderCardStyle(item);
    return `
        <article class="portfolio-card" data-animate="${ns.escapeAttr(item.animacao || "normal")}"${style ? ` style="${style}"` : ""}>
          ${item.imagem ? `<img class="portfolio-card__image" src="${ns.escapeAttr(item.imagem)}" alt="${ns.escapeAttr(item.titulo || "Portfolio")}">` : ""}
          <div class="portfolio-card__body">
            <div class="portfolio-card__top">
              <div>
                <strong>${ns.escapeHtml(item.titulo || "Sem titulo")}</strong>
                ${item.subtitulo ? `<span>${ns.escapeHtml(item.subtitulo)}</span>` : ""}
              </div>
            </div>
            ${item.descricao ? `<p>${ns.escapeHtml(item.descricao)}</p>` : ""}
            ${item.link ? `<a class="portfolio-link" href="${ns.escapeAttr(ns.sanitizeUrl(item.link))}" target="_blank" rel="noreferrer">${ns.icon("link")}Abrir link</a>` : ""}
          </div>
        </article>
      `;
    }

  function renderProfileEditPage(ctx) {
    const user = ctx.state.session.user;
    const profile = ctx.state.session.profile;
    return `
      <form class="stack" data-profile-form>
        <section class="panel edit-panel">
          <div class="field-grid">
            <label class="form-field">
              <span>Nome</span>
              <input class="input" type="text" name="name" value="${ns.escapeAttr(user.name)}">
            </label>
            <label class="form-field">
              <span>Usuario</span>
              <input class="input" type="text" value="${ns.escapeAttr(user.username)}" disabled>
            </label>
            <label class="form-field">
              <span>Cargo</span>
              <input class="input" type="text" name="title" value="${ns.escapeAttr(user.title)}" placeholder="Ex.: Desenvolvedor Front-end">
            </label>
            <label class="form-field">
              <span>Avatar por URL</span>
              <input class="input" type="url" name="avatarUrl" value="${ns.escapeAttr(user.avatarUrl)}" placeholder="https://">
            </label>
            <label class="form-field">
              <span>Cor do banner</span>
              <input class="input input--color" type="color" name="bannerColor" value="${ns.escapeAttr(user.bannerColor || "#3d5afe")}">
            </label>
            <label class="form-field field-grid__full">
              <span>Banner por URL ou GIF</span>
              <input class="input" type="url" name="bannerUrl" value="${ns.escapeAttr(user.bannerUrl || "")}" placeholder="https://">
            </label>
            <label class="form-field field-grid__full">
              <span>Arquivo do banner</span>
              <label class="file-picker">
                <input class="file-picker__input" type="file" accept="image/*" data-image-file data-target-input="bannerUrl">
                <span class="file-picker__button">${ns.icon("upload")}Escolher banner</span>
                <span class="file-picker__text" data-file-name>Nenhum arquivo</span>
              </label>
            </label>
            <label class="form-field field-grid__full">
              <span>GitHub</span>
              <input class="input" type="url" name="githubUrl" value="${ns.escapeAttr(user.githubUrl)}" placeholder="https://github.com/seuusuario">
            </label>
            <label class="form-field field-grid__full">
              <span>Bio</span>
              <textarea class="input input--textarea" name="bio" placeholder="Fale um pouco sobre voce">${ns.escapeHtml(user.bio)}</textarea>
            </label>
          </div>
        </section>
        ${renderEditorSection("principais", "Principais", "O que aparece primeiro no seu portfolio.", profile.principais)}
        ${renderEditorSection("honras", "Honras", "Certificados, premios e reconhecimentos.", profile.honras)}
        ${renderEditorSection("experiencias", "Experiencias", "Historico profissional e projetos relevantes.", profile.experiencias)}
        <button class="button button--primary" type="submit">${ns.icon("save")}Salvar perfil</button>
        ${ctx.state.error ? `<p class="error-text">${ns.escapeHtml(ctx.state.error)}</p>` : ""}
      </form>
    `;
  }

  function renderEditorSection(section, title, subtitle, items) {
    return `
      <section class="panel">
        <div class="section-head">
          <div>
            <p class="eyebrow">${ns.escapeHtml(title)}</p>
            <h2>${ns.escapeHtml(subtitle)}</h2>
          </div>
          <button class="button button--secondary" type="button" data-add-row="${ns.escapeAttr(section)}">${ns.icon("plus")}Adicionar</button>
        </div>
        <div class="editable-list" data-list="${ns.escapeAttr(section)}">
          ${(items && items.length ? items : [ns.createPortfolioItem()]).map(function mapItem(item) {
            return ns.renderPortfolioEditorRow(section, item);
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderSettingsPage() {
    return `
      <div class="stack">
        <section class="panel">
          <p class="eyebrow">Conta</p>
          <h2>Configuracoes simples</h2>
          <p>Voce pode sair da conta e entrar novamente quando quiser.</p>
          <button class="button button--secondary" type="button" data-logout>${ns.icon("logout")}Sair</button>
        </section>
      </div>
    `;
  }

  function renderCommunityMessage(item) {
    return `
      <article class="message-card">
        <div class="message-card__top">
          ${ns.renderAvatar(item.author, item.avatar, "sm")}
          <button class="message-author" type="button" data-open-profile="${ns.escapeAttr(item.authorUsername)}">
            <strong>${ns.escapeHtml(item.author)}</strong>
            <span>${ns.escapeHtml(item.time)}</span>
          </button>
        </div>
        <p>${ns.escapeHtml(item.text)}</p>
      </article>
    `;
  }

  function renderPreviewModal(profile) {
    const communities = profile.communities || [];
    return `
      <div class="profile-preview-backdrop" data-close-preview>
        <section class="profile-preview" role="dialog" aria-modal="true">
          <button class="icon-button profile-preview__close" type="button" data-close-preview aria-label="Fechar">${ns.icon("close")}</button>
          <div class="profile-preview__hero">
            ${ns.renderAvatar(profile.user.name, profile.user.avatarUrl, "lg")}
            <div>
              <h2>${ns.escapeHtml(profile.user.name)}</h2>
              <p>${ns.escapeHtml(profile.user.title || "Membro")}</p>
              <span>@${ns.escapeHtml(profile.user.username)}</span>
            </div>
          </div>
          <p>${ns.escapeHtml(profile.user.bio || "Esse perfil ainda esta sendo montado.")}</p>
          <div class="profile-meta">
            ${communities.map(function mapCommunity(item) {
              return `<span class="profile-chip">${ns.escapeHtml(item.nome || "")}</span>`;
            }).join("")}
          </div>
          <div class="profile-preview__actions">
            <a class="button button--primary" href="${ns.profilePath(profile.user.username)}">Ver perfil completo</a>
          </div>
        </section>
      </div>
      `;
  }

  function renderCreateCommunityModal() {
    return `
      <div class="profile-preview-backdrop" data-close-create-community>
        <section class="profile-preview profile-preview--form" role="dialog" aria-modal="true">
          <button class="icon-button profile-preview__close" type="button" data-close-create-community aria-label="Fechar">${ns.icon("close")}</button>
          <div>
            <p class="eyebrow">Novo servidor</p>
            <h2>Criar servidor</h2>
            <p>Depois de criar, ele aparece no explorar e na sua lista de servidores.</p>
          </div>
          <form class="field-grid" data-create-community-form>
            <label class="form-field">
              <span>Nome do servidor</span>
              <input class="input" type="text" name="name" placeholder="Ex.: Front-end Brasil">
            </label>
            <label class="form-field">
              <span>Icone por URL</span>
              <input class="input" type="url" name="iconUrl" placeholder="https://">
            </label>
            <label class="form-field field-grid__full">
              <span>Descricao</span>
              <textarea class="input input--textarea" name="description" placeholder="Explique em uma frase o foco da sua comunidade"></textarea>
            </label>
            <label class="form-field field-grid__full">
              <span>Capa por URL</span>
              <input class="input" type="url" name="bannerUrl" placeholder="https://">
            </label>
            <div class="profile-preview__actions field-grid__full">
              <button class="button button--primary" type="submit">${ns.icon("plus")}Criar servidor</button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  function renderMembersDrawer(ctx) {
    const community = ns.getCommunity(ctx.state.session, ctx.state.selectedCommunityId);
    const members = community ? ((ctx.state.session.communityMembers && ctx.state.session.communityMembers[community.id]) || []) : [];

    return `
      <div class="members-drawer-backdrop" data-close-members>
        <aside class="members-drawer">
          <div class="member-panel__head">
            <div>
              <strong>Membros</strong>
              <span>${community ? ns.escapeHtml(community.nome) : ""}</span>
            </div>
            <button class="icon-button" type="button" data-close-members aria-label="Fechar">${ns.icon("close")}</button>
          </div>
          <div class="member-list">
            ${members.map(function mapMember(member) {
              return `
                <button class="member-chip" type="button" data-open-profile="${ns.escapeAttr(member.username)}">
                  ${ns.renderAvatar(member.name, member.avatarUrl, "sm")}
                  <div>
                    <strong>${ns.escapeHtml(member.name)}</strong>
                    <span>${ns.escapeHtml(member.title || "Membro")}</span>
                  </div>
                </button>
              `;
            }).join("")}
          </div>
        </aside>
      </div>
    `;
  }

  function getProfileSource(ctx) {
    if (ctx.state.publicProfile && ctx.state.viewedUsername && ctx.state.viewedUsername !== ctx.state.session.user.username) {
      return ctx.state.publicProfile;
    }

    return {
      user: ctx.state.session.user,
      profile: ctx.state.session.profile,
      communities: ns.getJoinedCommunities(ctx.state.session),
      };
  }

  function renderBannerStyle(user) {
    const styles = [];
    if (user.bannerColor) {
      styles.push(`--banner-color:${ns.escapeAttr(user.bannerColor)}`);
    }
    if (user.bannerUrl) {
      styles.push(`--banner-image:url('${ns.escapeAttr(ns.sanitizeImageUrl(user.bannerUrl))}')`);
    }
    return styles.join(";");
  }

  function renderCardStyle(item) {
    const styles = [];
    if (item.bgColor) {
      styles.push(`--card-bg:${ns.escapeAttr(item.bgColor)}`);
    }
    if (item.textColor) {
      styles.push(`--card-text:${ns.escapeAttr(item.textColor)}`);
    }
    return styles.join(";");
  }
})(window.DevForge);

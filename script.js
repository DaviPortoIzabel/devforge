window.DevForge = window.DevForge || {};

(function bootstrap(ns) {
  document.addEventListener("DOMContentLoaded", function onReady() {
    const app = document.getElementById("app");
    if (!app) {
      return;
    }

    const rawPage = document.body.dataset.page || "community";
    const page = rawPage === "communities" ? "community" : rawPage;
    const search = new URLSearchParams(window.location.search);
    const viewedUsername = search.get("user") || "";

    const context = {
      app: app,
      page: page,
      state: {
        loading: true,
        error: "",
        authMode: "login",
        session: null,
        selectedCommunityId: ns.loadStorage(ns.STORAGE_KEYS.selectedCommunity, ""),
        selectedChannelId: ns.loadStorage(ns.STORAGE_KEYS.selectedChannel, ""),
        selectedConversationId: ns.loadStorage(ns.STORAGE_KEYS.selectedConversation, ""),
        activeProfileTab: ns.loadStorage(ns.STORAGE_KEYS.tabPrefix + "profile", "principais"),
        profileView: ns.loadStorage(ns.STORAGE_KEYS.profileView, "full"),
        previewProfile: null,
        publicProfile: null,
        showCreateCommunity: false,
        showMembersPanel: false,
        viewedUsername: viewedUsername,
        profileCache: {},
      },
    };

    context.linkTo = function linkTo(pathname) {
      if (!pathname) {
        return "/";
      }
      return "/" + pathname.replace(/^\/+/, "").replace(/\/$/, "") + "/";
    };

    context.setError = function setError(message) {
      context.state.error = message || "";
      context.render();
    };

    context.fetchProfile = async function fetchProfile(username) {
      const key = String(username || "").trim().toLowerCase();
      if (!key) {
        throw new Error("Perfil nao encontrado.");
      }

      if (context.state.profileCache[key]) {
        return context.state.profileCache[key];
      }

      const profile = await ns.api("/api/users/" + encodeURIComponent(key), { method: "GET" });
      context.state.profileCache[key] = profile;
      return profile;
    };

    context.applySession = function applySession(session) {
      context.state.session = session;
      context.state.error = "";

      if (!session || !session.authenticated) {
        return;
      }

      const communities = ns.getJoinedCommunities(session);
      if (!communities.some(function someItem(item) { return item.id === context.state.selectedCommunityId; })) {
        context.state.selectedCommunityId = communities[0] ? communities[0].id : "";
      }

      const community = ns.getCommunity(session, context.state.selectedCommunityId);
      if (community) {
        const hasChannel = community.canais.some(function someChannel(item) {
          return item.id === context.state.selectedChannelId;
        });
        if (!hasChannel) {
          context.state.selectedChannelId = community.canais[0] ? community.canais[0].id : "";
        }
      } else {
        context.state.selectedChannelId = "";
      }

      const conversations = ns.getConversations(session);
      if (!conversations.some(function someItem(item) { return item.id === context.state.selectedConversationId; })) {
        context.state.selectedConversationId = conversations[0] ? conversations[0].id : "";
      }

      ns.saveStorage(ns.STORAGE_KEYS.selectedCommunity, context.state.selectedCommunityId);
      ns.saveStorage(ns.STORAGE_KEYS.selectedChannel, context.state.selectedChannelId);
      ns.saveStorage(ns.STORAGE_KEYS.selectedConversation, context.state.selectedConversationId);
    };

    context.refreshSession = async function refreshSession() {
      context.state.loading = true;
      context.render();

      try {
        const session = await ns.api("/api/session", { method: "GET" });
        context.applySession(session);

        if (
          page === "profile" &&
          session &&
          session.authenticated &&
          context.state.viewedUsername &&
          context.state.viewedUsername !== session.user.username
        ) {
          context.state.publicProfile = await context.fetchProfile(context.state.viewedUsername);
        } else {
          context.state.publicProfile = null;
        }
      } catch (error) {
        context.state.error = "Nao consegui falar com o servidor local. Rode `node server.js`.";
      } finally {
        context.state.loading = false;
        context.render();
      }
    };

    context.render = function render() {
      app.innerHTML = ns.renderApp(context);
      ns.setupUI(context);
    };

    context.refreshSession();
  });
})(window.DevForge);

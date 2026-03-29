window.DevForge = window.DevForge || {};

(function registerInteractions(ns) {
  ns.setupUI = function setupUI(ctx) {
    setupAuth(ctx);
    setupPasswordToggle(ctx);
    setupCommunitySwitch(ctx);
    setupChannels(ctx);
    setupConversationSwitch(ctx);
    setupJoinCommunity(ctx);
    setupCreateCommunity(ctx);
    setupCommunityComposer(ctx);
    setupDirectComposer(ctx);
    setupMembersPanel(ctx);
    setupProfileTabs(ctx);
    setupProfileView(ctx);
    setupProfilePreview(ctx);
    setupProfileForm(ctx);
    setupLogout(ctx);
    setupPortfolioAnimations(ctx);
  };

  function setupAuth(ctx) {
    ctx.app.querySelectorAll("[data-auth-mode]").forEach(function bindButton(button) {
      button.addEventListener("click", function handleClick() {
        ctx.state.authMode = button.dataset.authMode;
        ctx.state.error = "";
        ctx.render();
      });
    });

    ctx.app.querySelectorAll("[data-auth-form]").forEach(function bindForm(form) {
      form.addEventListener("submit", async function handleSubmit(event) {
        event.preventDefault();
        const mode = form.dataset.authForm;
        const payload = {
          username: form.elements.username.value,
          password: form.elements.password.value,
        };

        if (mode === "register") {
          payload.name = form.elements.name.value;
        }

        try {
          const session = await ns.api("/api/" + (mode === "register" ? "register" : "login"), {
            method: "POST",
            body: JSON.stringify(payload),
          });
          ctx.applySession(session);
          ctx.render();
        } catch (error) {
          ctx.setError(error.message);
        }
      });
    });
  };

  function setupPasswordToggle(ctx) {
    ctx.app.querySelectorAll("[data-toggle-password]").forEach(function bindButton(button) {
      button.addEventListener("click", function handleClick() {
        const field = button.closest(".password-field");
        const input = field && field.querySelector('input[name="password"]');
        if (!input) {
          return;
        }

        const isVisible = input.type === "text";
        input.type = isVisible ? "password" : "text";
        button.innerHTML = isVisible ? ns.icon("eye") : ns.icon("eyeOff");
      });
    });
  }

  function setupCommunitySwitch(ctx) {
    ctx.app.querySelectorAll("[data-community-switch]").forEach(function bindLink(link) {
      link.addEventListener("click", function handleClick(event) {
        const communityId = link.dataset.communityId;
        if (!communityId) {
          return;
        }

        const community = ns.getCommunity(ctx.state.session, communityId);
        ctx.state.selectedCommunityId = communityId;
        ctx.state.selectedChannelId = community && community.canais[0] ? community.canais[0].id : "";
        ctx.state.showMembersPanel = false;
        ns.saveStorage(ns.STORAGE_KEYS.selectedCommunity, ctx.state.selectedCommunityId);
        ns.saveStorage(ns.STORAGE_KEYS.selectedChannel, ctx.state.selectedChannelId);

        if (ctx.page === "community") {
          event.preventDefault();
          ctx.render();
        }
      });
    });
  }

  function setupChannels(ctx) {
    ctx.app.querySelectorAll("[data-channel-id]").forEach(function bindButton(button) {
      button.addEventListener("click", function handleClick() {
        ctx.state.selectedChannelId = button.dataset.channelId;
        ns.saveStorage(ns.STORAGE_KEYS.selectedChannel, ctx.state.selectedChannelId);
        ctx.render();
      });
    });
  }

  function setupConversationSwitch(ctx) {
    ctx.app.querySelectorAll("[data-conversation-id]").forEach(function bindButton(button) {
      button.addEventListener("click", function handleClick() {
        ctx.state.selectedConversationId = button.dataset.conversationId;
        ns.saveStorage(ns.STORAGE_KEYS.selectedConversation, ctx.state.selectedConversationId);
        ctx.render();
      });
    });
  }

  function setupJoinCommunity(ctx) {
    ctx.app.querySelectorAll("[data-join-community]").forEach(function bindButton(button) {
      button.addEventListener("click", async function handleClick() {
        try {
          const session = await ns.api("/api/communities/join", {
            method: "POST",
            body: JSON.stringify({ communityId: button.dataset.joinCommunity }),
          });
          ctx.applySession(session);
          ctx.state.selectedCommunityId = button.dataset.joinCommunity;
          const community = ns.getCommunity(session, button.dataset.joinCommunity);
          ctx.state.selectedChannelId = community && community.canais[0] ? community.canais[0].id : "";
          ctx.state.showMembersPanel = false;
          ns.saveStorage(ns.STORAGE_KEYS.selectedCommunity, ctx.state.selectedCommunityId);
          ns.saveStorage(ns.STORAGE_KEYS.selectedChannel, ctx.state.selectedChannelId);
          window.location.href = ctx.linkTo("");
        } catch (error) {
          ctx.setError(error.message);
        }
      });
    });
  }

  function setupCreateCommunity(ctx) {
    ctx.app.querySelectorAll("[data-open-create-community]").forEach(function bindButton(button) {
      button.addEventListener("click", function handleClick() {
        ctx.state.showCreateCommunity = true;
        ctx.render();
      });
    });

    ctx.app.querySelectorAll("[data-close-create-community]").forEach(function bindClose(target) {
      target.addEventListener("click", function handleClose(event) {
        if (!shouldCloseOverlay(event, target, "[data-close-create-community]")) {
          return;
        }
        ctx.state.showCreateCommunity = false;
        ctx.render();
      });
    });

    const form = ctx.app.querySelector("[data-create-community-form]");
    if (!form) {
      return;
    }

    form.addEventListener("submit", async function handleSubmit(event) {
      event.preventDefault();
      const payload = {
        name: form.elements.name.value,
        description: form.elements.description.value,
        iconUrl: form.elements.iconUrl.value,
        bannerUrl: form.elements.bannerUrl.value,
      };

      try {
        const session = await ns.api("/api/communities", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        ctx.applySession(session);
        const created = session.communities[session.communities.length - 1];
        if (created) {
          ctx.state.selectedCommunityId = created.id;
          ctx.state.selectedChannelId = created.canais[0] ? created.canais[0].id : "";
          ns.saveStorage(ns.STORAGE_KEYS.selectedCommunity, ctx.state.selectedCommunityId);
          ns.saveStorage(ns.STORAGE_KEYS.selectedChannel, ctx.state.selectedChannelId);
        }
        ctx.state.showCreateCommunity = false;
        ctx.render();
      } catch (error) {
        ctx.setError(error.message);
      }
    });
  }

  function setupMembersPanel(ctx) {
    ctx.app.querySelectorAll("[data-toggle-members]").forEach(function bindButton(button) {
      button.addEventListener("click", function handleClick() {
        ctx.state.showMembersPanel = true;
        ctx.render();
      });
    });

    ctx.app.querySelectorAll("[data-close-members]").forEach(function bindClose(target) {
      target.addEventListener("click", function handleClose(event) {
        if (!shouldCloseOverlay(event, target, "[data-close-members]")) {
          return;
        }
        ctx.state.showMembersPanel = false;
        ctx.render();
      });
    });
  }

  function setupCommunityComposer(ctx) {
    const form = ctx.app.querySelector("[data-community-message-form]");
    if (!form) {
      return;
    }

    form.addEventListener("submit", async function handleSubmit(event) {
      event.preventDefault();
      const input = form.elements.message;
      const value = input.value.trim();
      if (!value) {
        return;
      }

      try {
        const session = await ns.api("/api/messages/community", {
          method: "POST",
          body: JSON.stringify({
            communityId: ctx.state.selectedCommunityId,
            channelId: ctx.state.selectedChannelId,
            body: value,
          }),
        });
        ctx.applySession(session);
        ctx.render();
      } catch (error) {
        ctx.setError(error.message);
      }
    });
  }

  function setupDirectComposer(ctx) {
    const form = ctx.app.querySelector("[data-direct-message-form]");
    if (!form) {
      return;
    }

    form.addEventListener("submit", async function handleSubmit(event) {
      event.preventDefault();
      const input = form.elements.message;
      const value = input.value.trim();
      if (!value) {
        return;
      }

      try {
        const session = await ns.api("/api/messages/direct", {
          method: "POST",
          body: JSON.stringify({
            conversationId: ctx.state.selectedConversationId,
            body: value,
          }),
        });
        ctx.applySession(session);
        ctx.render();
      } catch (error) {
        ctx.setError(error.message);
      }
    });
  }

  function setupProfileTabs(ctx) {
    ctx.app.querySelectorAll("[data-profile-tab]").forEach(function bindButton(button) {
      button.addEventListener("click", function handleClick() {
        ctx.state.activeProfileTab = button.dataset.profileTab;
        ns.saveStorage(ns.STORAGE_KEYS.tabPrefix + "profile", ctx.state.activeProfileTab);
        ctx.render();
      });
    });
  }

  function setupProfileView(ctx) {
    ctx.app.querySelectorAll("[data-profile-view]").forEach(function bindButton(button) {
      button.addEventListener("click", function handleClick() {
        ctx.state.profileView = button.dataset.profileView;
        ns.saveStorage(ns.STORAGE_KEYS.profileView, ctx.state.profileView);
        ctx.render();
      });
    });
  }

  function setupProfilePreview(ctx) {
    ctx.app.querySelectorAll("[data-open-profile]").forEach(function bindButton(button) {
      button.addEventListener("click", async function handleClick(event) {
        event.preventDefault();
        const username = button.dataset.openProfile;
        if (!username) {
          return;
        }

        try {
          const profile = await ctx.fetchProfile(username);
          ctx.state.previewProfile = profile;
          ctx.render();
        } catch (error) {
          ctx.setError(error.message);
        }
      });
    });

    ctx.app.querySelectorAll("[data-close-preview]").forEach(function bindClose(target) {
      target.addEventListener("click", function handleClose(event) {
        if (!shouldCloseOverlay(event, target, "[data-close-preview]")) {
          return;
        }
        ctx.state.previewProfile = null;
        ctx.render();
      });
    });
  }

  function setupProfileForm(ctx) {
    const form = ctx.app.querySelector("[data-profile-form]");
    if (!form) {
      return;
    }

    form.addEventListener("click", function handleClick(event) {
      const addButton = event.target.closest("[data-add-row]");
      if (addButton) {
        const list = form.querySelector('[data-list="' + addButton.dataset.addRow + '"]');
        if (list) {
          list.insertAdjacentHTML("beforeend", ns.renderPortfolioEditorRow(addButton.dataset.addRow, ns.createPortfolioItem()));
        }
        return;
      }

      const removeButton = event.target.closest("[data-remove-row]");
      if (removeButton) {
        const row = removeButton.closest(".editor-card");
        const list = row && row.parentElement;
        if (row) {
          row.remove();
        }
        if (list && !list.children.length) {
          list.insertAdjacentHTML("beforeend", ns.renderPortfolioEditorRow(list.dataset.list, ns.createPortfolioItem()));
        }
      }
    });

    form.addEventListener("change", function handleChange(event) {
      const fileInput = event.target.closest("[data-image-file]");
      if (!fileInput) {
        return;
      }

      const row = fileInput.closest(".editor-card");
      const fieldName = fileInput.dataset.targetField || "imagem";
      const imageField = fileInput.dataset.targetInput
        ? form.querySelector('[name="' + fileInput.dataset.targetInput + '"]')
        : row && row.querySelector('[data-field="' + fieldName + '"]');
      const fileRoot = row || fileInput.closest(".form-field");
      const fileName = fileRoot && fileRoot.querySelector("[data-file-name]");
      const file = fileInput.files && fileInput.files[0];
      if (!file) {
        if (fileName) {
          fileName.textContent = "Nenhum arquivo";
        }
        return;
      }

      if (fileName) {
        fileName.textContent = file.name;
      }

      const reader = new FileReader();
      reader.onload = function onLoad() {
        if (imageField) {
          imageField.value = String(reader.result || "");
        }
      };
      reader.readAsDataURL(file);
    });

    form.addEventListener("submit", async function handleSubmit(event) {
      event.preventDefault();

      const payload = {
        name: form.elements.name.value,
        title: form.elements.title.value,
        avatarUrl: form.elements.avatarUrl.value,
        bannerUrl: form.elements.bannerUrl.value,
        bannerColor: form.elements.bannerColor.value,
        githubUrl: form.elements.githubUrl.value,
        bio: form.elements.bio.value,
        principais: collectPortfolioItems(form, "principais"),
        honras: collectPortfolioItems(form, "honras"),
        experiencias: collectPortfolioItems(form, "experiencias"),
      };

      try {
        const session = await ns.api("/api/profile", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        ctx.applySession(session);
        window.location.href = ctx.linkTo("profile");
      } catch (error) {
        ctx.setError(error.message);
      }
    });
  }

  function setupLogout(ctx) {
    const button = ctx.app.querySelector("[data-logout]");
    if (!button) {
      return;
    }

    button.addEventListener("click", async function handleClick() {
      try {
        await ns.api("/api/logout", {
          method: "POST",
          body: JSON.stringify({}),
        });
        ctx.state.session = null;
        ctx.state.authMode = "login";
        ctx.state.previewProfile = null;
        ctx.state.publicProfile = null;
        ctx.render();
      } catch (error) {
        ctx.setError(error.message);
      }
    });
  }

  function setupPortfolioAnimations(ctx) {
    const cards = Array.from(ctx.app.querySelectorAll(".portfolio-card[data-animate]"));
    if (!cards.length) {
      return;
    }

    cards.forEach(function eachCard(card) {
      const type = card.dataset.animate;
      if (type === "suave" || type === "zoom" || type === "normal") {
        card.classList.add("is-visible");
      }
    });

    if (!("IntersectionObserver" in window)) {
      cards.forEach(function eachCard(card) {
        card.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(function onEntries(entries) {
      entries.forEach(function eachEntry(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    cards.forEach(function eachCard(card) {
      if (card.dataset.animate === "rolagem") {
        observer.observe(card);
      }
    });
  }

  function collectPortfolioItems(form, section) {
    return Array.from(form.querySelectorAll('[data-list="' + section + '"] .editor-card')).map(function mapCard(card) {
      return {
        id: getFieldValue(card, "id") || ns.createPortfolioItem().id,
        titulo: getFieldValue(card, "titulo"),
        subtitulo: getFieldValue(card, "subtitulo"),
        descricao: getFieldValue(card, "descricao"),
        imagem: getFieldValue(card, "imagem"),
        link: getFieldValue(card, "link"),
        animacao: getFieldValue(card, "animacao") || "normal",
        bgColor: getFieldValue(card, "bgColor"),
        textColor: getFieldValue(card, "textColor"),
      };
    }).filter(function filterItem(item) {
      return item.titulo || item.descricao || item.imagem;
    });
  }

  function getFieldValue(card, field) {
    const input = card.querySelector('[data-field="' + field + '"]');
    return input ? input.value.trim() : "";
  }

  function shouldCloseOverlay(event, backdrop, closeSelector) {
    return event.target === backdrop || Boolean(event.target.closest("button" + closeSelector));
  }
})(window.DevForge);

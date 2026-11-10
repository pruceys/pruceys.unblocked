// ================= POKI & HIT GAMES DATABASE =================
const POKI_GAMES = [
  {
    id: "subway-surfers",
    title: "Subway Surfers",
    thumb: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&q=80",
    url: "https://ubg77.github.io/edit/subway-surfers/"
  },
  {
    id: "monkey-mart",
    title: "Monkey Mart",
    thumb: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&q=80",
    url: "https://monkeymart.org/game/monkey-mart/"
  },
  {
    id: "drive-mad",
    title: "Drive Mad",
    thumb: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    url: "https://drivemad.net/game/drive-mad/"
  },
  {
    id: "retro-bowl",
    title: "Retro Bowl",
    thumb: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&q=80",
    url: "https://game316009.hostingerapp.com/"
  },
  {
    id: "stickman-hook",
    title: "Stickman Hook",
    thumb: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400&q=80",
    url: "https://ubg77.github.io/edit/stickman-hook/"
  },
  {
    id: "tunnel-rush",
    title: "Tunnel Rush",
    thumb: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80",
    url: "https://ubg77.github.io/edit/tunnel-rush/"
  }
];

// App State (Saved in LocalStorage)
let coins = parseInt(localStorage.getItem("prucey_coins"), 10) || 250;

// ================= INITIALIZATION =================
document.addEventListener("DOMContentLoaded", () => {
  setupGamesSection();
  setupNavigation();
  setupMiniBrowser();
  setupAIandChat();
  setupShop();
  setupSettingsAndPanic();
});

// ================= TAB NAVIGATION =================
function setupNavigation() {
  const navItems = document.querySelectorAll(".nav-item");
  const tabViews = document.querySelectorAll(".tab-view");

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");

      navItems.forEach((i) => i.classList.remove("active"));
      btn.classList.add("active");

      tabViews.forEach((view) => {
        view.classList.toggle("active", view.id === `view-${targetTab}`);
      });
    });
  });
}

// ================= GAMES SECTION =================
function setupGamesSection() {
  const searchInput = document.getElementById("game-search");
  const gameModal = document.getElementById("game-modal");
  const playerIframe = document.getElementById("player-iframe");
  const modalClose = document.getElementById("modal-close");
  const modalReload = document.getElementById("modal-reload");
  const modalFs = document.getElementById("modal-fullscreen");

  // Initial render
  renderGames();

  // Search filter
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      renderGames(e.target.value.trim());
    });
  }

  // Close modal
  if (modalClose) {
    modalClose.addEventListener("click", () => {
      if (gameModal) gameModal.classList.add("hidden");
      if (playerIframe) playerIframe.src = "about:blank";
    });
  }

  // Reload active game
  if (modalReload && playerIframe) {
    modalReload.addEventListener("click", () => {
      const current = playerIframe.src;
      playerIframe.src = "about:blank";
      setTimeout(() => { playerIframe.src = current; }, 50);
    });
  }

  // Fullscreen player
  if (modalFs) {
    modalFs.addEventListener("click", () => {
      const container = document.getElementById("player-container");
      if (!container) return;

      if (!document.fullscreenElement) {
        container.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    });
  }
}

function renderGames(filter = "") {
  const grid = document.getElementById("games-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const filtered = POKI_GAMES.filter((g) =>
    g.title.toLowerCase().includes(filter.toLowerCase())
  );

  filtered.forEach((game) => {
    const card = document.createElement("div");
    card.className = "game-card";

    const img = document.createElement("img");
    img.src = game.thumb;
    img.alt = game.title;
    img.loading = "lazy";

    const title = document.createElement("div");
    title.className = "game-card-title";
    title.textContent = game.title;

    card.append(img, title);
    card.addEventListener("click", () => launchGame(game));
    grid.appendChild(card);
  });
}

function launchGame(game) {
  const gameModal = document.getElementById("game-modal");
  const playerIframe = document.getElementById("player-iframe");
  const playerTitle = document.getElementById("player-game-title");

  if (playerTitle) playerTitle.textContent = game.title;
  if (playerIframe) playerIframe.src = game.url;
  if (gameModal) gameModal.classList.remove("hidden");

  // Reward coins for launching a game
  coins += 10;
  updateCoins();
}

// ================= MINI BROWSER =================
function setupMiniBrowser() {
  const frame = document.getElementById("browser-frame");
  const input = document.getElementById("browser-url");
  const goBtn = document.getElementById("browser-go");
  const reloadBtn = document.getElementById("b-reload");
  const fsBtn = document.getElementById("browser-fullscreen");

  if (!frame || !input) return;

  function loadURL(rawUrl) {
    let url = rawUrl.trim();
    if (!url) return;

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}&kae=d`;
    }
    input.value = url;
    frame.src = url;
  }

  if (goBtn) goBtn.addEventListener("click", () => loadURL(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadURL(input.value);
  });

  if (reloadBtn) {
    reloadBtn.addEventListener("click", () => {
      const current = frame.src;
      frame.src = "about:blank";
      setTimeout(() => { frame.src = current; }, 50);
    });
  }

  if (fsBtn) {
    fsBtn.addEventListener("click", () => {
      frame.requestFullscreen?.();
    });
  }

  // Bookmarks
  document.querySelectorAll(".b-mark").forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      if (url) loadURL(url);
    });
  });
}

// ================= AI ASSISTANT & CHAT ROOM =================
function setupAIandChat() {
  function appendMessage(container, text, type, prefix = "") {
    if (!container) return;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${type}`;

    if (prefix) {
      const strong = document.createElement("strong");
      strong.textContent = prefix + " ";
      bubble.appendChild(strong);
    }

    bubble.appendChild(document.createTextNode(text));
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
  }

  // AI Chat
  const aiInput = document.getElementById("ai-input");
  const aiSend = document.getElementById("ai-send-btn");
  const aiBox = document.getElementById("ai-messages");

  function sendAIMsg() {
    if (!aiInput || !aiBox) return;
    const text = aiInput.value.trim();
    if (!text) return;

    appendMessage(aiBox, text, "user");
    aiInput.value = "";

    setTimeout(() => {
      const replies = [
        "That's a great strategy! Focus on timing your jumps for a high score.",
        "Check the settings tab if you need to quickly disguise your active window.",
        "Need game recommendations? Drive Mad and Subway Surfers are trending right now!",
        "I'm here to help you navigate and multitask efficiently."
      ];
      const botResponse = replies[Math.floor(Math.random() * replies.length)];
      appendMessage(aiBox, botResponse, "ai", "Prucey AI:");
    }, 600);
  }

  if (aiSend) aiSend.addEventListener("click", sendAIMsg);
  if (aiInput) {
    aiInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendAIMsg();
    });
  }

  // Public Chat Room
  const roomInput = document.getElementById("room-input");
  const roomSend = document.getElementById("room-send-btn");
  const roomBox = document.getElementById("room-messages");

  function sendRoomMsg() {
    if (!roomInput || !roomBox) return;
    const text = roomInput.value.trim();
    if (!text) return;

    appendMessage(roomBox, text, "user");
    roomInput.value = "";
  }

  if (roomSend) roomSend.addEventListener("click", sendRoomMsg);
  if (roomInput) {
    roomInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendRoomMsg();
    });
  }
}

// ================= SHOP LOGIC =================
function setupShop() {
  updateCoins();

  document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cost = parseInt(btn.getAttribute("data-cost"), 10) || 0;
      if (coins >= cost) {
        coins -= cost;
        updateCoins();
        btn.textContent = "Purchased!";
        btn.style.background = "#22c55e";
        btn.disabled = true;
      } else {
        alert("Not enough Coins! Play games to earn more.");
      }
    });
  });
}

function updateCoins() {
  localStorage.setItem("prucey_coins", coins);
  const userCoins = document.getElementById("user-coins");
  const statCoins = document.getElementById("stat-coins");

  if (userCoins) userCoins.textContent = coins;
  if (statCoins) statCoins.textContent = coins;
}

// ================= SETTINGS, TAB CLOAK & PANIC =================
function setupSettingsAndPanic() {
  const panicBtn = document.getElementById("panic-btn");
  const panicUrlInput = document.getElementById("panic-url");

  function triggerPanic() {
    const redirect = (panicUrlInput && panicUrlInput.value.trim()) || "https://classroom.google.com";
    window.location.replace(redirect);
  }

  if (panicBtn) panicBtn.addEventListener("click", triggerPanic);

  // Panic hotkey: ` or ~ (Ignored when typing in inputs/textareas)
  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.key === "`" || e.key === "~") {
      triggerPanic();
    }
  });

  // Cloaker presets
  document.querySelectorAll(".cloak-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const title = btn.getAttribute("data-title");
      const icon = btn.getAttribute("data-icon");
      if (title) document.title = title;

      let favicon = document.getElementById("page-favicon");
      if (!favicon) {
        favicon = document.createElement("link");
        favicon.id = "page-favicon";
        favicon.rel = "icon";
        document.head.appendChild(favicon);
      }
      if (icon) favicon.href = icon;
    });
  });
}

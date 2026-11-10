// ================= POKI GAMES REPOSITORY =================
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
  },
  {
    id: "retro-bowl",
    title: "Retro Bowl",
    thumb: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&q=80",
    url: "https://game316009.hostingerapp.com/"
  }
];

// Browser tabs state
let browserTabs = [{ id: "tab-1", title: "Games", tabTarget: "games" }];
let currentTabId = "tab-1";

// ================= INITIALIZE =================
document.addEventListener("DOMContentLoaded", () => {
  setupAccount();
  setupSidebarAndTabs();
  setupPokiGames();
  setupSpotify();
  setupMiniBrowser();
  setupSeparateAI();
  setupSeparateChat();
  setupTabCloaking();
});

// ================= ACCOUNT SYSTEM =================
function setupAccount() {
  const savedAccount = JSON.parse(localStorage.getItem("pruceys_account")) || {
    name: "Guest Player",
    seed: "Prucey"
  };

  function applyAccount(acc) {
    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(acc.seed)}`;
    document.getElementById("header-avatar").src = avatarUrl;
    document.getElementById("profile-avatar-display").src = avatarUrl;
    document.getElementById("header-username").textContent = acc.name;
    document.getElementById("sidebar-user-label").textContent = acc.name;
    document.getElementById("account-name-input").value = acc.name;
    document.getElementById("account-seed-input").value = acc.seed;
  }

  applyAccount(savedAccount);

  document.getElementById("save-account-btn").addEventListener("click", () => {
    const name = document.getElementById("account-name-input").value.trim() || "Player";
    const seed = document.getElementById("account-seed-input").value.trim() || "Prucey";
    const newAcc = { name, seed };
    localStorage.setItem("pruceys_account", JSON.stringify(newAcc));
    applyAccount(newAcc);
    alert("Profile saved!");
  });

  document.getElementById("quick-profile-btn").addEventListener("click", () => {
    switchActiveView("account");
  });
}

// ================= TABS & SIDEBAR =================
function setupSidebarAndTabs() {
  document.querySelectorAll(".sidebar-nav .nav-item, .sidebar-footer .nav-item").forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab");
      switchActiveView(target);
      updateTabTitle(currentTabId, btn.querySelector("span").textContent, target);
    });
  });

  document.getElementById("add-tab-btn").addEventListener("click", () => {
    const newId = `tab-${Date.now()}`;
    browserTabs.push({ id: newId, title: "New Tab", tabTarget: "browser" });
    currentTabId = newId;
    renderTopTabs();
    switchActiveView("browser");
  });

  renderTopTabs();
}

function switchActiveView(viewName) {
  document.querySelectorAll(".tab-view").forEach(v => v.classList.remove("active"));
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.classList.add("active");

  document.querySelectorAll(".sidebar .nav-item").forEach(b => {
    b.classList.toggle("active", b.getAttribute("data-tab") === viewName);
  });
}

function renderTopTabs() {
  const container = document.getElementById("tab-strip");
  container.innerHTML = "";

  browserTabs.forEach(t => {
    const tabEl = document.createElement("div");
    tabEl.className = `browser-tab ${t.id === currentTabId ? "active" : ""}`;

    const label = document.createElement("span");
    label.textContent = t.title;

    const closeBtn = document.createElement("i");
    closeBtn.className = "ri-close-line tab-close";
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (browserTabs.length === 1) return;
      browserTabs = browserTabs.filter(b => b.id !== t.id);
      if (currentTabId === t.id) currentTabId = browserTabs[0].id;
      renderTopTabs();
      switchActiveView(browserTabs.find(b => b.id === currentTabId).tabTarget);
    });

    tabEl.append(label, closeBtn);
    tabEl.addEventListener("click", () => {
      currentTabId = t.id;
      renderTopTabs();
      switchActiveView(t.tabTarget);
    });

    container.appendChild(tabEl);
  });
}

function updateTabTitle(id, newTitle, newTarget) {
  const tab = browserTabs.find(t => t.id === id);
  if (tab) {
    tab.title = newTitle;
    tab.tabTarget = newTarget;
    renderTopTabs();
  }
}

// ================= POKI GAMES SECTION =================
function setupPokiGames() {
  const grid = document.getElementById("games-grid");
  const search = document.getElementById("game-search");
  const pokiSiteBtn = document.getElementById("open-poki-frame-btn");

  function render(list) {
    grid.innerHTML = "";
    list.forEach(game => {
      const card = document.createElement("div");
      card.className = "interactive-card";
      card.innerHTML = `
        <img src="${game.thumb}" alt="${game.title}" loading="lazy">
        <div class="card-title">${game.title}</div>
      `;
      card.addEventListener("click", () => openMediaModal(game.title, game.url));
      grid.appendChild(card);
    });
  }

  render(POKI_GAMES);

  search.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    render(POKI_GAMES.filter(g => g.title.toLowerCase().includes(val)));
  });

  // Open the official Poki.com portal inside the viewer
  pokiSiteBtn.addEventListener("click", () => {
    openMediaModal("Poki Games Official", "https://poki.com");
  });
}

// ================= SPOTIFY MUSIC SECTION =================
function setupSpotify() {
  const spotifyFrame = document.getElementById("spotify-iframe");
  const playlistButtons = document.querySelectorAll(".spotify-tab-btn");

  // Switch Spotify Playlists
  playlistButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      playlistButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const uri = btn.getAttribute("data-spotify");
      spotifyFrame.src = `https://open.spotify.com/embed/${uri}?utm_source=generator&theme=0`;
    });
  });

  // Open official Spotify Login directly in a clean pop-up window
  document.getElementById("open-spotify-login").addEventListener("click", () => {
    window.open("https://accounts.spotify.com/en/login", "SpotifyLogin", "width=500,height=700");
  });

  // Open full Spotify Web Player in a new window/tab
  document.getElementById("open-spotify-web").addEventListener("click", () => {
    window.open("https://open.spotify.com", "_blank");
  });
}

// ================= MINI BROWSER =================
function setupMiniBrowser() {
  const frame = document.getElementById("browser-frame");
  const input = document.getElementById("browser-url");
  const go = document.getElementById("browser-go");
  const reload = document.getElementById("b-reload");

  function navigate(raw) {
    let url = raw.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://duckduckgo.com/?q=${encodeURIComponent(url)}&kae=d`;
    }
    input.value = url;
    frame.src = url;
  }

  go.addEventListener("click", () => navigate(input.value));
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") navigate(input.value); });
  reload.addEventListener("click", () => { frame.src = frame.src; });

  document.querySelectorAll(".b-mark").forEach(b => {
    b.addEventListener("click", () => navigate(b.getAttribute("data-url")));
  });
}

// ================= AI ASSISTANT =================
function setupSeparateAI() {
  const input = document.getElementById("ai-input");
  const btn = document.getElementById("ai-send-btn");
  const box = document.getElementById("ai-messages");

  function send() {
    const text = input.value.trim();
    if (!text) return;
    appendBubble(box, text, "user");
    input.value = "";

    setTimeout(() => {
      const answers = [
        "Pruceys Unblocked+ is up and running! Need recommendations for Poki games?",
        "You can stream your Spotify playlists right from the Music tab while gaming.",
        "Use the Tab Cloaker in settings whenever you need to disguise the site."
      ];
      appendBubble(box, answers[Math.floor(Math.random() * answers.length)], "ai");
    }, 500);
  }

  btn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
}

// ================= LIVE CHAT =================
function setupSeparateChat() {
  const input = document.getElementById("room-input");
  const btn = document.getElementById("room-send-btn");
  const box = document.getElementById("room-messages");

  function send() {
    const text = input.value.trim();
    if (!text) return;

    const acc = JSON.parse(localStorage.getItem("pruceys_account")) || { name: "Player" };
    appendBubble(box, `${acc.name}: ${text}`, "room");
    input.value = "";
  }

  btn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
}

function appendBubble(container, text, type) {
  const el = document.createElement("div");
  el.className = `chat-bubble ${type}`;
  el.textContent = text;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

// ================= MODAL MEDIA CONTROLLER =================
function openMediaModal(title, url) {
  const modal = document.getElementById("media-modal");
  const iframe = document.getElementById("media-iframe");
  document.getElementById("modal-title").textContent = title;
  iframe.src = url;
  modal.classList.remove("hidden");
}

document.getElementById("modal-close").addEventListener("click", () => {
  document.getElementById("media-modal").classList.add("hidden");
  document.getElementById("media-iframe").src = "about:blank";
});

document.getElementById("modal-reload").addEventListener("click", () => {
  const frame = document.getElementById("media-iframe");
  const cur = frame.src;
  frame.src = "about:blank";
  setTimeout(() => { frame.src = cur; }, 50);
});

document.getElementById("modal-fullscreen").addEventListener("click", () => {
  const container = document.getElementById("media-container");
  if (!document.fullscreenElement) container.requestFullscreen?.();
  else document.exitFullscreen?.();
});

// ================= TAB CLOAKER ONLY =================
function setupTabCloaking() {
  document.querySelectorAll(".cloak-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.title = btn.getAttribute("data-title");
      document.getElementById("page-favicon").href = btn.getAttribute("data-icon");
    });
  });
}

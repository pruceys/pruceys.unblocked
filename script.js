// ================= POKI GAMES MIRROR REPO =================
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

// ================= MOVIES & CINEMA =================
const MOVIES = [
  {
    title: "Big Buck Bunny (Full Movie)",
    thumb: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    url: "https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?autoplay=1"
  },
  {
    title: "Tears of Steel (Sci-Fi Short)",
    thumb: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    url: "https://www.youtube-nocookie.com/embed/R6MlUcmOul8?autoplay=1"
  },
  {
    title: "Open Cinema Stream Hub",
    thumb: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    url: "https://vidsrc.to"
  }
];

// ================= LOFI STATIONS =================
const TRACKS = [
  { title: "Lofi Hip Hop Chill Beats", artist: "Lofi Girl Stream", src: "https://streams.ilovemusic.de/iloveradio17.mp3" },
  { title: "Synthwave Gaming Chill", artist: "Retro Arcade", src: "https://stream.syntheticfm.com/stream" },
  { title: "Calm Study Piano", artist: "Ambient Sound", src: "https://stream.zeno.fm/0r0xa792kwzuv" }
];

// Browser tabs state
let browserTabs = [{ id: "tab-1", title: "Games", tabTarget: "games" }];
let currentTabId = "tab-1";
let currentTrackIdx = 0;

// ================= INITIALIZE =================
document.addEventListener("DOMContentLoaded", () => {
  setupAccount();
  setupSidebarAndTabs();
  setupPokiGames();
  setupMovies();
  setupMusicPlayer();
  setupMiniBrowser();
  setupSeparateAI();
  setupSeparateChat();
  setupPanicAndCloaking();
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
    alert("Profile saved successfully!");
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

// ================= POKI GAMES =================
function setupPokiGames() {
  const grid = document.getElementById("games-grid");
  const search = document.getElementById("game-search");

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
}

// ================= MOVIES =================
function setupMovies() {
  const grid = document.getElementById("movies-grid");
  grid.innerHTML = "";

  MOVIES.forEach(m => {
    const card = document.createElement("div");
    card.className = "interactive-card";
    card.innerHTML = `
      <img src="${m.thumb}" alt="${m.title}">
      <div class="card-title">${m.title}</div>
    `;
    card.addEventListener("click", () => openMediaModal(m.title, m.url));
    grid.appendChild(card);
  });
}

// ================= MUSIC PLAYER =================
function setupMusicPlayer() {
  const audio = document.getElementById("audio-player");
  const playBtn = document.getElementById("play-track-btn");
  const playIcon = document.getElementById("play-icon");
  const vinyl = document.getElementById("vinyl-disc");
  const tracksContainer = document.getElementById("tracks-list");
  const volumeSlider = document.getElementById("music-volume");

  function loadTrack(index) {
    currentTrackIdx = index;
    const track = TRACKS[index];
    audio.src = track.src;
    document.getElementById("current-track-title").textContent = track.title;
    document.getElementById("current-track-artist").textContent = track.artist;
    updateTracklistUI();
  }

  function updateTracklistUI() {
    tracksContainer.innerHTML = "";
    TRACKS.forEach((t, i) => {
      const item = document.createElement("div");
      item.className = `track-item ${i === currentTrackIdx ? "active" : ""}`;
      item.innerHTML = `<span>${t.title}</span><small>${t.artist}</small>`;
      item.addEventListener("click", () => {
        loadTrack(i);
        audio.play();
        playIcon.className = "ri-pause-fill";
        vinyl.classList.add("spinning");
      });
      tracksContainer.appendChild(item);
    });
  }

  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playIcon.className = "ri-pause-fill";
      vinyl.classList.add("spinning");
    } else {
      audio.pause();
      playIcon.className = "ri-play-fill";
      vinyl.classList.remove("spinning");
    }
  });

  document.getElementById("next-track-btn").addEventListener("click", () => {
    currentTrackIdx = (currentTrackIdx + 1) % TRACKS.length;
    loadTrack(currentTrackIdx);
    audio.play();
  });

  document.getElementById("prev-track-btn").addEventListener("click", () => {
    currentTrackIdx = (currentTrackIdx - 1 + TRACKS.length) % TRACKS.length;
    loadTrack(currentTrackIdx);
    audio.play();
  });

  volumeSlider.addEventListener("input", (e) => {
    audio.volume = e.target.value;
  });

  loadTrack(0);
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

// ================= SEPARATE AI ASSISTANT =================
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
        "Pruceys Unblocked+ is running smooth! Subway Surfers or Drive Mad are top picks right now.",
        "Remember to use the Tab Cloaker in Settings if you need to hide your active window.",
        "I'm here to answer study questions or help you navigate games!"
      ];
      appendBubble(box, answers[Math.floor(Math.random() * answers.length)], "ai");
    }, 500);
  }

  btn.addEventListener("click", send);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
}

// ================= SEPARATE PUBLIC CHAT =================
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

// ================= PANIC SWITCH & CLOAKER =================
function setupPanicAndCloaking() {
  function triggerPanic() {
    const url = document.getElementById("panic-url").value.trim() || "https://classroom.google.com";
    window.location.replace(url);
  }

  document.getElementById("panic-btn").addEventListener("click", triggerPanic);
  document.getElementById("header-panic-btn").addEventListener("click", triggerPanic);

  window.addEventListener("keydown", (e) => {
    if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.key === "`" || e.key === "~") triggerPanic();
  });

  document.querySelectorAll(".cloak-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.title = btn.getAttribute("data-title");
      document.getElementById("page-favicon").href = btn.getAttribute("data-icon");
    });
  });
}

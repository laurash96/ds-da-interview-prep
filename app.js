const QUESTION_BANK_URLS = [
  "./data/banks/sql.json",
  "./data/banks/python.json",
  "./data/banks/ml.json",
  "./data/banks/statistics.json",
  "./data/banks/product.json",
  "./data/banks/genai.json",
  "./data/banks/softskills.json",
];
const STORAGE_KEY = "ipc_progress_v1";
const LANG_KEY = "ipc_lang_v1";
const SETTINGS_KEY = "ipc_settings_v1";

/** @typedef {"New"|"Learning"|"Revisit"|"Known"} CardState */
/** @typedef {"en"|"es"} Lang */

const els = {
  tabs: () => Array.from(document.querySelectorAll(".tab")),
  topbar: () => document.querySelector(".topbar"),
  stats: () => document.querySelector(".stats"),
  progress: () => document.querySelector(".progress"),
  search: () => document.getElementById("search"),
  difficulty: () => document.getElementById("difficulty"),
  status: () => document.getElementById("status"),
  shuffle: () => document.getElementById("shuffle"),
  resetProgress: () => document.getElementById("resetProgress"),
  prev: () => document.getElementById("prev"),
  next: () => document.getElementById("next"),
  flip: () => document.getElementById("flip"),
  randomQuestion: () => document.getElementById("randomQuestion"),
  card: () => document.getElementById("card"),
  cardInner: () => document.getElementById("cardInner"),
  badgeCategory: () => document.getElementById("badgeCategory"),
  badgeDifficulty: () => document.getElementById("badgeDifficulty"),
  tags: () => document.getElementById("tags"),
  question: () => document.getElementById("question"),
  stateBadge: () => document.getElementById("stateBadge"),
  answer: () => document.getElementById("answer"),
  theoryBlock: () => document.getElementById("theoryBlock"),
  theory: () => document.getElementById("theory"),
  codeBlock: () => document.getElementById("codeBlock"),
  code: () => document.getElementById("code"),
  sourceLine: () => document.getElementById("sourceLine"),
  markLearning: () => document.getElementById("markLearning"),
  markRevisit: () => document.getElementById("markRevisit"),
  markKnown: () => document.getElementById("markKnown"),
  countPill: () => document.getElementById("countPill"),
  progressPill: () => document.getElementById("progressPill"),
  progressTrack: () => document.querySelector(".progress__track"),
  progressBar: () => document.getElementById("progressBar"),
  langToggle: () => document.getElementById("langToggle"),
  langLabel: () => document.getElementById("langLabel"),
  themeToggle: () => document.getElementById("themeToggle"),
  themeLabel: () => document.getElementById("themeLabel"),
  brandTagline: () => document.getElementById("brandTagline"),
  searchLabel: () => document.getElementById("searchLabel"),
  difficultyLabel: () => document.getElementById("difficultyLabel"),
  statusLabel: () => document.getElementById("statusLabel"),
  answerTitle: () => document.getElementById("answerTitle"),
  theoryTitle: () => document.getElementById("theoryTitle"),
  codeTitle: () => document.getElementById("codeTitle"),
  howToTitle: () => document.getElementById("howToTitle"),
  howToView: () => document.getElementById("howToView"),
  howToS1T: () => document.getElementById("howToS1T"),
  howToS1B: () => document.getElementById("howToS1B"),
  howToS2T: () => document.getElementById("howToS2T"),
  howToS2B: () => document.getElementById("howToS2B"),
  howToS3T: () => document.getElementById("howToS3T"),
  howToS3B: () => document.getElementById("howToS3B"),
  howToS4T: () => document.getElementById("howToS4T"),
  howToS4B: () => document.getElementById("howToS4B"),
  howToS5T: () => document.getElementById("howToS5T"),
  howToS5B: () => document.getElementById("howToS5B"),
  aboutView: () => document.getElementById("aboutView"),
  aboutTitle: () => document.getElementById("aboutTitle"),
  aboutBody: () => document.getElementById("aboutBody"),
  contactTitle: () => document.getElementById("contactTitle"),
  contactMeta: () => document.getElementById("contactMeta"),
  contactCta: () => document.getElementById("contactCta"),
  filtersBtn: () => document.getElementById("filtersBtn"),
  filtersModal: () => document.getElementById("filtersModal"),
  filtersClose: () => document.getElementById("filtersClose"),
  filtersTitle: () => document.getElementById("filtersTitle"),
  pathToggle: () => document.getElementById("pathToggle"),
  pathLabel: () => document.getElementById("pathLabel"),
  cardWrap: () => document.getElementById("cardWrap"),
  shortcutsTip: () => document.getElementById("shortcutsTip"),
  sourcesView: () => document.getElementById("sourcesView"),
  sourcesTitle: () => document.getElementById("sourcesTitle"),
  sourcesIntro: () => document.getElementById("sourcesIntro"),
  sourcesNote: () => document.getElementById("sourcesNote"),
  reloadQuestions: () => document.getElementById("reloadQuestions"),
};

/** @type {Array<any>} */
let allQuestions = [];
/** @type {Array<any>} */
let filtered = [];
let activeIndex = 0;
let activeTab = "All";

/** @type {Record<string, CardState>} */
let progress = loadProgress();

/** @type {Lang} */
let lang = loadLang();

const settings = loadSettings();

const I18N = {
  en: {
    languageLabel: "Language",
    tagline: "Flip cards, search & filter—your progress saves in this browser.",
    tabs: {
      All: "All ✨",
      SQL: "SQL 🧩",
      Statistics: "Stats 📊",
      ML: "ML 🤖",
      Product: "Product 🧭",
      Python: "Python 🐍",
      GenAI: "GenAI ✨🤖",
      SoftSkills: "Soft skills 🤝",
      About: "About 💌",
      HowTo: "How it works 👋",
      Sources: "Sources 🔗",
    },
    labels: {
      search: "Search",
      difficulty: "Difficulty",
      status: "Status",
      learningPath: "Learning path",
      theme: "Theme",
    },
    placeholders: {
      search: "SQL joins, A/B tests, metrics…",
    },
    buttons: {
      filters: "Filters ⚙️",
      close: "Close",
      shuffle: "Shuffle",
      random: "Random 🎲",
      reload: "Reload questions",
      resetProgress: "Reset progress",
      themeDark: "Dark",
      themeLight: "Light",
      themePink: "Pink",
      prev: "◀ Prev",
      next: "Next ▶",
      flip: "Flip 🔄",
      markLearning: "Learning 🌱",
      markRevisit: "Revisit 🔁",
      markKnown: "Known ✅",
    },
    titles: {
      filters: "Filters",
      answer: "Answer",
      theory: "Theory / Notes",
      code: "Code",
      about: "Objective",
      howTo: "How it works",
    },
    about: {
      title: "Objective",
      body:
        "This app is a friendly, low-pressure way to practice Data Analytics / Data Science interview questions, build confidence, and track progress over time.",
      contactTitle: "Contact me",
      contactMeta: "Portfolio / projects / experience",
      contactCta: "Open portfolio →",
    },
    howto: {
      s1t: "Pick a topic",
      s1b: "Choose SQL / Python / ML / Soft skills, and start with Easy using Learning Path.",
      s2t: "Practice",
      s2b: "Read the question, try to answer out loud, then flip the card.",
      s3t: "Track progress",
      s3b: "Mark cards as Learning or Known. The progress bar updates automatically.",
      s4t: "Keyboard shortcuts",
      s4b: "←/→ navigate, Space flip, S shuffle.",
      s5t: "Language & theme",
      s5b:
        'At the **top right**, use **EN** / **ES** (under “Language”) for the whole app, and **Theme** to cycle **Dark → Light → Pink**. Your choices are saved in this browser.',
    },
    sources: {
      title: "Sources",
      intro:
        "This app uses original Q&A written for practice. The links below are provided for transparency and further reading.",
      note: "Note: we link to sources instead of copying content to respect authors’ rights and site terms.",
    },
    hints: {
      front: "Tip: click “Flip” or press Space.",
      shortcuts: "Shortcuts: ←/→ navigate, Space flip, S shuffle.",
    },
    status: {
      New: "New",
      Learning: "Learning",
      Revisit: "Revisit",
      Known: "Known",
      all: "All",
    },
    difficulty: {
      all: "All",
    },
    categories: {
      SoftSkills: "Soft skills",
    },
    empty: {
      title: "No questions match these filters.",
      body: "Try changing tabs/filters or clearing the search.",
    },
    stats: {
      questions: (n) => `${n} question${n === 1 ? "" : "s"}`,
      knownPct: (pct) => `${pct}% known`,
    },
    misc: {
      source: "Source",
      sourcePrefix: "Source: ",
      loadErrorTitle: "Error loading questions.",
      loadErrorBody: (detail) =>
        `Check that the question bank files exist and the JSON is valid.\n\n**Detail:** ${detail}`,
      resetConfirm: "Reset progress? This clears saved status in this browser.",
    },
    sidebar: {
      howTo: [
        "Pick a tab (SQL, Statistics, ML, Soft skills…).",
        "Filter by difficulty and search by keywords.",
        "Flip the card and track your status.",
      ],
    },
  },
  es: {
    languageLabel: "Idioma",
    tagline: "Tarjetas para practicar: busca, filtra y guarda tu avance en el navegador.",
    tabs: {
      All: "Todo ✨",
      SQL: "SQL 🧩",
      Statistics: "Stats 📊",
      ML: "ML 🤖",
      Product: "Producto 🧭",
      Python: "Python 🐍",
      GenAI: "GenAI ✨🤖",
      SoftSkills: "Soft skills 🤝",
      About: "Objetivo 💌",
      HowTo: "Cómo usar 👋",
      Sources: "Fuentes 🔗",
    },
    labels: {
      search: "Buscar",
      difficulty: "Dificultad",
      status: "Estado",
      learningPath: "Ruta de aprendizaje",
      theme: "Tema",
    },
    placeholders: {
      search: "SQL joins, A/B tests, métricas…",
    },
    buttons: {
      filters: "Filtros ⚙️",
      close: "Cerrar",
      shuffle: "Barajar",
      random: "Aleatoria 🎲",
      reload: "Recargar preguntas",
      resetProgress: "Reiniciar progreso",
      themeDark: "Oscuro",
      themeLight: "Claro",
      themePink: "Rosa",
      prev: "◀ Anterior",
      next: "Siguiente ▶",
      flip: "Voltear 🔄",
      markLearning: "Aprendiendo 🌱",
      markRevisit: "Revisar 🔁",
      markKnown: "Dominada ✅",
    },
    titles: {
      filters: "Filtros",
      answer: "Respuesta",
      theory: "Teoría / Notas",
      code: "Código",
      about: "Objetivo",
      howTo: "Cómo usar",
    },
    about: {
      title: "Objetivo",
      body:
        "Esta app es una forma amable y sin presión de practicar preguntas de entrevistas de Data Analytics / Data Science, ganar confianza y medir progreso con el tiempo.",
      contactTitle: "Contáctame",
      contactMeta: "Portafolio / proyectos / experiencia",
      contactCta: "Ver portafolio →",
    },
    howto: {
      s1t: "Elige un tema",
      s1b: "Selecciona SQL / Python / ML / Soft skills, y empieza por Easy con Learning Path.",
      s2t: "Practica",
      s2b: "Lee la pregunta, intenta responder en voz alta y luego voltea la tarjeta.",
      s3t: "Sigue tu progreso",
      s3b: "Marca tarjetas como Aprendiendo o Dominada. La barra se actualiza automáticamente.",
      s4t: "Atajos",
      s4b: "←/→ navegar, Espacio voltear, S barajar.",
      s5t: "Idioma y tema",
      s5b:
        'Arriba a la **derecha**, usa **EN** / **ES** (bajo “Idioma”) para toda la app, y **Tema** para alternar **Oscuro → Claro → Rosa**. Se guarda en este navegador.',
    },
    sources: {
      title: "Fuentes",
      intro:
        "Esta app usa preguntas y respuestas originales para practicar. Los enlaces abajo están por transparencia y lectura adicional.",
      note:
        "Nota: enlazamos a fuentes en lugar de copiar contenido para respetar derechos de autor y términos del sitio.",
    },
    hints: {
      front: "Tip: haz click en “Voltear” o presiona espacio.",
      shortcuts: "Atajos: ←/→ navegar, Espacio voltear, S barajar.",
    },
    status: {
      New: "Nueva",
      Learning: "Aprendiendo",
      Revisit: "Revisar",
      Known: "Dominada",
      all: "Todos",
    },
    difficulty: {
      all: "Todas",
    },
    categories: {
      SoftSkills: "Habilidades blandas",
    },
    empty: {
      title: "No hay preguntas con estos filtros.",
      body: "Prueba a cambiar pestaña/filtros o limpiar la búsqueda.",
    },
    stats: {
      questions: (n) => `${n} pregunta${n === 1 ? "" : "s"}`,
      knownPct: (pct) => `${pct}% dominadas`,
    },
    misc: {
      source: "Fuente",
      sourcePrefix: "Fuente: ",
      loadErrorTitle: "Error cargando preguntas.",
      loadErrorBody: (detail) =>
        `Revisa que existan los archivos del banco de preguntas y que el JSON sea válido.\n\n**Detalle:** ${detail}`,
      resetConfirm: "¿Reiniciar progreso? Esto borra estados guardados en este navegador.",
    },
    sidebar: {
      howTo: [
        "Elige una pestaña (SQL, Estadística, ML, Soft skills…).",
        "Filtra por dificultad y busca por keywords.",
        "Voltea la tarjeta y marca tu estado.",
      ],
    },
  },
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function loadLang() {
  try {
    /** @type {Lang|null} */
    const v = /** @type {any} */ (localStorage.getItem(LANG_KEY));
    return v === "es" ? "es" : "en";
  } catch {
    return "en";
  }
}

function saveLang() {
  localStorage.setItem(LANG_KEY, lang);
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { learningPath: true };
    const parsed = JSON.parse(raw);
    return {
      learningPath: parsed?.learningPath !== false,
      theme: parsed?.theme === "light" ? "light" : parsed?.theme === "pink" ? "pink" : "dark",
    };
  } catch {
    return { learningPath: true, theme: "dark" };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function t() {
  return I18N[lang] ?? I18N.en;
}

function categoryBadgeLabel(cat) {
  if (!cat) return "—";
  const map = /** @type {Record<string,string>} */ (t().categories ?? {});
  return map[cat] ?? cat;
}

function clampIndex(i) {
  if (filtered.length === 0) return 0;
  return ((i % filtered.length) + filtered.length) % filtered.length;
}

function getState(q) {
  return progress[q.id] ?? "New";
}

function setState(q, state) {
  progress[q.id] = state;
  saveProgress();
  render();
}

function renderMarkdown(targetEl, text) {
  if (!text) {
    targetEl.innerHTML = "";
    return;
  }

  // Marked is loaded via CDN.
  targetEl.innerHTML = window.marked.parse(String(text));
}

function renderCode(container, codeBlocks) {
  container.innerHTML = "";
  if (!Array.isArray(codeBlocks) || codeBlocks.length === 0) return;

  for (const b of codeBlocks) {
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    if (b.lang) code.className = `language-${b.lang}`;
    code.textContent = String(b.snippet ?? "");
    pre.appendChild(code);
    container.appendChild(pre);
  }

  if (window.hljs) {
    container.querySelectorAll("pre code").forEach((block) => window.hljs.highlightElement(block));
  }
}

function applyFilters() {
  const q = (els.search().value || "").trim().toLowerCase();
  const diff = els.difficulty().value;
  const st = els.status().value;
  const allowed = settings.learningPath ? allowedDifficultiesForPath() : null;

  filtered = allQuestions.filter((item) => {
    if (activeTab !== "All" && item.category !== activeTab) return false;
    if (allowed && !allowed.has(item.difficulty)) return false;
    if (!allowed && diff !== "All" && item.difficulty !== diff) return false;

    const state = getState(item);
    if (st !== "All" && state !== st) return false;

    if (!q) return true;

    const hay = [
      item.id,
      item.category,
      item.difficulty,
      ...(item.tags ?? []),
      ...(item.company ?? []),
      item.question,
      item.answer,
      item.theory,
      ...(item.code ?? []).map((c) => c.snippet),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  });

  activeIndex = clampIndex(activeIndex);
}

function updateStats() {
  const total = filtered.length;
  const known = filtered.reduce((acc, item) => acc + (getState(item) === "Known" ? 1 : 0), 0);
  const pct = total === 0 ? 0 : Math.round((known / total) * 100);
  const overallTotal =
    activeTab === "All"
      ? allQuestions.length
      : allQuestions.filter((q) => q.category === activeTab).length;

  if (settings.learningPath && overallTotal !== total) {
    els.countPill().textContent = `${t().stats.questions(total)} / ${t().stats.questions(overallTotal)} total`;
  } else {
    els.countPill().textContent = t().stats.questions(total);
  }
  els.progressPill().textContent = t().stats.knownPct(pct);

  const track = els.progressTrack();
  const bar = els.progressBar();
  if (track && bar) {
    track.setAttribute("aria-valuenow", String(pct));
    bar.style.width = `${pct}%`;
  }
}

function pctKnownWithinDifficulty(difficulty) {
  const items = allQuestions.filter(
    (q) => (activeTab === "All" || q.category === activeTab) && q.difficulty === difficulty
  );
  if (items.length === 0) return 0;
  const known = items.reduce((acc, q) => acc + (getState(q) === "Known" ? 1 : 0), 0);
  return known / items.length;
}

function allowedDifficultiesForPath() {
  // Unlock logic: start Easy, unlock Medium when Easy is mostly Known, unlock Hard when Medium is mostly Known.
  const unlockThreshold = 0.7;
  const set = new Set(["Easy"]);
  if (pctKnownWithinDifficulty("Easy") >= unlockThreshold) set.add("Medium");
  if (pctKnownWithinDifficulty("Medium") >= unlockThreshold) set.add("Hard");
  return set;
}

function getLocalizedField(item, base) {
  if (lang === "es") return item[`${base}_es`] ?? item[base] ?? "";
  return item[`${base}_en`] ?? item[base] ?? "";
}

function setStaticText() {
  // Header language toggle
  if (els.langLabel()) els.langLabel().textContent = t().languageLabel;
  if (els.langToggle()) els.langToggle().textContent = lang.toUpperCase();
  if (els.brandTagline()) els.brandTagline().textContent = t().tagline;

  // Tabs
  els.tabs().forEach((b) => {
    const key = b.dataset.tab || "All";
    b.textContent = t().tabs[key] ?? key;
  });

  // Controls
  if (els.searchLabel()) els.searchLabel().textContent = t().labels.search;
  if (els.difficultyLabel()) els.difficultyLabel().textContent = t().labels.difficulty;
  if (els.statusLabel()) els.statusLabel().textContent = t().labels.status;
  if (els.pathLabel()) els.pathLabel().textContent = t().labels.learningPath;
  if (els.themeLabel()) els.themeLabel().textContent = t().labels.theme;
  if (els.search()) els.search().placeholder = t().placeholders.search;

  // Buttons
  if (els.filtersBtn()) els.filtersBtn().textContent = t().buttons.filters;
  if (els.filtersClose()) els.filtersClose().textContent = t().buttons.close;
  els.shuffle().textContent = t().buttons.shuffle;
  if (els.reloadQuestions()) els.reloadQuestions().textContent = t().buttons.reload;
  els.resetProgress().textContent = t().buttons.resetProgress;
  if (els.themeToggle()) {
    els.themeToggle().textContent =
      settings.theme === "light"
        ? t().buttons.themeLight
        : settings.theme === "pink"
          ? t().buttons.themePink
          : t().buttons.themeDark;
  }
  els.prev().textContent = t().buttons.prev;
  els.next().textContent = t().buttons.next;
  els.flip().textContent = t().buttons.flip;
  if (els.randomQuestion()) els.randomQuestion().textContent = t().buttons.random;
  els.markLearning().textContent = t().buttons.markLearning;
  if (els.markRevisit()) els.markRevisit().textContent = t().buttons.markRevisit;
  els.markKnown().textContent = t().buttons.markKnown;

  // Titles
  if (els.filtersTitle()) els.filtersTitle().textContent = t().titles.filters;
  if (els.answerTitle()) els.answerTitle().textContent = t().titles.answer;
  if (els.theoryTitle()) els.theoryTitle().textContent = t().titles.theory;
  if (els.codeTitle()) els.codeTitle().textContent = t().titles.code;
  if (els.howToTitle()) els.howToTitle().textContent = t().titles.howTo;
  if (els.aboutTitle()) els.aboutTitle().textContent = t().titles.about;

  // Hint + sidebar text
  const hintFront = document.getElementById("hintFront");
  if (hintFront) hintFront.textContent = t().hints.front;

  const tip = document.querySelector(".tip.small");
  if (tip) tip.textContent = t().hints.shortcuts;

  // Select options for Status/Difficulty "All"
  const dAll = els.difficulty().querySelector('option[value="All"]');
  if (dAll) dAll.textContent = t().difficulty.all;
  const sAll = els.status().querySelector('option[value="All"]');
  if (sAll) sAll.textContent = t().status.all;

  // Status option labels
  const sNew = els.status().querySelector('option[value="New"]');
  if (sNew) sNew.textContent = t().status.New;
  const sLearning = els.status().querySelector('option[value="Learning"]');
  if (sLearning) sLearning.textContent = t().status.Learning;
  const sRevisit = els.status().querySelector('option[value="Revisit"]');
  if (sRevisit) sRevisit.textContent = t().status.Revisit;
  const sKnown = els.status().querySelector('option[value="Known"]');
  if (sKnown) sKnown.textContent = t().status.Known;

  // Learning path toggle + difficulty enabled/disabled
  if (els.pathToggle()) els.pathToggle().checked = Boolean(settings.learningPath);
  if (settings.learningPath) {
    els.difficulty().value = "All";
    els.difficulty().setAttribute("disabled", "true");
    if (els.difficultyLabel()) els.difficultyLabel().textContent = `${t().labels.difficulty} (auto)`;
  } else {
    els.difficulty().removeAttribute("disabled");
  }
}

function setViewVisibility({ sources, howTo, about }) {
  if (els.sourcesView()) els.sourcesView().hidden = !sources;
  if (els.howToView()) els.howToView().hidden = !howTo;
  if (els.aboutView()) els.aboutView().hidden = !about;

  const hidePractice = sources || howTo || about;
  if (els.cardWrap()) els.cardWrap().style.display = hidePractice ? "none" : "block";
  if (els.shortcutsTip()) els.shortcutsTip().style.display = hidePractice ? "none" : "block";
  if (els.topbar()) els.topbar().style.display = hidePractice ? "none" : "flex";
  if (els.stats()) els.stats().style.display = hidePractice ? "none" : "flex";
  if (els.progress()) els.progress().style.display = hidePractice ? "none" : "block";
}

function render() {
  setStaticText();

  const isSources = activeTab === "Sources";
  const isHowTo = activeTab === "HowTo";
  const isAbout = activeTab === "About";
  setViewVisibility({ sources: isSources, howTo: isHowTo, about: isAbout });
  if (isSources) {
    // Keep sources text localized.
    if (els.sourcesTitle()) els.sourcesTitle().textContent = t().sources.title;
    if (els.sourcesIntro()) els.sourcesIntro().textContent = t().sources.intro;
    if (els.sourcesNote()) els.sourcesNote().textContent = t().sources.note;
    // Stats should not confuse user here.
    els.countPill().textContent = "—";
    els.progressPill().textContent = "—";
    const bar = els.progressBar();
    if (bar) bar.style.width = "0%";
    return;
  }

  if (isHowTo) {
    if (els.howToTitle()) els.howToTitle().textContent = t().titles.howTo;
    if (els.howToS1T()) els.howToS1T().textContent = t().howto.s1t;
    if (els.howToS1B()) els.howToS1B().textContent = t().howto.s1b;
    if (els.howToS2T()) els.howToS2T().textContent = t().howto.s2t;
    if (els.howToS2B()) els.howToS2B().textContent = t().howto.s2b;
    if (els.howToS3T()) els.howToS3T().textContent = t().howto.s3t;
    if (els.howToS3B()) els.howToS3B().textContent = t().howto.s3b;
    if (els.howToS4T()) els.howToS4T().textContent = t().howto.s4t;
    if (els.howToS4B()) els.howToS4B().textContent = t().howto.s4b;
    if (els.howToS5T()) els.howToS5T().textContent = t().howto.s5t;
    if (els.howToS5B()) renderMarkdown(els.howToS5B(), t().howto.s5b);
    els.countPill().textContent = "—";
    els.progressPill().textContent = "—";
    const bar = els.progressBar();
    if (bar) bar.style.width = "0%";
    return;
  }

  if (isAbout) {
    if (els.aboutTitle()) els.aboutTitle().textContent = t().about.title;
    if (els.aboutBody()) els.aboutBody().textContent = t().about.body;
    if (els.contactTitle()) els.contactTitle().textContent = t().about.contactTitle;
    if (els.contactMeta()) els.contactMeta().textContent = t().about.contactMeta;
    if (els.contactCta()) els.contactCta().textContent = t().about.contactCta;
    els.countPill().textContent = "—";
    els.progressPill().textContent = "—";
    const bar = els.progressBar();
    if (bar) bar.style.width = "0%";
    return;
  }

  applyFilters();
  updateStats();

  const card = els.card();
  const inner = els.cardInner();
  void inner; // keeps linter quiet in some setups

  if (filtered.length === 0) {
    els.badgeCategory().textContent = "—";
    els.badgeDifficulty().textContent = "—";
    els.tags().textContent = "";
    els.question().textContent = t().empty.title;
    renderMarkdown(els.answer(), t().empty.body);
    els.stateBadge().textContent = "—";
    els.stateBadge().className = "badge";
    els.theoryBlock().style.display = "none";
    els.codeBlock().style.display = "none";
    els.sourceLine().textContent = "";
    card.classList.remove("is-flipped");
    return;
  }

  const item = filtered[activeIndex];
  const state = getState(item);

  els.badgeCategory().textContent = categoryBadgeLabel(item.category);
  els.badgeDifficulty().textContent = item.difficulty ?? "—";
  els.tags().textContent = (item.tags ?? []).map((t) => `#${t}`).join(" ");
  els.question().textContent = getLocalizedField(item, "question");

  // Back
  els.stateBadge().textContent = t().status[state] ?? state;
  els.stateBadge().className =
    state === "Known"
      ? "badge badge--success"
      : state === "Revisit"
        ? "badge badge--dangerSoft"
        : state === "Learning"
          ? "badge badge--warn"
          : "badge badge--muted";

  renderMarkdown(els.answer(), getLocalizedField(item, "answer"));

  const theory = String(getLocalizedField(item, "theory") ?? "").trim();
  if (theory) {
    els.theoryBlock().style.display = "block";
    renderMarkdown(els.theory(), theory);
  } else {
    els.theoryBlock().style.display = "none";
  }

  const codeBlocks = item.code ?? [];
  if (Array.isArray(codeBlocks) && codeBlocks.length > 0) {
    els.codeBlock().style.display = "block";
    renderCode(els.code(), codeBlocks);
  } else {
    els.codeBlock().style.display = "none";
    els.code().innerHTML = "";
  }

  if (item.source?.label || item.source?.url) {
    const label = item.source?.label ? String(item.source.label) : t().misc.source;
    if (item.source?.url) {
      const a = document.createElement("a");
      a.href = item.source.url;
      a.textContent = label;
      a.target = "_blank";
      a.rel = "noreferrer";
      els.sourceLine().innerHTML = "";
      els.sourceLine().append(t().misc.sourcePrefix, a);
    } else {
      els.sourceLine().textContent = `${t().misc.sourcePrefix}${label}`;
    }
  } else {
    els.sourceLine().textContent = "";
  }
}

function flipCard() {
  els.card().classList.toggle("is-flipped");
}

function nextCard(delta) {
  activeIndex = clampIndex(activeIndex + delta);
  els.card().classList.remove("is-flipped");
  render();
}

function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function setActiveTab(tab) {
  activeTab = tab;
  els.tabs().forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
  activeIndex = 0;
  els.card().classList.remove("is-flipped");
  render();

  // Keep Sources / HowTo / About visually near the footer (not scrolled to the top of the page).
  requestAnimationFrame(() => {
    if (tab !== "Sources" && tab !== "HowTo" && tab !== "About") return;
    const wrap = document.querySelector(".bottomInfo");
    if (!wrap) return;
    wrap.scrollIntoView({ block: "end", inline: "nearest", behavior: "smooth" });
  });
}

async function loadQuestions() {
  const results = await Promise.all(
    QUESTION_BANK_URLS.map(async (url) => {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Could not load ${url}: ${res.status}`);
      const json = await res.json();
      if (!Array.isArray(json)) throw new Error(`Bank ${url} must be an array of questions.`);
      return json;
    })
  );
  return results.flat();
}

function bindEvents() {
  els.tabs().forEach((btn) => {
    btn.addEventListener("click", () => setActiveTab(btn.dataset.tab || "All"));
  });

  if (els.langToggle()) {
    els.langToggle().addEventListener("click", () => {
      lang = lang === "en" ? "es" : "en";
      document.documentElement.lang = lang;
      saveLang();
      render();
    });
  }

  if (els.themeToggle()) {
    els.themeToggle().addEventListener("click", () => {
      settings.theme = settings.theme === "dark" ? "light" : settings.theme === "light" ? "pink" : "dark";
      applyTheme();
      saveSettings();
      render();
    });
  }

  const openFilters = () => {
    const m = els.filtersModal();
    if (!m) return;
    m.classList.add("is-open");
    m.setAttribute("aria-hidden", "false");
  };
  const closeFilters = () => {
    const m = els.filtersModal();
    if (!m) return;
    m.classList.remove("is-open");
    m.setAttribute("aria-hidden", "true");
  };

  if (els.filtersBtn()) els.filtersBtn().addEventListener("click", openFilters);
  if (els.filtersClose()) els.filtersClose().addEventListener("click", closeFilters);
  if (els.filtersModal()) {
    els.filtersModal().addEventListener("click", (e) => {
      const t = /** @type {HTMLElement} */ (e.target);
      if (t.matches("[data-close='true']")) closeFilters();
    });
  }

  if (els.pathToggle()) {
    els.pathToggle().addEventListener("change", () => {
      settings.learningPath = Boolean(els.pathToggle().checked);
      saveSettings();
      activeIndex = 0;
      render();
    });
  }

  ["input", "change"].forEach((evt) => {
    els.search().addEventListener(evt, () => {
      activeIndex = 0;
      render();
    });
  });

  els.difficulty().addEventListener("change", () => {
    activeIndex = 0;
    render();
  });
  els.status().addEventListener("change", () => {
    activeIndex = 0;
    render();
  });

  els.prev().addEventListener("click", () => nextCard(-1));
  els.next().addEventListener("click", () => nextCard(1));
  els.flip().addEventListener("click", flipCard);
  if (els.randomQuestion()) {
    els.randomQuestion().addEventListener("click", () => {
      if (filtered.length === 0) return;
      activeIndex = Math.floor(Math.random() * filtered.length);
      els.card().classList.remove("is-flipped");
      render();
    });
  }
  els.card().addEventListener("click", (e) => {
    // Avoid flipping when selecting text inside back.
    if (window.getSelection?.()?.toString()) return;
    const t = /** @type {HTMLElement} */ (e.target);
    if (t.closest("button, a, input, select, textarea, pre, code")) return;
    flipCard();
  });

  els.shuffle().addEventListener("click", () => {
    shuffleInPlace(allQuestions);
    activeIndex = 0;
    els.card().classList.remove("is-flipped");
    render();
  });

  if (els.reloadQuestions()) {
    els.reloadQuestions().addEventListener("click", async () => {
      try {
        allQuestions = await loadQuestions();
        filtered = allQuestions.slice();
        activeIndex = 0;
        els.card().classList.remove("is-flipped");
        render();
      } catch (err) {
        console.error(err);
        alert(String(err?.message ?? err));
      }
    });
  }

  els.resetProgress().addEventListener("click", () => {
    if (!confirm(t().misc.resetConfirm)) return;
    progress = {};
    saveProgress();
    render();
  });

  els.markLearning().addEventListener("click", () => {
    if (filtered.length === 0) return;
    setState(filtered[activeIndex], "Learning");
  });
  if (els.markRevisit()) {
    els.markRevisit().addEventListener("click", () => {
      if (filtered.length === 0) return;
      setState(filtered[activeIndex], "Revisit");
    });
  }
  els.markKnown().addEventListener("click", () => {
    if (filtered.length === 0) return;
    setState(filtered[activeIndex], "Known");
  });

  document.addEventListener("keydown", (e) => {
    if (e.target && /** @type {HTMLElement} */ (e.target).closest("input, textarea, select")) return;
    if (e.key === "Escape") closeFilters();
    if (e.key === "ArrowLeft") nextCard(-1);
    if (e.key === "ArrowRight") nextCard(1);
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      flipCard();
    }
    if (e.key.toLowerCase() === "s") {
      shuffleInPlace(allQuestions);
      activeIndex = 0;
      els.card().classList.remove("is-flipped");
      render();
    }
  });
}

async function main() {
  // A small safety config for marked to avoid accidental raw HTML injection.
  if (window.marked?.setOptions) {
    window.marked.setOptions({ mangle: false, headerIds: false });
  }

  document.documentElement.lang = lang;
  applyTheme();
  bindEvents();

  try {
    allQuestions = await loadQuestions();
    filtered = allQuestions.slice();
    activeIndex = 0;
    render();
  } catch (err) {
    console.error(err);
    els.question().textContent = t().misc.loadErrorTitle;
    renderMarkdown(
      els.answer(),
      t().misc.loadErrorBody(String(err?.message ?? err))
    );
  }
}

function applyTheme() {
  const theme = settings.theme === "light" ? "light" : settings.theme === "pink" ? "pink" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
}

main();


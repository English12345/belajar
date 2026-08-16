/* ============================================================
   English Reading Nook — shared app logic
   Works on every page (index, story readers, vocab list).
   No build step: plain script, loaded via <script src>.
   ============================================================ */

const VOCAB_KEY = "erb_vocab_v1"; // localStorage key for saved words

/* ---------------- vocabulary storage ---------------- */
function loadVocab() {
  try {
    return JSON.parse(localStorage.getItem(VOCAB_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveVocabStore(store) {
  localStorage.setItem(VOCAB_KEY, JSON.stringify(store));
}
function vocabCount() {
  return Object.keys(loadVocab()).length;
}
function isSaved(word) {
  const store = loadVocab();
  return !!store[word.toLowerCase()];
}
function addToVocab(entry) {
  const store = loadVocab();
  store[entry.word.toLowerCase()] = entry;
  saveVocabStore(store);
}
function removeFromVocab(word) {
  const store = loadVocab();
  delete store[word.toLowerCase()];
  saveVocabStore(store);
}

/* ---------------- speech (pronunciation) ---------------- */
let cachedVoice = null;
function pickEnglishVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  cachedVoice =
    voices.find((v) => /en-US/i.test(v.lang) && /female|Samantha|Google US/i.test(v.name)) ||
    voices.find((v) => /en-US/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    null;
  return cachedVoice;
}
if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickEnglishVoice();
  };
}
function speak(text, rate = 0.92) {
  if (!window.speechSynthesis) {
    alert("Maaf, browser ini belum mendukung fitur suara (Web Speech API).");
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = rate;
  const v = pickEnglishVoice();
  if (v) utter.voice = v;
  window.speechSynthesis.speak(utter);
}

/* ---------------- lookup APIs (free, no key) ---------------- */
async function fetchDefinition(word) {
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const entry = data[0];
    const phonetic =
      entry.phonetic ||
      (entry.phonetics || []).map((p) => p.text).filter(Boolean)[0] ||
      "";
    const meaning = (entry.meanings || [])[0];
    const def = meaning && meaning.definitions && meaning.definitions[0];
    return {
      phonetic,
      partOfSpeech: meaning ? meaning.partOfSpeech : "",
      definition: def ? def.definition : "",
      example: def ? def.example : "",
    };
  } catch (e) {
    return null;
  }
}
async function fetchTranslation(word) {
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        word
      )}&langpair=en|id`
    );
    if (!res.ok) return "";
    const data = await res.json();
    const t = data && data.responseData && data.responseData.translatedText;
    return t && t.toLowerCase() !== word.toLowerCase() ? t : t || "";
  } catch (e) {
    return "";
  }
}

/* ---------------- eye-comfort theme ("Mode Nyaman Mata") ---------------- */
const THEME_KEY = "erb_theme";
function applyStoredTheme() {
  const theme = localStorage.getItem(THEME_KEY);
  document.documentElement.setAttribute(
    "data-theme",
    theme === "comfort" ? "comfort" : "day"
  );
}
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  function render() {
    const isComfort = document.documentElement.getAttribute("data-theme") === "comfort";
    btn.textContent = isComfort ? "☀️ Mode Terang" : "🌙 Mode Nyaman Mata";
    btn.setAttribute("aria-pressed", String(isComfort));
  }
  render();
  btn.addEventListener("click", () => {
    const isComfort = document.documentElement.getAttribute("data-theme") === "comfort";
    const next = isComfort ? "day" : "comfort";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(THEME_KEY, next);
    render();
  });
}

/* ---------------- "Lihat Arti" translation toggle (per story) ---------------- */
function initTranslationToggle() {
  const btn = document.getElementById("toggle-translation-btn");
  const storyEl = document.getElementById("story-text");
  if (!btn || !storyEl) return;
  function render() {
    const shown = storyEl.classList.contains("show-translation");
    btn.textContent = shown ? "🙈 Sembunyikan Arti" : "👁 Lihat Arti Cerita";
  }
  render();
  btn.addEventListener("click", () => {
    storyEl.classList.toggle("show-translation");
    render();
  });
}

/* ---------------- word wrapping in story text ---------------- */
// Wraps every English word inside .story-en paragraphs with a
// clickable <span class="word">. Punctuation & spacing untouched.
// (.story-id paragraphs, the Indonesian translation lines, are skipped.)
function wrapWordsInStory(root) {
  const paragraphs = root.querySelectorAll("p.story-en");
  paragraphs.forEach((p) => {
    const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach((textNode) => {
      const frag = document.createDocumentFragment();
      const parts = textNode.textContent.split(/([A-Za-z]+(?:'[A-Za-z]+)?)/);
      parts.forEach((part) => {
        if (/^[A-Za-z]+(?:'[A-Za-z]+)?$/.test(part)) {
          const span = document.createElement("span");
          span.className = "word";
          span.textContent = part;
          span.dataset.word = part.replace(/'.*$/, ""); // lookup base word
          frag.appendChild(span);
        } else if (part) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  });
}

/* ---------------- lookup drawer UI ---------------- */
function initLookupDrawer() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  const drawer = document.createElement("div");
  drawer.className = "drawer";
  drawer.innerHTML = `
    <button class="drawer-close" aria-label="Tutup">✕</button>
    <div class="eyebrow">Kartu Kata</div>
    <div class="drawer-word" id="dw-word">word</div>
    <div class="drawer-phonetic" id="dw-phonetic"></div>
    <div class="drawer-actions">
      <button class="icon-btn" id="dw-speak" title="Dengarkan pengucapan">🔊</button>
      <button class="icon-btn" id="dw-save" title="Simpan ke daftar kosakata">♡</button>
    </div>
    <div class="drawer-section-label">Arti (Indonesia)</div>
    <div class="drawer-text" id="dw-translation">memuat…</div>
    <div class="drawer-section-label">Definisi (English)</div>
    <div class="drawer-text" id="dw-definition">memuat…</div>
    <div class="drawer-example" id="dw-example" style="display:none;"></div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  const els = {
    word: drawer.querySelector("#dw-word"),
    phonetic: drawer.querySelector("#dw-phonetic"),
    speakBtn: drawer.querySelector("#dw-speak"),
    saveBtn: drawer.querySelector("#dw-save"),
    translation: drawer.querySelector("#dw-translation"),
    definition: drawer.querySelector("#dw-definition"),
    example: drawer.querySelector("#dw-example"),
    close: drawer.querySelector(".drawer-close"),
  };

  let currentWord = "";
  let currentData = { phonetic: "", definition: "", translation: "", example: "" };
  let activeSpan = null;

  function closeDrawer() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    if (activeSpan) activeSpan.classList.remove("is-active");
    activeSpan = null;
  }
  overlay.addEventListener("click", closeDrawer);
  els.close.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDrawer();
  });

  function refreshSaveButton() {
    if (isSaved(currentWord)) {
      els.saveBtn.classList.add("saved");
      els.saveBtn.textContent = "♥";
      els.saveBtn.title = "Sudah tersimpan — klik untuk hapus";
    } else {
      els.saveBtn.classList.remove("saved");
      els.saveBtn.textContent = "♡";
      els.saveBtn.title = "Simpan ke daftar kosakata";
    }
  }

  els.speakBtn.addEventListener("click", () => speak(currentWord));
  els.saveBtn.addEventListener("click", () => {
    if (isSaved(currentWord)) {
      removeFromVocab(currentWord);
      if (activeSpan) activeSpan.classList.remove("is-saved");
    } else {
      addToVocab({
        word: currentWord,
        phonetic: currentData.phonetic,
        translation: currentData.translation,
        definition: currentData.definition,
        source: document.title.replace(/\s*[-—|].*$/, ""),
        savedAt: Date.now(),
      });
      if (activeSpan) activeSpan.classList.add("is-saved");
    }
    refreshSaveButton();
  });

  async function openForSpan(span) {
    if (activeSpan) activeSpan.classList.remove("is-active");
    activeSpan = span;
    activeSpan.classList.add("is-active");

    const word = span.dataset.word;
    currentWord = word;
    els.word.textContent = word;
    els.phonetic.textContent = "";
    els.translation.textContent = "memuat…";
    els.translation.classList.add("muted");
    els.definition.textContent = "memuat…";
    els.definition.classList.add("muted");
    els.example.style.display = "none";
    refreshSaveButton();

    drawer.classList.add("open");
    overlay.classList.add("open");

    const [def, translation] = await Promise.all([
      fetchDefinition(word),
      fetchTranslation(word),
    ]);

    // Only apply results if the user hasn't since clicked a different word
    if (currentWord !== word) return;

    currentData.phonetic = (def && def.phonetic) || "";
    currentData.definition = (def && def.definition) || "";
    currentData.example = (def && def.example) || "";
    currentData.translation = translation || "";

    els.phonetic.textContent = currentData.phonetic;

    els.translation.classList.remove("muted");
    els.translation.textContent = currentData.translation
      ? currentData.translation
      : "Terjemahan tidak ditemukan.";
    if (!currentData.translation) els.translation.classList.add("muted");

    els.definition.classList.remove("muted");
    if (currentData.definition) {
      els.definition.textContent =
        (def.partOfSpeech ? `(${def.partOfSpeech}) ` : "") + currentData.definition;
    } else {
      els.definition.textContent = "Definisi tidak ditemukan.";
      els.definition.classList.add("muted");
    }

    if (currentData.example) {
      els.example.style.display = "block";
      els.example.textContent = `“${currentData.example}”`;
    }
  }

  document.body.addEventListener("click", (e) => {
    const span = e.target.closest(".word");
    if (span) openForSpan(span);
  });
}

/* ---------------- mark already-saved words on load ---------------- */
function markSavedWords(root) {
  const store = loadVocab();
  root.querySelectorAll(".word").forEach((span) => {
    if (store[span.dataset.word.toLowerCase()]) span.classList.add("is-saved");
  });
}

/* ---------------- read-whole-story button ---------------- */
function initReadAloudButton() {
  const btn = document.getElementById("read-aloud-btn");
  const storyEl = document.getElementById("story-text");
  if (!btn || !storyEl) return;
  let playing = false;
  btn.addEventListener("click", () => {
    if (!window.speechSynthesis) {
      alert("Browser ini belum mendukung fitur suara.");
      return;
    }
    if (playing) {
      window.speechSynthesis.cancel();
      playing = false;
      btn.classList.remove("playing");
      btn.innerHTML = "🔊 Bacakan cerita";
      return;
    }
    const text = storyEl.innerText;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.94;
    const v = pickEnglishVoice();
    if (v) utter.voice = v;
    utter.onend = () => {
      playing = false;
      btn.classList.remove("playing");
      btn.innerHTML = "🔊 Bacakan cerita";
    };
    window.speechSynthesis.speak(utter);
    playing = true;
    btn.classList.add("playing");
    btn.innerHTML = "⏹ Berhenti";
  });
}

/* ---------------- nav vocab counter (every page) ---------------- */
function refreshVocabPill() {
  document.querySelectorAll(".vocab-pill").forEach((pill) => {
    pill.textContent = vocabCount();
  });
}

/* ---------------- init story reader page ---------------- */
function initStoryPage() {
  const storyEl = document.getElementById("story-text");
  if (!storyEl) return;
  wrapWordsInStory(storyEl);
  markSavedWords(storyEl);
  initLookupDrawer();
  initReadAloudButton();
  initTranslationToggle();
}

document.addEventListener("DOMContentLoaded", () => {
  applyStoredTheme();
  initThemeToggle();
  refreshVocabPill();
  initStoryPage();
});

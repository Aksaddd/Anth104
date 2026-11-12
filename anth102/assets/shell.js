// Shared page shell: the top navigation bar and the Settings sheet (appearance, exam date, reading font, text size).
// Loaded in <head> on every page so the theme is set before anything paints. Everything is saved in this browser only.
(() => {
  const ROOT = new URL("..", document.currentScript.src);          // the site's root (this file lives in /assets/)
  const at = p => new URL(p, ROOT).href;
  const KEYS = { theme: "anthro-theme", exam: "anthro-exam-date", read: "anthro-reading", simple: "anthro-simple" };
  const get = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : v } catch (e) { return d } };
  const set = (k, v) => { try { localStorage.setItem(k, v) } catch (e) { } };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const DEFAULT_EXAM = "2026-11-10T10:45";

  // ===== Appearance: light (default), dark, or automatic (follows the device)
  const mq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
  function applyTheme() {
    const pref = get(KEYS.theme, "light");
    const dark = pref === "dark" || (pref === "auto" && mq && mq.matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = dark ? "#1c1c1e" : "#f5f5f7";
  }
  applyTheme();
  document.documentElement.dataset.layout = get(KEYS.simple, "1") === "0" ? "detailed" : "simple";
  if (mq && mq.addEventListener) mq.addEventListener("change", applyTheme);

  // ===== Reading font and text size (shared with the drills' Options menu)
  const FONTS = {
    system: { label: "San Francisco", note: "Apple's system font", stack: '-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,"Segoe UI",Roboto,sans-serif' },
    plex: { label: "IBM Plex Sans", note: "Open and even (default)", stack: '"IBM Plex Sans",system-ui,-apple-system,sans-serif', href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap" },
    atkinson: { label: "Atkinson Hyperlegible", note: "Every letter easy to tell apart", stack: '"Atkinson Hyperlegible Next","Atkinson Hyperlegible",system-ui,sans-serif', href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600;700&display=swap" },
    literata: { label: "Literata", note: "A serif made for screen reading", stack: 'Literata,Georgia,"Times New Roman",serif', href: "https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;600;700&display=swap" }
  };
  const SIZES = [{ k: .9, label: "A−", name: "Small" }, { k: 1, label: "A", name: "Default" }, { k: 1.12, label: "A+", name: "Large" }, { k: 1.25, label: "A++", name: "Extra large" }];
  function reading() { let r = { font: "plex", size: 1 }; try { const s = JSON.parse(get(KEYS.read, "null")); if (s && FONTS[s.font]) r.font = s.font; if (s && SIZES[s.size]) r.size = s.size } catch (e) { } return r }
  function applyReading() {
    const r = reading(), f = FONTS[r.font];
    if (f.href && !document.querySelector(`link[data-font="${r.font}"]`)) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = f.href; l.dataset.font = r.font; document.head.appendChild(l) }
    document.documentElement.style.setProperty("--read", f.stack);
    document.documentElement.style.setProperty("--rs", SIZES[r.size].k);
  }
  applyReading();

  // ===== Exam date (the home page counts down to it)
  function examDate() { const v = get(KEYS.exam, DEFAULT_EXAM); const d = new Date(v); return isNaN(d) ? new Date(DEFAULT_EXAM) : d }
  window.ANTHRO = { examDate, onChange: fn => addEventListener("anthro-settings", fn) };
  const changed = what => dispatchEvent(new CustomEvent("anthro-settings", { detail: { what } }));

  // ===== Top bar
  const LINKS = [
    ["Exam 2 Drill", "exam2/index.html", "/exam2/"],
    ["Anthro-pardy", "anthropardy/index.html", "/anthropardy/"],
    ["Classification", "classification/index.html", "/classification/"],
    ["Word Roots", "roots/index.html", "/roots/"],
    ["Mock Exam", "mock/index.html", "/mock/"],
    ["Review List", "review/index.html?exam=2", "/review/"],
    ["Exam 1 Drill", "exam1/index.html", "/exam1/"]
  ];
  function buildNav() {
    const here = location.pathname;
    const nav = document.createElement("nav"); nav.className = "gnav"; nav.setAttribute("aria-label", "Study modules");
    nav.innerHTML = `<div class="gnav-in"><a class="gnav-brand" href="${at("index.html")}" aria-label="Home">ANTH 102</a>
      <div class="gnav-links">${LINKS.map(([l, h, m]) => `<a href="${at(h)}"${here.includes(m) ? ' aria-current="page"' : ""}>${l}</a>`).join("")}</div>
      <button type="button" class="gnav-set" id="gnavSet" aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg><span>Settings</span></button></div>`;
    const spacer = document.createElement("div"); spacer.className = "gnav-space"; spacer.setAttribute("aria-hidden", "true");
    document.body.prepend(nav, spacer);
    const cur = nav.querySelector('[aria-current="page"]'); if (cur) cur.scrollIntoView({ block: "nearest", inline: "center" });
    document.getElementById("gnavSet").onclick = openSheet;
  }

  // ===== Settings sheet
  let lastFocus = null;
  function toLocalInput(d) { const p = n => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}` }
  function openSheet() {
    lastFocus = document.activeElement;
    const pref = get(KEYS.theme, "light"), r = reading();
    const wrap = document.createElement("div"); wrap.className = "gsheet-wrap"; wrap.id = "gsheet";
    wrap.innerHTML = `<div class="gsheet" role="dialog" aria-modal="true" aria-labelledby="gsTitle">
      <header class="gs-head"><span></span><h2 id="gsTitle">Settings</h2><button type="button" class="gs-done" id="gsDone">Done</button></header>
      <div class="gs-body">
        <p class="gs-label">Appearance</p>
        <div class="gs-group gs-themes" role="radiogroup" aria-label="Appearance">
          ${[["light", "Light"], ["dark", "Dark"], ["auto", "Automatic"]].map(([k, l]) => `<label class="gs-theme"><span class="gs-phone gs-${k}" aria-hidden="true"><i></i><i></i><i></i></span><span>${l}</span><input type="radio" name="gsTheme" value="${k}"${pref === k ? " checked" : ""}><span class="gs-radio" aria-hidden="true"></span></label>`).join("")}
        </div>
        <p class="gs-note">Automatic matches your device's light or dark setting.</p>
        <p class="gs-label">Layout</p>
        <div class="gs-group" role="radiogroup" aria-label="Layout">
          ${[["1", "Simple", "Recommended. Opens straight on a question, with less on screen"], ["0", "Detailed", "Shows the subject tabs, question map and tips right away"]].map(([k, l, n]) => `<label class="gs-row gs-font"><span><b>${l}</b><small>${n}</small></span><input type="radio" name="gsLayout" value="${k}"${get(KEYS.simple, "1") === k ? " checked" : ""}><span class="gs-check" aria-hidden="true">✓</span></label>`).join("")}
        </div>
        <p class="gs-note">You can always open the subjects and the question map from inside a drill.</p>
        <p class="gs-label">Exam</p>
        <div class="gs-group"><label class="gs-row"><span>Date &amp; time</span><input type="datetime-local" id="gsExam" value="${toLocalInput(examDate())}"></label></div>
        <p class="gs-note">The home page counts down to this. Saved on this device only. <button type="button" class="gs-link" id="gsExamReset">Reset to Tue, Nov 10, 10:45 am</button></p>
        <p class="gs-label">Reading font</p>
        <div class="gs-group" role="radiogroup" aria-label="Reading font">
          ${Object.entries(FONTS).map(([k, f]) => `<label class="gs-row gs-font"><span><b style="font-family:${f.stack.replace(/"/g, "&quot;")}">${f.label}</b><small>${f.note}</small></span><input type="radio" name="gsFont" value="${k}"${r.font === k ? " checked" : ""}><span class="gs-check" aria-hidden="true">✓</span></label>`).join("")}
        </div>
        <p class="gs-note">Used for questions and answers in the drills, games and Word Roots.</p>
        <p class="gs-label">Text size</p>
        <div class="gs-group gs-sizes" role="radiogroup" aria-label="Text size">
          ${SIZES.map((z, i) => `<label class="gs-size" style="font-size:${15 * z.k}px"><input type="radio" name="gsSize" value="${i}"${r.size === i ? " checked" : ""}><span>${z.label}</span><small>${z.name}</small></label>`).join("")}
        </div>
      </div></div>`;
    document.body.appendChild(wrap); document.documentElement.classList.add("gs-open");
    const save = () => { const rr = reading(); rr.font = wrap.querySelector('[name="gsFont"]:checked').value; rr.size = +wrap.querySelector('[name="gsSize"]:checked').value; set(KEYS.read, JSON.stringify(rr)); applyReading(); changed("reading") };
    wrap.querySelectorAll('[name="gsTheme"]').forEach(i => i.onchange = () => { set(KEYS.theme, i.value); applyTheme(); changed("theme") });
    wrap.querySelectorAll('[name="gsFont"],[name="gsSize"]').forEach(i => i.onchange = save);
    wrap.querySelectorAll('[name="gsLayout"]').forEach(i => i.onchange = () => {
      set(KEYS.simple, i.value);
      try { localStorage.removeItem("anthro-tabs-collapsed"); localStorage.removeItem("anthro-showmap") } catch (e) { }   // let the new layout's defaults apply
      location.reload();
    });
    const ex = wrap.querySelector("#gsExam");
    ex.onchange = () => { if (ex.value && !isNaN(new Date(ex.value))) { set(KEYS.exam, ex.value); changed("exam") } };
    wrap.querySelector("#gsExamReset").onclick = () => { set(KEYS.exam, DEFAULT_EXAM); ex.value = DEFAULT_EXAM; changed("exam") };
    const close = () => { wrap.remove(); document.documentElement.classList.remove("gs-open"); document.removeEventListener("keydown", onKey); if (lastFocus) lastFocus.focus() };
    const onKey = e => { if (e.key === "Escape") close() };
    document.addEventListener("keydown", onKey);
    wrap.addEventListener("click", e => { if (e.target === wrap) close() });
    wrap.querySelector("#gsDone").onclick = close;
    wrap.querySelector("#gsDone").focus();
  }


  // ===== Timer switch for pages without their own timer (drills, Word Roots, Anthro-pardy): a session clock.
  // Shares the "anthro-timer" setting with the Mock Exam and the chart, so it's on or off everywhere. Off by default.
  function mountTimers() {
    const slots = document.querySelectorAll("[data-timer-slot]"); if (!slots.length) return;
    const isOn = () => { try { return JSON.parse(localStorage.getItem("anthro-timer") || "false") === true } catch (e) { return false } };
    let secs = 0, tick = null;
    const fmt = s => (s >= 3600 ? Math.floor(s / 3600) + ":" + String(Math.floor(s / 60) % 60).padStart(2, "0") : Math.floor(s / 60)) + ":" + String(s % 60).padStart(2, "0");
    const paint = () => document.querySelectorAll(".tpill .tt").forEach(t => t.textContent = fmt(secs));
    const run = () => { clearInterval(tick); tick = null; if (isOn() && !document.hidden) tick = setInterval(() => { secs++; paint() }, 1000) };
    slots.forEach(slot => {
      slot.innerHTML = `<label class="tpill" title="Shows how long you've been studying on this page"><input type="checkbox"${isOn() ? " checked" : ""}><span class="sw" aria-hidden="true"></span><span class="tl">⏱ Timer</span><span class="ts ts-off">Off</span><span class="ts ts-on">On <b class="tt">0:00</b></span></label>`;
      slot.querySelector("input").onchange = e => {
        try { localStorage.setItem("anthro-timer", JSON.stringify(e.target.checked)) } catch (er) { }
        document.querySelectorAll("[data-timer-slot] input").forEach(i => i.checked = e.target.checked);
        if (!e.target.checked) secs = 0;
        paint(); run();
      };
    });
    document.addEventListener("visibilitychange", run);
    paint(); run();
  }
  const ready = () => { buildNav(); mountTimers() };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
})();

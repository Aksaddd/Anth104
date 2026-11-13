// ErgoRead · the reader from the Eureka app (EurekaDemo1: ErgoReadPanel, InteractiveText, WordInfoBubble, WordBankPanel,
// useFlowProgress), rebuilt for these static Read & Learn pages. Loaded on every class's read/ page.
//
//   Reading settings   theme (light / sepia / dark), text contrast, font size, line height, content width, paragraph gap,
//                      first-line indent, heading scale, font and alignment. Saved as "ergoread-settings" (the app's key).
//   Word bubble        rest the pointer on a word for 0.8 s (or tap it, where there is no double-tap dictionary) to see what
//                      it means: the class's own dictionary first, then a general dictionary.
//   Word bank          save words from the bubble and review them later ("eureka-word-bank").
//   Reading progress   a thin bar across the top that fills as you read down the chapter.
//
// It styles the passages (.rd-sec, .rd-prose) through CSS variables; nothing else on the page changes.
(() => {
  if (window.ErgoRead) return;
  const KEY = "ergoread-settings", BANK = "eureka-word-bank";
  const DEF = { theme: "light", contrast: 100, fontSize: 18, lineHeight: 1.6, width: 700, paraGap: 1.2, indent: 0, headingScale: 1.3, fontFamily: "system", align: "left" };
  const FONTS = { helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif', system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', georgia: 'Georgia, "Times New Roman", serif', inter: 'Inter, system-ui, sans-serif' };
  const THEMES = { light: { bg: "#ffffff", ink: "#1a1a1a", page: "" }, sepia: { bg: "#f5f0e6", ink: "#433422", page: "#ece5d6" }, dark: { bg: "#1a1a1a", ink: "#e5e5e5", page: "#0f0f10" } };
  const $ = id => document.getElementById(id), esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let S = Object.assign({}, DEF); try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")) } catch (e) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) { } };
  let bank = []; try { bank = JSON.parse(localStorage.getItem(BANK) || "[]") || [] } catch (e) { }
  const saveBank = () => { try { localStorage.setItem(BANK, JSON.stringify(bank)) } catch (e) { } };

  // ---------- styles
  const st = document.createElement("style"); st.textContent = `
.rd-sec{background:var(--er-bg,var(--paper));transition:background .2s}
.rd-sec .rd-prose{font-family:var(--er-font);font-size:var(--er-size);line-height:var(--er-lh);text-align:var(--er-align);color:var(--er-text)}
.rd-sec .rd-prose p{margin:0 0 var(--er-gap);text-indent:var(--er-indent)}
.rd-sec .rd-prose li{margin-bottom:calc(var(--er-gap) * .45)}
.rd-sec>h2{font-size:calc(var(--er-size) * var(--er-hs));line-height:1.25;color:var(--er-ink)}
body.er-reading .wrap{max-width:var(--er-width)}
body.er-reading.er-sepia{background:#ece5d6} body.er-reading.er-dark{background:#0f0f10}
body.er-sepia .rd-sec .rd-prose strong,body.er-sepia .rd-sec .rd-prose b{color:#2f2416} body.er-dark .rd-sec .rd-prose strong,body.er-dark .rd-sec .rd-prose b{color:#fff}
.er-bar{position:fixed;top:0;left:0;height:3px;width:0;z-index:60;background:#0b0b0c;transition:width .12s linear;border-radius:0 3px 3px 0}
.er-fab{position:fixed;left:max(16px,env(safe-area-inset-left,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));z-index:44;display:inline-flex;align-items:center;gap:7px;border:1px solid #e5e7eb;background:#fff;color:#1a1a1a;border-radius:2px;padding:10px 14px;letter-spacing:.14em;text-transform:uppercase;font-size:11px;font:600 11px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.08)}
.er-fab:hover{border-color:#0b0b0c;color:#0b0b0c} .er-fab b{font:700 15px Georgia,serif}
[data-theme="dark"] .er-fab{background:#1c1c1e;color:#f5f5f7;border-color:#38383a}
.er-panel{position:fixed;left:max(16px,env(safe-area-inset-left,0px));bottom:68px;z-index:70;width:min(320px,calc(100vw - 32px));max-height:min(78vh,640px);overflow:auto;background:#fff;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:4px;box-shadow:0 20px 50px rgba(0,0,0,.18);font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:erUp .18s ease}
@keyframes erUp{from{opacity:0;transform:translateY(8px)}}
.er-head{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fff;z-index:1}
.er-head .ic{width:32px;height:32px;border-radius:8px;background:#f1eee9;color:#0b0b0c;display:grid;place-items:center;font:700 15px Georgia,serif}
.er-head h2{margin:0;font-size:15px;font-weight:700} .er-head p{margin:0;font-size:11px;color:#6b7280}
.er-head .x{margin-left:auto;border:0;background:none;color:#9ca3af;font-size:16px;cursor:pointer;border-radius:6px;padding:4px 7px} .er-head .x:hover{background:#f3f4f6}
.er-body{padding:14px 16px;display:flex;flex-direction:column;gap:14px}
.er-lab{display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:#374151;margin-bottom:6px} .er-lab span{font-weight:500;color:#6b7280;font-variant-numeric:tabular-nums}
.er-row{display:flex;gap:6px} .er-row button{flex:1;border:1px solid #e5e7eb;background:#fff;border-radius:8px;padding:8px 4px;font:500 12px inherit;font-family:inherit;cursor:pointer;color:#374151}
.er-row button[aria-pressed="true"]{border:2px solid #0b0b0c;padding:7px 3px;background:#f1eee9;color:#0b0b0c}
.er-panel input[type=range]{width:100%;accent-color:#0b0b0c;margin:0}
.er-foot{display:flex;gap:8px} .er-foot button{flex:1;border:1px solid #e5e7eb;background:#fff;border-radius:8px;padding:9px;font:500 12.5px inherit;font-family:inherit;color:#6b7280;cursor:pointer} .er-foot button:hover{background:#f9fafb;border-color:#d1d5db}
.er-foot .pri{color:#0b0b0c;border-color:#d9d5cd;background:#f1eee9}
.er-note{background:#f9fafb;border-radius:8px;padding:9px 11px;font-size:11.5px;color:#6b7280}
.er-bub{position:fixed;z-index:80;width:min(300px,calc(100vw - 24px));background:#fff;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:4px;box-shadow:0 12px 32px rgba(0,0,0,.18);padding:12px 14px;font:13.5px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:erUp .15s ease}
.er-bub h3{margin:0;font-size:16px;font-weight:700;display:flex;align-items:baseline;gap:8px} .er-bub h3 small{font-weight:500;font-size:11.5px;color:#6b7280;font-style:italic}
.er-bub p{margin:6px 0 0} .er-bub .src{font-size:11px;color:#9ca3af;margin-top:6px}
.er-bub .acts{display:flex;gap:8px;margin-top:10px} .er-bub .acts button{border:0;border-radius:8px;padding:7px 11px;font:600 12.5px inherit;font-family:inherit;cursor:pointer;background:#0b0b0c;color:#fff} .er-bub .acts button.sec{background:#f3f4f6;color:#374151}
.er-bub .acts button:disabled{background:#d1fae5;color:#047857;cursor:default}
.er-word{border-bottom:2px solid #0b0b0c;border-radius:2px}
.er-bank{display:flex;flex-direction:column;gap:8px} .er-bank div{border:1px solid #e5e7eb;border-radius:10px;padding:9px 11px;position:relative}
.er-bank b{font-size:14px} .er-bank p{margin:3px 0 0;color:#4b5563;font-size:12.5px} .er-bank button{position:absolute;top:6px;right:6px;border:0;background:none;color:#9ca3af;cursor:pointer;font-size:13px}
@media (prefers-reduced-motion:reduce){.er-panel,.er-bub{animation:none}.er-bar{transition:none}}
`; document.head.appendChild(st);

  // ---------- apply settings
  function apply() {
    const r = document.documentElement.style, T = THEMES[S.theme] || THEMES.light, on = !!document.querySelector(".rd-sec");
    const themed = S.theme !== "light";
    r.setProperty("--er-font", FONTS[S.fontFamily] || FONTS.system); r.setProperty("--er-size", S.fontSize + "px"); r.setProperty("--er-lh", S.lineHeight);
    r.setProperty("--er-align", S.align); r.setProperty("--er-gap", S.paraGap + "em"); r.setProperty("--er-indent", S.indent + "em"); r.setProperty("--er-hs", S.headingScale);
    r.setProperty("--er-width", S.width + "px");
    if (themed) { r.setProperty("--er-bg", T.bg); r.setProperty("--er-ink", T.ink) } else { r.removeProperty("--er-bg"); r.removeProperty("--er-ink") }
    // text contrast: mix the ink toward the page behind it
    r.setProperty("--er-text", S.contrast >= 100 ? (themed ? T.ink : "var(--ink)") : `color-mix(in srgb, ${themed ? T.ink : "var(--ink)"} ${S.contrast}%, ${themed ? T.bg : "var(--paper)"})`);
    document.body.classList.toggle("er-reading", on); document.body.classList.toggle("er-sepia", on && S.theme === "sepia"); document.body.classList.toggle("er-dark", on && S.theme === "dark");
  }

  // ---------- the panel
  const SLIDERS = [["contrast", "Text Contrast", 50, 100, 5, v => v + "%"], ["fontSize", "Font Size", 12, 28, 1, v => v + "px"], ["lineHeight", "Line Height", 1, 2.5, .05, v => (+v).toFixed(2)],
    ["width", "Content Width", 400, 1000, 20, v => v + "px"], ["paraGap", "Paragraph Gap", .5, 4, .1, v => (+v).toFixed(1) + "em"], ["indent", "First-Line Indent", 0, 4, .25, v => (+v).toFixed(2) + "em"], ["headingScale", "Heading Scale", 1, 2.5, .05, v => (+v).toFixed(2) + "×"]];
  let panel = null, view = "settings";
  function paintPanel() {
    if (!panel) return;
    const btns = (key, opts) => `<div class="er-row">${opts.map(([v, l, sty]) => `<button type="button" data-set="${key}" data-v="${v}" aria-pressed="${S[key] === v}" style="${sty || ""}">${l}</button>`).join("")}</div>`;
    panel.innerHTML = `<div class="er-head"><span class="ic" aria-hidden="true">Aa</span><div><h2>${view === "bank" ? "Word Bank" : "ErgoRead"}</h2><p>${view === "bank" ? bank.length + (bank.length === 1 ? " word saved" : " words saved") : "Reading settings"}</p></div><button type="button" class="x" aria-label="Close">✕</button></div>
      <div class="er-body">${view === "bank"
        ? (bank.length ? `<div class="er-bank">${bank.map((w, i) => `<div><b>${esc(w.word)}</b><p>${esc(w.def)}</p><button type="button" data-rm="${i}" aria-label="Remove ${esc(w.word)}">✕</button></div>`).join("")}</div>` : `<div class="er-note">No words yet. Rest your pointer on a word in a passage (or tap it) and choose “Save to word bank”.</div>`) + `<div class="er-foot"><button type="button" data-view="settings">← Reading settings</button></div>`
        : `<div><div class="er-lab">Theme</div>${btns("theme", [["light", "Light", "background:#fff;color:#1a1a1a"], ["sepia", "Sepia", "background:#f5f0e6;color:#433422"], ["dark", "Dark", "background:#1a1a1a;color:#e5e5e5"]])}</div>
          ${SLIDERS.map(([k, label, min, max, step, fmt]) => `<div><div class="er-lab">${label}<span id="erv-${k}">${fmt(S[k])}</span></div><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${S[k]}" aria-label="${label}"></div>`).join("")}
          <div><div class="er-lab">Font</div>${btns("fontFamily", [["helvetica", "Helvetica"], ["system", "System"], ["georgia", "Georgia"], ["inter", "Inter"]])}</div>
          <div><div class="er-lab">Text Align</div>${btns("align", [["left", "Left"], ["justify", "Justify"]])}</div>
          <div class="er-foot"><button type="button" class="pri" data-view="bank">Word bank · ${bank.length}</button><button type="button" id="erReset">Reset to defaults</button></div>
          <div class="er-note">Tip: rest your pointer on any word in a passage for a moment to see what it means.</div>`}</div>`;
    panel.querySelector(".x").onclick = closePanel;
    panel.querySelectorAll("[data-set]").forEach(b => b.onclick = () => { S[b.dataset.set] = b.dataset.v; save(); apply(); paintPanel() });
    panel.querySelectorAll("input[type=range]").forEach(i => i.oninput = () => { const k = i.dataset.k; S[k] = +i.value; const f = SLIDERS.find(x => x[0] === k)[5]; $("erv-" + k).textContent = f(S[k]); save(); apply() });
    panel.querySelectorAll("[data-view]").forEach(b => b.onclick = () => { view = b.dataset.view; paintPanel() });
    panel.querySelectorAll("[data-rm]").forEach(b => b.onclick = () => { bank.splice(+b.dataset.rm, 1); saveBank(); paintPanel() });
    if ($("erReset")) $("erReset").onclick = () => { S = Object.assign({}, DEF); save(); apply(); paintPanel() };
  }
  function openPanel(v) { view = v || "settings"; if (!panel) { panel = document.createElement("div"); panel.className = "er-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "ErgoRead reading settings"); document.body.appendChild(panel) } paintPanel() }
  function closePanel() { if (panel) { panel.remove(); panel = null } }
  addEventListener("keydown", e => { if (e.key === "Escape") { closePanel(); closeBubble() } });

  // ---------- reading progress + the ErgoRead button (only while a chapter is open)
  const bar = document.createElement("div"); bar.className = "er-bar"; bar.setAttribute("aria-hidden", "true");
  const fab = document.createElement("button"); fab.type = "button"; fab.className = "er-fab"; fab.innerHTML = `<b aria-hidden="true">Aa</b>ErgoRead`; fab.setAttribute("aria-label", "ErgoRead reading settings"); fab.onclick = () => panel ? closePanel() : openPanel();
  function progress() { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (document.querySelector(".rd-sec") && h > 0 ? Math.min(100, Math.max(0, scrollY / h * 100)) : 0) + "%" }
  function sync() {
    const on = !!document.querySelector(".rd-sec");
    if (on && !fab.isConnected) { document.body.appendChild(bar); document.body.appendChild(fab) }
    if (!on && fab.isConnected) { fab.remove(); bar.remove(); closePanel(); closeBubble() }
    apply(); progress();
  }
  addEventListener("scroll", progress, { passive: true }); addEventListener("resize", progress);

  // ---------- the word bubble
  let bub = null, timer = null, lastWord = "", mark = null;
  const cache = {};
  function wordAt(x, y) {
    let node, off;
    if (document.caretPositionFromPoint) { const p = document.caretPositionFromPoint(x, y); if (!p) return null; node = p.offsetNode; off = p.offset }
    else if (document.caretRangeFromPoint) { const r = document.caretRangeFromPoint(x, y); if (!r) return null; node = r.startContainer; off = r.startOffset }
    if (!node || node.nodeType !== 3 || !node.parentElement || !node.parentElement.closest(".rd-prose")) return null;
    const t = node.textContent; let a = off, b = off;
    while (a > 0 && /[A-Za-z'’-]/.test(t[a - 1])) a--; while (b < t.length && /[A-Za-z'’-]/.test(t[b])) b++;
    const word = t.slice(a, b).replace(/^['’-]+|['’-]+$/g, ""); if (word.length < 3) return null;
    const range = document.createRange(); range.setStart(node, a); range.setEnd(node, b);
    const rect = range.getBoundingClientRect(); if (x < rect.left - 2 || x > rect.right + 2 || y < rect.top - 2 || y > rect.bottom + 2) return null;
    return { word, rect, el: node.parentElement };
  }
  // the class's own dictionary first (assets/lexicon.js and glossary.js, when the page has them), then a general dictionary
  async function lookup(word) {
    const k = word.toLowerCase(); if (cache[k]) return cache[k];
    const L = window.LEXICON || {}, forms = [k, k.replace(/s$/, ""), k.replace(/es$/, ""), k.replace(/ies$/, "y")];
    for (const f of forms) if (L[f]) return (cache[k] = { word: f, def: L[f][0], pos: "", src: "Class dictionary" });
    if (window.GLOSS && window.GLOSS.look) { try { const g = window.GLOSS.look(word); if (g) return (cache[k] = { word: k, def: typeof g === "string" ? g : g.def || g.text || String(g), pos: "", src: "Class glossary" }) } catch (e) { } }
    try {
      const r = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(k)); if (!r.ok) throw 0;
      const j = await r.json(), m = j[0].meanings[0];
      return (cache[k] = { word: j[0].word, def: m.definitions[0].definition, pos: m.partOfSpeech || "", src: "Dictionary" });
    } catch (e) { return (cache[k] = { word: k, def: "", pos: "", src: "" }) }
  }
  function closeBubble() { if (bub) { bub.remove(); bub = null } lastWord = ""; clearTimeout(timer) }
  async function showBubble(hit) {
    closeBubble(); lastWord = hit.word.toLowerCase();
    bub = document.createElement("div"); bub.className = "er-bub"; bub.setAttribute("role", "tooltip");
    bub.innerHTML = `<h3>${esc(hit.word)}</h3><p style="color:#9ca3af">Looking it up…</p>`; document.body.appendChild(bub);
    const place = () => { if (!bub) return; const w = bub.offsetWidth, h = bub.offsetHeight, x = Math.max(12, Math.min(innerWidth - w - 12, hit.rect.left + hit.rect.width / 2 - w / 2)), above = hit.rect.top - h - 10; bub.style.left = x + "px"; bub.style.top = (above > 8 ? above : hit.rect.bottom + 10) + "px" };
    place();
    const me = bub, info = await lookup(hit.word); if (bub !== me) return;
    const saved = bank.some(w => w.word === info.word);
    bub.innerHTML = `<h3>${esc(info.word)}${info.pos ? `<small>${esc(info.pos)}</small>` : ""}</h3>${info.def ? `<p>${esc(info.def)}</p><div class="src">${esc(info.src)}</div>
      <div class="acts"><button type="button" id="erSave"${saved ? " disabled" : ""}>${saved ? "✓ In your word bank" : "＋ Save to word bank"}</button><button type="button" class="sec" id="erClose">Close</button></div>` : `<p style="color:#6b7280">No definition found for this word.</p>`}`;
    place();
    if ($("erSave")) $("erSave").onclick = () => { if (!bank.some(w => w.word === info.word)) { bank.unshift({ word: info.word, def: info.def, at: Date.now() }); saveBank() } $("erSave").disabled = true; $("erSave").textContent = "✓ In your word bank"; if (panel) paintPanel() };
    if ($("erClose")) $("erClose").onclick = closeBubble;
  }
  const hoverable = matchMedia("(hover:hover) and (pointer:fine)").matches;
  if (hoverable) {
    document.addEventListener("mousemove", e => {
      if (bub && bub.contains(e.target)) return;
      if (!e.target.closest || !e.target.closest(".rd-prose") || getSelection().toString()) { clearTimeout(timer); return }
      const hit = wordAt(e.clientX, e.clientY); clearTimeout(timer);
      if (!hit || hit.word.toLowerCase() === lastWord) return;
      timer = setTimeout(() => { const again = wordAt(e.clientX, e.clientY); if (again && again.word === hit.word) showBubble(again) }, 800);   // the app's 0.8 s rest before the bubble
    }, { passive: true });
    document.addEventListener("mousedown", e => { if (bub && !bub.contains(e.target)) closeBubble() });
  } else if (!document.querySelector('script[src*="lookup.js"]')) {   // touch: tap a word (pages with the double-tap dictionary keep that instead)
    let t0 = 0, x0 = 0, y0 = 0;
    document.addEventListener("touchstart", e => { const t = e.touches[0]; t0 = Date.now(); x0 = t.clientX; y0 = t.clientY }, { passive: true });
    document.addEventListener("touchend", e => {
      const t = e.changedTouches[0]; if (bub && bub.contains(e.target)) return;
      if (Date.now() - t0 > 350 || Math.hypot(t.clientX - x0, t.clientY - y0) > 8 || !e.target.closest || !e.target.closest(".rd-prose") || e.target.closest("a,button")) { if (bub) closeBubble(); return }
      const hit = wordAt(t.clientX, t.clientY); if (hit) showBubble(hit); else closeBubble();
    }, { passive: true });
  }
  addEventListener("scroll", () => { if (bub) closeBubble() }, { passive: true });

  // the read page repaints its #view as you move through a chapter: keep in step with it
  const start = () => { const v = $("view") || document.body; new MutationObserver(sync).observe(v, { childList: true, subtree: false }); addEventListener("hashchange", () => setTimeout(sync, 0)); sync() };
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", start); else start();
  window.ErgoRead = { open: openPanel, close: closePanel, settings: () => Object.assign({}, S), wordBank: () => bank.slice() };
})();

// ErgoRead · the reader from the Eureka app (EurekaDemo1: ErgoReadPanel, InteractiveText, WordInfoBubble, WordBankPanel,
// useFlowProgress), rebuilt for these static Read & Learn pages. Loaded on every class's read/ page.
//
//   Reading settings   opened from the Aa button in the reading toolbar (beside Restart and Notes): page (paper / white /
//                      sepia / night), text size and typeface up front; contrast, line height, width, paragraph gap,
//                      indent, heading scale and alignment under "More options". The defaults are the recommended
//                      settings, chosen from reading research (see DEF). Saved as "ergoread-settings" (the app's key).
//   Word bubble        rest the pointer on a word for 0.8 s (or tap it, where there is no double-tap dictionary) to see what
//                      it means: the class's own dictionary first, then a general dictionary.
//   Word bank          the bubble saves into the Word Bank (shared/wordbank.js), which the Words button in the reading
//                      toolbar opens.
//   Reading progress   a thin bar across the top that fills as you read down the chapter.
//
// It styles the passages (.rd-sec, .rd-prose) through CSS variables; nothing else on the page changes.
(() => {
  if (window.ErgoRead) return;
  const KEY = "ergoread-settings";
  // The defaults are the recommended settings, chosen from reading research rather than taste:
  //   line length   about 66 characters. Studies of on-screen reading put the comfortable range near 50 to 75 a line.
  //   text size     19px. Larger body text (around 18px and up) reads faster on screens than the old 12 to 14px norm.
  //   line height   1.6, above the 1.5 minimum in the accessibility guidelines (WCAG 1.4.12).
  //   page          dark text on a light, slightly warm page. Dark-on-light is read faster and more accurately than
  //                 light-on-dark, and off-white glares less than pure white.
  //   alignment     left, so the gaps between words stay even (justified text on the web opens uneven gaps).
  //   paragraphs    set apart by space, no indent.
  //   typeface      serif by default, but research finds no general winner between serif and sans: the best face
  //                 differs from reader to reader, which is why the choice is one tap away.
  const DEF = { theme: "paper", contrast: 100, fontSize: 19, lineHeight: 1.6, width: 570, paraGap: 1, indent: 0, headingScale: 1.25, fontFamily: "serif", align: "left" };
  const FONTS = { serif: 'ui-serif, "New York", "Iowan Old Style", Georgia, "Times New Roman", serif', helvetica: '"Helvetica Neue", Helvetica, Arial, sans-serif', system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', georgia: 'Georgia, "Times New Roman", serif', inter: 'Inter, system-ui, sans-serif' };
  const THEMES = { paper: { bg: "#fbf8f1", ink: "#2b2b2e", page: "#f4efe4" }, light: { bg: "#ffffff", ink: "#1a1a1a", page: "" }, sepia: { bg: "#f5f0e6", ink: "#433422", page: "#ece5d6" }, dark: { bg: "#1a1a1a", ink: "#e5e5e5", page: "#0f0f10" } };
  const $ = id => document.getElementById(id), esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let S = Object.assign({}, DEF); try { S = Object.assign(S, JSON.parse(localStorage.getItem(KEY) || "{}")) } catch (e) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) { } };
  const WB = () => window.WordBank, bankCount = () => WB() ? WB().count() : 0;   // the word bank itself lives in shared/wordbank.js

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
.er-bar{position:fixed;top:0;left:0;height:3px;width:0;z-index:60;background:#0071e3;transition:width .12s linear;border-radius:0 3px 3px 0}
.er-panel{position:fixed;left:max(16px,env(safe-area-inset-left,0px));bottom:68px;z-index:70;width:min(320px,calc(100vw - 32px));max-height:min(78vh,640px);overflow:auto;background:#fff;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:18px;box-shadow:0 20px 50px rgba(0,0,0,.18);font:13px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:erUp .18s ease}
@keyframes erUp{from{opacity:0;transform:translateY(8px)}}
.er-head{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fff;z-index:1}
.er-head .ic{width:32px;height:32px;border-radius:8px;background:#e8f1fc;color:#0071e3;display:grid;place-items:center;font:700 15px Georgia,serif}
.er-head h2{margin:0;font-size:15px;font-weight:700} .er-head p{margin:0;font-size:11px;color:#6b7280}
.er-head .x{margin-left:auto;border:0;background:none;color:#9ca3af;font-size:16px;cursor:pointer;border-radius:6px;padding:4px 7px} .er-head .x:hover{background:#f3f4f6}
.er-body{padding:14px 16px;display:flex;flex-direction:column;gap:14px}
.er-lab{display:flex;justify-content:space-between;font-size:12px;font-weight:600;color:#374151;margin-bottom:6px} .er-lab span{font-weight:500;color:#6b7280;font-variant-numeric:tabular-nums}
.er-row{display:flex;gap:6px} .er-row button{flex:1;border:1px solid #e5e7eb;background:#fff;border-radius:8px;padding:8px 4px;font:500 12px inherit;font-family:inherit;cursor:pointer;color:#374151}
.er-row button[aria-pressed="true"]{border:2px solid #0071e3;padding:7px 3px;background:#e8f1fc;color:#0071e3}
.er-panel input[type=range]{width:100%;accent-color:#0071e3;margin:0}
.er-foot{display:flex;gap:8px} .er-foot button{flex:1;border:1px solid #e5e7eb;background:#fff;border-radius:8px;padding:9px;font:500 12.5px inherit;font-family:inherit;color:#6b7280;cursor:pointer} .er-foot button:hover{background:#f9fafb;border-color:#d1d5db}
.er-foot .pri{color:#0071e3;border-color:#b9d7fb;background:#e8f1fc}
.er-note{background:#f9fafb;border-radius:8px;padding:9px 11px;font-size:11.5px;color:#6b7280}
.er-bub{position:fixed;z-index:80;width:min(300px,calc(100vw - 24px));background:#fff;color:#1a1a1a;border:1px solid #e5e7eb;border-radius:14px;box-shadow:0 12px 32px rgba(0,0,0,.18);padding:12px 14px;font:13.5px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;animation:erUp .15s ease}
.er-bub h3{margin:0;font-size:16px;font-weight:700;display:flex;align-items:baseline;gap:8px} .er-bub h3 small{font-weight:500;font-size:11.5px;color:#6b7280;font-style:italic}
.er-bub p{margin:6px 0 0} .er-bub .src{font-size:11px;color:#9ca3af;margin-top:6px}
.er-bub .acts{display:flex;gap:8px;margin-top:10px} .er-bub .acts button{border:0;border-radius:8px;padding:7px 11px;font:600 12.5px inherit;font-family:inherit;cursor:pointer;background:#0071e3;color:#fff} .er-bub .acts button.sec{background:#f3f4f6;color:#374151}
.er-bub .acts button:disabled{background:#d1fae5;color:#047857;cursor:default}
.er-word{border-bottom:2px solid #0071e3;border-radius:2px}
.er-bank{display:flex;flex-direction:column;gap:8px} .er-bank div{border:1px solid #e5e7eb;border-radius:10px;padding:9px 11px;position:relative}
.er-bank b{font-size:14px} .er-bank p{margin:3px 0 0;color:#4b5563;font-size:12.5px} .er-bank button{position:absolute;top:6px;right:6px;border:0;background:none;color:#9ca3af;cursor:pointer;font-size:13px}
/* figures that line up with capitals, no ragged last lines, sub and superscripts that don't push lines apart */
.rd-sec .rd-prose{font-variant-numeric:lining-nums;font-kerning:normal;text-wrap:pretty;hyphens:manual}
.rd-sec .rd-prose sub,.rd-sec .rd-prose sup{line-height:0;font-size:.72em}
.rd-sec .rd-prose li{line-height:inherit}
/* the Aa button lives in the reading toolbar, beside Restart and Notes */
.rd-tool.er-aa b{background:none;color:inherit;padding:0;font:700 14px/1 ui-serif,"New York",Georgia,serif}
.rd-tool.er-aa[aria-expanded="true"]{background:var(--accent,#0071e3);color:#fff}
.rd-tool.er-words i{font:italic 700 13px/1 ui-serif,Georgia,serif}
/* the panel drops from that button and uses the page's own colors, so it follows light and dark */
.er-panel{--p:var(--paper,#fff);--i:var(--ink,#1d1d1f);--m:var(--muted,#6e6e73);--l:var(--line,#d2d2d7);--s:var(--fill,var(--sunk,#f5f5f7));--a:var(--accent,#0071e3);
  left:auto;bottom:auto;background:var(--p);color:var(--i);border:0;border-radius:20px;box-shadow:0 18px 60px rgba(0,0,0,.24),0 0 0 .5px rgba(0,0,0,.14);font:13px/1.4 var(--body,-apple-system,BlinkMacSystemFont,sans-serif);letter-spacing:-.01em}
.er-head{background:var(--p);border-bottom-color:var(--l)}.er-head .ic{background:color-mix(in srgb,var(--a) 12%,transparent);color:var(--a)}.er-head p{color:var(--m)}.er-head .x{color:var(--m)}.er-head .x:hover{background:var(--s)}
.er-lab{color:var(--i)}.er-lab span{color:var(--m)}
.er-row button{border-color:var(--l);background:var(--p);color:var(--i);border-radius:10px}
.er-row button[aria-pressed="true"]{border-color:var(--a);background:color-mix(in srgb,var(--a) 10%,var(--p));color:var(--a)}
.er-sw button{display:flex;flex-direction:column;align-items:center;gap:6px;border:0!important;background:none!important;padding:0!important;color:var(--m)!important;font-size:11.5px}
.er-sw button i{width:38px;height:38px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(128,128,128,.35);display:grid;place-items:center;font:700 14px/1 ui-serif,Georgia,serif;font-style:normal}
.er-sw button[aria-pressed="true"]{color:var(--a)!important;font-weight:600}.er-sw button[aria-pressed="true"] i{box-shadow:0 0 0 2px var(--p),0 0 0 4px var(--a)}
.er-size{display:flex;align-items:center;background:var(--s);border-radius:12px;overflow:hidden}
.er-size button{flex:1;border:0;background:none;color:var(--i);cursor:pointer;padding:9px 0;font:600 14px/1 ui-serif,Georgia,serif}.er-size button:last-child{font-size:20px}
.er-size button:hover{background:color-mix(in srgb,var(--i) 8%,transparent)}.er-size span{flex:none;width:64px;text-align:center;font-size:12px;color:var(--m);font-variant-numeric:tabular-nums;border-left:1px solid var(--l);border-right:1px solid var(--l)}
.er-more{border-top:1px solid var(--l);padding-top:12px}.er-more>summary{cursor:pointer;font-weight:600;font-size:12.5px;color:var(--a);list-style:none}.er-more>summary::-webkit-details-marker{display:none}
.er-more>summary::after{content:" ›"}.er-more[open]>summary::after{content:" ⌄"}
.er-more>div{display:flex;flex-direction:column;gap:14px;margin-top:14px}
.er-panel input[type=range]{accent-color:var(--a)}
.er-foot button{border-color:var(--l);background:var(--p);color:var(--i);border-radius:10px}.er-foot button:hover{background:var(--s);border-color:var(--l)}
.er-foot .pri{color:var(--a);border-color:color-mix(in srgb,var(--a) 35%,var(--l));background:color-mix(in srgb,var(--a) 10%,var(--p))}
.er-note{background:var(--s);color:var(--m);border-radius:10px}
.er-bank div{border-color:var(--l)}.er-bank p{color:var(--m)}
.er-bub{background:var(--paper,#fff);color:var(--ink,#1a1a1a);border-color:var(--line,#e5e7eb)}.er-bub h3 small,.er-bub .src{color:var(--muted,#6b7280)}
.er-bub .acts button.sec{background:var(--fill,#f3f4f6);color:var(--ink,#374151)}
.er-panel.er-sheet{left:8px;right:8px;top:auto;bottom:max(8px,env(safe-area-inset-bottom,0px));width:auto;max-width:560px;margin:0 auto;max-height:min(44vh,360px)}
.er-panel.er-sheet .er-note{display:none}
body:has(.er-panel) .lk-tip{display:none}   /* the first-visit tip steps aside while the panel is open */
.er-panel.er-sheet .er-head{padding:10px 14px}.er-panel.er-sheet .er-body{padding:12px 14px;gap:12px}
@media (prefers-reduced-motion:reduce){.er-panel,.er-bub{animation:none}.er-bar{transition:none}}
`; document.head.appendChild(st);

  // ---------- apply settings
  function apply() {
    const r = document.documentElement.style, T = THEMES[S.theme] || THEMES.light, on = !!document.querySelector(".rd-sec");
    const rootEl = document.documentElement, siteDark = rootEl.dataset.theme === "dark" || (!rootEl.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
    const themed = S.theme !== "light" && !(S.theme === "paper" && siteDark);   // paper gives way to the site's dark theme
    r.setProperty("--er-font", FONTS[S.fontFamily] || FONTS.system); r.setProperty("--er-size", S.fontSize + "px"); r.setProperty("--er-lh", S.lineHeight);
    r.setProperty("--er-align", S.align); r.setProperty("--er-gap", S.paraGap + "em"); r.setProperty("--er-indent", S.indent + "em"); r.setProperty("--er-hs", S.headingScale);
    r.setProperty("--er-width", S.width + "px");
    if (themed) { r.setProperty("--er-bg", T.bg); r.setProperty("--er-ink", T.ink) } else { r.removeProperty("--er-bg"); r.removeProperty("--er-ink") }
    // text contrast: mix the ink toward the page behind it
    r.setProperty("--er-text", S.contrast >= 100 ? (themed ? T.ink : "var(--ink)") : `color-mix(in srgb, ${themed ? T.ink : "var(--ink)"} ${S.contrast}%, ${themed ? T.bg : "var(--paper)"})`);
    document.body.classList.toggle("er-reading", on); document.body.classList.toggle("er-sepia", on && S.theme === "sepia"); document.body.classList.toggle("er-dark", on && S.theme === "dark"); document.body.classList.toggle("er-paper", on && themed && S.theme === "paper");
  }

  // ---------- the panel
  const SLIDERS = [["contrast", "Text Contrast", 50, 100, 5, v => v + "%"], ["fontSize", "Font Size", 12, 28, 1, v => v + "px"], ["lineHeight", "Line Height", 1, 2.5, .05, v => (+v).toFixed(2)],
    ["width", "Content Width", 400, 1000, 20, v => v + "px"], ["paraGap", "Paragraph Gap", .5, 4, .1, v => (+v).toFixed(1) + "em"], ["indent", "First-Line Indent", 0, 4, .25, v => (+v).toFixed(2) + "em"], ["headingScale", "Heading Scale", 1, 2.5, .05, v => (+v).toFixed(2) + "×"]];
  let panel = null, view = "settings", moreOpen = false;
  const isDef = () => Object.keys(DEF).every(k => S[k] === DEF[k]);
  function paintPanel() {
    if (!panel) return;
    const btns = (key, opts) => `<div class="er-row">${opts.map(([v, l, sty]) => `<button type="button" data-set="${key}" data-v="${v}" aria-pressed="${S[key] === v}" style="${sty || ""}">${l}</button>`).join("")}</div>`;
    panel.innerHTML = `<div class="er-head"><span class="ic" aria-hidden="true">Aa</span><div><h2>ErgoRead</h2><p>Reading settings</p></div><button type="button" class="x" aria-label="Close">✕</button></div>
      <div class="er-body">${view === "bank" ? ""
        : `<div><div class="er-lab">Page</div><div class="er-row er-sw">${[["paper", "Paper", "#fbf8f1", "#2b2b2e"], ["light", "White", "#fff", "#1a1a1a"], ["sepia", "Sepia", "#f5f0e6", "#433422"], ["dark", "Night", "#1a1a1a", "#e5e5e5"]].map(([v, l, bg, ink]) => `<button type="button" data-set="theme" data-v="${v}" aria-pressed="${S.theme === v}"><i style="background:${bg};color:${ink}">Aa</i>${l}</button>`).join("")}</div></div>
          <div><div class="er-lab">Text size</div><div class="er-size"><button type="button" data-size="-1" aria-label="Smaller text">A</button><span id="erv-fontSize">${S.fontSize}px</span><button type="button" data-size="1" aria-label="Larger text">A</button></div></div>
          <div><div class="er-lab">Typeface</div>${btns("fontFamily", [["serif", "Serif"], ["system", "Sans"], ["georgia", "Georgia"], ["helvetica", "Helvetica"]])}</div>
          <details class="er-more"${moreOpen ? " open" : ""}><summary>More options</summary><div>
            ${SLIDERS.filter(s => s[0] !== "fontSize").map(([k, label, min, max, step, fmt]) => `<div><div class="er-lab">${label}<span id="erv-${k}">${fmt(S[k])}</span></div><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}" value="${S[k]}" aria-label="${label}"></div>`).join("")}
            <div><div class="er-lab">Text align</div>${btns("align", [["left", "Left"], ["justify", "Justify"]])}</div></div></details>
          <div class="er-foot"><button type="button" class="pri" id="erBank">Word bank · ${bankCount()}</button><button type="button" id="erReset"${isDef() ? " disabled" : ""}>${isDef() ? "✓ Recommended" : "Use recommended"}</button></div>
          <div class="er-note"><b>Recommended</b> follows reading research: dark text on a warm, light page, larger type, about 66 characters a line, open line spacing and left-aligned text. No typeface is best for everyone, so pick the one you read most easily.</div>`}</div>`;
    const md = panel.querySelector(".er-more"); if (md) md.addEventListener("toggle", () => { moreOpen = md.open });
    panel.querySelectorAll("[data-size]").forEach(b => b.onclick = () => { S.fontSize = Math.max(12, Math.min(28, S.fontSize + +b.dataset.size)); save(); apply(); paintPanel() });
    panel.querySelector(".x").onclick = closePanel;
    panel.querySelectorAll("[data-set]").forEach(b => b.onclick = () => { S[b.dataset.set] = b.dataset.v; save(); apply(); paintPanel() });
    panel.querySelectorAll("input[type=range]").forEach(i => i.oninput = () => { const k = i.dataset.k; S[k] = +i.value; const f = SLIDERS.find(x => x[0] === k)[5]; $("erv-" + k).textContent = f(S[k]); save(); apply() });
    if ($("erBank")) $("erBank").onclick = () => { closePanel(); if (WB()) WB().open() };
    if ($("erReset")) $("erReset").onclick = () => { S = Object.assign({}, DEF); save(); apply(); paintPanel() };
  }
  function openPanel(v) { view = v || "settings"; if (!panel) { panel = document.createElement("div"); panel.className = "er-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "ErgoRead reading settings"); document.body.appendChild(panel) } paintPanel(); place(); markBtn() }
  // The panel must not sit on the text you are adjusting. Where there is room it stands in the margin beside the
  // reading column; otherwise it is a short sheet along the bottom edge, leaving the passage above it in view.
  function place() {
    const b = document.querySelector(".er-aa"), col = document.querySelector(".rd-sec") || document.querySelector(".wrap"); if (!panel || !b) return;
    const w = Math.min(320, innerWidth - 16), c = col ? col.getBoundingClientRect() : { left: 0, right: innerWidth }, s = panel.style, r = b.getBoundingClientRect();
    const right = innerWidth - c.right - 32 >= w, left = c.left - 32 >= w, side = right || left;
    panel.classList.toggle("er-sheet", !side); s.width = side ? w + "px" : "";
    if (side) { const top = Math.max(12, Math.min(r.top, innerHeight - 240)); s.left = (right ? c.right + 16 : c.left - w - 16) + "px"; s.top = top + "px"; s.maxHeight = "calc(100vh - " + (top + 16) + "px)" }
    else { s.left = s.top = s.maxHeight = "" }
  }
  function markBtn() { const b = document.querySelector(".er-aa"); if (b) b.setAttribute("aria-expanded", !!panel) }
  addEventListener("resize", place); addEventListener("scroll", place, { passive: true });
  document.addEventListener("pointerdown", e => { if (panel && !panel.contains(e.target) && !e.target.closest(".er-aa")) closePanel() });
  function closePanel() { if (panel) { panel.remove(); panel = null } markBtn() }
  addEventListener("keydown", e => { if (e.key === "Escape") { closePanel(); closeBubble() } });

  // ---------- reading progress + the ErgoRead button (only while a chapter is open)
  const bar = document.createElement("div"); bar.className = "er-bar"; bar.setAttribute("aria-hidden", "true");
  // the Aa button is added to the reading toolbar (.rd-sticky) each time a chapter is drawn
  function addButton() {
    const bar2 = document.querySelector(".rd-sticky"); if (!bar2 || bar2.querySelector(".er-aa")) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "rd-tool er-aa"; b.title = "ErgoRead: page, text size and typeface"; b.setAttribute("aria-label", "ErgoRead reading settings"); b.setAttribute("aria-haspopup", "dialog"); b.setAttribute("aria-expanded", "false");
    b.innerHTML = `<b aria-hidden="true">Aa</b>`; b.onclick = () => panel ? closePanel() : openPanel();
    bar2.insertBefore(b, bar2.querySelector(".rd-tool"));
    const w = document.createElement("button"); w.type = "button"; w.className = "rd-tool er-words"; w.title = "Your word bank: the words you saved, and practice"; w.innerHTML = `<i aria-hidden="true">Az</i><span>Words</span><b></b>`;
    w.onclick = () => { closePanel(); if (WB()) WB().open() }; bar2.appendChild(w); wordsBadge();
  }
  function wordsBadge() { const b = document.querySelector(".er-words b"); if (b) b.textContent = bankCount() || "" }
  (function hook() { if (!WB()) return setTimeout(hook, 300); WB().on(() => { wordsBadge(); if (panel) paintPanel() }); wordsBadge() })();
  function progress() { const h = document.documentElement.scrollHeight - innerHeight; bar.style.width = (document.querySelector(".rd-sec") && h > 0 ? Math.min(100, Math.max(0, scrollY / h * 100)) : 0) + "%" }
  function sync() {
    const on = !!document.querySelector(".rd-sec");
    if (on && !bar.isConnected) document.body.appendChild(bar);
    if (!on && bar.isConnected) { bar.remove(); closePanel(); closeBubble() }
    if (on) addButton();
    apply(); progress(); markBtn();
  }
  new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });   // paper follows the site theme
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
    if (WB()) { const d = await WB().define(word); return (cache[k] = d || { word, def: "", pos: "", src: "" }) }   // class dictionary, class glossary, then a general dictionary
    if (window.BioLookup) { try { const r = await window.BioLookup.find(word); if (r && r.def) return (cache[k] = { word: r.term, def: r.def, pos: "", src: "Class dictionary", parts: (r.parts || []).map(p => ({ root: p.root, mean: p.mean })) }) } catch (e) { } }
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
    const saved = WB() && WB().has(info.word), can = !!WB();
    bub.innerHTML = `<h3>${esc(info.word)}${info.pos ? `<small>${esc(info.pos)}</small>` : ""}</h3>${info.def ? `<p>${esc(info.def)}</p><div class="src">${esc(info.src)}</div>` : `<p style="color:var(--muted,#6b7280)">No definition found. You can still save it and write the meaning yourself.</p>`}
      <div class="acts">${can ? `<button type="button" id="erSave"${saved ? " disabled" : ""}>${saved ? "✓ In your word bank" : info.def ? "＋ Save to word bank" : "＋ Save it anyway"}</button>` : ""}<button type="button" class="sec" id="erClose">Close</button></div>`;
    place();
    if ($("erSave")) $("erSave").onclick = () => { WB().saveFrom({ word: info.word, def: info.def, pos: info.pos, src: info.src, parts: info.parts || [], context: WB().sentence(hit.el, hit.word) }); $("erSave").disabled = true; $("erSave").textContent = "✓ In your word bank" };
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
  window.ErgoRead = { open: openPanel, close: closePanel, settings: () => Object.assign({}, S), wordBank: () => WB() ? WB().all() : [] };
})();

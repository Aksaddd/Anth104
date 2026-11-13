// Double-tap (or double-click) any word to see what it means and how it breaks into roots.
// Sources, in order: the course dictionary (assets/lexicon.js), the Word Roots list (roots/roots.js: example terms
// and their roots), and the drill glossary (assets/glossary.js). Unknown words still get a root breakdown when they
// contain known roots. Works with touch, mouse and pen. The data files are loaded on the first lookup.
(() => {
  const BASE = (window.COURSE && window.COURSE.base) || (document.currentScript && document.currentScript.src || "").replace(/shared\/lookup\.js.*$/, "");   // the course's own folder (for its Word Roots page)
  const TIP_KEY = "a104-lookup-tip";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let ready = null, IDX = null;

  const load = src => new Promise(res => { const s = document.createElement("script"); s.src = BASE + src; s.onload = s.onerror = res; document.head.appendChild(s) });
  function data() {
    if (!ready) ready = Promise.all([window.LEXICON ? 0 : load("assets/lexicon.js"), window.ROOTS ? 0 : load("roots/roots.js"), window.GLOSS ? 0 : load("assets/glossary.js")]).then(build);
    return ready;
  }
  const norm = s => String(s).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9+\- ]/g, " ").replace(/\s+/g, " ").trim();
  function build() {
    const lex = new Map(), roots = new Map(), stems = [], ex = new Map();
    for (const [k, v] of Object.entries(window.LEXICON || {})) {
      const e = { term: k, def: v[0], parts: v[1] || [], lit: v[2] || "" };
      lex.set(norm(k), e); (v[3] || "").split(",").map(norm).filter(Boolean).forEach(f => { if (!lex.has(f)) lex.set(f, e) });
    }
    for (const u of Object.values(window.ROOTS || {})) for (const g of u.groups || []) for (const [root, mean, origin, terms] of g[1]) {
      const r = { root, mean, origin }; roots.set(root.toLowerCase(), r);
      const st = root.toLowerCase().replace(/^-|-$/g, ""); if (st.length >= 3) stems.push({ st, r, suf: root.startsWith("-"), pre: root.endsWith("-") });
      for (const [t, m] of terms || []) {
        const mm = t.toLowerCase().match(/^([^(]+?)\s*(?:\(([^)]+)\))?$/) || [t];
        for (const n of [mm[1], mm[2]].filter(Boolean)) { const k = norm(n); if (!ex.has(k)) ex.set(k, { term: n.trim(), def: m, roots: [] }); ex.get(k).roots.push(r) }
      }
    }
    stems.sort((a, b) => b.st.length - a.st.length);
    IDX = { lex, roots, stems, ex };
  }
  // simple singular forms: sporangia → sporangium, hyphae → hypha, sori → sorus, stomata → stoma, bodies → body
  function forms(w) {
    const f = [w];
    if (/ia$/.test(w)) f.push(w.replace(/ia$/, "ium"));
    if (/ae$/.test(w)) f.push(w.slice(0, -1));
    if (/i$/.test(w)) f.push(w.replace(/i$/, "us"));
    if (/ata$/.test(w)) f.push(w.slice(0, -2));
    if (/ies$/.test(w)) f.push(w.replace(/ies$/, "y"));
    if (/(s|x|ch|sh)es$/.test(w)) f.push(w.slice(0, -2));
    if (/s$/.test(w) && !/ss$/.test(w)) f.push(w.slice(0, -1));
    if (/ed$/.test(w)) f.push(w.slice(0, -1), w.slice(0, -2));
    return f;
  }
  // the roots hiding inside a word, left to right (longest roots first, no overlaps)
  function autoRoots(w) {
    const found = [], used = new Array(w.length).fill(false);
    for (const s of IDX.stems) {
      let i = s.suf ? w.lastIndexOf(s.st) : w.indexOf(s.st);
      if (i < 0) continue;
      if (s.suf && i + s.st.length < w.length - 2) continue;   // a suffix root has to sit at the end (allow -s / -es)
      let clash = false; for (let k = i; k < i + s.st.length; k++) if (used[k]) clash = true;
      if (clash) continue;
      for (let k = i; k < i + s.st.length; k++) used[k] = true;
      found.push({ i, end: i + s.st.length, r: s.r });
    }
    const cover = used.filter(Boolean).length;
    return cover >= Math.min(5, w.length * .5) ? found.sort((a, b) => a.i - b.i).map(x => x.r) : [];
  }
  function partsFrom(list) {   // [[part, meaning]] → add each root's origin from the Word Roots list
    return list.map(([p, m]) => { const r = IDX.roots.get(p.toLowerCase()); return { root: p, mean: m, origin: r ? r.origin : "" } });
  }
  function find(text) {
    const w = norm(text); if (!w || w.length < 2) return null;
    for (const f of forms(w)) { const e = IDX.lex.get(f); if (e) return { term: e.term, def: e.def, parts: partsFrom(e.parts), lit: e.lit } }
    for (const f of forms(w)) {
      const e = IDX.ex.get(f);
      if (e) { const g = window.GLOSS && window.GLOSS.look(f); return { term: e.term, def: g || capital(e.def) + ".", parts: e.roots.map(r => ({ root: r.root, mean: r.mean, origin: r.origin })), lit: g ? e.def : "" } }
    }
    const g = window.GLOSS && w.length > 3 ? window.GLOSS.look(w) : null;
    const ar = w.includes(" ") ? [] : autoRoots(w);
    if (g || ar.length) return { term: text.trim(), def: g || "", parts: ar.map(r => ({ root: r.root, mean: r.mean, origin: r.origin })), lit: "" };
    return null;
  }
  const capital = s => s.charAt(0).toUpperCase() + s.slice(1);

  // ----- which word is under the finger
  const WORD = /[A-Za-z0-9À-ɏ+\-’']/;
  function wordAt(x, y) {
    let node, off;
    if (document.caretPositionFromPoint) { const p = document.caretPositionFromPoint(x, y); if (!p) return null; node = p.offsetNode; off = p.offset }
    else if (document.caretRangeFromPoint) { const r = document.caretRangeFromPoint(x, y); if (!r) return null; node = r.startContainer; off = r.startOffset }
    if (!node || node.nodeType !== 3) ({ node, off } = scanAt(x, y) || {});   // e.g. text inside a <button>
    if (!node || node.nodeType !== 3) return null;
    const t = node.textContent; let a = off, b = off;
    if (a > 0 && !WORD.test(t[a] || " ") && WORD.test(t[a - 1])) { a--; b-- }
    while (a > 0 && WORD.test(t[a - 1])) a--;
    while (b < t.length && WORD.test(t[b])) b++;
    const word = t.slice(a, b).replace(/^[-’']+|[-’']+$/g, ""); if (!/[A-Za-z]/.test(word)) return null;
    const range = document.createRange(); range.setStart(node, a); range.setEnd(node, b);
    const rc = range.getBoundingClientRect(); if (x < rc.left - 6 || x > rc.right + 6 || y < rc.top - 6 || y > rc.bottom + 6) return null;   // not actually on the word
    // up to two words either side, for terms like "abscisic acid" or "systemic acquired resistance"
    const words = [], re = /[A-Za-z0-9À-ɏ+\-’']+/g; let m, at = -1;
    while ((m = re.exec(t))) { if (m.index <= a && a < m.index + m[0].length) at = words.length; words.push(m[0]) }
    return { word, range, words, at, el: node.parentElement };
  }
  // fallback: measure each word in the element under the point
  function scanAt(x, y) {
    const el = document.elementFromPoint(x, y); if (!el) return null;
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) {
      const re = /[A-Za-z0-9\u00C0-\u024F+\-’']+/g; let m;
      while ((m = re.exec(n.textContent))) {
        const r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
        for (const q of r.getClientRects()) if (x >= q.left - 2 && x <= q.right + 2 && y >= q.top - 2 && y <= q.bottom + 2) return { node: n, off: m.index };
      }
    }
    return null;
  }
  // an underlined key term in the reading (<b>) is looked up whole: "language ideologies", "double-voiced discourse" …
  function phraseVariants(t) {
    const base = t.replace(/[.:;,!?]+$/, "").trim(), noPar = base.replace(/\s*\([^)]*\)/g, "").trim(), par = (base.match(/\(([^)]+)\)/) || [])[1];
    return [...new Set([base, noPar, par].filter(Boolean))];
  }
  function lookup(hit) {
    const term = hit.el && hit.el.closest("b");
    if (term && term.closest(".rd-prose, .q, .explain, .rd-lead")) for (const v of phraseVariants(term.textContent)) { const r = find(v); if (r && r.def) return r }
    const { words, at } = hit;
    if (at >= 0) for (const n of [3, 2]) for (let s = Math.max(0, at - n + 1); s <= at && s + n <= words.length; s++) {
      const r = find(words.slice(s, s + n).join(" ")); if (r && IDX.lex.has(norm(r.term))) return r;
    }
    return find(hit.word);
  }

  // ----- the card
  let card = null, hl = null;
  function close() { if (card) { card.remove(); card = null } if (hl) { hl.remove(); hl = null } }
  function show(hit, r) {
    close();
    const rc = hit.range.getBoundingClientRect();
    hl = document.createElement("div"); hl.className = "lk-hl";
    hl.style.cssText = `left:${rc.left - 3}px;top:${rc.top - 2}px;width:${rc.width + 6}px;height:${rc.height + 4}px`; document.body.appendChild(hl);
    card = document.createElement("div"); card.className = "lk-card"; card.setAttribute("role", "dialog"); card.setAttribute("aria-label", "Definition of " + (r ? r.term : hit.word));
    card.innerHTML = r ? `<div class="lk-top"><b class="lk-term">${esc(r.term)}</b><button type="button" class="lk-x" aria-label="Close">✕</button></div>
      ${r.def ? `<p class="lk-def">${esc(r.def)}</p>` : `<p class="lk-def lk-muted">No definition yet, but here are its roots:</p>`}
      ${r.parts.length ? `<div class="lk-cap">Word parts</div><div class="lk-parts">${r.parts.map((p, i) => `${i ? `<span class="lk-plus">+</span>` : ""}<span class="lk-part"><b>${esc(p.root)}</b><i>${esc(p.mean)}</i>${p.origin ? `<small>${esc(p.origin)}</small>` : ""}</span>`).join("")}</div>` : ""}
      ${r.lit ? `<p class="lk-lit">Literally: “${esc(r.lit)}”</p>` : ""}
      <div class="lk-foot">${window.WordBank ? `<button type="button" class="lk-save"${window.WordBank.has(r.term) ? " disabled" : ""}>${window.WordBank.has(r.term) ? "✓ In your word bank" : "＋ Save to word bank"}</button>` : ""}<a class="lk-more" href="${BASE}roots/index.html">All word roots →</a></div>`
      : `<div class="lk-top"><b class="lk-term">${esc(hit.word)}</b><button type="button" class="lk-x" aria-label="Close">✕</button></div><p class="lk-def lk-muted">This word isn't in the course dictionary. Double-tap a course term (like ${((window.COURSE && window.COURSE.terms) || ["heteroglossia", "indexicality"]).map(x => `<i>${x}</i>`).join(" or ")}) to see its meaning and roots.</p>${window.WordBank ? `<div class="lk-foot"><button type="button" class="lk-save"${window.WordBank.has(hit.word) ? " disabled" : ""}>${window.WordBank.has(hit.word) ? "✓ In your word bank" : "＋ Save it anyway"}</button></div>` : ""}`;
    document.body.appendChild(card);
    const W = Math.min(360, innerWidth - 20), h = card.offsetHeight;
    let left = Math.min(Math.max(10, rc.left + rc.width / 2 - W / 2), innerWidth - W - 10);
    let top = rc.bottom + 10; if (top + h > innerHeight - 10) top = Math.max(10, rc.top - h - 10);
    card.style.left = left + "px"; card.style.top = top + "px"; card.style.width = W + "px";
    card.querySelector(".lk-x").onclick = close;
    // a key term the class dictionary doesn't have is saved whole ("Pounded Rice Ritual"), not one word of it
    const bold = hit.el && hit.el.closest(".rd-prose b, .rd-prose strong"), name = r ? r.term : bold ? bold.textContent.replace(/[.:;,!?]+$/, "").trim() : hit.word;
    let extra = null; const me = card, WBK = window.WordBank;
    // not in the class dictionary: try a general dictionary and show what it says
    if (WBK && !(r && r.def)) WBK.dictionary(name).then(d => { if (!d || card !== me) return; extra = d; const p = me.querySelector(".lk-def"); p.classList.remove("lk-muted"); p.innerHTML = esc(d.def) + ` <small class="lk-src">${d.pos ? esc(d.pos) + " · " : ""}${esc(d.src || "Dictionary")}</small>`; me.querySelector(".lk-term").textContent = name; const s = me.querySelector(".lk-save"); if (s && !s.disabled) s.textContent = "＋ Save to word bank" });
    const sv = card.querySelector(".lk-save");   // into the word bank, with the sentence it was found in
    if (sv) { if (WBK.has(name)) { sv.disabled = true; sv.textContent = "✓ In your word bank" }
      sv.onclick = () => { WBK.saveFrom({ word: name, def: r && r.def ? r.def : extra ? extra.def : "", pos: extra ? extra.pos : "", parts: r ? r.parts.map(p => ({ root: p.root, mean: p.mean })) : [], src: r && r.def ? "Class dictionary" : extra ? extra.src || "Dictionary" : "", context: WBK.sentence(hit.el, hit.word) }); sv.disabled = true; sv.textContent = "✓ In your word bank" } }
    if (navigator.vibrate) try { navigator.vibrate(12) } catch (e) { }
  }

  // ----- double-tap (or double-click) a word. Holding is left to the device, so press-and-hold or dragging selects text
  // for highlights and notes in the reading (read/notes.js).
  let last = null;
  addEventListener("pointerdown", e => { if (card && !card.contains(e.target)) close() }, true);
  addEventListener("pointerup", async e => {
    if (e.button || card && card.contains(e.target)) return;
    // links, enabled buttons and form fields keep their own taps (an answered option is disabled, so it can be looked up)
    if (e.target.closest("a,button:not(:disabled),input,textarea,select,label,.lk-card,.wb-veil,.wb-toast,#bbPal,#bbDock,.bb-shop,.bb-greet,.pl-pin,.pl-cell,.pl-chip,[contenteditable]")) { last = null; return }
    const now = Date.now(), x = e.clientX, y = e.clientY;
    if (!last || now - last.t > 380 || Math.hypot(x - last.x, y - last.y) > 28) { last = { t: now, x, y }; return }
    last = null;
    const hit = wordAt(x, y); if (!hit) return;
    try { getSelection().removeAllRanges() } catch (err) { }   // a double-click also selects the word; don't leave it selected
    await data(); show(hit, lookup(hit));
    try { getSelection().removeAllRanges() } catch (err) { }
    try { localStorage.setItem(TIP_KEY, "1") } catch (err) { }
  }, true);
  addEventListener("dblclick", e => { if (card) { e.preventDefault(); try { getSelection().removeAllRanges() } catch (err) { } } }, true);
  addEventListener("scroll", () => { if (card) close() }, { passive: true, capture: true });
  addEventListener("keydown", e => { if (e.key === "Escape" && card) close() });
  addEventListener("resize", close);

  const css = document.createElement("style");
  css.textContent = `.lk-card{position:fixed;z-index:300;background:var(--paper,#fff);color:var(--ink,#1d1d1f);border-radius:18px;padding:14px 16px 12px;box-shadow:0 12px 40px rgba(0,0,0,.22),0 0 0 1px rgba(0,0,0,.05);font:400 15px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif;animation:lkIn .18s ease}
.lk-top{display:flex;align-items:center;gap:8px}.lk-term{font:700 20px/1.2 -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;letter-spacing:-.01em;flex:1}
.lk-x{border:0;background:var(--fill,#e8e8ed);color:var(--muted,#6e6e73);width:28px;height:28px;border-radius:50%;cursor:pointer;font-size:13px}
.lk-def{margin:6px 0 10px}.lk-muted{color:var(--muted,#6e6e73)}
.lk-cap{font:600 11.5px -apple-system,sans-serif;letter-spacing:.05em;text-transform:uppercase;color:var(--muted,#6e6e73);margin-bottom:6px}
.lk-parts{display:flex;flex-wrap:wrap;align-items:stretch;gap:6px}
.lk-part{display:flex;flex-direction:column;background:var(--accent-soft,#e8f1fc);border-radius:12px;padding:6px 10px;min-width:70px}
.lk-part b{color:var(--accent,#0071e3);font-size:15.5px}.lk-part i{font-style:normal;font-size:13.5px}.lk-part small{font-size:11.5px;color:var(--muted,#6e6e73)}
.lk-plus{align-self:center;color:var(--muted,#6e6e73);font-weight:600}
.lk-lit{margin:10px 0 0;font-size:14px;color:var(--muted,#6e6e73)}
.lk-src{color:var(--muted,#6e6e73);font-size:12px;white-space:nowrap}
.lk-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-top:10px}.lk-foot .lk-more{margin-top:0}
.lk-save{border:0;background:var(--accent,#0071e3);color:#fff;border-radius:980px;padding:8px 14px;font:600 13.5px -apple-system,sans-serif;cursor:pointer}.lk-save:disabled{background:var(--fill,#e8e8ed);color:var(--good,#248a3d);cursor:default}
.lk-more{display:inline-block;margin-top:8px;font:500 13px -apple-system,sans-serif;color:var(--accent,#0071e3);text-decoration:none}
.lk-hl{position:fixed;z-index:299;border-radius:6px;background:rgba(255,214,10,.35);pointer-events:none;animation:lkIn .15s ease}
.lk-tip{position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:120;background:#1d1d1f;color:#fff;border-radius:14px;padding:10px 14px;font:500 14px/1.35 -apple-system,sans-serif;max-width:min(92vw,420px);box-shadow:0 8px 24px rgba(0,0,0,.25);display:flex;gap:10px;align-items:center;animation:lkIn .25s ease}
.lk-tip button{border:0;background:rgba(255,255,255,.18);color:#fff;border-radius:999px;padding:5px 11px;font:600 13px -apple-system,sans-serif;cursor:pointer;flex:none}
html{touch-action:manipulation}   /* no double-tap zoom, so a double-tap looks a word up */
.rd-prose{-webkit-touch-callout:none}   /* the highlight bar replaces the phone's own copy menu */
@keyframes lkIn{from{opacity:0;transform:translateY(4px)}}`;
  document.head.appendChild(css);

  // one-time tip on pages with something to read
  setTimeout(() => {
    try { if (localStorage.getItem(TIP_KEY)) return } catch (e) { return }
    if (!document.querySelector(".rd-prose,.q")) return;
    const t = document.createElement("div"); t.className = "lk-tip"; t.innerHTML = `<span>💡 Double-tap any course term to see what it means and its Greek and Latin roots. Press and hold (or drag) to highlight text and add notes.</span><button type="button">Got it</button>`;
    document.body.appendChild(t); t.querySelector("button").onclick = () => { t.remove(); try { localStorage.setItem(TIP_KEY, "1") } catch (e) { } };
    setTimeout(() => t.remove(), 9000);
  }, 2500);
  window.BioLookup = { find: async w => { await data(); return find(w) }, close };
})();

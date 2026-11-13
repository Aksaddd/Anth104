// The Word Bank: the words a student has saved while studying, and a way to actually learn them.
//
//   Saving     from the double-tap dictionary card (shared/lookup.js), from ErgoRead's word bubble in the readings
//              (shared/ergoread.js), or by typing a word in. Each word keeps its meaning, its word parts, the sentence it
//              was found in, and the class and page it came from. A meaning can be rewritten in the student's own words.
//   Words      search, filter by class, sort, edit, remove.
//   Practice   flashcards and a pick-the-meaning quiz, on a spaced schedule: a word you get right moves up a box and
//              comes back later (after 1, 3, 7, then 21 days); a word you miss goes back to the start. Five boxes.
//
// Saved in this browser as "eureka-word-bank" (the key the Eureka app uses): [{ word, def, pos, src, parts, context, cls,
// clsName, where, at, box, due, seen, right }]. Older entries ({ word, def, at }) are read as they are.
// Loaded on every class page by shared/platform.js. Open it with WordBank.open().
(() => {
  if (window.WordBank) return;
  const KEY = "eureka-word-bank", DAY = 864e5, GAP = [0, 1, 3, 7, 21];   // days until a word in each box is due again
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = w => String(w || "").trim().toLowerCase();
  let bank = [], subs = [];
  const fix = w => Object.assign({ def: "", pos: "", src: "", parts: [], context: "", cls: "", clsName: "", where: "", at: Date.now(), box: 0, due: 0, seen: 0, right: 0 }, w);
  function load() { try { const a = JSON.parse(localStorage.getItem(KEY) || "[]"); bank = Array.isArray(a) ? a.filter(w => w && w.word).map(fix) : [] } catch (e) { bank = [] } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(bank)) } catch (e) { } subs.forEach(f => { try { f(bank) } catch (e) { } }); if (dlg) paint() }
  load(); addEventListener("storage", e => { if (e.key === KEY) { load(); subs.forEach(f => f(bank)); if (dlg) paint() } });

  // ---------- the bank itself
  const get = word => bank.find(w => norm(w.word) === norm(word));
  const has = word => !!get(word);
  function add(w) {
    if (!w || !norm(w.word)) return null;
    const C = window.COURSE || {}, old = get(w.word);
    if (old) { if (!old.def && w.def) { old.def = w.def; save() } return old }
    const h1 = document.querySelector("h1");
    const e = fix(Object.assign({ cls: C.id && C.id !== "hub" ? C.id : "", clsName: C.id && C.id !== "hub" ? C.name || "" : "", where: h1 ? h1.textContent.trim().slice(0, 80) : "" }, w, { word: String(w.word).trim(), at: Date.now(), box: 0, due: Date.now(), seen: 0, right: 0 }));
    bank.unshift(e); save(); if (!e.def) fill(e.word); return e;
  }
  function remove(word) { const n = bank.length; bank = bank.filter(w => norm(w.word) !== norm(word)); if (bank.length !== n) save() }
  function update(word, patch) { const w = get(word); if (w) { Object.assign(w, patch); save() } return w }
  // after an answer in practice: right moves the word up a box, wrong sends it back to the first
  function grade(word, ok) { const w = get(word); if (!w) return; w.seen++; if (ok) { w.right++; w.box = Math.min(4, w.box + 1) } else w.box = 0; w.due = Date.now() + GAP[w.box] * DAY; save() }
  const due = () => bank.filter(w => (w.due || 0) <= Date.now());
  // the sentence around a word, for remembering where it was met
  function sentence(el, word) {
    const blk = el && el.closest ? el.closest("p,li,.q,h2,h3,td") || el : null; if (!blk) return "";
    const t = blk.textContent.replace(/\s+/g, " ").trim(), parts = t.match(/[^.!?]+[.!?]*/g) || [t], k = norm(word);
    const s = (parts.find(p => p.toLowerCase().includes(k)) || parts[0] || "").trim(); return s.length > 240 ? s.slice(0, 237) + "…" : s;
  }

  // ---------- looking a word up
  // dictionary(word): a general English dictionary (dictionaryapi.dev), for words the class dictionary doesn't have.
  // define(word): the class dictionary first (with its word parts), then the class glossary, then the general one.
  const dcache = {};
  // dictionary(word): the class's pre-built terms first, then outside sources, tried in order until one answers. Each receives only the word itself.
  //   1. dictionaryapi.dev   everyday English words
  //   2. Wiktionary          rarer and technical words, and other languages' words used in English
  //   3. Wikipedia           names, places and multi-word terms ("Papua New Guinea", "Sapir-Whorf hypothesis")
  // A word that is not found as written is tried again in its plain form ("stoned" → "stone", "ideologies" → "ideology").
  async function getJSON(url) { const c = new AbortController(), tm = setTimeout(() => c.abort(), 6000); try { const r = await fetch(url, { signal: c.signal }); return r.ok ? await r.json() : null } catch (e) { return null } finally { clearTimeout(tm) } }
  const plain = s => { const d = document.createElement("div"); d.innerHTML = String(s || ""); return d.textContent.replace(/\s+/g, " ").trim() };
  function lemmas(k) {
    const f = [k];
    if (/ies$/.test(k)) f.push(k.slice(0, -3) + "y"); if (/(s|x|ch|sh)es$/.test(k)) f.push(k.slice(0, -2)); if (/s$/.test(k) && !/ss$/.test(k)) f.push(k.slice(0, -1));
    if (/ied$/.test(k)) f.push(k.slice(0, -3) + "y"); if (/ed$/.test(k)) f.push(k.slice(0, -2), k.slice(0, -1)); if (/ing$/.test(k)) f.push(k.slice(0, -3), k.slice(0, -3) + "e");
    if (/(.)\1(ed|ing)$/.test(k)) f.push(k.replace(/(.)\1(ed|ing)$/, "$1")); if (/ly$/.test(k)) f.push(k.slice(0, -2));
    return [...new Set(f)].filter(x => x.length > 2);
  }
  async function fromDictionary(k) { const j = await getJSON("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(k)); const m = j && j[0] && j[0].meanings && j[0].meanings[0]; return m && m.definitions && m.definitions[0] ? { word: j[0].word || k, def: m.definitions[0].definition, pos: m.partOfSpeech || "", src: "Dictionary", parts: [] } : null }
  async function fromWiktionary(k) {
    const j = await getJSON("https://en.wiktionary.org/api/rest_v1/page/definition/" + encodeURIComponent(k.replace(/ /g, "_"))); if (!j) return null;
    for (const lang of [j.en].concat(Object.values(j)).filter(Boolean)) for (const e of lang) for (const d of e.definitions || []) { const def = plain(d.definition); if (def) return { word: k, def, pos: (e.partOfSpeech || "").toLowerCase(), src: "Wiktionary", parts: [] } }
    return null;
  }
  async function fromWikipedia(title) {
    const j = await getJSON("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(title.replace(/ /g, "_")) + "?redirect=true"); if (!j || j.type !== "standard" || !j.extract) return null;
    const first = (j.extract.match(/^.*?[.!?](?=\s|$)/) || [j.extract])[0]; return { word: j.title || title, def: first.length > 320 ? first.slice(0, 317) + "…" : first, pos: "", src: "Wikipedia", parts: [] };
  }
  // The class's own pre-built definitions (<class>/assets/terms.js): the names, places and terms in its readings that the
  // course dictionary doesn't cover. Loaded on the first lookup, and tried before any outside source.
  let termsReady = null, TIDX = null;
  const tkey = s => norm(s).replace(/[’']/g, "'").replace(/[“”"]/g, "").replace(/[.:;!?]+$/, "").replace(/\s+/g, " ");
  function terms() {
    if (termsReady) return termsReady;
    const C = window.COURSE || {};
    termsReady = (window.TERMS || !C.base || C.id === "hub" ? Promise.resolve() : new Promise(res => { const s = document.createElement("script"); s.src = C.base + "assets/terms.js"; s.onload = s.onerror = res; document.head.appendChild(s) }))
      .then(() => { TIDX = new Map(); for (const [k, def] of Object.entries(window.TERMS || {})) { const names = k.split("|"); names.forEach(n => { const kk = tkey(n); if (!TIDX.has(kk)) TIDX.set(kk, { word: names[0], def }) }) } });
    return termsReady;
  }
  async function classTerm(word) {
    await terms(); if (!TIDX || !TIDX.size) return null;
    const k = tkey(word), tries = [k].concat(/ /.test(k) ? [k.split(",")[0].trim(), k.replace(/^(the|a|an) /, "")] : lemmas(k), /'s$/.test(k) ? [k.slice(0, -2)] : []);
    for (const f of tries) { const e = TIDX.get(f); if (e) return { word: /[|]/.test(word) ? e.word : String(word).trim().replace(/[.:;!?]+$/, ""), def: e.def, pos: "", src: "Class dictionary", parts: [] } }
    return null;
  }
  async function dictionary(word) {
    const raw = String(word || "").trim().replace(/[.:;!?]+$/, ""), k = norm(raw); if (k in dcache) return dcache[k]; if (k.length < 2 || k.length > 80) return (dcache[k] = null);
    const own = await classTerm(raw); if (own) return (dcache[k] = own);
    const single = /^[a-zà-ɏ'’-]+$/.test(k), named = /[A-Z]/.test(raw.slice(0, 1)) || /[ ,]/.test(raw);
    let out = null;
    if (single) { for (const f of lemmas(k)) { out = await fromDictionary(f); if (out) break } }
    if (!out && !/,/.test(k)) { for (const f of single ? lemmas(k) : [k]) { out = await fromWiktionary(f); if (out) break } }
    if (!out && (named || !single)) { for (const tt of [...new Set([raw, raw.split(",")[0].trim()])]) { out = await fromWikipedia(tt); if (out) break } }
    if (!out && single) out = await fromWikipedia(raw);
    if (out && norm(out.word) !== k) out.word = raw;   // keep the word as the student met it; the meaning may be of its plain form
    return (dcache[k] = out);
  }
  async function define(word) {
    if (window.BioLookup) { try { const r = await window.BioLookup.find(word); if (r && r.def) return { word: r.term, def: r.def, pos: "", src: "Class dictionary", parts: (r.parts || []).map(p => ({ root: p.root, mean: p.mean })) } } catch (e) { } }
    if (window.GLOSS && window.GLOSS.look) { try { const g = window.GLOSS.look(word); if (g) return { word, def: typeof g === "string" ? g : g.def || g.text || String(g), pos: "", src: "Class glossary", parts: [] } } catch (e) { } }
    return dictionary(word);
  }
  // a word saved without a meaning gets one filled in when a dictionary has it
  async function fill(word) { const w = get(word); if (!w || w.def) return; const d = await define(word); const now = get(word); if (d && d.def && now && !now.def) update(word, { def: d.def, pos: now.pos || d.pos, src: d.src, parts: now.parts && now.parts.length ? now.parts : d.parts }) }

  // ---------- the window
  const st = document.createElement("style"); st.textContent = `
.wb-veil{position:fixed;inset:0;z-index:400;background:rgba(0,0,0,.42);display:grid;place-items:center;padding:20px;animation:wbFade .2s ease}
.wb{--p:var(--paper,#fff);--i:var(--ink,#1d1d1f);--m:var(--muted,#6e6e73);--l:var(--line,#d2d2d7);--s:var(--fill,var(--sunk,#f5f5f7));--a:var(--accent,#0071e3);
  width:min(760px,100%);height:min(680px,calc(100vh - 40px));background:var(--p);color:var(--i);border-radius:24px;box-shadow:0 30px 90px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;
  font:400 15px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif;letter-spacing:-.012em;animation:wbUp .25s ease}
.wb *{box-sizing:border-box}
.wb button{font:inherit;letter-spacing:inherit;cursor:pointer}
.wb-top{display:flex;align-items:center;gap:14px;padding:18px 22px 14px;flex:none}
.wb-top h2{margin:0;font:700 24px/1.1 -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;letter-spacing:-.025em}
.wb-top small{color:var(--m);font-size:13px}
.wb-seg{margin-left:auto;display:flex;background:var(--s);border-radius:10px;padding:2px}
.wb-seg button{border:0;background:none;color:var(--i);border-radius:8px;padding:6px 14px;font-weight:500;font-size:13.5px}
.wb-seg button[aria-pressed="true"]{background:var(--p);box-shadow:0 2px 6px rgba(0,0,0,.14);font-weight:600}
.wb-seg b{display:inline-block;min-width:18px;margin-left:5px;padding:0 5px;border-radius:980px;background:#ff3b30;color:#fff;font-size:11px;line-height:18px;text-align:center}
.wb-x{border:0;background:var(--s);color:var(--m);width:30px;height:30px;border-radius:50%;font-size:13px;flex:none}
.wb-body{flex:1;overflow:auto;padding:4px 22px 22px;min-height:0}
.wb-tools{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px;position:sticky;top:0;background:var(--p);padding:4px 0 10px;z-index:1}
.wb-tools input[type=search]{flex:1;min-width:150px;border:0;background:var(--s);color:var(--i);border-radius:10px;padding:9px 12px;font:inherit}
.wb-tools select{border:0;background:var(--s);color:var(--i);border-radius:10px;padding:9px 10px;font:inherit;font-size:13.5px}
.wb-btn{border:0;background:var(--a);color:#fff;border-radius:980px;padding:9px 16px;font-weight:500}.wb-btn.ghost{background:var(--s);color:var(--a)}.wb-btn:disabled{opacity:.45;cursor:default}
.wb-card{border-top:1px solid var(--l);padding:14px 0}
.wb-card:first-of-type{border-top:0}
.wb-card h3{margin:0;font:700 18px/1.2 -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;letter-spacing:-.015em;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.wb-card h3 em{font:italic 400 13px/1 ui-serif,Georgia,serif;color:var(--m)}
.wb-tag{font:600 11px/1 -apple-system,sans-serif;letter-spacing:.02em;color:var(--m);background:var(--s);border-radius:980px;padding:4px 8px}
.wb-dots{display:inline-flex;gap:3px;margin-left:auto}.wb-dots i{width:7px;height:7px;border-radius:50%;background:var(--l)}.wb-dots i.on{background:#34c759}
.wb-def{margin:6px 0 0}.wb-def.none{color:var(--m);font-style:italic}
.wb-parts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.wb-parts span{background:color-mix(in srgb,var(--a) 10%,transparent);border-radius:9px;padding:4px 9px;font-size:13px}.wb-parts b{color:var(--a)}
.wb-ctx{margin:8px 0 0;padding-left:10px;border-left:2px solid var(--l);color:var(--m);font:italic 400 14px/1.45 ui-serif,Georgia,serif}
.wb-ctx mark{background:color-mix(in srgb,#ffd60a 45%,transparent);color:inherit;font-style:normal;border-radius:3px;padding:0 2px}
.wb-meta{display:flex;gap:14px;align-items:center;margin-top:8px;font-size:12.5px;color:var(--m)}
.wb-meta button{border:0;background:none;color:var(--a);padding:0;font-size:12.5px}.wb-meta button.del{color:#ff3b30}
.wb-edit{display:flex;flex-direction:column;gap:8px;margin-top:8px}
.wb-edit textarea,.wb-form input,.wb-form textarea{width:100%;border:1px solid var(--l);background:var(--p);color:var(--i);border-radius:12px;padding:10px 12px;font:inherit;resize:vertical}
.wb-form{background:var(--s);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px;margin-bottom:14px}
.wb-row{display:flex;gap:8px;flex-wrap:wrap}
.wb-empty{text-align:center;color:var(--m);padding:44px 20px}.wb-empty b{display:block;color:var(--i);font:700 20px/1.2 -apple-system,sans-serif;margin-bottom:6px}
.wb-prac{height:100%;display:flex;flex-direction:column;align-items:center;gap:16px;padding-top:8px}
.wb-prog{width:100%;height:5px;border-radius:3px;background:var(--s);overflow:hidden;flex:none}.wb-prog i{display:block;height:100%;background:var(--a);border-radius:3px;transition:width .3s}
.wb-flash{width:100%;flex:1;min-height:220px;border:0;border-radius:22px;background:var(--s);color:var(--i);padding:26px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center}
.wb-flash .w{font:700 clamp(28px,6vw,44px)/1.1 -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;letter-spacing:-.03em}
.wb-flash .d{font-size:17px;line-height:1.5;max-width:34em}.wb-flash .h{color:var(--m);font-size:13px}
.wb-opts{width:100%;display:flex;flex-direction:column;gap:8px}
.wb-opts button{text-align:left;border:1.5px solid var(--l);background:var(--p);color:var(--i);border-radius:14px;padding:12px 14px;line-height:1.4}
.wb-opts button.ok{border-color:#34c759;background:color-mix(in srgb,#34c759 14%,var(--p))}.wb-opts button.no{border-color:#ff3b30;background:color-mix(in srgb,#ff3b30 12%,var(--p))}
.wb-acts{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;flex:none}
.wb-acts .again{background:color-mix(in srgb,#ff9f0a 18%,var(--p));color:#b25000}.wb-acts .got{background:#34c759;color:#fff}
[data-theme="dark"] .wb-acts .again{color:#ffb340}
.wb-score{font:700 56px/1 -apple-system,sans-serif;letter-spacing:-.03em}
.wb-toast{position:fixed;left:50%;bottom:calc(22px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:410;background:#1d1d1f;color:#fff;border-radius:980px;padding:10px 16px;font:500 14px/1.2 -apple-system,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.3);display:flex;gap:12px;align-items:center;animation:wbUp .2s ease;white-space:nowrap}
.wb-toast button{border:0;background:none;color:#64b5ff;font:600 14px -apple-system,sans-serif;cursor:pointer;padding:0}
@keyframes wbFade{from{opacity:0}}@keyframes wbUp{from{opacity:0;transform:translateY(10px)}}
.wb-toast{animation-name:wbToast}@keyframes wbToast{from{opacity:0;transform:translate(-50%,10px)}}
@media (max-width:600px){.wb-veil{padding:0;place-items:end center}.wb{width:100%;height:92vh;border-radius:22px 22px 0 0}.wb-top{flex-wrap:wrap;padding:16px 16px 10px}.wb-seg{order:5;margin:0;width:100%}.wb-seg button{flex:1}.wb-x{margin-left:auto}.wb-body{padding:4px 16px 18px}}
@media (prefers-reduced-motion:reduce){.wb-veil,.wb,.wb-toast{animation:none}}`;
  document.head.appendChild(st);

  let dlg = null, view = "words", q = "", fcls = "", sort = "new", editing = "", adding = false, lastFocus = null;
  let P = null;   // the practice session: { mode, queue, i, shown, picked, opts, right, missed }
  const strength = w => `<span class="wb-dots" title="Box ${w.box + 1} of 5" aria-label="Learned ${w.box} of 4 steps">${[1, 2, 3, 4].map(n => `<i${w.box >= n ? ' class="on"' : ""}></i>`).join("")}</span>`;
  const when = w => { const d = (w.due || 0) - Date.now(); return d <= 0 ? "Due now" : d < DAY ? "Due tomorrow" : "Due in " + Math.round(d / DAY) + " days" };
  const ctx = w => { if (!w.context) return ""; const i = w.context.toLowerCase().indexOf(norm(w.word)); return `<p class="wb-ctx">${i < 0 ? esc(w.context) : esc(w.context.slice(0, i)) + "<mark>" + esc(w.context.slice(i, i + w.word.length)) + "</mark>" + esc(w.context.slice(i + w.word.length))}</p>` };

  function wordsHTML() {
    const classes = [...new Map(bank.filter(w => w.cls).map(w => [w.cls, w.clsName || w.cls])).entries()];
    let list = bank.filter(w => (!fcls || w.cls === fcls) && (!q || (w.word + " " + w.def).toLowerCase().includes(q.toLowerCase())));
    list = list.slice().sort(sort === "az" ? (a, b) => a.word.localeCompare(b.word) : sort === "weak" ? (a, b) => a.box - b.box || a.due - b.due : (a, b) => b.at - a.at);
    return `<div class="wb-tools"><input type="search" id="wbQ" placeholder="Search your words" value="${esc(q)}" aria-label="Search your words">
        ${classes.length > 1 ? `<select id="wbCls" aria-label="Class"><option value="">All classes</option>${classes.map(([id, n]) => `<option value="${esc(id)}"${fcls === id ? " selected" : ""}>${esc(n)}</option>`).join("")}</select>` : ""}
        <select id="wbSort" aria-label="Sort"><option value="new"${sort === "new" ? " selected" : ""}>Newest first</option><option value="az"${sort === "az" ? " selected" : ""}>A to Z</option><option value="weak"${sort === "weak" ? " selected" : ""}>Needs practice</option></select>
        <button type="button" class="wb-btn ghost" id="wbAdd">＋ Add a word</button></div>
      ${adding ? `<form class="wb-form" id="wbForm"><input id="wbNew" placeholder="Word or term" maxlength="80" required aria-label="Word or term"><textarea id="wbNewDef" rows="2" maxlength="600" placeholder="What it means (leave empty to look it up in the class dictionary)" aria-label="Meaning"></textarea><div class="wb-row"><button class="wb-btn" type="submit">Save word</button><button class="wb-btn ghost" type="button" id="wbCancel">Cancel</button></div></form>` : ""}
      ${!bank.length ? `<div class="wb-empty"><b>No words yet</b>While you study, double-tap (or double-click) any word to see what it means, then choose “Save to word bank”. In the readings you can also rest your pointer on a word.</div>`
        : !list.length ? `<div class="wb-empty">No words match.</div>`
          : list.map(w => `<article class="wb-card" data-w="${esc(w.word)}"><h3>${esc(w.word)}${w.pos ? `<em>${esc(w.pos)}</em>` : ""}${w.clsName ? `<span class="wb-tag">${esc(w.clsName)}</span>` : ""}${strength(w)}</h3>
            ${editing === w.word ? `<div class="wb-edit"><textarea rows="3" maxlength="600" aria-label="Meaning of ${esc(w.word)}">${esc(w.def)}</textarea><div class="wb-row"><button type="button" class="wb-btn" data-act="save">Save</button><button type="button" class="wb-btn ghost" data-act="cancel">Cancel</button></div></div>`
              : `<p class="wb-def${w.def ? "" : " none"}">${w.def ? esc(w.def) : "No meaning yet. Write it in your own words."}</p>`}
            ${w.parts && w.parts.length ? `<div class="wb-parts">${w.parts.map(p => `<span><b>${esc(p.root)}</b> ${esc(p.mean)}</span>`).join("")}</div>` : ""}${ctx(w)}
            <div class="wb-meta"><span>${when(w)}${w.seen ? ` · ${w.right}/${w.seen} right` : ""}</span><button type="button" data-act="edit">${w.def ? "Edit meaning" : "Write a meaning"}</button>${w.def ? "" : `<button type="button" data-act="look">Look it up</button>`}<button type="button" class="del" data-act="del">Remove</button></div></article>`).join("")}`;
  }

  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a };
  const quizable = () => bank.filter(w => w.def).length >= 4;
  function startPractice(all, mode) {
    const pool = (all ? bank : due()).filter(w => w.def);
    P = { mode: mode || (P && P.mode) || "flash", queue: shuffle(pool).slice(0, 20).map(w => w.word), i: 0, shown: false, picked: null, opts: null, right: 0, missed: [] };
    if (P.mode === "quiz" && !quizable()) P.mode = "flash";
  }
  function quizOpts(w) { const others = shuffle(bank.filter(x => x.def && norm(x.word) !== norm(w.word) && x.def !== w.def)).slice(0, 3).map(x => x.def); return shuffle(others.concat(w.def)) }
  function practiceHTML() {
    const withDef = bank.filter(w => w.def).length, d = due().filter(w => w.def).length;
    if (!withDef) return `<div class="wb-empty"><b>Nothing to practice yet</b>Save a few words with their meanings and they will show up here.</div>`;
    if (!P) {
      const next = bank.filter(w => w.def && w.due > Date.now()).sort((a, b) => a.due - b.due)[0];
      return `<div class="wb-empty"><b>${d ? d + (d === 1 ? " word is" : " words are") + " ready to review" : "You're all caught up"}</b>${d ? "A word you get right comes back later (after 1, 3, 7, then 21 days). A word you miss starts again." : next ? "Next review: " + when(next).toLowerCase() + "." : ""}
        <div class="wb-acts" style="margin-top:18px">${d ? `<button type="button" class="wb-btn" data-go="due-flash">Flashcards</button><button type="button" class="wb-btn ghost" data-go="due-quiz"${quizable() ? "" : " disabled"}>Quiz</button>` : ""}<button type="button" class="wb-btn ghost" data-go="all-flash">Practice all ${withDef}</button></div>
        ${quizable() ? "" : `<p style="font-size:13px;margin-top:14px">The quiz opens once you have four words with meanings.</p>`}</div>`;
    }
    if (P.i >= P.queue.length) {
      const n = P.queue.length;
      return `<div class="wb-empty"><div class="wb-score">${P.right}/${n}</div><b style="margin-top:10px">${P.right === n ? "All of them. Well done." : "Session finished"}</b>${P.missed.length ? "To look at again: " + P.missed.map(esc).join(", ") + "." : "Those words will come back when they are due."}
        <div class="wb-acts" style="margin-top:18px">${due().filter(w => w.def).length ? `<button type="button" class="wb-btn" data-go="due-${P.mode}">Keep going</button>` : ""}<button type="button" class="wb-btn ghost" data-go="done">Done</button></div></div>`;
    }
    const w = get(P.queue[P.i]); if (!w) { P.i++; return practiceHTML() }
    const bar = `<div class="wb-prog" role="progressbar" aria-valuemin="0" aria-valuemax="${P.queue.length}" aria-valuenow="${P.i}"><i style="width:${P.i / P.queue.length * 100}%"></i></div>`;
    if (P.mode === "quiz") {
      if (!P.opts) P.opts = quizOpts(w);
      return `<div class="wb-prac">${bar}<div class="wb-flash" style="flex:none;min-height:0;padding:20px"><span class="h">Which meaning fits?</span><span class="w">${esc(w.word)}</span></div>
        <div class="wb-opts">${P.opts.map((o, k) => `<button type="button" data-pick="${k}"${P.picked !== null ? " disabled" : ""} class="${P.picked !== null ? (o === w.def ? "ok" : k === P.picked ? "no" : "") : ""}">${esc(o)}</button>`).join("")}</div>
        <div class="wb-acts">${P.picked !== null ? `<button type="button" class="wb-btn" data-next>Next</button>` : ""}</div></div>`;
    }
    return `<div class="wb-prac">${bar}<button type="button" class="wb-flash" data-flip aria-label="${P.shown ? "Meaning of " + esc(w.word) : "Show the meaning of " + esc(w.word)}"><span class="w">${esc(w.word)}</span>${P.shown ? `<span class="d">${esc(w.def)}</span>${w.context ? `<span class="h">“${esc(w.context)}”</span>` : ""}` : `<span class="h">Say what it means, then tap to check</span>`}</button>
      <div class="wb-acts">${P.shown ? `<button type="button" class="wb-btn again" data-grade="0">Still learning</button><button type="button" class="wb-btn got" data-grade="1">Got it</button>` : `<button type="button" class="wb-btn" data-flip>Show meaning</button>`}</div></div>`;
  }

  function paint() {
    if (!dlg) return;
    const d = due().filter(w => w.def).length, keep = dlg.querySelector("#wbQ") === document.activeElement, body0 = dlg.querySelector(".wb-body"), sc = body0 ? body0.scrollTop : 0;
    dlg.innerHTML = `<div class="wb" role="dialog" aria-modal="true" aria-label="Word bank"><div class="wb-top"><div><h2>Word Bank</h2><small>${bank.length} ${bank.length === 1 ? "word" : "words"} saved on this device</small></div>
        <div class="wb-seg"><button type="button" data-view="words" aria-pressed="${view === "words"}">Words</button><button type="button" data-view="practice" aria-pressed="${view === "practice"}">Practice${d ? `<b>${d}</b>` : ""}</button></div>
        <button type="button" class="wb-x" aria-label="Close">✕</button></div><div class="wb-body">${view === "practice" ? practiceHTML() : wordsHTML()}</div></div>`;
    const $ = s => dlg.querySelector(s), $$ = s => dlg.querySelectorAll(s);
    $(".wb-x").onclick = close; $(".wb-body").scrollTop = sc;
    $$("[data-view]").forEach(b => b.onclick = () => { view = b.dataset.view; if (view === "words") P = null; paint() });
    if (view === "words") {
      const qi = $("#wbQ"); qi.oninput = () => { q = qi.value; paint() }; if (keep) { const i2 = $("#wbQ"); i2.focus(); i2.setSelectionRange(q.length, q.length) }
      if ($("#wbCls")) $("#wbCls").onchange = e => { fcls = e.target.value; paint() };
      $("#wbSort").onchange = e => { sort = e.target.value; paint() };
      $("#wbAdd").onclick = () => { adding = !adding; paint(); const n = $("#wbNew"); if (n) n.focus() };
      if ($("#wbCancel")) $("#wbCancel").onclick = () => { adding = false; paint() };
      if ($("#wbForm")) $("#wbForm").onsubmit = async e => {
        e.preventDefault(); const word = $("#wbNew").value.trim(); let def = $("#wbNewDef").value.trim(), parts = []; if (!word) return;
        let src = "Added by you"; if (!def) { const d = await define(word); if (d) { def = d.def; parts = d.parts; src = d.src } }
        adding = false; add({ word, def, parts, src, where: "" }); if (!def) editing = word; paint();
      };
      $$(".wb-card").forEach(c => { const word = c.dataset.w; c.querySelectorAll("[data-act]").forEach(b => b.onclick = () => {
        const a = b.dataset.act;
        if (a === "edit") { editing = word; paint(); const t = dlg.querySelector(".wb-edit textarea"); if (t) t.focus() }
        else if (a === "cancel") { editing = ""; paint() }
        else if (a === "look") { b.textContent = "Looking…"; b.disabled = true; fill(word).then(() => { const w = get(word); if (w && !w.def) toast(`No dictionary entry for “${word}”. Write it in your own words.`) ; paint() }) }
        else if (a === "save") { const v = c.querySelector("textarea").value.trim(); editing = ""; update(word, { def: v }) }
        else if (a === "del") { const w = get(word), at = bank.indexOf(w); remove(word); toast(`Removed “${word}”`, "Undo", () => { bank.splice(Math.min(at, bank.length), 0, w); save() }) }
      }) });
    } else {
      $$("[data-go]").forEach(b => b.onclick = () => { const [which, mode] = b.dataset.go.split("-"); if (which === "done") P = null; else startPractice(which === "all", mode); paint() });
      $$("[data-flip]").forEach(b => b.onclick = () => { P.shown = true; paint() });
      $$("[data-grade]").forEach(b => b.onclick = () => { const w = P.queue[P.i], ok = b.dataset.grade === "1"; if (ok) P.right++; else P.missed.push(w); P.i++; P.shown = false; grade(w, ok) });
      $$("[data-pick]").forEach(b => b.onclick = () => { const w = get(P.queue[P.i]); P.picked = +b.dataset.pick; const ok = P.opts[P.picked] === w.def; if (ok) P.right++; else P.missed.push(w.word); grade(w.word, ok) });
      if ($("[data-next]")) $("[data-next]").onclick = () => { P.i++; P.picked = null; P.opts = null; paint() };
      const f = $("[data-next]") || $(".wb-acts .wb-btn") || $("[data-flip]"); if (f && dlg.contains(document.activeElement) === false) f.focus({ preventScroll: true });
    }
  }
  function open(v) {
    view = v === "practice" ? "practice" : "words"; P = null; editing = ""; adding = false;
    if (!dlg) { lastFocus = document.activeElement; dlg = document.createElement("div"); dlg.className = "wb-veil"; dlg.addEventListener("pointerdown", e => { if (e.target === dlg) close() }); document.body.appendChild(dlg); document.documentElement.style.overflow = "hidden" }
    paint(); const x = dlg.querySelector(".wb-x"); if (x) x.focus({ preventScroll: true });
  }
  function close() { if (!dlg) return; dlg.remove(); dlg = null; P = null; document.documentElement.style.overflow = ""; if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }) } catch (e) { } }
  addEventListener("keydown", e => {
    if (!dlg) return;
    if (e.key === "Escape") { e.stopPropagation(); close(); return }
    if (view !== "practice" || !P || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const click = s => { const b = dlg.querySelector(s); if (b) { e.preventDefault(); b.click() } };
    if (e.key === " " || e.key === "Enter") { if (!dlg.querySelector("[data-grade]")) click("[data-next], [data-flip]") }
    else if (e.key === "1" || e.key === "ArrowLeft") click('[data-grade="0"], [data-pick="0"]');
    else if (e.key === "2" || e.key === "ArrowRight") click('[data-grade="1"], [data-pick="1"]');
    else if (e.key === "3") click('[data-pick="2"]'); else if (e.key === "4") click('[data-pick="3"]');
  }, true);

  // a small note after saving a word, with a way into the bank
  let tEl = null, tTimer = 0;
  function toast(text, act, fn) {
    if (tEl) tEl.remove(); clearTimeout(tTimer);
    tEl = document.createElement("div"); tEl.className = "wb-toast"; tEl.setAttribute("role", "status"); tEl.innerHTML = `<span>${esc(text)}</span>${act ? `<button type="button">${esc(act)}</button>` : ""}`;
    document.body.appendChild(tEl); const b = tEl.querySelector("button"); if (b) b.onclick = () => { tEl.remove(); fn() };
    tTimer = setTimeout(() => tEl && tEl.remove(), 4200);
  }
  // save a word from wherever it was looked up, and say so
  function saveFrom(w) { const was = has(w.word), e = add(w); if (e) toast(was ? `“${e.word}” is already in your word bank` : `Saved “${e.word}”`, "Open word bank", () => open()); return e }

  window.WordBank = { add, remove, update, has, get, grade, due, sentence, saveFrom, define, dictionary, classTerm, open, close, all: () => bank.slice(), count: () => bank.length, on: f => { subs.push(f) } };
})();

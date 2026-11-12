// Shared drill engine for every exam.
// Reads window.BANK from the exam's questions.js:
//   { title, storageKey, decks, ids: {deck:[id]}, q: {id:{d,tag,q,ok,wrong,ex,img,val,topic,dup}}, img?, textOnly?, topics? }
// Everything is stored in this browser's localStorage under BANK.storageKey. Nothing leaves the device.
(() => {
  const B = window.BANK, SRC = B.decks, Q = B.q;
  // Simple layout (the default, set in Settings): open straight on a question; subjects, question map and banners start tucked away.
  const SIMPLE = (() => { try { return localStorage.getItem("anthro-simple") !== "0" } catch (e) { return true } })();
  // Optional decks (BANK.optional: { deck: label }) can be switched off by the student; they're on by default.
  const OPTIONAL = B.optional || {}, OPT_KEY = d => B.storageKey + "-include-" + d;
  const optOn = d => { try { return localStorage.getItem(OPT_KEY(d)) !== "0" } catch (e) { return true } };
  const ALL = Object.keys(SRC).filter(d => !(d in OPTIONAL) || optOn(d)).flatMap(d => B.ids[d]).filter(id => !Q[id].dup);
  const IN_DRILL = new Set(ALL);
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const txt = s => B.textOnly ? esc(s) : String(s);          // Exam 1 questions contain small bits of markup
  const plain = s => String(s).replace(/<[^>]*>/g, "");
  const imgOf = id => Q[id].img || (B.img && B.img[id]) || null;
  const topicOf = id => Q[id].topic || SRC[Q[id].d].name;
  const isProf = src => !/^Practice/i.test(String(src));   // every source except the practice sets came straight from the professor
  // Practice questions were written from the professor's material: say which
  const basedOn = src => { src = String(src); if (!/^Practice/i.test(src)) return ""; return /study guide/i.test(src) ? "the professor's study guide" : /lecture slides/i.test(src) ? "the lecture slides" : /worksheet/i.test(src) ? "the professor's worksheet" : "class material" };
  const basedBadge = src => basedOn(src) ? `<span class="based" title="Written for this site from ${basedOn(src)}">✎ Based on ${basedOn(src)}</span>` : "";
  const srcOf = id => Q[id].src || SRC[Q[id].d].src || SRC[Q[id].d].name;
  const shuffle = a => { a = a.slice(); for (let k = a.length - 1; k > 0; k--) { const j = Math.random() * (k + 1) | 0; [a[k], a[j]] = [a[j], a[k]] } return a };
  const pct = (c, a) => a ? Math.round(c / a * 100) : 0;
  const plural = (n, w) => n + " " + w + (n === 1 ? "" : "s");
  const reduceMotion = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ===== Subjects: tabs group questions by subject, not by where they came from. "Mixed" holds everything.
  const slug = s => "t-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const DECKS = {}, IDS = {};
  const tlist = (B.topics || []).slice();
  for (const id of ALL) { const t = topicOf(id); if (!tlist.some(x => x.name === t)) tlist.push({ name: t }) }
  for (const t of tlist) {
    const ids = ALL.filter(id => topicOf(id) === t.name); if (!ids.length) continue;
    DECKS[slug(t.name)] = { name: t.short || t.name, full: t.name, sub: t.sub || t.name, link: t.link, featured: t.featured, prompt: t.prompt }; IDS[slug(t.name)] = ids;
  }
  DECKS.ALL = { name: "Mixed", full: "Mixed", sub: "Every question from every subject, weakest first. Good for a final run-through before the exam." }; IDS.ALL = ALL;
  const FIRST = Object.keys(DECKS)[0];

  // ===== Sources: the same questions grouped by where they came from. Students tick one or more sources
  // and practice them together as one round (a Focus round). Shown only when a drill has 2+ sources.
  const SOURCES = [];
  for (const id of ALL) { const n = srcOf(id); let g = SOURCES.find(x => x.name === n); if (!g) SOURCES.push(g = { name: n, ids: [] }); g.ids.push(id) }
  SOURCES.sort((x, y) => /^Practice/.test(x.name) - /^Practice/.test(y.name));   // class materials first, practice sets last (stable otherwise)
  const BY_SOURCE_OK = SOURCES.length > 1, GB_KEY = "anthro-groupby", SEL_KEY = B.storageKey + "-sources";
  // Group by: the student's last choice; with none, drills that have a source preset open on Source.
  let groupBy = "subject"; try { const g = localStorage.getItem(GB_KEY); if (BY_SOURCE_OK && g === "source") groupBy = "source" } catch (e) { }
  // Ticked sources: the student's own choice once they've made one, otherwise the drill's preset (BANK.sourcePreset).
  let srcSel = new Set(); try { const saved = localStorage.getItem(SEL_KEY); for (const n of saved !== null ? JSON.parse(saved) : (B.sourcePreset || [])) if (SOURCES.some(g => g.name === n)) srcSel.add(n) } catch (e) { }

  // ===== Question status (no streak-based levels): a question is not answered yet, right or wrong
  // (its most recent answer), or marked for review by the student, which takes priority.
  const flagged = id => S.mark[id] && S.mark[id].m === "review";
  // Optional (BANK.mastery): students can also mark a question mastered. It leaves the pool: new rounds skip it,
  // and its unanswered copies drop out of rounds already under way. Unmark it to bring it back.
  const MASTERY = !!B.mastery;
  const mastered = id => MASTERY && !!S.mark[id] && S.mark[id].m === "mastered";
  const ORDER = ["review", "wrong", "new", "right", "mastered"];   // order questions come up in a round
  const LEVEL_TEXT = { new: "Not answered yet", right: "Got it right", wrong: "Got it wrong", review: "Marked for review", mastered: "Mastered" };
  function lvl(id) {
    if (flagged(id)) return "review";
    if (mastered(id)) return "mastered";
    const st = S.stats[id]; if (!st || !st[0]) return "new";
    return S.hist[id] === 1 ? "right" : "wrong";
  }
  const byNeed = ids => { const g = {}; for (const id of shuffle(ids)) (g[lvl(id)] = g[lvl(id)] || []).push(id); return ORDER.flatMap(l => g[l] || []) };

  // ===== Daily activity (no quota: just a count and a day streak)
  const AUTO_MS = 1800;
  const dayKey = (d = new Date()) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  const today = () => S.days[dayKey()] | 0;
  function dayStreak() {
    const d = new Date(); let n = 0;
    if (!S.days[dayKey(d)]) d.setDate(d.getDate() - 1);
    while (S.days[dayKey(d)]) { n++; d.setDate(d.getDate() - 1) }
    return n;
  }

  // ===== State
  // A round is an ordered list of questions plus a current position. Students can move to any position;
  // each position is either unanswered (live question) or answered (read-only review).
  const L = B.storageKey;
  let S = fresh(), missed = new Set(), answered = false, view = "deck", curOpts = null, autoTimer = null, menuOpen = false;
  function fresh() { return { v: 2, updatedAt: 0, deck: SIMPLE ? "ALL" : FIRST, shuffle: true, onlyMissed: false, auto: false, autoV2: true, missed: [], hist: {}, stats: {}, log: {}, mark: {}, days: {}, rounds: {}, focus: null } }
  const pool = d => d === "FOCUS" ? (S.focus ? S.focus.ids : []) : d === "MISSED" ? ALL.filter(id => missed.has(id)) : IDS[d];
  function apply(s) {
    if (!s || s.v !== 2) return false;
    const n = fresh();
    n.updatedAt = s.updatedAt || 0; n.shuffle = s.shuffle !== false; n.onlyMissed = false; n.auto = s.autoV2 ? s.auto === true : false; n.autoV2 = true;   // onlyMissed is retired: the Missed tab replaces it
    n.missed = (s.missed || []).filter(id => Q[id]);
    for (const k in (s.hist || {})) if (Q[k]) n.hist[k] = s.hist[k] ? 1 : 0;
    for (const k in (s.stats || {})) if (Q[k] && Array.isArray(s.stats[k])) n.stats[k] = [s.stats[k][0] | 0, s.stats[k][1] | 0];
    for (const k in n.hist) if (!n.stats[k]) n.stats[k] = [1, n.hist[k]];
    for (const k in (s.log || {})) { const g = s.log[k]; if (Q[k] && g) n.log[k] = { s: g.s | 0, t0: +g.t0 || 0, last: +g.last || 0 } }
    for (const k in n.hist) if (!n.log[k]) n.log[k] = { s: n.hist[k], t0: 0, last: 0 };
    for (const k in (s.days || {})) if (/^\d{4}-\d\d-\d\d$/.test(k)) n.days[k] = s.days[k] | 0;
    for (const k in (s.mark || {})) { const m = s.mark[k]; if (Q[k] && m && (m.m === "review" || m.m === "mastered")) n.mark[k] = { m: m.m, t: +m.t || Date.now() } }
    if (s.focus && Array.isArray(s.focus.ids)) { const ids = s.focus.ids.filter(id => Q[id] && !Q[id].dup && IN_DRILL.has(id)); if (ids.length) n.focus = { label: String(s.focus.label || "Focus"), ids } }
    n.deck = DECKS[s.deck] || (s.deck === "FOCUS" && n.focus) || s.deck === "MISSED" ? s.deck : FIRST;
    S = n; missed = new Set(n.missed);
    for (const d of [...Object.keys(DECKS), "FOCUS", "MISSED"]) {
      const r = (s.rounds || {})[d]; if (!r || !Array.isArray(r.order) || !r.order.length) continue;
      if (s.onlyMissed && d !== "MISSED" && d !== "FOCUS") continue;   // built under the retired "only missed" filter: rebuild with every question
      // a Missed round keeps questions answered right since it started
      const ok = new Set(d === "MISSED" ? ALL : pool(d)); const order = r.order.filter(id => ok.has(id));
      const log = order.length === r.order.length && Array.isArray(r.log) ? r.log.slice(0, order.length) : [];
      const pos = Number.isInteger(r.pos) ? r.pos : (r.i | 0);   // older saves tracked only how far you'd got
      n.rounds[d] = { order, pos: Math.max(0, Math.min(pos, order.length)), streak: r.streak | 0, best: r.best | 0, m0: r.m0 | 0, log };
    }
    return true;
  }
  function load() { try { return JSON.parse(localStorage.getItem(L) || "null") } catch (e) { return null } }
  function save() { S.updatedAt = Date.now(); S.missed = [...missed]; try { localStorage.setItem(L, JSON.stringify(S)) } catch (e) { } }

  // ===== Rounds and navigation
  const R = () => S.rounds[S.deck];
  const doneIn = r => r.log.filter(Boolean).length;
  const rightIn = r => r.log.filter(e => e && e.p === e.c).length;
  function nextUnanswered(r, from) {
    const n = r.order.length;
    for (let k = from + 1; k < n; k++) if (!r.log[k]) return k;
    for (let k = 0; k <= Math.min(from, n - 1); k++) if (!r.log[k]) return k;
    return -1;
  }
  // Drop unanswered, mastered questions from a round (keepId: the one on screen stays until you move on).
  function prune(r, keepId) {
    if (!MASTERY || !r || !r.order) return;
    for (let k = r.order.length - 1; k >= 0; k--) {
      const id = r.order[k];
      if (id === keepId || !mastered(id) || (r.log && r.log[k])) continue;
      r.order.splice(k, 1); if (r.log && k < r.log.length) r.log.splice(k, 1);
      if (k < r.pos) r.pos--;
    }
    r.pos = Math.max(0, Math.min(r.pos, r.order.length));
  }
  function newRound(d) {
    const ids = pool(d).filter(id => !mastered(id));
    S.rounds[d] = { order: S.shuffle ? byNeed(ids) : ids, pos: 0, streak: 0, best: 0, log: [] };
  }
  function openMissed() {
    view = "deck"; S.deck = "MISSED"; answered = false;
    const r = S.rounds.MISSED;
    if (!r || !r.order.length || doneIn({ log: r.log || [] }) >= r.order.length) newRound("MISSED");
    paint(); save();
  }
  function restart() { newRound(S.deck); answered = false; view = "deck"; paint(); save() }
  // Randomize: the same set of questions in a fresh, fully random order (ignores the weakest-first ordering).
  function randomize() {
    const r = R(), ids = r ? r.order.slice() : pool(S.deck).slice();
    S.rounds[S.deck] = { order: shuffle(ids), pos: 0, streak: 0, best: 0, log: [] };
    answered = false; view = "deck"; paint(); save(); toast("Questions shuffled"); window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
  }
  function openDeck(d) { view = "deck"; S.deck = d; answered = false; if (!S.rounds[d]) newRound(d); paint(); save() }
  function startFocus(label, ids) {
    ids = ids.filter(id => !mastered(id));
    S.focus = { label, ids }; S.deck = "FOCUS"; S.onlyMissed = false;
    S.rounds.FOCUS = { order: byNeed(ids), pos: 0, streak: 0, best: 0, log: [] };
    answered = false; view = "deck"; paint(); save(); window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
  }
  // Move to any position in the round (n = results screen).
  function goTo(k) {
    const r = R(); if (!r) return;
    stopAuto(); answered = false;
    if (MASTERY) { const target = r.order[k]; prune(r); k = target !== undefined && r.order.includes(target) ? r.order.indexOf(target) : Math.min(k, r.order.length) }
    r.pos = Math.max(0, Math.min(k, r.order.length)); save(); paint();
  }
  const goPrev = () => { const r = R(); if (r && r.pos > 0) goTo(r.pos - 1) };
  const goNext = () => { const r = R(); if (r && r.pos < r.order.length) goTo(r.pos + 1) };
  // After answering: the next question you haven't answered yet, or the results when none are left.
  const goNextQuestion = () => { const r = R(); const k = nextUnanswered(r, r.pos); goTo(k < 0 ? r.order.length : k) };

  // ===== Mark for review: the student decides what they still need to study.
  function marksRow(id) {
    const on = flagged(id), mo = mastered(id);
    return `<div class="marks">${MASTERY ? `<button type="button" class="mk mk-mastered" data-mark="mastered" aria-pressed="${mo}"><span aria-hidden="true">✓</span> ${mo ? "Mastered" : "Mark as mastered"}</button>` : ""}<button type="button" class="mk mk-review" data-mark="review" aria-pressed="${on}"><span aria-hidden="true">⚑</span> ${on ? "Marked for review" : "Mark for review"}</button></div>`;
  }
  function wireMarks(id) {
    $("card").querySelectorAll("[data-mark]").forEach(b => b.onclick = () => {
      stopAuto();
      const want = b.dataset.mark;
      if (S.mark[id] && S.mark[id].m === want) { delete S.mark[id]; toast(want === "mastered" ? "Back in the pool" : "Removed from review", "blue") }
      else {
        S.mark[id] = { m: want, t: Date.now() };
        if (want === "mastered") {
          missed.delete(id);   // a mastered question leaves the Missed bank too
          for (const d in S.rounds) prune(S.rounds[d], d === S.deck ? id : null);
          toast("Mastered: it leaves the pool");
        } else toast("Marked for review", "gold");
      }
      save();
      const box = $("card").querySelector(".marks"); if (box) { box.outerHTML = marksRow(id); wireMarks(id) }
      paintChrome();
    });
  }
  const recordInner = id => { const s = S.stats[id]; return s && s[0] ? `<span>${s[1]} of ${s[0]} right so far</span>` : "" };

  // ===== Summaries
  function sumUp(ids) {
    let a = 0, c = 0, seen = 0; const n = { new: 0, right: 0, wrong: 0, review: 0, mastered: 0 };
    for (const id of ids) { const s = S.stats[id]; if (s && s[0]) { a += s[0]; c += s[1]; seen++ } n[lvl(id)]++ }
    return { a, c, seen, n, review: n.review, total: ids.length, acc: pct(c, a) };
  }
  const subjects = () => Object.keys(DECKS).filter(k => k !== "ALL").map(k => ({ key: k, name: DECKS[k].full, short: DECKS[k].name, ids: IDS[k], ...sumUp(IDS[k]) }));
  // The subject to practice next: the lowest accuracy among started subjects, else the first one not started.
  const weakest = (except) => { const ts = subjects().filter(t => t.key !== except); return ts.filter(t => t.a).sort((x, y) => x.acc - y.acc)[0] || ts.find(t => !t.a) || ts[0] };
  const segs = n => ["mastered", "right", "wrong", "review"].map(l => n[l] ? `<i class="lv-c-${l}" style="width:${n[l] / Math.max(1, n.right + n.wrong + n.review + n.new + n.mastered) * 100}%"></i>` : "").join("");

  // ===== Toasts
  function toast(msg, tone = "") {
    const t = document.createElement("div"); t.className = "toast " + tone; t.innerHTML = `<i></i>${esc(msg)}`;
    $("toasts").appendChild(t); setTimeout(() => t.remove(), 2700);
  }

  // ===== Chrome: header, tabs, question squares, toolbar
  function ringSVG(size, stroke, frac) {
    const r = (size - stroke) / 2, C = 2 * Math.PI * r;
    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="track" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}"/><circle class="fill" cx="${size / 2}" cy="${size / 2}" r="${r}" fill="none" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - Math.min(1, frac))}"/></svg>`;
  }
  function paintHabit() {
    const t = today(), st = dayStreak();
    $("habit").innerHTML = `<div class="habit-text"><strong>${t} answered today</strong><span>${st ? plural(st, "day") + " in a row" : "Study today to start a streak"}</span></div>`;
  }
  // Subjects grid can be collapsed to one slim bar (remembered on this device for every drill).
  const TABS_KEY = "anthro-tabs-collapsed";
  let tabsCollapsed = SIMPLE; try { const v = localStorage.getItem(TABS_KEY); if (v !== null) tabsCollapsed = v === "1" } catch (e) { }
  // Question map (one square per question): hidden by default in the simple layout; Options can show it
  const MAP_KEY = "anthro-showmap";
  let showMap = !SIMPLE; try { const v = localStorage.getItem(MAP_KEY); if (v !== null) showMap = v === "1" } catch (e) { }
  function setTabsCollapsed(on) {
    tabsCollapsed = on; try { localStorage.setItem(TABS_KEY, on ? "1" : "0") } catch (e) { }
    $("tabs").hidden = on; $("tabsBar").classList.toggle("collapsed", on);
    if ($("promo")) $("promo").hidden = on || view !== "deck"; if ($("srcPick")) $("srcPick").hidden = on || groupBy !== "source";
    $("tabsToggle").setAttribute("aria-expanded", !on); const what = groupBy === "source" ? "sources" : "subjects"; $("tabsToggle").textContent = on ? `Show ${what} ▾` : `Hide ${what} ▴`;
  }
  let PROG_SPAN = "";
  function buildTabs() {
    const box = $("tabs"); box.innerHTML = "";
    if (!$("tabsBar")) {
      const bar = document.createElement("div"); bar.id = "tabsBar"; bar.className = "tabsbar";
      bar.innerHTML = `<span class="tbnow" id="tbNow"></span>${BY_SOURCE_OK ? `<div class="gb" role="group" aria-label="Group questions by"><span>Group by</span><button type="button" data-gb="subject">Subject</button><button type="button" data-gb="source">Source</button></div>` : ""}<button type="button" class="chip" id="tabsToggle" aria-controls="tabs"></button>`;
      box.before(bar);
      $("tabsToggle").onclick = () => setTabsCollapsed(!tabsCollapsed);
      bar.querySelectorAll("[data-gb]").forEach(b => b.onclick = () => {
        groupBy = b.dataset.gb; try { localStorage.setItem(GB_KEY, groupBy) } catch (e) { }
        setTabsCollapsed(false);
        paint();
      });
      const pk = document.createElement("section"); pk.id = "srcPick"; pk.className = "srcpick"; pk.hidden = true; pk.setAttribute("aria-label", "Questions by source");
      box.before(pk);
    }
    const make = (key, label, onclick, extra = "") => {
      const b = document.createElement("button"); b.className = "tab " + extra; b.setAttribute("role", "tab"); b.id = "tab" + key;
      b.innerHTML = `<b>${esc(label)}</b><span class="mini" id="tm${key}"></span><span class="tcount" id="tc${key}"></span>`; b.onclick = onclick; box.appendChild(b);
    };
    for (const d in DECKS) make(d, DECKS[d].name, () => { if (S.deck === d && view === "deck") return; stopAuto(); openDeck(d) });
    make("MISSED", "Missed", () => { if (S.deck === "MISSED" && view === "deck") return; stopAuto(); openMissed() }, "tab-missed");
    make("PROG", "Progress", () => { stopAuto(); view = "progress"; paint() }, "tab-prog");
    // keep the 3-column grid tidy: Progress fills whatever is left of the last row
    const n = box.children.length, rem = n % 3;
    PROG_SPAN = rem === 1 ? "1 / -1" : rem === 2 ? "span 2" : "";
  }
  // Optional promo card (Classification drill: the drag-and-drop chart)
  const PROMO_ILLU = `<svg class="dd-illu" viewBox="0 0 132 84" aria-hidden="true">
  <rect x="2" y="2" width="128" height="18" rx="5" class="dd-box"/>
  <rect x="2" y="26" width="62" height="24" rx="5" class="dd-box"/><rect x="68" y="26" width="62" height="24" rx="5" class="dd-box dd-target"/>
  <rect x="2" y="56" width="38" height="26" rx="5" class="dd-box"/><rect x="47" y="56" width="38" height="26" rx="5" class="dd-box"/><rect x="92" y="56" width="38" height="26" rx="5" class="dd-box"/>
  <g class="dd-chip"><rect x="0" y="0" width="46" height="13" rx="6.5"/><rect x="7" y="5" width="26" height="3" rx="1.5" class="dd-line"/></g>
  <path class="dd-hand" d="M0 0 L0 13 L3.5 10 L6 15.5 L8.2 14.5 L5.8 9.2 L10.5 9 Z"/>
</svg>`;
  const promoHTML = P => `<span class="eyebrow2">${esc(P.eyebrow || "Try it")}</span>${PROMO_ILLU}<strong>${esc(P.title)}</strong><p class="ddtext">${esc(P.text)}</p><a class="ddbtn" href="${P.href}">${esc(P.label)} →</a>`;
  function paintPromo() {
    const P = B.promo; if (!P) return;
    let el = $("promo");
    if (!el) { el = document.createElement("aside"); el.id = "promo"; el.className = "ddpromo"; el.setAttribute("aria-label", P.title); el.innerHTML = promoHTML(P); $("tabs").before(el) }
    el.hidden = view !== "deck";
  }

  // Optional prompt at the top of a drill (Exam 2: study the classification chart in its own drill).
  const SP = B.studyPrompt, SP_KEY = B.storageKey + "-prompt-hidden";
  function paintFeature() {
    let el = $("feature"), hidden = false;
    try { hidden = localStorage.getItem(SP_KEY) === "1" || (SIMPLE && localStorage.getItem(SP_KEY) === null) } catch (e) { }
    if (!SP || hidden || view !== "deck") { if (el) el.hidden = true; return }
    if (!el) { el = document.createElement("aside"); el.id = "feature"; el.className = "feature"; $("tabs").before(el) }
    let done = "";
    try { const o = JSON.parse(localStorage.getItem(SP.key) || "null"); const n = o && o.stats ? Object.keys(o.stats).length : 0; done = n ? `You've practiced ${Math.min(n, SP.total)} of ${SP.total} questions there.` : `${SP.total} questions, not started yet.` } catch (e) { }
    el.hidden = false;
    el.innerHTML = `<div class="ftext"><strong>${esc(SP.title)}</strong><span>${esc(SP.text)}</span>${done ? `<span class="fprog">${esc(done)}</span>` : ""}</div>
      <div class="fact">${SP.links.map(l => `<a class="btn${l.ghost ? " ghost" : ""}" href="${l.href}"><span>${esc(l.label)}</span></a>`).join("")}</div>
      <button class="fclose" id="featClose" aria-label="Hide this reminder">×</button>`;
    $("featClose").onclick = () => { try { localStorage.setItem(SP_KEY, "1") } catch (e) { } el.hidden = true };
  }
  const srcLeft = g => g.ids.filter(id => !mastered(id));
  function selectedIds() { return SOURCES.filter(g => srcSel.has(g.name)).flatMap(srcLeft) }
  function srcLabel() {
    const names = SOURCES.filter(g => srcSel.has(g.name)).map(g => g.name);
    return names.length === SOURCES.length ? "every source" : names.join(" + ");
  }
  function paintGoBtn() {
    const n = selectedIds().length, k = srcSel.size;
    $("spGo").disabled = !n; if ($("startSel")) $("startSel").disabled = !n;
    $("spGo").innerHTML = `<span>${k ? `Practice ${plural(n, "question")}${k > 1 ? ` from ${k} sources` : ""}` : "Tick one or more sources"}</span>`;
  }
  function paintSources() {
    const pk = $("srcPick"); if (!pk) return;
    const on = groupBy === "source";
    document.querySelectorAll("[data-gb]").forEach(b => b.setAttribute("aria-pressed", b.dataset.gb === groupBy));
    for (const d in DECKS) $("tab" + d).hidden = on;
    $("tabPROG").style.gridColumn = on ? "span 2" : PROG_SPAN;
    pk.hidden = !on || tabsCollapsed;
    if (!on) return;
    pk.innerHTML = `<div class="sp-head"><b>Pick sources to practice together</b><span>${SOURCES.some(g => isProf(g.name)) && SOURCES.some(g => !isProf(g.name)) ? `<button type="button" class="chip" id="spProf">★ Professor's only</button>` : ""}<button type="button" class="chip" id="spAll">Select all</button><button type="button" class="chip" id="spNone">Clear</button></span></div>
      <div class="sp-list">${SOURCES.map((g, i) => { const s = sumUp(g.ids), left = srcLeft(g).length; return `<label class="sp-row"><input type="checkbox" data-i="${i}"${srcSel.has(g.name) ? " checked" : ""}><span class="sp-name">${esc(g.name)}${isProf(g.name) ? ` <span class="prof sm">★ Professor</span>` : basedOn(g.name) ? ` <span class="based sm">✎ Based on ${basedOn(g.name)}</span>` : ""}</span><span class="sp-n">${MASTERY && s.n.mastered ? `${left} left · ${s.n.mastered} mastered` : `${s.seen}/${s.total} answered`}</span><span class="mini">${segs(s.n)}</span></label>` }).join("")}</div>
      <button type="button" class="btn" id="spGo"></button>`;
    const keep = () => { try { localStorage.setItem(SEL_KEY, JSON.stringify([...srcSel])) } catch (e) { } paintGoBtn() };
    pk.querySelectorAll("input[data-i]").forEach(c => c.onchange = () => { const n = SOURCES[+c.dataset.i].name; c.checked ? srcSel.add(n) : srcSel.delete(n); keep() });
    $("spAll").onclick = () => { SOURCES.forEach(g => srcSel.add(g.name)); pk.querySelectorAll("input[data-i]").forEach(c => c.checked = true); keep() };
    if ($("spProf")) $("spProf").onclick = () => { srcSel.clear(); SOURCES.forEach(g => isProf(g.name) && srcSel.add(g.name)); pk.querySelectorAll("input[data-i]").forEach(c => c.checked = srcSel.has(SOURCES[+c.dataset.i].name)); keep() };
    $("spNone").onclick = () => { srcSel.clear(); pk.querySelectorAll("input[data-i]").forEach(c => c.checked = false); keep() };
    $("spGo").onclick = () => { const ids = selectedIds(); if (ids.length) { stopAuto(); startFocus("Sources: " + srcLabel(), ids) } };
    paintGoBtn();
  }
  function paintTabs() {
    for (const d in DECKS) {
      const s = sumUp(IDS[d]);
      $("tab" + d).setAttribute("aria-selected", view === "deck" && d === S.deck);
      $("tm" + d).innerHTML = segs(s.n);
      $("tc" + d).textContent = MASTERY ? `${s.total - s.n.mastered} left · ${s.n.mastered} mastered` : `${s.seen}/${s.total} answered`;
    }
    const nm = ALL.filter(id => missed.has(id)).length;
    $("tabMISSED").setAttribute("aria-selected", view === "deck" && S.deck === "MISSED");
    $("tmMISSED").innerHTML = nm ? `<i class="lv-c-wrong" style="width:${Math.min(100, nm / ALL.length * 100 * 4)}%"></i>` : "";
    $("tcMISSED").textContent = nm ? `${nm} to practice` : "none right now";
    const all = sumUp(ALL);
    $("tabPROG").setAttribute("aria-selected", view === "progress");
    $("tmPROG").innerHTML = segs(all.n);
    $("tcPROG").textContent = all.a ? `${all.acc}% right` : "not started";
    // the slim bar names where you are, so collapsing never hides that
    const cur = view === "progress" ? ["Progress", $("tcPROG").textContent] : S.deck === "FOCUS" ? ["Focus round", S.focus ? S.focus.label : ""] : S.deck === "MISSED" ? ["Missed", $("tcMISSED").textContent] : [DECKS[S.deck] ? DECKS[S.deck].name : "", $("tc" + S.deck) ? $("tc" + S.deck).textContent : ""];
    $("tbNow").innerHTML = `<b>${esc(cur[0])}</b>${cur[1] ? ` <span>${esc(cur[1])}</span>` : ""}`;
  }
  // One square per question in this round, in order. Color = status (right, wrong, marked for review, not answered),
  // outline = the question on screen. Every square is a button that jumps to that question.
  function paintMap() {
    const r = R();
    $("map").innerHTML = r.order.map((id, k) => {
      const l = lvl(id), done = !!r.log[k];
      return `<button type="button" class="sq lv-c-${l}${done ? " done" : ""}${k === r.pos ? " cur" : ""}" data-k="${k}" aria-label="Question ${k + 1}: ${LEVEL_TEXT[l]}${done ? ", answered this round" : ""}"${k === r.pos ? ' aria-current="step"' : ""}></button>`;
    }).join("");
  }
  function paintChrome() {
    paintHabit(); paintTabs(); paintSources(); paintFeature(); paintPromo();
    const inDeck = view === "deck";
    for (const id of ["toolbar", "barRow", "map"]) $(id).hidden = !inDeck;
    if (!showMap) $("map").hidden = true;
    if (!inDeck) { $("deckSub").textContent = "Your strengths and weak spots, from every answer you've given on this device."; return }
    const d = S.deck, r = R(), n = r.order.length, done = doneIn(r);
    $("deckSub").innerHTML = d === "MISSED" ? esc(`Every question you got wrong on your last try: ${plural(ALL.filter(id => missed.has(id)).length, "question")} right now. Answer one right and it leaves this bank.`)
      : d === "FOCUS" ? esc(`Focus round: ${S.focus.label}. ${plural(pool(d).length, "question")}, weakest first. Pick another tab${BY_SOURCE_OK ? " or other sources" : ""} to leave.`)
      : esc(DECKS[d].sub) + (DECKS[d].link ? ` <a class="sublink" href="${DECKS[d].link.href}">${esc(DECKS[d].link.label)}</a>` : "");
    paintMap();
    $("roundInfo").innerHTML = n ? `<span>${r.pos < n ? `Question <b>${r.pos + 1}</b> of ${n}` : "<b>Results</b>"}</span><span><b>${done}</b> answered</span><span><b>${rightIn(r)}</b> right</span><span>Streak <b>${r.streak}</b></span>` : "";
    $("prog").style.width = n ? (done / n * 100) + "%" : "0";
    $("shuffleBtn").setAttribute("aria-checked", S.shuffle);
    $("autoBtn").setAttribute("aria-checked", S.auto);
  }
  $("map").addEventListener("click", e => { const b = e.target.closest(".sq"); if (b) goTo(+b.dataset.k) });

  // ===== Card pieces
  function figure(id) {
    const im = imgOf(id); if (!im) return "";
    return `<figure class="fig"><button type="button" class="zoom" data-src="${im[0]}" data-alt="${esc(im[1])}" aria-label="Enlarge image: ${esc(im[1])}"><img src="${im[0]}" alt="${esc(im[1])}"></button><figcaption>Tap to zoom</figcaption></figure>`;
  }
  function wireZoom() { $("card").querySelectorAll(".zoom").forEach(b => b.onclick = () => openLightbox(b.dataset.src, b.dataset.alt)) }
  function metaRow(id, right) {
    return `<div class="meta"><span class="meta-l">${basedBadge(srcOf(id))}${isProf(srcOf(id)) ? `<span class="prof" title="This question comes straight from the professor's course materials">★ From the professor</span>` : ""}<span class="origin">Source: ${esc(srcOf(id))}</span><span>${esc(Q[id].tag)}</span></span>${right}</div>`;
  }
  // Bottom navigation: Previous on the left, the forward action on the right.
  function navBar(fwdLabel, fwdId, ghostFwd) {
    const r = R();
    return `<div class="nav"><button class="btn ghost" id="prevBtn"${r.pos > 0 ? "" : " disabled"}><span>← Previous</span></button><button class="btn${ghostFwd ? " ghost" : ""}" id="${fwdId}"><span>${fwdLabel}</span></button></div>`;
  }
  const lastLabel = r => doneIn(r) === r.order.length ? "See results →" : "Finish →";

  // ===== Main paint
  // Before a student's first round: with Source view on, show the picker and a start card instead of a question.
  const notStarted = () => !!B.sourcePreset && groupBy === "source" && S.deck !== "FOCUS" && S.deck !== "MISSED" && !Object.keys(S.stats).length;
  function paintStart() {
    if (!S.rounds[S.deck]) newRound(S.deck);
    paintChrome(); answered = false;
    for (const id of ["toolbar", "barRow", "map"]) $(id).hidden = true;
    $("deckSub").textContent = "Pick the sources you want, then start practicing.";
    const c = $("card"); c.className = "card enter";
    c.innerHTML = `<h2 class="ph">Choose what to practice</h2><p class="sub">The sources ticked above are a good place to start: the Top Hat questions, the Brightspace activities, the film worksheet and the practice sets. Tick or untick any of them, then tap <b>Practice</b>. You can switch to <b>Group by: Subject</b> at any time.</p><div class="nav"><button class="btn ghost" id="toSubj"><span>Group by subject instead</span></button><button class="btn" id="startSel"><span>Practice the ticked sources</span></button></div>`;
    $("startSel").onclick = () => $("spGo").click();
    $("toSubj").onclick = () => document.querySelector('[data-gb="subject"]').click();
    $("startSel").disabled = !selectedIds().length;
  }
  function paint() {
    stopAuto();
    if (view === "progress") return paintProgress();
    if (view === "deck" && notStarted()) return paintStart();
    if (S.deck === "FOCUS" && !S.focus) S.deck = FIRST;
    if (!S.rounds[S.deck]) newRound(S.deck);
    const r = R(); if (!r.log) r.log = []; if (!Number.isInteger(r.pos)) r.pos = 0;
    const c = $("card");
    const d0 = S.deck;
    if (!r.order.length) {
      paintChrome(); c.className = "card";
      if (d0 === "MISSED") { c.innerHTML = `<h2 class="ph">No missed questions</h2><p class="sub">Questions you get wrong in any subject land here automatically, so you can practice exactly those. Get one right and it leaves the bank.</p><div class="nav"><button class="btn" id="goMix"><span>Practice the Mixed set</span></button></div>`; $("goMix").onclick = () => openDeck("ALL"); return }
      if (MASTERY && d0 !== "FOCUS" && pool(d0).length && pool(d0).every(mastered)) {
        c.innerHTML = `<h2 class="ph">Every question here is mastered</h2><p class="sub">You've marked all ${pool(d0).length} questions in this set as mastered, so the pool is empty.</p><div class="nav"><button class="btn ghost" id="unmaster"><span>Put them back in the pool</span></button><button class="btn" id="goMix"><span>Practice the Mixed set</span></button></div>`;
        $("unmaster").onclick = () => { for (const id of pool(d0)) if (mastered(id)) delete S.mark[id]; newRound(d0); save(); paint() };
        $("goMix").onclick = () => openDeck("ALL"); return;
      }
      c.innerHTML = `<h2 class="ph">Nothing here yet</h2><p class="sub">This set has no questions right now.</p><div class="nav"><button class="btn" id="goMix"><span>Practice the Mixed set</span></button></div>`; $("goMix").onclick = () => openDeck("ALL");
      return;
    }
    if (r.pos >= r.order.length) return paintResult();
    if (r.log[r.pos]) return paintReview(r.pos);
    answered = false;
    const k = r.pos, id = r.order[k], x = Q[id], s = S.stats[id];
    paintChrome();
    const opts = shuffle([{ t: x.ok, c: true }, ...x.wrong.map(t => ({ t, c: false }))]); curOpts = opts;
    const isLast = k === r.order.length - 1;
    c.className = "card enter";
    c.innerHTML = `${metaRow(id, x.val ? `<span class="val">$${x.val}</span>` : `<span>${k + 1} / ${r.order.length}</span>`)}
      <p class="q">${txt(x.q)}</p>${figure(id)}
      <div class="opts">${opts.map((o, j) => `<button class="opt" id="o${j}" data-c="${o.c}"><span class="bub">${"ABCDE"[j]}</span><span>${txt(o.t)}</span></button>`).join("")}</div>
      <p class="record" id="rec">${recordInner(id)}</p>
      ${marksRow(id)}
      <div id="fb">${navBar(isLast ? lastLabel(r) : "Skip →", "skipBtn", true)}</div>`;
    c.querySelectorAll(".opt").forEach((b, j) => b.onclick = () => pick(b, id, j));
    wireMarks(id);
    $("prevBtn").onclick = goPrev; $("skipBtn").onclick = goNext;
    wireZoom();
  }

  // After every answer: why the right answer is right, and (when wrong) what the picked option actually means.
  function explainHTML(id, pickedText, good, lead) {
    const x = Q[id], why = window.GLOSS && !good ? window.GLOSS.look(pickedText) : null;
    const ex = String(x.ex || "").trim();
    return `<div class="explain ${good ? "good" : "bad"}"><strong>${lead}</strong>${ex ? `<span class="exwhy"><b>Why:</b> ${txt(ex)}</span>` : ""}${why ? `<span class="whynot"><b>Why not “${esc(plain(pickedText))}”?</b> ${esc(why)}</span>` : ""}</div>`;
  }
  function pick(b, id, pickedIdx) {
    if (answered) return; answered = true;
    const x = Q[id], r = R(), good = b.dataset.c === "true", now = Date.now();
    r.log[r.pos] = { o: curOpts.map(o => o.t), p: pickedIdx, c: curOpts.findIndex(o => o.c) };
    $("card").querySelectorAll(".opt").forEach(o => { o.disabled = true; if (o.dataset.c === "true") o.classList.add("right") });
    b.classList.add("picked", good ? "pop" : "shake"); if (!good) b.classList.add("wrong");
    if (good) { r.streak++; r.best = Math.max(r.best | 0, r.streak); missed.delete(id) } else { r.streak = 0; missed.add(id) }
    S.hist[id] = good ? 1 : 0;
    const s = S.stats[id] || [0, 0]; S.stats[id] = [s[0] + 1, s[1] + (good ? 1 : 0)];
    const dk = dayKey(); S.days[dk] = (S.days[dk] | 0) + 1;
    save(); paintChrome();
    const sq = $("map").querySelector(`[data-k="${r.pos}"]`); if (sq) sq.classList.add("just");
    const more = nextUnanswered(r, r.pos) >= 0;
    $("fb").innerHTML = `${explainHTML(id, curOpts[pickedIdx].t, good, good ? "Correct!" : "Not quite. The answer is: " + txt(x.ok))}
      ${!good && !flagged(id) ? `<p class="lvnote">Want to come back to this one? Mark it for review below.</p>` : ""}
      ${navBar(more ? "Next question →" : "See results →", "next")}`;
    const mr = $("card").querySelector(".marks"); if (mr) { mr.outerHTML = marksRow(id); wireMarks(id) }
    $("next").onclick = goNextQuestion; $("next").focus({ preventScroll: true });
    $("prevBtn").onclick = goPrev;
    if (good && [5, 10, 15, 20, 30, 40, 50].includes(r.streak)) toast(`${r.streak} in a row`, "gold");
    if (good && S.auto) startAuto();
  }

  // Auto-advance after a right answer; any touch, click or key (other than going forward) pauses it.
  function startAuto() {
    const nb = $("next"); if (!nb) return;
    nb.style.setProperty("--auto", AUTO_MS + "ms"); nb.classList.add("auto");
    autoTimer = setTimeout(() => { autoTimer = null; if ($("next")) goNextQuestion() }, AUTO_MS);
  }
  function stopAuto() { if (autoTimer) { clearTimeout(autoTimer); autoTimer = null } const nb = $("next"); if (nb) nb.classList.remove("auto") }
  const pauseAuto = e => { if (!autoTimer) return; if (e.target && e.target.closest && e.target.closest("#next")) return; stopAuto() };
  document.addEventListener("pointerdown", pauseAuto, true);
  document.addEventListener("wheel", pauseAuto, { passive: true });
  document.addEventListener("touchmove", pauseAuto, { passive: true });

  // An answered question: read-only, with what you picked, the answer and the explanation.
  function paintReview(k) {
    const c = $("card"), r = R(), e = r.log[k], id = r.order[k], x = Q[id];
    answered = false; paintChrome();
    const isLast = k === r.order.length - 1;
    c.className = "card review enter";
    c.innerHTML = `${metaRow(id, `<span class="revtag">Answered · ${k + 1} / ${r.order.length}</span>`)}
      <p class="q">${txt(x.q)}</p>${figure(id)}
      <div class="opts">${e.o.map((t, j) => `<button class="opt${j === e.c ? " right" : ""}${j === e.p ? " picked" : ""}${j === e.p && j !== e.c ? " wrong" : ""}" disabled><span class="bub">${"ABCDE"[j]}</span><span>${txt(t)}</span></button>`).join("")}</div>
      ${explainHTML(id, e.o[e.p], e.p === e.c, e.p === e.c ? "You got this one right." : "You picked " + "ABCDE"[e.p] + ". The answer is: " + txt(x.ok))}
      <p class="hint">Already answered in this round, so it can't be changed.</p>
      ${marksRow(id)}
      ${navBar(isLast ? lastLabel(r) : "Next →", "fwdBtn")}`;
    $("prevBtn").onclick = goPrev; $("fwdBtn").onclick = goNext; $("fwdBtn").focus({ preventScroll: true });
    wireMarks(id);
    wireZoom();
  }

  // Results: score ring, what changed, skipped questions, what to do next.
  function paintResult() {
    answered = false; paintChrome();
    const c = $("card"), r = R(), d = S.deck, ids = pool(d), done = doneIn(r), right = rightIn(r), p = pct(right, done);
    const skipped = r.order.length - done, firstSkipped = nextUnanswered(r, -1);
    const m = ids.filter(id => missed.has(id)).length, fl = ids.filter(flagged).length;
    const next = weakest(d === "FOCUS" || d === "MISSED" ? null : d);
    const C = 2 * Math.PI * 55;   // ringSVG(120, 10): radius (120 - 10) / 2
    c.className = "card result enter";
    c.innerHTML = `<div class="bigring">${ringSVG(120, 10, 0)}<b>${p}%</b></div>
      <h2>${right} of ${done} right</h2>
      <div class="gains">
        ${r.best ? `<span class="gain">Best streak ${r.best}</span>` : ""}
        ${m ? `<span class="gain">${m} missed</span>` : ""}
        ${fl ? `<span class="gain">${fl} marked for review</span>` : ""}
      </div>
      ${skipped ? `<div class="suggest"><span><small>Not answered yet</small><b>${plural(skipped, "skipped question")}</b></span><button class="btn" id="goSkipped"><span>Answer them</span></button></div>` : ""}
      ${B.promo ? `<div class="suggest"><span><small>Test yourself on the whole chart</small><b>${esc(B.promo.title)}</b></span><a class="btn" href="${B.promo.href}" style="text-decoration:none"><span>Open it</span></a></div>` : ""}
      ${next ? `<div class="suggest"><span><small>${next.a ? "Weakest subject right now" : "Up next"}</small><b>${esc(next.name)}</b> <small>${next.a ? `${next.acc}% right · ${next.seen}/${next.total} answered` : "Not started yet"}</small></span><button class="btn${skipped ? " ghost" : ""}" id="goNext"><span>Practice</span></button></div>` : ""}
      <div class="nav"><button class="btn ghost" id="prevBtn"><span>← Previous</span></button>${m && S.deck !== "MISSED" ? '<button class="btn ghost" id="drill"><span>Practice what I missed</span></button>' : ""}<button class="btn ghost" id="again"><span>Go again</span></button></div>`;
    requestAnimationFrame(() => { const f = c.querySelector(".bigring .fill"); if (f) f.style.strokeDashoffset = C * (1 - p / 100) });
    $("again").onclick = restart; $("prevBtn").onclick = goPrev;
    if ($("goSkipped")) $("goSkipped").onclick = () => goTo(firstSkipped);
    if ($("drill")) $("drill").onclick = () => { S.rounds.MISSED = null; delete S.rounds.MISSED; openMissed() };
    if ($("goNext")) $("goNext").onclick = () => { const nr = S.rounds[next.key]; if (nr && doneIn({ log: nr.log || [] }) >= nr.order.length) delete S.rounds[next.key]; openDeck(next.key) };
  }

  // ===== Progress view
  function paintProgress() {
    paintChrome();
    const c = $("card"), all = sumUp(ALL), ts = subjects();
    c.className = "card prog enter";
    if (!all.a) {
      c.innerHTML = `<h2 class="ph">No answers yet</h2><p class="sub">Answer a few questions and this page shows your accuracy by subject, your strongest and weakest areas, your week, and the questions you miss most. Everything stays on this device.</p>
        <div class="nav"><button class="btn" id="goStart"><span>Start with ${esc(DECKS[FIRST].name)}</span></button></div>`;
      $("goStart").onclick = () => openDeck(FIRST); return;
    }
    const started = ts.filter(t => t.a).sort((x, y) => x.acc - y.acc), fresh = ts.filter(t => !t.a);
    const strong = started.filter(t => t.acc >= 80 && t.seen >= 3).slice(-2).reverse();
    const weak = started.filter(t => t.acc < 70).sort((x, y) => x.acc - y.acc).slice(0, 2);
    const worst = ALL.map(id => ({ id, s: S.stats[id] })).filter(o => o.s && o.s[0] > o.s[1])
      .sort((x, y) => (y.s[0] - y.s[1]) - (x.s[0] - x.s[1]) || x.s[1] / x.s[0] - y.s[1] / y.s[0]).slice(0, 8);
    const flaggedIds = ALL.filter(flagged), missedN = ALL.filter(id => missed.has(id)).length;
    const days = []; for (let k = 6; k >= 0; k--) { const d = new Date(); d.setDate(d.getDate() - k); days.push({ key: dayKey(d), label: d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2), n: S.days[dayKey(d)] | 0, today: k === 0 }) }
    const top = Math.max(10, ...days.map(d => d.n));
    const row = t => `<li class="trow">
        <div class="tname"><b>${esc(t.name)}</b><span>${t.a ? `${t.seen}/${t.total} answered · ${t.acc}% right${t.review ? ` · ${t.review} marked` : ""}` : `Not started · ${plural(t.total, "question")}`}</span></div>
        <div class="stack" role="img" aria-label="${t.n.right} right, ${t.n.wrong} wrong, ${t.n.review} marked for review, ${t.n.new} not answered">${segs(t.n)}</div>
        <button class="chip" data-topic="${t.key}">Practice</button></li>`;
    c.innerHTML = `
      <div class="pgrid">
        <div><b>${all.seen}/${all.total}</b>answered</div>
        <div><b>${all.acc}%</b>right</div>
        <div><b>${all.review}</b>marked for review</div>
        <div><b>${dayStreak()}</b>day streak</div>
      </div>
      <div class="legend">${(MASTERY ? ["mastered", "right", "wrong", "review", "new"] : ["right", "wrong", "review", "new"]).map(l => `<span><i class="lv-c-${l}"></i>${LEVEL_TEXT[l]} ${all.n[l]}</span>`).join("")}</div>
      ${strong.length || weak.length ? `<div class="callouts">
        ${weak.length ? `<p class="callout bad"><strong>Needs work</strong>${weak.map(t => esc(t.name) + " (" + t.acc + "% right)").join(" · ")}</p>` : ""}
        ${strong.length ? `<p class="callout good"><strong>Strongest</strong>${strong.map(t => esc(t.name) + " (" + t.acc + "% right)").join(" · ")}</p>` : ""}
      </div>` : ""}
      ${missedN ? `<div class="callout missc"><strong>Missed bank</strong>${plural(missedN, "question")} you got wrong on your last try. <button class="chip" id="goMissed">Practice missed</button></div>` : ""}
      ${flaggedIds.length ? `<div class="callout flagc"><strong>Marked for review</strong>${plural(flaggedIds.length, "question")} you flagged. <button class="chip" id="drillFlag">Drill marked</button><a class="chip" href="../review/index.html" style="text-decoration:none">Open the Review list</a></div>` : ""}
      <h3 class="ph3">By subject <span>weakest first</span></h3>
      <ul class="topics">${started.map(row).join("")}${fresh.map(row).join("")}</ul>
      <h3 class="ph3">This week <span>questions answered per day</span></h3>
      <div class="week" role="img" aria-label="${days.map(d => d.label + " " + d.n).join(", ")}">
        ${days.map(d => `<div class="day${d.today ? " today" : ""}"><em>${d.n || ""}</em><i style="height:${d.n / top * 82}px"></i><span>${d.label}</span></div>`).join("")}
      </div>
      ${worst.length ? `<h3 class="ph3">Most-missed questions</h3>
      <ol class="worst">${worst.map(o => `<li><span>${esc(plain(Q[o.id].q))}</span><em>${o.s[0] - o.s[1]} wrong of ${o.s[0]} · Source: ${esc(srcOf(o.id))}</em></li>`).join("")}</ol>
      <div class="nav"><button class="btn" id="drillWorst"><span>Drill these ${worst.length}</span></button></div>` : ""}
      <p class="hint">Saved in this browser on this device only. Clearing your browser data erases it.</p>`;
    c.querySelectorAll("[data-topic]").forEach(b => b.onclick = () => { const t = ts.find(x => x.key === b.dataset.topic); startFocus(t.name, t.ids) });
    if ($("drillWorst")) $("drillWorst").onclick = () => startFocus("Most-missed questions", worst.map(o => o.id));
    if ($("goMissed")) $("goMissed").onclick = () => { openMissed(); window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" }) };
    if ($("drillFlag")) $("drillFlag").onclick = () => startFocus("Marked for review", flaggedIds);
  }

  // ===== Lightbox
  function openLightbox(src, alt) { stopAuto(); $("lbImg").src = src; $("lbImg").alt = alt; $("lightbox").hidden = false; $("lbClose").focus() }
  function closeLightbox() { $("lightbox").hidden = true }
  $("lightbox").onclick = closeLightbox;


  // ===== Reading settings: font and text size, saved on this device and shared by every drill.
  // Research (Wallace et al., 2022) found no single font is fastest for everyone, so readers choose.
  const READ_KEY = "anthro-reading";
  const FONTS = {
    plex: { label: "IBM Plex Sans", note: "The default", stack: '"IBM Plex Sans",system-ui,-apple-system,sans-serif' },
    atkinson: { label: "Atkinson Hyperlegible", note: "Every letter easy to tell apart", stack: '"Atkinson Hyperlegible Next","Atkinson Hyperlegible",system-ui,sans-serif', href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600;700&display=swap" },
    literata: { label: "Literata", note: "A serif made for screen reading", stack: 'Literata,Georgia,"Times New Roman",serif', href: "https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;600;700&display=swap" },
    system: { label: "Your device's font", note: "Familiar, nothing to download", stack: 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif' }
  };
  const SIZES = [{ k: .9, label: "A−", name: "Small" }, { k: 1, label: "A", name: "Default" }, { k: 1.12, label: "A+", name: "Large" }, { k: 1.25, label: "A++", name: "Extra large" }];
  let reading = { font: "plex", size: 1 };
  try { const r = JSON.parse(localStorage.getItem(READ_KEY) || "null"); if (r && FONTS[r.font]) reading.font = r.font; if (r && SIZES[r.size]) reading.size = r.size } catch (e) { }
  function applyReading() {
    const f = FONTS[reading.font];
    if (f.href && !document.querySelector(`link[data-font="${reading.font}"]`)) {
      const l = document.createElement("link"); l.rel = "stylesheet"; l.href = f.href; l.dataset.font = reading.font; document.head.appendChild(l);
    }
    document.documentElement.style.setProperty("--read", f.stack);
    document.documentElement.style.setProperty("--rs", SIZES[reading.size].k);
    document.querySelectorAll("[data-fontpick]").forEach(b => b.setAttribute("aria-checked", b.dataset.fontpick === reading.font));
    document.querySelectorAll("[data-sizepick]").forEach(b => b.setAttribute("aria-pressed", +b.dataset.sizepick === reading.size));
    try { localStorage.setItem(READ_KEY, JSON.stringify(reading)) } catch (e) { }
  }
  function buildReadingMenu() {
    const g = document.createElement("div"); g.className = "mgroup";
    g.innerHTML = `<span class="mlabel" id="fontLbl">Reading font</span>
      ${Object.entries(FONTS).map(([k, f]) => `<button class="mi" role="menuitemradio" data-fontpick="${k}"><span class="dot"></span><span class="fname"><span style="font-family:${f.stack.replace(/"/g, "&quot;")}">${f.label}</span><small>${f.note}</small></span></button>`).join("")}
      <span class="mlabel" id="sizeLbl">Text size</span>
      <div class="seg" role="group" aria-labelledby="sizeLbl">${SIZES.map((z, i) => `<button type="button" data-sizepick="${i}" aria-label="${z.name} text" style="font-size:${13 * z.k}px">${z.label}</button>`).join("")}</div>`;
    $("menu").insertBefore(g, $("restartBtn"));
    g.querySelectorAll("[data-fontpick]").forEach(b => b.onclick = e => { e.stopPropagation(); reading.font = b.dataset.fontpick; applyReading() });
    g.querySelectorAll("[data-sizepick]").forEach(b => b.onclick = e => { e.stopPropagation(); reading.size = +b.dataset.sizepick; applyReading() });
  }

  // ===== Options menu
  function setMenu(open) { menuOpen = open; $("menu").hidden = !open; $("optBtn").setAttribute("aria-expanded", open) }
  $("optBtn").onclick = e => { e.stopPropagation(); setMenu(!menuOpen) };
  document.addEventListener("click", e => { if (menuOpen && !e.target.closest(".menuwrap")) setMenu(false) });
  // Optional decks: a visible switch under the subjects, and the same switch in Options. Changing it reloads the drill.
  function setOptional(d, on) { try { localStorage.setItem(OPT_KEY(d), on ? "1" : "0") } catch (e) { } location.reload() }
  for (const d in OPTIONAL) {
    const n = B.ids[d].filter(id => !Q[id].dup).length, on = optOn(d);
    const mi = document.createElement("button"); mi.className = "mi"; mi.setAttribute("role", "menuitemcheckbox"); mi.setAttribute("aria-checked", on);
    mi.innerHTML = `<span class="box"></span>Include the ${esc(OPTIONAL[d])} (${n})`; mi.onclick = () => setOptional(d, !on);
    $("menu").appendChild(mi);
    const row = document.createElement("label"); row.className = "optdeck"; row.id = "opt" + d;
    row.innerHTML = `<input type="checkbox"${on ? " checked" : ""}><span><b>Include the ${esc(OPTIONAL[d])}</b> · ${n} questions${on ? "" : " (off)"}</span>${d === "AP" ? `<a class="sublink" href="../anthropardy/index.html?board=exam2">Play Anthro-pardy →</a>` : ""}`;
    row.querySelector("input").onchange = e => setOptional(d, e.target.checked);
    $("tabs").after(row);
  }
  $("shuffleBtn").onclick = () => { S.shuffle = !S.shuffle; setMenu(false); restart() };
  $("autoBtn").onclick = () => { S.auto = !S.auto; save(); $("autoBtn").setAttribute("aria-checked", S.auto); if (!S.auto) stopAuto() };
  $("restartBtn").onclick = () => { setMenu(false); restart() };
  { const mb = document.createElement("button"); mb.className = "mi"; mb.id = "mapBtn"; mb.setAttribute("role", "menuitemcheckbox"); mb.setAttribute("aria-checked", showMap);
    mb.innerHTML = '<span class="box"></span>Show the question map (a square per question)';
    $("menu").insertBefore(mb, $("restartBtn"));
    mb.onclick = () => { showMap = !showMap; try { localStorage.setItem(MAP_KEY, showMap ? "1" : "0") } catch (e) { } mb.setAttribute("aria-checked", showMap); setMenu(false); paintChrome() } }
  $("randBtn").onclick = () => { stopAuto(); setMenu(false); randomize() };
  let armed = null;
  $("resetBtn").onclick = () => {
    const b = $("resetBtn");
    if (!armed) { b.textContent = "Tap again to erase everything"; armed = setTimeout(() => { armed = null; b.textContent = "Clear all progress" }, 3000); return }
    clearTimeout(armed); armed = null; b.textContent = "Clear all progress"; setMenu(false);
    S = fresh(); missed = new Set(); restart();
  };

  // ===== Keyboard: 1–5 answer · ← previous · → next · Enter = the main button
  document.addEventListener("keydown", e => {
    if (!$("lightbox").hidden) { if (e.key === "Escape") closeLightbox(); return }
    if (e.key === "Escape" && menuOpen) { setMenu(false); $("optBtn").focus(); return }
    if (view !== "deck" || menuOpen) return;
    const r = R(); if (!r) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); return }
    if (e.key === "ArrowRight") { e.preventDefault(); if (answered) goNextQuestion(); else goNext(); return }
    if (e.key === "Enter") { const b = $("next") || $("fwdBtn"); if (b) { e.preventDefault(); b.click() } return }
    if (autoTimer) stopAuto();
    if (!answered && !r.log[r.pos] && /^[1-5]$/.test(e.key)) { const o = $("o" + (e.key - 1)); if (o) o.click() }
  });

  // ===== Start
  buildReadingMenu(); applyReading();
  addEventListener("anthro-settings", e => {   // changed in the Settings sheet
    if (e.detail.what !== "reading") return;
    try { const r = JSON.parse(localStorage.getItem(READ_KEY) || "null"); if (r && FONTS[r.font]) reading.font = r.font; if (r && SIZES[r.size]) reading.size = r.size } catch (er) { }
    applyReading();
  });
  buildTabs();
  setTabsCollapsed(tabsCollapsed);
  apply(load());
  function route() {
    if (location.hash === "#progress") view = "progress";
    else if (location.hash === "#missed") { view = "deck"; S.deck = "MISSED"; const r = S.rounds.MISSED; if (!r || !r.order.length || doneIn({ log: r.log || [] }) >= r.order.length) delete S.rounds.MISSED }
    else if (location.hash === "#continue") {   // from the landing page: open the subject that most needs work
      if (!Object.keys(S.stats).length) { view = "deck"; S.deck = "ALL"; return }   // brand new: the Mixed set
      const w = weakest(); if (w) { const r = S.rounds[w.key]; if (r && doneIn({ log: r.log || [] }) >= r.order.length) delete S.rounds[w.key]; view = "deck"; S.deck = w.key }
    }
  }
  route();
  window.addEventListener("hashchange", () => { route(); paint() });
  paint();
  try { navigator.storage && navigator.storage.persist && navigator.storage.persist() } catch (e) { }
})();

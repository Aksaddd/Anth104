// Read & Learn highlights and notes. Select text in a passage to highlight it in one of four colors and/or attach a
// note; tap a highlight to edit or delete it. On phones, press and hold to select (double-tap is the word lookup in
// assets/lookup.js). Saved per device as bio-notes-v1:
//   { "chapterId:passageIndex": [{ id, s, e, text, color, note, t }] }  where s/e are character offsets in the passage text.
(() => {
  const KEY = "bio-notes-v1", COLORS = ["yellow", "green", "blue", "pink"];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let db = {}; try { db = JSON.parse(localStorage.getItem(KEY) || "{}") || {} } catch (e) { }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch (e) { } };
  const list = k => db[k] || (db[k] = []);
  const find = id => { for (const k in db) { const i = (db[k] || []).findIndex(x => x.id === id); if (i >= 0) return { k, i, x: db[k][i] } } return null };
  let ctx = null;   // { chapter, onChange }

  // character offset of (node, off) inside a passage
  const offsetIn = (root, node, off) => { const r = document.createRange(); r.setStart(root, 0); r.setEnd(node, off); return r.toString().length };
  // wrap [s, e) of the passage's text in <mark> elements (one per text node it crosses)
  function wrap(root, s, e, cls, id) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n, pos = 0; const cut = [];
    while ((n = w.nextNode())) { const a = pos, b = pos + n.length; pos = b; if (b <= s || a >= e) continue; cut.push([n, Math.max(s, a) - a, Math.min(e, b) - a]) }
    cut.forEach(([n, a, b], i) => {
      if (b <= a) return;
      let t = n; if (a > 0) t = t.splitText(a); if (b - a < t.length) t.splitText(b - a);
      const m = document.createElement("mark"); m.className = cls + (i === cut.length - 1 ? " an-last" : ""); m.dataset.an = id; t.parentNode.insertBefore(m, t); m.appendChild(t);
    });
  }
  function paint(root, key) {
    for (const x of list(key).slice().sort((a, b) => a.s - b.s)) wrap(root, x.s, x.e, `an an-${x.color}${x.note ? " has-note" : ""}`, x.id);
  }
  function apply(c) {
    ctx = ctx || {}; ctx.chapter = c;
    document.querySelectorAll(".rd-sec[id^=sec]").forEach(sec => { const p = sec.querySelector(".rd-prose"); if (p) paint(p, c.id + ":" + sec.id.slice(3)) });
    countBadge();
  }
  const countIn = id => Object.keys(db).filter(k => k.startsWith(id + ":")).reduce((n, k) => n + db[k].length, 0);
  const countAll = () => Object.values(db).reduce((n, l) => n + l.length, 0);
  function countBadge() { const b = document.getElementById("anCount"); if (b && ctx && ctx.chapter) b.textContent = countIn(ctx.chapter.id) || "" }

  // ----- selection → toolbar
  let bar = null, pop = null;
  const closeBar = () => { if (bar) { bar.remove(); bar = null } };
  const closePop = () => { if (pop) { pop.remove(); pop = null } };
  function selInfo() {
    const sel = getSelection(); if (!sel.rangeCount || sel.isCollapsed) return null;
    const r = sel.getRangeAt(0), p1 = (r.startContainer.nodeType === 1 ? r.startContainer : r.startContainer.parentElement).closest(".rd-prose"), p2 = (r.endContainer.nodeType === 1 ? r.endContainer : r.endContainer.parentElement).closest(".rd-prose");
    if (!p1 || p1 !== p2) return null;
    const s = offsetIn(p1, r.startContainer, r.startOffset), e = offsetIn(p1, r.endContainer, r.endOffset), text = r.toString().trim();
    if (e - s < 2 || !text) return null;
    return { prose: p1, key: ctx.chapter.id + ":" + p1.closest(".rd-sec").id.slice(3), s, e, text, rect: r.getBoundingClientRect() };
  }
  function showBar() {
    closeBar(); if (!ctx || !ctx.chapter) return;
    const info = selInfo(); if (!info) return;
    bar = document.createElement("div"); bar.className = "an-bar"; bar.setAttribute("role", "toolbar"); bar.setAttribute("aria-label", "Highlight");
    bar.innerHTML = COLORS.map(c => `<button type="button" class="an-dot an-${c}" data-c="${c}" aria-label="Highlight ${c}"></button>`).join("") + `<button type="button" class="an-note" aria-label="Highlight and add a note">✎ Note</button>`;
    document.body.appendChild(bar);
    const W = bar.offsetWidth, H = bar.offsetHeight, rc = info.rect;
    bar.style.left = Math.min(Math.max(8, rc.left + rc.width / 2 - W / 2), innerWidth - W - 8) + "px";
    bar.style.top = (rc.top - H - 10 > 60 ? rc.top - H - 10 : rc.bottom + 10) + "px";
    const make = (color, withNote) => {
      const x = { id: "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), s: info.s, e: info.e, text: info.text.slice(0, 400), color, note: "", t: Date.now() };
      list(info.key).push(x); save(); getSelection().removeAllRanges(); closeBar(); rerender();
      if (withNote) setTimeout(() => openPop(x.id, true), 30);
    };
    bar.querySelectorAll(".an-dot").forEach(b => b.onpointerdown = e => { e.preventDefault(); make(b.dataset.c, false) });
    bar.querySelector(".an-note").onpointerdown = e => { e.preventDefault(); make("yellow", true) };
  }
  function rerender() {   // redraw the marks in every passage on screen without re-rendering the chapter
    document.querySelectorAll("mark.an").forEach(m => { const p = m.parentNode; while (m.firstChild) p.insertBefore(m.firstChild, m); m.remove(); p.normalize() });
    if (ctx && ctx.chapter) apply(ctx.chapter);
    if (ctx && ctx.onChange) ctx.onChange();
  }
  let selT = 0;
  document.addEventListener("selectionchange", () => { clearTimeout(selT); selT = setTimeout(() => { if (selInfo()) showBar(); else closeBar() }, 250) });

  // ----- tap a highlight → edit the note, change color, delete
  function openPop(id, focus) {
    closePop(); const f = find(id); if (!f) return; const x = f.x;
    const m = document.querySelector(`mark[data-an="${id}"]`); const rc = m ? m.getBoundingClientRect() : { left: innerWidth / 2, top: 100, bottom: 100, width: 0 };
    pop = document.createElement("div"); pop.className = "an-pop"; pop.setAttribute("role", "dialog"); pop.setAttribute("aria-label", "Highlight and note");
    pop.innerHTML = `<div class="an-q an-${x.color}">“${esc(x.text.length > 160 ? x.text.slice(0, 160) + "…" : x.text)}”</div>
      <textarea class="an-ta" rows="3" placeholder="Write a note…" aria-label="Note">${esc(x.note)}</textarea>
      <div class="an-row">${COLORS.map(c => `<button type="button" class="an-dot an-${c}${c === x.color ? " on" : ""}" data-c="${c}" aria-label="${c}"></button>`).join("")}<span style="flex:1"></span><button type="button" class="an-del">Delete</button><button type="button" class="an-ok">Done</button></div>`;
    document.body.appendChild(pop);
    const W = Math.min(340, innerWidth - 20), H = pop.offsetHeight; pop.style.width = W + "px";
    pop.style.left = Math.min(Math.max(10, rc.left + rc.width / 2 - W / 2), innerWidth - W - 10) + "px";
    pop.style.top = (rc.bottom + 10 + H < innerHeight ? rc.bottom + 10 : Math.max(10, rc.top - H - 10)) + "px";
    const ta = pop.querySelector("textarea");
    ta.oninput = () => { x.note = ta.value.slice(0, 2000); save() };
    pop.querySelectorAll(".an-dot").forEach(b => b.onclick = () => { x.color = b.dataset.c; save(); pop.querySelectorAll(".an-dot").forEach(d => d.classList.toggle("on", d === b)); pop.querySelector(".an-q").className = "an-q an-" + x.color; rerender() });
    pop.querySelector(".an-del").onclick = () => { db[f.k].splice(db[f.k].indexOf(x), 1); if (!db[f.k].length) delete db[f.k]; save(); closePop(); rerender() };
    pop.querySelector(".an-ok").onclick = () => { closePop(); rerender() };
    if (focus) ta.focus();
  }
  let tapT = 0;
  document.addEventListener("click", e => {
    const m = e.target.closest && e.target.closest("mark.an");
    if (m && !getSelection().toString()) {   // wait a beat: a second tap means "look the word up", not "edit"
      e.preventDefault(); clearTimeout(tapT); const id = m.dataset.an;
      tapT = setTimeout(() => { if (!document.querySelector(".lk-card")) openPop(id) }, 400); return;
    }
    if (pop && !pop.contains(e.target)) { closePop(); rerender() }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closePop(); closeBar() } });
  addEventListener("scroll", closeBar, { passive: true });

  // ----- notebook: every highlight and note (this chapter, or all chapters)
  function notebook(onlyChapter) {
    closePop(); const R = window.READ, sheet = document.createElement("div"); sheet.className = "an-veil";
    const chs = R.filter(c => !onlyChapter || c.id === onlyChapter);
    const rows = chs.map(c => {
      const items = c.sections.flatMap((s, i) => (db[c.id + ":" + i] || []).slice().sort((a, b) => a.s - b.s).map(x => ({ x, i, s })));
      return items.length ? `<h4>${esc(c.title)}</h4>${items.map(({ x, i, s }) => `<button type="button" class="an-item" data-ch="${c.id}" data-id="${x.id}"><span class="an-q an-${x.color}">“${esc(x.text.length > 220 ? x.text.slice(0, 220) + "…" : x.text)}”</span>${x.note ? `<span class="an-n">✎ ${esc(x.note)}</span>` : ""}<small>Passage ${i + 1}: ${esc(s.h)}</small></button>`).join("")}` : "";
    }).join("");
    sheet.innerHTML = `<div class="an-sheet" role="dialog" aria-modal="true" aria-label="My notebook"><div class="an-head"><b>🗒 ${onlyChapter ? "Notes in this chapter" : "My notebook"}</b><button type="button" class="an-x">Done</button></div>
      <div class="an-body">${rows || `<p class="an-empty">No highlights yet. Press and hold (or drag across) any text in a passage to highlight it or add a note.</p>`}</div></div>`;
    document.body.appendChild(sheet);
    const shut = () => sheet.remove();
    sheet.onclick = e => { if (e.target === sheet) shut() };
    sheet.querySelector(".an-x").onclick = shut;
    sheet.querySelectorAll(".an-item").forEach(b => b.onclick = () => { shut(); jump(b.dataset.ch, b.dataset.id) });
  }
  function jump(ch, id) {
    const go = () => { const m = document.querySelector(`mark[data-an="${id}"]`); if (m) { m.scrollIntoView({ block: "center", behavior: "smooth" }); m.classList.add("an-flash"); setTimeout(() => document.querySelectorAll(`mark[data-an="${id}"]`).forEach(x => x.classList.remove("an-flash")), 1800) } };
    if (location.hash.slice(1) !== ch) { location.hash = ch; setTimeout(go, 500) } else go();
  }
  // Highlight mode: on touch screens press-and-hold selects text instead of looking words up
  function setMode(on) { document.body.classList.toggle("an-mode", on); const b = document.getElementById("anMode"); if (b) { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on) } }

  window.ReadNotes = { apply, notebook, setMode, countIn, countAll, init: o => { ctx = Object.assign(ctx || {}, o) } };
})();

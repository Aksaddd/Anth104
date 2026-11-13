// The class bar: one bar across the top of every page of a class, the same on all of them.
//   [Eureka]  ANTH 104        Readings  Drill  Mock Exam  Discussion  Syllabus  More ▾   ⚙
// The part of the class you are in is lit. It replaces the different bars the pages used to have (the dashboard's own
// nav, ANTH 102's shell nav, and the "← All drills" line on inner pages). shared/platform.js loads this file on every
// class page (Platform.guard), and shared/maison.css styles it and gives each part of a class its look.
// It also sets <html data-portal="read|drill|mock|discuss|…"> so the styles know which part this is.
(() => {
  const C = window.COURSE, P = window.Platform; if (!C || !P || !P.course || !P.course(C.id)) return;
  // what each class has: [label, folder, portal]. "main" sits on the bar, the rest under More.
  const PORTALS = {
    a104: {
      main: [["Readings", "read/", "read"], ["Drill", "drill/", "drill"], ["Mock Exam", "mock/", "mock"], ["Discussion", "discuss/", "discuss"], ["Syllabus", "syllabus/", "syllabus"]],
      more: [["Review List", "review/", "review"], ["Readings Drill", "readings/", "drill"], ["Anthro-pardy", "board/", "game"], ["Word Roots", "roots/", "roots"], ["Archive", "archive/", "archive"]]
    },
    bio: {
      main: [["Readings", "read/", "read"], ["Drill", "drill/", "drill"], ["Mock Exam", "mock/", "mock"], ["Syllabus", "syllabus/", "syllabus"]],
      more: [["Review List", "review/", "review"], ["Homework 3", "hw3/", "drill"], ["Bio-pardy", "board/", "game"], ["Word Roots", "roots/", "roots"]]
    },
    a102: {
      main: [["Readings", "read/", "read"], ["Drill", "exam2/", "drill"], ["Mock Exam", "mock/", "mock"], ["Syllabus", "syllabus/", "syllabus"]],
      more: [["Exam 1 Drill", "exam1/", "drill"], ["Classification", "classification/", "drill"], ["Review List", "review/", "review"], ["Anthro-pardy", "anthropardy/", "game"], ["Word Roots", "roots/", "roots"], ["Archive", "archive/", "archive"]]
    }
  };
  const set = PORTALS[C.id]; if (!set) return;
  const base = C.base || (P.BASE + P.course(C.id).path), here = location.href.split(/[?#]/)[0];
  const rest = here.indexOf(base) === 0 ? here.slice(base.length) : "", dir = rest.includes("/") ? rest.split("/")[0] + "/" : "";
  const all = set.main.concat(set.more), cur = all.find(p => p[1] === dir), home = !dir;
  const root = document.documentElement; root.classList.add("cb"); root.dataset.portal = cur ? cur[2] : home ? "home" : "other";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const link = p => `<a href="${base}${p[1]}index.html"${p === cur ? ' class="on" aria-current="page"' : ""}>${esc(p[0])}</a>`;
  const GEAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>';

  function mount() {
    if (document.querySelector(".cbar")) return;
    const bar = document.createElement("header"); bar.className = "cbar";
    const inMore = cur && set.more.includes(cur);
    bar.innerHTML = `<div class="cbar-in">
      <a class="eureka" href="${P.BASE}index.html#classes" title="Back to your library on Eureka"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg><span>Eureka</span></a>
      <a class="cb-name" href="${base}index.html"${home ? ' aria-current="page"' : ""}>${esc(C.name)}</a>
      <nav class="cb-links" aria-label="${esc(C.name)}">${home ? '<a href="#companions" class="cb-comp" hidden>Companions<span class="new-tag">New</span></a>' : ""}${set.main.map(link).join("")}
        <details class="cb-more"><summary${inMore ? ' class="on"' : ""}>${inMore ? esc(cur[0]) : "More"}</summary><div>${set.more.map(link).join("")}</div></details></nav>
      <button type="button" class="cb-set" aria-label="Settings" aria-haspopup="dialog">${GEAR}</button>
    </div>`;
    document.body.prepend(bar); root.classList.add("cb-on");
    // Settings: the shared sheet where there is one, otherwise the page's own settings button
    bar.querySelector(".cb-set").onclick = () => { const own = document.getElementById("gnavSet") || document.querySelector(".gnav #settingsBtn, .st-btn"); if (window.BioSettings && window.BioSettings.open) window.BioSettings.open(); else if (own) own.click() };
    // More closes when you click away or press Escape
    const more = bar.querySelector(".cb-more");
    // on a phone the bar scrolls sideways and everything under More is simply laid out in it
    const small = matchMedia("(max-width:820px)"), lay = () => { more.open = small.matches }; lay(); small.addEventListener && small.addEventListener("change", lay);
    const on = bar.querySelector(".cb-links a.on"), row = bar.querySelector(".cb-links"); if (on && small.matches) row.scrollLeft = on.offsetLeft - row.offsetLeft - 40;
    document.addEventListener("click", e => { if (!small.matches && more.open && !more.contains(e.target)) more.open = false });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !small.matches) more.open = false });
    // On the dashboard, the Companions link (with its shining tag) stands in for the page's own
    const comp = bar.querySelector(".cb-comp");
    if (comp) {
      const own = () => [...document.querySelectorAll(".comp-link")].find(a => !bar.contains(a));
      const sync = () => { const o = own(); if (!o) return; comp.hidden = false; const t = o.querySelector(".new-tag"); comp.querySelector(".new-tag").hidden = !t || t.hidden };
      comp.onclick = e => { e.preventDefault(); const o = own(); if (o) o.click(); setTimeout(sync, 300) };
      sync();[400, 1500].forEach(ms => setTimeout(sync, ms));
    }
    // "← All drills" is the bar's job now; a back link that goes somewhere else (back to the chapters, back to the board) stays
    const back = document.querySelector("a.back");
    if (back) { const tidy = () => root.classList.toggle("cb-noback", /All drills/i.test(back.textContent)); tidy(); new MutationObserver(tidy).observe(back, { childList: true, characterData: true, subtree: true }) }
  }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
})();

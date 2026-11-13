// The Syllabus page of a class: draws window.SYLLABUS (the class's syllabus/data.js) into #view.
//   { course, title, term, professor, school, pdf, facts: [[label, value]], grading: [[label, percent, note]],
//     dates: [[ISO date, label, kind]], weeks: [[week label, [[ISO date or "", text, note]]]], notes: [text] }
// A class without a data.js gets a plain "not added yet" message. Dates in the past are dimmed and the next one is marked.
(() => {
  const S = window.SYLLABUS, $ = id => document.getElementById(id), view = $("view");
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const C = window.COURSE || {};
  if (!S) { view.innerHTML = `<div class="sy-card sy-empty"><b>The syllabus for ${esc(C.name || "this class")} hasn't been added yet.</b>When it is, you'll find the grading, the key dates, the week-by-week schedule and the original document here.</div>`; return }
  const day = iso => new Date(iso + "T12:00:00"), today = new Date(); today.setHours(0, 0, 0, 0);
  const fmt = (iso, long) => day(iso).toLocaleDateString("en-US", long ? { weekday: "short", month: "short", day: "numeric" } : { month: "short", day: "numeric" });
  const past = iso => day(iso) < today;
  const until = iso => { const n = Math.round((day(iso) - today) / 864e5); return n <= 0 ? "today" : n === 1 ? "tomorrow" : "in " + n + " days" };
  const next = (S.dates || []).find(d => !past(d[0]));
  $("sub").textContent = [S.course + ": " + S.title, S.professor, S.school, S.term].filter(Boolean).join(" · ");
  let h = "";
  if (S.pdf) h += `<a class="sy-card sy-pdf" href="${esc(S.pdf)}" target="_blank" rel="noopener"><span class="ic" aria-hidden="true">PDF</span><span><b>The original syllabus</b><small>${esc(S.professor ? "As written by " + S.professor + ". " : "")}Contact details, policies and anything not summarized below are in this document.</small></span><span class="go">Open</span></a>`;
  if (next) h += `<div class="sy-card sy-next"><span class="k">Coming up</span><b>${esc(next[1])}</b><span>${esc(fmt(next[0], true))} · ${esc(until(next[0]))}</span></div>`;
  if (S.facts && S.facts.length) h += `<section class="sy-card"><h2>At a glance</h2><dl class="sy-facts">${S.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl></section>`;
  if (S.grading && S.grading.length) h += `<section class="sy-card"><h2>Grading</h2>${S.grading.map(([l, p, n]) => `<div class="sy-grade"><div><b>${esc(l)}</b>${n ? `<small>${esc(n)}</small>` : ""}</div><span>${p}%</span><i aria-hidden="true"><u style="width:${p}%"></u></i></div>`).join("")}</section>`;
  if (S.dates && S.dates.length) h += `<section class="sy-card"><h2>Key dates</h2><ul class="sy-dates">${S.dates.map(d => `<li class="${past(d[0]) ? "past" : ""}${d === next ? " next" : ""}"><time datetime="${d[0]}">${esc(fmt(d[0], true))}</time><span>${esc(d[1])}${d[2] ? `<em class="t-${esc(d[2])}">${esc(d[2])}</em>` : ""}</span>${d === next ? `<b>Next</b>` : ""}</li>`).join("")}</ul></section>`;
  if (S.weeks && S.weeks.length) h += `<section class="sy-card"><h2>Schedule</h2><p class="sy-note">Subject to change. Check with your professor if anything here differs from what was announced in class.</p>${S.weeks.map(([w, rows]) => {
    const dated = rows.filter(r => r[0]), done = dated.length && dated.every(r => past(r[0]));
    return `<div class="sy-week${done ? " past" : ""}"><h3>${esc(w)}</h3>${rows.map(([iso, text, note]) => `<div class="sy-row${/no class/i.test(text) ? " off" : ""}"><time${iso ? ` datetime="${iso}"` : ""}>${iso ? esc(fmt(iso)) : ""}</time><span>${esc(text)}${note ? `<small>${esc(note)}</small>` : ""}</span></div>`).join("")}</div>` }).join("")}</section>`;
  if (S.notes && S.notes.length) h += `<section class="sy-card"><h2>Good to know</h2><ul class="sy-notes">${S.notes.map(n => `<li>${esc(n)}</li>`).join("")}</ul></section>`;
  view.innerHTML = h;
})();

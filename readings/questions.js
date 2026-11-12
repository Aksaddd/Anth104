// ANTH 104 · Readings drill
// ---------------------------------------------------------------
// The readings rows live in ../drill/shared.js (the main drill uses the same rows).
// This file only groups them into one tab per assigned article, in syllabus order,
// and keeps a separate progress history (a104-readings-v1).
// ---------------------------------------------------------------
const { RD, ARTICLES } = window.BIO, FIG2 = window.BIO.FIG;

// One subject tab per article; a row belongs to the article whose author starts its tag ("Perley · Zombie Linguistics")
const SECTIONS = ARTICLES.map(a => ({ name: `${a.author}: ${a.title}`, short: a.author, sub: `Week ${a.week} · ${a.sub}`, author: a.author }));
const sectionOf = tag => SECTIONS.find(s => tag.startsWith(s.author + " ·")) || SECTIONS[0];

const DECKS = { RD: { name: "Readings", sub: "Every question on the assigned readings.", src: "Practice, from the assigned readings" } };
const Q = {}, IDS = { RD: [] };
RD.forEach((r, n) => {
  const id = "RD" + n;
  const f = r[5] && FIG2[r[5]] ? ["../drill/" + FIG2[r[5]][0], FIG2[r[5]][1]] : null;   // figures live in drill/img/
  Q[id] = { d: "RD", tag: r[0], q: r[1], ok: r[2], wrong: r[3], ex: r[4] || "", img: f, topic: sectionOf(r[0]).name };
  IDS.RD.push(id);
});

window.BANK = {
  mastery: true, title: "Readings Drill", storageKey: "a104-readings-v1", decks: DECKS, ids: IDS, q: Q, textOnly: false,
  topics: SECTIONS.map(({ name, short, sub }) => ({ name, short, sub })),
  promo: { illu: "key", eyebrow: "Answer key", title: "See every answer at once", text: "All the readings questions on one page, article by article. Answers stay hidden until you reveal them, so you can quiz yourself or print it.", href: "key.html", label: "Open the answer key" }
};

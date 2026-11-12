// Bi 239 · Homework 3 drill
// ---------------------------------------------------------------
// The HW 3 rows live in ../drill/shared.js (the main drill uses the same rows).
// This file only groups them into tabs by the homework's own sections and
// keeps a separate progress history (bio-hw3-v1), like anthro's Classification drill.
// ---------------------------------------------------------------
const { HW } = window.BIO, FIG2 = window.BIO.FIG;

// Subject tabs follow the homework's order (question numbers in brackets)
const SECTIONS = [
  { name: "Plants colonize land", short: "Land plants", from: 1, to: 7, sub: "HW Q1–7 · Ch 29: charophytes, life on land, bryophytes, seedless vascular plants and their life cycles." },
  { name: "Seed plants", short: "Seed plants", from: 8, to: 14, sub: "HW Q8–14 · Ch 30: pollen, heterospory, gymnosperms vs. angiosperms, seeds, flowers, fruits, monocots vs. eudicots." },
  { name: "Signals & hormones", short: "Signals & hormones", from: 15, to: 23, sub: "HW Q15–23 · Ch 39: etiolation, signal transduction, phototropism, the acid growth hypothesis, and every hormone." },
  { name: "Light, stress & defense", short: "Light & defense", from: 24, to: 28, sub: "HW Q24–28 · Ch 39: phytochrome, photoperiod, circadian rhythms, abiotic stress, and defenses against pathogens." },
  { name: "Fungi", short: "Fungi", from: 36, to: 44, sub: "HW Q36–44 · Ch 31: lichens, why fungi matter, hyphae and mycelium, nutrition, life cycles, and the fungal groups." }
];
const sectionOf = n => SECTIONS.find(s => n >= s.from && n <= s.to);

const DECKS = { HW: { name: "HW 3", sub: "Every Homework 3 question as multiple choice.", src: "Homework 3 (professor's questions, answers written from the slides)" } };
const Q = {}, IDS = { HW: [] };
HW.forEach((r, n) => {
  const id = "HW" + n, num = +(r[0].match(/Q(\d+)/) || [0, 0])[1];
  const f = r[5] && FIG2[r[5]] ? ["../drill/" + FIG2[r[5]][0], FIG2[r[5]][1]] : null;   // figures live in drill/img/
  Q[id] = { d: "HW", tag: r[0], q: r[1], ok: r[2], wrong: r[3], ex: r[4] || "", img: f, topic: (sectionOf(num) || SECTIONS[0]).name };
  IDS.HW.push(id);
});

window.BANK = {
  mastery: true, title: "HW 3 Multiple-Choice Drill", storageKey: "bio-hw3-v1", decks: DECKS, ids: IDS, q: Q, textOnly: false,
  topics: SECTIONS.map(({ name, short, sub }) => ({ name, short, sub })),
  promo: { illu: "key", eyebrow: "Answer key", title: "See every answer at once", text: "All of HW 3 on one page, in homework order. Answers stay hidden until you reveal them, so you can quiz yourself or print it.", href: "key.html", label: "Open the answer key" }
};

// ANTH 104 Drills · XP value system
// Rates how difficult a question is, turns that into XP, and applies win-streak multipliers.
// Pure functions, no page dependencies (also runs in Node for calibration).
//
// Difficulty score = points for what makes a question hard, plus points from the student's own history:
//   Source            assigned reading +1 · Anthro-pardy: $100 0, $200 1, $300 2, $400 4, $500 6
//   Wording           EXCEPT / NOT / INCORRECTLY +2 · put steps in order +2 · several numbered statements +1 · several blanks +1
//   Reasoning         read an experiment or data +1 · interpret a figure +1
//   Thinking          compare two things +1 · explain why or how +1
//   Answer choices    five or more +1 · long, similar answers (avg > 55 chars) +1 · "All of the above" +1
//   Length            long question (> 220 chars) +1
//   Your history      missed it last time +1 · usually miss it (< 50% after 2+ tries) +1
// Tier from score:    0–1 Easy 10 XP · 2–3 Medium 20 XP · 4–5 Hard 35 XP · 6+ Expert 50 XP
// Repeats:            a question already answered right 3+ times earns half XP (keeps evolution honest)
// Word roots:         recall = Easy · a root you missed before = Medium
// Streak multiplier:  3 in a row ×1.25 · 5 ×1.5 · 10 ×2 · 15 ×2.5 · 25 ×3   (a wrong answer resets it; XP is never taken away)
(function (root) {
  const TIERS = [
    { key: "easy", name: "Easy", xp: 10 },
    { key: "medium", name: "Medium", xp: 20 },
    { key: "hard", name: "Hard", xp: 35 },
    { key: "expert", name: "Expert", xp: 50 }
  ];
  const STREAKS = [[25, 3], [15, 2.5], [10, 2], [5, 1.5], [3, 1.25], [0, 1]];
  const PARDY = { 100: 0, 200: 1, 300: 2, 400: 4, 500: 6 };
  const strip = s => String(s == null ? "" : s).replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").trim();
  const tierOf = sc => TIERS[sc >= 6 ? 3 : sc >= 4 ? 2 : sc >= 2 ? 1 : 0];

  // d: { kind: "drill", q, prev: [attempts, correct], prevHist } | { kind: "board", val, img } | { kind: "root", missed }
  function rate(d) {
    const why = []; let sc = 0;
    const add = (n, label) => { sc += n; why.push(label) };
    if (d.kind === "drill" && d.q) {
      const q = d.q, text = strip(q.q), opts = [q.ok, ...(q.wrong || [])].map(strip);
      if (q.d === "AP" && q.val) add(PARDY[q.val] != null ? PARDY[q.val] : 1, `$${q.val} Anthro-pardy clue`);
      else {
        if (q.d === "RD") add(1, "Detail from an assigned reading");
        if (/\bexcept\b|\bNOT\b|\bINCORRECTLY\b|\bnot considered\b|\bnot correctly\b/.test(text)) add(2, "Watch the negative (EXCEPT / NOT)");
        if (/correct sequence|correct order|which correctly lists|in the order/i.test(text) || opts.every(o => /^[\d,\s]+$/.test(o))) add(2, "Put the steps in order");
        else if (/\(1\)[\s\S]*\(2\)/.test(text)) add(1, "Several statements to weigh");
        if ((text.match(/_{3,}/g) || []).length >= 2) add(1, "Several blanks to fill");
        if (/\bgraph|\bexperiment|microcosm|\bresearchers\b|\bdata\b/i.test(text)) add(1, "Read an experiment");
        if (/\bdiffer|\bcompare|\bdifference|\bvs\.?\b|\bversus\b|\beach\b|\bboth\b|\brespectively\b/i.test(text)) add(1, "Compare two things");
        if (/^(why|how)\b|\bwhy\b|\bhow does\b|\bhow do\b|\bwhat causes\b|\bexplain|\badvantage\b/i.test(text)) add(1, "Explain why or how");
        if (opts.length >= 5) add(1, "Five answer choices");
        if (opts.reduce((n, o) => n + o.length, 0) / opts.length > 55) add(1, "Long, similar answers");
        if (opts.some(o => /^all of the above\.?$/i.test(o))) add(1, "“All of the above” is an option");
        if (text.length > 220) add(1, "Long question");
      }
      if (q.img) add(1, "Figure to interpret");
      const [a = 0, c = 0] = d.prev || [];
      if (a > 0 && d.prevHist === 0) add(1, "You missed it last time");
      else if (a >= 2 && c / a < .5) add(1, "You usually miss this one");
    } else if (d.kind === "board") {
      add(PARDY[d.val] != null ? PARDY[d.val] : 1, `$${d.val} Anthro-pardy clue`);
      if (d.img) add(1, "Figure to interpret");
    } else if (d.kind === "root") {
      if (d.missed) add(2, "A root you missed before"); else why.push("Word-root recall");
    }
    const tier = tierOf(sc);
    const repeat = d.kind === "drill" && (d.prev || [0, 0])[1] >= 3;
    const xp = repeat ? Math.round(tier.xp / 2) : tier.xp;
    if (repeat) why.push("Already right 3+ times: half XP");
    return { tier, score: sc, xp, why, repeat };
  }
  const multiplier = streak => (STREAKS.find(([n]) => (streak | 0) >= n) || STREAKS[STREAKS.length - 1])[1];
  const nextStreak = streak => { const up = STREAKS.slice().reverse().find(([n]) => n > streak); return up ? { at: up[0], mult: up[1] } : null };

  root.BioXP = { rate, multiplier, nextStreak, TIERS, STREAKS };
  if (typeof module !== "undefined") module.exports = root.BioXP;
})(typeof window !== "undefined" ? window : globalThis);

// Shared engine · Study buddy (one household of cats across every course)
// Dexter, an original blonde kitten in an anime/chibi style, who grows up as the student answers correctly.
// Every correct answer (main drill, Readings drill, Word Roots, Anthro-pardy, Read & Learn) earns XP based on how difficult the
// question is (assets/xp.js), multiplied by the current win streak. Levels and evolutions follow total XP.
// Wrong answers reset the streak but never take XP away. Saved on this device only ("a104-dexter-v1"). Dexter inherits the XP already earned with the earlier sea-turtle buddy ("a104-buddy-v1").
// Pages announce answers with: window.dispatchEvent(new CustomEvent("bio:correct", { detail })) and "bio:wrong".
// detail describes the question for the difficulty rating: { kind: "drill", q, prev, prevHist } | { kind: "board", val } | { kind: "root", missed }
// All artwork below is drawn here as SVG.
(() => {
  const KEY = "a104-dexter-v1", OFF_KEY = "a104-buddy-off", TURTLE_KEY = "a104-buddy-v1";
  // Dexter: an original blonde kitten (anime/chibi style) who grows up as the student answers correctly.
  // Six forms at the same XP thresholds as before. Each form's card fact ties Dexter to this course: language, culture and society.
  const STAGES = [
    { at: 0, name: "Freshman Dexter", form: "Tiny kitten", color: "#e2aa4a",
      fact: "Kittens learn to meow the way babies learn to talk: by being socialized into it. Mother cats rarely meow at each other; kittens learn that meowing works on humans. Language socialization (Ochs and Schieffelin) says learning to talk and becoming a member of a group are one process." },
    { at: 100, name: "Sophomore Dexter", form: "Curious sophomore", color: "#26365e",
      fact: "\"Meow\" is an icon in Peirce's sense: a word that resembles what it stands for. Other languages hear cats differently: Japanese \"nyā,\" Korean \"yaong,\" French \"miaou.\" Even onomatopoeia mixes resemblance with convention." },
    { at: 350, name: "Junior Dexter", form: "Playful junior", color: "#4f8dff",
      fact: "Dexter's slow blink, tail held high and head-bonk are multimodal communication: meaning made through the body, not words. In McNeill's terms, a raised tail works like an emblem, a gesture with a conventional meaning." },
    { at: 900, name: "Senior Dexter", form: "Determined senior", color: "#c0392b",
      fact: "When Dexter purrs at you, it's mostly Jakobson's phatic function: keeping the channel of contact open, like \"How are you?\" / \"Fine.\" Not every message is about information." },
    { at: 1800, name: "Grad Student Dexter", form: "Grad student in the lab", color: "#3fa5e8",
      fact: "Grad Student Dexter is doing fieldwork: months of participant observation in the Cat Café, copious fieldnotes, and a matched guise test of meows. He knows interviews aren't windows to \"the facts\" (Briggs): the interviewer shapes the talk." },
    { at: 3200, name: "Professor Dexter", form: "Professor", color: "#2d2f3a",
      fact: "Professor Dexter's big lecture: language is never a neutral medium. \"The word in language is half someone else's\" (Bakhtin), and every way of speaking points to who we are and where we stand." }
  ];
  // a course can give Dexter its own fact for each form (course.js: COURSE.facts)
  if (window.COURSE && window.COURSE.facts) STAGES.forEach((s, n) => { if (window.COURSE.facts[n]) s.fact = window.COURSE.facts[n] });

  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // State: pts = total XP · correct = right answers · streak / best = answers right in a row · last = time of last answer
  const OLD_AT = [0, 5, 15, 35, 70, 120];   // v1 evolved by number of right answers
  const STREAK_TTL = 3 * 60 * 60 * 1000;    // a streak cools off after 3 hours away
  function load() {
    let s = {}; try { s = JSON.parse(localStorage.getItem(KEY) || "{}") || {} } catch (e) { }
    if (s.v === undefined && s.xp === undefined) {   // first visit with Dexter: inherit the sea turtle's XP (not its name)
      try { const t = JSON.parse(localStorage.getItem(TURTLE_KEY) || "null"); if (t && t.v === 2) s = { v: 2, pts: t.pts | 0, correct: t.correct | 0, streak: 0, best: t.best | 0, last: 0, nick: "" } } catch (e) { }
    }
    if (s.v !== 2) {   // migrate v1 (xp = count of right answers) without ever moving the buddy back a form
      const n = s.xp | 0; let k = 0; OLD_AT.forEach((t, i) => { if (n >= t) k = i });
      s = { v: 2, pts: Math.max(n * 20, STAGES[k].at), correct: n, streak: 0, best: 0, last: 0, nick: s.nick || "" };
    }
    if (s.streak && Date.now() - (s.last || 0) > STREAK_TTL) s.streak = 0;
    // Gold wallet + wardrobe. First time: a 50-gold welcome gift plus gold for the XP already earned (about 1 gold per 4 XP).
    if (s.gold === undefined) s.gold = 50 + Math.round((s.pts | 0) * .24);
    s.weight = Math.min(1.5, Math.max(.75, +s.weight || 1));
    s.owned = Array.isArray(s.owned) ? s.owned : [];
    s.collar = typeof s.collar === "string" ? s.collar : "navy"; s.equip = s.equip && typeof s.equip === "object" ? s.equip : {};
    if (!Array.isArray(s.equip.badges)) { s.equip.badges = s.equip.badge && s.equip.badge !== "none" ? [s.equip.badge] : [] } delete s.equip.badge;
    return s;
  }
  const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { } };
  // ===== The household: several cats, one in training. The cat in training lives in KEY (so everything above works
  // unchanged); the others wait in CATS_KEY. Gold and owned items (wardrobe, badges) belong to the household and stay put
  // when you switch; each cat keeps its own XP, level, name, breed, outfit, collar and weight.
  const CATS_KEY = KEY.replace(/-v1$/, "") + "-cats-v1", MAX_CATS = 6, MAX_ALONG = MAX_CATS - 1;   // every cat can be on screen at once
  const CAT_FIELDS = ["pts", "correct", "streak", "best", "last", "nick", "equip", "collar", "weight", "breed", "color", "born"];
  const pickCat = s => Object.fromEntries(CAT_FIELDS.filter(f => s[f] !== undefined).map(f => [f, s[f]]));
  function household() {
    let H = null; try { H = JSON.parse(localStorage.getItem(CATS_KEY) || "null") } catch (e) { }
    if (!H || !H.cats || !H.active) { const s = load(); H = { active: "c1", cats: { c1: Object.assign(pickCat(s), { breed: s.breed || "domestic", color: s.color || "golden", nick: s.nick || "" }) }, along: [] } }
    H.along = (H.along || []).filter(id => H.cats[id] && id !== H.active).slice(0, MAX_ALONG);
    H.co = (H.co || []).filter(id => H.along.includes(id));   // co-trainees: on-screen cats that share the XP
    H.alumni = H.alumni || {};   // cats returned to the café: they keep their XP, outfits and name, and can come home again
    return H;
  }
  const saveHouse = H => { try { localStorage.setItem(CATS_KEY, JSON.stringify(H)) } catch (e) { } };
  // Primates belong to ANTH 102. Outside that class they are not listed, shown or trained; cats and primates each have
  // their own limit of MAX_CATS.
  const IN_A102 = !!(window.COURSE && window.COURSE.id === "a102");
  const kindCount = (H, prim) => Object.values(H.cats).filter(c => isPrimate(c.breed) === !!prim).length;
  function catList() {   // every cat, the one in training with its live state
    const H = household(), s = load();
    H.cats[H.active] = Object.assign({}, H.cats[H.active], pickCat(s));
    return { H, list: Object.entries(H.cats).filter(([, c]) => IN_A102 || !isPrimate(c.breed)).map(([id, c]) => Object.assign({ id, active: id === H.active, along: H.along.includes(id), co: H.co.includes(id) }, c)) };
  }
  function trainCat(id) {
    const H = household(); if (!H.cats[id] || id === H.active) return;
    const s = load(); H.cats[H.active] = pickCat(s);
    const c = Object.assign({ pts: 0, correct: 0, streak: 0, best: 0, last: 0, nick: "", equip: { badges: [] }, collar: "navy", weight: 1, breed: "domestic", color: "golden" }, H.cats[id]);
    CAT_FIELDS.forEach(f => { s[f] = c[f] }); delete s.badge;
    const wasCo = H.co.includes(id);
    H.along = H.along.filter(x => x !== id); H.co = H.co.filter(x => x !== id);
    if (!H.along.includes(H.active)) H.along.push(H.active);   // the old trainee comes along
    if (wasCo) H.co.push(H.active);                            // swapping within a co-training group keeps the group
    H.active = id; save(s); saveHouse(H);
  }
  // Return a cat to the café (frees a spot at home). The cat in training can't go: train another cat first.
  function returnCat(id) {
    const H = household(); if (!H.cats[id] || id === H.active) return false;
    H.alumni[id] = Object.assign({}, H.cats[id], { returnedAt: Date.now() }); delete H.cats[id];
    H.along = H.along.filter(x => x !== id); H.co = H.co.filter(x => x !== id); if (H.spots) delete H.spots[id];
    saveHouse(H); return true;
  }
  function welcomeBack(id) {   // a returned cat comes home with all its progress
    const H = household(); if (!H.alumni[id] || kindCount(H, isPrimate(H.alumni[id].breed)) >= MAX_CATS) return null;
    H.cats[id] = H.alumni[id]; delete H.cats[id].returnedAt; delete H.alumni[id];
    if (H.along.length < MAX_ALONG) H.along.push(id);
    saveHouse(H); return id;
  }
  function adoptCat(breed, nick, color) {
    const H = household(); if (kindCount(H, isPrimate(breed)) >= MAX_CATS) return null;
    const id = "c" + Date.now().toString(36);
    H.cats[id] = { pts: 0, correct: 0, streak: 0, best: 0, last: 0, nick, equip: { badges: [] }, collar: "navy", weight: 1, breed, color, born: Date.now() };
    if (H.along.length < MAX_ALONG) H.along.push(id);
    saveHouse(H); return id;
  }
  const off = () => { try { return localStorage.getItem(OFF_KEY) === "1" } catch (e) { return false } };
  const stageOf = pts => { let k = 0; STAGES.forEach((s, i) => { if (pts >= s.at) k = i }); return k };
  const nextAt = k => STAGES[k + 1] ? STAGES[k + 1].at : null;
  // Levels 1–100. Reaching level L takes A·(L−1)^1.5 XP, with Level 100 at 20,000 XP: quick early levels,
  // a long climb at the top. Forms land at Lv 3 (Sophomore Dexter), 7, 13, 20 and 30 (Professor Dexter); 30–100 is mastery.
  const MAX_LV = 100, MAX_XP = 20000, LV_A = MAX_XP / Math.pow(MAX_LV - 1, 1.5);
  const lvXP = L => L <= 1 ? 0 : Math.ceil(LV_A * Math.pow(L - 1, 1.5));
  function level(pts) {
    let L = Math.min(MAX_LV, Math.floor(1 + Math.pow(Math.max(0, pts) / LV_A, 2 / 3) + 1e-9));
    while (L < MAX_LV && pts >= lvXP(L + 1)) L++;
    while (L > 1 && pts < lvXP(L)) L--;
    return L;
  }
  const XP = () => window.BioXP;
  const fmt = n => Math.round(n).toLocaleString("en-US");

  // ===== Artwork (viewBox 0 0 120 120): Dexter, an original blonde kitten drawn in an anime/chibi style.
  // Design rules: front-facing chibi proportions (big head, small body), golden-blonde fur with a spiky blonde fringe,
  // big glossy eyes with two highlights, pink blush with hatch marks, an "ω" mouth, thick clean outlines and
  // flat cel shading. He goes from a sleepy freshman to a professor, gaining one piece of gear per form.
  const OL = "#3a2a1e", OW = 2.4;
  // fur colors are set per drawing from the cat's breed (see BREEDS); these are the golden defaults
  let FUR = "#f7d27c", FUR_D = "#e2aa4a", FUR_L = "#fff0c2", PINK = "#e8a08a", PINK_D = "#c9705a";
  let IRIS = ["#9a6a24", "#b98a35", "#7d9a3c", "#3f8a45", "#2a6436"];
  // ===== Breeds: the same chibi cat in different coats. Each has fur colors, eyes and its own markings
  // (head markings sit under the eyes; body markings go on the sitting body). Names are the breed, not the cat.
  const EYES_GOLD = IRIS.slice(), EYES_BLUE = ["#bfe6ff", "#8fd0ff", "#4fa8f0", "#2f7fd0", "#1d5aa8"], EYES_AMBER = ["#fff1a8", "#ffd34d", "#f2a900", "#c97c00", "#8a5200"], EYES_GREEN = ["#d9f99d", "#a3e635", "#65a30d", "#3f7a12", "#2a5a0c"];
  const tabbyHead = c => `<path d="M31.5 63 l6 1 M31.8 67.4 l5.6 0 M88.5 63 l-6 1 M88.2 67.4 l-5.6 0" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><path d="M47.5 47.6 l2.2 -3.4 M60 46.4 v-3.8 M72.5 47.6 l-2.2 -3.4" stroke="${c}" stroke-width="1.9" stroke-linecap="round"/>`;
  const tabbyBody = c => (w, hx) => `<path d="M${(60 - hx - 7 * w).toFixed(1)} 95 q4 -2.6 8 0 M${(60 - hx - 6 * w).toFixed(1)} 100 q4 -2.6 8 0 M${(60 + hx - 1 * w).toFixed(1)} 95 q4 -2.6 8 0 M${(60 + hx - 2 * w).toFixed(1)} 100 q4 -2.6 8 0" stroke="${c}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  // Markings, parameterized by color
  const tuxHead = c => `<path d="M51 68 Q50 61.6 60 61.6 Q70 61.6 69 68 Q69 77.6 60 77.6 Q51 77.6 51 68Z" fill="${c}"/><path d="M60 40 L56.6 52 Q60 55 63.4 52Z" fill="${c}"/>`;
  const pointsHead = c => `<path d="M36.5 15 L43.5 21.5 L41.5 25 L38 27Z M83.5 15 L84 26.5 L77 23Z" fill="${c}"/><ellipse cx="60" cy="70" rx="12.5" ry="9" fill="${c}" opacity=".85"/>`;
  const calicoHead = (a, b) => `<path d="M31 62 Q34 54 44 55 Q46 62 41 70 Q35 72 31.6 69Z" fill="${a}"/><path d="M76 49 Q84 46 87.6 55 Q88 62 82 63 Q76 60 76 49Z" fill="${b}"/>`;
  const calicoBody = (a, b) => (w, hx) => `<ellipse cx="${(60 - hx).toFixed(1)}" cy="98" rx="${(6.5 * w).toFixed(1)}" ry="5.5" fill="${a}"/><ellipse cx="${(60 + hx + 1).toFixed(1)}" cy="101" rx="${(5.5 * w).toFixed(1)}" ry="4.6" fill="${b}"/>`;
  const gloss = `<path d="M44 44 Q50 38.6 58 38.8" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".35"/>`;
  // ===== Breeds. Each breed has its own build (shape) and several coat colors.
  //   shape: ex/ey = ear width/height · hx/hy = head width/height · tail = tail thickness · wb = body build (× weight)
  //          ruff = fluffy mane under the chin · tufts = lynx tips on the ears · fluff = fluffy chest and haunches · sleek = glossy coat
  //   colors: { key: { name, fur: [base, shade, light], pink: [inner ear, nose], eyes, pat: color(s) for the markings } }
  const BREEDS = {
    domestic: { name: "Domestic Shorthair", desc: "Dexter's own breed: sturdy, friendly and up for anything", shape: {}, names: ["Dexter", "Sunny", "Honey", "Biscuit"],
      colors: { golden: { name: "Golden", fur: ["#f7d27c", "#e2aa4a", "#fff0c2"], pink: ["#e8a08a", "#c9705a"], eyes: EYES_GOLD },
        cream: { name: "Cream", fur: ["#f6e2c4", "#e0c39a", "#fffaf0"], pink: ["#efa9a0", "#c97a70"], eyes: EYES_AMBER },
        gray: { name: "Gray", fur: ["#b9bec8", "#8f96a3", "#e9ebf0"], pink: ["#e6a0aa", "#b5707e"], eyes: EYES_GREEN },
        chocolate: { name: "Chocolate", fur: ["#9a6a46", "#7a4f31", "#c99f7d"], pink: ["#e3a090", "#a8624f"], eyes: EYES_AMBER } } },
    tabby: { name: "Tabby", desc: "Classic stripes, an M on the forehead and a big appetite", shape: { ey: 1.04 }, names: ["Mango", "Pumpkin", "Tiger", "Cheeto"], pattern: "tabby",
      colors: { orange: { name: "Orange", fur: ["#f6a85e", "#d9772f", "#ffe4c7"], pink: ["#f29a8c", "#c9705a"], eyes: EYES_GOLD, pat: "#c2621d" },
        silver: { name: "Silver", fur: ["#cdd1d9", "#9aa0ab", "#f3f4f7"], pink: ["#eaa3ad", "#c9707a"], eyes: EYES_GREEN, pat: "#6f7581" },
        brown: { name: "Brown", fur: ["#b98c5e", "#8d6440", "#e6cfb2"], pink: ["#e3a090", "#a8624f"], eyes: EYES_GREEN, pat: "#5b3d22" },
        cream: { name: "Cream", fur: ["#f3dcb8", "#dfbf92", "#fff8ec"], pink: ["#efa9a0", "#c97a70"], eyes: EYES_AMBER, pat: "#c99c63" } } },
    tuxedo: { name: "Tuxedo", desc: "Always dressed up: a white bib, socks and a white muzzle", shape: {}, names: ["Oreo", "Domino", "Bandit", "Tux"], pattern: "tux",
      colors: { black: { name: "Black & white", fur: ["#35343c", "#25242a", "#f7f7f9"], pink: ["#e8a0aa", "#b56b78"], eyes: EYES_GREEN, pat: "#f7f7f9" },
        gray: { name: "Gray & white", fur: ["#8a909c", "#6b717d", "#f7f7f9"], pink: ["#e8a0aa", "#b56b78"], eyes: EYES_AMBER, pat: "#f7f7f9" },
        orange: { name: "Orange & white", fur: ["#f2a35a", "#d27a35", "#fffaf2"], pink: ["#f2a3a0", "#c9705a"], eyes: EYES_GOLD, pat: "#fffaf2" } } },
    bombay: { name: "Bombay", desc: "A sleek, glossy mini panther with copper eyes", shape: { ex: .96, sleek: true, wb: .94 }, names: ["Shadow", "Midnight", "Salem", "Onyx"],
      colors: { black: { name: "Black", fur: ["#2f2e36", "#1f1e24", "#55545f"], pink: ["#c48a9a", "#9c5f70"], eyes: EYES_AMBER },
        smoke: { name: "Smoke", fur: ["#55545e", "#3d3c44", "#9a99a6"], pink: ["#c48a9a", "#9c5f70"], eyes: EYES_AMBER } } },
    siamese: { name: "Siamese", desc: "Slender and chatty, with a wedge face, big ears and sapphire eyes", shape: { ex: 1.14, ey: 1.3, hx: .92, hy: 1.04, tail: 4.2, wb: .84 }, names: ["Miso", "Cleo", "Sapphire", "Mochi"], pattern: "points",
      colors: { seal: { name: "Seal point", fur: ["#f4e8d4", "#d8c09c", "#fffaf0"], pink: ["#e9a99a", "#8a5a48"], eyes: EYES_BLUE, pat: "#5a4334" },
        chocolate: { name: "Chocolate point", fur: ["#f7eddc", "#e2cdab", "#fffbf3"], pink: ["#ecb0a0", "#9a6a52"], eyes: EYES_BLUE, pat: "#8a6044" },
        blue: { name: "Blue point", fur: ["#eef0f4", "#cfd5df", "#ffffff"], pink: ["#e8b0bc", "#8f7f9a"], eyes: EYES_BLUE, pat: "#6f7c93" },
        lilac: { name: "Lilac point", fur: ["#f5f0f3", "#ddd2da", "#ffffff"], pink: ["#efb6c4", "#a58698"], eyes: EYES_BLUE, pat: "#a8949f" } } },
    calico: { name: "Calico", desc: "A patchwork of three colors and plenty of personality", shape: {}, names: ["Patches", "Maple", "Clover", "Pebble"], pattern: "calico",
      colors: { classic: { name: "Classic", fur: ["#fbf6ec", "#e6dccb", "#ffffff"], pink: ["#f2a9b0", "#c9707a"], eyes: EYES_GOLD, pat: ["#f2a04a", "#3a3640"] },
        dilute: { name: "Dilute (pastel)", fur: ["#fbf7f1", "#e7ded2", "#ffffff"], pink: ["#f2b3b8", "#c98088"], eyes: EYES_GREEN, pat: ["#f2c99a", "#8f95a8"] } } },
    russian: { name: "Russian Blue", desc: "Plush silver-blue coat, emerald eyes and a little smile", shape: { ex: 1.08, ey: 1.12, hx: .96, wb: .9 }, names: ["Blue", "Storm", "Velvet", "Misty"],
      colors: { blue: { name: "Blue", fur: ["#929fb5", "#717d93", "#c9d2df"], pink: ["#d79aa6", "#a7697a"], eyes: EYES_GREEN },
        silver: { name: "Silver blue", fur: ["#b3bdcd", "#8e99ab", "#e3e8ef"], pink: ["#dca3ae", "#a7697a"], eyes: EYES_GREEN } } },
    persian: { name: "Persian", desc: "A round flat face, tiny ears and a cloud of fluff", shape: { ex: .84, ey: .62, hx: 1.07, hy: .97, tail: 9.4, wb: 1.18, ruff: true, fluff: true }, names: ["Snowball", "Cotton", "Marshmallow", "Pearl"],
      colors: { white: { name: "White", fur: ["#fbfbfd", "#e1e5ee", "#ffffff"], pink: ["#f6b3bf", "#d97f90"], eyes: EYES_BLUE },
        cream: { name: "Cream", fur: ["#f6e6cc", "#e3cba5", "#fffaf0"], pink: ["#f2b0aa", "#c97a70"], eyes: EYES_AMBER },
        silver: { name: "Chinchilla silver", fur: ["#e6e9ef", "#bfc5d0", "#ffffff"], pink: ["#efb0bc", "#c47c8c"], eyes: EYES_GREEN },
        black: { name: "Black", fur: ["#36353d", "#24232a", "#5c5b68"], pink: ["#c48a9a", "#9c5f70"], eyes: EYES_AMBER } } },
    mainecoon: { name: "Maine Coon", desc: "A gentle giant with lynx ear tufts, a lion's ruff and a huge bushy tail", shape: { ex: 1.06, ey: 1.16, tail: 10, wb: 1.14, ruff: true, tufts: true, fluff: true }, names: ["Bear", "Moose", "Atlas", "Willow"], pattern: "tabby",
      colors: { brown: { name: "Brown tabby", fur: ["#a87a4f", "#7d5733", "#e4cba9"], pink: ["#e3a090", "#a8624f"], eyes: EYES_GOLD, pat: "#4f331c" },
        red: { name: "Red", fur: ["#e59a5a", "#c27136", "#ffe0bf"], pink: ["#f29a8c", "#c9705a"], eyes: EYES_AMBER, pat: "#a95a20" },
        silver: { name: "Silver", fur: ["#c3c8d1", "#959ba7", "#f2f3f6"], pink: ["#eaa3ad", "#c9707a"], eyes: EYES_GREEN, pat: "#5e6470" } } }
  };

  // ===== Primates (the ANTH 102 line). Same chibi body and poses as the cats, with a primate head: round ears on the
  // sides, a bare face, forward-facing eyes, nostrils and no whiskers. In taxonomic order, strepsirrhines to hominins' kin.
  //   shape: primate (draw the primate head) · ear = ear radius · eye = eye size · notail (apes) · rings = tail ring color
  //          patch = dark eye patches · wet = wet nose (strepsirrhines) · mane · brow = brow ridge · flange = cheek pads · tuft = crest of hair
  //          arm / leg = limb length · slope = how much higher the shoulders stand than the hips (knuckle-walkers) · knuckle
  //          upright = stands on two legs ("up": arms raised to balance, the gibbon; "front": crouched clinger, the tarsier)
  //          platy = platyrrhine nose (wide-set nostrils that open sideways; otherwise catarrhine: close together, opening down)
  //          tailStyle = up | curl (prehensile) | short | tuft · callos = sitting pads · snout, muzzle, cheeks, beard, shaggy, pads, claws
  //          size = body size next to the others (tarsier .68 … gorilla 1.26), used in the safari
  //          sun = the lemur's sun-worship sitting posture · held = what it is known for handling (hammer stone and nut, termite
  //          stick, bamboo, sweet potato, insect, fruit to share, leaf umbrella) · sac = throat sac · chin = white beard · whisk = cheek whiskers
  //   colors: face = bare skin color · ring = pale ring of fur around the face · hand = hands and feet · saddle = silver back · cape = pale shoulders
  const EYES_BROWN = ["#f3cf9a", "#c98f45", "#8f5d2a", "#5c3a1a", "#2e1c0c"];
  Object.assign(BREEDS, {
    lemur: { kind: "primate", name: "Ring-tailed Lemur", taxon: "Strepsirrhine · Lemuroidea", desc: "A strepsirrhine from Madagascar: wet nose, tooth comb, grooming claw and a tail with 13 rings", shape: { primate: true, sun: true, size: .86, ear: 7.4, patch: "#2b2a30", wet: true, snout: true, rings: "#2b2a30", tail: 6.4, pointy: true, arm: .9, leg: 1.25, slope: -4, tailStyle: "up" }, names: ["Zoboo", "Maki", "Julien", "Ringo"],
      colors: { gray: { name: "Gray", fur: ["#b9bcc4", "#8e929c", "#f6f6f8"], pink: ["#3a3640", "#2b2a30"], eyes: EYES_AMBER, face: "#f7f7f8" } } },
    tarsier: { kind: "primate", name: "Tarsier", taxon: "Haplorhine · Tarsiiformes", desc: "A tiny haplorhine with eyes bigger than its brain, a dry nose and a head that turns 180°", shape: { primate: true, held: "bug", size: .68, ear: 10.6, eye: 1.3, tail: 2.6, wb: .82, arm: .8, leg: 1.45, upright: "front", foot: 4, pads: true, tailStyle: "tuft" }, names: ["Yoda", "Pip", "Gizmo", "Bean"],
      colors: { tan: { name: "Tan", fur: ["#c9a777", "#a5835a", "#eedfc4"], pink: ["#e6b79a", "#8a5a48"], eyes: EYES_AMBER, face: "#e9d3ae" },
        gray: { name: "Gray", fur: ["#a9a39a", "#857f76", "#e2ddd4"], pink: ["#dcb3a0", "#8a5a48"], eyes: EYES_GOLD, face: "#d8cfc0" } } },
    tamarin: { kind: "primate", name: "Golden Lion Tamarin", taxon: "Platyrrhine · New World monkey", desc: "A New World monkey (platyrrhine): flat nose with nostrils to the sides, a golden mane and claws instead of nails", shape: { primate: true, size: .7, ear: 6, mane: true, tail: 5, wb: .86, platy: true, claws: true, leg: 1.05 }, names: ["Leo", "Mango", "Sol", "Nala"],
      colors: { gold: { name: "Golden", fur: ["#f29a2e", "#d07416", "#ffd08a"], pink: ["#6b5140", "#3f2e24"], eyes: EYES_BROWN, face: "#6b5140" } } },
    capuchin: { kind: "primate", name: "Capuchin", taxon: "Platyrrhine · New World monkey", desc: "A clever New World monkey that cracks nuts with stone tools and holds on with a prehensile tail", shape: { primate: true, held: "nut", size: .84, ear: 7.6, tuft: true, tail: 5.2, platy: true, arm: 1.05, tailStyle: "curl" }, names: ["Marcel", "Coco", "Abu", "Nutmeg"],
      colors: { brown: { name: "Tufted", fur: ["#6b4a33", "#4a3222", "#f1dfc0"], pink: ["#e0b594", "#8a5a48"], eyes: EYES_BROWN, face: "#f0d3b3" },
        white: { name: "White-faced", fur: ["#34303a", "#222027", "#fbf3e2"], pink: ["#eac5a8", "#8a5a48"], eyes: EYES_BROWN, face: "#f6e2c9", ring: "#fbf3e2", cape: "#fbf3e2" } } },
    macaque: { kind: "primate", name: "Macaque", taxon: "Catarrhine · Old World monkey", desc: "An Old World monkey (catarrhine): downward nostrils, bilophodont molars and sitting pads. Snow monkeys bathe in hot springs", shape: { primate: true, held: "potato", size: .96, ear: 7.4, tail: 4.6, wb: 1.08, tailStyle: "short", callos: true, cheeks: true }, names: ["Yuki", "Momo", "Kiko", "Rhesus"],
      colors: { snow: { name: "Japanese", fur: ["#b8ab9c", "#948677", "#ece5da"], pink: ["#e58a86", "#b85c5c"], eyes: EYES_BROWN, face: "#ee8f8a" },
        rhesus: { name: "Rhesus", fur: ["#a9834f", "#876436", "#e8d3ad"], pink: ["#e9b39f", "#b5705e"], eyes: EYES_BROWN, face: "#f0bca8" } } },
    gibbon: { kind: "primate", name: "Gibbon", taxon: "Hominoid · lesser ape", desc: "A lesser ape: no tail, very long arms for brachiation, pair bonds and duets sung at dawn", shape: { primate: true, size: .9, ear: 5.4, notail: true, wb: .86, arm: 1.55, upright: "up" }, names: ["Swing", "Echo", "Lar", "Aria"],
      colors: { black: { name: "Black", fur: ["#2f2e36", "#1f1e24", "#5a5966"], pink: ["#3a3640", "#221f26"], eyes: EYES_BROWN, face: "#3a3640", ring: "#f4f1ea", hand: "#f4f1ea" },
        blonde: { name: "Blonde", fur: ["#ecd9a8", "#cfb47a", "#fff4d6"], pink: ["#3a3640", "#221f26"], eyes: EYES_BROWN, face: "#3a3640", ring: "#fffaf0", hand: "#3a3640" } } },
    orangutan: { kind: "primate", name: "Orangutan", taxon: "Hominoid · great ape (Pongo)", desc: "The red great ape of Borneo and Sumatra: mostly solitary, lives in the trees, and adult males grow cheek flanges", shape: { primate: true, sac: true, held: "leaf", size: 1.12, ear: 5, notail: true, flange: true, tuft: true, beard: true, shaggy: true, wb: 1.16, arm: 1.42, slope: 6, knuckle: true }, names: ["Clyde", "Rusty", "Ginger", "Pongo"],
      colors: { bornean: { name: "Bornean", fur: ["#d9672a", "#b34d17", "#f2a05e"], pink: ["#8a5f4a", "#5a3d30"], eyes: EYES_BROWN, face: "#9a6c55" },
        sumatran: { name: "Sumatran", fur: ["#e88a45", "#c56a26", "#ffc58f"], pink: ["#a57660", "#6b4838"], eyes: EYES_BROWN, face: "#b08068" } } },
    gorilla: { kind: "primate", name: "Gorilla", taxon: "Hominoid · great ape (Gorilla)", desc: "The largest living primate: a knuckle-walker that lives in one-male groups led by a silverback", shape: { primate: true, nose: "wide", held: "bamboo", size: 1.26, ear: 5.4, notail: true, brow: true, crest: true, wb: 1.3, hx: 1.04, arm: 1.25, slope: 8, knuckle: true, chest: "bare" }, names: ["Koko", "Kong", "Juba", "Titus"],
      colors: { black: { name: "Blackback", fur: ["#3a3941", "#26252b", "#5e5d6a"], pink: ["#2c2b31", "#1b1a1f"], eyes: EYES_BROWN, face: "#2e2d34" },
        silver: { name: "Silverback", fur: ["#3a3941", "#26252b", "#5e5d6a"], pink: ["#2c2b31", "#1b1a1f"], eyes: EYES_BROWN, face: "#2e2d34", saddle: "#cfd3da" } } },
    chimp: { kind: "primate", name: "Chimpanzee", taxon: "Hominoid · great ape (Pan troglodytes)", desc: "Our closest living relative along with the bonobo: male-bonded, fission-fusion groups, tool use and termite fishing", shape: { primate: true, chin: true, held: "stick", size: 1.04, ear: 10.4, notail: true, brow: true, muzzle: true, wb: 1.08, arm: 1.25, slope: 7, knuckle: true }, names: ["Caesar", "Flo", "Fifi", "David Greybeard"],
      colors: { tan: { name: "Common", fur: ["#35302e", "#221e1d", "#5c5450"], pink: ["#d9ad8c", "#8a5a48"], eyes: EYES_BROWN, face: "#e3b998" },
        dark: { name: "Dark-faced", fur: ["#2e2a2a", "#1c1919", "#514a4a"], pink: ["#7a5a4c", "#4a342c"], eyes: EYES_BROWN, face: "#7f5d4e" } } },
    bonobo: { kind: "primate", name: "Bonobo", taxon: "Hominoid · great ape (Pan paniscus)", desc: "Pan paniscus: female-bonded and peaceful, with a dark face, pink lips, hair parted in the middle and long legs", shape: { primate: true, whisk: true, held: "fruit", size: 1, ear: 8, notail: true, part: true, muzzle: true, wb: .96, arm: 1.2, leg: 1.15, slope: 5, knuckle: true }, names: ["Kanzi", "Lola", "Panbanisha", "Mimi"],
      colors: { black: { name: "Black", fur: ["#28252c", "#18161b", "#4d4853"], pink: ["#3d3338", "#e58a9a"], eyes: EYES_BROWN, face: "#3f353a" } } }
  });
  // older saves used one key per coat; map them to breed + color
  const LEGACY = { golden: ["domestic", "golden"], orange: ["tabby", "orange"], silver: ["tabby", "silver"], black: ["bombay", "black"], tuxedo: ["tuxedo", "black"], siamese: ["siamese", "seal"], calico: ["calico", "classic"], russian: ["russian", "blue"], snow: ["persian", "white"] };
  function resolveBreed(breed, color) {
    if (LEGACY[breed] && !BREEDS[breed]) { const [b, c] = LEGACY[breed]; return [b, BREEDS[b].colors[color] ? color : c] }
    const b = BREEDS[breed] ? breed : "domestic", cs = BREEDS[b].colors;
    return [b, cs[color] ? color : Object.keys(cs)[0]];
  }
  const breedName = (breed, color) => { const [b, c] = resolveBreed(breed, color); const B = BREEDS[b]; return Object.keys(B.colors).length > 1 && b !== "domestic" ? `${B.colors[c].name} ${B.name}` : b === "domestic" ? `${B.colors[c].name} ${B.name}` : B.name };
  const isPrimate = breed => { const B = BREEDS[resolveBreed(breed)[0]]; return !!(B && B.kind === "primate") };
  // form names for a primate (the cats keep "Tiny kitten" … from STAGES)
  const PRIMATE_FORMS = ["Clinging infant", "Curious juvenile", "Playful juvenile", "Bold adolescent", "Skilled adult", "Wise elder"];
  const formOf = (k, breed) => isPrimate(breed) ? PRIMATE_FORMS[k] : STAGES[k].form;
  (() => {
    const H = household(), act = H.cats[H.active]; if (!act) return;
    if (!IN_A102 && isPrimate(act.breed)) {
      const cat = Object.keys(H.cats).find(id => !isPrimate(H.cats[id].breed)); if (!cat) return;
      const was = H.active; trainCat(H.catWas && H.cats[H.catWas] && !isPrimate(H.cats[H.catWas].breed) ? H.catWas : cat);
      const H2 = household(); H2.primateWas = was; H2.along = H2.along.filter(x => x !== was); saveHouse(H2);
    } else if (IN_A102 && H.primateWas) {
      const id = H.primateWas, back = H.cats[id] && isPrimate(H.cats[id].breed); const cur = H.active;
      delete H.primateWas; H.catWas = cur; saveHouse(H); if (back) trainCat(id);
    }
  })();
  let SHAPE = {}, FACE = "#f0d3b3", RING = "", LID = null, SKIN = "#f0d3b3", SADDLE = "", CAPE = "";
  function setCoat(breed, color) {
    const [b, c] = resolveBreed(breed, color), B = BREEDS[b], C = B.colors[c];
    [FUR, FUR_D, FUR_L] = C.fur; [PINK, PINK_D] = C.pink; IRIS = C.eyes; SHAPE = B.shape || {}; FACE = C.face || "#f0d3b3"; RING = C.ring || ""; LID = SHAPE.primate ? (SHAPE.patch || FACE) : null; SKIN = C.hand || C.face || "#f0d3b3"; SADDLE = C.saddle || ""; CAPE = C.cape || "";
    const pat = B.pattern === "tabby" ? { head: tabbyHead(C.pat), body: tabbyBody(C.pat) } : B.pattern === "tux" ? { head: tuxHead(C.pat) } : B.pattern === "points" ? { head: pointsHead(C.pat) } : B.pattern === "calico" ? { head: calicoHead(C.pat[0], C.pat[1]), body: calicoBody(C.pat[0], C.pat[1]) } : {};
    return { head: (pat.head || "") + (SHAPE.sleek ? gloss : ""), body: pat.body, shape: SHAPE };
  }

  const ln = `stroke="${OL}" stroke-width="${OW}" stroke-linejoin="round" stroke-linecap="round"`;
  let uidN = 0;
  const sparkle = (x, y, r, c = "#ffd84a") => `<path d="M${x} ${y - r} Q${x + r * .18} ${y - r * .18} ${x + r} ${y} Q${x + r * .18} ${y + r * .18} ${x} ${y + r} Q${x - r * .18} ${y + r * .18} ${x - r} ${y} Q${x - r * .18} ${y - r * .18} ${x} ${y - r}Z" fill="${c}" stroke="${OL}" stroke-width="1"/>`;
  // Eye expressions. "open" is his everyday look; the study pal switches between the others by mood:
  //   wide (wonder: sparkly, brows up) · dilated (playing/hunting: big round pupils, as real cats' widen) · focus (stalking:
  //   lids lowered toward the nose, big pupils) · sleepy (content: heavy lids, a slow blink) · sad (outer lids droop, worried
  //   brows, a tear) · happy (closed ^ ^ smile) · sleep (relaxed closed lids) · closed (the freshman's sleepy look)
  const EYE = {   // pupil rx/ry, lid drop at outer/inner corner, brow outer/inner y offset, highlight scale
    open: { p: [1.9, 3.3], dO: 0, dI: 0, bO: -10.6, bI: -8.4, hi: 1 },
    wide: { p: [2.6, 3.5], dO: -1.2, dI: -1.2, bO: -13, bI: -12.2, hi: 1.3, star: true },
    dilated: { p: [4.1, 4.7], dO: 0, dI: 0, bO: -11.4, bI: -10, hi: 1.15 },
    focus: { p: [3.4, 4.3], dO: .4, dI: 2.8, bO: -11.6, bI: -6.8, hi: .9 },
    sleepy: { p: [2.6, 3.2], dO: 4.6, dI: 4.2, bO: -9.6, bI: -9.2, hi: .8 },
    sad: { p: [2.8, 3.6], dO: 3.8, dI: 0, bO: -8.2, bI: -12, hi: 1.25, tear: true }
  };
  function eye(u, x, y, mode) {
    if (mode === "closed") return `<path d="M${x - 6} ${y + 1} Q${x} ${y - 5} ${x + 6} ${y + 1}" stroke="${OL}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    if (mode === "happy") return `<path d="M${x - 6.4} ${y + 2.4} Q${x} ${y - 6} ${x + 6.4} ${y + 2.4}" stroke="${OL}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${x - 7.4} ${y - 10.4} Q${x} ${y - 13.6} ${x + 7.4} ${y - 10.4}" stroke="#6b3f17" stroke-width="3.6" fill="none" stroke-linecap="round"/>`;
    if (mode === "sleep") return `<path d="M${x - 6.2} ${y + .4} Q${x} ${y + 5.2} ${x + 6.2} ${y + .4}" stroke="${OL}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M${x - 7} ${y - 9.2} Q${x} ${y - 10.6} ${x + 7} ${y - 9.2}" stroke="#6b3f17" stroke-width="3.4" fill="none" stroke-linecap="round" opacity=".85"/>`;
    const e = EYE[mode] || EYE.open, out = x < 60 ? -1 : 1, m = v => out < 0 ? v : -v;   // m(): mirror x offsets for the right eye
    const h = e.hi, dO = e.dO, dI = e.dI;
    return `<ellipse cx="${x}" cy="${y + 1.6}" rx="5.8" ry="6.2" fill="url(#${u}iris)" stroke="${OL}" stroke-width="1.8"/>
      <ellipse cx="${x + m(.6)}" cy="${y + 2.2}" rx="${e.p[0]}" ry="${e.p[1]}" fill="#1f2a18"/>
      <ellipse cx="${x + m(-2)}" cy="${y - 1.6}" rx="${2 * h}" ry="${2.4 * h}" fill="#fff"/><circle cx="${x + m(2.4)}" cy="${y + 4}" r="${1 * h}" fill="#fff"/>
      ${e.star ? `<path d="M${x + m(2.6)} ${y - .6} l.7 1.6 1.6 .7 -1.6 .7 -.7 1.6 -.7 -1.6 -1.6 -.7 1.6 -.7Z" fill="#fff"/>` : ""}
      <path d="M${x + m(-6.6)} ${y - 6.4} Q${x} ${y - 5.4} ${x + m(6.6)} ${y - 6.4} L${x + m(6.6)} ${y - 2 + dI} Q${x} ${y - 3.2 + (dO + dI) / 2} ${x + m(-6.6)} ${y - 2 + dO}Z" fill="${LID || FUR}"/><path d="M${x + m(-7.2)} ${y - 1.6 + dO} Q${x} ${y - 3.6 + (dO + dI) / 2} ${x + m(7.4)} ${y - 1.2 + dI}" stroke="${OL}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <path d="M${x + m(-6)} ${y + 6.4} Q${x} ${y + 9.2} ${x + m(5)} ${y + 6.6}" stroke="${OL}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".6"/>
      <path d="M${x + m(-7.8)} ${y + e.bO} L${x + m(6.8)} ${y + e.bI}" stroke="#6b3f17" stroke-width="4.2" stroke-linecap="round"/>
      ${e.tear && out < 0 ? `<path d="M${x - 5.2} ${y + 6.6} q-1.6 2.8 0 4 q1.6 -1.2 0 -4Z" fill="#8fd3ff" stroke="${OL}" stroke-width=".9"/>` : ""}`;
  }
  // Mouth to match: happy = open smile, sad = wobbly frown, wide = a little "o", asleep = soft ω, otherwise his grin
  function mouth(mode) {
    if (mode === "closed" || mode === "sleep") return `<path d="M55.4 71 Q57.7 74.4 60 71.2 Q62.3 74.4 64.6 71" stroke="${OL}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    if (mode === "happy") return `<path d="M55 71.2 Q57.5 73.4 60 71.4 Q62.5 73.4 65 71.2 Q64 78.4 60 78.6 Q56 78.4 55 71.2Z" fill="#a8463a" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/><path d="M57.2 76.2 Q60 74.6 62.8 76.2 Q61.8 78.2 60 78.3 Q58.2 78.2 57.2 76.2Z" fill="#f08a8a"/>`;
    if (mode === "sad") return `<path d="M55.6 75 Q57.6 72.2 60 73.2 Q62.4 72.2 64.4 75" stroke="${OL}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
    if (mode === "wide") return `<path d="M56.4 71.2 Q58.2 72.6 60 71.4 Q61.8 72.6 63.6 71.2" stroke="${OL}" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="75" rx="2.2" ry="2.5" fill="#a8463a" stroke="${OL}" stroke-width="1.3"/>`;
    return `<path d="M54.6 71.4 Q57.4 74.2 60 71.4 Q63.4 74.6 66.8 69.6" stroke="${OL}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  }

  // ===== Dexter's body. A real cat body in three poses, with his big chibi head (face, expressions, hats) on top:
  //   sit   front-facing, sitting up: haunches, two front legs, hind feet, tail around the side (the closet, the dock, most games)
  //   stand side view, on four legs (walk cycle when he trots over to an answer, crouches when hunting)
  //   lie   a curled loaf with paws tucked in (cat naps)
  // o.w is his weight (0.75 slim … 1.5 chonky): it widens the body, belly and legs in every pose.
  // Parts keep their class names (dx-torso, dx-tail, dx-pawl, dx-pawr, dx-hindl, dx-hindr, dx-head …) so the study pal can animate them.
  const f1 = n => Math.round(n * 10) / 10;
  function furTail(d, w2) { w2 = SHAPE.tail || w2; if (SHAPE.notail) return ""; return (SHAPE.rings ? `<path d="${d}" stroke="${OL}" stroke-width="${w2 + 4.4}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${FUR_L}" stroke-width="${w2}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${SHAPE.rings}" stroke-width="${w2}" fill="none" stroke-dasharray="4.4 4.8" stroke-dashoffset="-3"/>` : "") || `<path d="${d}" stroke="${OL}" stroke-width="${w2 + 4.4}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${FUR}" stroke-width="${w2}" fill="none" stroke-linecap="round"/>` }
  function leg(x, top, bot, wd, cls, far) {   // a leg column (open at the top so it blends into the body) with a paw
    const h = wd / 2, c = far ? FUR_D : FUR;
    return `<g class="${cls}"><path d="M${f1(x - h)} ${top} L${f1(x - h - .3)} ${bot - 4} Q${f1(x - h - 1.4)} ${bot + .6} ${x} ${bot + .6} Q${f1(x + h + 1.4)} ${bot + .6} ${f1(x + h + .3)} ${bot - 4} L${f1(x + h)} ${top}Z" fill="${c}"/>
      <path d="M${f1(x - h)} ${top} L${f1(x - h - .3)} ${bot - 4} Q${f1(x - h - 1.4)} ${bot + .6} ${x} ${bot + .6} Q${f1(x + h + 1.4)} ${bot + .6} ${f1(x + h + .3)} ${bot - 4} L${f1(x + h)} ${top}" fill="none" ${ln}/>
      ${far ? "" : `<path d="M${f1(x - 1.6)} ${bot - 2.4} v2.4 M${f1(x + 1.6)} ${bot - 2.4} v2.4" stroke="${OL}" stroke-width="1.1" stroke-linecap="round"/>`}</g>`;
  }
  function sitBody(o, w) {
    const hx = 16 * w, lw = 7.8 * (.75 + .25 * w), lx = 7.4 * (.75 + .25 * w);
    const tail = o.tail === "kitten" ? `M${f1(60 + 15 * w)} 103 C${f1(72 + 17 * w)} 104 ${f1(76 + 15 * w)} 96 ${f1(71 + 14 * w)} 90` : o.tail === "down" ? `M${f1(60 + 16 * w)} 105 C${f1(78 + 18 * w)} 111 ${f1(70 + 10 * w)} 112 ${f1(56 - 6 * w)} 110` : `M${f1(60 + 17 * w)} 102 C${f1(74 + 22 * w)} 104 ${f1(84 + 16 * w)} 92 ${f1(82 + 14 * w)} 76 C${f1(81 + 14 * w)} 68 ${f1(76 + 13 * w)} 66 ${f1(77 + 13 * w)} 71`;
    const back = `<g class="dx-tail">${furTail(tail, 5.8)}${o.tail === "down" || o.tail === "kitten" ? "" : `<path d="M${f1(81 + 14 * w)} 74 C${f1(80 + 14 * w)} 69 ${f1(77 + 13 * w)} 67 ${f1(77 + 13 * w)} 70" stroke="${FUR_L}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`}</g>`;
    const body = `<g class="dx-torso">
      <ellipse cx="${f1(60 - hx)}" cy="99.5" rx="${f1(9.6 * w)}" ry="${f1(8.8 + w)}" fill="${FUR}" ${ln}/><ellipse cx="${f1(60 + hx)}" cy="99.5" rx="${f1(9.6 * w)}" ry="${f1(8.8 + w)}" fill="${FUR}" ${ln}/>
      <path d="M${f1(60 - 12 * w)} 78 Q60 71 ${f1(60 + 12 * w)} 78 C${f1(60 + 17 * w)} 87 ${f1(60 + 19 * w)} 97 ${f1(60 + 16.5 * w)} 104 Q${f1(60 + 13 * w)} 109 60 109 Q${f1(60 - 13 * w)} 109 ${f1(60 - 16.5 * w)} 104 C${f1(60 - 19 * w)} 97 ${f1(60 - 17 * w)} 87 ${f1(60 - 12 * w)} 78Z" fill="${FUR}" ${ln}/>
      <path d="M${f1(60 - 10 * w)} 98 Q60 ${f1(104 + 4 * (w - 1))} ${f1(60 + 10 * w)} 98 Q${f1(60 + 9 * w)} 108 60 108.4 Q${f1(60 - 9 * w)} 108 ${f1(60 - 10 * w)} 98Z" fill="${FUR_D}" opacity=".5"/>
      <path d="M${f1(60 - 8 * w)} 83 L${f1(60 - 5 * w)} 88 L${f1(60 - 3 * w)} 83.6 L${f1(60 - 1.2 * w)} 89 L60 83 L${f1(60 + 1.2 * w)} 89 L${f1(60 + 3 * w)} 83.6 L${f1(60 + 5 * w)} 88 L${f1(60 + 8 * w)} 83 Q${f1(60 + 9 * w)} 98 60 103 Q${f1(60 - 9 * w)} 98 ${f1(60 - 8 * w)} 83Z" fill="${FUR_L}"/>
      <ellipse cx="${f1(60 - hx - 4 * w)}" cy="106.4" rx="6.4" ry="3.6" fill="${FUR_L}" ${ln}/><ellipse cx="${f1(60 + hx + 4 * w)}" cy="106.4" rx="6.4" ry="3.6" fill="${FUR_L}" ${ln}/>
      <path d="M${f1(60 - hx - 8 * w)} 95 q3 -3 7 -3 M${f1(60 + hx + 8 * w)} 95 q-3 -3 -7 -3" stroke="${FUR_D}" stroke-width="1.3" fill="none" stroke-linecap="round"/></g>`;
    const legs = leg(f1(60 - lx), 84, 107.6, lw, "dx-pawl") + leg(f1(60 + lx), 84, 107.6, lw, "dx-pawr");
    return { back, body, legs, head: "translate(60 12) scale(.9) translate(-60 -12)", shadow: 26 * w, outfitMap: "",
      tail: o.tail === "down" ? { d: tail, base: [60 + 16 * w, 105], tip: [56 - 6 * w, 110] } : { d: tail, base: [60 + 17 * w, 102], tip: [77 + 13 * w, 70] } };
  }
  function standBody(o, w, u) {
    const T = f1(73.5 - 3 * (w - 1)), Bm = f1(99 + 9 * (w - 1)), Rr = f1(99 + 2 * (w - 1)), lw = 7 * (.8 + .2 * w);
    const tail = o.tail === "down" ? `M97 88 C106 92 110 100 104 106` : `M97 84 C107 82 112 70 107 58 C105 53 100 54 101 59`;
    const bodyPath = `M47 85 C47 ${T} 62 ${T} 74 ${T} C88 ${T} ${Rr} 75 ${Rr} 86 C${Rr} ${Bm} 90 ${Bm} 74 ${Bm} C58 ${Bm} 47 97 47 85Z`;
    const back = leg(61, 90, 107.6, lw, "dx-pawr", true) + leg(85, 92, 107.6, lw, "dx-hindr", true) + `<g class="dx-tail">${furTail(tail, 5.8)}</g>`;
    const body = `<g class="dx-torso"><defs><clipPath id="${u}bc"><path d="${bodyPath}"/></clipPath></defs><path d="${bodyPath}" fill="${FUR}" ${ln}/>
      <path d="M58 ${f1(+Bm - 4)} Q74 ${f1(+Bm + 1)} 90 ${f1(+Bm - 5)}" stroke="${FUR_D}" stroke-width="4" fill="none" opacity=".45" stroke-linecap="round"/>
      <path d="M80 ${f1(+T + 3)} q3 4 0 8 M86 ${f1(+T + 4)} q3 4 0 8" stroke="${FUR_D}" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>
      <ellipse cx="89" cy="${f1(90 + 2 * (w - 1))}" rx="${f1(10 * (.85 + .15 * w))}" ry="${f1(10.5 * (.85 + .15 * w))}" fill="${FUR}" ${ln}/>
      <path d="M49 82 Q50 92 57 96 Q53 88 55 80Z" fill="${FUR_L}"/>
      <g class="dx-outfit" clip-path="url(#${u}bc)"></g></g>`;
    const legs = leg(54, 90, 107.6, lw, "dx-pawl") + leg(92, 95, 107.6, lw + 1, "dx-hindl");
    return { tail: { d: tail, base: [97, 85], tip: o.tail === "down" ? [104, 106] : [101, 58] }, back, body, legs, head: "translate(47 87) scale(.82) translate(-60 -86)", shadow: 30 * w, outfitMap: `translate(48 ${T}) scale(${f1(50 / 38 * 100) / 100} ${f1((+Bm - +T) / 32 * 100) / 100}) translate(-41 -76)`, clip: `${u}bc` };
  }
  function lieBody(o, w, u) {
    const rx = f1(34 * (.85 + .15 * w)), ry = f1(12 * (.8 + .25 * w)), cy = f1(108.6 - +ry);
    const bodyPath = `M${f1(66 - +rx)} 108 C${f1(66 - +rx)} ${f1(+cy - +ry * .9)} ${f1(66 + +rx * .6)} ${f1(+cy - +ry * 1.05)} ${f1(66 + +rx)} ${f1(+cy + 2)} C${f1(66 + +rx + 1)} 108.6 ${f1(66 + +rx * .5)} 108.8 66 108.8Z`;
    const back = "";
    const body = `<g class="dx-torso"><defs><clipPath id="${u}bc"><path d="${bodyPath}"/></clipPath></defs><path d="${bodyPath}" fill="${FUR}" ${ln}/>
      <path d="M${f1(66 + +rx * .2)} ${f1(+cy - +ry * .2)} q4 4 0 8 M${f1(66 + +rx * .45)} ${f1(+cy - +ry * .1)} q4 4 0 8" stroke="${FUR_D}" stroke-width="1.4" fill="none" opacity=".8" stroke-linecap="round"/>
      <g class="dx-outfit" clip-path="url(#${u}bc)"></g></g>
      <g class="dx-tail">${furTail(`M${f1(66 + +rx - 2)} 106 C${f1(66 + +rx + 4)} 112 60 112.4 40 110`, 5.4)}</g>`;
    const legs = `<g class="dx-pawl"><ellipse cx="38" cy="106.6" rx="6.6" ry="3.6" fill="${FUR_L}" ${ln}/></g><g class="dx-pawr"><ellipse cx="50" cy="107.4" rx="6.6" ry="3.4" fill="${FUR_L}" ${ln}/></g>`;
    return { tail: { d: `M${f1(66 + +rx - 2)} 106 C${f1(66 + +rx + 4)} 112 60 112.4 40 110`, base: [66 + +rx - 2, 106], tip: [40, 110] }, back, body, legs, head: "translate(44 106) scale(.78) translate(-60 -86)", shadow: +rx + 4, outfitMap: `translate(${f1(66 - +rx * .7)} ${f1(+cy - +ry)}) scale(${f1(+rx * 1.6 / 38 * 100) / 100} ${f1(+ry * 2 / 32 * 100) / 100}) translate(-41 -76)`, clip: `${u}bc` };
  }
  // ===== Mystic Dexter. Every form is a little magical, and more so as he evolves (like a legendary's final form):
  //   aura    a soft glow behind him that grows and shifts color
  //   motes   floating sparks of light
  //   gem     a glowing crystal on his forehead (every form)
  //   marks   luminous stripes on his cheeks (Junior and up)
  //   wisp    a spirit flame on the tip of his tail (Kitten and up)
  //   spirits ghostly extra tails that sway beside his real one (Senior and Grad Student: 1, Professor: 2)
  //   runes   a slowly turning rune circle behind him (Grad Student: half ring of paw prints, Professor: full ring)
  // All drawn with SVG <animate>, so they move wherever he appears.
  const MYST = [
    { c: "#c4b5fd", c2: "#f5f3ff", aura: .34, r: 36, motes: 4, gem: "#c4b5fd" },
    { c: "#7dd3fc", c2: "#e0f2fe", aura: .34, r: 39, motes: 5, gem: "#67e8f9", wisp: true },
    { c: "#a78bfa", c2: "#ede9fe", aura: .36, r: 42, motes: 6, gem: "#a78bfa", wisp: true, marks: true },
    { c: "#f0abfc", c2: "#fdf4ff", aura: .38, r: 45, motes: 7, gem: "#e879f9", wisp: true, marks: true, spirits: 1 },
    { c: "#60a5fa", c2: "#e0f2fe", aura: .4, r: 48, motes: 8, gem: "#38bdf8", wisp: true, marks: true, spirits: 1, runes: 1 },
    { c: "#fbbf24", c2: "#fef3c7", aura: .42, r: 52, motes: 9, gem: "#fde047", wisp: true, marks: true, spirits: 2, runes: 2 }
  ];
  const MOTES = [[22, 40], [98, 34], [14, 78], [104, 72], [34, 18], [88, 14], [8, 56], [112, 96], [26, 100]];
  function mystic(u, k, P, w) {
    const M = MYST[k]; if (!M) return null;
    const anim = (attr, vals, dur, begin = 0) => `<animate attributeName="${attr}" values="${vals}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/>`;
    const aura = `<defs><radialGradient id="${u}aura"><stop offset="0" stop-color="${M.c}" stop-opacity="${M.aura}"/><stop offset=".6" stop-color="${M.c}" stop-opacity="${M.aura * .45}"/><stop offset="1" stop-color="${M.c}" stop-opacity="0"/></radialGradient></defs>
      <ellipse cx="60" cy="74" rx="${M.r}" ry="${M.r * 1.02}" fill="url(#${u}aura)">${anim("opacity", ".75;1;.75", 3.2)}</ellipse>`;
    let runes = "";
    if (M.runes) {
      const n = M.runes > 1 ? 8 : 4, R = 46;
      const paw = `<ellipse cx="0" cy="1" rx="1.7" ry="1.4" fill="${M.c}"/><circle cx="-1.7" cy="-1.2" r=".7" fill="${M.c}"/><circle cx="-.6" cy="-2" r=".7" fill="${M.c}"/><circle cx=".6" cy="-2" r=".7" fill="${M.c}"/><circle cx="1.7" cy="-1.2" r=".7" fill="${M.c}"/>`;
      runes = `<g opacity=".5"><animateTransform attributeName="transform" type="rotate" from="0 60 66" to="360 60 66" dur="40s" repeatCount="indefinite"/>
        <circle cx="60" cy="66" r="${R}" fill="none" stroke="${M.c}" stroke-width=".8" stroke-dasharray="${M.runes > 1 ? "3 2.4" : "3 2.4 3 60"}" opacity=".9"/>${M.runes > 1 ? `<circle cx="60" cy="66" r="${R - 4}" fill="none" stroke="${M.c}" stroke-width=".5" opacity=".6"/>` : ""}
        ${Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2 - (M.runes > 1 ? 0 : Math.PI / 2), x = 60 + Math.cos(a) * R, y = 66 + Math.sin(a) * R; return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a * 180 / Math.PI + 90)})">${paw}</g>` }).join("")}</g>`;
    }
    let spirits = "";
    if (M.spirits && P.tail) {
      const [bx, by] = P.tail.base, ang = [-24, 22, -46];
      for (let i = 0; i < M.spirits; i++) spirits += `<g opacity=".55"><animateTransform attributeName="transform" type="rotate" values="${ang[i]} ${f1(bx)} ${f1(by)};${ang[i] + (i % 2 ? -8 : 8)} ${f1(bx)} ${f1(by)};${ang[i]} ${f1(bx)} ${f1(by)}" dur="${2.6 + i * .5}s" repeatCount="indefinite"/>
        <path d="${P.tail.d}" stroke="${M.c}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".55"/><path d="${P.tail.d}" stroke="${M.c2}" stroke-width="4.4" fill="none" stroke-linecap="round"/></g>`;
    }
    const wisp = M.wisp && P.tail ? (() => { const [x, y] = P.tail.tip; return `<g transform="translate(${f1(x)} ${f1(y)})"><circle r="5.4" fill="${M.c}" opacity=".35">${anim("r", "4.6;6.4;4.6", 1.6)}</circle>
      <path d="M0 2.6 C-3.2 1 -2.6 -3 0 -6.4 C0.6 -3.4 3.4 -2.4 2.6 0.6 C2.2 2.2 1 2.8 0 2.6Z" fill="${M.c2}" stroke="${M.c}" stroke-width=".8">${anim("opacity", ".7;1;.7", .9)}</path></g>` })() : "";
    const motes = MOTES.slice(0, M.motes).map(([x, y], i) => i % 3 === 2 ? `<g opacity="0" transform="translate(${x} ${y})"><g><animateTransform attributeName="transform" type="translate" values="0 0;0 -7;0 0" dur="${2.6 + (i % 4) * .5}s" begin="${(i * .45).toFixed(2)}s" repeatCount="indefinite"/><ellipse cx="0" cy="1" rx="1.9" ry="1.5" fill="${M.c2}" stroke="${M.c}" stroke-width=".5"/>${[[-1.9, -1.3], [-.7, -2.3], [.7, -2.3], [1.9, -1.3]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r=".75" fill="${M.c2}" stroke="${M.c}" stroke-width=".4"/>`).join("")}</g>${anim("opacity", "0;1;0", 2.6 + (i % 4) * .5, (i * .45).toFixed(2))}</g>` : `<circle cx="${x}" cy="${y}" r="${i % 3 ? 1.6 : 2.2}" fill="${M.c2}" stroke="${M.c}" stroke-width=".6" opacity="0">${anim("opacity", "0;1;0", 2.6 + (i % 4) * .5, (i * .45).toFixed(2))}${anim("cy", `${y};${y - 7};${y}`, 2.6 + (i % 4) * .5, (i * .45).toFixed(2))}</circle>`).join("");
    const gem = `<g transform="translate(60 46.6) scale(.78)"><circle r="4.6" fill="${M.gem}" opacity=".35">${anim("r", "3.6;5.4;3.6", 2.2)}</circle><path d="M0 -3.4 L2.4 0 L0 3.4 L-2.4 0Z" fill="${M.gem}" stroke="${OL}" stroke-width=".9" stroke-linejoin="round"/><path d="M0 -2.4 L1 -.4 L0 0Z" fill="#fff" opacity=".85"/></g>`;
    const marks = M.marks ? `<g opacity=".9">${anim("opacity", ".55;1;.55", 2.4)}<path d="M33.6 61 l5.6 1.2 M33.4 65 l5 .2 M86.4 61 l-5.6 1.2 M86.6 65 l-5 .2" stroke="${M.c}" stroke-width="2.2" stroke-linecap="round"/><path d="M33.6 61 l5.6 1.2 M33.4 65 l5 .2 M86.4 61 l-5.6 1.2 M86.6 65 l-5 .2" stroke="#fff" stroke-width=".8" stroke-linecap="round"/></g>` : "";
    return { back: aura + runes, spirits, wisp, front: motes, head: marks + gem };
  }
  function addToTail(str, before, after) {   // put spirit tails behind, and the wisp on the tip of, the dx-tail group (the last group in str)
    const i = str.lastIndexOf('<g class="dx-tail">'); if (i < 0 || (!before && !after)) return str;
    const j = str.lastIndexOf("</g>"), open = '<g class="dx-tail">';
    return str.slice(0, i) + open + before + str.slice(i + open.length, j) + after + str.slice(j);
  }
  // A primate's head on the same anchor points as the cat's (eyes at 48.5/71.5 × 60, nose at 60 × 68), so hats, glasses
  // and expressions all still fit.
  function primateHead(u, o) {
    const S = SHAPE, er = (S.ear || 7.5) * (o.baby ? .9 : 1), ey = 58, skin = PINK, es = S.eye || 1;
    const ear = (x, cls) => `<g class="${cls}">${S.pointy ? `<path d="M${x - 7} ${ey} Q${x - 9} ${ey - 16} ${x} ${ey - 20} Q${x + 9} ${ey - 16} ${x + 7} ${ey}Z" fill="${FUR}" ${ln}/><path d="M${x - 3.6} ${ey - 2} Q${x - 4.6} ${ey - 12} ${x} ${ey - 15} Q${x + 4.6} ${ey - 12} ${x + 3.6} ${ey - 2}Z" fill="${FUR_L}"/>` : `<circle cx="${x}" cy="${ey}" r="${er}" fill="${S.patch || skin === FACE ? FUR : FACE}" ${ln}/><circle cx="${x}" cy="${ey}" r="${f1(er * .56)}" fill="${skin}" opacity=".9"/>`}</g>`;
    const mane = S.mane ? `<path d="M26 58 Q22 44 32 38 Q34 26 46 27 Q54 18 64 24 Q76 20 82 31 Q94 34 92 48 Q100 58 92 68 Q94 80 82 84 Q74 93 60 90 Q46 93 38 84 Q26 80 28 68 Q22 62 26 58Z" fill="${FUR}" ${ln}/><path d="M34 44 l-3 -4 M44 32 l-2 -5 M60 28 v-5 M76 32 l2 -5 M86 44 l3 -4 M33 76 l-4 3 M87 76 l4 3" stroke="${FUR_D}" stroke-width="1.5" stroke-linecap="round"/>` : "";
    const flange = S.flange && !o.baby ? `<ellipse cx="35" cy="64" rx="7.6" ry="13" fill="${PINK_D}" ${ln}/><ellipse cx="85" cy="64" rx="7.6" ry="13" fill="${PINK_D}" ${ln}/>` : "";
    const beard = S.beard && !o.baby ? `<path d="M46 80 Q48 92 54 89 Q57 95 60 90 Q63 95 66 89 Q72 92 74 80Z" fill="${FUR}" ${ln}/>` : "";
    // cheek ruffs (macaque) frame the face
    const cheeks = S.cheeks ? `<path d="M36 62 L28 64 L34 68 L28 73 L36 75 L33 80 L42 80Z M84 62 L92 64 L86 68 L92 73 L84 75 L87 80 L78 80Z" fill="${FUR_L}" ${ln}/>` : "";
    // the gorilla's sagittal crest: a ridge of bone along the top of the skull that anchors big chewing muscles
    const crest = S.crest && !o.baby ? `<path d="M46 37 Q52 20 60 18.6 Q68 20 74 37Z" fill="${FUR}" ${ln}/><path d="M60 21 V32" stroke="${FUR_D}" stroke-width="1.6" stroke-linecap="round"/>` : "";
    const skull = `<path d="M33 60 Q32 33 60 32 Q88 33 87 60 Q87 77 77 82.6 Q69 86.5 60 86.5 Q51 86.5 43 82.6 Q33 77 33 60Z" fill="${FUR}" ${ln}/>`;
    const top = S.tuft ? `<path d="M49 34 L51 26 L55 32 L58 23 L61 31 L65 24 L67 32 L71 27 L71 35 Q60 31 49 34Z" fill="${FUR}" ${ln}/>` : S.part ? `<path d="M60 32.6 Q58 38 50 41 M60 32.6 Q62 38 70 41" stroke="${FUR_D}" stroke-width="1.6" fill="none" stroke-linecap="round"/>` : "";
    // the bare face: a heart-shaped mask around the eyes that widens into the muzzle
    const maskD = "M60 45.5 Q53 40.5 45.5 44.5 Q38.6 49 39.4 59.5 Q39.6 66.5 45.4 70.5 Q44.6 79.5 52 83 Q60 85.6 68 83 Q75.4 79.5 74.6 70.5 Q80.4 66.5 80.6 59.5 Q81.4 49 74.5 44.5 Q67 40.5 60 45.5Z";
    const mask = `${RING ? `<path d="${maskD}" fill="${RING}" stroke="${RING}" stroke-width="6.5" stroke-linejoin="round"/>` : ""}<path d="${maskD}" fill="${FACE}" stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"/>
      ${S.muzzle ? `<path d="M47 71 Q47 63.5 60 63.5 Q73 63.5 73 71 Q73 82.6 60 83.4 Q47 82.6 47 71Z" fill="#fff" opacity=".16" stroke="${OL}" stroke-opacity=".35" stroke-width="1"/>` : S.snout ? "" : `<ellipse cx="60" cy="74.4" rx="11.6" ry="8" fill="#fff" opacity=".12"/>`}`;
    const patch = S.patch ? `<path d="M48.5 50.5 Q57.5 51 57.5 61 Q57 70 48.5 70.5 Q40 70 40 61 Q40 51 48.5 50.5Z" fill="${S.patch}"/><path d="M71.5 50.5 Q62.5 51 62.5 61 Q63 70 71.5 70.5 Q80 70 80 61 Q80 51 71.5 50.5Z" fill="${S.patch}"/>` : "";
    // strepsirrhine snout: a longer, fox-like muzzle with a wet nose at the tip
    const snout = S.snout ? `<path d="M52 68 Q52 63 60 63 Q68 63 68 68 Q68 80.6 60 81.4 Q52 80.6 52 68Z" fill="${FACE}" stroke="${OL}" stroke-width="1.3"/><path d="M56.4 65.4 Q60 63 63.6 65.4 Q63 70.4 60 71 Q57 70.4 56.4 65.4Z" fill="#1d1c21" stroke="${OL}" stroke-width="1"/><path d="M58.4 66 q1 -.8 2 0" stroke="#fff" stroke-width=".8" fill="none" opacity=".7"/>` : "";
    const brow = S.brow && !o.baby ? `<path d="M39.6 51 Q48.5 44.6 58 49.6 Q60 50.6 62 49.6 Q71.5 44.6 80.4 51 Q71.5 48.6 62 52.4 Q60 53.2 58 52.4 Q48.5 48.6 39.6 51Z" fill="${FUR_D}" stroke="${OL}" stroke-width="1.3" stroke-linejoin="round"/>` : "";
    const eyes = eye(u, 48.5, 60, o.eyes) + eye(u, 71.5, 60, o.eyes), E = o.baby ? noBrows(eyes) : S.patch || S.brow ? noBrows(eyes) : eyes, k = es * (o.baby ? 1.12 : 1);
    // noses: platyrrhines (New World monkeys) have wide-set nostrils that open to the sides; catarrhines (Old World monkeys,
    // apes) have close-set nostrils that open downward
    const nose = S.snout ? "" : S.wet ? `<path d="M57.6 67 Q60 65.8 62.4 67 L60 70Z" fill="#1d1c21" stroke="${OL}" stroke-width="1" stroke-linejoin="round"/>`
      : S.platy ? `<path d="M55 66.4 Q60 64.6 65 66.4" stroke="${OL}" stroke-width="1.1" fill="none" opacity=".5"/><ellipse cx="55.4" cy="68.2" rx="1.9" ry="1.2" fill="${OL}" opacity=".85" transform="rotate(-28 55.4 68.2)"/><ellipse cx="64.6" cy="68.2" rx="1.9" ry="1.2" fill="${OL}" opacity=".85" transform="rotate(28 64.6 68.2)"/>`
      : `<path d="M58 65.4 Q60 64.4 62 65.4" stroke="${OL}" stroke-width="1.1" fill="none" opacity=".5"/><ellipse cx="58.7" cy="68.3" rx=".95" ry="1.7" fill="${OL}" opacity=".85" transform="rotate(12 58.7 68.3)"/><ellipse cx="61.3" cy="68.3" rx=".95" ry="1.7" fill="${OL}" opacity=".85" transform="rotate(-12 61.3 68.3)"/>`;
    // gorillas have a broad nose with flared nostrils and a ridge above it (each "nose print" is unique)
    const wideNose = S.nose === "wide" ? `<path d="M53.6 66.2 Q60 62.6 66.4 66.2" stroke="${OL}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/><ellipse cx="56.6" cy="68.6" rx="2.5" ry="1.9" fill="${OL}" opacity=".9"/><ellipse cx="63.4" cy="68.6" rx="2.5" ry="1.9" fill="${OL}" opacity=".9"/>` : "";
    // the chimpanzee's white chin beard; the bonobo's cheek whiskers; the flanged orangutan's throat sac; a young orangutan's pale eye rings
    const chin = S.chin ? `<path d="M55 80.6 Q57 86.4 60 84 Q63 86.4 65 80.6 Q60 83 55 80.6Z" fill="#f4f1ea" stroke="${OL}" stroke-width="1" stroke-linejoin="round"/>` : "";
    const whisk = S.whisk ? `<path d="M38 62 L30 66 L37 69 L31 75 L39 76 L37 82 L45 80Z M82 62 L90 66 L83 69 L89 75 L81 76 L83 82 L75 80Z" fill="${FUR}" ${ln}/>` : "";
    const sac = S.sac && !o.baby ? `<ellipse cx="60" cy="87" rx="15" ry="6.4" fill="${PINK_D}" ${ln}/><path d="M50 88 q10 4 20 0" stroke="${OL}" stroke-width="1" fill="none" opacity=".4"/>` : "";
    const rings = S.flange && o.baby ? `<ellipse cx="48.5" cy="60" rx="9" ry="9.6" fill="#f0c9a8"/><ellipse cx="71.5" cy="60" rx="9" ry="9.6" fill="#f0c9a8"/><ellipse cx="60" cy="74" rx="9" ry="6.4" fill="#f0c9a8"/>` : "";
    const lips = S.part ? `<path d="M55.6 72.6 Q60 75.6 64.4 72.6" stroke="${PINK_D}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".9"/>` : "";
    return `${ear(30.5, "dx-earl")}${ear(89.5, "dx-earr")}${mane}${flange}${sac}${beard}${cheeks}${whisk}${crest}${skull}${top}${mask}${rings}${patch}${snout}${brow}
      <g class="dx-eyes"><g class="dx-blink">${k !== 1 ? `<g transform="translate(60 61) scale(${f1(k * 100) / 100}) translate(-60 -61)">` : ""}${E}${k !== 1 ? "</g>" : ""}</g></g>
      ${o.baby ? `<ellipse cx="42.6" cy="72" rx="4" ry="2.4" fill="#ff9fb0" opacity=".5"/><ellipse cx="77.4" cy="72" rx="4" ry="2.4" fill="#ff9fb0" opacity=".5"/>` : ""}
      ${wideNose || nose}${lips}${chin}${S.snout ? `<path d="M56.6 75.4 Q60 77.6 63.4 75.4" stroke="${OL}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` : mouth(o.eyes)}`;
  }

  // ===== Primate bodies. Limbs are drawn as thick rounded strokes (outline under fur), with bare grasping hands and feet.
  //   sit    upright on the haunches, knees up and out. Monkeys rest their hands on their knees; apes' long arms reach the ground
  //   stand  quadrupedal, side view. Knuckle-walkers (chimp, bonobo, gorilla, orangutan) stand taller at the shoulder than the hip;
  //          the lemur stands taller at the hip. The gibbon walks upright with its arms raised; the tarsier crouches, ready to leap
  //   lie    resting on the belly with the head on folded arms
  // Parts keep the cat's class names (dx-torso, dx-tail, dx-pawl/r = arms, dx-hindl/r = legs) so the same animations drive them.
  const limb = (d, tk, c) => `<path d="${d}" stroke="${OL}" stroke-width="${f1(tk + 4.2)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${c}" stroke-width="${f1(tk)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const skinLn = `stroke="${OL}" stroke-width="1.5" stroke-linejoin="round"`;
  // a hand: palm with finger creases (dir: -1 fingers point left, 1 right); tarsiers have round finger pads, tamarins claws
  function pHand(x, y, dir) {
    const S = SHAPE;
    return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="4.6" ry="3.1" fill="${SKIN}" ${skinLn}/><path d="M${f1(x + dir * 1)} ${f1(y - 1.6)} v3 M${f1(x + dir * 2.8)} ${f1(y - 1.2)} v2.4" stroke="${OL}" stroke-width=".9" stroke-linecap="round" opacity=".7"/>
      ${S.pads ? [0, 1, 2].map(i => `<circle cx="${f1(x + dir * 4.6)}" cy="${f1(y - 2.4 + i * 2.4)}" r="1.5" fill="${SKIN}" stroke="${OL}" stroke-width=".9"/>`).join("") : ""}
      ${S.claws ? `<path d="M${f1(x + dir * 4.4)} ${f1(y - 1.4)} l${dir * 2.2} -.6 M${f1(x + dir * 4.6)} ${f1(y + .6)} l${dir * 2.2} .2" stroke="${OL}" stroke-width="1" stroke-linecap="round"/>` : ""}`;
  }
  // a knuckle-walking hand: the weight rests on the backs of the bent fingers
  const pKnuckle = (x, y) => `<rect x="${f1(x - 4)}" y="${f1(y - 3)}" width="8" height="5.4" rx="2.6" fill="${SKIN}" ${skinLn}/><path d="M${f1(x - 1.4)} ${f1(y - 2.6)} v2.6 M${f1(x + 1.2)} ${f1(y - 2.6)} v2.6" stroke="${OL}" stroke-width=".9" stroke-linecap="round" opacity=".7"/>`;
  // a grasping foot with the big toe set apart (dir: which way the toes point)
  function pFoot(x, y, dir) {
    const S = SHAPE, L = 6 + (S.foot || 0);
    return `<ellipse cx="${f1(x + dir * (L - 5))}" cy="${f1(y)}" rx="${L}" ry="3" fill="${SKIN}" ${skinLn}/><ellipse cx="${f1(x - dir * 3.2)}" cy="${f1(y - 2.6)}" rx="2.3" ry="1.7" fill="${SKIN}" ${skinLn}/>
      <path d="M${f1(x + dir * (L - 2))} ${f1(y - 1.4)} v2.6 M${f1(x + dir * (L + .2))} ${f1(y - 1)} v2" stroke="${OL}" stroke-width=".9" stroke-linecap="round" opacity=".7"/>
      ${S.pads ? `<circle cx="${f1(x + dir * (2 * L - 5))}" cy="${f1(y)}" r="1.6" fill="${SKIN}" stroke="${OL}" stroke-width=".9"/>` : ""}`;
  }
  const pShag = (pts) => SHAPE.shaggy ? `<path d="${pts.map(([x, y]) => `M${f1(x)} ${f1(y)} l-1.4 5 l2.4 -2.4`).join(" ")}" stroke="${FUR_D}" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` : "";
  function pTail(d, tk) { return furTail(d, tk) + (SHAPE.tailStyle === "tuft" ? (() => { const m = d.match(/(-?[\d.]+) (-?[\d.]+)$/); return m ? `<ellipse cx="${m[1]}" cy="${m[2]}" rx="4.4" ry="3" fill="${FUR_D}" ${ln}/>` : "" })() : "") }
  function primateSit(o, w) {
    const S = SHAPE, A = S.arm || 1, G = S.leg || 1, tk = 6.4 * (.78 + .22 * w), sx = 11.5 * w;
    const kx = 19 * w + 1.5 * G, ky = 92 - 14 * (G - 1), fx = 13 * w + 4;
    const st = S.tailStyle, tb = [60 + 15 * w, 103];
    const tail = st === "curl" ? `M${f1(tb[0])} 103 C${f1(80 + 16 * w)} 105 ${f1(88 + 14 * w)} 92 ${f1(84 + 13 * w)} 80 C${f1(81 + 13 * w)} 71 ${f1(72 + 13 * w)} 72 ${f1(73 + 13 * w)} 79 C${f1(74 + 13 * w)} 84 ${f1(80 + 13 * w)} 83 ${f1(79 + 13 * w)} 79`
      : st === "short" ? `M${f1(tb[0])} 103 q9 1 11 -6`
      : st === "up" ? `M${f1(tb[0])} 103 C${f1(82 + 16 * w)} 104 ${f1(84 + 15 * w)} 88 ${f1(80 + 15 * w)} 72 C${f1(78 + 15 * w)} 60 ${f1(84 + 15 * w)} 52 ${f1(88 + 14 * w)} 58`
      : st === "tuft" ? `M${f1(tb[0])} 104 C${f1(78 + 14 * w)} 108 ${f1(88 + 14 * w)} 100 ${f1(92 + 13 * w)} 88`
      : `M${f1(60 + 17 * w)} 102 C${f1(74 + 22 * w)} 104 ${f1(84 + 16 * w)} 92 ${f1(82 + 14 * w)} 76 C${f1(81 + 14 * w)} 68 ${f1(76 + 13 * w)} 66 ${f1(77 + 13 * w)} 71`;
    const tip = (tail.match(/(-?[\d.]+) (-?[\d.]+)$/) || [0, 80, 70]).slice(1).map(Number);
    const back = `<g class="dx-tail">${pTail(tail, 5.4)}</g>`;
    const legD = s => `M${f1(60 + s * 9 * w)} 103 C${f1(60 + s * (kx + 7))} 102 ${f1(60 + s * (kx + 6))} ${f1(ky - 2)} ${f1(60 + s * (kx - 1))} ${f1(ky)} L${f1(60 + s * fx)} 104`;
    const legC = SADDLE || FUR;
    const chest = S.chest === "bare" ? `<path d="M${f1(60 - 9 * w)} 84 Q60 80 ${f1(60 + 9 * w)} 84 Q${f1(60 + 10 * w)} 96 60 100 Q${f1(60 - 10 * w)} 96 ${f1(60 - 9 * w)} 84Z" fill="${PINK}" stroke="${OL}" stroke-width="1.1" stroke-opacity=".5"/><path d="M60 84 V98 M${f1(60 - 6 * w)} 90 Q60 93 ${f1(60 + 6 * w)} 90" stroke="${OL}" stroke-width="1" fill="none" opacity=".45"/>`
      : `<ellipse cx="60" cy="93" rx="${f1(8.6 * w)}" ry="10.4" fill="${FUR_L}" opacity=".9"/>`;
    const body = `<g class="dx-torso">
      <path d="M${f1(60 - 12 * w)} 78 Q60 71 ${f1(60 + 12 * w)} 78 C${f1(60 + 16 * w)} 87 ${f1(60 + 17 * w)} 97 ${f1(60 + 15 * w)} 104 Q${f1(60 + 12 * w)} 109 60 109 Q${f1(60 - 12 * w)} 109 ${f1(60 - 15 * w)} 104 C${f1(60 - 17 * w)} 97 ${f1(60 - 16 * w)} 87 ${f1(60 - 12 * w)} 78Z" fill="${FUR}" ${ln}/>
      ${chest}${CAPE ? `<path d="M${f1(60 - 12 * w)} 78 Q60 71 ${f1(60 + 12 * w)} 78 Q${f1(60 + 14 * w)} 84 ${f1(60 + 11 * w)} 88 Q60 82 ${f1(60 - 11 * w)} 88 Q${f1(60 - 14 * w)} 84 ${f1(60 - 12 * w)} 78Z" fill="${CAPE}" stroke="${OL}" stroke-width="1.1" stroke-opacity=".5"/>` : ""}${pShag([[60 - 13 * w, 90], [60 + 13 * w, 90], [60 - 8 * w, 102], [60 + 8 * w, 102]])}
      <g class="dx-hindl">${limb(legD(-1), tk + 1.4, legC)}${pFoot(60 - fx - 2, 106.2, -1)}</g><g class="dx-hindr">${limb(legD(1), tk + 1.4, legC)}${pFoot(60 + fx + 2, 106.2, 1)}</g></g>`;
    // arms: apes' reach the ground beside the feet (knuckles down); monkeys' rest on the knees
    const long = A >= 1.15, hx2 = S.sun ? kx + 8 : long ? 22 * w + 5 * A : kx - 3, hy = S.sun ? ky + 5 : long ? 104.6 : ky + 2.4, cx2 = sx + (long ? 9 + 22 * (A - 1) : 8), cy2 = long ? 88 : 89;
    const armD = s => `M${f1(60 + s * sx)} 82 Q${f1(60 + s * cx2)} ${cy2} ${f1(60 + s * hx2)} ${f1(hy)}`;
    const hxr = 60 + hx2, HELD = {
      nut: `<circle cx="${f1(hxr + 8)}" cy="106" r="2.8" fill="#8a5a32" stroke="${OL}" stroke-width="1"/><ellipse cx="${f1(hxr + 1)}" cy="${f1(hy - 4)}" rx="4.6" ry="3.6" fill="#8d96a1" stroke="${OL}" stroke-width="1.3"/>`,
      potato: `<ellipse cx="${f1(hxr + 1)}" cy="${f1(hy - 3.6)}" rx="5.4" ry="3" fill="#c9785a" stroke="${OL}" stroke-width="1.2" transform="rotate(-24 ${f1(hxr + 1)} ${f1(hy - 3.6)})"/>`,
      stick: `<path d="M${f1(hxr)} ${f1(hy)} l9 -27" stroke="${OL}" stroke-width="2.8" stroke-linecap="round"/><path d="M${f1(hxr)} ${f1(hy)} l9 -27" stroke="#9ac46a" stroke-width="1.3" stroke-linecap="round"/><circle cx="${f1(hxr + 7.4)}" cy="${f1(hy - 22)}" r="1" fill="${OL}"/><circle cx="${f1(hxr + 8.6)}" cy="${f1(hy - 25.6)}" r="1" fill="${OL}"/>`,
      bamboo: `<path d="M${f1(hxr)} ${f1(hy + 1)} l5 -30" stroke="${OL}" stroke-width="5.4" stroke-linecap="round"/><path d="M${f1(hxr)} ${f1(hy + 1)} l5 -30" stroke="#8fc46a" stroke-width="3" stroke-linecap="round"/><path d="M${f1(hxr + 3.6)} ${f1(hy - 20)} q9 -6 13 0 q-7 2 -13 0Z" fill="#5fae45" stroke="${OL}" stroke-width="1"/>`,
      fruit: `<circle cx="${f1(hxr + 1)}" cy="${f1(hy - 4.4)}" r="4.4" fill="#ff8a5c" stroke="${OL}" stroke-width="1.3"/><path d="M${f1(hxr + 1)} ${f1(hy - 8.6)} q3 -4 6 -2" stroke="#3f8f3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`,
      bug: `<ellipse cx="${f1(hxr + 1)}" cy="${f1(hy - 3.4)}" rx="3.8" ry="2.2" fill="#8fc43a" stroke="${OL}" stroke-width="1"/><path d="M${f1(hxr - 1)} ${f1(hy - 5)} l-2 -3 M${f1(hxr + 3)} ${f1(hy - 5)} l2 -3" stroke="${OL}" stroke-width=".9" stroke-linecap="round"/>`,
      leaf: `<path d="M${f1(hxr)} ${f1(hy)} l6 -30" stroke="${OL}" stroke-width="2.6" stroke-linecap="round"/><path d="M${f1(hxr + 6)} ${f1(hy - 30)} q-22 -4 -24 8 q14 2 24 -8Z M${f1(hxr + 6)} ${f1(hy - 30)} q16 -10 22 2 q-12 6 -22 -2Z" fill="#4fa85a" stroke="${OL}" stroke-width="1.3" stroke-linejoin="round"/>`
    }[S.held] || "";
    const arm = (s, cls) => `<g class="${cls}">${s > 0 && !o.baby ? HELD : ""}${limb(armD(s), tk, FUR)}${pShag(long ? [[60 + s * (cx2 - 3), 92], [60 + s * (cx2 - 1), 97]] : [])}${long && S.knuckle ? pKnuckle(60 + s * hx2, hy + 1.8) : pHand(60 + s * hx2, hy + 1, s)}</g>`;
    return { back, body, legs: arm(-1, "dx-pawl") + arm(1, "dx-pawr"), head: "translate(60 12) scale(.9) translate(-60 -12)", shadow: (long ? 30 : 27) * w, outfitMap: "", tail: { d: tail, base: tb, tip } };
  }
  function primateUpright(o, w, u) {   // the gibbon (arms up for balance) and the tarsier (a crouched vertical clinger)
    const S = SHAPE, up = S.upright === "up", tk = 5.6 * (.8 + .2 * w), hw = 9.5 * w;
    const bodyPath = `M${f1(60 - hw)} 80 Q60 74.5 ${f1(60 + hw)} 80 C${f1(60 + hw + 3)} 88 ${f1(60 + hw + 3)} 97 ${f1(60 + hw - 1)} 101.6 Q60 105 ${f1(60 - hw + 1)} 101.6 C${f1(60 - hw - 3)} 97 ${f1(60 - hw - 3)} 88 ${f1(60 - hw)} 80Z`;
    const tail = S.notail ? "" : `M${f1(60 + hw - 2)} 100 C${f1(76 + hw)} 104 ${f1(88 + hw)} 100 ${f1(92 + hw)} 88`;
    const leg = s => up ? limb(`M${f1(60 + s * 4.6)} 99 Q${f1(60 + s * 7)} 103 ${f1(60 + s * 5.4)} 105`, tk, FUR) + pFoot(60 + s * 6.4, 106.4, s)
      : limb(`M${f1(60 + s * 5)} 98 C${f1(60 + s * 19)} 93 ${f1(60 + s * 21)} 101 ${f1(60 + s * 9)} 104.4`, tk, FUR) + pFoot(60 + s * 9, 106.4, s);
    const armD = s => up ? `M${f1(60 + s * (hw - 1))} 82 C${f1(60 + s * (hw + 12))} 82 ${f1(60 + s * (hw + 17))} 70 ${f1(60 + s * (hw + 15))} 56` : `M${f1(60 + s * (hw - 1))} 84 Q${f1(60 + s * (hw + 7))} 89 ${f1(60 + s * (hw + 3))} 94.6`;
    const hand = s => up ? pHand(60 + s * (hw + 15), 54, s) : pHand(60 + s * (hw + 4), 96, s);
    const back = `<g class="dx-tail">${tail ? pTail(tail, 4) : ""}</g><g class="dx-hindr">${leg(1)}</g>`;
    const body = `<g class="dx-torso"><defs><clipPath id="${u}bc"><path d="${bodyPath}"/></clipPath></defs><path d="${bodyPath}" fill="${FUR}" ${ln}/><ellipse cx="60" cy="91" rx="${f1(hw * .66)}" ry="8.4" fill="${FUR_L}" opacity=".9"/>
      <g class="dx-outfit" clip-path="url(#${u}bc)"></g></g>`;
    const legs = `<g class="dx-hindl">${leg(-1)}</g><g class="dx-pawl">${limb(armD(-1), tk, FUR)}${hand(-1)}</g><g class="dx-pawr">${limb(armD(1), tk, FUR)}${hand(1)}</g>`;
    return { back, body, legs, head: "translate(60 79.5) scale(.8) translate(-60 -86)", shadow: 20 * w, clip: `${u}bc`, outfitMap: `translate(${f1(60 - hw - 2)} 77) scale(${f1((2 * hw + 4) / 38 * 100) / 100} ${f1(27 / 32 * 100) / 100}) translate(-41 -76)`,
      tail: tail ? { d: tail, base: [60 + hw - 2, 100], tip: [92 + hw, 88] } : null };
  }
  function primateStand(o, w, u) {
    const S = SHAPE; if (S.upright) return primateUpright(o, w, u);
    const sl = S.slope || 0, T = 73.5 - 3 * (w - 1), Ts = f1(T - sl), Tr = f1(T + sl * .55), Bm = f1(97.5 + 8 * (w - 1)), Rr = f1(98 + 2 * (w - 1)), tk = 6.2 * (.8 + .2 * w), G = S.leg || 1;
    const st = S.tailStyle;
    const tail = st === "up" ? `M96 ${f1(+Tr + 9)} C106 ${f1(+Tr + 2)} 102 60 106 46 C108 39 114 40 112 47` : st === "curl" ? `M96 ${f1(+Tr + 9)} C110 ${f1(+Tr + 10)} 115 72 109 63 C105 57 98 60 100 66 C102 70 107 68 105 64`
      : st === "short" ? `M96 ${f1(+Tr + 8)} q8 -2 9 -9` : `M96 ${f1(+Tr + 9)} C107 ${f1(+Tr + 6)} 112 70 107 58 C105 53 100 54 101 59`;
    const tip = (tail.match(/(-?[\d.]+) (-?[\d.]+)$/) || [0, 101, 59]).slice(1).map(Number);
    const bodyPath = `M47 85 C47 ${Ts} 60 ${Ts} 72 ${f1((+Ts + +Tr) / 2)} C86 ${Tr} ${Rr} ${f1(+Tr + 3)} ${Rr} 87 C${Rr} ${Bm} 90 ${Bm} 74 ${Bm} C58 ${Bm} 47 97 47 85Z`;
    // forelimbs come straight down from the shoulder; hindlimbs are bent at the knee
    const fore = (x, far) => limb(`M${x + 1} 89 L${x} ${S.knuckle ? 102.6 : 103.6}`, tk, far ? FUR_D : FUR) + (S.knuckle ? pKnuckle(x - 1.4, 105.4) : pHand(x - 2.4, 106.4, -1));
    const hind = (x, far) => limb(`M${x + 1} 91 Q${f1(x + 6 + 3 * (G - 1) * 4)} ${f1(97 - 6 * (G - 1))} ${x} 103.6`, tk + .8, far ? FUR_D : SADDLE && !far ? FUR : FUR) + pFoot(x - 2, 106.4, -1);
    const back = `<g class="dx-pawr">${fore(61, true)}</g><g class="dx-hindr">${hind(85, true)}</g><g class="dx-tail">${pTail(tail, 5.4)}</g>`;
    const body = `<g class="dx-torso"><defs><clipPath id="${u}bc"><path d="${bodyPath}"/></clipPath></defs><path d="${bodyPath}" fill="${FUR}" ${ln}/>
      <g clip-path="url(#${u}bc)">${SADDLE ? `<ellipse cx="80" cy="${f1(+Tr + 3)}" rx="19" ry="11" fill="${SADDLE}"/>` : ""}<path d="M52 ${f1(+Bm - 3)} Q70 ${f1(+Bm + 2)} 90 ${f1(+Bm - 5)}" stroke="${S.chest === "bare" ? PINK : FUR_L}" stroke-width="6" fill="none" opacity=".75" stroke-linecap="round"/></g>
      ${pShag([[60, +Bm - 2], [68, +Bm - 1], [76, +Bm - 1], [84, +Bm - 3]])}
      ${S.callos ? `<ellipse cx="${f1(+Rr - 1.6)}" cy="${f1(+Tr + 14)}" rx="2.8" ry="4.4" fill="#f08a9a" stroke="${OL}" stroke-width="1.2"/>` : ""}
      <g class="dx-outfit" clip-path="url(#${u}bc)"></g></g>`;
    const legs = `<g class="dx-pawl">${fore(53, false)}</g><g class="dx-hindl">${hind(92, false)}</g>`;
    return { tail: { d: tail, base: [96, +Tr + 9], tip }, back, body, legs, head: `translate(47 ${f1(87 - sl * .55)}) scale(.82) translate(-60 -86)`, shadow: 30 * w, clip: `${u}bc`,
      outfitMap: `translate(48 ${Ts}) scale(${f1(50 / 38 * 100) / 100} ${f1((+Bm - +Ts) / 32 * 100) / 100}) translate(-41 -76)` };
  }
  function primateLie(o, w, u) {   // on the belly, head resting on folded arms, one foot showing behind
    const P = lieBody(o, w, u), S = SHAPE, rx = 34 * (.85 + .15 * w), tk = 5.6;
    const st = S.tailStyle, tx = f1(66 + rx - 2);
    const tail = S.notail ? "" : st === "short" ? `M${tx} 104 q7 0 9 -5` : st === "up" ? `M${tx} 105 C${f1(66 + rx + 10)} 106 ${f1(66 + rx + 12)} 94 ${f1(66 + rx + 6)} 86` : `M${tx} 106 C${f1(66 + rx + 4)} 112 60 112.4 40 110`;
    P.body = P.body.replace(/<g class="dx-tail">[\s\S]*?<\/g>/, `<g class="dx-tail">${tail ? pTail(tail, 5) : ""}</g>`)
      + (SADDLE ? "" : "") + `<g class="dx-hindl">${limb(`M${f1(66 + rx - 12)} 100 Q${f1(66 + rx - 2)} 97 ${f1(66 + rx - 5)} 105`, tk, FUR)}${pFoot(66 + rx - 3, 107, 1)}</g>`;
    P.legs = `<g class="dx-pawl">${limb("M56 101 Q46 99 40 104.6", tk, FUR)}${S.knuckle ? pKnuckle(38.6, 106.4) : pHand(38.6, 106.6, -1)}</g><g class="dx-pawr">${limb("M62 103 Q56 103 52 106", tk, FUR)}${pHand(50.4, 107.4, -1)}</g>`;
    P.tail = tail ? { d: tail, base: [+tx, 105], tip: (tail.match(/(-?[\d.]+) (-?[\d.]+)$/) || [0, 40, 110]).slice(1).map(Number) } : null;
    return P;
  }
  function drawHead(u, o) {
    if (SHAPE.primate) { const hx = SHAPE.hx || 1; const h = primateHead(u, o); return hx !== 1 ? `<g transform="translate(60 84) scale(${hx} 1) translate(-60 -84)">${h}</g>` : h }
    const S = SHAPE, ex = (S.ex || 1) * (o.baby ? .82 : 1), ey = (S.ey || 1) * (o.baby ? .76 : 1);
    const earT = (x, y) => ex !== 1 || ey !== 1 ? ` transform="translate(${x} ${y}) scale(${ex} ${ey}) translate(${-x} ${-y})"` : "";
    const ruff = S.ruff ? `<path d="M30 70 Q24 80 33 84 Q34 92 44 90 Q48 97 56 93 Q60 99 64 93 Q72 97 76 90 Q86 92 87 84 Q96 80 90 70Z" fill="${FUR_L}" ${ln}/>` : "";
    const head = `<g class="dx-earl"><g${earT(45, 38)}>${S.tufts ? `<path d="M36.5 15 l-1.4 -6.4 M36.5 15 l2 -5.6" stroke="${FUR_D}" stroke-width="1.8" stroke-linecap="round"/>` : ""}<path d="M35 47 L36.5 15 L43.5 21.5 L41.5 25 L46.5 25.5 L56 33Z" fill="${FUR}" ${ln}/><path d="M39 40 L40 23 L42.5 25.5 L46 27.5 L51 33Z" fill="${PINK}"/></g></g>
      <g class="dx-earr"><g${earT(75, 38)}>${S.tufts ? `<path d="M83.5 15 l1.4 -6.4 M83.5 15 l-2 -5.6" stroke="${FUR_D}" stroke-width="1.8" stroke-linecap="round"/>` : ""}<path d="M85 47 L83.5 15 L64 33Z" fill="${FUR}" ${ln}/><path d="M81 40 L80 22.5 L69 33Z" fill="${PINK}"/></g></g>
      ${ruff}` + drawHeadBase(u, o);
    const hx = S.hx || 1, hy = S.hy || 1;
    return hx !== 1 || hy !== 1 ? `<g transform="translate(60 84) scale(${hx} ${hy}) translate(-60 -84)">${head}</g>` : head;
  }
  // kittens have soft, browless faces (the grown-up brows come with the Sophomore form)
  const noBrows = svg => svg.replace(/<path [^>]*stroke="#6b3f17"[^>]*\/>/g, "");
  function drawHeadBase(u, o) {
    return `
      <path d="M32.5 58 L25 61 L31.5 65 L24.5 69.5 L32 71.5 L28.5 76 L37 75.5 Q43 85 60 85.5 Q77 85 83 75.5 L91.5 76 L88 71.5 L95.5 69.5 L88.5 65 L95 61 L87.5 58 Q88 33 60 32 Q32 33 32.5 58Z" fill="${FUR}" ${ln}/>
      <path d="M37 74 Q47 82.5 60 83 Q73 82.5 83 74 Q77 86 60 86 Q43 86 37 74Z" fill="${FUR_D}" opacity=".55"/>
      <path d="M41 45 L42 27 L50 39 L53 21 L60 37 L66 20.5 L69.5 37 L78 25 L79 45 Q60 39 41 45Z" fill="${FUR_L}" ${ln}/>
      <path d="M50 39 L52 31 M60 37 L64 28 M69.5 37 L74 31" stroke="${FUR_D}" stroke-width="1.4" stroke-linecap="round"/>
      ${o.headPat || ""}
      <g class="dx-eyes"><g class="dx-blink">${o.baby ? `<g transform="translate(60 62) scale(1.16) translate(-60 -62)">` : ""}${o.baby ? noBrows(eye(u, 48.5, 60, o.eyes) + eye(u, 71.5, 60, o.eyes)) : eye(u, 48.5, 60, o.eyes) + eye(u, 71.5, 60, o.eyes)}${o.baby ? "</g>" : ""}</g></g>
      ${o.baby ? `<ellipse cx="40" cy="72.5" rx="5.4" ry="3" fill="#ff9fb0" opacity=".55"/><ellipse cx="80" cy="72.5" rx="5.4" ry="3" fill="#ff9fb0" opacity=".55"/><path d="M37.4 72 l1.4 -1.6 M40 72 l1.4 -1.6 M77.4 72 l1.4 -1.6 M80 72 l1.4 -1.6" stroke="#e46f86" stroke-width=".9" stroke-linecap="round"/>` : ""}
      
      <path d="M58.2 67.6 L61.8 67.6 L60 69.8Z" fill="${PINK_D}" stroke="${OL}" stroke-width="1" stroke-linejoin="round"/>
      ${mouth(o.eyes)}
      <path d="M33 66 L22 64 M33 69 L22 70.5 M87 66 L98 64 M87 69 L98 70.5" stroke="${OL}" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`;
  }

  // The kitten at full size, standing on y=108. o: { sc, eyes, tail, glasses, pose, w, outfit, neck, front, over, back }
  function kitty(u, o) {
    const w = Math.min(1.75, Math.max(.65, (+o.w || 1) * (SHAPE.wb || 1))), pose = o.pose || "sit";
    const P = SHAPE.primate ? (pose === "stand" ? primateStand(o, w, u) : pose === "lie" ? primateLie(o, w, u) : primateSit(o, w)) : pose === "stand" ? standBody(o, w, u) : pose === "lie" ? lieBody(o, w, u) : sitBody(o, w);
    if (SHAPE.notail && !SHAPE.primate) { const cut = s => s.replace(/<g class="dx-tail">[\s\S]*?<\/g>/, '<g class="dx-tail"></g>'); P.back = cut(P.back); P.body = cut(P.body); P.tail = null }   // apes have no tail
    const glasses = o.glasses ? `<circle cx="48.5" cy="60" r="10" fill="#bfe6ff" fill-opacity=".18" stroke="${OL}" stroke-width="2"/><circle cx="71.5" cy="60" r="10" fill="#bfe6ff" fill-opacity=".18" stroke="${OL}" stroke-width="2"/><path d="M58.5 58.5 Q60 56.5 61.5 58.5" stroke="${OL}" stroke-width="2" fill="none"/><path d="M41 54.5 l3 -2" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><path d="M64 54.5 l3 -2" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` : "";
    const sc = o.sc, chonk = 1 + (w - 1) * .08;
    // outfits are drawn for the sitting torso; on the standing/lying body they're mapped onto its side and clipped to it
    let body = P.body;
    const fluff = SHAPE.fluff && pose === "sit" ? `<path d="M${f1(60 - 25 * w)} 104 q-3 -4 0 -7 q-3 -4 1 -7 M${f1(60 + 25 * w)} 104 q3 -4 0 -7 q3 -4 -1 -7" stroke="${OL}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M${f1(60 - 7 * w)} 84 l-2.4 5 l3.4 -1.4 l-1.4 5 l3.4 -2 M${f1(60 + 7 * w)} 84 l2.4 5 l-3.4 -1.4 l1.4 5 l-3.4 -2" stroke="${FUR_D}" stroke-width="1.2" fill="none" stroke-linecap="round"/>` : "";
    if (pose === "sit") body += (o.bodyPat ? o.bodyPat(w, 16 * w) : "") + fluff + (o.outfit || "");
    else if (o.outfit) body = body.replace('<g class="dx-outfit" clip-path="url(#' + P.clip + ')"></g>', `<g class="dx-outfit" clip-path="url(#${P.clip})"><g transform="${P.outfitMap}">${o.outfit}</g></g>`);
    const MY = o.myst != null ? mystic(u, o.myst, P, w) : null;
    if (MY) { if (pose === "lie") body = addToTail(body, MY.spirits, MY.wisp); else P.back = addToTail(P.back, MY.spirits, MY.wisp) }
    const neck = o.neck || "", headT = P.head ? ` transform="${P.head}"` : "";
    const headG = `<g${headT}><g transform="translate(60 0) scale(${chonk} 1) translate(-60 0)">${neck ? `<g class="dx-neck" transform="translate(60 ${pose === "sit" ? 7.5 : 4}) scale(.9 1) translate(-60 0)">${neck}</g>` : ""}<g class="dx-head">${drawHead(u, o)}${MY ? MY.head : ""}${glasses}${o.front || ""}</g></g></g>`;
    const inner = o.boxed ? (MY ? MY.back : "") + headG + (MY ? MY.front : "") : `${MY ? MY.back : ""}<ellipse cx="60" cy="109" rx="${f1(P.shadow * sc)}" ry="3.6" fill="#000" opacity=".12"/>
      <g transform="translate(60 109) scale(${sc}) translate(-60 -109)">${o.back || ""}${P.back}${P.body === body ? P.body : body}${P.legs}</g>${headG}${o.over || ""}${MY ? MY.front : ""}`;
    return `<defs><radialGradient id="${u}iris" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="${IRIS[0]}"/><stop offset=".32" stop-color="${IRIS[1]}"/><stop offset=".55" stop-color="${IRIS[2]}"/><stop offset=".8" stop-color="${IRIS[3]}"/><stop offset="1" stop-color="${IRIS[4]}"/></radialGradient></defs>
      ${o.flip ? `<g transform="translate(120 0) scale(-1 1)">${inner}</g>` : inner}`;
  }
  // ===== The collar: every Dexter wears one (in every form), in the color the student picks; badges pin onto it
  const COLLARS = [["navy", "#26365e", "Navy"], ["red", "#e63946", "Red"], ["pink", "#ff6fa5", "Pink"], ["purple", "#8b5cf6", "Purple"], ["blue", "#3b82f6", "Blue"], ["teal", "#14b8a6", "Teal"],
    ["green", "#22a35a", "Green"], ["gold", "#f2b705", "Gold"], ["orange", "#ff8a00", "Orange"], ["brown", "#8b5a2b", "Brown"], ["black", "#2b2b2e", "Black"], ["white", "#f4f4f6", "White"]];
  const collarHex = key => (COLLARS.find(c => c[0] === key) || COLLARS[0])[1];
  const BASE_COLLAR = [43, 80.5, 60, 89, 77, 80.5];
  const collar = (hex = "#26365e") => `<path d="M43 80.5 Q60 89 77 80.5" stroke="${OL}" stroke-width="6.4" fill="none" stroke-linecap="round"/><path d="M43 80.5 Q60 89 77 80.5" stroke="${hex}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <path d="M60 85 v1.6" stroke="${OL}" stroke-width="1.2"/><rect x="56.4" y="86.4" width="7.2" height="9" rx="2.6" fill="#c9d1db" stroke="${OL}" stroke-width="1.3"/><path d="M58.4 89.6 h3.2 M58.4 92.2 h3.2" stroke="#7d8794" stroke-width=".9"/><path d="M57.6 88 l1.4 -.6" stroke="#fff" stroke-width=".9" stroke-linecap="round"/>`;
  // primates wear a bead necklace instead of a collar: a cord along the same curve, beads in the chosen color and a pendant
  const necklace = (hex = "#26365e") => {
    const pt = u2 => [(1 - u2) * (1 - u2) * 43 + 2 * (1 - u2) * u2 * 60 + u2 * u2 * 77, (1 - u2) * (1 - u2) * 80.5 + 2 * (1 - u2) * u2 * 89 + u2 * u2 * 80.5];
    const beads = [.1, .22, .34, .66, .78, .9].map((u2, i) => { const [x, y] = pt(u2); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="${i % 2 ? 1.9 : 2.3}" fill="${i % 2 ? "#f4e1c1" : hex}" stroke="${OL}" stroke-width="1.1"/>` }).join("");
    return `<path d="M43 80.5 Q60 89 77 80.5" stroke="${OL}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M43 80.5 Q60 89 77 80.5" stroke="#b98a55" stroke-width="1.1" fill="none" stroke-linecap="round"/>${beads}
      <path d="M60 85 L56.6 90.6 Q60 96.4 63.4 90.6Z" fill="${hex}" stroke="${OL}" stroke-width="1.3" stroke-linejoin="round"/><path d="M59 88.4 l1 -1.6" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/><circle cx="60" cy="85" r="1.5" fill="#f4e1c1" stroke="${OL}" stroke-width="1"/>`;
  };
  const scarf = `<path d="M41 79 Q60 91 79 79 L80 85 Q60 96 40 85Z" fill="#4f8dff" ${ln}/><path d="M70 88 L76 103 L68 101 L65 90Z" fill="#4f8dff" ${ln}/><path d="M45 84 Q60 92 75 84" stroke="#a9c8ff" stroke-width="1.4" fill="none"/>`;
  const headband = `<path d="M33.5 49 Q60 41 86.5 49 L86 55 Q60 47 34 55Z" fill="#c0392b" ${ln}/><path d="M85 50 Q95 47 101 53 Q94 54 91 52 Q97 58 99 64 Q91 59 85 54Z" fill="#c0392b" ${ln}/><circle cx="60" cy="47.6" r="3" fill="#fff" stroke="${OL}" stroke-width="1.2"/>`;
  const bandage = `<g transform="rotate(-20 79 73)"><rect x="73" y="70.6" width="12" height="5" rx="2" fill="#f4e1c1" stroke="${OL}" stroke-width="1.2"/><path d="M78 71.4 v3.4 M80 71.4 v3.4" stroke="#c9a77a" stroke-width=".9"/></g>`;
  const goggles = `<path d="M37 45 Q60 39 83 45" stroke="${OL}" stroke-width="5.4" fill="none"/><path d="M37 45 Q60 39 83 45" stroke="#6b6f7d" stroke-width="3" fill="none"/>
    <rect x="44" y="37" width="13" height="10" rx="5" fill="#9be7ff" ${ln}/><rect x="63" y="37" width="13" height="10" rx="5" fill="#9be7ff" ${ln}/><path d="M47 40 l3 -1.6 M66 40 l3 -1.6" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`;
  const coat = `<path d="M41.5 86 Q41 77 50 76.5 L70 76.5 Q79 77 78.5 86 Q80 104 70 108 L50 108 Q40 104 41.5 86Z" fill="#fff" ${ln}/><path d="M51 76.6 L60 95 L69 76.6Z" fill="${FUR_L}" stroke="${OL}" stroke-width="1.6" stroke-linejoin="round"/><path d="M51 76.6 L56 88 L49.5 86Z M69 76.6 L64 88 L70.5 86Z" fill="#eef3ff" stroke="${OL}" stroke-width="1.4" stroke-linejoin="round"/><path d="M60 95 V107" stroke="${OL}" stroke-width="1.2"/><circle cx="62.6" cy="99" r="1" fill="${OL}"/><circle cx="62.6" cy="104" r="1" fill="${OL}"/><path d="M69 93 h5 v4 h-5Z" fill="none" stroke="${OL}" stroke-width="1.2"/><path d="M70.5 93 v-3" stroke="#4f8dff" stroke-width="1.8" stroke-linecap="round"/>`;
  const cap = `<path d="M42 30 L60 22 L78 30 L60 38Z" fill="#2d2f3a" ${ln}/><path d="M48 33 L48 39 Q60 44 72 39 L72 33" fill="#2d2f3a" ${ln}/><circle cx="60" cy="30" r="1.6" fill="#ffd84a"/><path d="M60 30 L74 33 L75 43" stroke="#ffd84a" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="75" cy="44.5" r="2" fill="#ffd84a" stroke="${OL}" stroke-width=".9"/>`;
  const yarn = `<circle cx="22" cy="100" r="8.5" fill="#4f8dff" ${ln}/><path d="M15 97 Q22 92 29 99 M16 103 Q23 97 29 104 M19 93 Q24 100 21 108" stroke="#2c5fc4" stroke-width="1.3" fill="none"/><path d="M29 104 Q36 110 44 106" stroke="#4f8dff" stroke-width="1.6" fill="none"/>`;
  const flask = `<path d="M17 84 h8 v6 l7 13 Q33 108 28 108 h-14 Q9 108 10 103 l7 -13Z" fill="#fff" fill-opacity=".85" ${ln}/><path d="M13 99 h16 l2.4 4.4 Q32 106.5 28 106.5 h-14 Q10.5 106.5 11.4 103Z" fill="#7be08f"/><circle cx="19" cy="102" r="1.3" fill="#fff"/><circle cx="23" cy="98" r="1" fill="#fff" opacity=".8"/>`;
  const book = `<path d="M90 98 h20 v9 h-20Z" fill="#4f8dff" ${ln}/><path d="M92 91 h18 v7 h-18Z" fill="#e8455f" ${ln}/><path d="M93 101 h14 M95 94 h12" stroke="#fff" stroke-width="1.2" opacity=".85"/>`;
  // Each form's own gear, by wardrobe slot. Anything bought in the shop and worn replaces the gear in that slot.
  const zzz = `<text x="86" y="40" font-family="sans-serif" font-weight="800" font-size="11" fill="#7a8bd8">z</text><text x="94" y="30" font-family="sans-serif" font-weight="800" font-size="8" fill="#7a8bd8">z</text>`;
  const FORM_GEAR = [
    { sc: .64, eyes: "wide", tail: "kitten", baby: true },
    { sc: .8, },
    { sc: .86, held: () => yarn },
    { sc: .92, hat: () => headband, extra: () => bandage },
    { sc: .96, hat: () => goggles, extra: () => bandage, held: () => flask },
    { sc: 1, glasses: true, outfit: () => coat, hat: () => cap, held: () => book }
  ];
  // eq: { hat, outfit, face, neck, held } item ids; defaults to what's saved as worn
  // pinned badges: a list (older saves had one badge in equip.badge)
  const pinnedList = E => { const W = window.BioWardrobe; const l = Array.isArray(E.badges) ? E.badges : E.badge && E.badge !== "none" ? [E.badge] : []; return W ? l.filter(id => W.byId[id]) : [] };
  function neckLayer(E, collarKey) {
    const W = window.BioWardrobe, it = W && E.neck && E.neck !== "none" && W.byId[E.neck], band = it && it.collar ? it.collar : BASE_COLLAR;
    let out = (it && it.collar ? "" : (SHAPE.primate ? necklace : collar)(collarHex(collarKey))) + (it ? it.svg : "");
    const ids = pinnedList(E); if (!ids.length || !W || !W.badgeArt) return out;
    // spread the badges along the band (a quadratic curve); a bow tie, medal etc. in the middle pushes them to the sides
    const n = ids.length, r = n <= 3 ? 3.7 : n <= 5 ? 3.2 : 2.7, mid = it && !it.collar;
    const ts = n === 1 ? (mid ? [.22] : [.5]) : Array.from({ length: n }, (_, i) => { const t = .16 + .68 * i / (n - 1); return mid && Math.abs(t - .5) < .14 ? (t < .5 ? .34 : .66) : t });
    const [x0, y0, cx, cy, x1, y1] = band;
    out += ids.map((id, i) => { const t = ts[i], x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1, b = W.byId[id];
      return `<g transform="translate(${f1(x)} ${f1(y + .6)}) scale(${f1(r * 10) / 100})">${W.badgeArt(b, completions(b.earn))}</g>` }).join("");
    return out;
  }
  function art(k, eq, look) {
    const u = "dx" + (++uidN), g = FORM_GEAR[k], W = window.BioWardrobe, E = eq || load().equip || {};
    // per slot: an item id = wear it · "none" = nothing (even the form's own gear) · unset = the form's own gear
    const worn = slot => E[slot] === "none" ? "" : W && E[slot] && W.byId[E[slot]] ? W.byId[E[slot]].svg : null;
    const pick = slot => { const w = worn(slot); return w !== null ? w : g[slot] ? g[slot]() : "" };
    const face = worn("face");
    const L = look || {};
    const S0 = L.breed ? null : load(), coat = setCoat(L.breed || S0.breed, L.breed ? L.color : S0.color);
    const svg = kitty(u, { baby: !!g.baby, headPat: coat.head || "", bodyPat: coat.body || null, sc: g.sc, eyes: L.eyes || g.eyes || "open", tail: g.tail, glasses: face === null && !!g.glasses, pose: L.pose, flip: L.flip, boxed: L.boxed, myst: L.plain ? null : k, w: L.w || load().weight || 1,
      outfit: pick("outfit"), neck: neckLayer(E, L.collar || load().collar), front: (face || "") + (g.extra ? g.extra() : "") + pick("hat"), over: L.pose === "stand" || L.pose === "lie" ? (g.over || "") : pick("held") + (g.over || "") });
    setCoat("golden");
    return `<svg viewBox="0 0 120 120" aria-hidden="true">${svg}</svg>`;
  }

  // ===== Styles
  const CSS = `
.bb-dock{position:fixed;right:max(16px,env(safe-area-inset-right,0px));bottom:max(16px,env(safe-area-inset-bottom,0px));z-index:45;width:64px;height:64px;border-radius:50%;border:0;padding:0;cursor:pointer;background:var(--paper,#fff);box-shadow:0 6px 22px rgba(0,0,0,.18);display:grid;place-items:center;-webkit-tap-highlight-color:transparent}
.bb-dock:hover{transform:scale(1.05)} .bb-dock{transition:transform .2s}
.bb-dock .bb-ring{position:absolute;inset:0;transform:rotate(-90deg)}
.bb-dock .bb-ring circle{fill:none;stroke-width:4}
.bb-dock .bb-ring .t{stroke:var(--fill,#e8e8ed)} .bb-dock .bb-ring .f{stroke:#34c759;stroke-linecap:round;transition:stroke-dashoffset .6s ease}
.bb-dock .bb-pic{width:50px;height:50px;animation:bbIdle 3s ease-in-out infinite}
.bb-dock .bb-lv{position:absolute;bottom:-6px;left:50%;transform:translateX(-50%);font:700 10.5px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;background:#1d1d1f;color:#fff;border-radius:980px;padding:2px 7px;white-space:nowrap;font-variant-numeric:tabular-nums}
[data-theme="dark"] .bb-dock .bb-lv{background:#f5f5f7;color:#1d1d1f}
.bb-dock.hop .bb-pic{animation:bbHop .6s cubic-bezier(.3,1.6,.5,1)}
.bb-plus{position:fixed;z-index:46;display:flex;flex-direction:column;align-items:flex-end;gap:2px;font:700 15px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;color:#248a3d;pointer-events:none;animation:bbPlus 1.5s ease forwards;white-space:nowrap;text-align:right;text-shadow:0 1px 0 rgba(255,255,255,.8)}
.bb-plus small{font:600 11.5px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;color:#6e6e73;display:flex;align-items:center;gap:4px}
.bb-plus.hot{color:#ff6b00} .bb-plus.cool{color:#6e6e73}
.bb-plus svg,.bb-streak svg,.bb-stats .fl svg{width:.9em;height:1em;vertical-align:-1px}
[data-theme="dark"] .bb-plus{text-shadow:none} [data-theme="dark"] .bb-plus small{color:#98989f}
.bb-streak{position:absolute;top:-8px;left:-10px;display:inline-flex;align-items:center;gap:1px;font:800 11px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;color:#fff;background:linear-gradient(180deg,#ff9f0a,#ff6b00);border-radius:980px;padding:2px 6px 2px 5px;box-shadow:0 2px 6px rgba(255,107,0,.4);font-variant-numeric:tabular-nums}
.bb-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 0 12px}
.bb-stats div{background:var(--c-fill);border-radius:12px;padding:8px 4px;display:flex;flex-direction:column;align-items:center}
.bb-stats b{font:700 20px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;font-variant-numeric:tabular-nums;display:flex;align-items:center;gap:2px}
.bb-stats .fl{color:#ff6b00;font-style:normal}
.bb-stats span{font-size:11.5px;color:var(--c-muted)}
.bb-how{text-align:left;background:var(--c-fill);border-radius:14px;padding:10px 14px;margin:0 0 14px;font-size:13.5px}
.bb-how summary{cursor:pointer;font-weight:600;color:var(--c-acc)}
.bb-how p{margin:8px 0 0}
.bb-tiers{list-style:none;margin:8px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px}
.bb-tiers li{display:flex;align-items:center;gap:8px;font-variant-numeric:tabular-nums}
.xpb{display:inline-flex;align-items:center;font:700 10.5px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;letter-spacing:.01em;border-radius:980px;padding:2px 8px;text-transform:none;white-space:nowrap}
.xpb.t-easy{background:rgba(52,199,89,.16);color:#1f7a37} .xpb.t-medium{background:rgba(10,132,255,.14);color:#0060c7}
.xpb.t-hard{background:rgba(255,159,10,.18);color:#b25000} .xpb.t-expert{background:rgba(255,55,95,.15);color:#c4153f}
[data-theme="dark"] .xpb.t-easy{color:#30d158} [data-theme="dark"] .xpb.t-medium{color:#409cff} [data-theme="dark"] .xpb.t-hard{color:#ffb340} [data-theme="dark"] .xpb.t-expert{color:#ff6482}
[data-theme="dark"] .bb-plus{color:#30d158}
body.bb-on{padding-bottom:96px}
.bb-veil{position:fixed;inset:0;z-index:110;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;padding:16px;animation:bbFade .2s ease}
.bb-card{--c-bg:#fff;--c-ink:#1d1d1f;--c-muted:#6e6e73;--c-fill:#f2f2f7;--c-acc:#0071e3;width:min(400px,100%);max-height:90vh;overflow:auto;background:var(--c-bg);color:var(--c-ink);border-radius:24px;box-shadow:0 24px 80px rgba(0,0,0,.3);padding:22px 22px 18px;font:15px/1.45 -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif;letter-spacing:-.015em;text-align:center;animation:bbUp .3s cubic-bezier(.2,.8,.2,1)}
[data-theme="dark"] .bb-card{--c-bg:#1c1c1e;--c-ink:#f5f5f7;--c-muted:#98989f;--c-fill:#2c2c2e;--c-acc:#0a84ff}
.bb-card .bb-big{width:170px;height:170px;margin:0 auto -4px;animation:bbIdle 3s ease-in-out infinite}
.bb-card h3{margin:0;font:700 26px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;letter-spacing:-.03em}
.bb-card .bb-sub{color:var(--c-muted);margin:2px 0 12px;font-size:14px}
.bb-bar{height:8px;border-radius:980px;background:var(--c-fill);overflow:hidden;margin:4px 0 6px}
.bb-bar i{display:block;height:100%;background:linear-gradient(90deg,#34c759,#30d158);border-radius:inherit;transition:width .6s}
.bb-next{font-size:13.5px;color:var(--c-muted);margin:0 0 14px;font-variant-numeric:tabular-nums}
.bb-fact{text-align:left;background:var(--c-fill);border-radius:14px;padding:12px 14px;font-size:14px;margin:0 0 14px}
.bb-fact b{display:block;font-size:12px;color:var(--c-muted);font-weight:600;margin-bottom:2px}
.bb-line{display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin:0 0 14px}
.bb-line div{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10.5px;color:var(--c-muted)}
.bb-line svg{width:var(--lz,46px);height:var(--lz,46px)}.bb-line div{justify-content:flex-end}
.bb-line .lock svg{filter:brightness(0);opacity:.18}
[data-theme="dark"] .bb-line .lock svg{filter:brightness(0) invert(1);opacity:.18}
.bb-line .cur{color:var(--c-ink);font-weight:600}
.bb-acts{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.bb-acts button{font-weight:500;font-size:15px;font-family:inherit;border:0;border-radius:980px;padding:9px 16px;cursor:pointer;background:var(--c-fill);color:var(--c-acc)}
.bb-acts .pri{background:var(--c-acc);color:#fff}
/* Evolution */
.bb-evo{position:fixed;inset:0;z-index:120;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:radial-gradient(circle at 50% 45%,#2b3b6b 0%,#0b0f1e 70%);color:#fff;text-align:center;padding:24px;font:17px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;animation:bbFade .3s ease}
.bb-evo .stage{position:relative;width:220px;height:220px}
.bb-evo .stage svg{position:absolute;inset:0;width:100%;height:100%}
.bb-evo .old{animation:bbFlickOld 2.6s ease-in forwards}
.bb-evo .new{opacity:0;animation:bbFlickNew 2.6s ease-in forwards}
.bb-evo .glow{position:absolute;inset:-30px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.9) 0%,rgba(255,255,255,0) 60%);opacity:0;animation:bbGlow 2.6s ease-in forwards}
.bb-evo.done .new{opacity:1;animation:bbIdle 3s ease-in-out infinite} .bb-evo.done .old,.bb-evo.done .glow{display:none}
.bb-evo h2{margin:0;font:700 28px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;letter-spacing:-.03em}
.bb-evo p{margin:0;max-width:34ch;opacity:.9;font-size:15px}
.bb-evo .msg{min-height:1.4em;font-size:18px;opacity:.95}
.bb-evo button{margin-top:6px;font-weight:600;font-size:17px;font-family:inherit;border:0;border-radius:980px;padding:12px 26px;background:#fff;color:#0b0f1e;cursor:pointer;opacity:0;pointer-events:none;transition:opacity .4s}
.bb-evo.done button{opacity:1;pointer-events:auto}
.bb-evo .reveal{opacity:0;transition:opacity .5s} .bb-evo.done .reveal{opacity:1}
.bb-leaf{position:fixed;z-index:121;width:16px;height:10px;border-radius:0 100% 0 100%;pointer-events:none;animation:bbBurst 1.4s ease-out forwards}
@media (max-width:560px){.bb-dock{width:50px;height:50px;right:max(10px,env(safe-area-inset-right,0px));bottom:max(10px,env(safe-area-inset-bottom,0px))}.bb-dock .bb-pic{width:38px;height:38px}.bb-dock .bb-lv{font-size:9.5px;padding:1px 6px;bottom:-5px}}
.bb-say{position:fixed;z-index:47;pointer-events:none;font:800 16px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;color:#1d1d1f;background:#fff;border:2.5px solid #3a2a1e;border-radius:16px;padding:5px 11px;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.15);transform-origin:100% 100%;animation:bbSay 1.5s cubic-bezier(.3,1.6,.5,1) forwards}
.bb-say::after{content:"";position:absolute;right:-9px;bottom:6px;border:7px solid transparent;border-left:10px solid #3a2a1e;border-right:0}
.bb-say::before{content:"";position:absolute;right:-5.5px;bottom:8px;border:5px solid transparent;border-left:7px solid #fff;border-right:0;z-index:1}
[data-theme="dark"] .bb-say{background:#fff;color:#1d1d1f}
.bb-yarn{position:fixed;z-index:47;width:26px;height:26px;pointer-events:none;animation:bbDrop 1.6s cubic-bezier(.3,0,.6,1) forwards}
.bb-yarn svg{width:100%;height:100%;animation:bbRoll 1.6s linear forwards}
.bb-dock.sad .bb-pic{animation:bbSad .5s ease}
@keyframes bbSay{0%{opacity:0;transform:scale(.3) rotate(-8deg)}18%{opacity:1;transform:scale(1.12) rotate(3deg)}30%{transform:scale(1) rotate(-2deg)}42%{transform:rotate(2deg)}54%{transform:rotate(0)}82%{opacity:1}100%{opacity:0;transform:translateY(-8px)}}
@keyframes bbDrop{0%{transform:translate(0,0)}30%{transform:translate(-6px,var(--fall))}45%{transform:translate(-14px,calc(var(--fall) - 14px))}60%{transform:translate(-22px,var(--fall))}70%{transform:translate(-28px,calc(var(--fall) - 5px))}80%{transform:translate(-34px,var(--fall));opacity:1}100%{transform:translate(-70px,var(--fall));opacity:0}}
@keyframes bbRoll{to{transform:rotate(-420deg)}}
@keyframes bbSad{0%,100%{transform:none}25%{transform:translateX(-3px) rotate(-6deg)}50%{transform:translateX(3px) rotate(5deg)}75%{transform:translateX(-2px) rotate(-3deg)}}
@keyframes bbIdle{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes bbHop{0%{transform:translateY(0) scale(1)}35%{transform:translateY(-10px) scale(1.08,.95)}70%{transform:translateY(0) scale(.96,1.04)}100%{transform:none}}
@keyframes bbPlus{0%{opacity:0;transform:translateY(0)}12%{opacity:1}75%{opacity:1}100%{opacity:0;transform:translateY(-40px)}}
@keyframes bbFade{from{opacity:0}} @keyframes bbUp{from{opacity:0;transform:translateY(20px) scale(.97)}}
@keyframes bbFlickOld{0%,12%{opacity:1;filter:none}20%{opacity:1;filter:brightness(0) invert(1)}30%{opacity:0}38%{opacity:1}46%{opacity:0}52%{opacity:1}58%{opacity:0}62%{opacity:1}66%{opacity:0}69%{opacity:1}72%,100%{opacity:0;filter:brightness(0) invert(1)}}
@keyframes bbFlickNew{0%,28%{opacity:0;filter:brightness(0) invert(1)}30%{opacity:1}38%{opacity:0}46%{opacity:1}52%{opacity:0}58%{opacity:1}62%{opacity:0}66%{opacity:1}69%{opacity:0}72%,86%{opacity:1;filter:brightness(0) invert(1)}100%{opacity:1;filter:none}}
@keyframes bbGlow{0%,60%{opacity:0;transform:scale(.6)}80%{opacity:1;transform:scale(1.2)}100%{opacity:0;transform:scale(1.5)}}
@keyframes bbBurst{0%{opacity:1;transform:translate(0,0) rotate(0)}100%{opacity:0;transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}
.coin,.sh-tile .coin{width:1em;height:1em;vertical-align:-.14em;margin-right:2px;flex:none}
.bb-stats{grid-template-columns:repeat(4,1fr)!important}
.bb-stats .gold b{color:#b07d0f;display:flex;align-items:center;gap:2px} [data-theme="dark"] .bb-stats .gold b{color:#ffcf33}
.bb-plus .gc{display:inline-flex;align-items:center;color:#b07d0f;margin-left:4px} [data-theme="dark"] .bb-plus .gc{color:#ffcf33}
.bb-plus.buy{color:#b07d0f}
.evo-gold{display:flex!important;align-items:center;justify-content:center;gap:4px;margin:8px 0 0!important;font-weight:700;color:#ffd84a;opacity:1!important}
.bb-shopbtn{width:100%;display:flex;align-items:center;gap:12px;text-align:left;border:0;cursor:pointer;background:linear-gradient(135deg,#fff4d6,#ffe7b0);border-radius:16px;padding:12px 14px;margin:0 0 14px;color:#1d1d1f;font-family:inherit}
[data-theme="dark"] .bb-shopbtn{background:linear-gradient(135deg,#3a2f12,#4a3a12);color:#f5f5f7}
.bb-shopbtn .ic{width:38px;height:38px;border-radius:11px;background:#ffcf33;display:grid;place-items:center;color:#5a3c00;flex:none}
.bb-shopbtn .ic svg{width:22px;height:22px}
.bb-shopbtn b{display:block;font-size:16px} .bb-shopbtn small{display:block;font-size:12.5px;opacity:.75}
.bb-shopbtn .go{margin-left:auto;font-size:24px;opacity:.5}
.bb-shop{width:min(520px,100%);text-align:left;padding:0 0 16px}
.sh-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:14px 18px 10px;background:color-mix(in srgb,var(--c-bg) 88%,transparent);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}
.sh-head h3{font-size:20px!important;margin:0;flex:1}
.sh-gold{display:inline-flex;align-items:center;gap:3px;font:700 15px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;background:#fff4d6;color:#8a5a00;border-radius:980px;padding:5px 11px;font-variant-numeric:tabular-nums}
[data-theme="dark"] .sh-gold{background:#3a2f12;color:#ffcf33}
.sh-done{border:0;background:none;color:var(--c-acc);font:600 17px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;cursor:pointer}
.sh-stage{height:214px;display:grid;place-items:center;background:radial-gradient(circle at 50% 60%,#fff6dc 0%,var(--c-fill) 70%);margin:0 16px;border-radius:18px}
[data-theme="dark"] .sh-stage{background:radial-gradient(circle at 50% 60%,#3a3420 0%,var(--c-fill) 70%)}
.sh-stage svg{width:calc(170px * var(--dz,1));height:calc(170px * var(--dz,1))}
.sh-bar{display:flex;align-items:center;gap:10px;min-height:56px;margin:10px 16px 4px}
.sh-sel{flex:1;min-width:0;display:flex;flex-direction:column} .sh-sel b{font-size:16px} .sh-sel span{font-size:13px;color:var(--c-muted);display:flex;align-items:center;gap:2px}
.sh-hint{flex:1;margin:0;color:var(--c-muted);font-size:14px;text-align:center}
.sh-act{border:0;border-radius:980px;background:var(--c-acc);color:#fff;font:600 15px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;padding:10px 18px;cursor:pointer;white-space:nowrap}
.sh-act.ghost{background:var(--c-fill);color:var(--c-acc)} .sh-act:disabled{background:var(--c-fill);color:var(--c-muted);cursor:default}
.sh-tabs{display:grid;grid-template-columns:repeat(var(--tabs,3),1fr);gap:2px;background:var(--c-fill);border-radius:9px;padding:2px;margin:6px 16px 4px}
.sh-tabs button{border:0;background:transparent;color:inherit;border-radius:7px;padding:7px 4px;font:500 14px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;cursor:pointer}
.sh-tabs button[aria-selected="true"]{background:#fff;box-shadow:0 3px 8px rgba(0,0,0,.12)} [data-theme="dark"] .sh-tabs button[aria-selected="true"]{background:#636366}
.sh-cap{margin:14px 18px 6px;font-size:13px;color:var(--c-muted);text-transform:uppercase;letter-spacing:.02em}
.sh-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 16px}
.sh-tile{position:relative;display:flex;flex-direction:column;align-items:center;gap:2px;border:2px solid transparent;background:var(--c-fill);border-radius:16px;padding:8px 6px 9px;cursor:pointer;color:inherit;font-family:inherit;text-align:center}
.sh-tile>svg{width:100%;height:58px}
.sh-tile b{font-size:12.5px;line-height:1.2;font-weight:600}
.sh-tile .tag{font-size:10.5px;color:var(--c-muted)}
.sh-tile .pr{display:inline-flex;align-items:center;font:700 12px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;color:#8a5a00;margin-top:2px} [data-theme="dark"] .sh-tile .pr{color:#ffcf33}
.sh-tile.sel{border-color:var(--c-acc);background:color-mix(in srgb,var(--c-acc) 10%,var(--c-fill))}
.sh-tile.on .pr{color:#248a3d} [data-theme="dark"] .sh-tile.on .pr{color:#30d158}
.sh-tile.on::after{content:"✓";position:absolute;top:6px;right:8px;font-weight:800;color:#248a3d}
.sh-note{margin:16px 18px 0;font-size:12.5px;color:var(--c-muted)}
@media (max-width:420px){.sh-grid{grid-template-columns:repeat(3,1fr)}.sh-tile>svg{height:50px}}
.sh-tabs.pal{margin:2px 16px 10px;grid-template-columns:repeat(5,1fr) auto}.sh-tabs.pal .sh-gear{padding:7px 10px;font-size:16px}.sh-tabs.pal button{font-size:13.5px;padding:7px 2px}
.ct-list{display:flex;flex-direction:column;gap:8px;margin:0 16px 12px}
.ct-cat{display:grid;grid-template-columns:64px 1fr auto;gap:10px;align-items:center;background:var(--c-fill);border-radius:16px;padding:8px 12px 8px 6px;text-align:left}
.ct-cat.on{background:color-mix(in srgb,#34c759 14%,var(--c-fill));box-shadow:inset 0 0 0 2px #34c759}
.ct-cat svg{width:64px;height:64px}.ct-cat b{display:block;font-size:16px}.ct-cat small{display:block;color:var(--c-muted);font-size:12.5px;line-height:1.3}
.ct-btns{display:flex;flex-direction:column;gap:6px;align-items:stretch}.ct-btns .sh-act{padding:7px 12px;font-size:13px}
.ct-tag{font:700 11.5px -apple-system,sans-serif;color:#248a3d;background:#fff;border-radius:999px;padding:4px 9px;text-align:center}
.ct-unpin{border:0;background:none;color:var(--c-acc);font:600 12px -apple-system,sans-serif;cursor:pointer;padding:0}
.ct-along{display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--c-muted);cursor:pointer}.ct-along input{width:18px;height:18px;accent-color:var(--c-acc)}.ct-co input:disabled+*,.ct-along:has(input:disabled){opacity:.45;cursor:default}
.ct-split{font-size:11.5px;color:var(--c-muted);font-weight:600}.xsplit{font-size:.8em;opacity:.85}.bb-mate.co .bb-mname{background:#fff4c2}.bb-pal.bb-inway,.bb-mate.bb-inway{opacity:.45}
.bb-mate.stk .bb-mname{display:none}.bb-mate.stk.co::after{content:"📚";position:absolute;right:2%;top:30%;font-size:11px;filter:drop-shadow(0 1px 1px rgba(0,0,0,.25))}.bb-crowd .bb-mate .bb-mname{font-size:8.5px;padding:1px 4px;max-width:50px;overflow:hidden;text-overflow:ellipsis}
.ct-h{margin:14px 16px 6px;text-align:left;font:700 16px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif}.ct-h small{display:block;font:400 13px -apple-system,sans-serif;color:var(--c-muted);margin-top:2px}
.ct-cafe{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;width:calc(100% - 32px);margin:4px 16px 14px;border:0;border-radius:18px;padding:14px 16px;cursor:pointer;text-align:left;font:inherit;color:#4a2f1d;background:linear-gradient(135deg,#ffe8c7,#f9c99a);box-shadow:0 6px 18px rgba(201,120,40,.25)}
.ct-cafe .ic{font-size:30px}.ct-cafe b{display:block;font-size:17px}.ct-cafe small{display:block;font-size:13px;opacity:.85}.ct-cafe i{font-style:normal;font-size:24px}
.ct-breeds{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 16px 10px}
.ct-breed{border:2px solid transparent;background:var(--c-fill);border-radius:16px;padding:6px 4px 8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;font:inherit;color:inherit}
.ct-breed svg{width:72px;height:72px}.ct-breed b{font-size:13px}.ct-breed.sel{border-color:var(--c-acc);background:color-mix(in srgb,var(--c-acc) 10%,var(--c-fill))}
.ct-adopt{margin:0 16px 14px;background:var(--c-fill);border-radius:16px;padding:12px 14px;text-align:left}
.ct-adopt p{margin:0 0 8px;font-size:13.5px;color:var(--c-muted)}.ct-row{display:flex;gap:8px;flex-wrap:wrap}
.ct-row input{flex:1;min-width:130px;border:1.5px solid rgba(0,0,0,.12);border-radius:12px;padding:9px 12px;font:500 15px -apple-system,sans-serif;background:var(--c-bg);color:var(--c-ink)}
.bc-case{margin:4px 16px 12px;border-radius:20px;padding:14px 14px 16px;background:linear-gradient(160deg,#c62828,#8e1b1b);box-shadow:inset 0 2px 0 rgba(255,255,255,.25),0 6px 18px rgba(142,27,27,.3);color:#fff}
.bc-top{display:flex;align-items:center;justify-content:space-between;font:700 15px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;margin:0 4px 10px;letter-spacing:.02em}
.bc-top small{font:600 12.5px -apple-system,sans-serif;opacity:.85}
.bc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:#1d1d1f;border-radius:14px;padding:10px;box-shadow:inset 0 3px 8px rgba(0,0,0,.6)}
.bc-slot{aspect-ratio:1;border:0;border-radius:12px;background:radial-gradient(circle at 50% 40%,#3a3a3c,#2c2c2e);display:grid;place-items:center;cursor:pointer;padding:6px;position:relative}
.bc-slot svg{width:100%;height:100%;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))}
.bc-n{position:absolute;bottom:2px;right:4px;font:700 10.5px -apple-system,sans-serif;font-style:normal;color:#ffd60a}
.bc-tier{font-style:normal;font-size:11.5px;font-weight:700;border-radius:999px;padding:2px 8px;margin-left:4px;vertical-align:2px;background:#e5e5ea;color:#3a3a3c}
.bc-tier.t1{background:#e3f2ff;color:#0a64c2}.bc-tier.t2{background:#fff4c2;color:#a05a00}.bc-tier.t3{background:linear-gradient(90deg,#ffe066,#ffb300);color:#5a3300}.bc-tier.t4{background:linear-gradient(90deg,#ff375f,#ff9f0a,#ffd60a,#34c759,#0a84ff,#bf5af2);color:#fff;text-shadow:0 1px 1px rgba(0,0,0,.3)}
.bc-slot.lock svg{filter:brightness(0) opacity(.35)}.bc-slot.lock::after{content:"?";position:absolute;color:#8e8e93;font:700 18px -apple-system,sans-serif}
.bc-slot.sel{outline:3px solid #ffd60a;outline-offset:1px}.bc-slot.worn::before{content:"📌";position:absolute;top:-4px;right:-2px;font-size:13px}
.bc-detail{margin:0 16px 14px;background:var(--c-fill);border-radius:16px;padding:12px 14px;display:flex;gap:12px;align-items:center}
.bc-detail svg{width:58px;height:58px;flex:none}.bc-detail b{display:block;font-size:16px}.bc-detail span{font-size:13.5px;opacity:.75}
.bc-detail .sh-act{margin-top:8px}.bc-detail .bc-txt{flex:1}
.bb-badge-won{position:fixed;inset:0;z-index:125;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:radial-gradient(circle at 50% 42%,#4a1414 0%,#0b0f1e 72%);color:#fff;text-align:center;padding:24px;animation:bbFade .3s ease}
.bb-badge-won svg.big{width:150px;height:150px;animation:bcSpin 1.1s cubic-bezier(.2,.9,.3,1.2) both;filter:drop-shadow(0 0 22px rgba(255,214,10,.55))}
.bb-badge-won h3{margin:0;font:800 26px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif}.bb-badge-won p{margin:0;opacity:.85;font-size:15px;max-width:340px}
.bb-badge-won .row{display:flex;gap:10px;margin-top:6px}.bb-badge-won button{border:0;border-radius:980px;padding:11px 20px;font:600 16px -apple-system,sans-serif;cursor:pointer;background:#fff;color:#0b0f1e}.bb-badge-won button.ghost{background:rgba(255,255,255,.16);color:#fff}
@keyframes bcSpin{from{transform:rotateY(540deg) scale(.2);opacity:0}to{transform:none;opacity:1}}
.sh-tabs.sub{margin-top:4px}
.sh-tile .cl-ic{display:grid;place-items:center;height:58px;color:var(--c-muted)} .sh-tile .cl-ic svg{width:30px;height:30px}
.cl-cats{display:flex;gap:8px;overflow-x:auto;padding:4px 16px 10px;scrollbar-width:none;-webkit-overflow-scrolling:touch}.cl-cats::-webkit-scrollbar{display:none}
.cl-cat{flex:none;width:68px;border:2px solid transparent;border-radius:14px;background:var(--c-fill);padding:4px 2px 6px;display:flex;flex-direction:column;align-items:center;gap:1px;cursor:pointer;font:inherit;color:inherit}
.cl-cat svg{width:46px;height:46px}.cl-cat b{font-size:11.5px;max-width:62px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cl-cat small{font-size:9.5px;color:#248a3d;font-weight:700}
.cl-cat.on{border-color:#34c759;background:color-mix(in srgb,#34c759 12%,var(--c-fill))}
.cl-stage{position:relative}.cl-who{display:grid;place-items:center}
.cl-arrow{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.9);box-shadow:0 2px 8px rgba(0,0,0,.15);font:600 26px/1 -apple-system,sans-serif;color:#3a3a3c;cursor:pointer;display:grid;place-items:center;padding:0 0 3px}
.cl-arrow.l{left:10px}.cl-arrow.r{right:10px}
.cl-name{position:absolute;left:50%;bottom:8px;transform:translateX(-50%);font-size:12.5px;background:rgba(255,255,255,.88);color:#3a3a3c;border-radius:999px;padding:3px 10px;white-space:nowrap}
.ct-dress{border:0;background:var(--c-fill);color:var(--c-acc);border-radius:999px;padding:6px 11px;font:600 13px -apple-system,BlinkMacSystemFont,sans-serif;cursor:pointer}
.sh-tile.clb>svg{height:56px;width:56px;margin:2px auto;filter:drop-shadow(0 2px 3px rgba(0,0,0,.25))}.sh-tile.clb.lock{opacity:.75}.sh-cap .cl-bcount{font-weight:500;color:var(--c-muted);margin-left:6px;font-size:.85em;text-transform:none;letter-spacing:0}
.sh-tile.cl.on{border-color:#34c759;background:color-mix(in srgb,#34c759 12%,var(--c-fill))}
.sh-tile.cl.on::after{content:"✓";position:absolute;top:6px;right:8px;font-weight:800;color:#248a3d}
.cl-empty{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;background:var(--c-fill);border-radius:16px;padding:16px;margin:6px 16px 4px}
.cl-empty span{font-size:13.5px;color:var(--c-muted)}
.cl-collar{margin:4px 16px 10px;background:var(--c-fill);border-radius:16px;padding:12px 14px;text-align:left}
.cl-swatches{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 6px}
.cl-sw{width:32px;height:32px;border-radius:50%;border:3px solid var(--c-bg,#fff);background:var(--sw);box-shadow:0 0 0 1.5px rgba(0,0,0,.18);cursor:pointer;padding:0}
.cl-sw.on{box-shadow:0 0 0 3px var(--c-acc);transform:scale(1.08)}
.cl-cnote{margin:4px 0 0;font-size:13px;color:var(--c-muted)}.cl-link{border:0;background:none;color:var(--c-acc);font:600 13px -apple-system,sans-serif;cursor:pointer;padding:0}
.cl-weight{margin:4px 16px 10px;background:var(--c-fill);border-radius:16px;padding:12px 14px}
.cl-wtop{display:flex;justify-content:space-between;align-items:baseline;font-size:15px}.cl-wtop span{color:var(--c-acc);font-weight:600}
.cl-wrow{display:flex;align-items:center;gap:10px;margin:8px 0 6px;font-size:20px}.cl-wrow input{flex:1;accent-color:var(--c-acc)}
.cl-wbtns{display:flex;gap:6px;flex-wrap:wrap}.cl-wbtns button{border:0;border-radius:980px;padding:6px 12px;background:var(--c-bg,#fff);color:var(--c-acc);font:600 13px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;cursor:pointer}
.cl-reset{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:16px 16px 0}
.pal-prog{text-align:center;padding:0 22px}
.bb-shop.still{animation:none}
/* Study pal: Dexter beside the question, playing with yarn */
.bb-pal{position:fixed;left:0;top:0;z-index:58;width:var(--ps,72px);height:var(--ps,72px);border:0;padding:0;margin:0;background:none;cursor:pointer;transition:transform .55s cubic-bezier(.34,1.3,.5,1),opacity .3s;-webkit-tap-highlight-color:transparent}
.bb-palon .bb-dock{display:none}
.cf-veil{position:fixed;inset:0;z-index:130;background:rgba(40,24,12,.55);display:flex;align-items:center;justify-content:center;animation:bbFade .3s}
.cf-room{position:relative;width:min(520px,100vw);height:min(920px,100dvh,100vh);background:#fbeedd;overflow:hidden;border-radius:clamp(0px,calc((100vw - 520px) * 9),26px);box-shadow:0 30px 80px rgba(0,0,0,.4)}
.cf-scene{position:absolute;inset:0;width:100%;height:100%;display:block}
@media (min-width:900px){.cf-room{width:100vw;height:100vh;height:100dvh;border-radius:0;box-shadow:none}}
.cf-top{position:absolute;z-index:2;top:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 10px;background:linear-gradient(rgba(74,47,29,.82),rgba(74,47,29,0));color:#fff}
.cf-top b{display:block;font:800 20px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif}.cf-top small{font:500 13px -apple-system,sans-serif;opacity:.9}
.cf-x{border:0;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.9);color:#4a2f1d;font-size:16px;cursor:pointer}
.cf-cat{cursor:pointer;transition:transform 2.3s ease-in-out;outline:none}.cf-cat:hover>svg,.cf-cat:focus>svg{filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 8px #ffd84a)}
.cf-cat .dx-blink{animation:bbBlink 5s ease-in-out infinite}.cf-cat .dx-tail{animation:bbTailSway 3.4s ease-in-out infinite}.cf-cat .dx-earr{animation:bbEarFlick 7s ease-in-out infinite}
.cf-cat.walk .dx-pawl,.cf-cat.walk .dx-hindr{animation:bbStride .36s ease-in-out infinite alternate}.cf-cat.walk .dx-pawr,.cf-cat.walk .dx-hindl{animation:bbStride .36s ease-in-out -.36s infinite alternate-reverse}
.cf-safari{background:#8fd0f5}.cf-pan{position:absolute;inset:0;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none}.cf-pan::-webkit-scrollbar{display:none}
.cf-pan .cf-scene{position:relative;inset:auto;height:100%;width:auto;min-width:100%;aspect-ratio:1160/640}
.cf-pan.cf-fit{overflow:hidden}.cf-pan.cf-fit .cf-scene{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto}
.ct-safari{background:linear-gradient(135deg,rgba(120,200,120,.35),rgba(255,214,120,.35))!important;margin-top:8px}
.cf-prop{cursor:pointer;outline:none}.cf-prop:hover,.cf-prop:focus-visible{filter:drop-shadow(0 0 3px #fff) drop-shadow(0 0 6px #ffd84a)}
.cf-wheel{transform-box:view-box;transform-origin:0 0}.cf-prop.go .cf-wheel{animation:cfSpin 2.4s cubic-bezier(.2,.7,.3,1)}
@keyframes cfSpin{to{transform:rotate(900deg)}}
.cf-swing{transform-box:view-box}.cf-prop.go .cf-swing{animation:cfSwing 2.2s ease-out}
@keyframes cfSwing{0%{transform:rotate(0)}12%{transform:rotate(28deg)}30%{transform:rotate(-22deg)}50%{transform:rotate(14deg)}70%{transform:rotate(-7deg)}100%{transform:rotate(0)}}
.cf-jar{transform-box:fill-box;transform-origin:50% 100%}.cf-prop.go .cf-jar{animation:cfShake .5s ease-in-out 3}
@keyframes cfShake{25%{transform:rotate(-14deg)}75%{transform:rotate(14deg)}}
.cf-treat{opacity:0}.cf-prop.go .cf-treat{animation:cfTreat 1.3s cubic-bezier(.3,0,.7,1) forwards}
@keyframes cfTreat{0%{opacity:1;transform:translate(0,0)}100%{opacity:0;transform:translate(var(--dx),var(--dy))}}
@media (prefers-reduced-motion:reduce){.cf-prop.go *{animation:none!important}}
.cf-bub{animation:bbFade .3s}.cf-cat.play>svg{animation:bbHop .8s cubic-bezier(.3,1.6,.5,1)}
.cf-sheet{position:absolute;z-index:3;left:0;right:0;bottom:0;background:#fffaf3;border-radius:24px 24px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 30px rgba(0,0,0,.25);animation:bbUp .3s;max-height:78%;overflow:auto;color:#3a2a1e}
.cf-close{position:absolute;top:10px;right:12px;border:0;background:#f1e4d3;width:32px;height:32px;border-radius:50%;cursor:pointer;color:#4a2f1d}
.cf-meet{display:grid;grid-template-columns:120px 1fr;gap:12px;align-items:center}.cf-meet>svg{width:120px;height:120px;background:radial-gradient(circle,#ffe9c9,#fffaf3 70%);border-radius:50%}
.cf-kicker{margin:0;font:700 11.5px -apple-system,sans-serif;text-transform:uppercase;letter-spacing:.06em;color:#c27a2c}.cf-meet h3{margin:2px 0 4px;font:800 22px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif}
.cf-desc{margin:0 0 4px;font-size:14px;line-height:1.4;color:#6b5240}
.cf-lab{margin:14px 0 6px;font:700 12px -apple-system,sans-serif;text-transform:uppercase;letter-spacing:.05em;color:#8a6a50}
.cf-colors{display:flex;flex-wrap:wrap;gap:8px}.cf-col{display:flex;align-items:center;gap:6px;border:2px solid #ecdcc6;background:#fff;border-radius:999px;padding:5px 11px 5px 5px;font:600 13px -apple-system,sans-serif;color:#4a2f1d;cursor:pointer}
.cf-col i{width:22px;height:22px;border-radius:50%;border:1.5px solid #3a2a1e}.cf-col.on{border-color:#ff8a00;background:#fff4e6}
.cf-name{width:100%;border:2px solid #ecdcc6;border-radius:14px;padding:10px 12px;font:600 16px -apple-system,sans-serif;color:#3a2a1e;background:#fff}
.cf-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.cf-go{flex:1 1 140px;border:0;border-radius:14px;padding:13px 14px;font:700 15.5px -apple-system,sans-serif;cursor:pointer;background:linear-gradient(135deg,#ffb340,#ff8a00);color:#fff;box-shadow:0 4px 12px rgba(255,138,0,.3)}
.cf-go.alt{background:#fff;color:#c26a12;box-shadow:inset 0 0 0 2px #ffcf99}.cf-go.ghost{background:#f1e4d3;color:#6b5240;box-shadow:none}
@media (prefers-reduced-motion:reduce){.cf-cat{transition:none}}
.bb-tree{position:fixed;left:0;top:0;z-index:55;pointer-events:none;transition:transform .5s ease}.bb-tree svg{display:block;width:100%;height:100%;filter:drop-shadow(0 4px 10px rgba(0,0,0,.12))}
.bb-mate.leap .bb-palart{animation:bbLeap .8s cubic-bezier(.3,.7,.4,1)}
@keyframes bbLeap{0%{transform:none}30%{transform:translateY(8%) scaleY(.88)}60%{transform:translateY(-34%) scaleY(1.06)}100%{transform:none}}
.bb-mate{position:fixed;left:0;top:0;z-index:57;width:var(--ps,62px);height:var(--ps,62px);border:0;padding:0;margin:0;background:none;cursor:pointer;transition:transform .9s cubic-bezier(.3,1.1,.5,1);-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.bb-mate .bb-palart{position:absolute;inset:0;transform-origin:50% 92%}
.bb-mate.drag{transition:none;cursor:grabbing;z-index:130}.bb-mate.drag .bb-palart{transform:translateY(-6px) scale(1.1) rotate(-5deg);filter:drop-shadow(0 12px 14px rgba(0,0,0,.22))}
.bb-mate,.bb-mate *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}.bb-mate{touch-action:none}.bb-mate .bb-palart svg{width:100%;height:100%;filter:drop-shadow(0 3px 6px rgba(0,0,0,.16))}
.bb-mate .bb-mname{position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);font:700 9.5px -apple-system,BlinkMacSystemFont,sans-serif;background:rgba(255,255,255,.92);color:#3a3a3c;border-radius:999px;padding:1px 6px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.bb-mate:not(.act-nap) .dx-blink{animation:bbBlink 5.2s ease-in-out 1.3s infinite}
.bb-mate.hop .bb-palart{animation:bbHop .6s cubic-bezier(.3,1.6,.5,1)}
.bb-mate.moving .dx-pawl,.bb-mate.moving .dx-hindr{animation:bbStride .36s ease-in-out infinite alternate}.bb-mate.moving .dx-pawr,.bb-mate.moving .dx-hindl{animation:bbStride .36s ease-in-out -.36s infinite alternate-reverse}
.bb-mate.moving .bb-palart{animation:bbBob .18s ease-in-out infinite alternate}
.bb-mate.i-nuzzle .bb-palart{animation:bbNuzzle 2.6s ease-in-out}.bb-pal.i-nuzzle .bb-palart{animation:bbNuzzle 2.6s ease-in-out}
@keyframes bbNuzzle{0%,100%{transform:none}25%,75%{transform:translateX(calc(var(--side,1) * 16%)) rotate(calc(var(--side,1) * 9deg))}50%{transform:translateX(calc(var(--side,1) * 18%)) rotate(calc(var(--side,1) * 12deg))}}
.bb-mate.i-groom .bb-palart{animation:bbGroom 2.6s ease-in-out}
@keyframes bbGroom{0%,100%{transform:none}20%,80%{transform:translateX(calc(var(--side,1) * 20%)) translateY(-6%) rotate(calc(var(--side,1) * 14deg))}35%,65%{transform:translateX(calc(var(--side,1) * 22%)) translateY(-9%) rotate(calc(var(--side,1) * 18deg))}50%{transform:translateX(calc(var(--side,1) * 20%)) translateY(-6%) rotate(calc(var(--side,1) * 12deg))}}
.bb-mate.i-pounce .bb-palart{animation:bbPlayPounce 2.2s ease-in-out}
@keyframes bbPlayPounce{0%,50%{transform:translateY(6%) scaleY(.92)}55%,60%{transform:translateY(6%) scaleY(.92) rotate(calc(var(--side,1) * -3deg))}75%{transform:translateX(calc(var(--side,1) * 34%)) translateY(-26%)}90%{transform:translateX(calc(var(--side,1) * 30%))}100%{transform:none}}
.bb-mate.i-chase{z-index:56}.bb-mate.i-chase .bb-palart{animation:bbChase 2.8s ease-in-out}
@keyframes bbChase{0%{transform:none}45%{transform:translate(calc(var(--side,1) * var(--run,150px)),-8%)}50%{transform:translate(calc(var(--side,1) * var(--run,150px)),-8%) scaleX(-1)}95%{transform:scaleX(-1)}100%{transform:none}}
.bb-fx{position:fixed;z-index:60;pointer-events:none;font-size:16px;animation:bbFx 2s ease-out forwards}
@keyframes bbFx{0%{opacity:0;transform:translateY(0) scale(.6)}20%{opacity:1;transform:translateY(-8px) scale(1)}100%{opacity:0;transform:translateY(-46px) scale(.9)}}
@media (prefers-reduced-motion:reduce){.bb-mate .bb-palart,.bb-fx{animation:none!important}}
.bb-pal,.bb-dock{touch-action:none;-webkit-user-select:none;user-select:none;-webkit-user-drag:none;-webkit-touch-callout:none}
.bb-pal.drag,.bb-dock.drag{transition:none;cursor:grabbing;z-index:130}
.bb-pal.drag .bb-palart{transform:translateY(-6px) scale(1.1) rotate(-5deg);filter:drop-shadow(0 12px 14px rgba(0,0,0,.22))}
.bb-dock.drag{transform:scale(1.1);box-shadow:0 14px 30px rgba(0,0,0,.25)}
.bb-spot{margin:14px 0;padding:12px 14px;border-radius:14px;background:var(--c-fill);text-align:left;font-size:14px;line-height:1.4}
.bb-spot b{display:block;font-size:15px}.bb-spot small{display:block;opacity:.7;margin-top:2px}
.bb-size{display:flex;align-items:center;gap:10px;margin-top:10px;font-weight:600}.bb-size input{flex:1;accent-color:var(--c-acc)}.bb-size output{min-width:3.2em;text-align:right;font-variant-numeric:tabular-nums;font-weight:500;opacity:.75}
.bb-spot button{margin-top:8px;border:0;border-radius:980px;padding:7px 14px;background:var(--c-acc);color:#fff;font:600 14px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;cursor:pointer}
.bb-palon.bb-on{padding-bottom:110px}
.bb-pal .bb-palart{position:absolute;inset:0;transform-origin:50% 92%}
.bb-pal .bb-palart svg{width:100%;height:100%;filter:drop-shadow(0 4px 8px rgba(0,0,0,.18))}
.bb-pal .bb-toy{position:absolute;z-index:1;pointer-events:none}
.bb-pal .bb-toy svg{display:block;width:100%;height:100%}
.bb-pal.act-box .bb-lv{z-index:3;bottom:6%}.bb-pal.act-box .bb-streak{z-index:3}
.bb-pal .bb-boxfront{position:absolute;z-index:2;left:2%;right:2%;bottom:-3%;height:40%}
.bb-pal .bb-boxfront svg{display:block;width:100%;height:100%}
.act-yarn .bb-toy{width:27%;height:27%;left:2%;bottom:3%;animation:bbBat 2.6s ease-in-out infinite}
.act-yarn .bb-palart{animation:bbSway 2.6s ease-in-out infinite}
.act-butterfly .bb-toy{width:30%;height:24%;left:34%;top:-6%;animation:bbFly 4.2s ease-in-out infinite}
.act-butterfly .bb-toy .wl{transform-box:fill-box;transform-origin:right center;animation:bbFlap .16s ease-in-out infinite alternate}
.act-butterfly .bb-toy .wr{transform-box:fill-box;transform-origin:left center;animation:bbFlap .16s ease-in-out infinite alternate}
.act-butterfly .bb-palart,.act-leaf .bb-palart{animation:bbWatch 4.2s ease-in-out infinite}
.act-mouse .bb-toy{width:32%;height:19%;left:-14%;bottom:0;animation:bbScamper 3.4s ease-in-out infinite}
.act-mouse .bb-palart{animation:bbCrouch 3.4s ease-in-out infinite}
.act-laser .bb-toy{width:12%;height:12%;left:14%;bottom:5%;animation:bbLaser 2.4s steps(1) infinite}
.act-laser .bb-palart{animation:bbWiggle 1.2s ease-in-out infinite}
.act-feather .bb-toy{width:22%;height:56%;left:-2%;top:-44%;transform-origin:50% 0;animation:bbSwing 1.8s ease-in-out infinite}
.act-feather .bb-palart{animation:bbSwat 1.8s ease-in-out infinite}
.act-leaf .bb-toy{width:26%;height:18%;left:36%;top:-24%;animation:bbLeafFall 4.2s ease-in infinite}
.act-box .bb-palart{animation:bbPeek 3s ease-in-out infinite}
.act-tail .bb-palart{animation:bbTail 3.2s ease-in-out infinite}
.act-nap .bb-palart{animation:bbBreathe 3.2s ease-in-out infinite}
.act-nap .bb-toy{right:-4%;top:-14%;display:flex;gap:1px;font:800 13px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif;color:#7a8bd8}
.act-nap .bb-toy .zz{display:inline-block;animation:bbZ 2.4s ease-in-out infinite} .act-nap .bb-toy .zz:nth-child(2){animation-delay:.4s;font-size:1.15em} .act-nap .bb-toy .zz:nth-child(3){animation-delay:.8s;font-size:1.35em}
@keyframes bbFly{0%,100%{transform:translate(-140%,40%) rotate(-10deg)}22%{transform:translate(-50%,-70%) rotate(8deg)}48%{transform:translate(95%,-30%) rotate(-6deg)}68%{transform:translate(45%,70%) rotate(10deg)}84%{transform:translate(-70%,15%) rotate(-4deg)}}
@keyframes bbFlap{from{transform:scaleX(1)}to{transform:scaleX(.25)}}
@keyframes bbWatch{0%,100%{transform:rotate(-5deg)}22%{transform:rotate(-2deg) translateY(-2%)}48%{transform:rotate(6deg)}60%{transform:translateY(-12%) rotate(4deg)}68%{transform:rotate(3deg)}}
@keyframes bbScamper{0%{transform:translateX(0) scaleX(-1)}40%{transform:translateX(-80%) scaleX(-1)}46%{transform:translateX(-80%) scaleX(1)}86%{transform:translateX(30%) scaleX(1)}92%{transform:translateX(30%) scaleX(-1)}100%{transform:translateX(0) scaleX(-1)}}
@keyframes bbCrouch{0%,30%,100%{transform:none}38%{transform:scaleY(.9) translateY(5%)}46%{transform:translate(-9%,-11%) rotate(-9deg)}56%{transform:none}}
@keyframes bbLaser{0%{transform:translate(0,0)}20%{transform:translate(-180%,-140%)}40%{transform:translate(160%,-50%)}60%{transform:translate(-90%,30%)}80%{transform:translate(300%,10%)}}
@keyframes bbWiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-3deg) scaleY(.96)}40%{transform:rotate(3deg) scaleY(.96)}60%{transform:translate(4%,-8%) rotate(5deg)}80%{transform:none}}
@keyframes bbSwing{0%,100%{transform:rotate(-26deg)}50%{transform:rotate(22deg)}}
@keyframes bbSwat{0%,100%{transform:none}40%{transform:translateY(-6%) rotate(-10deg)}55%{transform:translateY(-2%) rotate(-4deg)}}
@keyframes bbLeafFall{0%{transform:translate(40%,-60%) rotate(0);opacity:0}10%{opacity:1}40%{transform:translate(-60%,120%) rotate(120deg)}70%{transform:translate(30%,300%) rotate(260deg);opacity:1}82%{transform:translate(0,330%) rotate(300deg);opacity:1}100%{transform:translate(0,330%) rotate(300deg);opacity:0}}
@keyframes bbPeek{0%,100%{transform:translateY(17%)}50%{transform:translateY(9%) rotate(3deg)}}
@keyframes bbTail{0%,35%,100%{transform:none}45%{transform:scaleX(-1) translateX(5%)}55%{transform:translateX(5%) rotate(6deg)}65%{transform:scaleX(-1) translateX(-5%) rotate(-6deg)}75%{transform:translateX(-3%)}}
@keyframes bbBreathe{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.95)}}
@keyframes bbZ{0%{transform:translateY(4px);opacity:0}30%{opacity:1}100%{transform:translateY(-10px);opacity:0}}
html:not(.bb-showlv) .bb-pal .bb-lv,html:not(.bb-showlv) .bb-dock .bb-lv,html:not(.bb-showlv) .bb-mate .bb-mlv{display:none}
.bb-mate .bb-mlv{font-weight:800;color:#6e6e73}.bb-showlv .bb-mate.stk .bb-mname{display:block}
.pf-card{margin:12px 16px 0;padding:14px 16px;border-radius:18px;background:var(--c-fill)}
.pf-top{display:flex;align-items:center;gap:12px}.pf-lv{flex:none;width:58px;height:58px;border-radius:50%;background:#1d1d1f;color:#fff;display:grid;place-items:center;text-align:center;font:800 20px/1 -apple-system,BlinkMacSystemFont,sans-serif}.pf-lv small{display:block;font-size:9.5px;font-weight:700;opacity:.7;letter-spacing:.04em}
[data-theme="dark"] .pf-lv{background:#f5f5f7;color:#1d1d1f}
.pf-who{min-width:0;flex:1}.pf-who b{display:block;font-size:16px}.pf-who span{display:block;font-size:13px;color:var(--c-muted)}
.pf-bar{height:8px;border-radius:99px;background:color-mix(in srgb,var(--c-muted) 22%,transparent);margin:10px 0 4px;overflow:hidden}.pf-bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#34c759,#30d158)}
.pf-xp{font-size:12px;color:var(--c-muted)}
.pf-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}.pf-grid div{background:var(--c-bg,rgba(255,255,255,.7));border-radius:12px;padding:8px 6px;text-align:center}
.pf-grid b{display:block;font-size:16px;font-variant-numeric:tabular-nums}.pf-grid span{display:block;font-size:11px;color:var(--c-muted)}
.pf-prog{margin:4px 16px 10px}.pf-acc{margin:16px 16px 0}
.pf-tog{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;font-size:14px;cursor:pointer}.pf-tog input{width:20px;height:20px;accent-color:#34c759}
.bb-pal .bb-lv{position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);font:700 10.5px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;background:#1d1d1f;color:#fff;border-radius:980px;padding:2px 7px;white-space:nowrap;font-variant-numeric:tabular-nums}
[data-theme="dark"] .bb-pal .bb-lv{background:#f5f5f7;color:#1d1d1f}
.bb-pal .bb-streak{top:-4px;left:-6px}
.bb-pal:hover .bb-palart{animation-duration:1.2s}
.bb-pal.run .bb-palart{animation:bbScurry .26s ease-in-out 3}
.bb-pal.hop .bb-palart{animation:bbHop .6s cubic-bezier(.3,1.6,.5,1)}
.bb-pal.sad .bb-palart{animation:bbPalSad .7s ease}
.bb-pal.lost .bb-toy{animation:bbLost 2.4s ease forwards!important}
.bb-greeting .bb-pal,.bb-greeting .bb-dock{opacity:0;pointer-events:none}
@keyframes bbSway{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg) translateY(-1.5px)}}
@keyframes bbBat{0%,100%{transform:translateX(0) rotate(0)}35%{transform:translateX(-60%) rotate(-280deg)}50%{transform:translateX(-58%) rotate(-270deg)}80%{transform:translateX(6%) rotate(20deg)}}
@keyframes bbScurry{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-7px) rotate(-7deg)}}
@keyframes bbPalSad{0%,100%{transform:none}30%{transform:translateY(3px) scaleY(.94)}60%{transform:rotate(-5deg)}}
@keyframes bbLost{0%{transform:none;opacity:1}35%{transform:translate(-300%,40%) rotate(-560deg);opacity:0}75%{transform:translate(-120%,0) rotate(-300deg);opacity:0}100%{transform:none;opacity:1}}
/* Greeting */
.bb-greet{position:fixed;inset:auto 0 0 0;z-index:120;pointer-events:none}
.bb-greet .gwrap{position:fixed;left:50%;bottom:calc(max(16px,env(safe-area-inset-bottom,0px)) + 6px);width:min(460px,calc(100vw - 20px));display:flex;align-items:flex-end;gap:4px;pointer-events:auto;transform:translateX(-50%);animation:bbWalkIn 1.1s cubic-bezier(.2,.85,.25,1) both}
.bb-greet .gbubble{flex:1;position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:6px;background:#fff;color:#1d1d1f;border-radius:20px;padding:13px 15px;margin-bottom:34px;box-shadow:0 12px 36px rgba(0,0,0,.2);font:15px/1.4 -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif;letter-spacing:-.012em;animation:bbBubble .45s cubic-bezier(.3,1.5,.5,1) .9s both}
.bb-greet .gbubble b{font:700 17px -apple-system,BlinkMacSystemFont,"SF Pro Display",sans-serif}
.bb-greet .gbubble::after{content:"";position:absolute;right:-9px;bottom:22px;border:9px solid transparent;border-left-color:#fff;border-right:0}
[data-theme="dark"] .bb-greet .gbubble{background:#2c2c2e;color:#f5f5f7} [data-theme="dark"] .bb-greet .gbubble::after{border-left-color:#2c2c2e}
.bb-greet .gbtn{border:0;border-radius:980px;background:#0071e3;color:#fff;font:600 14px -apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;padding:8px 15px;cursor:pointer}
.bb-greet .gdex{flex:none;width:128px;height:128px;border:0;padding:0;background:none;cursor:pointer;animation:bbWalkBob .28s ease-in-out 4,bbWave 1.4s ease-in-out 1.2s 2}
.bb-greet .gdex svg{width:100%;height:100%;filter:drop-shadow(0 6px 12px rgba(0,0,0,.2))}
.bb-greet.leave .gwrap{animation:bbWalkOut .55s ease-in forwards}
@keyframes bbWalkIn{from{opacity:0;transform:translateX(calc(-50% + 70vw))}to{opacity:1;transform:translateX(-50%)}}
@keyframes bbWalkOut{to{opacity:0;transform:translateX(calc(-50% + 45vw)) translateY(30px) scale(.35)}}
@keyframes bbWalkBob{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-8px) rotate(-5deg)}}
@keyframes bbWave{0%,100%{transform:rotate(0)}25%{transform:rotate(-6deg) translateY(-6px)}50%{transform:rotate(5deg)}75%{transform:rotate(-3deg) translateY(-3px)}}
@keyframes bbBubble{from{opacity:0;transform:scale(.6) translateX(30px)}to{opacity:1;transform:none}}
@media (max-width:420px){.bb-greet .gdex{width:104px;height:104px}.bb-greet .gbubble{font-size:14px}}
@media (prefers-reduced-motion:reduce){.bb-pal{transition:none}.bb-pal .bb-palart,.bb-pal .bb-toy,.bb-pal .bb-toy *,.bb-greet .gwrap,.bb-greet .gdex,.bb-greet .gbubble{animation:none!important}}
/* Dexter's body parts: pivot points */
.dx-head{transform-origin:60px 84px}.dx-tail{transform-origin:78px 98px}.dx-earl{transform-origin:45px 36px}.dx-earr{transform-origin:75px 36px}
.dx-pawl{transform-origin:52.6px 86px}.dx-pawr{transform-origin:67.4px 86px}.dx-hindl{transform-origin:92px 95px}.dx-hindr{transform-origin:85px 92px}
.pose-stand .dx-pawl{transform-origin:54px 90px}.pose-stand .dx-pawr{transform-origin:61px 90px}.pose-stand .dx-torso{transform-origin:74px 108px}.pose-stand .dx-tail{transform-origin:97px 84px}
.pose-lie .dx-pawl{transform-origin:38px 106px}.pose-lie .dx-pawr{transform-origin:50px 107px}.pose-lie .dx-torso{transform-origin:66px 108px}.pose-lie .dx-tail{transform-origin:96px 106px}
/* walking on four legs: diagonal pairs swing together, the body bobs, the tail streams */
.bb-pal.moving .dx-pawl,.bb-pal.moving .dx-hindr{animation:bbStride .36s ease-in-out infinite alternate}
.bb-pal.moving .dx-pawr,.bb-pal.moving .dx-hindl{animation:bbStride .36s ease-in-out -.36s infinite alternate-reverse}
.bb-pal.moving .dx-torso{animation:bbBob .18s ease-in-out infinite alternate}.bb-pal.moving .dx-tail{animation:bbTailStream .72s ease-in-out infinite}
.bb-pal.moving .bb-palart{animation:bbBob .18s ease-in-out infinite alternate}
@keyframes bbStride{from{transform:rotate(-22deg)}to{transform:rotate(20deg)}}
@keyframes bbBob{from{transform:translateY(0)}to{transform:translateY(-1.6px)}}
/* hunting on all fours: crouch low, hind legs tense, a little butt wiggle before the pounce */
.pose-stand.act-mouse .dx-hindl,.pose-stand.act-mouse .dx-hindr{animation:bbHindTense 3.4s ease-in-out infinite}
.pose-stand.act-laser .dx-hindl{animation:bbHindTense 2.4s ease-in-out infinite}
@keyframes bbHindTense{0%,30%,100%{transform:none}38%{transform:rotate(14deg) scaleY(.9)}46%{transform:rotate(-18deg)}56%{transform:none}}
.pose-lie .dx-torso{animation:bbBreathe 3.2s ease-in-out infinite}.dx-torso{transform-origin:60px 109px}.dx-eyes{transform-origin:60px 60px}.dx-blink{transform-origin:60px 61px}
/* every awake game: blinks, and a lazy ear flick now and then */
.bb-pal:not(.act-nap) .dx-blink,.bb-greet .dx-blink{animation:bbBlink 4.6s ease-in-out infinite}
.bb-pal .dx-earr{animation:bbEarFlick 6.2s ease-in-out infinite}
/* yarn: looks down at the ball, swats it with the left paw, tail swishes */
.act-yarn .dx-head{animation:bbYarnHead 2.6s ease-in-out infinite}.act-yarn .dx-pawl{animation:bbYarnSwat 2.6s ease-in-out infinite}
.act-yarn .dx-tail{animation:bbTailSway 2.6s ease-in-out infinite}.act-yarn .dx-eyes{animation:bbYarnEyes 2.6s ease-in-out infinite}
/* butterfly: head and eyes follow it, ears swivel, tail tip twitches, then he rears up with both paws */
.act-butterfly .dx-head,.act-leaf .dx-head{animation:bbFlyHead 4.2s ease-in-out infinite}.act-butterfly .dx-eyes{animation:bbFlyEyes 4.2s ease-in-out infinite}
.act-butterfly .dx-pawl{animation:bbRearL 4.2s ease-in-out infinite}.act-butterfly .dx-pawr{animation:bbRearR 4.2s ease-in-out infinite}
.act-butterfly .dx-tail,.act-laser .dx-tail{animation:bbTailTwitch .7s ease-in-out infinite}
.act-butterfly .dx-earl,.act-leaf .dx-earl{animation:bbEarSwivelL 2.1s ease-in-out infinite}.act-butterfly .dx-earr,.act-leaf .dx-earr{animation:bbEarSwivelR 2.1s ease-in-out infinite}
/* toy mouse: hunting crouch, butt wiggle, low tail lash, then both paws reach for the pounce */
.act-mouse .dx-head{animation:bbHuntHead 3.4s ease-in-out infinite}.act-mouse .dx-torso{animation:bbButtWiggle 3.4s ease-in-out infinite}
.act-mouse .dx-tail{animation:bbTailLash 3.4s ease-in-out infinite}.act-mouse .dx-pawl{animation:bbPounceL 3.4s ease-in-out infinite}.act-mouse .dx-pawr{animation:bbPounceR 3.4s ease-in-out infinite}
.act-mouse .dx-earl{transform:rotate(-12deg)}.act-mouse .dx-earr{animation:none;transform:rotate(12deg)}
/* laser dot: eyes and head jerk with every jump, ears pinned forward, a quick paw tap */
.act-laser .dx-head{animation:bbLaserHead 2.4s steps(1) infinite}.act-laser .dx-eyes{animation:bbLaserEyes 2.4s steps(1) infinite}
.act-laser .dx-pawr{animation:bbTap 2.4s ease-in-out infinite}.act-laser .dx-earr{animation:none}
/* feather wand: looks up, swats with one paw then the other, stretching up */
.act-feather .dx-head{animation:bbLookUp 1.8s ease-in-out infinite}.act-feather .dx-pawl{animation:bbSwatUpL 1.8s ease-in-out infinite}
.act-feather .dx-pawr{animation:bbSwatUpR 1.8s ease-in-out infinite}.act-feather .dx-torso{animation:bbStretchUp 1.8s ease-in-out infinite}.act-feather .dx-tail{animation:bbTailSway 1.8s ease-in-out infinite}
/* falling leaf: curious head tilts while it drifts, then pins it with both paws */
.act-leaf .dx-head{animation:bbTiltHead 4.2s ease-in-out infinite}.act-leaf .dx-pawl{animation:bbPinL 4.2s ease-in-out infinite}.act-leaf .dx-pawr{animation:bbPinR 4.2s ease-in-out infinite}
.act-leaf .dx-tail{animation:bbTailSway 4.2s ease-in-out infinite}
/* box: loafing, peeking left and right, ears twitching */
.act-box .dx-eyes{animation:bbGlance 3s ease-in-out infinite}.act-box .dx-earl{animation:bbEarFlickL 3s ease-in-out infinite}.act-box .dx-head{animation:bbBoxHead 3s ease-in-out infinite}
/* chasing his tail: looks back over his shoulder, tail whips, paw swipes at it */
.act-tail .dx-head{animation:bbLookBack 3.2s ease-in-out infinite}.act-tail .dx-tail{animation:bbTailWhip .32s ease-in-out infinite}.act-tail .dx-pawr{animation:bbSwipeTail 3.2s ease-in-out infinite}
/* nap: head droops, slow breathing, the odd ear twitch, tail slowly curling */
.act-nap .dx-head{animation:bbNapHead 3.2s ease-in-out infinite}.act-nap .dx-torso{animation:bbBreathe 3.2s ease-in-out infinite}
.act-nap .dx-earr{animation:bbEarFlick 7s ease-in-out infinite}.act-nap .dx-tail{animation:bbTailCurl 6.4s ease-in-out infinite}
/* answers: tail straight up and ears perked when right; ears flat, tail and head down when wrong; trotting legs when he runs over */
.bb-pal.hop .dx-tail{animation:bbTailUp .9s ease both}.bb-pal.hop .dx-earl,.bb-pal.hop .dx-earr{animation:bbEarPerk .6s ease}
.bb-pal.sad .dx-earl{animation:bbEarFlatL 1.1s ease}.bb-pal.sad .dx-earr{animation:bbEarFlatR 1.1s ease}.bb-pal.sad .dx-tail{animation:bbTailDroop 1.1s ease}.bb-pal.sad .dx-head{animation:bbHeadDroop 1.1s ease}
.bb-pal.run .dx-pawl{animation:bbTrot .26s ease-in-out infinite}.bb-pal.run .dx-pawr{animation:bbTrot .26s ease-in-out .13s infinite}.bb-pal.run .dx-tail{animation:bbTailStream .52s ease-in-out infinite}
/* greeting: a paw wave and a happy tail */
.bb-greet .gdex .dx-pawr{animation:bbPawWave .42s ease-in-out 1.15s 6 alternate}.bb-greet .gdex .dx-tail{animation:bbTailSway 1.4s ease-in-out infinite}.bb-greet .gdex .dx-earl{animation:bbEarPerk .6s ease 1s 2}
@keyframes bbBlink{0%,44%,50%,100%{transform:none}47%{transform:scaleY(.08)}}
@keyframes bbEarFlick{0%,86%,100%{transform:none}89%{transform:rotate(14deg)}92%{transform:rotate(-4deg)}95%{transform:rotate(8deg)}}
@keyframes bbEarFlickL{0%,40%,100%{transform:none}45%{transform:rotate(-14deg)}50%{transform:rotate(4deg)}55%{transform:rotate(-8deg)}}
@keyframes bbYarnHead{0%,100%{transform:rotate(-3deg)}25%{transform:rotate(-9deg) translateY(2px)}45%{transform:rotate(-12deg) translate(-2px,3px)}75%{transform:rotate(-5deg) translateY(1px)}}
@keyframes bbYarnEyes{0%,100%{transform:translate(-1px,1px)}40%{transform:translate(-2.4px,2px)}80%{transform:translate(-.5px,1px)}}
@keyframes bbYarnSwat{0%,18%,48%,100%{transform:none}26%{transform:translate(-6px,-12px) rotate(-28deg)}34%{transform:translate(-10px,-2px) rotate(-12deg)}40%{transform:translate(-4px,0)}}
@keyframes bbTailSway{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(10deg)}}
@keyframes bbTailTwitch{0%,100%{transform:rotate(0)}30%{transform:rotate(9deg)}60%{transform:rotate(-4deg)}}
@keyframes bbFlyHead{0%,100%{transform:rotate(-10deg) translateY(-1px)}22%{transform:rotate(-8deg) translateY(-3px)}48%{transform:rotate(11deg) translateY(-3px)}68%{transform:rotate(7deg)}84%{transform:rotate(-6deg)}}
@keyframes bbFlyEyes{0%,100%{transform:translate(-2px,0)}22%{transform:translate(-2px,-2px)}48%{transform:translate(2.4px,-2px)}68%{transform:translate(2px,1px)}84%{transform:translate(-1.6px,0)}}
@keyframes bbRearL{0%,52%,72%,100%{transform:none}60%{transform:translate(-4px,-26px) rotate(-24deg)}66%{transform:translate(-2px,-20px) rotate(-14deg)}}
@keyframes bbRearR{0%,53%,73%,100%{transform:none}61%{transform:translate(4px,-27px) rotate(24deg)}67%{transform:translate(2px,-20px) rotate(14deg)}}
@keyframes bbEarSwivelL{0%,100%{transform:rotate(0)}50%{transform:rotate(-12deg)}}
@keyframes bbEarSwivelR{0%,100%{transform:rotate(10deg)}50%{transform:rotate(0)}}
@keyframes bbHuntHead{0%,100%{transform:translateY(5px) rotate(-5deg)}40%{transform:translateY(6px) rotate(-8deg)}48%{transform:translate(-3px,-2px) rotate(-10deg)}60%{transform:translateY(4px) rotate(-4deg)}}
@keyframes bbButtWiggle{0%,18%,38%,100%{transform:none}22%{transform:rotate(-3deg) translateX(-1px)}26%{transform:rotate(3deg) translateX(1px)}30%{transform:rotate(-3deg) translateX(-1px)}34%{transform:rotate(3deg) translateX(1px)}}
@keyframes bbTailLash{0%,100%{transform:rotate(30deg)}20%{transform:rotate(40deg)}30%{transform:rotate(22deg)}40%{transform:rotate(44deg)}}
@keyframes bbPounceL{0%,38%,58%,100%{transform:none}46%{transform:translate(-12px,-8px) rotate(-22deg)}52%{transform:translate(-10px,0) rotate(-8deg)}}
@keyframes bbPounceR{0%,39%,59%,100%{transform:none}47%{transform:translate(-6px,-10px) rotate(-18deg)}53%{transform:translate(-6px,0) rotate(-6deg)}}
@keyframes bbLaserHead{0%{transform:rotate(-6deg) translateY(2px)}20%{transform:rotate(-12deg) translateY(-2px)}40%{transform:rotate(9deg) translateY(1px)}60%{transform:rotate(-4deg) translateY(3px)}80%{transform:rotate(12deg) translateY(2px)}}
@keyframes bbLaserEyes{0%{transform:translate(-1px,2px)}20%{transform:translate(-2.6px,-1.6px)}40%{transform:translate(2.4px,0)}60%{transform:translate(-1px,2.4px)}80%{transform:translate(2.8px,1.6px)}}
@keyframes bbTap{0%,55%,75%,100%{transform:none}60%{transform:translate(-4px,-8px) rotate(-16deg)}65%{transform:translate(-5px,0)}70%{transform:translate(-4px,-6px) rotate(-12deg)}}
@keyframes bbLookUp{0%,100%{transform:rotate(-10deg) translateY(-2px)}50%{transform:rotate(-3deg) translateY(-3px)}}
@keyframes bbSwatUpL{0%,22%,48%,100%{transform:none}32%{transform:translate(-6px,-30px) rotate(-32deg)}40%{transform:translate(-3px,-18px) rotate(-16deg)}}
@keyframes bbSwatUpR{0%,62%,90%,100%{transform:none}72%{transform:translate(2px,-30px) rotate(28deg)}80%{transform:translate(1px,-16px) rotate(12deg)}}
@keyframes bbStretchUp{0%,20%,50%,60%,92%,100%{transform:none}32%,72%{transform:scaleY(1.05)}}
@keyframes bbTiltHead{0%,100%{transform:rotate(-13deg)}20%{transform:rotate(13deg)}40%{transform:rotate(-11deg)}58%{transform:rotate(-4deg) translateY(3px)}76%{transform:rotate(0) translateY(5px)}}
@keyframes bbPinL{0%,58%,92%,100%{transform:none}66%{transform:translate(0,-16px) rotate(-14deg)}74%,86%{transform:translate(3px,1px)}}
@keyframes bbPinR{0%,59%,93%,100%{transform:none}67%{transform:translate(0,-16px) rotate(14deg)}75%,87%{transform:translate(-3px,1px)}}
@keyframes bbGlance{0%,20%,100%{transform:none}30%,45%{transform:translateX(-2.6px)}60%,80%{transform:translateX(2.6px)}}
@keyframes bbBoxHead{0%,100%{transform:none}30%{transform:rotate(-6deg)}65%{transform:rotate(6deg)}}
@keyframes bbLookBack{0%,25%,85%,100%{transform:none}38%,72%{transform:rotate(16deg) translateX(4px)}}
@keyframes bbTailWhip{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(26deg)}}
@keyframes bbSwipeTail{0%,34%,46%,56%,68%,100%{transform:none}40%{transform:translate(10px,-10px) rotate(28deg)}62%{transform:translate(12px,-8px) rotate(30deg)}}
@keyframes bbNapHead{0%,100%{transform:rotate(-7deg) translateY(4px)}50%{transform:rotate(-8deg) translateY(5px)}}
@keyframes bbTailCurl{0%,100%{transform:rotate(14deg)}50%{transform:rotate(22deg)}}
@keyframes bbTailUp{0%{transform:none}35%,70%{transform:rotate(-22deg)}100%{transform:none}}
@keyframes bbEarPerk{0%,100%{transform:none}50%{transform:translateY(-3px) scaleY(1.08)}}
@keyframes bbEarFlatL{0%,100%{transform:none}25%,75%{transform:rotate(-38deg) translateY(5px)}}
@keyframes bbEarFlatR{0%,100%{transform:none}25%,75%{transform:rotate(38deg) translateY(5px)}}
@keyframes bbTailDroop{0%,100%{transform:none}25%,75%{transform:rotate(42deg)}}
@keyframes bbHeadDroop{0%,100%{transform:none}25%,75%{transform:rotate(-6deg) translateY(4px)}}
@keyframes bbTrot{0%,100%{transform:none}50%{transform:translateY(-5px) rotate(-8deg)}}
@keyframes bbTailStream{0%,100%{transform:rotate(18deg)}50%{transform:rotate(30deg)}}
@keyframes bbPawWave{from{transform:translate(4px,-26px) rotate(-38deg)}to{transform:translate(7px,-28px) rotate(8deg)}}
@media (prefers-reduced-motion:reduce){.dx-head,.dx-tail,.dx-earl,.dx-earr,.dx-pawl,.dx-pawr,.dx-torso,.dx-eyes,.dx-blink{animation:none!important}}
@media (prefers-reduced-motion:reduce){.bb-say,.bb-yarn,.bb-yarn svg{animation-duration:.01s}.bb-dock .bb-pic,.bb-card .bb-big,.bb-evo.done .new{animation:none}.bb-evo .old{animation:none;opacity:0}.bb-evo .new{animation:none;opacity:1}.bb-evo .glow{display:none}}`;

  // ===== Dock (bottom-right) with a ring that fills toward the next evolution
  function ringPct(pts) { const k = stageOf(pts), a = STAGES[k].at, b = nextAt(k); return b === null ? 1 : (pts - a) / (b - a) }
  function paintDock() { paintDock0(); checkPal(); paintPal() }
  function paintDock0() {
    let d = $("bbDock");
    if (off()) { if (d) d.remove(); document.body.classList.remove("bb-on"); return }
    const s = load(), k = stageOf(s.pts), C = 2 * Math.PI * 30, mult = XP() ? XP().multiplier(s.streak) : 1;
    if (!d) { d = document.createElement("button"); d.id = "bbDock"; d.type = "button"; d.className = "bb-dock"; d.onclick = () => openPal("cats"); document.body.appendChild(d); makeMovable(d, () => 64, (x, y) => { d.style.left = x + "px"; d.style.top = y + "px"; d.style.right = d.style.bottom = "auto" }) }
    document.body.classList.add("bb-on"); dockSpot(d);
    d.setAttribute("aria-label", `Study buddy: ${name(s)}, level ${level(s.pts)}, ${fmt(s.pts)} XP${s.streak >= 3 ? `, ${s.streak} in a row, XP times ${mult}` : ""}. Open`);
    d.innerHTML = `<svg class="bb-ring" viewBox="0 0 64 64"><circle class="t" cx="32" cy="32" r="30"/><circle class="f" cx="32" cy="32" r="30" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - ringPct(s.pts))}"/></svg>
      <span class="bb-pic">${art(k)}</span><span class="bb-lv">Lv ${level(s.pts)}</span>${s.streak >= 3 ? `<span class="bb-streak" title="${s.streak} right in a row">${FLAME}×${mult}</span>` : ""}`;
  }
  const name = s => s.nick || "Dexter";
  const stageName = (k, s) => STAGES[k].name.replace("Dexter", name(s));
  const COIN = `<svg class="coin" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#ffcf33" stroke="#b07d0f" stroke-width="1.4"/><circle cx="8" cy="8" r="4.2" fill="none" stroke="#d9a21b" stroke-width="1.2"/><path d="M6.6 5.6 q1.4 -1 2.8 0" stroke="#fff6cf" stroke-width="1.1" fill="none" stroke-linecap="round"/></svg>`;
  const HANGER = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7 a2.2 2.2 0 1 1 2.2 -2.2 c0 1.4 -2.2 1.8 -2.2 3.4 L21 15 a1.4 1.4 0 0 1 -.9 2.5 H3.9 A1.4 1.4 0 0 1 3 15Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
  const FLAME = `<svg viewBox="0 0 12 14" aria-hidden="true"><path d="M6 1 C7 4 10 5 10 9 C10 12 8 13 6 13 C4 13 2 12 2 9 C2 7 3 6 4 5 C4 7 5 8 6 8 C6 6 5 4 6 1Z" fill="currentColor"/></svg>`;

  // ===== Progress tab: level, XP, streaks, gold, the next evolution, the course fact, the evolution line, how XP works
  function progressHTML(s) {
    const k = stageOf(s.pts), st = STAGES[k], nx = nextAt(k), L = level(s.pts), X = XP();
    const mult = X ? X.multiplier(s.streak) : 1, up = X ? X.nextStreak(s.streak) : null, pct = Math.round(ringPct(s.pts) * 100);
    return `<div class="pal-prog">
      <div class="bb-big">${art(k)}</div>
      <h3 id="bbName">${esc(name(s))}</h3>
      <p class="bb-sub">Level ${L} of ${MAX_LV} · ${esc(formOf(k, s.breed))} · ${esc(stageName(k, s))} · ${esc(breedName(s.breed, s.color))}</p>
      <div class="bb-stats">
        <div><b>${fmt(s.pts)}</b><span>total XP</span></div>
        <div><b>${s.streak}${s.streak >= 3 ? `<i class="fl">${FLAME}</i>` : ""}</b><span>in a row · ×${mult}</span></div>
        <div><b>${s.best}</b><span>best streak</span></div>
        <div class="gold"><b>${COIN}${fmt(s.gold)}</b><span>gold</span></div>
      </div>
      <div class="bb-bar"><i style="width:${pct}%"></i></div>
      <p class="bb-next">${nx === null ? (L >= MAX_LV ? "Fully grown and Level 100. You've mastered it all!" : `Fully grown! ${fmt(lvXP(L + 1) - s.pts)} XP to level ${L + 1} of ${MAX_LV}.`) : `Evolves at Lv ${level(nx)} · ${fmt(nx - s.pts)} XP to go · ${fmt(lvXP(L + 1) - s.pts)} XP to level ${L + 1}`}</p>
      ${up ? `<p class="bb-next" style="margin-top:-8px">${s.streak ? `${up.at - s.streak} more right in a row for` : `Get ${up.at} right in a row for`} ×${up.mult} XP</p>` : ""}
      <div class="bb-fact"><b>The course connection</b>${esc(st.fact)}</div>
      <div class="bb-line" aria-label="Evolution line">${STAGES.map((x, i) => `<div class="${i > k ? "lock" : ""}${i === k ? " cur" : ""}" style="--lz:${(34 + 4.4 * i).toFixed(1)}px">${art(i)}<span>${i > k ? `Lv ${level(x.at)}` : esc(stageName(i, s))}</span></div>`).join("")}</div>
      <details class="bb-how"><summary>How XP and gold work</summary>
        <p>Every question is rated by how hard it is. Harder questions earn more XP and gold:</p>
        <ul class="bb-tiers">${X ? X.TIERS.map(t => `<li><span class="xpb t-${t.key}">${t.name}</span>${t.xp} XP · ${GOLD_PER[t.key]} gold</li>`).join("") : ""}</ul>
        <p><b>What makes a question harder:</b> EXCEPT/NOT wording, putting steps in order, reading an experiment or a figure, comparing two things or explaining why, five answer choices, long and similar answers, high-value Anthro-pardy clues, questions on the assigned readings, and questions <i>you</i> missed before. A question you've already gotten right 3+ times earns half.</p>
        <p><b>Win streaks multiply XP and gold:</b> ${X ? X.STREAKS.slice(0, -1).reverse().map(([n, m]) => `${n} in a row ×${m}`).join(" · ") : ""}. A wrong answer resets the streak but never takes anything away. Each evolution adds ${EVOLVE_BONUS} gold.</p>
      </details>
      <button type="button" class="ct-cafe" data-tab="settings"><span class="ic" aria-hidden="true">⚙</span><span><b>Cat settings</b><small>Size, anchoring, where he sits, levels, sound, name</small></span><i aria-hidden="true">›</i></button>
    </div>`;
  }

  // ===== A correct answer: XP from the question's difficulty × the streak multiplier, then hop / level up / evolve
  const STREAK_CHEERS = { 3: "3 in a row!", 5: "5 in a row!", 10: "10 in a row!", 15: "15 in a row!", 25: "25 in a row!" };
  // Pops float up from the buddy; ones that overlap in time stack upward instead of piling on top of each other
  const live = [];
  function pop(lines, cls) {
    const d = anchor(); if (!d) return;
    const r = anchorRect(d), p = document.createElement("span");
    p.className = "bb-plus" + (cls ? " " + cls : ""); p.innerHTML = lines;
    const slot = live.reduce((n, x) => Math.max(n, x.slot + 1), 0);
    p.style.right = (innerWidth - r.right) + "px"; p.style.top = (r.top - 14 - slot * 40) + "px";
    const rec = { slot, p }; live.push(rec);
    document.body.appendChild(p);
    setTimeout(() => { p.remove(); live.splice(live.indexOf(rec), 1) }, 1500);
  }
  // ===== Dexter's reactions: an excited "Meow!" (bubble + a little synthesized meow) or a dropped yarn ball
  // Levels on screen: hidden by default (tap a cat to see its level and stats); this setting shows them on the cats
  const LV_KEY = "a104-dexter-showlv";
  const showLv = () => { try { return localStorage.getItem(LV_KEY) === "1" } catch (e) { return false } };
  function setSize(v) {
    v = Math.min(1.8, Math.max(.6, +v || 1));
    try { Math.abs(v - 1) < .01 ? localStorage.removeItem(SCALE_KEY) : localStorage.setItem(SCALE_KEY, String(v)) } catch (e) { }
    paintPal(); if (typeof refreshMates === "function") refreshMates(); const d = $("bbDock"); if (d) dockSpot(d); settle();
  }
  function setAnchored(on) {
    try { on ? localStorage.setItem(ANCHOR_KEY, "1") : localStorage.removeItem(ANCHOR_KEY) } catch (e) { }
    if (on && !getSpot()) { const S = palSize(), at = palAt || wantHome(); setSpot(xySpot(at.x, at.y, S)) } else settle();
  }
  function setShowLv(on) { try { on ? localStorage.setItem(LV_KEY, "1") : localStorage.removeItem(LV_KEY) } catch (e) { } document.documentElement.classList.toggle("bb-showlv", on) }
  document.documentElement.classList.toggle("bb-showlv", showLv());
  const SOUND_KEY = "a104-dexter-sound";
  const soundOn = () => { try { return localStorage.getItem(SOUND_KEY) !== "0" } catch (e) { return true } };
  const setSound = on => { try { on ? localStorage.removeItem(SOUND_KEY) : localStorage.setItem(SOUND_KEY, "0") } catch (e) { } };
  let actx = null;
  function meowSound(stage) {
    if (!soundOn()) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === "suspended") actx.resume();
      const t = actx.currentTime, base = 520 - stage * 30 + Math.random() * 90, dur = .42 + Math.random() * .12;
      const o = actx.createOscillator(), o2 = actx.createOscillator(), f = actx.createBiquadFilter(), g = actx.createGain();
      o.type = "sawtooth"; o2.type = "triangle";
      for (const [osc, k] of [[o, 1], [o2, 2.01]]) {   // "mee-OW": rise, then fall
        osc.frequency.setValueAtTime(base * .8 * k, t);
        osc.frequency.linearRampToValueAtTime(base * 1.35 * k, t + dur * .35);
        osc.frequency.exponentialRampToValueAtTime(base * .62 * k, t + dur);
      }
      f.type = "bandpass"; f.Q.value = 2.2;
      f.frequency.setValueAtTime(900, t); f.frequency.linearRampToValueAtTime(2200, t + dur * .4); f.frequency.linearRampToValueAtTime(700, t + dur);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.32, t + .05); g.gain.setValueAtTime(.32, t + dur * .6); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(f); o2.connect(f); f.connect(g); g.connect(actx.destination);
      o.start(t); o2.start(t); o.stop(t + dur + .05); o2.stop(t + dur + .05);
    } catch (e) { }
  }
  const MEOWS = ["Meow!", "Meow meow!", "MEOW!!", "Mrrrow!", "Meeeow! ♪", "Meow! Nice!"];
  let sayEl = null;
  function say(text) {
    const d = anchor(); if (!d) return;
    if (sayEl) sayEl.remove();
    const r = anchorRect(d), b = document.createElement("span");
    b.className = "bb-say"; b.textContent = text; b.setAttribute("aria-hidden", "true");
    if (r.left < 170) { b.style.left = (r.right + 10) + "px"; b.style.transformOrigin = "0 100%" } else b.style.right = (innerWidth - r.left + 10) + "px";
    b.style.top = (r.top + r.height * .1) + "px";
    document.body.appendChild(b); sayEl = b;
    setTimeout(() => { b.remove(); if (sayEl === b) sayEl = null }, 1500);
  }
  function dropYarn() {
    const d = anchor(); if (!d) return;
    if (d.id === "bbPal") {   // the study pal loses its toy: it rolls away and comes back
      d.classList.remove("hop", "sad", "lost"); void d.offsetWidth; d.classList.add("sad", "lost");
      setTimeout(() => d.classList.remove("lost"), 2500); return;
    }
    const r = d.getBoundingClientRect(), y = document.createElement("span");
    y.className = "bb-yarn"; y.setAttribute("aria-hidden", "true");
    y.innerHTML = `<svg viewBox="0 0 26 26"><circle cx="13" cy="13" r="10.5" fill="#4f8dff" stroke="#3a2a1e" stroke-width="2"/><path d="M5 10 Q13 5 21 12 M5 15 Q13 9 21 17 M9 4.5 Q15 13 11 23" stroke="#2c5fc4" stroke-width="1.6" fill="none"/></svg>`;
    y.style.left = (r.left + r.width / 2 - 13) + "px"; y.style.top = (r.top + r.height * .45) + "px";
    y.style.setProperty("--fall", Math.max(20, innerHeight - r.top - r.height * .45 - 30) + "px");
    document.body.appendChild(y);
    d.classList.remove("hop", "sad"); void d.offsetWidth; d.classList.add("sad");
    setTimeout(() => y.remove(), 1700);
  }

  function gain(e) {
    const X = XP(), detail = (e && e.detail) || {};
    const r = X ? X.rate(detail) : { xp: 10, tier: { key: "easy", name: "Easy" } };
    const s = load(), before = stageOf(s.pts), lvBefore = level(s.pts);
    s.streak = (s.streak | 0) + 1; s.best = Math.max(s.best | 0, s.streak); s.last = Date.now(); s.correct = (s.correct | 0) + 1;
    const mult = X ? X.multiplier(s.streak) : 1, total = Math.round(r.xp * mult);
    // Co-training: the XP is split evenly between the cat in training and every co-trainee (gold is the household's, not split)
    const H = household(), co = H.co.filter(id => H.cats[id]), n = 1 + co.length, earned = Math.max(1, Math.round(total / n));
    s.pts += earned;
    const coUps = co.map(id => { const c = H.cats[id], b = stageOf(c.pts | 0), lv0 = level(c.pts | 0); c.pts = (c.pts | 0) + earned; c.correct = (c.correct | 0) + 1; return { id, c, evolved: stageOf(c.pts) > b, lvUp: level(c.pts) > lv0 } });
    if (co.length) saveHouse(H);
    const goldBase = (GOLD_PER[r.tier.key] || 3), coins = Math.max(1, Math.round((r.repeat ? Math.ceil(goldBase / 2) : goldBase) * mult));
    const evolved = stageOf(s.pts) > before;
    s.gold = (s.gold | 0) + coins + (evolved ? EVOLVE_BONUS : 0);
    save(s);
    window.dispatchEvent(new CustomEvent("bio:xp", { detail: { earned, total, split: n, base: r.xp, mult, tier: r.tier, streak: s.streak, pts: s.pts } }));
    if (off()) return;
    paintDock(); visit(); if (palOn) setMood("happy", 1700);
    coUps.forEach(u => { const m = mates.find(z => z.c.id === u.id); if (!m) return; m.c.pts = u.c.pts; paintMate(m); placeMates();
      m.el.classList.remove("hop"); void m.el.offsetWidth; m.el.classList.add("hop"); setTimeout(() => m.el.classList.remove("hop"), 700);
      if (u.evolved || u.lvUp) fx(m.el, u.evolved ? ["🌟", "✨", "🌟"] : ["⬆️", "✨"]) });
    const evo = coUps.filter(u => u.evolved);
    if (evo.length) setTimeout(() => pop(`<b>${evo.map(u => esc(u.c.nick || "Dexter")).join(" & ")} evolved!</b><small>${evo.map(u => esc(STAGES[stageOf(u.c.pts)].name)).join(" · ")}</small>`, "hot"), 1300);
    const d = anchor(); if (!d) return;
    d.classList.remove("hop", "sad"); void d.offsetWidth; d.classList.add("hop");
    say(MEOWS[Math.floor(Math.random() * MEOWS.length)]); meowSound(before);
    const lv = level(s.pts);
    pop(`<b>+${earned} XP${n > 1 ? ` <span class="xsplit">×${n} cats</span>` : ""} <span class="gc">${COIN}+${coins}</span></b><small><span class="xpb t-${r.tier.key}">${esc(r.tier.name)}</span>${mult > 1 ? ` ×${mult} streak` : ""}${n > 1 ? ` · ${total} XP split ${n} ways` : ""}${lv > lvBefore ? ` · Lv ${lv}!` : ""}</small>`);
    if (STREAK_CHEERS[s.streak]) setTimeout(() => pop(`<b>${FLAME} ${STREAK_CHEERS[s.streak]}</b><small>XP ×${mult} while it lasts</small>`, "hot"), 650);
    const after = stageOf(s.pts);
    if (after > before) setTimeout(() => evolve(before, after), 900);
  }
  function miss() {
    const s = load(), had = s.streak | 0; s.streak = 0; s.last = Date.now(); save(s);
    if (off()) return;
    paintDock(); visit(); if (palOn) setMood("sad", 1900);
    dropYarn();
    if (had >= 3) pop(`<b>Streak ended at ${had}</b><small>No XP lost. Start a new one!</small>`, "cool");
  }
  function evolve(from, to) {
    const s = load(), a = STAGES[from], b = STAGES[to], who = s.nick || "Dexter";
    const ev = document.createElement("div"); ev.className = "bb-evo"; ev.setAttribute("role", "dialog"); ev.setAttribute("aria-modal", "true"); ev.setAttribute("aria-live", "polite");
    ev.innerHTML = `<p class="msg" id="bbMsg">${esc(who)} is starting to glow…</p>
      <div class="stage"><div class="glow"></div><span class="old">${art(from)}</span><span class="new">${art(to)}</span></div>
      <div class="reveal"><h2>${esc(who)} evolved into ${esc(stageName(to, s))}!</h2><p class="evo-gold">${COIN} +${EVOLVE_BONUS} gold evolution bonus</p><p style="margin-top:8px">${esc(b.form)} stage · ${esc(b.fact)}</p></div>
      <button type="button" id="bbEvoOk">Keep studying</button>`;
    document.body.appendChild(ev);
    const finish = () => {
      if (ev.classList.contains("done")) return; ev.classList.add("done"); $("bbMsg").textContent = "Congratulations!";
      const r = ev.querySelector(".stage").getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (let i = 0; i < 26; i++) {   // a burst of leaves and petals
        const l = document.createElement("i"); l.className = "bb-leaf"; const ang = Math.random() * Math.PI * 2, dist = 90 + Math.random() * 140;
        l.style.left = cx + "px"; l.style.top = cy + "px"; l.style.background = ["#7bd36b", "#34c759", "#f48fbf", "#ffd54f"][i % 4];
        l.style.setProperty("--dx", Math.cos(ang) * dist + "px"); l.style.setProperty("--dy", Math.sin(ang) * dist + "px"); l.style.setProperty("--r", (Math.random() * 540 - 270) + "deg");
        document.body.appendChild(l); setTimeout(() => l.remove(), 1500);
      }
      $("bbEvoOk").focus();
    };
    const reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(() => { const m = $("bbMsg"); if (m && !ev.classList.contains("done")) m.textContent = "Something's happening…" }, 900);
    setTimeout(finish, reduce ? 50 : 2700);
    $("bbEvoOk").onclick = () => ev.remove();
    ev.onclick = e => { if (ev.classList.contains("done") && e.target === ev) ev.remove() };
  }

  // ===== Dexter's Shop: earn gold with right answers, buy hats, outfits and accessories, try them on first
  const GOLD_PER = { easy: 3, medium: 5, hard: 8, expert: 12 }, EVOLVE_BONUS = 50;
  // ===== Dexter's panel (tap Dexter): Closet = dress him however you like · Shop = buy new items · Progress = level and stats
  let shop = null;
  const NONE_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 18 L18 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
  const OWN_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 l2.2 5.4 5.8 .5 -4.4 3.8 1.4 5.7 L12 15.3 7 18.4 l1.4 -5.7 L4 8.9 l5.8 -.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
  function openPal(tab, sub, dress) {
    const W = window.BioWardrobe;
    if (shop) shop.remove();
    const st = { tab: tab || "closet", sub: sub || "hat", sel: null, tryEq: Object.assign({}, load().equip), dress: dress || null };
    shop = document.createElement("div"); shop.className = "bb-veil"; document.body.appendChild(shop);
    shop.onclick = e => { if (e.target === shop) closeShop() };
    const SUBS = [["hat", "Hats"], ["outfit", "Outfits"], ["acc", "Accessories"]];
    const slotsFor = key => !W ? [] : key === "acc" ? W.SLOTS.filter(x => x.group === "Accessories") : W.SLOTS.filter(x => x.key === key);
    const keepScroll = fn => { const c = shop.querySelector(".bb-shop"), y = c ? c.scrollTop : 0; fn(); const n = shop.querySelector(".bb-shop"); if (n) n.scrollTop = y };
    // ===== Dressing any cat: the Closet works on st.dress (default: the cat in training). The cat in training's look lives
    // in KEY; the others' looks (equip with pinned badges, collar, weight) live in the household. Items and gold are shared.
    const dressId = () => { const H = household(); return st.dress && H.cats[st.dress] ? st.dress : H.active };
    function dressGet() {
      const s = load(), H = household(), id = dressId();
      if (id === H.active) return Object.assign(s, { _id: id });
      const c = H.cats[id];
      return Object.assign({}, s, { equip: Object.assign({ badges: [] }, c.equip), collar: c.collar || "navy", weight: c.weight || 1, pts: c.pts | 0, nick: c.nick || "", breed: c.breed, color: c.color, correct: c.correct | 0, best: c.best | 0, streak: 0, _id: id, _other: true });
    }
    function dressSet(fn) {
      const H = household(), id = dressId();
      if (id === H.active) { const t = load(); fn(t); save(t); return t }
      const c = H.cats[id], t = { equip: Object.assign({ badges: [] }, c.equip), collar: c.collar || "navy", weight: c.weight || 1, pts: c.pts | 0 };
      fn(t); c.equip = t.equip; c.collar = t.collar; c.weight = t.weight; saveHouse(H); refreshMates(); return Object.assign({}, c, t);
    }
    const dressArt = (d, eyes) => d._other ? art(stageOf(d.pts), d.equip, { breed: d.breed, color: d.color, collar: d.collar, w: d.weight, eyes }) : art(stageOf(d.pts), d.equip, { eyes });
    function statsHTML(d) {   // the cat's profile: level, XP to the next level, form, and its numbers
      const H = household(), id = d._id, L = level(d.pts | 0), a = lvXP(L), b = lvXP(Math.min(MAX_LV, L + 1)), k = stageOf(d.pts | 0), pct = L >= MAX_LV ? 100 : Math.round(100 * ((d.pts | 0) - a) / Math.max(1, b - a));
      const role = id === H.active ? "✓ In training" : H.co.includes(id) ? "📚 Co-training" : H.along.includes(id) ? "On screen" : "☕ Chilling in the café";
      const nx = STAGES[k + 1];
      return `<div class="pf-card"><div class="pf-top"><span class="pf-lv"><span><small>LV</small>${L}</span></span>
          <span class="pf-who"><b>${esc(stageName(k, d))}</b><span>${esc(breedName(d.breed || load().breed, d.color || load().color))} · ${esc(STAGES[k].form)}</span><span>${role}</span></span></div>
        <div class="pf-bar" role="progressbar" aria-label="XP to the next level" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
        <div class="pf-xp">${L >= MAX_LV ? "Level 100: mastered it all!" : `${fmt((d.pts | 0) - a)} / ${fmt(b - a)} XP to Lv ${L + 1}`}${nx ? ` · evolves in ${fmt(nx.at - (d.pts | 0))} XP` : ""}</div>
        <div class="pf-grid"><div><b>${fmt(d.pts | 0)}</b><span>Total XP</span></div><div><b>${fmt(d.correct | 0)}</b><span>Right answers</span></div><div><b>${d.best | 0}</b><span>Best streak</span></div>
          <div><b>${id === H.active ? (d.streak | 0) : "–"}</b><span>Streak now</span></div><div><b>${(d.equip.badges || []).length}</b><span>Badges pinned</span></div><div><b>${esc(weightLabel(d.weight || 1))}</b><span>Weight</span></div></div>
        <label class="pf-tog"><span>Show levels on the cats on screen</span><input type="checkbox" id="pfShowLv"${showLv() ? " checked" : ""}></label></div>`;
    }
    function dressPicker() {   // flip through your cats: arrows on the stage, plus a strip of all of them
      const { list } = catList(); if (list.length < 2) return "";
      const id = dressId();
      return `<div class="cl-cats" role="tablist" aria-label="Which cat to dress">${list.map(c => `<button type="button" role="tab" class="cl-cat${c.id === id ? " on" : ""}" data-dress="${c.id}" aria-selected="${c.id === id}">${art(stageOf(c.pts | 0), c.equip || { badges: [] }, { breed: c.breed, color: c.color, collar: c.collar, w: c.weight, eyes: "happy", plain: true })}<b>${esc(c.nick || "Dexter")}</b>${c.active ? `<small>Training</small>` : ""}</button>`).join("")}</div>`;
    }
    function shopTile(it, s) {
      const own = s.owned.includes(it.id), on = s.equip[it.slot] === it.id;
      return `<button type="button" class="sh-tile${st.sel === it.id ? " sel" : ""}${on ? " on" : ""}" data-id="${it.id}" aria-pressed="${st.sel === it.id}">
        <svg viewBox="${W.VIEW[it.slot]}" aria-hidden="true">${it.svg}</svg><b>${esc(it.name)}</b>
        <span class="tag">${esc(it.set)}</span><span class="pr">${on ? "Wearing" : own ? "Owned" : `${COIN}${it.price}`}</span></button>`;
    }
    // Closet: every slot lets you pick one of your items, Dexter's own gear for this form, or nothing at all
    // Cats: the household. Pick who to train, who comes along on screen, and adopt new breeds.
    function catsHTML() {
      const { H, list } = catList(), n = kindCount(H, false), nP = IN_A102 ? kindCount(H, true) : 0, full = n >= MAX_CATS;
      return `<button type="button" class="ct-cafe" id="ctCafe"><span class="ic" aria-hidden="true">☕</span><span><b>Visit the Cat Café</b><small>${full ? `Your home is full (${MAX_CATS} cats). Return a cat to the café to make room for a new one.` : Object.keys(H.alumni).length ? `Meet new cats, or bring back ${Object.keys(H.alumni).length > 1 ? `one of the ${Object.keys(H.alumni).length} cats who live there now` : "the cat who lives there now"}.` : "Meet cats of every breed, pick a coat color, and bring one home to study."}</small></span><i aria-hidden="true">›</i></button>
        ${safariOpen() ? `<button type="button" class="ct-cafe ct-safari" id="ctSafari"><span class="ic" aria-hidden="true">🌴</span><span><b>Visit the Primate Safari Café</b><small>ANTH 102: lemurs, monkeys and apes, each in its own habitat. Adopt one to study with you.</small></span><i aria-hidden="true">›</i></button>` : ""}
        <p class="ct-h">Your cats · ${n}/${MAX_CATS}${nP ? ` · primates ${nP}/${MAX_CATS}` : ""}<small>The cat in training earns XP from your answers. Any of your other cats can come along on screen too. Tick <b>Co-train</b> to train several at once: each answer's XP is split evenly between them.</small></p>
        <div class="ct-list">${list.map(c => { const k2 = stageOf(c.pts | 0); return `<div class="ct-cat${c.active ? " on" : ""}">
          ${art(k2, c.equip || { badges: [] }, { breed: c.breed, color: c.color, collar: c.collar, w: c.weight, eyes: "happy", plain: true })}
          <span><b>${esc(c.nick || "Dexter")}</b><small>${esc(breedName(c.breed, c.color))} · Lv ${level(c.pts | 0)} · ${esc(formOf(k2, c.breed))}</small></span>
          <span class="ct-btns"><button type="button" class="ct-dress" data-dressgo="${c.id}" aria-label="Dress ${esc(c.nick || "Dexter")}">👗 Dress</button>${c.active ? `<span class="ct-tag">✓ Training</span>${H.co.length ? `<span class="ct-split">XP split ${H.co.length + 1} ways</span>` : ""}` : `<button type="button" class="sh-act" data-train="${c.id}">Train</button>
            <label class="ct-along"><input type="checkbox" data-along="${c.id}"${c.along ? " checked" : ""}${!c.along && H.along.length >= MAX_ALONG ? " disabled" : ""}> On screen</label>
            <label class="ct-along ct-co"><input type="checkbox" data-co="${c.id}"${c.co ? " checked" : ""}${c.along ? "" : " disabled"}> 📚 Co-train</label>${c.along && H.spots && H.spots[c.id] ? `<button type="button" class="ct-unpin" data-unpin="${c.id}">↺ Back beside him</button>` : ""}<button type="button" class="ct-unpin" data-return="${c.id}">↩ Return to café</button>`}</span></div>` }).join("")}</div>`;
    }
    // Settings: size, anchoring, where he sits, levels, sound, name, hide (the same settings as the site's Settings sheet)
    function settingsHTML(s) {
      const sp = getSpot(), H = household(), pinned = H.spots && Object.keys(H.spots).length;
      return `<div class="bb-spot"><b>Size</b><small>Bigger on laptops and desktops; this scales every cat on screen.</small>
          <label class="bb-size"><span>Size</span><input type="range" id="bbSize" min="60" max="180" step="10" value="${Math.round(userScale() * 100)}" aria-label="Cat size"><output id="bbSizeOut">${Math.round(userScale() * 100)}%</output></label></div>
        <div class="bb-spot"><b>Where ${esc(name(s))} sits</b>${anchored() && sp ? "Anchored right where you put him. He stays there, even when you pick an answer." : sp ? "Right where you put him. He still runs over to each answer you pick, then goes back to his spot." : "Next to your questions. He runs over to each answer you pick."}<small>Drag any cat to move it, or focus it and use the arrow keys.</small>
          <label class="pf-tog pf-prog"><span>Anchor him in place (he won't run to your answers)</span><input type="checkbox" id="bbAnchor"${anchored() ? " checked" : ""}></label>
          ${sp || pinned ? `<button type="button" id="bbSpotReset">Put every cat back beside my questions</button>` : ""}</div>
        <div class="bb-spot"><b>On screen</b>
          <label class="pf-tog pf-prog"><span>Show levels on the cats on screen</span><input type="checkbox" id="pgShowLv"${showLv() ? " checked" : ""}></label>
          <label class="pf-tog pf-prog"><span>${esc(name(s))}'s meow on right answers</span><input type="checkbox" id="bbMeow"${soundOn() ? " checked" : ""}></label></div>
        <div class="bb-acts"><button type="button" id="bbRename">Rename ${esc(name(s))}</button><button type="button" id="bbHide">Hide study buddy</button></div>`;
    }
    // Badge case: one badge per Read & Learn chapter, like a trainer's case. Earned badges can be pinned on Dexter.
    function badgesHTML(s) {
      const CID = window.COURSE && window.COURSE.badges, B = W.ITEMS.filter(i => i.slot === "badge" && (!CID || i.course === CID || s.owned.includes(i.id))), got = B.filter(i => s.owned.includes(i.id));   // this course's badges, plus any you earned elsewhere
      const pins = s.equip.badges || [];
      if (!st.bsel || !W.byId[st.bsel]) st.bsel = (pins[0] || (got[0] || B[0]).id);
      const it = W.byId[st.bsel], own = s.owned.includes(it.id), worn = pins.includes(it.id);
      return `<div class="bc-case"><div class="bc-top"><span>BADGE CASE</span><small>${got.length} of ${B.length} earned · ${pins.length} on his collar</small></div>
        <div class="bc-grid">${B.map(i => `<button type="button" class="bc-slot${s.owned.includes(i.id) ? "" : " lock"}${i.id === st.bsel ? " sel" : ""}${pins.includes(i.id) ? " worn" : ""}" data-id="${i.id}" aria-label="${esc(s.owned.includes(i.id) ? i.name + ", " + W.tier(completions(i.earn)).name : "Locked badge: " + i.chapter)}">${badgeSVG(i, s.owned.includes(i.id) ? completions(i.earn) : 0)}${s.owned.includes(i.id) && completions(i.earn) > 1 ? `<i class="bc-n">×${completions(i.earn)}</i>` : ""}</button>`).join("")}</div></div>
        <div class="bc-detail">${own ? badgeSVG(it, completions(it.earn)) : `<svg viewBox="-13.5 -13.5 27 27" style="filter:brightness(0) opacity(.3)">${it.big}</svg>`}<div class="bc-txt">
          <b>${own ? esc(it.name) : "??? Badge"}${own ? ` <em class="bc-tier t${W.tier(completions(it.earn)).lv}">${W.tier(completions(it.earn)).name}</em>` : ""}</b>
          <span>${own ? (() => { const t = W.tier(completions(it.earn)); return `Finished “${esc(it.chapter)}” ${t.count === 1 ? "once" : t.count + " times"}. ${t.next ? `Finish it ${t.next.at - t.count} more time${t.next.at - t.count > 1 ? "s" : ""} (↺ Restart in the chapter) to make it ${t.next.name}.` : "It can't shine any brighter!"}` })() : `Finish the “${esc(it.chapter)}” chapter in Read & Learn to earn it.`}</span><br>
          ${own ? (worn ? `<button type="button" class="sh-act ghost" id="bcOff">Unpin from his collar</button>` : `<button type="button" class="sh-act" id="bcPin">📌 Pin on ${esc(name(s))}'s collar</button>`) + (got.length > 1 ? ` <button type="button" class="sh-act ghost" id="bcAll">${pins.length === got.length ? "Unpin all" : "Pin all " + got.length}</button>` : "") : `<a class="sh-act" style="display:inline-block;text-decoration:none" href="/read/index.html#${it.earn}">Read the chapter</a>`}
        </div></div>`;
    }
    const weightLabel = w => w <= .86 ? "Slim" : w <= 1.06 ? "Just right" : w <= 1.21 ? "Well fed" : w <= 1.36 ? "Chubby" : "Absolute chonk";
    function closetHTML(s, k) {
      const g = FORM_GEAR[k], cur = s.equip;
      // reading badges sit with the accessories: tap one to pin it on the collar (or take it off); same pins as the Badge Case
      const badgeRow = () => {
        const B = W.ITEMS.filter(i => i.slot === "badge"), got = B.filter(i => s.owned.includes(i.id)), pins = cur.badges || [];
        return `<p class="sh-cap">Badges <small class="cl-bcount">${got.length}/${B.length} earned · ${pins.length} on the collar</small></p><div class="sh-grid">
          ${got.map(i => { const on = pins.includes(i.id), n = Math.max(1, completions(i.earn)); return `<button type="button" class="sh-tile cl clb${on ? " on" : ""}" data-badge="${i.id}" aria-pressed="${on}" aria-label="${esc(i.name)}: ${on ? "on the collar, tap to take off" : "tap to pin on the collar"}">${badgeSVG(i, n)}<b>${esc(i.name)}</b><span class="tag">${on ? "📌 On collar" : esc(W.tier(n).name)}</span></button>` }).join("")}
          ${got.length < B.length ? `<button type="button" class="sh-tile cl clb lock" id="clMoreBadges"><span class="cl-ic">🔒</span><b>${B.length - got.length} more to earn</b><span class="tag">Finish Read &amp; Learn chapters</span></button>` : ""}
        </div>`;
      };
      const rows = W.SLOTS.filter(sl => sl.key !== "badge").map(sl => {   // badges are pinned from the Badges tab
        const mine = W.ITEMS.filter(i => i.slot === sl.key && s.owned.includes(i.id));
        const hasOwn = sl.key === "face" ? !!g.glasses : !!g[sl.key];
        const opt = (val, label, icon, extra = "") => `<button type="button" class="sh-tile cl${(cur[sl.key] === val || (val === undefined && cur[sl.key] === undefined)) ? " on" : ""}" data-slot="${sl.key}" data-val="${val === undefined ? "" : val}" aria-pressed="${cur[sl.key] === val}">${icon}<b>${label}</b>${extra}</button>`;
        return `<p class="sh-cap">${esc(sl.name)}</p><div class="sh-grid">
          ${hasOwn ? opt(undefined, `${esc(name(s))}'s own`, `<span class="cl-ic">${OWN_ICON}</span>`, `<span class="tag">This form's gear</span>`) : ""}
          ${opt("none", "None", `<span class="cl-ic">${NONE_ICON}</span>`, `<span class="tag">${sl.key === "neck" ? "Just his collar" : hasOwn ? "Take it off" : "Nothing here"}</span>`)}
          ${mine.map(it => opt(it.id, esc(it.name), `<svg viewBox="${W.VIEW[it.slot]}" aria-hidden="true">${it.svg}</svg>`, `<span class="tag">${esc(it.set)}</span>`)).join("")}
        </div>${sl.key === "held" ? badgeRow() : ""}`;
      }).join("");
      const wt = s.weight || 1;
      return `<div class="cl-weight"><div class="cl-wtop"><b>Weight</b><span id="clWLabel">${weightLabel(wt)}</span></div>
          <div class="cl-wrow"><span aria-hidden="true">🐈</span><input type="range" id="clWeight" min="75" max="150" step="5" value="${Math.round(wt * 100)}" aria-label="${esc(name(s))}'s weight"><span aria-hidden="true">🍙</span></div>
          <div class="cl-wbtns"><button type="button" data-w="85">Slim</button><button type="button" data-w="100">Just right</button><button type="button" data-w="125">Chubby</button><button type="button" data-w="150">Chonk</button></div></div>
        <div class="cl-collar"><div class="cl-wtop"><b>Collar color</b><span id="clCLabel">${(COLLARS.find(c => c[0] === s.collar) || COLLARS[0])[2]}</span></div>
          <div class="cl-swatches" role="radiogroup" aria-label="Collar color">${COLLARS.map(([key, hex, label]) => `<button type="button" class="cl-sw${s.collar === key ? " on" : ""}" data-collar="${key}" style="--sw:${hex}" role="radio" aria-checked="${s.collar === key}" aria-label="${label}"></button>`).join("")}</div>
          <p class="cl-cnote">Every Dexter wears a collar. ${(s.equip.badges || []).length ? `${(s.equip.badges || []).length} badge${(s.equip.badges || []).length > 1 ? "s" : ""} pinned on it.` : "Pin your reading badges on it."} <button type="button" class="cl-link" id="clBadges">Badge Case ›</button></p></div>
        <div class="sh-bar"><p class="sh-hint">Tap to dress Dexter. Mix any items you own, keep his own gear, or take it all off.</p></div>
        ${s.owned.length ? "" : `<div class="cl-empty"><b>Your closet is empty</b><span>Earn gold with right answers and buy hats, outfits and accessories in the Shop.</span><button type="button" class="sh-act" id="goShop">Visit the Shop</button></div>`}
        ${rows}
        <div class="cl-reset"><button type="button" class="sh-act ghost" id="clDefault">${esc(name(s))}'s own look</button><button type="button" class="sh-act ghost" id="clBare">Take everything off</button></div>`;
    }
    function shopHTML(s) {
      const it = st.sel ? W.byId[st.sel] : null, own = it && s.owned.includes(it.id), on = it && s.equip[it.slot] === it.id;
      let action = `<p class="sh-hint">Tap an item to try it on.</p>`;
      if (it) action = `<div class="sh-sel"><b>${esc(it.name)}</b><span>${esc(it.set)} · ${on ? "Wearing" : own ? "Owned" : `${COIN}${it.price} gold`}</span></div>` + (
        on ? `<button type="button" class="sh-act ghost" id="shOff">Take off</button>`
        : own ? `<button type="button" class="sh-act" id="shWear">Wear</button>`
        : s.gold >= it.price ? `<button type="button" class="sh-act" id="shBuy">Buy for ${it.price}</button>`
        : `<button type="button" class="sh-act" disabled>Need ${it.price - s.gold} more gold</button>`);
      return `<div class="sh-bar">${action}</div>
        <div class="sh-tabs sub" role="tablist">${SUBS.map(([key, label]) => `<button type="button" role="tab" aria-selected="${st.sub === key}" data-sub="${key}">${label}</button>`).join("")}</div>
        ${slotsFor(st.sub).map(sl => `<p class="sh-cap">${esc(sl.name)}</p><div class="sh-grid">${W.ITEMS.filter(i => i.slot === sl.key).map(i => shopTile(i, s)).join("")}</div>`).join("")}
        <p class="sh-note">Earn gold with every right answer: Easy 3 · Medium 5 · Hard 8 · Expert 12, multiplied by your streak, plus ${EVOLVE_BONUS} each time Dexter evolves. Bought items go to your Closet and show up on Dexter in every form.</p>`;
    }
    function paint() {
      const s = load(), k = stageOf(s.pts);
      syncBadges();
      const d = st.tab === "closet" && W ? dressGet() : null, many = d && catList().list.length > 1;
      const body = st.tab === "settings" ? settingsHTML(s) : st.tab === "cats" ? catsHTML() : st.tab === "progress" || !W ? progressHTML(s) : st.tab === "shop" ? shopHTML(s) : st.tab === "badges" ? badgesHTML(load()) : closetHTML(d, stageOf(d.pts));
      shop.innerHTML = `<div class="bb-card bb-shop${st.opened ? " still" : ""}" role="dialog" aria-modal="true" aria-labelledby="shTitle">
        <div class="sh-head"><h3 id="shTitle">${esc(name(d || s))}</h3><span class="sh-gold" aria-label="${s.gold} gold">${COIN}${fmt(s.gold)}</span><button type="button" class="sh-done" id="shDone">Done</button></div>
        <div class="sh-tabs pal" role="tablist">${[["cats", "Cats"], ["closet", "Closet"], ["shop", "Shop"], ["badges", "Badges"], ["progress", "Progress"], ["settings", "⚙"]].map(([key, label]) => `<button type="button" role="tab" aria-selected="${st.tab === key}" data-tab="${key}"${key === "settings" ? ` aria-label="Cat settings" title="Cat settings" class="sh-gear"` : ""}>${label}</button>`).join("")}</div>
        ${d ? `${dressPicker()}<div class="sh-stage cl-stage" style="--dz:${sizeFor(d.pts).toFixed(2)}">${many ? `<button type="button" class="cl-arrow l" data-step="-1" aria-label="Previous cat">‹</button>` : ""}<span class="cl-who">${dressArt(d, "wide")}</span>${many ? `<span class="cl-name">Dressing <b>${esc(name(d))}</b></span><button type="button" class="cl-arrow r" data-step="1" aria-label="Next cat">›</button>` : ""}</div>`
          : st.tab === "progress" || st.tab === "cats" || st.tab === "settings" ? "" : `<div class="sh-stage" style="--dz:${sizeFor(s.pts).toFixed(2)}">${art(k, st.tab === "shop" ? st.tryEq : s.equip, { eyes: "wide" })}</div>`}
        ${d ? statsHTML(d) + `<p class="sh-cap pf-acc">Accessories &amp; looks</p>` : ""}
        ${body}
      </div>`;
      $("shDone").onclick = closeShop;
      shop.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { st.tab = b.dataset.tab; st.sel = null; st.tryEq = Object.assign({}, load().equip); paint(); shop.querySelector(".bb-shop").scrollTop = 0 });
      shop.querySelectorAll("[data-sub]").forEach(b => b.onclick = () => keepScroll(() => { st.sub = b.dataset.sub; st.sel = null; st.tryEq = Object.assign({}, load().equip); paint() }));
      if (st.tab === "settings") {
        $("bbRename").onclick = () => { const n = prompt("Name your study buddy:", s.nick || "Dexter"); if (n === null) return; const t = load(); t.nick = n.trim().slice(0, 24); save(t); paintDock(); paint() };
        $("bbHide").onclick = () => { setEnabled(false); closeShop() };
        $("pgShowLv").onchange = e => { setShowLv(e.target.checked); refreshMates() };
        $("bbMeow").onchange = e => setSound(e.target.checked);
        $("bbSize").oninput = e => { $("bbSizeOut").textContent = e.target.value + "%"; setSize(e.target.value / 100) };
        $("bbAnchor").onchange = e => keepScroll(() => { setAnchored(e.target.checked); paint() });
        if ($("bbSpotReset")) $("bbSpotReset").onclick = () => keepScroll(() => { setAnchored(false); setSpot(null); const H = household(); H.spots = {}; saveHouse(H); paint(); placeMates() });
        return;
      }
      if (st.tab === "cats") {
        shop.querySelectorAll("[data-dressgo]").forEach(b => b.onclick = () => { st.dress = b.dataset.dressgo; st.tab = "closet"; paint(); shop.querySelector(".bb-shop").scrollTop = 0 });
        shop.querySelectorAll("[data-train]").forEach(b => b.onclick = () => keepScroll(() => { trainCat(b.dataset.train); paint(); paintDock(); refreshMates() }));
        shop.querySelectorAll("[data-unpin]").forEach(b => b.onclick = () => keepScroll(() => { setMateSpot(b.dataset.unpin, null); paint(); placeMates() }));
        shop.querySelectorAll("[data-along]").forEach(b => b.onchange = () => keepScroll(() => { const H = household(); const id = b.dataset.along; H.along = b.checked ? H.along.concat(id).slice(0, MAX_ALONG) : H.along.filter(x => x !== id); H.co = H.co.filter(x => H.along.includes(x)); saveHouse(H); paint(); refreshMates() }));
        shop.querySelectorAll("[data-co]").forEach(b => b.onchange = () => keepScroll(() => { const H = household(); const id = b.dataset.co; H.co = b.checked ? H.co.filter(x => x !== id).concat(id) : H.co.filter(x => x !== id); saveHouse(H); paint(); refreshMates() }));
        shop.querySelectorAll("[data-return]").forEach(b => b.onclick = () => {
          const c = catList().list.find(x => x.id === b.dataset.return); if (!c) return; const nm = c.nick || "Dexter";
          if (!confirm(`Return ${nm} to the café? ${nm} keeps all their XP, outfits and badges, and you can bring them home again from the café any time.`)) return;
          keepScroll(() => { returnCat(c.id); paint(); refreshMates(); settle() }); pop(`<b>${esc(nm)} moved into the café</b><small>Visit to adopt someone new or bring ${esc(nm)} back</small>`, "buy");
        });
        $("ctCafe").onclick = () => { closeShop(); openCafe() };
        if ($("ctSafari")) $("ctSafari").onclick = () => { closeShop(); openCafe("safari") };
        return;
      }
      if (st.tab === "badges") {
        shop.querySelectorAll(".bc-slot").forEach(b => b.onclick = () => keepScroll(() => { st.bsel = b.dataset.id; paint() }));
        const setPins = fn => keepScroll(() => { const t = load(); t.equip.badges = fn(t.equip.badges || []); save(t); paint(); paintDock() });
        const order = l => W.ITEMS.filter(i => i.slot === "badge" && l.includes(i.id)).map(i => i.id);   // keep chapter order along the collar
        if ($("bcPin")) $("bcPin").onclick = () => setPins(l => order(l.concat(st.bsel)));
        if ($("bcOff")) $("bcOff").onclick = () => setPins(l => l.filter(x => x !== st.bsel));
        if ($("bcAll")) $("bcAll").onclick = () => setPins(l => { const got = load().owned.filter(id => id.startsWith("badge-")); return l.length === got.length ? [] : order(got) });
        return;
      }
      if (st.tab === "closet") {
        const set = fn => keepScroll(() => { dressSet(fn); paint(); paintDock() });
        $("pfShowLv").onchange = e => { setShowLv(e.target.checked); refreshMates() };
        shop.querySelectorAll("[data-dress]").forEach(b => b.onclick = () => keepScroll(() => { st.dress = b.dataset.dress; paint() }));
        shop.querySelectorAll("[data-step]").forEach(b => b.onclick = () => keepScroll(() => { const L = catList().list, i = L.findIndex(c => c.id === dressId()); st.dress = L[(i + +b.dataset.step + L.length) % L.length].id; paint() }));
        // weight: the stage updates live while dragging; the rest of the page when you let go
        const setW = (v, done) => { const t = dressSet(t => { t.weight = Math.min(1.5, Math.max(.75, v / 100)) }); $("clWLabel").textContent = weightLabel(t.weight); $("clWeight").value = Math.round(t.weight * 100); const stg = shop.querySelector(".cl-who"); if (stg) stg.innerHTML = dressArt(dressGet(), "wide"); if (done) paintDock() };
        $("clWeight").oninput = e => setW(+e.target.value); $("clWeight").onchange = e => setW(+e.target.value, true);
        shop.querySelectorAll("[data-w]").forEach(b => b.onclick = () => setW(+b.dataset.w, true));
        shop.querySelectorAll(".sh-tile.cl").forEach(b => b.onclick = () => set(t => { if (b.dataset.val === "") delete t.equip[b.dataset.slot]; else t.equip[b.dataset.slot] = b.dataset.val }));
        if ($("goShop")) $("goShop").onclick = () => { st.tab = "shop"; paint() };
        // outfit resets keep the collar and the badges pinned on it
        $("clDefault").onclick = () => set(t => { t.equip = { badges: t.equip.badges || [] } });
        $("clBare").onclick = () => set(t => { t.equip = Object.assign(Object.fromEntries(W.SLOTS.filter(x => x.key !== "badge").map(x => [x.key, "none"])), { badges: t.equip.badges || [] }) });
        shop.querySelectorAll("[data-collar]").forEach(b => b.onclick = () => set(t => { t.collar = b.dataset.collar }));
        $("clBadges").onclick = () => { st.tab = "badges"; paint() };
        shop.querySelectorAll("[data-badge]").forEach(b => b.onclick = () => set(t => { const id = b.dataset.badge, l = t.equip.badges || []; const nl = l.includes(id) ? l.filter(x => x !== id) : l.concat(id); t.equip.badges = W.ITEMS.filter(i => i.slot === "badge" && nl.includes(i.id)).map(i => i.id) }));
        if ($("clMoreBadges")) $("clMoreBadges").onclick = () => { st.tab = "badges"; paint() };
        return;
      }
      const it = st.sel ? W.byId[st.sel] : null;
      shop.querySelectorAll(".sh-tile[data-id]").forEach(b => b.onclick = () => keepScroll(() => {
        const i = W.byId[b.dataset.id], cur = load().equip;
        st.sel = st.sel === i.id ? null : i.id;
        st.tryEq = Object.assign({}, cur); if (st.sel) st.tryEq[i.slot] = i.id;
        paint();
      }));
      const act = fn => () => keepScroll(() => { fn(); paint(); paintDock() });
      if ($("shBuy")) $("shBuy").onclick = act(() => { const t = load(); if (t.gold < it.price || t.owned.includes(it.id)) return; t.gold -= it.price; t.owned.push(it.id); t.equip[it.slot] = it.id; save(t); st.tryEq = Object.assign({}, t.equip); pop(`<b>New: ${esc(it.name)}!</b><small>${COIN}−${it.price} gold</small>`, "buy") });
      if ($("shWear")) $("shWear").onclick = act(() => { const t = load(); t.equip[it.slot] = it.id; save(t); st.tryEq = Object.assign({}, t.equip) });
      if ($("shOff")) $("shOff").onclick = act(() => { const t = load(); delete t.equip[it.slot]; save(t); st.tryEq = Object.assign({}, t.equip); st.sel = null });
    }
    paint(); st.opened = true; $("shDone").focus();   // the panel animates in once; later repaints don't replay it
  }
  const openShop = sub => openPal("shop", sub), openCard = () => openPal("closet");
  // ===== The Cat Café: where you meet new cats (one of every breed is lounging about) and where your own cats chill
  // when they aren't studying. Tap a cat to meet them: pick a coat color, name them, and bring them home to study.
  // Spots: x, y = where the cat's feet go; z = size; pose; act = a toy game the cat plays there (uses the study pal's
  // part animations); tree = on the cat tree; inside = in the cubby house (only the face shows in the doorway)
  const CF_EYES = { yarn: "dilated", laser: "dilated", feather: "dilated", mouse: "focus" };
  const CAFE_SPOTS = [
    { x: 102, y: 249, z: 78, pose: "lie" }, { x: 270, y: 212, z: 56, pose: "sit" }, { x: 304, y: 270, z: 54, pose: "lie" },
    { x: 207, y: 268, z: 44, pose: "lie" },   // the rope bridge between the window and the shelves
    { x: 202, y: 303, z: 44, pose: "sit" }, { x: 222, y: 333, z: 42, pose: "sit" },   // wall steps
    { x: 318, y: 344, z: 66, pose: "sit" },   // on the counter
    { x: 58, y: 420, z: 76, pose: "lie" }, { x: 142, y: 416, z: 74, pose: "sit" },   // the sofa
    { x: 104, y: 560, z: 84, pose: "sit", act: "yarn" }, { x: 206, y: 590, z: 80, pose: "stand", act: "mouse" },   // rug games
    { x: 72, y: 612, z: 76, pose: "lie" },   // the basket
    { x: 224, y: 494, z: 58, pose: "lie" },   // under the latte table
    { x: 36, y: 498, z: 62, pose: "sit", act: "feather" }, { x: 168, y: 500, z: 62, pose: "stand", act: "laser" }, { x: 30, y: 580, z: 58, pose: "sit", act: "yarn" },
    // the café's cat tree: top perch ×2, hammock, cubby roof (above the doorway), base, inside the house
    { x: 283, y: 486, z: 54, pose: "sit", tree: 1 }, { x: 321, y: 486, z: 54, pose: "sit", tree: 1 }, { x: 328, y: 528, z: 52, pose: "lie", tree: 1 },
    { x: 279, y: 547, z: 44, pose: "sit", tree: 1 }, { x: 319, y: 601, z: 52, pose: "sit", tree: 1 },
    { x: 278, y: 591, z: 40, pose: "sit", tree: 1, inside: 1 },
    // left side (wide screens): window seat ×2, climbing shelves ×3, café chair, scratching post top, box, donut bed, tunnel, rug games, food bowls
    { x: -346, y: 240, z: 62, pose: "lie", side: 1 }, { x: -272, y: 240, z: 56, pose: "sit", side: 1 },
    { x: -62, y: 150, z: 42, pose: "sit", side: 1 }, { x: -30, y: 200, z: 40, pose: "lie", side: 1 }, { x: -76, y: 248, z: 42, pose: "sit", side: 1 },
    { x: -286, y: 484, z: 50, pose: "sit", side: 1 }, { x: -160, y: 400, z: 52, pose: "sit", side: 1 }, { x: -252, y: 538, z: 56, pose: "lie", side: 1 },
    { x: -388, y: 614, z: 66, pose: "lie", side: 1 }, { x: -226, y: 630, z: 54, pose: "stand", act: "mouse", side: 1 },
    { x: -120, y: 566, z: 64, pose: "sit", act: "feather", side: 1 }, { x: -330, y: 584, z: 60, pose: "stand", act: "yarn", side: 1 }, { x: -96, y: 626, z: 54, pose: "sit", side: 1 },
    // right side: bookshelf top and cubby, pastry case, wall bridge ×2 and its middle, armchair, wheel, wave scratcher, rug games
    { x: 444, y: 96, z: 46, pose: "lie", side: 1 }, { x: 470, y: 294, z: 40, pose: "sit", side: 1 }, { x: 430, y: 344, z: 52, pose: "lie", side: 1 },
    { x: 548, y: 216, z: 44, pose: "sit", side: 1 }, { x: 752, y: 216, z: 44, pose: "sit", side: 1 }, { x: 650, y: 238, z: 46, pose: "lie", side: 1 },
    { x: 572, y: 500, z: 62, pose: "lie", side: 1 }, { x: 700, y: 548, z: 50, pose: "sit", side: 1 }, { x: 440, y: 604, z: 60, pose: "lie", side: 1 },
    { x: 556, y: 612, z: 66, pose: "stand", act: "laser", side: 1 }, { x: 650, y: 630, z: 60, pose: "sit", act: "yarn", side: 1 }, { x: 768, y: 618, z: 56, pose: "sit", side: 1 }
  ];
  // wall climbing: a rope bridge from the window sill to the shelves, and two wall steps
  const CAFE_WALL = `<path d="M176 256 Q207 276 238 278" stroke="#8a5a32" stroke-width="2" fill="none"/><path d="M176 249 Q207 270 238 272" stroke="#8a5a32" stroke-width="1.6" fill="none"/>
    ${Array.from({ length: 7 }, (_, i) => { const t = (i + .5) / 7, x = 176 + 62 * t, y = 252 + 2 * (1 - t) * t * 20 + t * t * 22; return `<rect x="${(x - 3.6).toFixed(1)}" y="${(y - 1).toFixed(1)}" width="7.2" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1.1"/>` }).join("")}
    ${[[202, 303, 26], [222, 333, 24]].map(([x, y, w]) => `<path d="M${x - w / 2} ${y} H${x + w / 2} Q${x + w / 2} ${y + 7} ${x} ${y + 7} Q${x - w / 2} ${y + 7} ${x - w / 2} ${y}Z" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M${x - w / 2} ${y} H${x + w / 2}" stroke="#7aa3cf" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${y + 7} L${x - 6} ${y + 16}" stroke="#8a5a32" stroke-width="2"/>`).join("")}`;
  // toys on the floor: rolling yarn balls, a zooming robot mouse, a laser dot, a feather wand, a ball-track toy, plush and crinkle balls
  const yarnBall = (c, d) => `<circle r="6.4" fill="${c}" stroke="#3a2a1e" stroke-width="1.4"/><path d="M-5 -2 Q0 -6 5 -1 M-5 2 Q0 -2 5 3 M-2 -6 Q2 0 -1 6" stroke="${d}" stroke-width="1" fill="none"/>`;
  const CAFE_TOYS = `
    <g><animateTransform attributeName="transform" type="translate" values="140 566;150 568;134 565;140 566" dur="3.4s" repeatCount="indefinite"/><g>${yarnBall("#4f8dff", "#2c5fc4")}<animateTransform attributeName="transform" type="rotate" values="0;140;-60;0" dur="3.4s" repeatCount="indefinite"/></g></g>
    <path d="M146 570 Q170 586 160 600 Q150 612 176 614" stroke="#4f8dff" stroke-width="1.2" fill="none"/>
    <g transform="translate(118 624)">${yarnBall("#ff8fb3", "#d9467a")}</g><path d="M124 626 Q140 634 132 638" stroke="#ff8fb3" stroke-width="1.2" fill="none"/>
    <g transform="translate(62 586)"><g><animateTransform attributeName="transform" type="translate" values="0 0;-8 0;0 0" dur="1.8s" repeatCount="indefinite"/>${yarnBall("#a3e635", "#5d8f1c")}</g></g>
    <g><animateTransform attributeName="transform" type="translate" values="128 614;184 618;240 612;184 618;128 614" keyTimes="0;.25;.5;.75;1" dur="9s" repeatCount="indefinite"/>
      <g><animateTransform attributeName="transform" type="scale" values="1 1;-1 1" keyTimes="0;.5" calcMode="discrete" dur="9s" repeatCount="indefinite"/>
        <path d="M-12 1 Q-20 0 -22 -6" stroke="#6b7280" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M-12 2 Q-12 -9 0 -9 Q12 -9 14 0 Q14 3 10 3 H-10 Q-12 3 -12 2Z" fill="#c7cdd6" stroke="#3a2a1e" stroke-width="1.4"/>
        <path d="M-6 -7 Q0 -10 6 -7" stroke="#fff" stroke-width="1.2" fill="none" opacity=".7"/><circle cx="8" cy="-3" r="1.6" fill="#22d3ee"><animate attributeName="opacity" values="1;.3;1" dur=".6s" repeatCount="indefinite"/></circle>
        <path d="M2 -9 L4 -15" stroke="#3a2a1e" stroke-width="1"/><circle cx="4" cy="-16" r="1.4" fill="#ff3b30"><animate attributeName="opacity" values="1;.2;1" dur=".8s" repeatCount="indefinite"/></circle>
        <circle cx="-6" cy="3.6" r="2.4" fill="#3a3640"/><circle cx="6" cy="3.6" r="2.4" fill="#3a3640"/><circle cx="14" cy="0" r="1" fill="#ff7a9a"/></g></g>
    <g><animateTransform attributeName="transform" type="translate" values="140 512;196 506;160 520;206 516;132 506;140 512" dur="4s" repeatCount="indefinite"/><circle r="5" fill="#ff3b30" opacity=".25"/><circle r="2.4" fill="#ff3b30"/></g>
    <g transform="translate(60 484)"><path d="M0 0 L-30 14" stroke="#8b5a2b" stroke-width="1.8" stroke-linecap="round"/><g><animateTransform attributeName="transform" type="rotate" values="-14;18;-14" dur="1.6s" repeatCount="indefinite"/><path d="M0 0 Q6 4 4 12" stroke="#3a2a1e" stroke-width=".9" fill="none"/><path d="M4 12 C-2 16 -2 26 4 30 C10 26 10 16 4 12Z" fill="#c084fc" stroke="#3a2a1e" stroke-width="1.1"/><path d="M4 14 V29" stroke="#7c3aed" stroke-width=".8"/></g></g>
    <g transform="translate(40 610)"><ellipse rx="20" ry="6.4" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1.6"/><ellipse rx="14" ry="3.4" fill="#ffefa6" stroke="#3a2a1e" stroke-width="1"/><circle r="3" fill="#ff5f87" stroke="#3a2a1e" stroke-width="1"><animateMotion path="M17 0 A17 5 0 1 1 -17 0 A17 5 0 1 1 17 0" dur="1.6s" repeatCount="indefinite"/></circle></g>
    <g transform="translate(96 634) rotate(-12)"><path d="M-10 0 Q-2 -6 8 0 Q-2 6 -10 0Z M8 0 L14 -5 V5Z" fill="#7dd3fc" stroke="#3a2a1e" stroke-width="1.2"/><circle cx="-5" cy="-1" r=".9" fill="#3a2a1e"/></g>
    ${[[188, 628, "#c0c7d4"], [230, 540, "#f2d48a"], [12, 548, "#b8e3ff"]].map(([x, y, c]) => `<g transform="translate(${x} ${y})"><circle r="3.6" fill="${c}" stroke="#3a2a1e" stroke-width="1"/><path d="M-2 -1 l2 -1.6 l1.6 2" stroke="#fff" stroke-width=".9" fill="none"/></g>`).join("")}`;
  const CAFE_SCENE = `<defs>
      <linearGradient id="cfWall" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fbeedd"/><stop offset="1" stop-color="#f1d9bd"/></linearGradient>
      <linearGradient id="cfSky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8ec8f5"/><stop offset=".65" stop-color="#ffd9b0"/><stop offset="1" stop-color="#ffb98a"/></linearGradient>
      <linearGradient id="cfWood" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#c8925f"/><stop offset="1" stop-color="#a87445"/></linearGradient>
      <linearGradient id="cfFloor" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#d9a873"/><stop offset="1" stop-color="#c08a56"/></linearGradient>
      <radialGradient id="cfGlow"><stop offset="0" stop-color="#ffe7a8" stop-opacity=".75"/><stop offset="1" stop-color="#ffe7a8" stop-opacity="0"/></radialGradient>
      <pattern id="cfPaw" width="36" height="36" patternUnits="userSpaceOnUse"><g fill="#efd2b0" opacity=".7" transform="translate(18 18)"><ellipse cy="2" rx="3" ry="2.4"/><circle cx="-3" cy="-2" r="1.2"/><circle cx="-1" cy="-3.6" r="1.2"/><circle cx="1" cy="-3.6" r="1.2"/><circle cx="3" cy="-2" r="1.2"/></g></pattern>
      <clipPath id="cfWin"><path d="M36 246 V120 Q36 70 100 70 Q164 70 164 120 V246Z"/></clipPath></defs>
    <rect x="-1440" y="-400" width="3240" height="800" fill="#fbeedd"/><rect x="-1440" width="3240" height="400" fill="url(#cfWall)"/><rect x="-1440" y="-400" width="3240" height="700" fill="url(#cfPaw)"/><rect x="-1440" y="-400" width="3240" height="396" fill="#f3dcc0"/><path d="M-1440 -4 H1800" stroke="#c8925f" stroke-width="8"/><path d="M-1440 1 H1800" stroke="#8a5a32" stroke-width="2"/>
    <rect x="-1440" y="300" width="3240" height="100" fill="#d3a679"/><path d="M-1440 300 H1800" stroke="#8a5a32" stroke-width="4"/>${[-1422, -1332, -1242, -1152, -1062, -972, -882, -792, -702, -612, -522, -432, -342, -252, -162, -72, 18, 108, 198, 288, 378, 468, 558, 648, 738, 828, 918, 1008, 1098, 1188, 1278, 1368, 1458, 1548, 1638].map(x => `<rect x="${x}" y="314" width="66" height="72" rx="4" fill="none" stroke="#b9875a" stroke-width="2.4"/>`).join("")}
    <rect x="-1440" y="400" width="3240" height="240" fill="url(#cfFloor)"/>${[430, 470, 515, 565, 620].map(y => `<path d="M-1440 ${y} H1800" stroke="#b07c4a" stroke-width="1.4" opacity=".6"/>`).join("")}${[60, 150, 250, 330].map((x, i) => `<path d="M${x} ${400 + i * 10} v30" stroke="#b07c4a" stroke-width="1.2" opacity=".5"/>`).join("")}
    ${(() => {   // only seen on wide screens, where the café fills the screen: more room to either side
      const win = x => `<g transform="translate(${x} 0)"><rect x="0" y="80" width="120" height="160" rx="10" fill="#9fd0f2" stroke="#8a5a32" stroke-width="7"/><rect x="0" y="180" width="120" height="60" fill="#ffc9a0" opacity=".7"/><path d="M60 80 V240 M0 160 H120" stroke="#8a5a32" stroke-width="4"/><rect x="-8" y="236" width="136" height="12" rx="4" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="2"/><g transform="translate(100 236)"><path d="M-9 0 L-7 -14 H7 L9 0Z" fill="#d9774a" stroke="#3a2a1e" stroke-width="1.8"/><circle cy="-24" r="11" fill="#5ea85a" stroke="#3a2a1e" stroke-width="1.6"/><circle cx="-4" cy="-27" r="2.2" fill="#ff8fb3"/></g></g>`;
      const frame = (x, y, c) => `<g transform="translate(${x} ${y})"><rect width="54" height="42" rx="3" fill="#8a5a32" stroke="#3a2a1e" stroke-width="1.8"/><rect x="5" y="5" width="44" height="32" fill="${c}"/><path d="M14 30 l6 -9 l6 9 M30 30 l6 -9 l6 9" fill="#3a2a1e" opacity=".55"/><ellipse cx="27" cy="31" rx="13" ry="4" fill="#3a2a1e" opacity=".55"/></g>`;
      const plant = x => `<g transform="translate(${x} 400)"><path d="M-16 0 L-12 -30 H12 L16 0Z" fill="#d9744a" stroke="#3a2a1e" stroke-width="2"/><path d="M0 -30 Q-26 -70 -12 -96 M0 -30 Q4 -80 18 -100 M0 -30 Q24 -60 30 -78 M0 -30 Q-14 -50 -30 -60" stroke="#4f9a4a" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
      const lamp = x => `<g transform="translate(${x} 0)"><path d="M0 0 V40" stroke="#3a2a1e" stroke-width="2"/><path d="M-16 58 Q0 34 16 58Z" fill="#ffd36e" stroke="#3a2a1e" stroke-width="2"/><circle cy="70" r="26" fill="url(#cfGlow)"/></g>`;
      return [-560, -940, 800, 1180].map(win).join("") + [[-680, 150, "#cfe8ff"], [-1060, 110, "#ffe4ec"], [940, 110, "#ffe9a8"], [1320, 150, "#e8dcff"]].map(f => frame(...f)).join("")
        + [-800, -1180, 1160, 1540].map(plant).join("") + [-470, -850, 830, 1210].map(lamp).join("");
    })()}
    <g clip-path="url(#cfWin)"><rect x="30" y="64" width="140" height="190" fill="url(#cfSky)"/><circle cx="130" cy="150" r="16" fill="#ffe9a8" opacity=".9"/>
      <g fill="#fff" opacity=".9"><animateTransform attributeName="transform" type="translate" values="-60 0;180 0" dur="38s" repeatCount="indefinite"/><ellipse cx="40" cy="104" rx="20" ry="7"/><ellipse cx="54" cy="99" rx="12" ry="8"/></g>
      <g fill="#fff" opacity=".75"><animateTransform attributeName="transform" type="translate" values="-140 0;120 0" dur="52s" repeatCount="indefinite"/><ellipse cx="80" cy="128" rx="16" ry="5"/><ellipse cx="90" cy="124" rx="9" ry="6"/></g>
      <path d="M30 246 V196 h16 v-22 h14 v30 h12 v-40 h18 v26 h14 v-16 h16 v32 h14 v-24 h16 v60Z" fill="#c98f7a" opacity=".55"/><path d="M30 246 V214 h22 v-12 h18 v18 h20 v-8 h24 v14 h20 v-20 h26 v54Z" fill="#a8707a" opacity=".55"/></g>
    <path d="M36 246 V120 Q36 70 100 70 Q164 70 164 120 V246" fill="none" stroke="#8a5a32" stroke-width="7"/><path d="M100 72 V246 M38 160 H162" stroke="#8a5a32" stroke-width="4"/>
    <path d="M20 62 Q30 160 22 250 L44 250 Q38 160 40 64Z" fill="#e98a7a" stroke="#3a2a1e" stroke-width="2"/><path d="M180 62 Q170 160 178 250 L156 250 Q162 160 160 64Z" fill="#e98a7a" stroke="#3a2a1e" stroke-width="2"/><path d="M14 58 H186" stroke="#8a5a32" stroke-width="5" stroke-linecap="round"/>
    <rect x="24" y="246" width="152" height="12" rx="4" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="2"/>
    <g transform="translate(46 246)"><path d="M-9 0 L-7 -16 H7 L9 0Z" fill="#d9774a" stroke="#3a2a1e" stroke-width="1.8"/><path d="M0 -16 Q-12 -34 -4 -40 M0 -16 Q8 -36 14 -30 M0 -16 Q-2 -40 4 -46" stroke="#4f9d3a" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    <rect x="198" y="58" width="146" height="124" rx="6" fill="#8a5a32" stroke="#3a2a1e" stroke-width="2"/><rect x="205" y="65" width="132" height="110" rx="3" fill="#2f4a3d"/>
    <g font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive" fill="#f4f1e8"><text x="271" y="88" font-size="16" text-anchor="middle" font-weight="700">☕ Cat Café</text><text x="214" y="110" font-size="10.5">Purr-ista latte</text><text x="328" y="110" font-size="10.5" text-anchor="end">3</text><text x="214" y="127" font-size="10.5">Catnip tea</text><text x="328" y="127" font-size="10.5" text-anchor="end">2</text><text x="214" y="144" font-size="10.5">Tuna toastie</text><text x="328" y="144" font-size="10.5" text-anchor="end">4</text><text x="271" y="164" font-size="10" text-anchor="middle" fill="#ffd1dc">study breaks ♥</text></g>
    <rect x="212" y="214" width="136" height="8" rx="3" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.8"/><rect x="236" y="272" width="122" height="8" rx="3" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.8"/>
    ${[[216, "#e85d75", 26], [224, "#4f8dff", 30], [232, "#ffcf33", 24], [240, "#34c759", 28]].map(([x, c, h]) => `<rect x="${x}" y="${214 - h}" width="8" height="${h}" rx="1.5" fill="${c}" stroke="#3a2a1e" stroke-width="1.4"/>`).join("")}
    <g transform="translate(332 214)"><path d="M-8 0 L-6 -12 H6 L8 0Z" fill="#f2f2f2" stroke="#3a2a1e" stroke-width="1.6"/><path d="M0 -12 Q-10 6 -18 30 M0 -12 Q4 12 -2 40 M0 -12 Q12 4 14 26" stroke="#4f9d3a" stroke-width="2.6" fill="none" stroke-linecap="round"/>${[[-14, 18], [-4, 30], [12, 18], [-16, 30]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.2" fill="#5fae45"/>`).join("")}</g>
    <g transform="translate(256 272)"><rect x="-8" y="-14" width="16" height="14" rx="3" fill="#ffe4ec" stroke="#3a2a1e" stroke-width="1.6"/><path d="M8 -10 q6 0 6 4 q0 4 -6 4" stroke="#3a2a1e" stroke-width="1.6" fill="none"/><text x="0" y="-4" font-size="8" text-anchor="middle">🐟</text></g>
    ${[120, 260].map((x, i) => `<g><animateTransform attributeName="transform" type="rotate" values="-3 ${x} 0;3 ${x} 0;-3 ${x} 0" dur="${5 + i}s" repeatCount="indefinite"/><path d="M${x} 0 V36" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cx="${x}" cy="64" rx="60" ry="40" fill="url(#cfGlow)"/><path d="M${x - 16} 50 Q${x} 30 ${x + 16} 50Z" fill="#2f4a3d" stroke="#3a2a1e" stroke-width="1.8"/><circle cx="${x}" cy="52" r="5" fill="#ffe7a8"/></g>`).join("")}
    <path d="M0 22 Q90 48 180 26 T360 30" stroke="#3a2a1e" stroke-width="1.4" fill="none"/>${Array.from({ length: 13 }, (_, i) => { const x = 8 + i * 28, y = 22 + Math.sin(i * .9) * 8 + 10; return `<circle cx="${x}" cy="${y.toFixed(1)}" r="4" fill="${["#ffd84a", "#ff8fb3", "#7dd3fc", "#a3e635"][i % 4]}"><animate attributeName="opacity" values=".45;1;.45" dur="${1.6 + (i % 3) * .5}s" begin="${(i * .23).toFixed(2)}s" repeatCount="indefinite"/></circle>` }).join("")}
    <rect x="226" y="350" width="140" height="122" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="2.2"/><rect x="220" y="342" width="148" height="12" rx="4" fill="#8a5a32" stroke="#3a2a1e" stroke-width="2"/>${[238, 284].map(x => `<rect x="${x}" y="366" width="36" height="92" rx="4" fill="none" stroke="#8a5a32" stroke-width="2"/>`).join("")}
    <g transform="translate(250 342)"><rect x="-14" y="-30" width="34" height="30" rx="4" fill="#9aa3ad" stroke="#3a2a1e" stroke-width="1.8"/><rect x="-9" y="-24" width="24" height="7" rx="2" fill="#2f2e36"/><path d="M-2 -6 v4 M8 -6 v4" stroke="#3a2a1e" stroke-width="2"/><rect x="0" y="-6" width="8" height="6" rx="1.5" fill="#fff" stroke="#3a2a1e" stroke-width="1.2"/>
      ${[0, 1, 2].map(i => `<path d="M${-2 + i * 5} -34 q-3 -6 0 -12 q3 -6 0 -12" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;.85;0" dur="2.4s" begin="${i * .8}s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 4;0 -6" dur="2.4s" begin="${i * .8}s" repeatCount="indefinite"/></path>`).join("")}</g>
    <g transform="translate(346 342)"><path d="M-14 0 Q-14 -22 0 -22 Q14 -22 14 0Z" fill="#fff" fill-opacity=".5" stroke="#3a2a1e" stroke-width="1.6"/><circle cx="-5" cy="-6" r="4" fill="#f4b183"/><circle cx="4" cy="-7" r="4.4" fill="#e8916a"/></g>
    <path d="M0 372 H184 Q192 372 192 384 V440 H0Z" fill="#7aa3cf" stroke="#3a2a1e" stroke-width="2.2"/><rect x="0" y="352" width="176" height="34" rx="12" fill="#8fb6dd" stroke="#3a2a1e" stroke-width="2.2"/><rect x="168" y="364" width="24" height="76" rx="10" fill="#8fb6dd" stroke="#3a2a1e" stroke-width="2.2"/><path d="M86 386 V438" stroke="#5f86b2" stroke-width="2"/>
    <rect x="12" y="364" width="30" height="24" rx="8" fill="#ffd1dc" stroke="#3a2a1e" stroke-width="1.8" transform="rotate(-8 27 376)"/>
    <ellipse cx="180" cy="576" rx="168" ry="54" fill="#e98a7a" stroke="#3a2a1e" stroke-width="2.2"/><ellipse cx="180" cy="576" rx="146" ry="42" fill="none" stroke="#fff3e6" stroke-width="3" stroke-dasharray="8 6"/><ellipse cx="180" cy="576" rx="100" ry="26" fill="#f2a493"/>
    <g transform="translate(248 432)"><ellipse cx="0" cy="0" rx="30" ry="7" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="2"/><path d="M0 7 V48 M-12 50 H12" stroke="#3a2a1e" stroke-width="3" stroke-linecap="round"/>
      <path d="M-8 -2 V-14 H8 V-2Z" fill="#fff" stroke="#3a2a1e" stroke-width="1.6"/><path d="M8 -12 q5 0 5 4 q0 4 -5 4" stroke="#3a2a1e" stroke-width="1.6" fill="none"/><ellipse cx="0" cy="-14" rx="8" ry="2.4" fill="#c98f5a"/><path d="M-2 -14.4 q2 -2 4 0 q-2 2.4 -2 2.4 q0 0 -2 -2.4Z" fill="#fff"/>
      ${[0, 1].map(i => `<path d="M${-3 + i * 6} -18 q-3 -5 0 -10" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;.8;0" dur="2.8s" begin="${i * 1.1}s" repeatCount="indefinite"/></path>`).join("")}</g>
    <g transform="translate(72 604)"><path d="M-44 0 Q-44 22 0 24 Q44 22 44 0Z" fill="#c99a5b" stroke="#3a2a1e" stroke-width="2.2"/><path d="M-40 6 Q0 14 40 6 M-36 14 Q0 22 36 14" stroke="#a87a3e" stroke-width="1.6" fill="none"/><ellipse cx="0" cy="0" rx="44" ry="10" fill="#f4e1c1" stroke="#3a2a1e" stroke-width="2"/></g>`;
  // Wide screens only: the café opens out to both sides (seen when the café fills a laptop screen).
  // Left: window seat, house rules, climbing shelves, café table, scratching post, box, donut bed, tunnel, food and water.
  // Right: bookshelf cubbies, pastry case with a treat jar, adoption board, wall bridge, armchair, cat wheel, wave scratcher.
  // Props with data-prop can be tapped: the feather wand and pom-pom swing, the wheel spins, the treat jar shakes out treats.
  const CAFE_SIDES = `<ellipse cx="-230" cy="572" rx="150" ry="44" fill="#8fc7b8" stroke="#3a2a1e" stroke-width="2"/><ellipse cx="-230" cy="572" rx="128" ry="34" fill="none" stroke="#e8fff8" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/><path d="M-380 250 V140 Q-380 76 -310 76 Q-240 76 -240 140 V250Z" fill="url(#cfSky)"/><path d="M-380 250 V214 h20 v-18 h16 v26 h14 v-34 h18 v20 h16 v-12 h16 v28 h14 v-20 h14 v60Z" fill="#a8707a" opacity=".5"/><g fill="#fff" opacity=".85"><animateTransform attributeName="transform" type="translate" values="-30 0;40 0;-30 0" dur="30s" repeatCount="indefinite"/><ellipse cx="-330" cy="112" rx="16" ry="6"/><ellipse cx="-320" cy="107" rx="9" ry="6"/></g><path d="M-380 250 V140 Q-380 76 -310 76 Q-240 76 -240 140 V250" fill="none" stroke="#8a5a32" stroke-width="7"/><path d="M-310 78 V250 M-380 166 H-240" stroke="#8a5a32" stroke-width="4"/><rect x="-396" y="250" width="172" height="12" rx="4" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="2"/><rect x="-390" y="238" width="160" height="14" rx="7" fill="#ffb3c1" stroke="#3a2a1e" stroke-width="1.8"/><path d="M-370 245 h120" stroke="#fff" stroke-width="1.4" stroke-dasharray="4 5" opacity=".7"/><rect x="-382" y="226" width="22" height="16" rx="6" fill="#ffe08a" stroke="#3a2a1e" stroke-width="1.5" transform="rotate(-10 -371 234)"/><rect x="-216" y="66" width="114" height="124" rx="5" fill="#8a5a32" stroke="#3a2a1e" stroke-width="2"/><rect x="-210" y="72" width="102" height="112" rx="3" fill="#2f4a3d"/><g font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive" fill="#f4f1e8"><text x="-159" y="92" font-size="12.5" font-weight="700" text-anchor="middle">House rules</text><text x="-204" y="112" font-size="8.6">1. Wash your hands</text><text x="-204" y="128" font-size="8.6">2. Let sleeping cats lie</text><text x="-204" y="144" font-size="8.6">3. Please don't lift us</text><text x="-204" y="160" font-size="8.6">4. No flash photos</text><text x="-159" y="177" font-size="9" text-anchor="middle" fill="#ffd1dc">purr-lease &amp; thank you ♥</text></g><g transform="translate(-96 40)"><rect width="52" height="46" rx="3" fill="#e9b949" stroke="#3a2a1e" stroke-width="1.8"/><rect x="5" y="5" width="42" height="30" fill="#fff4d6"/><g transform="translate(26 22)"><path d="M-9 -4 L-7 -12 L-2 -7 H2 L7 -12 L9 -4 Q9 7 0 7 Q-9 7 -9 -4Z" fill="#f2a65a" stroke="#3a2a1e" stroke-width="1"/><circle cx="-3.4" cy="-2" r="1" fill="#3a2a1e"/><circle cx="3.4" cy="-2" r="1" fill="#3a2a1e"/><path d="M-1 1.4 h2 l-1 1.2z" fill="#ff7a9a"/></g><text x="26" y="42" font-size="5" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="-apple-system,sans-serif">TOP CAT ★</text></g><path d="M-82 150 H-42 V157 H-82Z" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M-82 150 H-42" stroke="#ffb3c1" stroke-width="3" stroke-linecap="round"/><path d="M-74 157 L-74 166 L-66 157" stroke="#8a5a32" stroke-width="2" fill="none"/><path d="M-50 200 H-10 V207 H-50Z" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M-50 200 H-10" stroke="#ffb3c1" stroke-width="3" stroke-linecap="round"/><path d="M-42 207 L-42 216 L-34 207" stroke="#8a5a32" stroke-width="2" fill="none"/><path d="M-96 248 H-56 V255 H-96Z" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M-96 248 H-56" stroke="#ffb3c1" stroke-width="3" stroke-linecap="round"/><path d="M-88 255 L-88 264 L-80 255" stroke="#8a5a32" stroke-width="2" fill="none"/><circle cx="-116" cy="226" r="17" fill="#8a5a32" stroke="#3a2a1e" stroke-width="2"/><circle cx="-116" cy="226" r="12" fill="#3a2a1e"/><g fill="#ffe08a"><ellipse cx="-120" cy="225" rx="1.6" ry="2.2"><animate attributeName="ry" values="2.2;2.2;.2;2.2" keyTimes="0;.9;.95;1" dur="4.6s" repeatCount="indefinite"/></ellipse><ellipse cx="-112" cy="225" rx="1.6" ry="2.2"><animate attributeName="ry" values="2.2;2.2;.2;2.2" keyTimes="0;.9;.95;1" dur="4.6s" repeatCount="indefinite"/></ellipse></g><g class="cf-prop" data-prop="wand" data-x="-30" data-y="250" aria-label="Swing the feather toy"><g class="cf-swing" style="transform-origin:-22px 207px"><g><animateTransform attributeName="transform" type="rotate" values="-6 -22 207;6 -22 207;-6 -22 207" dur="3.2s" repeatCount="indefinite"/><path d="M-22 207 V258" stroke="#3a2a1e" stroke-width="1"/><path d="M-22 258 C-30 264 -30 278 -22 284 C-14 278 -14 264 -22 258Z" fill="#c084fc" stroke="#3a2a1e" stroke-width="1.2"/><path d="M-22 260 V282" stroke="#7c3aed" stroke-width=".8"/><circle cx="-22" cy="257" r="3" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1"/><rect x="-36" y="250" width="28" height="40" fill="transparent"/></g></g></g><g transform="translate(-372 478)"><path d="M-14 -46 V22 M14 -46 V22" stroke="#3a2a1e" stroke-width="3"/><path d="M-14 -46 Q0 -56 14 -46" stroke="#3a2a1e" stroke-width="3" fill="none"/><ellipse cy="0" rx="18" ry="5" fill="#e98a7a" stroke="#3a2a1e" stroke-width="1.8"/><path d="M-12 4 L-14 26 M12 4 L14 26" stroke="#3a2a1e" stroke-width="2.4"/></g><g transform="translate(-286 486)"><path d="M-14 -46 V22 M14 -46 V22" stroke="#3a2a1e" stroke-width="3"/><path d="M-14 -46 Q0 -56 14 -46" stroke="#3a2a1e" stroke-width="3" fill="none"/><ellipse cy="0" rx="18" ry="5" fill="#e98a7a" stroke="#3a2a1e" stroke-width="1.8"/><path d="M-12 4 L-14 26 M12 4 L14 26" stroke="#3a2a1e" stroke-width="2.4"/></g><g transform="translate(-330 456)"><ellipse rx="40" ry="9" fill="#f4f1e8" stroke="#3a2a1e" stroke-width="2"/><path d="M0 9 V66 M-16 68 H16" stroke="#3a2a1e" stroke-width="3.4" stroke-linecap="round"/><path d="M-24 -2 V-14 H-10 V-2Z" fill="#fff" stroke="#3a2a1e" stroke-width="1.5"/><ellipse cx="-17" cy="-14" rx="7" ry="2.2" fill="#c98f5a"/><path d="M-10 -12 q5 0 5 4 q0 4 -5 4" stroke="#3a2a1e" stroke-width="1.4" fill="none"/><path d="M-20 -18 q-3 -5 0 -10" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0"><animate attributeName="opacity" values="0;.8;0" dur="2.6s" repeatCount="indefinite"/></path><ellipse cx="14" cy="-1" rx="14" ry="3.4" fill="#fff" stroke="#3a2a1e" stroke-width="1.2"/><path d="M6 -2 L22 -2 L18 -12Z" fill="#ffd1dc" stroke="#3a2a1e" stroke-width="1.3"/><path d="M8 -4 L20 -4" stroke="#e85d75" stroke-width="1.6"/><circle cx="18" cy="-12" r="2" fill="#e85d75"/></g><g transform="translate(-160 0)"><rect x="-32" y="588" width="64" height="14" rx="4" fill="#d6cbbf" stroke="#3a2a1e" stroke-width="2"/><rect x="-9" y="404" width="18" height="186" fill="#d9b779" stroke="#3a2a1e" stroke-width="2"/><path d="M-9 410 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 416 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 422 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 428 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 434 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 440 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 446 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 452 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 458 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 464 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 470 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 476 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 482 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 488 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 494 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 500 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 506 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 512 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 518 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 524 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 530 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 536 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 542 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 548 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 554 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 560 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 566 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 572 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 578 H9" stroke="#b08d4f" stroke-width="1.2"/><path d="M-9 584 H9" stroke="#b08d4f" stroke-width="1.2"/><ellipse cx="0" cy="402" rx="34" ry="8" fill="#d6cbbf" stroke="#3a2a1e" stroke-width="2"/><ellipse cx="0" cy="399" rx="26" ry="5" fill="#e8dfd6"/></g><g class="cf-prop" data-prop="pom" data-x="-136" data-y="460" aria-label="Bat the pom-pom"><g class="cf-swing" style="transform-origin:-136px 404px"><g><animateTransform attributeName="transform" type="rotate" values="8 -136 404;-8 -136 404;8 -136 404" dur="2.4s" repeatCount="indefinite"/><path d="M-136 404 V448" stroke="#3a2a1e" stroke-width="1"/><circle cx="-136" cy="452" r="6.5" fill="#ff8fb3" stroke="#3a2a1e" stroke-width="1.2"/><path d="M-140 450 l3 3 m2 -5 l2 4" stroke="#fff" stroke-width="1"/><rect x="-148" y="430" width="24" height="32" fill="transparent"/></g></g></g><g transform="translate(-252 540)"><path d="M-34 0 H34 V34 H-34Z" fill="#c98b52" stroke="#3a2a1e" stroke-width="2"/><path d="M-34 0 L-42 -12 L-8 -12 L-2 0Z M34 0 L42 -12 L8 -12 L2 0Z" fill="#dba06a" stroke="#3a2a1e" stroke-width="1.8"/><path d="M-20 14 h14 M8 22 h16" stroke="#8a5a32" stroke-width="1.6"/><text x="0" y="28" font-size="7" font-weight="700" text-anchor="middle" fill="#8a5a32" font-family="-apple-system,sans-serif">FRAGILE ♥</text></g><g transform="translate(-388 616)"><ellipse rx="44" ry="15" fill="#b9a7d6" stroke="#3a2a1e" stroke-width="2"/><ellipse cy="-2" rx="30" ry="8" fill="#e6dcf5"/></g><g transform="translate(-290 618)"><rect x="-44" y="-12" width="88" height="24" rx="12" fill="#4f8dff" stroke="#3a2a1e" stroke-width="2"/><path d="M-36 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><path d="M-27 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><path d="M-18 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><path d="M-9 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><path d="M0 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><path d="M9 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><path d="M18 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><path d="M27 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><path d="M36 -12 V12" stroke="#2c5fc4" stroke-width="1.4"/><ellipse cx="44" rx="7" ry="12" fill="#1e3a7a" stroke="#3a2a1e" stroke-width="2"/></g><g transform="translate(-58 622)"><rect x="-34" y="-6" width="68" height="14" rx="6" fill="#ffd1dc" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cx="-18" cy="-2" rx="11" ry="4" fill="#f2f2f2" stroke="#3a2a1e" stroke-width="1.5"/><ellipse cx="-18" cy="-3" rx="7" ry="2" fill="#b07c4a"/><path d="M6 0 Q6 -18 18 -18 Q30 -18 30 0Z" fill="#cfe8ff" stroke="#3a2a1e" stroke-width="1.5"/><path d="M18 -18 V-24" stroke="#3a2a1e" stroke-width="1.4"/><path d="M18 -24 q-4 4 -6 10" stroke="#7dd3fc" stroke-width="1.6" fill="none"><animate attributeName="stroke-dasharray" values="0 20;20 0" dur="1s" repeatCount="indefinite"/></path></g><g transform="translate(-400 0)"><path d="M0 0 V54 M-10 54 L0 36 L10 54" stroke="#8a5a32" stroke-width="1.4" fill="none"/><path d="M-12 54 H12 L9 68 H-9Z" fill="#d9774a" stroke="#3a2a1e" stroke-width="1.6"/><path d="M-8 66 Q-14 92 -10 108 M0 68 Q2 96 -2 120 M8 66 Q14 90 10 104" stroke="#4f9d3a" stroke-width="3" fill="none" stroke-linecap="round"/></g><g transform="translate(-300 0)"><path d="M0 0 V46" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cy="72" rx="54" ry="38" fill="url(#cfGlow)"/><path d="M-15 60 Q0 40 15 60Z" fill="#e9b949" stroke="#3a2a1e" stroke-width="1.8"/><circle cy="61" r="3" fill="#fff6c9"/></g><g transform="translate(-150 0)"><path d="M0 0 V38" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cy="64" rx="54" ry="38" fill="url(#cfGlow)"/><path d="M-15 52 Q0 32 15 52Z" fill="#e9b949" stroke="#3a2a1e" stroke-width="1.8"/><circle cy="53" r="3" fill="#fff6c9"/></g><path d="M-440 24 Q-222.0 50 -4 24" stroke="#3a2a1e" stroke-width="1.3" fill="none"/><circle cx="-440" cy="30.0" r="4" fill="#ffd84a"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="0.0s" repeatCount="indefinite"/></circle><circle cx="-411" cy="33.2" r="4" fill="#ff8fb3"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="0.3s" repeatCount="indefinite"/></circle><circle cx="-382" cy="36.0" r="4" fill="#7dd3fc"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="0.6s" repeatCount="indefinite"/></circle><circle cx="-353" cy="38.3" r="4" fill="#a3e635"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="0.9s" repeatCount="indefinite"/></circle><circle cx="-324" cy="40.2" r="4" fill="#ffd84a"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="1.2s" repeatCount="indefinite"/></circle><circle cx="-295" cy="41.6" r="4" fill="#ff8fb3"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="1.5s" repeatCount="indefinite"/></circle><circle cx="-266" cy="42.5" r="4" fill="#7dd3fc"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="1.8s" repeatCount="indefinite"/></circle><circle cx="-237" cy="42.9" r="4" fill="#a3e635"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="0.1s" repeatCount="indefinite"/></circle><circle cx="-207" cy="42.9" r="4" fill="#ffd84a"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="0.4s" repeatCount="indefinite"/></circle><circle cx="-178" cy="42.5" r="4" fill="#ff8fb3"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="0.7s" repeatCount="indefinite"/></circle><circle cx="-149" cy="41.6" r="4" fill="#7dd3fc"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="1.0s" repeatCount="indefinite"/></circle><circle cx="-120" cy="40.2" r="4" fill="#a3e635"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="1.3s" repeatCount="indefinite"/></circle><circle cx="-91" cy="38.3" r="4" fill="#ffd84a"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="1.6s" repeatCount="indefinite"/></circle><circle cx="-62" cy="36.0" r="4" fill="#ff8fb3"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="1.9s" repeatCount="indefinite"/></circle><circle cx="-33" cy="33.2" r="4" fill="#7dd3fc"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="0.2s" repeatCount="indefinite"/></circle><circle cx="-4" cy="30.0" r="4" fill="#a3e635"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="0.5s" repeatCount="indefinite"/></circle><g class="cf-yarn"><g transform="translate(-180 600)"><circle r="6.4" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1.4"/><path d="M-5 -2 Q0 -6 5 -1 M-5 2 Q0 -2 5 3" stroke="#c99a1a" stroke-width="1" fill="none"/></g></g><ellipse cx="600" cy="600" rx="170" ry="38" fill="#cfe1f7" stroke="#3a2a1e" stroke-width="2"/><ellipse cx="600" cy="600" rx="146" ry="28" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="10 6"/><rect x="384" y="96" width="120" height="204" rx="4" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="2.2"/><rect x="392" y="104" width="104" height="58" fill="#8a5a32"/><path d="M384 164 H504" stroke="#3a2a1e" stroke-width="2"/><rect x="384" y="162" width="120" height="6" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.4"/><rect x="392" y="170" width="104" height="58" fill="#8a5a32"/><path d="M384 230 H504" stroke="#3a2a1e" stroke-width="2"/><rect x="384" y="228" width="120" height="6" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.4"/><rect x="392" y="236" width="104" height="58" fill="#8a5a32"/><path d="M384 296 H504" stroke="#3a2a1e" stroke-width="2"/><rect x="384" y="294" width="120" height="6" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.4"/><rect x="396" y="122" width="8" height="40" rx="1.4" fill="#e85d75" stroke="#3a2a1e" stroke-width="1.2"/><rect x="405" y="116" width="8" height="46" rx="1.4" fill="#4f8dff" stroke="#3a2a1e" stroke-width="1.2"/><rect x="414" y="126" width="8" height="36" rx="1.4" fill="#ffcf33" stroke="#3a2a1e" stroke-width="1.2"/><rect x="423" y="118" width="8" height="44" rx="1.4" fill="#34c759" stroke="#3a2a1e" stroke-width="1.2"/><rect x="432" y="122" width="8" height="40" rx="1.4" fill="#af52de" stroke="#3a2a1e" stroke-width="1.2"/><rect x="450" y="256" width="8" height="38" rx="1.4" fill="#ff9f0a" stroke="#3a2a1e" stroke-width="1.2"/><rect x="459" y="250" width="8" height="44" rx="1.4" fill="#5ac8fa" stroke="#3a2a1e" stroke-width="1.2"/><rect x="468" y="258" width="8" height="36" rx="1.4" fill="#e85d75" stroke="#3a2a1e" stroke-width="1.2"/><rect x="480" y="264" width="8" height="30" rx="1.4" fill="#a3e635" stroke="#3a2a1e" stroke-width="1.2"/><path d="M444 228 Q470 206 496 228Z" fill="#3a2a1e" opacity=".55"/><g transform="translate(464 160)"><path d="M-8 0 L-6 -12 H6 L8 0Z" fill="#d9774a" stroke="#3a2a1e" stroke-width="1.4"/><path d="M0 -12 Q-8 -24 -3 -30 M0 -12 Q6 -26 10 -22" stroke="#4f9d3a" stroke-width="2.4" fill="none" stroke-linecap="round"/></g><rect x="530" y="66" width="124" height="96" rx="4" fill="#8a5a32" stroke="#3a2a1e" stroke-width="2"/><rect x="536" y="72" width="112" height="84" fill="#d9a86c"/><text x="592" y="86" font-size="9.5" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive">Meet our cats ♥</text><g transform="rotate(-6 558 106)"><rect x="546" y="92" width="26" height="30" fill="#fff" stroke="#3a2a1e" stroke-width="1"/><rect x="549" y="95" width="20" height="18" fill="#cfe8ff"/><g transform="translate(559 105)"><path d="M-9 -4 L-7 -12 L-2 -7 H2 L7 -12 L9 -4 Q9 7 0 7 Q-9 7 -9 -4Z" fill="#f2a65a" stroke="#3a2a1e" stroke-width="1"/><circle cx="-3.4" cy="-2" r="1" fill="#3a2a1e"/><circle cx="3.4" cy="-2" r="1" fill="#3a2a1e"/><path d="M-1 1.4 h2 l-1 1.2z" fill="#ff7a9a"/></g><circle cx="559" cy="92" r="2" fill="#e85d75"/></g><g transform="rotate(4 590 110)"><rect x="578" y="96" width="26" height="30" fill="#fff" stroke="#3a2a1e" stroke-width="1"/><rect x="581" y="99" width="20" height="18" fill="#cfe8ff"/><g transform="translate(591 109)"><path d="M-9 -4 L-7 -12 L-2 -7 H2 L7 -12 L9 -4 Q9 7 0 7 Q-9 7 -9 -4Z" fill="#9aa3ad" stroke="#3a2a1e" stroke-width="1"/><circle cx="-3.4" cy="-2" r="1" fill="#3a2a1e"/><circle cx="3.4" cy="-2" r="1" fill="#3a2a1e"/><path d="M-1 1.4 h2 l-1 1.2z" fill="#ff7a9a"/></g><circle cx="591" cy="96" r="2" fill="#e85d75"/></g><g transform="rotate(-3 624 106)"><rect x="612" y="92" width="26" height="30" fill="#fff" stroke="#3a2a1e" stroke-width="1"/><rect x="615" y="95" width="20" height="18" fill="#cfe8ff"/><g transform="translate(625 105)"><path d="M-9 -4 L-7 -12 L-2 -7 H2 L7 -12 L9 -4 Q9 7 0 7 Q-9 7 -9 -4Z" fill="#3a3640" stroke="#3a2a1e" stroke-width="1"/><circle cx="-3.4" cy="-2" r="1" fill="#3a2a1e"/><circle cx="3.4" cy="-2" r="1" fill="#3a2a1e"/><path d="M-1 1.4 h2 l-1 1.2z" fill="#ff7a9a"/></g><circle cx="625" cy="92" r="2" fill="#e85d75"/></g><g transform="rotate(5 572 136)"><rect x="560" y="122" width="26" height="30" fill="#fff" stroke="#3a2a1e" stroke-width="1"/><rect x="563" y="125" width="20" height="18" fill="#cfe8ff"/><g transform="translate(573 135)"><path d="M-9 -4 L-7 -12 L-2 -7 H2 L7 -12 L9 -4 Q9 7 0 7 Q-9 7 -9 -4Z" fill="#f4e1c1" stroke="#3a2a1e" stroke-width="1"/><circle cx="-3.4" cy="-2" r="1" fill="#3a2a1e"/><circle cx="3.4" cy="-2" r="1" fill="#3a2a1e"/><path d="M-1 1.4 h2 l-1 1.2z" fill="#ff7a9a"/></g><circle cx="573" cy="122" r="2" fill="#e85d75"/></g><g transform="rotate(-5 612 138)"><rect x="600" y="124" width="26" height="30" fill="#fff" stroke="#3a2a1e" stroke-width="1"/><rect x="603" y="127" width="20" height="18" fill="#cfe8ff"/><g transform="translate(613 137)"><path d="M-9 -4 L-7 -12 L-2 -7 H2 L7 -12 L9 -4 Q9 7 0 7 Q-9 7 -9 -4Z" fill="#c98f5a" stroke="#3a2a1e" stroke-width="1"/><circle cx="-3.4" cy="-2" r="1" fill="#3a2a1e"/><circle cx="3.4" cy="-2" r="1" fill="#3a2a1e"/><path d="M-1 1.4 h2 l-1 1.2z" fill="#ff7a9a"/></g><circle cx="613" cy="124" r="2" fill="#e85d75"/></g><text x="640" y="152" font-size="6.5" text-anchor="end" fill="#3a2a1e" font-family="-apple-system,sans-serif">ask staff to adopt!</text><rect x="676" y="64" width="96" height="112" rx="8" fill="url(#cfSky)"/><path d="M676 150 h18 v-14 h14 v20 h16 v-26 h14 v18 h16 v-8 h18 V176 H676Z" fill="#a8707a" opacity=".5"/><rect x="676" y="64" width="96" height="112" rx="8" fill="none" stroke="#8a5a32" stroke-width="6"/><path d="M724 66 V176 M678 120 H770" stroke="#8a5a32" stroke-width="3.4"/><rect x="668" y="174" width="112" height="9" rx="3" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M560 216 Q650 262 740 216" stroke="#8a5a32" stroke-width="2" fill="none"/><path d="M560 210 Q650 256 740 210" stroke="#8a5a32" stroke-width="1.6" fill="none"/><rect x="566.0" y="215.8" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="586.0" y="223.8" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="606.0" y="229.5" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="626.0" y="232.9" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="646.0" y="234.0" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="666.0" y="232.9" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="686.0" y="229.5" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="706.0" y="223.8" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="726.0" y="215.8" width="8" height="6" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><path d="M526 216 H570 V223 H526Z" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M526 216 H570" stroke="#7aa3cf" stroke-width="3" stroke-linecap="round"/><path d="M538 223 L538 234 L548 223" stroke="#8a5a32" stroke-width="2" fill="none"/><path d="M730 216 H774 V223 H730Z" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M730 216 H774" stroke="#7aa3cf" stroke-width="3" stroke-linecap="round"/><path d="M742 223 L742 234 L752 223" stroke="#8a5a32" stroke-width="2" fill="none"/><g transform="translate(616 196)"><circle r="0"/></g><g transform="translate(470 50)"><circle r="20" fill="#fff" stroke="#3a2a1e" stroke-width="2.4"/><path d="M-12 -14 L-16 -26 L-6 -18 M12 -14 L16 -26 L6 -18" fill="#3a2a1e"/><circle cx="0.0" cy="-14.0" r="1" fill="#3a2a1e"/><circle cx="7.0" cy="-12.1" r="1" fill="#3a2a1e"/><circle cx="12.1" cy="-7.0" r="1" fill="#3a2a1e"/><circle cx="14.0" cy="-0.0" r="1" fill="#3a2a1e"/><circle cx="12.1" cy="7.0" r="1" fill="#3a2a1e"/><circle cx="7.0" cy="12.1" r="1" fill="#3a2a1e"/><circle cx="0.0" cy="14.0" r="1" fill="#3a2a1e"/><circle cx="-7.0" cy="12.1" r="1" fill="#3a2a1e"/><circle cx="-12.1" cy="7.0" r="1" fill="#3a2a1e"/><circle cx="-14.0" cy="0.0" r="1" fill="#3a2a1e"/><circle cx="-12.1" cy="-7.0" r="1" fill="#3a2a1e"/><circle cx="-7.0" cy="-12.1" r="1" fill="#3a2a1e"/><path d="M0 0 V-9" stroke="#3a2a1e" stroke-width="2" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="0;360" dur="60s" repeatCount="indefinite"/></path><path d="M0 0 V-14" stroke="#e85d75" stroke-width="1.2" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" values="0;360" dur="6s" repeatCount="indefinite"/></path><circle r="1.8" fill="#3a2a1e"/></g><rect x="378" y="410" width="146" height="62" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="2.2"/><rect x="384" y="420" width="134" height="44" rx="3" fill="none" stroke="#8a5a32" stroke-width="2"/><rect x="378" y="350" width="146" height="62" rx="4" fill="#dff1fb" fill-opacity=".65" stroke="#3a2a1e" stroke-width="2"/><path d="M378 382 H524" stroke="#3a2a1e" stroke-width="1.4"/><path d="M390 356 L404 404 M470 356 L480 378" stroke="#fff" stroke-width="2" opacity=".8"/><rect x="372" y="344" width="158" height="8" rx="3" fill="#8a5a32" stroke="#3a2a1e" stroke-width="1.8"/><g transform="translate(396 380)"><path d="M-7 0 L-5 -7 H5 L7 0Z" fill="#f4b183" stroke="#3a2a1e" stroke-width="1"/><path d="M-6 -7 Q-6 -14 0 -14 Q6 -14 6 -7Z" fill="#ffd1dc" stroke="#3a2a1e" stroke-width="1"/><circle cy="-15" r="1.6" fill="#e85d75"/></g><g transform="translate(414 380)"><path d="M-7 0 L-5 -7 H5 L7 0Z" fill="#f4b183" stroke="#3a2a1e" stroke-width="1"/><path d="M-6 -7 Q-6 -14 0 -14 Q6 -14 6 -7Z" fill="#fff4d6" stroke="#3a2a1e" stroke-width="1"/><circle cy="-15" r="1.6" fill="#e85d75"/></g><g transform="translate(432 380)"><path d="M-7 0 L-5 -7 H5 L7 0Z" fill="#f4b183" stroke="#3a2a1e" stroke-width="1"/><path d="M-6 -7 Q-6 -14 0 -14 Q6 -14 6 -7Z" fill="#cfe8ff" stroke="#3a2a1e" stroke-width="1"/><circle cy="-15" r="1.6" fill="#e85d75"/></g><g transform="translate(470 380)"><path d="M-16 0 H16 L12 -14 H-12Z" fill="#fff4d6" stroke="#3a2a1e" stroke-width="1.2"/><path d="M-12 -14 H12" stroke="#e85d75" stroke-width="2.4"/><circle cx="-6" cy="-17" r="2" fill="#e85d75"/><circle cx="6" cy="-17" r="2" fill="#e85d75"/></g><ellipse cx="396" cy="406" rx="5" ry="3" fill="#ff8fb3" stroke="#3a2a1e" stroke-width=".9"/><ellipse cx="408" cy="406" rx="5" ry="3" fill="#a3e635" stroke="#3a2a1e" stroke-width=".9"/><ellipse cx="420" cy="406" rx="5" ry="3" fill="#ffd84a" stroke="#3a2a1e" stroke-width=".9"/><ellipse cx="432" cy="406" rx="5" ry="3" fill="#c084fc" stroke="#3a2a1e" stroke-width=".9"/><ellipse cx="444" cy="406" rx="5" ry="3" fill="#7dd3fc" stroke="#3a2a1e" stroke-width=".9"/><ellipse cx="456" cy="406" rx="5" ry="3" fill="#ff8fb3" stroke="#3a2a1e" stroke-width=".9"/><ellipse cx="468" cy="406" rx="5" ry="3" fill="#ffd84a" stroke="#3a2a1e" stroke-width=".9"/><g class="cf-prop" data-prop="treats" data-x="508" data-y="344" aria-label="Shake the treat jar"><g class="cf-jar"><path d="M496 344 V318 Q496 312 502 312 H514 Q520 312 520 318 V344Z" fill="#fff" fill-opacity=".7" stroke="#3a2a1e" stroke-width="1.6"/><rect x="494" y="304" width="28" height="9" rx="3" fill="#e85d75" stroke="#3a2a1e" stroke-width="1.6"/><circle cx="502" cy="338" r="2.6" fill="#b07c4a"/><circle cx="509" cy="336" r="2.6" fill="#b07c4a"/><circle cx="515" cy="339" r="2.6" fill="#b07c4a"/><circle cx="505" cy="330" r="2.6" fill="#b07c4a"/><circle cx="512" cy="329" r="2.6" fill="#b07c4a"/><rect x="499" y="318" width="18" height="8" rx="2" fill="#fff"/><text x="508" y="324.5" font-size="5.5" font-weight="700" text-anchor="middle" fill="#e85d75" font-family="-apple-system,sans-serif">TREATS</text></g><circle class="cf-treat" cx="508" cy="312" r="2.6" fill="#b07c4a" style="--dx:-30px;--dy:120px;animation-delay:0s"/><circle class="cf-treat" cx="508" cy="312" r="2.6" fill="#b07c4a" style="--dx:-12px;--dy:136px;animation-delay:0.08s"/><circle class="cf-treat" cx="508" cy="312" r="2.6" fill="#b07c4a" style="--dx:14px;--dy:128px;animation-delay:0.16s"/><circle class="cf-treat" cx="508" cy="312" r="2.6" fill="#b07c4a" style="--dx:32px;--dy:118px;animation-delay:0.24s"/><circle class="cf-treat" cx="508" cy="312" r="2.6" fill="#b07c4a" style="--dx:-2px;--dy:140px;animation-delay:0.3s"/><rect x="490" y="300" width="36" height="46" fill="transparent"/></g><g transform="translate(572 0)"><rect x="-46" y="440" width="92" height="66" rx="20" fill="#e98a7a" stroke="#3a2a1e" stroke-width="2.2"/><rect x="-54" y="476" width="22" height="58" rx="10" fill="#f2a493" stroke="#3a2a1e" stroke-width="2.2"/><rect x="32" y="476" width="22" height="58" rx="10" fill="#f2a493" stroke="#3a2a1e" stroke-width="2.2"/><rect x="-34" y="498" width="68" height="34" rx="10" fill="#f2a493" stroke="#3a2a1e" stroke-width="2"/><path d="M-40 534 l-2 14 M40 534 l2 14" stroke="#3a2a1e" stroke-width="3" stroke-linecap="round"/><rect x="-12" y="472" width="26" height="22" rx="7" fill="#fff4d6" stroke="#3a2a1e" stroke-width="1.6" transform="rotate(8 1 483)"/></g><g transform="translate(520 0)"><path d="M0 548 V412" stroke="#3a2a1e" stroke-width="2.4"/><path d="M-10 550 H10" stroke="#3a2a1e" stroke-width="3" stroke-linecap="round"/><path d="M-13 412 L-9 392 H9 L13 412Z" fill="#ffe08a" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cy="420" rx="34" ry="26" fill="url(#cfGlow)"/></g><g transform="translate(700 0)"><path d="M-40 556 L-12 486 M40 556 L12 486" stroke="#8a5a32" stroke-width="8" stroke-linecap="round"/><rect x="-52" y="552" width="104" height="10" rx="4" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="1.8"/></g><g class="cf-prop" data-prop="wheel" data-x="700" data-y="560" aria-label="Spin the cat wheel"><g transform="translate(700 486)"><g class="cf-wheel"><circle r="70" fill="none" stroke="#3a2a1e" stroke-width="12"/><circle r="70" fill="none" stroke="#f4f1e8" stroke-width="8"/><path d="M64.0 0.0 L76.0 0.0" stroke="#c8925f" stroke-width="2"/><path d="M61.8 16.6 L73.4 19.7" stroke="#c8925f" stroke-width="2"/><path d="M55.4 32.0 L65.8 38.0" stroke="#c8925f" stroke-width="2"/><path d="M45.3 45.3 L53.7 53.7" stroke="#c8925f" stroke-width="2"/><path d="M32.0 55.4 L38.0 65.8" stroke="#c8925f" stroke-width="2"/><path d="M16.6 61.8 L19.7 73.4" stroke="#c8925f" stroke-width="2"/><path d="M0.0 64.0 L0.0 76.0" stroke="#c8925f" stroke-width="2"/><path d="M-16.6 61.8 L-19.7 73.4" stroke="#c8925f" stroke-width="2"/><path d="M-32.0 55.4 L-38.0 65.8" stroke="#c8925f" stroke-width="2"/><path d="M-45.3 45.3 L-53.7 53.7" stroke="#c8925f" stroke-width="2"/><path d="M-55.4 32.0 L-65.8 38.0" stroke="#c8925f" stroke-width="2"/><path d="M-61.8 16.6 L-73.4 19.7" stroke="#c8925f" stroke-width="2"/><path d="M-64.0 0.0 L-76.0 0.0" stroke="#c8925f" stroke-width="2"/><path d="M-61.8 -16.6 L-73.4 -19.7" stroke="#c8925f" stroke-width="2"/><path d="M-55.4 -32.0 L-65.8 -38.0" stroke="#c8925f" stroke-width="2"/><path d="M-45.3 -45.3 L-53.7 -53.7" stroke="#c8925f" stroke-width="2"/><path d="M-32.0 -55.4 L-38.0 -65.8" stroke="#c8925f" stroke-width="2"/><path d="M-16.6 -61.8 L-19.7 -73.4" stroke="#c8925f" stroke-width="2"/><path d="M-0.0 -64.0 L-0.0 -76.0" stroke="#c8925f" stroke-width="2"/><path d="M16.6 -61.8 L19.7 -73.4" stroke="#c8925f" stroke-width="2"/><path d="M32.0 -55.4 L38.0 -65.8" stroke="#c8925f" stroke-width="2"/><path d="M45.3 -45.3 L53.7 -53.7" stroke="#c8925f" stroke-width="2"/><path d="M55.4 -32.0 L65.8 -38.0" stroke="#c8925f" stroke-width="2"/><path d="M61.8 -16.6 L73.4 -19.7" stroke="#c8925f" stroke-width="2"/><path d="M0 0 L62.0 0.0" stroke="#c8925f" stroke-width="2"/><path d="M0 0 L43.8 43.8" stroke="#c8925f" stroke-width="2"/><path d="M0 0 L0.0 62.0" stroke="#c8925f" stroke-width="2"/><path d="M0 0 L-43.8 43.8" stroke="#c8925f" stroke-width="2"/><path d="M0 0 L-62.0 0.0" stroke="#c8925f" stroke-width="2"/><path d="M0 0 L-43.8 -43.8" stroke="#c8925f" stroke-width="2"/><path d="M0 0 L-0.0 -62.0" stroke="#c8925f" stroke-width="2"/><path d="M0 0 L43.8 -43.8" stroke="#c8925f" stroke-width="2"/><circle r="8" fill="#8a5a32" stroke="#3a2a1e" stroke-width="1.8"/></g></g></g><g transform="translate(440 612)"><path d="M-46 0 Q-30 -22 0 -10 Q30 -22 46 0 V12 H-46Z" fill="#d9b779" stroke="#3a2a1e" stroke-width="2"/><path d="M-40 -7 V12" stroke="#b08d4f" stroke-width="1"/><path d="M-34 -8 V12" stroke="#b08d4f" stroke-width="1"/><path d="M-28 -8 V12" stroke="#b08d4f" stroke-width="1"/><path d="M-22 -9 V12" stroke="#b08d4f" stroke-width="1"/><path d="M-16 -10 V12" stroke="#b08d4f" stroke-width="1"/><path d="M-10 -11 V12" stroke="#b08d4f" stroke-width="1"/><path d="M-4 -12 V12" stroke="#b08d4f" stroke-width="1"/><path d="M2 -12 V12" stroke="#b08d4f" stroke-width="1"/><path d="M8 -11 V12" stroke="#b08d4f" stroke-width="1"/><path d="M14 -10 V12" stroke="#b08d4f" stroke-width="1"/><path d="M20 -10 V12" stroke="#b08d4f" stroke-width="1"/><path d="M26 -9 V12" stroke="#b08d4f" stroke-width="1"/><path d="M32 -8 V12" stroke="#b08d4f" stroke-width="1"/><path d="M38 -7 V12" stroke="#b08d4f" stroke-width="1"/></g><g transform="translate(784 548)"><path d="M-18 0 L-14 -32 H14 L18 0Z" fill="#7aa3cf" stroke="#3a2a1e" stroke-width="2"/><path d="M0 -32 Q-30 -76 -12 -110 M0 -32 Q6 -90 22 -118 M0 -32 Q28 -64 34 -90 M0 -32 Q-18 -56 -36 -66" stroke="#4f9a4a" stroke-width="6" fill="none" stroke-linecap="round"/></g><g transform="translate(420 0)"><path d="M0 0 V30" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cy="56" rx="54" ry="38" fill="url(#cfGlow)"/><path d="M-15 44 Q0 24 15 44Z" fill="#e9b949" stroke="#3a2a1e" stroke-width="1.8"/><circle cy="45" r="3" fill="#fff6c9"/></g><g transform="translate(600 0)"><path d="M0 0 V40" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cy="66" rx="54" ry="38" fill="url(#cfGlow)"/><path d="M-15 54 Q0 34 15 54Z" fill="#e9b949" stroke="#3a2a1e" stroke-width="1.8"/><circle cy="55" r="3" fill="#fff6c9"/></g><path d="M364 24 Q582.0 50 800 24" stroke="#3a2a1e" stroke-width="1.3" fill="none"/><circle cx="364" cy="30.0" r="4" fill="#ffd84a"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="0.0s" repeatCount="indefinite"/></circle><circle cx="393" cy="33.2" r="4" fill="#ff8fb3"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="0.3s" repeatCount="indefinite"/></circle><circle cx="422" cy="36.0" r="4" fill="#7dd3fc"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="0.6s" repeatCount="indefinite"/></circle><circle cx="451" cy="38.3" r="4" fill="#a3e635"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="0.9s" repeatCount="indefinite"/></circle><circle cx="480" cy="40.2" r="4" fill="#ffd84a"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="1.2s" repeatCount="indefinite"/></circle><circle cx="509" cy="41.6" r="4" fill="#ff8fb3"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="1.5s" repeatCount="indefinite"/></circle><circle cx="538" cy="42.5" r="4" fill="#7dd3fc"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="1.8s" repeatCount="indefinite"/></circle><circle cx="567" cy="42.9" r="4" fill="#a3e635"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="0.1s" repeatCount="indefinite"/></circle><circle cx="597" cy="42.9" r="4" fill="#ffd84a"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="0.4s" repeatCount="indefinite"/></circle><circle cx="626" cy="42.5" r="4" fill="#ff8fb3"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="0.7s" repeatCount="indefinite"/></circle><circle cx="655" cy="41.6" r="4" fill="#7dd3fc"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="1.0s" repeatCount="indefinite"/></circle><circle cx="684" cy="40.2" r="4" fill="#a3e635"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="1.3s" repeatCount="indefinite"/></circle><circle cx="713" cy="38.3" r="4" fill="#ffd84a"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="1.6s" repeatCount="indefinite"/></circle><circle cx="742" cy="36.0" r="4" fill="#ff8fb3"><animate attributeName="opacity" values=".45;1;.45" dur="2.1s" begin="1.9s" repeatCount="indefinite"/></circle><circle cx="771" cy="33.2" r="4" fill="#7dd3fc"><animate attributeName="opacity" values=".45;1;.45" dur="2.6s" begin="0.2s" repeatCount="indefinite"/></circle><circle cx="800" cy="30.0" r="4" fill="#a3e635"><animate attributeName="opacity" values=".45;1;.45" dur="1.6s" begin="0.5s" repeatCount="indefinite"/></circle><g transform="translate(640 628)"><circle r="6.4" fill="#ff8fb3" stroke="#3a2a1e" stroke-width="1.4"><animateTransform attributeName="transform" type="translate" values="0 0;10 -2;0 0" dur="2.2s" repeatCount="indefinite"/></circle></g><g><animateTransform attributeName="transform" type="translate" values="520 600;580 594;548 612;600 606;520 600" dur="4.6s" repeatCount="indefinite"/><circle r="5" fill="#ff3b30" opacity=".25"/><circle r="2.4" fill="#ff3b30"/></g>`;
  // The Primate Safari Café (ANTH 102): a 1160 × 640 scene of six habitats, in taxonomic order from left to right.
  // Each spot belongs to a habitat (hab); a primate only sits and wanders within its own.
  const SAFARI_HAB = { lemur: "mad", tarsier: "night", tamarin: "amazon", capuchin: "amazon", macaque: "onsen", gibbon: "borneo", orangutan: "borneo", gorilla: "africa", chimp: "africa", bonobo: "africa" };
  const SAFARI_SPOTS = [
    { x: 84, y: 316, z: 50, pose: "sit", hab: "mad" }, { x: 54, y: 476, z: 60, pose: "sit", hab: "mad" }, { x: 150, y: 566, z: 62, pose: "stand", hab: "mad" }, { x: 96, y: 606, z: 60, pose: "lie", hab: "mad" },
    { x: 262, y: 334, z: 44, pose: "sit", hab: "night" }, { x: 308, y: 334, z: 44, pose: "sit", hab: "night" }, { x: 232, y: 438, z: 46, pose: "stand", hab: "night" }, { x: 252, y: 572, z: 50, pose: "sit", hab: "night" },
    { x: 392, y: 302, z: 48, pose: "sit", hab: "amazon" }, { x: 512, y: 262, z: 48, pose: "sit", hab: "amazon" }, { x: 516, y: 372, z: 50, pose: "lie", hab: "amazon" },
    { x: 446, y: 590, z: 58, pose: "sit", hab: "amazon" }, { x: 506, y: 600, z: 58, pose: "stand", hab: "amazon" }, { x: 536, y: 546, z: 54, pose: "sit", hab: "amazon" },
    { x: 626, y: 578, z: 56, pose: "sit", hab: "onsen" }, { x: 672, y: 576, z: 54, pose: "sit", hab: "onsen" }, { x: 590, y: 492, z: 52, pose: "sit", hab: "onsen" }, { x: 706, y: 498, z: 52, pose: "lie", hab: "onsen" },
    { x: 800, y: 284, z: 54, pose: "sit", hab: "borneo" }, { x: 858, y: 342, z: 56, pose: "lie", hab: "borneo" }, { x: 846, y: 268, z: 50, pose: "stand", hab: "borneo", only: "gibbon" },
    { x: 806, y: 584, z: 60, pose: "sit", hab: "borneo" }, { x: 876, y: 596, z: 62, pose: "stand", hab: "borneo" }, { x: 800, y: 398, z: 46, pose: "sit", hab: "borneo" },
    { x: 1040, y: 314, z: 52, pose: "sit", hab: "africa" }, { x: 986, y: 586, z: 66, pose: "lie", hab: "africa" }, { x: 1096, y: 566, z: 58, pose: "sit", hab: "africa" },
    { x: 960, y: 526, z: 58, pose: "stand", hab: "africa" }, { x: 1050, y: 616, z: 62, pose: "stand", hab: "africa" }, { x: 1016, y: 506, z: 54, pose: "sit", hab: "africa" }, { x: 1140, y: 618, z: 56, pose: "sit", hab: "africa" }
  ];
  const SAFARI_SCENE = `<defs><linearGradient id="sfSky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8fd0f5"/><stop offset=".7" stop-color="#d8f0e4"/><stop offset="1" stop-color="#f6efc8"/></linearGradient><linearGradient id="sfGround" gradientUnits="userSpaceOnUse" x1="0" x2="1160" y1="0" y2="0"><stop offset="0" stop-color="#d99a66"/><stop offset=".13" stop-color="#d99a66"/><stop offset=".2" stop-color="#3f7a5c"/><stop offset=".28" stop-color="#3a7459"/><stop offset=".34" stop-color="#62b257"/><stop offset=".46" stop-color="#62b257"/><stop offset=".52" stop-color="#eef4fa"/><stop offset=".6" stop-color="#f4f8fc"/><stop offset=".66" stop-color="#479a52"/><stop offset=".79" stop-color="#479a52"/><stop offset=".85" stop-color="#93c460"/><stop offset="1" stop-color="#93c460"/></linearGradient><linearGradient id="sfDusk" gradientUnits="userSpaceOnUse" x1="150" x2="400" y1="0" y2="0"><stop offset="0" stop-color="#1c2550" stop-opacity="0"/><stop offset=".3" stop-color="#1c2550" stop-opacity=".82"/><stop offset=".7" stop-color="#1c2550" stop-opacity=".82"/><stop offset="1" stop-color="#1c2550" stop-opacity="0"/></linearGradient><linearGradient id="sfCold" gradientUnits="userSpaceOnUse" x1="520" x2="780" y1="0" y2="0"><stop offset="0" stop-color="#dfeaf6" stop-opacity="0"/><stop offset=".35" stop-color="#dfeaf6" stop-opacity=".8"/><stop offset=".65" stop-color="#dfeaf6" stop-opacity=".8"/><stop offset="1" stop-color="#dfeaf6" stop-opacity="0"/></linearGradient><linearGradient id="sfWater" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9fdcf2"/><stop offset="1" stop-color="#5fb7e0"/></linearGradient><radialGradient id="sfSteam"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect x="-1440" y="-400" width="4040" height="1040" fill="url(#sfSky)"/><rect x="520" y="-400" width="260" height="860" fill="url(#sfCold)"/><rect x="150" y="-400" width="250" height="1040" fill="url(#sfDusk)"/><circle cx="80" cy="92" r="30" fill="#ffe08a" opacity=".95"/><circle cx="80" cy="92" r="46" fill="#ffe08a" opacity=".25"/><circle cx="296" cy="96" r="20" fill="#fdf6d8"/><circle cx="288" cy="90" r="18" fill="#2a356a" opacity=".6"/><circle cx="236" cy="60" r="1.4" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="2s" begin="0.0s" repeatCount="indefinite"/></circle><circle cx="250" cy="130" r="1.4" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="3s" begin="0.4s" repeatCount="indefinite"/></circle><circle cx="268" cy="44" r="1.4" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="4s" begin="0.8s" repeatCount="indefinite"/></circle><circle cx="290" cy="170" r="1.4" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="2s" begin="1.2s" repeatCount="indefinite"/></circle><circle cx="318" cy="150" r="1.4" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="3s" begin="1.6s" repeatCount="indefinite"/></circle><circle cx="240" cy="200" r="1.4" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="4s" begin="2.0s" repeatCount="indefinite"/></circle><circle cx="262" cy="96" r="1.4" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="2s" begin="2.4s" repeatCount="indefinite"/></circle><circle cx="322" cy="50" r="1.4" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="3s" begin="2.8s" repeatCount="indefinite"/></circle><g fill="#fff" opacity=".9"><animateTransform attributeName="transform" type="translate" values="-80 0;120 0;-80 0" dur="90s" repeatCount="indefinite"/><ellipse cx="460" cy="70" rx="34" ry="11"/><ellipse cx="484" cy="62" rx="20" ry="12"/><ellipse cx="880" cy="96" rx="30" ry="10"/><ellipse cx="900" cy="88" rx="18" ry="11"/></g><path d="M-1440 440 Q-600 380 -200 410 Q0 350 140 404 Q250 360 360 404 Q450 372 520 392 L580 318 L604 344 L648 236 L692 330 L716 300 L770 396 Q850 366 930 404 L1010 300 Q1030 286 1050 300 L1130 404 Q1300 380 1800 404 Q2200 380 2600 430 V640 H-1440Z" fill="#a9d6a4"/><path d="M520 392 L580 318 L604 344 L648 236 L692 330 L716 300 L770 396 Q700 420 648 424 Q590 420 520 392Z" fill="#b9cfe3"/><path d="M648 236 L626 292 L642 280 L652 300 L664 282 L676 300Z M580 318 L566 338 L580 332 L592 344 L604 344Z M716 300 L704 322 L718 316 L730 330Z" fill="#fff"/><path d="M1010 300 Q1030 286 1050 300 L1062 318 Q1040 310 1030 322 Q1018 308 998 318Z" fill="#f4f7fb"/><ellipse cx="1030" cy="330" rx="60" ry="8" fill="#fff" opacity=".6"/><path d="M-1440 452 Q-400 420 60 440 Q200 414 330 438 Q460 410 560 436 Q650 424 740 436 Q840 410 940 436 Q1060 414 1160 438 Q1700 420 2600 452 V640 H-1440Z" fill="#8cc68a"/><ellipse cx="206" cy="428" rx="22" ry="15" fill="#4f9a6a" opacity=".9"/><ellipse cx="176" cy="436" rx="16" ry="11" fill="#6aa86a" opacity=".9"/><ellipse cx="356" cy="430" rx="22" ry="15" fill="#4fa85c" opacity=".9"/><ellipse cx="338" cy="438" rx="14" ry="10" fill="#3f9150" opacity=".9"/><ellipse cx="566" cy="430" rx="18" ry="13" fill="#5a9f78" opacity=".9"/><ellipse cx="742" cy="430" rx="20" ry="14" fill="#3f9a5a" opacity=".9"/><ellipse cx="724" cy="438" rx="13" ry="9" fill="#5a9f78" opacity=".9"/><ellipse cx="936" cy="430" rx="22" ry="15" fill="#5fae5a" opacity=".9"/><ellipse cx="954" cy="438" rx="14" ry="10" fill="#7ab85a" opacity=".9"/><path d="M-1440 450 Q-700 440 0 446 Q100 436 200 448 Q270 438 352 446 Q450 434 562 446 Q640 438 734 446 Q830 436 932 446 Q1040 436 1160 444 Q1700 440 2600 450 V640 H-1440Z" fill="url(#sfGround)"/><rect x="-1440" y="446" width="1440" height="200" fill="#d99a66"/><rect x="1160" y="444" width="1440" height="200" fill="#93c460"/><rect x="150" y="440" width="250" height="200" fill="url(#sfDusk)" opacity=".5"/><path d="M-1440 640 V600 Q-200 590 0 596 Q600 586 1160 596 Q1800 590 2600 600 V640Z" fill="#000" opacity=".06"/><circle cx="590" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="-20;440" dur="9s" begin="-0.0s" repeatCount="indefinite"/></circle><circle cx="606" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="60;520" dur="10s" begin="-1.3s" repeatCount="indefinite"/></circle><circle cx="626" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="-40;420" dur="11s" begin="-2.6s" repeatCount="indefinite"/></circle><circle cx="650" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="20;480" dur="12s" begin="-3.9s" repeatCount="indefinite"/></circle><circle cx="676" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="-10;450" dur="9s" begin="-5.2s" repeatCount="indefinite"/></circle><circle cx="694" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="70;530" dur="10s" begin="-6.5s" repeatCount="indefinite"/></circle><circle cx="712" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="0;460" dur="11s" begin="-7.8s" repeatCount="indefinite"/></circle><circle cx="616" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="120;580" dur="12s" begin="-9.1s" repeatCount="indefinite"/></circle><circle cx="664" cy="0" r="1.8" fill="#fff"><animate attributeName="cy" values="150;610" dur="9s" begin="-10.4s" repeatCount="indefinite"/></circle><path d="M177 478 L183 420 L188 432 L195 478Z" fill="#b7bfc8" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M183 420 L185 478" stroke="#7d8794" stroke-width="1.2"/><path d="M190 478 L197 394 L202 411 L210 478Z" fill="#c6cdd5" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M197 394 L199 478" stroke="#7d8794" stroke-width="1.2"/><path d="M206 478 L212 428 L216 438 L222 478Z" fill="#aab3bd" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M212 428 L213 478" stroke="#7d8794" stroke-width="1.2"/><path d="M169 478 L174 444 L177 451 L183 478Z" fill="#c6cdd5" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M174 444 L175 478" stroke="#7d8794" stroke-width="1.2"/><path d="M352 446 Q346 470 360 500 Q378 540 372 580 Q366 614 380 640 H420 Q404 612 410 580 Q418 540 396 500 Q378 468 364 446Z" fill="url(#sfWater)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M362 480 q8 6 6 14 M380 540 q10 4 8 14 M388 600 q10 2 12 12" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"><animate attributeName="opacity" values=".2;.8;.2" dur="2.6s" repeatCount="indefinite"/></path><path d="M346 530 L420 522" stroke="#3a2a1e" stroke-width="11" stroke-linecap="round"/><path d="M346 530 L420 522" stroke="#8a5a32" stroke-width="7.4" stroke-linecap="round"/><path d="M360 527 l6 -1 M388 524 l6 -1" stroke="#5b3d22" stroke-width="1.4"/><ellipse cx="350" cy="484" rx="7" ry="4" fill="#9aa3ad" stroke="#3a2a1e" stroke-width="1.4"/><ellipse cx="408" cy="566" rx="8" ry="5" fill="#9aa3ad" stroke="#3a2a1e" stroke-width="1.4"/><ellipse cx="368" cy="622" rx="7" ry="4" fill="#9aa3ad" stroke="#3a2a1e" stroke-width="1.4"/><path d="M556 474 V410" stroke="#3a2a1e" stroke-width="7" stroke-linecap="round"/><path d="M556 474 V410" stroke="#7a5233" stroke-width="4.4" stroke-linecap="round"/><path d="M556 410 L534 436 H578Z" fill="#4f9a5a" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M556 386 L539 412 H573Z" fill="#4f9a5a" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M556 366 L545 392 H567Z" fill="#4f9a5a" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M572 474 V396" stroke="#3a2a1e" stroke-width="7" stroke-linecap="round"/><path d="M572 474 V396" stroke="#7a5233" stroke-width="4.4" stroke-linecap="round"/><path d="M572 396 L550 422 H594Z" fill="#3f8f5a" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M572 396 L561 408 H583Z" fill="#fff"/><path d="M572 372 L555 398 H589Z" fill="#3f8f5a" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M572 372 L564 384 H580Z" fill="#fff"/><path d="M572 352 L561 378 H583Z" fill="#3f8f5a" stroke="#3a2a1e" stroke-width="1.6" stroke-linejoin="round"/><path d="M572 352 L566 364 H578Z" fill="#fff"/><ellipse cx="552" cy="486" rx="13" ry="9" fill="#9aa3ad" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cx="568" cy="500" rx="9" ry="6" fill="#b3bbc5" stroke="#3a2a1e" stroke-width="1.6"/><path d="M726 388 Q732 420 728 448 Q722 500 738 540 Q752 590 742 640 H770 Q776 590 762 540 Q748 500 752 448 Q756 420 740 388Z" fill="url(#sfWater)" stroke="#3a2a1e" stroke-width="1.6"/><path d="M734 396 V440 M742 400 V444" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"><animate attributeName="stroke-dasharray" values="2 10;10 2;2 10" dur="1.2s" repeatCount="indefinite"/></path><ellipse cx="740" cy="450" rx="16" ry="5" fill="#fff" opacity=".7"><animate attributeName="rx" values="12;18;12" dur="1.6s" repeatCount="indefinite"/></ellipse><ellipse cx="722" cy="452" rx="9" ry="6" fill="#8d96a1" stroke="#3a2a1e" stroke-width="1.4"/><ellipse cx="758" cy="456" rx="8" ry="5" fill="#8d96a1" stroke="#3a2a1e" stroke-width="1.4"/><ellipse cx="734" cy="520" rx="7" ry="4" fill="#8d96a1" stroke="#3a2a1e" stroke-width="1.4"/><ellipse cx="768" cy="596" rx="8" ry="5" fill="#8d96a1" stroke="#3a2a1e" stroke-width="1.4"/><path d="M724 560 Q748 550 772 558" stroke="#3a2a1e" stroke-width="2" fill="none"/><rect x="726" y="555" width="8" height="5" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="738" y="552" width="8" height="5" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="750" y="552" width="8" height="5" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><rect x="762" y="554" width="8" height="5" rx="1.4" fill="#d9a873" stroke="#3a2a1e" stroke-width="1"/><ellipse cx="930" cy="492" rx="14" ry="9" fill="#8d96a1" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cx="944" cy="506" rx="9" ry="6" fill="#a7b0ba" stroke="#3a2a1e" stroke-width="1.6"/><path d="M922 560 q-6 -22 -1 -36 M922 560 q3 -24 9 -32 M922 560 q-1 -26 4 -42 M922 560 q8 -18 15 -22" stroke="#3a2a1e" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M922 560 q-6 -22 -1 -36 M922 560 q3 -24 9 -32 M922 560 q-1 -26 4 -42 M922 560 q8 -18 15 -22" stroke="#c9c04a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M940 610 q-6 -22 -1 -36 M940 610 q3 -24 9 -32 M940 610 q-1 -26 4 -42 M940 610 q8 -18 15 -22" stroke="#3a2a1e" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M940 610 q-6 -22 -1 -36 M940 610 q3 -24 9 -32 M940 610 q-1 -26 4 -42 M940 610 q8 -18 15 -22" stroke="#b9b84a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M930 468 q-6 -22 -1 -36 M930 468 q3 -24 9 -32 M930 468 q-1 -26 4 -42 M930 468 q8 -18 15 -22" stroke="#3a2a1e" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M930 468 q-6 -22 -1 -36 M930 468 q3 -24 9 -32 M930 468 q-1 -26 4 -42 M930 468 q8 -18 15 -22" stroke="#9fbf4a" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M912 632 L962 626" stroke="#3a2a1e" stroke-width="12" stroke-linecap="round"/><path d="M912 632 L962 626" stroke="#7a5233" stroke-width="8" stroke-linecap="round"/><ellipse cx="962" cy="626" rx="3" ry="4" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.2"/><g><path d="M118 462 Q104 380 122 300 Q128 262 124 236 H160 Q156 262 162 300 Q180 380 166 462Z" fill="#b98863" stroke="#3a2a1e" stroke-width="2.2"/><path d="M130 440 Q124 370 134 300 M152 440 Q158 370 150 300" stroke="#9a6c4a" stroke-width="1.6" fill="none"/><path d="M130 238 Q110 214 92 196" stroke="#3a2a1e" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M130 238 Q110 214 92 196" stroke="#b98863" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="92" cy="190" rx="16" ry="9" fill="#7fb85a" stroke="#3a2a1e" stroke-width="1.6"/><path d="M140 238 Q138 200 132 176" stroke="#3a2a1e" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M140 238 Q138 200 132 176" stroke="#b98863" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="132" cy="170" rx="16" ry="9" fill="#7fb85a" stroke="#3a2a1e" stroke-width="1.6"/><path d="M150 238 Q168 206 180 186" stroke="#3a2a1e" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M150 238 Q168 206 180 186" stroke="#b98863" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="180" cy="180" rx="16" ry="9" fill="#7fb85a" stroke="#3a2a1e" stroke-width="1.6"/><path d="M156 238 Q186 226 204 214" stroke="#3a2a1e" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M156 238 Q186 226 204 214" stroke="#b98863" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="204" cy="208" rx="16" ry="9" fill="#7fb85a" stroke="#3a2a1e" stroke-width="1.6"/><path d="M124 320 Q93.0 315 62 318" stroke="#3a2a1e" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M124 320 Q93.0 315 62 318" stroke="#8a5a32" stroke-width="7" fill="none" stroke-linecap="round"/></g><ellipse cx="54" cy="506" rx="46" ry="33" fill="#c9785a" stroke="#3a2a1e" stroke-width="1.8"/><path d="M26 492 q18 -14 41 -5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".35"/><path d="M26 498 q14 -8 30 -6" stroke="#e8a184" stroke-width="3" fill="none" stroke-linecap="round"/><g transform="translate(20 470)"><path d="M0 0 V-70" stroke="#3a2a1e" stroke-width="7" stroke-linecap="round"/><path d="M0 0 V-70" stroke="#6fa85a" stroke-width="4" stroke-linecap="round"/><path d="M0 -8 l-5 -4 M0 -13 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M0 -20 l-5 -4 M0 -25 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M0 -32 l-5 -4 M0 -37 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M0 -44 l-5 -4 M0 -49 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M0 -56 l-5 -4 M0 -61 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/></g><g transform="translate(188 478)"><path d="M0 0 V-56" stroke="#3a2a1e" stroke-width="7" stroke-linecap="round"/><path d="M0 0 V-56" stroke="#6fa85a" stroke-width="4" stroke-linecap="round"/><path d="M0 -8 l-5 -4 M0 -13 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M0 -20 l-5 -4 M0 -25 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M0 -32 l-5 -4 M0 -37 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M0 -44 l-5 -4 M0 -49 l5 -4" stroke="#3a2a1e" stroke-width="1.2"/></g><g transform="translate(110 484)"><path d="M0 0 V26" stroke="#5b3d22" stroke-width="4" stroke-linecap="round"/><rect x="-51" y="-22" width="102" height="26" rx="4" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.8"/><text y="-11" font-size="9" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive">Madagascar</text><text y="-1.5" font-size="6.4" text-anchor="middle" fill="#5b3d22" font-family="-apple-system,sans-serif">spiny forest · lemurs</text></g><path d="M214 520 V150" stroke="#3a2a1e" stroke-width="9" stroke-linecap="round"/><path d="M214 520 V150" stroke="#6fbf73" stroke-width="6" stroke-linecap="round"/><path d="M210 190 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M210 236 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M210 282 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M210 328 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M210 374 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M210 420 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M210 466 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M210 512 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M214 200 q14 -10 22 -2 q-12 0 -22 2 M214 280 q-14 -10 -22 -2 q12 0 22 2" fill="#4f9a55" stroke="#3a2a1e" stroke-width="1.2"/><path d="M246 520 V164" stroke="#3a2a1e" stroke-width="9" stroke-linecap="round"/><path d="M246 520 V164" stroke="#6fbf73" stroke-width="6" stroke-linecap="round"/><path d="M242 204 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M242 250 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M242 296 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M242 342 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M242 388 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M242 434 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M242 480 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M246 220 q14 -10 22 -2 q-12 0 -22 2 M246 290 q-14 -10 -22 -2 q12 0 22 2" fill="#4f9a55" stroke="#3a2a1e" stroke-width="1.2"/><path d="M286 520 V178" stroke="#3a2a1e" stroke-width="9" stroke-linecap="round"/><path d="M286 520 V178" stroke="#6fbf73" stroke-width="6" stroke-linecap="round"/><path d="M282 218 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M282 264 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M282 310 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M282 356 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M282 402 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M282 448 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M282 494 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M286 240 q14 -10 22 -2 q-12 0 -22 2 M286 300 q-14 -10 -22 -2 q12 0 22 2" fill="#4f9a55" stroke="#3a2a1e" stroke-width="1.2"/><path d="M322 520 V192" stroke="#3a2a1e" stroke-width="9" stroke-linecap="round"/><path d="M322 520 V192" stroke="#6fbf73" stroke-width="6" stroke-linecap="round"/><path d="M318 232 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M318 278 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M318 324 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M318 370 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M318 416 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M318 462 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M318 508 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M322 260 q14 -10 22 -2 q-12 0 -22 2 M322 310 q-14 -10 -22 -2 q12 0 22 2" fill="#4f9a55" stroke="#3a2a1e" stroke-width="1.2"/><path d="M340 520 V206" stroke="#3a2a1e" stroke-width="9" stroke-linecap="round"/><path d="M340 520 V206" stroke="#6fbf73" stroke-width="6" stroke-linecap="round"/><path d="M336 246 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M336 292 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M336 338 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M336 384 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M336 430 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M336 476 h8" stroke="#3a2a1e" stroke-width="1.3"/><path d="M340 280 q14 -10 22 -2 q-12 0 -22 2 M340 320 q-14 -10 -22 -2 q12 0 22 2" fill="#4f9a55" stroke="#3a2a1e" stroke-width="1.2"/><path d="M206 338 Q268.0 333 330 336" stroke="#3a2a1e" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M206 338 Q268.0 333 330 336" stroke="#8a5a32" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="230" cy="420" r="2.2" fill="#eaff8a"><animate attributeName="opacity" values="0;1;0" dur="2.4s" begin="0.0s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;6 -8;0 0" dur="5s" repeatCount="indefinite"/></circle><circle cx="300" cy="392" r="2.2" fill="#eaff8a"><animate attributeName="opacity" values="0;1;0" dur="2.8s" begin="0.7s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;6 -8;0 0" dur="6s" repeatCount="indefinite"/></circle><circle cx="268" cy="480" r="2.2" fill="#eaff8a"><animate attributeName="opacity" values="0;1;0" dur="3.2s" begin="1.4s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;6 -8;0 0" dur="7s" repeatCount="indefinite"/></circle><circle cx="334" cy="440" r="2.2" fill="#eaff8a"><animate attributeName="opacity" values="0;1;0" dur="3.6s" begin="2.0999999999999996s" repeatCount="indefinite"/><animateTransform attributeName="transform" type="translate" values="0 0;6 -8;0 0" dur="8s" repeatCount="indefinite"/></circle><g transform="translate(262 484)"><path d="M0 0 V26" stroke="#5b3d22" stroke-width="4" stroke-linecap="round"/><rect x="-59" y="-22" width="118" height="26" rx="4" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.8"/><text y="-11" font-size="9" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive">Night forest</text><text y="-1.5" font-size="6.4" text-anchor="middle" fill="#5b3d22" font-family="-apple-system,sans-serif">Southeast Asia · tarsiers</text></g><path d="M432 470 Q420 462 400 470 Q428 440 440 380 V190 H472 V380 Q484 440 512 470 Q492 462 480 470Z" fill="#8a5a32" stroke="#3a2a1e" stroke-width="2.2"/><path d="M450 440 V220 M462 440 V230" stroke="#6b4423" stroke-width="1.6"/><path d="M442 306 Q405.0 301 368 304" stroke="#3a2a1e" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M442 306 Q405.0 301 368 304" stroke="#8a5a32" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M470 266 Q511.0 261 552 264" stroke="#3a2a1e" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M470 266 Q511.0 261 552 264" stroke="#8a5a32" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M470 376 Q508.0 371 546 374" stroke="#3a2a1e" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M470 376 Q508.0 371 546 374" stroke="#8a5a32" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="404" cy="181" rx="52" ry="37" fill="#2f7f3e" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="508" cy="185" rx="53" ry="38" fill="#2f7f3e" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="456" cy="152" rx="70" ry="51" fill="#3f9a4c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="430" cy="192" rx="44" ry="32" fill="#3f9a4c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="486" cy="196" rx="43" ry="31" fill="#3f9a4c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="359" cy="254" rx="21" ry="15" fill="#3f9a4c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="401" cy="256" rx="22" ry="16" fill="#3f9a4c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="380" cy="242" rx="28" ry="21" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="370" cy="259" rx="18" ry="13" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="392" cy="260" rx="17" ry="13" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="527" cy="220" rx="21" ry="15" fill="#3f9a4c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="569" cy="222" rx="22" ry="16" fill="#3f9a4c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="548" cy="208" rx="28" ry="21" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="538" cy="225" rx="18" ry="13" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="560" cy="226" rx="17" ry="13" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><path d="M412 190 Q400 260 410 330 Q416 370 404 420" stroke="#3a2a1e" stroke-width="3.6" fill="none"/><path d="M412 190 Q400 260 410 330 Q416 370 404 420" stroke="#7a9a3a" stroke-width="2" fill="none"/><ellipse cx="404" cy="250" rx="5" ry="3" fill="#6fbf4a" stroke="#3a2a1e" stroke-width="1" transform="rotate(-30 404 250)"/><ellipse cx="412" cy="300" rx="5" ry="3" fill="#6fbf4a" stroke="#3a2a1e" stroke-width="1" transform="rotate(30 412 300)"/><ellipse cx="410" cy="360" rx="5" ry="3" fill="#6fbf4a" stroke="#3a2a1e" stroke-width="1" transform="rotate(-30 410 360)"/><ellipse cx="402" cy="400" rx="5" ry="3" fill="#6fbf4a" stroke="#3a2a1e" stroke-width="1" transform="rotate(20 402 400)"/><g transform="translate(386 300)"><path d="M0 0 q-8 -12 -14 -4 M0 0 q8 -12 14 -4 M0 0 v-12" stroke="#e85d75" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle r="2.4" fill="#ffd84a"/></g><g transform="translate(532 260)"><path d="M0 0 q-8 -12 -14 -4 M0 0 q8 -12 14 -4 M0 0 v-12" stroke="#e85d75" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle r="2.4" fill="#ffd84a"/></g><g transform="translate(506 370)"><path d="M0 0 q-8 -12 -14 -4 M0 0 q8 -12 14 -4 M0 0 v-12" stroke="#e85d75" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle r="2.4" fill="#ffd84a"/></g><g transform="translate(446 606)"><ellipse rx="16" ry="6" fill="#9aa3ad" stroke="#3a2a1e" stroke-width="1.8"/><circle cx="-4" cy="-6" r="4" fill="#8a5a32" stroke="#3a2a1e" stroke-width="1.3"/><circle cx="5" cy="-5" r="3.4" fill="#a8703e" stroke="#3a2a1e" stroke-width="1.3"/><ellipse cx="22" cy="-2" rx="6" ry="4.6" fill="#7d8794" stroke="#3a2a1e" stroke-width="1.5"/></g><g transform="translate(486 486)"><path d="M0 0 V26" stroke="#5b3d22" stroke-width="4" stroke-linecap="round"/><rect x="-44" y="-22" width="89" height="26" rx="4" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.8"/><text y="-11" font-size="9" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive">Amazon canopy</text><text y="-1.5" font-size="6.4" text-anchor="middle" fill="#5b3d22" font-family="-apple-system,sans-serif">New World monkeys</text></g><path d="M708 470 V330" stroke="#3a2a1e" stroke-width="10" stroke-linecap="round"/><path d="M708 470 V330" stroke="#7a5233" stroke-width="7" stroke-linecap="round"/><path d="M708 330 L674 364 H742Z" fill="#3f8f5a" stroke="#3a2a1e" stroke-width="1.8" stroke-linejoin="round"/><path d="M708 330 L688 348 H728Z" fill="#fff"/><path d="M708 296 L680 330 H736Z" fill="#3f8f5a" stroke="#3a2a1e" stroke-width="1.8" stroke-linejoin="round"/><path d="M708 296 L691 314 H725Z" fill="#fff"/><path d="M708 266 L688 300 H728Z" fill="#3f8f5a" stroke="#3a2a1e" stroke-width="1.8" stroke-linejoin="round"/><path d="M708 266 L696 284 H720Z" fill="#fff"/><ellipse cx="590" cy="512" rx="30" ry="22" fill="#9aa3ad" stroke="#3a2a1e" stroke-width="1.8"/><path d="M572 503 q12 -9 27 -3" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".35"/><ellipse cx="706" cy="516" rx="28" ry="20" fill="#8d96a1" stroke="#3a2a1e" stroke-width="1.8"/><path d="M689 508 q11 -8 25 -3" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".35"/><path d="M572 498 q16 -12 34 -6 M690 502 q14 -10 30 -4" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/><ellipse cx="648" cy="566" rx="70" ry="28" fill="#8d96a1" stroke="#3a2a1e" stroke-width="2.2"/><ellipse cx="648" cy="564" rx="60" ry="22" fill="#7fd6d0" stroke="#3a2a1e" stroke-width="1.6"/><ellipse cx="640" cy="560" rx="30" ry="8" fill="#b8f0ea" opacity=".7"/><ellipse cx="596" cy="584" rx="14" ry="10" fill="#a7b0ba" stroke="#3a2a1e" stroke-width="1.8"/><path d="M588 580 q6 -4 13 -1" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".35"/><ellipse cx="700" cy="582" rx="13" ry="9" fill="#a7b0ba" stroke="#3a2a1e" stroke-width="1.8"/><path d="M692 578 q5 -4 12 -1" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".35"/><g transform="translate(648 478)"><path d="M0 0 V26" stroke="#5b3d22" stroke-width="4" stroke-linecap="round"/><rect x="-67" y="-22" width="134" height="26" rx="4" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.8"/><text y="-11" font-size="9" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive">Jigokudani hot spring</text><text y="-1.5" font-size="6.4" text-anchor="middle" fill="#5b3d22" font-family="-apple-system,sans-serif">Japan · snow monkeys</text></g><path d="M757 470 Q761 300 762 130 H778 Q779 300 783 470Z" fill="#7a5233" stroke="#3a2a1e" stroke-width="2.2"/><path d="M768 440 V160" stroke="#5b3d22" stroke-width="1.6"/><path d="M883 470 Q887 300 888 150 H904 Q905 300 909 470Z" fill="#7a5233" stroke="#3a2a1e" stroke-width="2.2"/><path d="M894 440 V180" stroke="#5b3d22" stroke-width="1.6"/><path d="M776 288 Q814.0 283 852 286" stroke="#3a2a1e" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M776 288 Q814.0 283 852 286" stroke="#8a5a32" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M890 348 Q864.0 343 838 346" stroke="#3a2a1e" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M890 348 Q864.0 343 838 346" stroke="#8a5a32" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M776 402 Q794.0 397 812 400" stroke="#3a2a1e" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M776 402 Q794.0 397 812 400" stroke="#8a5a32" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="727" cy="121" rx="43" ry="31" fill="#237a3c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="813" cy="124" rx="45" ry="32" fill="#237a3c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="770" cy="96" rx="59" ry="42" fill="#2f8f4a" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="748" cy="131" rx="37" ry="27" fill="#2f8f4a" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="795" cy="134" rx="36" ry="26" fill="#2f8f4a" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="855" cy="141" rx="41" ry="29" fill="#2a8242" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="937" cy="144" rx="42" ry="30" fill="#2a8242" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="896" cy="118" rx="55" ry="40" fill="#3a9a52" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="876" cy="149" rx="35" ry="25" fill="#3a9a52" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="919" cy="152" rx="34" ry="24" fill="#3a9a52" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="810" cy="155" rx="24" ry="17" fill="#3a9a52" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="858" cy="157" rx="24" ry="18" fill="#3a9a52" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="834" cy="142" rx="32" ry="23" fill="#4aa85c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="822" cy="160" rx="20" ry="15" fill="#4aa85c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="848" cy="162" rx="20" ry="14" fill="#4aa85c" stroke="#3a2a1e" stroke-width="1.8"/><path d="M778 196 Q834 262 890 204" stroke="#3a2a1e" stroke-width="4.4" fill="none"/><path d="M778 196 Q834 262 890 204" stroke="#7a9a3a" stroke-width="2.4" fill="none"/><ellipse cx="858" cy="346" rx="30" ry="9" fill="#5fae45" stroke="#3a2a1e" stroke-width="1.8"/><path d="M832 344 q8 -8 16 -2 q8 -8 16 0 q8 -6 14 2" stroke="#3a7f34" stroke-width="2" fill="none"/><g transform="translate(748 480)"><path d="M0 0 q-10 -16 -2 -30 M0 0 q6 -18 14 -26 M0 0 q-2 -20 4 -34" stroke="#3a2a1e" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0 0 q-10 -16 -2 -30 M0 0 q6 -18 14 -26 M0 0 q-2 -20 4 -34" stroke="#57b25f" stroke-width="3" fill="none" stroke-linecap="round"/></g><g transform="translate(924 486)"><path d="M0 0 q-10 -16 -2 -30 M0 0 q6 -18 14 -26 M0 0 q-2 -20 4 -34" stroke="#3a2a1e" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0 0 q-10 -16 -2 -30 M0 0 q6 -18 14 -26 M0 0 q-2 -20 4 -34" stroke="#57b25f" stroke-width="3" fill="none" stroke-linecap="round"/></g><g transform="translate(842 474)"><path d="M0 0 q-10 -16 -2 -30 M0 0 q6 -18 14 -26 M0 0 q-2 -20 4 -34" stroke="#3a2a1e" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M0 0 q-10 -16 -2 -30 M0 0 q6 -18 14 -26 M0 0 q-2 -20 4 -34" stroke="#57b25f" stroke-width="3" fill="none" stroke-linecap="round"/></g><g transform="translate(906 600)"><ellipse rx="9" ry="7" fill="#c9d14a" stroke="#3a2a1e" stroke-width="1.6"/><path d="M-5 -6 l-1.5 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M0 -6 l0.0 -4" stroke="#3a2a1e" stroke-width="1.2"/><path d="M5 -6 l1.5 -4" stroke="#3a2a1e" stroke-width="1.2"/></g><g transform="translate(846 484)"><path d="M0 0 V26" stroke="#5b3d22" stroke-width="4" stroke-linecap="round"/><rect x="-56" y="-22" width="111" height="26" rx="4" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.8"/><text y="-11" font-size="9" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive">Borneo rainforest</text><text y="-1.5" font-size="6.4" text-anchor="middle" fill="#5b3d22" font-family="-apple-system,sans-serif">gibbons · orangutans</text></g><path d="M1076 470 Q1082 330 1080 210 H1104 Q1102 330 1108 470Z" fill="#8a5a32" stroke="#3a2a1e" stroke-width="2.2"/><path d="M1082 318 Q1044.0 313 1006 316" stroke="#3a2a1e" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M1082 318 Q1044.0 313 1006 316" stroke="#8a5a32" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M1102 282 Q1129.0 277 1156 280" stroke="#3a2a1e" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M1102 282 Q1129.0 277 1156 280" stroke="#8a5a32" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="1043" cy="190" rx="49" ry="35" fill="#3a9150" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="1141" cy="194" rx="50" ry="36" fill="#3a9150" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="1092" cy="162" rx="66" ry="48" fill="#4aa85c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="1068" cy="201" rx="42" ry="30" fill="#4aa85c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="1120" cy="204" rx="41" ry="29" fill="#4aa85c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="990" cy="266" rx="20" ry="14" fill="#4aa85c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="1030" cy="268" rx="20" ry="15" fill="#4aa85c" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="1010" cy="255" rx="27" ry="19" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="1000" cy="270" rx="17" ry="12" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><ellipse cx="1021" cy="272" rx="16" ry="12" fill="#57b25f" stroke="#3a2a1e" stroke-width="1.8"/><path d="M944 470 V330" stroke="#3a2a1e" stroke-width="7" stroke-linecap="round"/><path d="M944 470 V330" stroke="#8fc46a" stroke-width="4.4" stroke-linecap="round"/><path d="M944 350 q12 -8 18 0 M944 380 q-12 -8 -18 0" stroke="#5fae45" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M958 470 V300" stroke="#3a2a1e" stroke-width="7" stroke-linecap="round"/><path d="M958 470 V300" stroke="#8fc46a" stroke-width="4.4" stroke-linecap="round"/><path d="M958 320 q12 -8 18 0 M958 350 q-12 -8 -18 0" stroke="#5fae45" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M972 470 V346" stroke="#3a2a1e" stroke-width="7" stroke-linecap="round"/><path d="M972 470 V346" stroke="#8fc46a" stroke-width="4.4" stroke-linecap="round"/><path d="M972 366 q12 -8 18 0 M972 396 q-12 -8 -18 0" stroke="#5fae45" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="986" cy="592" rx="40" ry="11" fill="#5fae45" stroke="#3a2a1e" stroke-width="1.8"/><path d="M952 590 q10 -8 20 -2 q10 -8 20 0 q10 -6 18 2" stroke="#3a7f34" stroke-width="2" fill="none"/><g class="cf-prop" data-prop="termite" data-x="1132" data-y="560" aria-label="Poke the termite mound"><path d="M1104 548 Q1110 480 1126 470 Q1134 452 1142 472 Q1156 484 1160 548Z" fill="#c98b52" stroke="#3a2a1e" stroke-width="2.2"/><path d="M1118 540 q4 -30 10 -40 M1140 540 q-2 -26 2 -44" stroke="#a8703e" stroke-width="1.6" fill="none"/><circle cx="1128" cy="508" r="2.4" fill="#3a2a1e"/><circle cx="1144" cy="524" r="2" fill="#3a2a1e"/><g class="cf-swing" style="transform-origin:1128px 508px"><path d="M1128 508 L1100 474" stroke="#3a2a1e" stroke-width="2.6" stroke-linecap="round"/><path d="M1128 508 L1100 474" stroke="#9ac46a" stroke-width="1.2" stroke-linecap="round"/></g><circle class="cf-treat" cx="1128" cy="506" r="1.6" fill="#3a2a1e" style="--dx:-22px;--dy:30px;animation-delay:0s"/><circle class="cf-treat" cx="1128" cy="506" r="1.6" fill="#3a2a1e" style="--dx:-10px;--dy:40px;animation-delay:0.1s"/><circle class="cf-treat" cx="1128" cy="506" r="1.6" fill="#3a2a1e" style="--dx:8px;--dy:36px;animation-delay:0.2s"/><circle class="cf-treat" cx="1128" cy="506" r="1.6" fill="#3a2a1e" style="--dx:-30px;--dy:16px;animation-delay:0.25s"/><circle class="cf-treat" cx="1128" cy="506" r="1.6" fill="#3a2a1e" style="--dx:16px;--dy:22px;animation-delay:0.3s"/></g><g transform="translate(1046 482)"><path d="M0 0 V26" stroke="#5b3d22" stroke-width="4" stroke-linecap="round"/><rect x="-74" y="-22" width="147" height="26" rx="4" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.8"/><text y="-11" font-size="9" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="'Chalkboard SE','Comic Sans MS','Segoe Print',cursive">African forest</text><text y="-1.5" font-size="6.4" text-anchor="middle" fill="#5b3d22" font-family="-apple-system,sans-serif">gorillas · chimpanzees · bonobos</text></g><g transform="translate(296 0)"><path d="M-2 640 V556" stroke="#3a2a1e" stroke-width="7" stroke-linecap="round"/><path d="M-2 640 V556" stroke="#8a5a32" stroke-width="4" stroke-linecap="round"/><path d="M-46 566 Q-2 520 42 566 Q20 560 -2 562 Q-24 560 -46 566Z" fill="#e2b866" stroke="#3a2a1e" stroke-width="2"/><path d="M-30 560 l-4 8 M-14 556 l-2 10 M10 556 l2 10 M26 560 l4 8" stroke="#b98a3a" stroke-width="1.6"/><rect x="-34" y="600" width="64" height="8" rx="3" fill="#c8925f" stroke="#3a2a1e" stroke-width="1.8"/><path d="M-26 608 V640 M22 608 V640" stroke="#3a2a1e" stroke-width="3"/><path d="M-22 600 l2 -14 h8 l2 14Z" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1.4"/><path d="M-16 586 l4 -8" stroke="#e85d75" stroke-width="1.6"/><path d="M6 600 l2 -12 h8 l2 12Z" fill="#ff9fb0" stroke="#3a2a1e" stroke-width="1.4"/><circle cx="12" cy="-588" r="0"/></g><g class="cf-prop" data-prop="banana" data-x="316" data-y="580" aria-label="Shake the banana bunch"><g class="cf-swing" style="transform-origin:320px 566px"><path d="M320 566 v8" stroke="#3a2a1e" stroke-width="2"/><path d="M320 574 q-6 10 -10 20 q3 -8 6 -20Z" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1.3" stroke-linejoin="round"/><path d="M320 574 q-2 10 -3 20 q1 -8 2 -20Z" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1.3" stroke-linejoin="round"/><path d="M320 574 q3 10 5 20 q-2 -8 -3 -20Z" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1.3" stroke-linejoin="round"/><path d="M320 574 q7 10 11 20 q-4 -8 -7 -20Z" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1.3" stroke-linejoin="round"/><rect x="306" y="562" width="28" height="36" fill="transparent"/></g><path class="cf-treat" d="M320 590 q4 6 2 12 q-5 -4 -2 -12Z" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1" style="--dx:-30px;--dy:36px;animation-delay:0s"/><path class="cf-treat" d="M320 590 q4 6 2 12 q-5 -4 -2 -12Z" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1" style="--dx:20px;--dy:40px;animation-delay:0.12s"/><path class="cf-treat" d="M320 590 q4 6 2 12 q-5 -4 -2 -12Z" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1" style="--dx:-6px;--dy:44px;animation-delay:0.22s"/></g><g transform="translate(580 30)"><path d="M-150 0 Q0 26 150 0" stroke="#3a2a1e" stroke-width="1.6" fill="none"/><rect x="-118" y="8" width="236" height="34" rx="8" fill="#3a2a1e" stroke="#ffd36e" stroke-width="2.4"/><text y="31" font-size="18" font-weight="700" text-anchor="middle" fill="#ffe7a8" font-family="Georgia,serif">🌴 Primate Safari Café</text></g>`;
  const SAFARI_FRONT = `<path d="M588 566 Q648 590 708 566 Q708 588 648 590 Q588 588 588 566Z" fill="#7fd6d0" opacity=".82"/><path d="M604 574 q10 -4 20 0 M654 578 q10 -4 20 0" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/><ellipse cx="616" cy="540" rx="16" ry="22" fill="url(#sfSteam)"><animate attributeName="cy" values="548;470" dur="4s" begin="-0.0s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;0" dur="4s" begin="-0.0s" repeatCount="indefinite"/></ellipse><ellipse cx="648" cy="540" rx="16" ry="22" fill="url(#sfSteam)"><animate attributeName="cy" values="548;470" dur="5s" begin="-1.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;0" dur="5s" begin="-1.4s" repeatCount="indefinite"/></ellipse><ellipse cx="684" cy="540" rx="16" ry="22" fill="url(#sfSteam)"><animate attributeName="cy" values="548;470" dur="6s" begin="-2.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;.9;0" dur="6s" begin="-2.8s" repeatCount="indefinite"/></ellipse><path d="M40 636 l-4 -12 l5 8 l2 -14 l3 14 l5 -9 l-3 13Z" fill="#b9a04a" stroke="#3a2a1e" stroke-width="1.2" stroke-linejoin="round"/><path d="M176 630 l-4 -12 l5 8 l2 -14 l3 14 l5 -9 l-3 13Z" fill="#b9a04a" stroke="#3a2a1e" stroke-width="1.2" stroke-linejoin="round"/><path d="M470 606 l-4 -12 l5 8 l2 -14 l3 14 l5 -9 l-3 13Z" fill="#3f9a4c" stroke="#3a2a1e" stroke-width="1.2" stroke-linejoin="round"/><path d="M760 636 l-4 -12 l5 8 l2 -14 l3 14 l5 -9 l-3 13Z" fill="#2f8f4a" stroke="#3a2a1e" stroke-width="1.2" stroke-linejoin="round"/><path d="M900 634 l-4 -12 l5 8 l2 -14 l3 14 l5 -9 l-3 13Z" fill="#2f8f4a" stroke="#3a2a1e" stroke-width="1.2" stroke-linejoin="round"/><path d="M1070 636 l-4 -12 l5 8 l2 -14 l3 14 l5 -9 l-3 13Z" fill="#6fae45" stroke="#3a2a1e" stroke-width="1.2" stroke-linejoin="round"/><path d="M1150 600 l-4 -12 l5 8 l2 -14 l3 14 l5 -9 l-3 13Z" fill="#6fae45" stroke="#3a2a1e" stroke-width="1.2" stroke-linejoin="round"/>`;
  const habOf = r => SAFARI_HAB[resolveBreed(r.breed)[0]] || "";
  // only students who have opened ANTH 102 can visit the safari
  const safariOpen = () => !!(window.COURSE && window.COURSE.id === "a102" && window.Platform && window.Platform.has("a102"));
  function cafeResidents(max, mode) {
    const saf = mode === "safari", mine = c => isPrimate(c.breed) === saf;
    const { list } = catList(), chill = list.filter(c => !c.active && !c.along && mine(c)).slice(0, saf ? 6 : 3);
    const day = Math.floor(Date.now() / 864e5);
    const kinds = Object.keys(BREEDS).filter(b => (BREEDS[b].kind === "primate") === saf);
    const guests = [0, 1, 2].flatMap(n => kinds.map((b, i) => { const cs = Object.keys(BREEDS[b].colors); return { guest: true, breed: b, color: cs[(day + i + n) % cs.length], nick: "", pts: n ? 150 + i * 90 : 0 } }));
    const back = Object.entries(household().alumni).filter(([, c]) => mine(c)).sort((a, b) => (b[1].returnedAt || 0) - (a[1].returnedAt || 0)).slice(0, 4).map(([id, c]) => Object.assign({ mine: true, alumni: true, id }, c));
    return back.concat(chill.map(c => Object.assign({ mine: true }, c))).concat(guests).slice(0, max);
  }
  let cafe = null;
  function openCafe(mode) {
    if (cafe) cafe.remove();
    const saf = mode === "safari" && safariOpen(), SP = saf ? SAFARI_SPOTS : CAFE_SPOTS; if (saf) mode = "safari"; else mode = "";
    // wide screens: the viewBox widens to the screen's shape, so the room spreads out instead of a phone-width strip
    const wide = innerWidth >= 900, asp = innerWidth / Math.max(1, innerHeight), VW = wide ? Math.max(360, Math.min(2400, Math.max(640 * asp, Math.min(1160, 640 * asp * 1.4)))) : 360, VX = 180 - VW / 2;
    const spots = SP.map((_, i) => i).filter(i => { const s = SP[i]; return saf ? true : wide ? s.x > VX + 24 && s.x < VX + VW - 24 : !s.side });
    let R = cafeResidents(saf ? 60 : spots.length - (wide ? 7 : 3), mode);
    const sz = r => saf ? 1.22 * ((BREEDS[resolveBreed(r.breed)[0]].shape || {}).size || 1) : 1;
    // what each species says and does (documented calls and habits)
    const CALLS = { lemur: ["*sunbathing*", "meow-wail!", "purr…", "*tail up*"], tarsier: ["*click*", "…", "*head turn*", "eep!"], tamarin: ["tsik!", "*trill*", "whee!"], capuchin: ["*crack!*", "nut?", "ooh!", "*tool time*"],
      macaque: ["ahh… ♨", "coo", "*grooming*", "zzz"], gibbon: ["whoop-whoop!", "♪ duet ♪", "wa-oo!", "*swing*"], orangutan: ["*long call*", "kiss-squeak", "hmm…", "*nest building*"],
      gorilla: ["*chest beat*", "hmmm", "*munch*", "pok-pok-pok"], chimp: ["pant-hoot!", "*termite fishing*", "hoo hoo!", "*grooming*"], bonobo: ["peep!", "*sharing*", "♥", "*hug*"] };
    const fits = (r, i) => !saf || (SP[i].hab === habOf(r) && (!SP[i].only || SP[i].only === resolveBreed(r.breed)[0]));
    if (saf) {   // each primate takes a spot in its own habitat (one spot per habitat is left free so they can move around)
      const left = {}; SP.forEach(s => { left[s.hab] = (left[s.hab] || 0) + 1 }); Object.keys(left).forEach(h => left[h]--);
      const taken = new Set(); R = R.filter(r => { const h = habOf(r); if (!(left[h] > 0)) return false; const opts = spots.filter(i => !taken.has(i) && fits(r, i)).sort(() => Math.random() - .5); if (!opts.length) return false; r.spot = opts[0]; taken.add(opts[0]); left[h]--; return true });
    } else {
      const tree = spots.filter(i => SP[i].tree), rest = spots.filter(i => !SP[i].tree);
      const order = tree.sort(() => Math.random() - .5).slice(0, 3).concat(rest.sort(() => Math.random() - .5), tree.slice(3));
      R.forEach((r, i) => { r.spot = order[i] });
    }
    cafe = document.createElement("div"); cafe.className = "cf-veil"; cafe.setAttribute("role", "dialog"); cafe.setAttribute("aria-modal", "true"); cafe.setAttribute("aria-label", "The Cat Café");
    cafe.innerHTML = saf ? `<div class="cf-room cf-safari"><div class="cf-top"><span><b>🌴 The Primate Safari Café</b><small>Tap a primate to meet them · tap the bananas and the termite mound${innerWidth < 900 ? " · swipe sideways to explore" : ""}</small></span><button type="button" class="cf-x" aria-label="Leave the safari">✕</button></div>
      <div class="cf-pan${innerWidth >= 900 ? " cf-fit" : ""}"><svg class="cf-scene" viewBox="0 0 1160 640" preserveAspectRatio="${innerWidth >= 900 ? "xMidYMax meet" : "xMidYMax slice"}">${SAFARI_SCENE}<g class="cf-cats"></g><g style="pointer-events:none">${SAFARI_FRONT}</g><g class="cf-fx"></g></svg></div>
      <div class="cf-sheet" hidden></div></div>` : `<div class="cf-room"><div class="cf-top"><span><b>☕ The Cat Café</b><small>Tap a ${window.COURSE && window.COURSE.guests === "primate" ? "cat or a primate" : "cat"} to meet them${wide ? " · tap the toys, the wheel and the treat jar" : ""}</small></span><button type="button" class="cf-x" aria-label="Leave the café">✕</button></div>
      <svg class="cf-scene" viewBox="${wide ? `${VX.toFixed(1)} 0 ${VW.toFixed(1)} 640` : "0 0 360 640"}" preserveAspectRatio="${wide ? "xMidYMax meet" : "xMidYMax slice"}">${CAFE_SCENE}${wide ? CAFE_SIDES : ""}<g transform="translate(246 462) scale(.56)">${TREE_SVG.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g>${CAFE_WALL}${CAFE_TOYS}<defs><clipPath id="cfHole"><circle cx="277.9" cy="572.9" r="10.4"/></clipPath></defs><g class="cf-cats"></g><g class="cf-fx"></g></svg>
      <div class="cf-sheet" hidden></div></div>`;
    document.body.appendChild(cafe);
    const G = cafe.querySelector(".cf-cats"), sheet = cafe.querySelector(".cf-sheet");
    const drawCat = (r, walking) => {
      const sp = SP[r.spot], pose = walking ? "stand" : sp.pose, k = stageOf(r.pts | 0);
      if (sp.inside && !walking) {   // just the face in the dark doorway; glowing eyes, sometimes dozing
        return art(k, r.equip || { badges: [] }, { breed: r.breed, color: r.color, collar: r.collar || "navy", eyes: ["wide", "open", "sleepy", "happy"][Math.random() * 4 | 0], pose: "sit", boxed: true, plain: true }).replace("<svg ", `<svg x="-40" y="-72" width="80" height="80" `);
      }
      const eyes = walking ? "open" : sp.act ? ACT_EYES[sp.act] || "dilated" : pose === "lie" ? (Math.random() < .5 ? "sleep" : "sleepy") : ["open", "wide", "happy", "sleepy"][Math.random() * 4 | 0];
      const svg = art(k, r.equip || { badges: [] }, { breed: r.breed, color: r.color, collar: r.collar || "navy", w: r.weight || 1, eyes, pose, flip: walking ? r.face > 0 : sp.act === "mouse", plain: !r.mine }).replace("<svg ", `<svg x="-40" y="-72" width="80" height="80" `);
      const tag = r.mine ? `<g transform="translate(0 8)"><rect x="-22" y="-6" width="44" height="12" rx="6" fill="#fff" stroke="#3a2a1e" stroke-width="1"/><text y="3" font-size="7.5" font-weight="700" text-anchor="middle" fill="#3a2a1e" font-family="-apple-system,sans-serif">${esc((r.nick || "Dexter").slice(0, 10))} ♥</text></g>` : "";
      return svg + tag;
    };
    R.forEach((r, i) => {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g"); g.setAttribute("class", "cf-cat"); g.setAttribute("tabindex", "0"); g.setAttribute("role", "button");
      g.setAttribute("aria-label", r.mine ? `${r.nick || "Dexter"}, your ${breedName(r.breed, r.color)}` : `Meet ${/^[AEIOU]/i.test(breedName(r.breed, r.color)) ? "an" : "a"} ${breedName(r.breed, r.color)}`);
      const sp = SP[r.spot]; g.style.transform = `translate(${sp.x}px,${sp.y}px) scale(${sp.z * sz(r) / 80})`; g.innerHTML = drawCat(r); if (sp.act) g.classList.add("act-" + sp.act);
      const w = document.createElementNS("http://www.w3.org/2000/svg", "g"); if (sp.inside) w.setAttribute("clip-path", "url(#cfHole)"); w.appendChild(g); G.appendChild(w); r.g = g; r.w = w;
      const open = () => meet(r); g.addEventListener("click", open); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open() } });
    });
    // life in the café: cats wander between spots, blink, and chirp
    const free = who => spots.filter(i => !R.some(r => r.spot === i) && (!who || fits(who, i)));
    const bubble = (r, text) => { if (!cafe) return; const sp = SP[r.spot], bw = Math.max(44, String(text).length * 5.4 + 14), t = document.createElementNS("http://www.w3.org/2000/svg", "g"); t.setAttribute("class", "cf-bub"); t.innerHTML = `<rect x="${sp.x - bw / 2}" y="${sp.y - sp.z - 18}" width="${bw}" height="16" rx="8" fill="#fff" stroke="#3a2a1e" stroke-width="1.2"/><text x="${sp.x}" y="${sp.y - sp.z - 7}" font-size="9" font-weight="700" text-anchor="middle" font-family="-apple-system,sans-serif" fill="#3a2a1e">${text}</text>`; cafe.querySelector(".cf-fx").appendChild(t); setTimeout(() => t.remove(), 2200) };
    const life = setInterval(() => {
      if (!cafe || !document.body.contains(cafe)) { clearInterval(life); return }
      if (!sheet.hidden || !R.length) return;
      const ins = R.find(x => SP[x.spot].inside), r = ins && Math.random() < .25 ? ins : R[Math.random() * R.length | 0];   // the cat in the house comes out now and then
      if (r === ins || Math.random() < .55) { const f = free(r); if (!f.length) return; const hole = f.find(i => SP[i].inside); const to = hole != null && Math.random() < .35 ? hole : f[Math.random() * f.length | 0], a = SP[r.spot], b = SP[to];
        r.face = b.x > a.x ? 1 : -1; r.w.removeAttribute("clip-path"); r.g.setAttribute("class", "cf-cat"); r.g.innerHTML = drawCat(r, true); r.spot = to; r.g.classList.add("walk"); r.g.style.transform = `translate(${b.x}px,${b.y}px) scale(${b.z * sz(r) / 80})`;
        setTimeout(() => { r.g.classList.remove("walk"); if (SP[r.spot].inside) { r.w.setAttribute("clip-path", "url(#cfHole)"); bubble(r, "mrrp ♥") } if (SP[r.spot].act) r.g.classList.add("act-" + SP[r.spot].act); r.g.innerHTML = drawCat(r) }, 2400);
      } else {
        const onTree = R.filter(x => SP[x.spot].tree);
        if (onTree.length > 1 && Math.random() < .5) { const [a, b] = onTree.sort(() => Math.random() - .5); bubble(a, "♥"); bubble(b, ["mrrp!", "purr…", "♥"][Math.random() * 3 | 0]); [a, b].forEach(x => { x.g.classList.remove("play"); void x.g.getBBox(); x.g.classList.add("play"); setTimeout(() => x.g.classList.remove("play"), 900) }) }
        else bubble(r, (saf ? CALLS[resolveBreed(r.breed)[0]] || ["♥"] : ["mrrp?", "meow!", "purr…", "♥", "mew", "zzz"])[Math.random() * 6 | 0]);
      }
    }, 1700);
    // more going on in a bigger room: a second cat wanders now and then
    const life2 = wide ? setInterval(() => { if (!cafe || !document.body.contains(cafe)) { clearInterval(life2); return } if (!sheet.hidden) return;
      if (!R.length) return; const r = R[Math.random() * R.length | 0], f = free(r); if (!f.length || SP[r.spot].inside || r.g.classList.contains("walk")) return;
      const to = f[Math.random() * f.length | 0], b = SP[to]; r.face = b.x > SP[r.spot].x ? 1 : -1; r.g.setAttribute("class", "cf-cat"); r.g.innerHTML = drawCat(r, true); r.spot = to; r.g.classList.add("walk"); r.g.style.transform = `translate(${b.x}px,${b.y}px) scale(${b.z * sz(r) / 80})`;
      setTimeout(() => { r.g.classList.remove("walk"); if (SP[r.spot].inside) r.w.setAttribute("clip-path", "url(#cfHole)"); if (SP[r.spot].act) r.g.classList.add("act-" + SP[r.spot].act); r.g.innerHTML = drawCat(r) }, 2400);
    }, 2300) : 0;
    // toys you can tap: nearby cats react, and the treat jar calls a couple of cats over
    const near = (x, y, n) => R.filter(r => !SP[r.spot].inside).sort((a, b) => Math.hypot(SP[a.spot].x - x, SP[a.spot].y - y) - Math.hypot(SP[b.spot].x - x, SP[b.spot].y - y)).slice(0, n);
    const hop = r => { r.g.classList.remove("play"); void r.g.getBBox(); r.g.classList.add("play"); setTimeout(() => r.g.classList.remove("play"), 900) };
    cafe.querySelectorAll("[data-prop]").forEach(el => {
      el.setAttribute("tabindex", "0"); el.setAttribute("role", "button");
      const go = () => {
        const x = +el.dataset.x, y = +el.dataset.y, kind = el.dataset.prop;
        el.classList.remove("go"); void el.getBBox(); el.classList.add("go"); setTimeout(() => el.classList.remove("go"), 2600);
        const lines = { treats: ["treats?!", "mrrp!!", "me first!"], wheel: ["zoom!", "!!", "mrrp?"], wand: ["!!", "mine!", "*wiggle*"], pom: ["!!", "*bap*", "mrrp!"], banana: ["banana!", "ooh ooh!", "mine!"], termite: ["termites!", "*fishing*", "ooh!"] }[kind] || ["!!"];
        near(x, y, kind === "treats" || kind === "banana" ? 4 : 2).forEach((r, i) => setTimeout(() => { bubble(r, lines[i % lines.length]); hop(r) }, 150 + i * 220));
        if (kind === "treats") {   // one cat comes over to the case
          const r = near(x, y, 6).find(c => !c.g.classList.contains("walk")), f = r ? free(r).filter(i => Math.hypot(SP[i].x - x, SP[i].y - y) < 260) : [];
          if (f.length && r) { const to = f[0], b = SP[to]; r.face = b.x > SP[r.spot].x ? 1 : -1; r.g.setAttribute("class", "cf-cat"); r.g.innerHTML = drawCat(r, true); r.spot = to; r.g.classList.add("walk"); r.g.style.transform = `translate(${b.x}px,${b.y}px) scale(${b.z * sz(r) / 80})`; setTimeout(() => { r.g.classList.remove("walk"); r.g.innerHTML = drawCat(r); bubble(r, "nom ♥") }, 2400) }
        }
      };
      el.addEventListener("click", go); el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go() } });
    });
    const close = () => { clearInterval(life); clearInterval(life2); if (cafe) { cafe.remove(); cafe = null } };
    cafe.querySelector(".cf-x").onclick = close;
    const pan = cafe.querySelector(".cf-pan"); if (pan) pan.scrollLeft = Math.max(0, (pan.scrollWidth - pan.clientWidth) * .36);
    cafe.addEventListener("keydown", e => { if (e.key === "Escape") { if (!sheet.hidden) sheet.hidden = true; else close() } });
    // meeting a cat
    function meet(r) {
      const H = household(), n = kindCount(H, isPrimate(r.breed)), full = n >= MAX_CATS, B = BREEDS[resolveBreed(r.breed)[0]];
      let color = resolveBreed(r.breed, r.color)[1];
      const used = new Set(catList().list.map(c => (c.nick || "Dexter").toLowerCase()));
      const draw = () => {
        const k = r.mine ? stageOf(r.pts | 0) : 0;
        sheet.innerHTML = `<button type="button" class="cf-close" aria-label="Back to the café">✕</button>
          <div class="cf-meet">${art(k, r.equip || { badges: [] }, { breed: r.breed, color, collar: r.collar || "navy", w: r.weight || 1, eyes: "happy", plain: !r.mine })}
          <div><p class="cf-kicker">${r.alumni ? "Used to live with you" : r.mine ? "Your cat" : "Looking for a study buddy"}</p><h3>${r.mine ? esc(r.nick || "Dexter") : esc(B.name)}</h3>${B.taxon ? `<p class="cf-kicker" style="margin-top:2px">${esc(B.taxon)}</p>` : ""}<p class="cf-desc">${esc(B.desc)}.</p>
          ${r.mine ? `<p class="cf-desc">${esc(breedName(r.breed, r.color))} · Lv ${level(r.pts | 0)} · ${esc(formOf(stageOf(r.pts | 0), r.breed))}</p>` : ""}</div></div>
          ${r.alumni ? (full ? `<p class="cf-desc">Your home is full (${MAX_CATS} cats). Return a cat to the café to make room, and ${esc(r.nick || "this cat")} can come home with all their progress.</p>`
            : `<p class="cf-desc">Still has all their XP, outfits and badges.</p><div class="cf-acts"><button type="button" class="cf-go" data-do="home-train">📚 Come home &amp; study</button><button type="button" class="cf-go alt" data-do="home">🏠 Come home</button><button type="button" class="cf-go ghost" data-do="stay">Not now</button></div>`)
          : r.mine ? `<div class="cf-acts"><button type="button" class="cf-go" data-do="train">📚 Study with me</button><button type="button" class="cf-go alt" data-do="along">🎒 Come along</button><button type="button" class="cf-go ghost" data-do="stay">Keep chilling</button>${r.active ? "" : `<button type="button" class="cf-go ghost" data-do="return">↩ Live at the café</button>`}</div>`
          : full ? `<p class="cf-desc">Your home is full (${MAX_CATS} cats). Visit anytime to say hi!</p>`
          : `<p class="cf-lab">Coat color</p><div class="cf-colors">${Object.entries(B.colors).map(([key, c]) => `<button type="button" class="cf-col${key === color ? " on" : ""}" data-col="${key}" aria-pressed="${key === color}"><i style="background:linear-gradient(135deg,${c.fur[0]} 55%,${c.pat ? (Array.isArray(c.pat) ? c.pat[0] : c.pat) : c.fur[1]} 55%)"></i>${esc(c.name)}</button>`).join("")}</div>
            <p class="cf-lab">Name</p><input class="cf-name" maxlength="24" value="${esc(B.names.find(x => !used.has(x.toLowerCase())) || B.names[0])}" aria-label="Name">
            <div class="cf-acts"><button type="button" class="cf-go" data-do="adopt-train">🐾 Bring to study</button><button type="button" class="cf-go alt" data-do="adopt">Adopt · come along</button></div>`}`;
        sheet.querySelector(".cf-close").onclick = () => { sheet.hidden = true };
        sheet.querySelectorAll("[data-col]").forEach(b => b.onclick = () => { const nm = sheet.querySelector(".cf-name").value; color = b.dataset.col; draw(); sheet.querySelector(".cf-name").value = nm });
        sheet.querySelectorAll("[data-do]").forEach(b => b.onclick = () => {
          const d = b.dataset.do, H2 = household();
          if (d === "stay") { sheet.hidden = true; return }
          let id = r.id, nm = r.nick || "Dexter";
          if (d === "return") { if (!confirm(`Return ${nm} to the café? ${nm} keeps all their progress and you can bring them home any time.`)) return; returnCat(id); close(); refreshMates(); settle(); pop(`<b>${esc(nm)} moved into the café</b><small>Visit to bring them home again</small>`, "buy"); return }
          if (d.startsWith("home")) { if (!welcomeBack(id)) return; if (d === "home-train") trainCat(id); close(); paintDock(); checkPal(); paintPal(); refreshMates(); settle(); pop(`<b>Welcome back, ${esc(nm)}!</b><small>${esc(breedName(r.breed, r.color))} · Lv ${level(r.pts | 0)}</small>`, "buy"); return }
          if (d.startsWith("adopt")) { nm = (sheet.querySelector(".cf-name").value || "").trim().slice(0, 24) || B.names[0]; id = adoptCat(resolveBreed(r.breed)[0], nm, color); if (!id) return }
          if (d === "train" || d === "adopt-train") trainCat(id);
          else if (d === "along") { const H3 = household(); if (!H3.along.includes(id)) { H3.along = H3.along.concat(id).slice(-MAX_ALONG); saveHouse(H3) } }
          close(); paintDock(); checkPal(); paintPal(); refreshMates(); settle();
          pop(`<b>${d.startsWith("adopt") ? `Welcome home, ${esc(nm)}!` : `${esc(nm)} is coming to study!`}</b><small>${esc(breedName(resolveBreed(r.breed)[0], color))}</small>`, "buy");
        });
        sheet.hidden = false;
      };
      draw();
    }
    cafe.querySelector(".cf-x").focus();
  }
  // ===== Reading badges: every finished Read & Learn chapter (saved by read/index.html) earns its badge
  const READ_KEY = ((window.COURSE && window.COURSE.prefix) || "a104-") + "read-v1";
  const readKeyOf = k => { const W = window.BioWardrobe, it = W && W.ITEMS.find(i => i.earn === k); return (it && it.readKey) || READ_KEY };   // each badge reads its own course's Read & Learn progress
  // how many times a chapter has been finished (restarting keeps the count; older saves only have "finished")
  function completions(k) { let r = {}; try { r = JSON.parse(localStorage.getItem(readKeyOf(k)) || "{}") || {} } catch (e) { } const c = r[k] || {}; return Math.max(c.done | 0, c.finished ? 1 : 0) }
  const badgeSVG = (it, n, cls) => `<svg${cls ? ` class="${cls}"` : ""} viewBox="-13.5 -13.5 27 27" aria-hidden="true">${window.BioWardrobe.badgeArt(it, n)}</svg>`;
  function syncBadges() {
    const W = window.BioWardrobe; if (!W) return [];
    const s = load(), add = W.ITEMS.filter(i => i.earn && completions(i.earn) > 0 && !s.owned.includes(i.id));
    if (add.length) { add.forEach(i => s.owned.push(i.id)); save(s) }
    return add;
  }
  function badgeWon(item, up) {
    const s = load(), el = document.createElement("div"), n = completions(item.earn), t = window.BioWardrobe.tier(n); el.className = "bb-badge-won"; el.setAttribute("role", "dialog"); el.setAttribute("aria-label", up ? "Badge upgraded" : "New badge");
    el.innerHTML = `${badgeSVG(item, n, "big")}${up ? `<h3>Your ${esc(item.name)} is now ${t.name}!</h3><p>You've finished “${esc(item.chapter)}” ${n} times.${t.next ? ` ${t.next.at - n} more to make it ${t.next.name}.` : " It's as legendary as a badge gets."}</p>` : `<h3>You earned the ${esc(item.name)}!</h3><p>For finishing “${esc(item.chapter)}”. It's in ${esc(name(s))}'s Badge Case. Finish the chapter again to make it sparkle.</p>`}
      <div class="row"><button type="button" class="pin">📌 Pin it on ${esc(name(s))}'s collar</button><button type="button" class="ghost later">Later</button></div>`;
    document.body.appendChild(el);
    el.querySelector(".pin").onclick = () => { const t = load(); const l = t.equip.badges || []; if (!l.includes(item.id)) l.push(item.id); t.equip.badges = window.BioWardrobe.ITEMS.filter(i => i.slot === "badge" && l.includes(i.id)).map(i => i.id); save(t); el.remove(); paintDock(); openPal("badges") };
    el.querySelector(".later").onclick = () => el.remove();
    try { meowSound(stageOf(s.pts)) } catch (e) { }
  }
  window.addEventListener("bio:badge", e => {
    const d = e.detail || {}, W = window.BioWardrobe;
    const added = syncBadges(); added.forEach((i, n) => setTimeout(() => badgeWon(i), n * 300));
    if (d.up && !added.length && W && W.byId["badge-" + d.chapter]) badgeWon(W.byId["badge-" + d.chapter], true);   // a new sparkle tier
    paintDock();
  });
  const openBadges = () => openPal("badges");
  function closeShop() { if (shop) { shop.remove(); shop = null } }
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeShop() });

  // ===== Study pal: on pages with questions, Dexter leaves the corner and stays with the student.
  // He sits beside the question (in the margin on wide screens, bottom corner on phones), bats a yarn ball while she reads,
  // scurries over to the answer she picks to react, then goes back to playing. Tap him for the Closet / Shop / Progress.
  const PAL_YARN = `<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="10.5" fill="#4f8dff" stroke="#3a2a1e" stroke-width="2"/><path d="M5 10 Q13 5 21 12 M5 15 Q13 9 21 17 M9 4.5 Q15 13 11 23" stroke="#2c5fc4" stroke-width="1.6" fill="none"/></svg>`;
  let palOn = false, palAt = null, lastOpt = null, lastOptAt = 0, visiting = 0, rafQ = 0;
  // Playtime: Dexter switches between things cats love to do while the student reads (all toys are original SVG)
  const OLC = "#3a2a1e";
  const TOYS = {
    yarn: PAL_YARN,
    butterfly: `<svg viewBox="0 0 30 24" aria-hidden="true"><g class="wl"><path d="M15 12 C9 2 2 3 3 9 C4 14 10 14 15 12Z" fill="#ff9f43" stroke="${OLC}" stroke-width="1.4"/><path d="M15 12 C10 16 5 20 8 22 C11 23 14 18 15 12Z" fill="#ffc46b" stroke="${OLC}" stroke-width="1.4"/><circle cx="8" cy="8" r="1.4" fill="#fff"/></g><g class="wr"><path d="M15 12 C21 2 28 3 27 9 C26 14 20 14 15 12Z" fill="#ff9f43" stroke="${OLC}" stroke-width="1.4"/><path d="M15 12 C20 16 25 20 22 22 C19 23 16 18 15 12Z" fill="#ffc46b" stroke="${OLC}" stroke-width="1.4"/><circle cx="22" cy="8" r="1.4" fill="#fff"/></g><path d="M15 7 v11" stroke="${OLC}" stroke-width="2" stroke-linecap="round"/><path d="M15 7 l-2.4 -4.4 M15 7 l2.4 -4.4" stroke="${OLC}" stroke-width="1" stroke-linecap="round"/></svg>`,
    mouse: `<svg viewBox="0 0 34 20" aria-hidden="true"><path d="M6 14 Q-1 13 2 6" stroke="#8a8f99" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="17" cy="13" rx="11" ry="6.4" fill="#b8bec8" stroke="${OLC}" stroke-width="1.5"/><circle cx="22" cy="7" r="3.6" fill="#ffc2cf" stroke="${OLC}" stroke-width="1.3"/><circle cx="25.6" cy="11.4" r="1.2" fill="${OLC}"/><circle cx="28.2" cy="14" r="1.2" fill="#ff7a9a"/><path d="M27.6 14 l4 -1.2 M27.6 15 l4 1" stroke="${OLC}" stroke-width=".7"/><path d="M12 19 v-2 M20 19 v-2" stroke="${OLC}" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    laser: `<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9" fill="#ff3b30" opacity=".22"/><circle cx="10" cy="10" r="4.6" fill="#ff3b30"/><circle cx="8.6" cy="8.6" r="1.5" fill="#fff" opacity=".85"/></svg>`,
    feather: `<svg viewBox="0 0 24 60" aria-hidden="true"><path d="M12 0 V30" stroke="#8b5a2b" stroke-width="2"/><path d="M12 30 C4 37 4 50 12 58 C20 50 20 37 12 30Z" fill="#c084fc" stroke="${OLC}" stroke-width="1.4"/><path d="M12 33 V56 M12 41 l-5 -3 M12 47 l-5 -3 M12 41 l5 -3 M12 47 l5 -3" stroke="#7c3aed" stroke-width="1"/><path d="M12 31 C7 27 5 23 8 20 M12 31 C17 27 19 23 16 20" stroke="#f472b6" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    leaf: `<svg viewBox="0 0 24 16" aria-hidden="true"><path d="M2 8 C8 0 18 0 22 8 C18 16 8 16 2 8Z" fill="#7cc35a" stroke="${OLC}" stroke-width="1.4"/><path d="M3 8 H21 M9 8 l3 -3 M9 8 l3 3 M15 8 l3 -3 M15 8 l3 3" stroke="#3f8a3a" stroke-width="1"/></svg>`,
    nap: `<span class="zz">z</span><span class="zz">z</span><span class="zz">Z</span>`,
    box: "", tail: ""
  };
  const BOX_FRONT = `<svg viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true"><path d="M2 10 L-4 0 L28 0 L32 10Z M98 10 L104 0 L72 0 L68 10Z" fill="#c98b52" stroke="${OLC}" stroke-width="2.2" stroke-linejoin="round"/><path d="M2 10 H98 L94 49 H6Z" fill="#d9a066" stroke="${OLC}" stroke-width="2.6" stroke-linejoin="round"/><path d="M44 10 V49 M56 10 V49" stroke="#e8c48f" stroke-width="3" opacity=".8"/><path d="M14 22 l6 6 M20 22 l-6 6" stroke="#a8713e" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  const ACTS = ["yarn", "butterfly", "mouse", "laser", "feather", "leaf", "box", "tail"];
  const ACT_LABEL = { yarn: "playing with his yarn ball", butterfly: "chasing a butterfly", mouse: "hunting a toy mouse", laser: "chasing a laser dot", feather: "swatting a feather toy", leaf: "pouncing on a falling leaf", box: "sitting in a box", tail: "chasing his tail", nap: "taking a cat nap" };
  let act = ACTS[Math.random() * ACTS.length | 0], lastMove = Date.now(), mood = null, moodT = 0;
  // Body pose per game: on all fours to hunt the mouse, chase the laser or his tail; curled up to nap; sitting otherwise.
  // While he travels (to an answer, or back to his spot) he stands and trots, facing the way he's going.
  const ACT_POSE = { mouse: "stand", laser: "stand", tail: "stand", nap: "lie" };
  let moving = false, facing = -1, walkT = 0;
  function walkTo(pos, then) {
    matesMove(pos);
    const dx = palAt ? pos.x - palAt.x : 0, far = !palAt || Math.hypot(dx, pos.y - palAt.y) > 14;
    if (far) { const f = dx > 2 ? 1 : dx < -2 ? -1 : facing; if (!moving || f !== facing) { moving = true; facing = f; paintPal() } }
    place(pos);
    clearTimeout(walkT); walkT = setTimeout(() => { if (moving && !visiting) { moving = false; paintPal() } if (then) then() }, far ? 600 : 0);
  }
  const ACT_EYES = { yarn: "open", butterfly: "wide", mouse: "focus", laser: "dilated", feather: "dilated", leaf: "wide", box: "sleepy", tail: "dilated", nap: "sleep" };
  function eyesNow(k) {
    if (k === 0) return mood || (act === "nap" ? "sleep" : act === "box" ? "open" : ACT_EYES[act] === "sleepy" ? "open" : ACT_EYES[act] || "wide");   // the kitten: big curious eyes
    return mood || ACT_EYES[act] || "open";
  }
  function setMood(m, ms) { mood = m; clearTimeout(moodT); paintPal(); moodT = setTimeout(() => { mood = null; paintPal() }, ms) }
  function setAct(a) { if (a !== act) { const was = act; act = a; paintPal(); if (a === "nap" || was === "nap") mates.forEach(paintMate) } }
  function nextAct() { const pool = ACTS.filter(x => x !== act); setAct(pool[Math.random() * pool.length | 0]) }
  setInterval(() => {   // a new game every 15 s; a cat nap after 45 s without any interaction
    if (!palOn || off() || visiting || document.hidden) return;
    if (act !== "nap" && Date.now() - lastMove > 45000) setAct("nap"); else if (act !== "nap") nextAct();
  }, 15000);
  ["pointerdown", "keydown", "scroll", "touchstart"].forEach(t => addEventListener(t, () => { lastMove = Date.now(); if (act === "nap") nextAct() }, { passive: true, capture: true }));
  const shown = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight };
  // size grows with XP: a tiny kitten (62%) that gets a little bigger with every answer, with a jump at each evolution,
  // up to 126% for a Level 100 Professor
  const SIZE_AT = [.62, .84, .91, .98, 1.05, 1.12];
  function sizeFor(pts) {
    pts = Math.max(0, pts | 0); const k = stageOf(pts), next = k + 1 < STAGES.length ? STAGES[k + 1].at : MAX_XP, base = SIZE_AT[k];
    const frac = Math.min(1, (pts - STAGES[k].at) / Math.max(1, next - STAGES[k].at)), top = k + 1 < STAGES.length ? SIZE_AT[k + 1] - .04 : 1.26;
    return base + (top - base) * frac;
  }
  const sizeK = () => sizeFor(load().pts);   // he grows with each evolution: 84% as a freshman → 119% as the Professor
  // Base size by screen: phones keep 72px; laptops and desktops get a much bigger cat (they have the room).
  // On top of that, a size the student picks (60%–180%, saved per device) and an optional anchor (he stays put).
  const SCALE_KEY = KEY + "-scale", ANCHOR_KEY = KEY + "-anchor";
  const baseSize = () => innerWidth < 900 ? 72 : innerWidth < 1400 ? 140 : 160;
  function userScale() { try { const v = parseFloat(localStorage.getItem(SCALE_KEY)); return isFinite(v) ? Math.min(1.8, Math.max(.6, v)) : 1 } catch (e) { return 1 } }
  function anchored() { try { return localStorage.getItem(ANCHOR_KEY) === "1" } catch (e) { return false } }
  const palSize = () => Math.round(baseSize() * sizeK() * userScale());
  function anchor() { const p = $("bbPal"); return palOn && p ? p : $("bbDock") }
  function anchorRect(d) {   // where Dexter is headed (he may still be moving)
    if (d && d.id === "bbPal" && palAt) { const S = palSize(); return { left: palAt.x, top: palAt.y, right: palAt.x + S, bottom: palAt.y + S, width: S, height: S } }
    return d.getBoundingClientRect();
  }
  function questionCard() {
    const all = [...document.querySelectorAll(".opt")], opt = all.find(shown) || all[0];   // a question below the fold still counts
    return opt ? opt.closest("#card, .card, .clue, article, section") || opt.parentElement : null;
  }
  // ===== The cat tree: on question pages the cats live on a cozy multi-floor cat tree standing on the bottom of the
  // screen (in the margin beside the questions when there's room). Floors: a carpeted top perch for two, a hammock, the
  // roof of a cubby house, and the base. Toys: a swinging pom-pom, a toy mouse and a ball. The cat in training heads
  // off to answers and comes back; the others stay on the tree, hop between floors and play. Settings: Progress tab.
  const TREE_KEY = KEY + "-tree";
  const treeOn = () => false;   // the tree lives in the Cat Café now; on study pages the cats float beside the questions
  const T_SLOTS = [{ x: 66, y: 39, pose: "sit" }, { x: 134, y: 39, pose: "sit" }, { x: 146, y: 113, pose: "lie" }, { x: 58, y: 150, pose: "sit" }, { x: 130, y: 246, pose: "sit" }];
  const T_ADJ = { 0: 1, 1: 0, 2: 1, 3: 4, 4: 3 };
  let treeBox = null, palSlot = 0;
  const TREE_SVG = `<svg viewBox="0 0 200 262" aria-hidden="true"><defs>
    <pattern id="bbSisal" width="8" height="5" patternUnits="userSpaceOnUse"><rect width="8" height="5" fill="#dcbf8f"/><path d="M0 2.5 Q2 1 4 2.5 T8 2.5" stroke="#b28c57" stroke-width="1.4" fill="none"/></pattern>
    <linearGradient id="bbWood" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#e8c9a0"/><stop offset="1" stop-color="#c99f72"/></linearGradient>
    <linearGradient id="bbCarpet" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#9cc0e4"/><stop offset="1" stop-color="#7aa3cf"/></linearGradient></defs>
    <ellipse cx="102" cy="258" rx="96" ry="5" fill="#000" opacity=".1"/>
    <rect x="12" y="244" width="180" height="14" rx="6" fill="url(#bbWood)" stroke="#3a2a1e" stroke-width="2.2"/><rect x="12" y="241" width="180" height="7" rx="3.5" fill="url(#bbCarpet)" stroke="#3a2a1e" stroke-width="2"/>
    <rect x="92" y="40" width="18" height="203" fill="url(#bbSisal)" stroke="#3a2a1e" stroke-width="2.2"/>
    <rect x="152" y="104" width="12" height="139" fill="url(#bbSisal)" stroke="#3a2a1e" stroke-width="2"/>
    <path d="M110 100 Q146 136 182 100" stroke="#3a2a1e" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M110 100 Q146 136 182 100 Q146 122 110 100Z" fill="#f5a9bf" stroke="#3a2a1e" stroke-width="2"/><path d="M118 104 Q146 128 174 104" stroke="#fff" stroke-width="1.4" fill="none" opacity=".6" stroke-dasharray="3 3"/>
    <rect x="16" y="150" width="82" height="92" rx="8" fill="url(#bbWood)" stroke="#3a2a1e" stroke-width="2.2"/><rect x="14" y="146" width="86" height="9" rx="4.5" fill="url(#bbCarpet)" stroke="#3a2a1e" stroke-width="2"/>
    <circle cx="57" cy="198" r="19" fill="#5b3f2b" stroke="#3a2a1e" stroke-width="2.2"/><path d="M42 205 Q57 196 72 205" stroke="#7a573c" stroke-width="3" fill="none"/>
    <ellipse cx="100" cy="44" rx="86" ry="9" fill="url(#bbWood)" stroke="#3a2a1e" stroke-width="2.2"/><ellipse cx="100" cy="39" rx="86" ry="9" fill="url(#bbCarpet)" stroke="#3a2a1e" stroke-width="2.2"/>
    <g><animateTransform attributeName="transform" type="rotate" values="-14 178 46;14 178 46;-14 178 46" dur="2.8s" repeatCount="indefinite"/><path d="M178 46 V78" stroke="#3a2a1e" stroke-width="1.4"/><circle cx="178" cy="82" r="7" fill="#ff8fb3" stroke="#3a2a1e" stroke-width="1.8"/><path d="M174 79 l8 6 M182 79 l-8 6" stroke="#ffd0df" stroke-width="1.4"/></g>
    <g transform="translate(40 236)"><path d="M-12 2 Q-18 0 -16 -6" stroke="#8a8f99" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="0" rx="10" ry="6" fill="#b8bec8" stroke="#3a2a1e" stroke-width="1.6"/><circle cx="5" cy="-5" r="3.2" fill="#ffc2cf" stroke="#3a2a1e" stroke-width="1.2"/><circle cx="8.4" cy="-.6" r="1" fill="#3a2a1e"/></g>
    <g transform="translate(176 233)"><circle r="7" fill="#ffd84a" stroke="#3a2a1e" stroke-width="1.8"/><path d="M-6 -3 Q0 1 6 -3 M-6 3 Q0 7 6 3" stroke="#e85d75" stroke-width="1.6" fill="none"/></g>
  </svg>`;
  function treeLayout() {
    const S0 = Math.round((innerWidth >= 900 ? 96 : 72) * Math.max(.9, sizeK())), TW = Math.min(Math.round(S0 * 2.25), innerWidth - 12), TH = Math.round(TW * 1.31), k = TW / 200;
    const sp = getSpot(), card = questionCard(), r = card && card.getBoundingClientRect();
    const x = sp ? PAD + sp.fx * Math.max(0, innerWidth - TW - 2 * PAD) : r && r.right + 12 + TW <= innerWidth - 6 ? r.right + 12 : innerWidth - TW - 6;
    return { x, y: innerHeight - TH - 4, TW, TH, k };
  }
  function layoutTree() {
    let t = $("bbTree");
    if (!palOn || off() || !treeOn()) { if (t) t.remove(); treeBox = null; document.body.style.paddingBottom = ""; return null }
    if (!t) { t = document.createElement("div"); t.id = "bbTree"; t.className = "bb-tree"; t.innerHTML = TREE_SVG; document.body.appendChild(t) }
    treeBox = treeLayout();
    t.style.width = treeBox.TW + "px"; t.style.height = treeBox.TH + "px"; t.style.transform = `translate(${Math.round(treeBox.x)}px,${Math.round(treeBox.y)}px)`;
    // on phones the tree stands over the bottom of the page: leave room to scroll the content above it
    document.body.style.paddingBottom = innerWidth < 900 ? (treeBox.TH + 16) + "px" : "";
    return treeBox;
  }
  function slotPos(i, size) { const b = treeBox, sl = T_SLOTS[i]; return { x: b.x + sl.x * b.k - size / 2, y: b.y + sl.y * b.k - size * .9 } }
  const takenSlots = () => new Set([palSlot, ...mates.map(m => m.slot)]);
  // ===== Staying out of the way: the cats never sit on text, questions or answers. A coarse map of the screen marks
  // every line of text (its own line boxes, so the empty end of a short line or the space between cards is fair game) and
  // every button, link, input, image and answer choice. Each cat picks the free spot nearest to where it wants to be
  // (its saved spot, beside the cat in training, the answer she just picked), staying put while its spot stays clear.
  // When the screen is completely full it peeks in from the edge, and if it still has to overlap it goes see-through.
  const AV_OWN = ".bb-pal,.bb-mate,.bb-dock,.bb-say,.bb-pop,.bb-fx,.bb-yarn,.bb-tree,.bb-greet,.bb-veil,.lk-card,.an-bar,.an-pop,script,style,noscript,template";
  const AV_HARD = "button,a,input,textarea,select,label,img,video,canvas,iframe,table,summary,[role=button],.opt,svg";
  const CELL = 6;
  let avGrid = null, avAt = 0;
  const overlayOpen = () => !!document.querySelector(".bb-veil,.cf-veil,.st-veil,.an-veil");
  function avBuild() {
    const W = Math.ceil(innerWidth / CELL) + 1, Hh = Math.ceil(innerHeight / CELL) + 1, g = new Uint8Array(W * Hh);
    const mark = (l, t, r, b) => {
      const x0 = Math.max(0, Math.floor((l - 3) / CELL)), x1 = Math.min(W - 1, Math.floor((r + 3) / CELL)), y0 = Math.max(0, Math.floor((t - 3) / CELL)), y1 = Math.min(Hh - 1, Math.floor((b + 3) / CELL));
      for (let y = y0; y <= y1; y++) g.fill(1, y * W + x0, y * W + x1 + 1);
    };
    const rg = document.createRange(), H = innerHeight, Wd = innerWidth;
    const walk = el => {
      for (let n = el.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3) {
          if (!/\S/.test(n.data)) continue;
          rg.selectNodeContents(n); for (const r of rg.getClientRects()) if (r.width && r.bottom > 0 && r.top < H) mark(r.left, r.top, r.right, r.bottom);
          continue;
        }
        if (n.nodeType !== 1 || n.matches(AV_OWN)) continue;
        const r = n.getBoundingClientRect();
        const pos = r.width || r.height ? null : getComputedStyle(n).display;
        if (pos === "none") continue;
        // skip whole subtrees that are off screen (unless they're empty boxes that may hold positioned children)
        if ((r.width || r.height) && (r.bottom < 0 || r.top > H || r.right < 0 || r.left > Wd) && getComputedStyle(n).position === "static") continue;
        if (n.matches(AV_HARD)) { if (r.width && r.height && r.width < Wd * 1.2) { const cs = getComputedStyle(n); if (cs.visibility !== "hidden" && cs.opacity !== "0") mark(r.left, r.top, r.right, r.bottom) } continue }
        walk(n);
      }
    };
    walk(document.body);
    return { W, H: Hh, g };
  }
  function avSum(G) {   // 2-D prefix sums so any box can be checked in O(1)
    const { W, H, g } = G, P = new Int32Array((W + 1) * (H + 1));
    for (let y = 0; y < H; y++) { let row = 0; for (let x = 0; x < W; x++) { row += g[y * W + x]; P[(y + 1) * (W + 1) + x + 1] = P[y * (W + 1) + x + 1] + row } }
    G.P = P; return G;
  }
  function avMap(fresh) {
    if (fresh || !avGrid || Date.now() - avAt > 160) { avGrid = avSum(avBuild()); avAt = Date.now() }
    return avGrid;
  }
  const avCopy = G => ({ W: G.W, H: G.H, g: G.g.slice() });
  const body = (x, y, S) => [x + S * .16, y + S * .14, x + S * .84, y + S * .98];   // where the cat's drawing actually is
  function avCount(G, l, t, r, b) {
    const W = G.W, x0 = Math.max(0, Math.floor(l / CELL)), x1 = Math.min(G.W, Math.ceil(r / CELL)), y0 = Math.max(0, Math.floor(t / CELL)), y1 = Math.min(G.H, Math.ceil(b / CELL));
    if (x1 <= x0 || y1 <= y0) return 0; const P = G.P, w = W + 1;
    return P[y1 * w + x1] - P[y0 * w + x1] - P[y1 * w + x0] + P[y0 * w + x0];
  }
  function avTake(G, x, y, S) { const [l, t, r, b] = body(x, y, S); const W = G.W; for (let yy = Math.max(0, Math.floor(t / CELL)); yy < Math.min(G.H, Math.ceil(b / CELL)); yy++) G.g.fill(1, yy * W + Math.max(0, Math.floor(l / CELL)), yy * W + Math.min(W, Math.ceil(r / CELL))) }
  // the best spot for a cat of size S that wants to be at pref; keep = its current spot (kept while it's still clear)
  function avFind(G, S, pref, keep, up = 0) {   // up = room needed above him (for the cats stacked on his head)
    const cost = (x, y) => {
      const [l, t0, r, b] = body(x, y, S), t = t0 - up, vis = Math.max(0, Math.min(r, innerWidth) - Math.max(l, 0)) / (r - l);
      return { ov: avCount(G, Math.max(l, 0), t, Math.min(r, innerWidth), b), off: 1 - vis };
    };
    if (keep) { const c = cost(keep.x, keep.y); if (!c.ov && !c.off && keep.x >= 0 && keep.x <= innerWidth - S && keep.y >= 4 + up && keep.y <= innerHeight - S - 4) return { x: keep.x, y: keep.y, ov: 0 } }
    let best = null; const step = CELL * 2;
    for (let y = 4 + up; y <= innerHeight - S - 4; y += step) for (let x = -S * .5; x <= innerWidth - S * .5; x += step) {
      const c = cost(x, y), k = c.ov * 220 + c.off * 700 + Math.hypot(x - pref.x, y - pref.y);
      if (!best || k < best.k) best = { x, y, k, ov: c.ov };
    }
    return best ? { x: Math.round(best.x), y: Math.round(best.y), ov: best.ov } : { x: pref.x, y: pref.y, ov: 1 };
  }
  const avOff = () => treeBox || overlayOpen() || document.querySelector(".bb-pal.drag,.bb-mate.drag");
  function avSet(el, ov) { if (el) el.classList.toggle("bb-inway", ov > 0) }
  function wantHome() {
    const S = palSize(), sp = getSpot(), card = questionCard();
    if (sp) return spotXY(sp, S);
    if (card) { const r = card.getBoundingClientRect(); if (r.right + S + 28 <= innerWidth) return { x: r.right + 16, y: Math.min(Math.max(r.top + 30, 70), innerHeight - S - 24) } }
    return { x: innerWidth - S - 14, y: innerHeight - S - 18 };
  }
  // By default the companions stack up on his head in a little cat tower (cats you've dragged somewhere stay there).
  // The tower needs a clear column; if the whole tower doesn't fit, as many as fit stack and the rest find their own spots.
  const stackers = () => mates.filter(m => !mateSpot(m.c.id));
  let stackN = 0;
  function fitPal(G, S, pref, keep) {
    const st = stackers();
    for (let n = st.length; n > 0; n--) {
      const up = st.slice(0, n).reduce((h, m) => h + mateSize(m.c) * .8, 0); if (up + S + 8 > innerHeight) continue;
      const f = avFind(G, S, pref, keep, up); if (!f.ov) { stackN = n; return f }
    }
    stackN = 0; return avFind(G, S, pref, keep);
  }
  function home() {
    if (treeOn() && palOn && layoutTree()) return slotPos(palSlot, palSize());
    const want = wantHome(); if (avOff() || (anchored() && getSpot())) { stackN = stackers().length; avSet($("bbPal"), 0); return want }
    const q = fitPal(avMap(), palSize(), want, palAt); avSet($("bbPal"), q.ov); return { x: q.x, y: q.y };
  }
  function place(pos) { const p = $("bbPal"); palAt = pos; if (p) p.style.transform = `translate(${Math.round(pos.x)}px,${Math.round(pos.y)}px)`; placeMates() }
  // ===== Companion cats: up to two other cats from the household come along on screen. They sit beside the cat in
  // training, follow when he trots off, play their own games, cheer right answers, comfort him after a miss, and every
  // so often interact with him: a nuzzle, a chase around him, grooming, or a play-pounce. Tap one to open the Cats tab.
  const MATE_ACTS = ["yarn", "feather", "leaf", "tail", "butterfly"];
  let mates = [], mateT = 0, playT = 0;
  const mateSize = c => Math.round(baseSize() * sizeFor(c.pts) * .9 * userScale());
  // each companion can be dragged anywhere; its spot is saved in the household (H.spots), like Dexter's own spot
  const mateSpot = id => { const H = household(); return H.spots && H.spots[id] || null };
  function setMateSpot(id, v) { const H = household(); H.spots = H.spots || {}; if (v) H.spots[id] = v; else delete H.spots[id]; saveHouse(H) }
  function clearMates() { mates.forEach(m => m.el.remove()); mates = []; clearInterval(mateT); clearInterval(playT); mateT = playT = 0 }
  function refreshMates() {
    clearMates();
    if (!palOn || off()) return;
    const { H, list } = catList();
    H.along.forEach((id, i) => {
      const c = list.find(x => x.id === id); if (!c) return;
      if (isPrimate(c.breed) && !(window.COURSE && window.COURSE.id === "a102")) return;   // primates are ANTH 102's: they wait at the safari in other classes
      const el = document.createElement("button"); el.type = "button"; el.className = "bb-mate"; el.setAttribute("aria-label", `${c.nick || "Dexter"} is here too. Open your cats`);
      el.onclick = () => openPal("closet", null, id); document.body.appendChild(el);
      const me = { id }; el.title = `${c.nick || "Dexter"} · drag to move`;
      makeMovable(el, () => mateSize(c), (x, y) => { const m = mates.find(z => z.el === el); if (m) { m.at = { x, y }; el.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)` } }, {
        origin: () => { const m = mates.find(z => z.el === el); return m && m.at ? m.at : { x: 0, y: 0 } },
        drop: (x, y) => { setMateSpot(me.id, xySpot(x, y, mateSize(c))); const m = mates.find(z => z.el === el); if (m) { fx(el, ["📍"], 1); paintMate(m) } }
      });
      const free = [1, 2, 3, 4].filter(x => x !== palSlot && !mates.some(m => m.slot === x));
      mates.push({ c, el, i, co: H.co.includes(id), slot: free[0], act: MATE_ACTS[(i * 2 + Math.random() * MATE_ACTS.length | 0) % MATE_ACTS.length], pose: "sit", eyes: null, moving: false, face: -1 });
    });
    document.body.classList.toggle("bb-crowd", mates.length > 3);
    mates.forEach(paintMate); placeMates();
    if (mates.length) {
      mateT = setInterval(() => mates.forEach(m => { if (!m.busy && !m.moving) { m.act = act === "nap" ? "nap" : MATE_ACTS[Math.random() * MATE_ACTS.length | 0]; paintMate(m) } }), 17000);
      playT = setInterval(() => { Math.random() < .55 ? interact() : treeLife() }, 9000); setTimeout(interact, 4000);
    }
  }
  function paintMate(m) {
    const c = m.c, k = stageOf(c.pts | 0), sz = mateSize(c), a = act === "nap" && !m.busy ? "nap" : m.act;
    const pose = m.moving || m.pose === "stand" ? "stand" : a === "nap" || (treeBox && T_SLOTS[m.slot] && T_SLOTS[m.slot].pose === "lie") ? "lie" : "sit";
    m.el.style.setProperty("--ps", sz + "px");
    ACTS.concat("nap").forEach(x => m.el.classList.toggle("act-" + x, x === a && !m.moving && !m.busy));
    m.el.classList.toggle("moving", m.moving);
    const eyes = m.eyes || (m.moving ? "open" : a === "nap" ? "sleep" : ACT_EYES[a] || "open");
    m.el.innerHTML = `<span class="bb-palart">${art(k, c.equip || { badges: [] }, { breed: c.breed, color: c.color, collar: c.collar, w: c.weight, eyes, pose, flip: pose === "stand" && m.face > 0 })}</span><span class="bb-mname">${m.co ? "📚 " : ""}${esc(c.nick || "Dexter")}<span class="bb-mlv"> · Lv ${level(c.pts | 0)}</span></span>`;
    m.el.classList.toggle("co", !!m.co);
  }
  function matePos(m, at) {
    const own = mateSpot(m.c.id);
    if (own) { const q = spotXY(own, mateSize(m.c)), P = palAt || q; m.side = P.x >= q.x ? 1 : -1; m.pinned = true; return q }
    m.pinned = false;
    if (treeBox && m.slot != null) { const q = slotPos(m.slot, mateSize(m.c)), P = slotPos(palSlot, palSize()); m.side = P.x >= q.x ? 1 : -1; return q }
    const S = palSize(), sz = mateSize(m.c), A = at || palAt; if (!A) return null;
    // stand on the open side: to his right if there's room (on wide screens that's the margin, away from the questions)
    const free = mates.filter(z => !mateSpot(z.c.id)), k = Math.max(0, free.indexOf(m)), cnt = free.length || 1;
    const need = Math.min(cnt, 3) * sz * .8 + 8, side = innerWidth - (A.x + S) >= need ? 1 : A.x >= need ? -1 : (A.x + S / 2 > innerWidth / 2 ? -1 : 1);
    m.side = side;
    // with lots of cats out, wrap them into rows stacked above each other instead of running off the screen
    const gap = Math.max(sz * .74, cnt > 3 ? 48 : 0);   // room for the name tags when there's a crowd
    const room = side > 0 ? innerWidth - (A.x + S * .78) - 4 : A.x + sz * .22 - 4, per = Math.max(1, Math.min(cnt, Math.floor((room - sz) / gap) + 1));
    const col = k % per, row = Math.floor(k / per);
    const x = side < 0 ? A.x - sz * .78 - col * gap : A.x + S * .78 + col * gap;
    return { x: Math.min(Math.max(x, 4), innerWidth - sz - 4), y: Math.max(4, Math.min(A.y + S - sz + 2, innerHeight - sz - 4) - row * (sz + 10)) };
  }
  function placeMates(at) {
    const A = at || palAt, G = !avOff() && A && mates.length ? avCopy(avMap()) : null;
    if (G) { avTake(G, A.x, A.y, palSize()); mates.forEach(m => { if (m.busy === "chase" && m.at) avTake(G, m.at.x, m.at.y, mateSize(m.c)) }) }
    // the tower: each cat sits on the head of the one below, a little off-center either way so it looks piled up
    const S = palSize(), tower = A ? stackers().slice(0, stackN) : []; let top = A ? A.y : 0;
    tower.forEach((m, i) => { const sz = mateSize(m.c); top -= sz * .8; m.tower = { x: A.x + (S - sz) / 2 + (i % 2 ? 4 : -4), y: top, z: 59 + i } });
    mates.forEach(m => { if (!tower.includes(m)) m.tower = null; m.el.style.zIndex = m.tower ? m.tower.z : ""; m.el.classList.toggle("stk", !!m.tower) });
    if (G) tower.forEach(m => avTake(G, m.tower.x, m.tower.y, mateSize(m.c)));
    mates.forEach(m => { if (m.busy === "chase") return; let q = m.tower ? { x: m.tower.x, y: m.tower.y } : matePos(m, at);
      if (m.tower) { avSet(m.el, 0); m.side = q.x > A.x + (S - mateSize(m.c)) / 2 ? -1 : 1 }
      else if (q && G && !m.busy) { avSum(G); const sz = mateSize(m.c), f = avFind(G, sz, q, at ? null : m.at); q = { x: f.x, y: f.y }; avTake(G, q.x, q.y, sz); avSet(m.el, f.ov); m.side = A.x >= q.x ? 1 : -1 } else if (q && !G) avSet(m.el, 0);
      if (q) { m.at = q; m.el.style.transform = `translate(${Math.round(q.x)}px,${Math.round(q.y)}px)`; m.el.style.setProperty("--side", m.side) } }) }
  function matesMove(to) {   // trot after the cat in training (on the tree they stay home and watch)
    if (treeBox) return;
    const was = new Map(mates.map(m => [m, m.at])); placeMates(to);
    mates.forEach(m => { const a = was.get(m), q = m.at; if (!q || !a || Math.hypot(q.x - a.x, q.y - a.y) < 14) return; m.moving = true; m.face = q.x > a.x ? 1 : -1; paintMate(m);
      clearTimeout(m.walkT); m.walkT = setTimeout(() => { m.moving = false; paintMate(m) }, 1000 + m.i * 150) });
  }
  const fx = (el, chars, n = 3) => { const r = el.getBoundingClientRect(); for (let i = 0; i < n; i++) { const f = document.createElement("span"); f.className = "bb-fx"; f.textContent = chars[i % chars.length]; f.style.left = (r.left + r.width * (.3 + Math.random() * .4)) + "px"; f.style.top = (r.top + r.height * .15) + "px"; f.style.animationDelay = (i * .25) + "s"; document.body.appendChild(f); setTimeout(() => f.remove(), 2200) } };
  function busy(m, kind, ms, setup, done) {
    m.busy = kind; m.el.classList.add("i-" + kind); setup && setup(); paintMate(m);
    setTimeout(() => { m.el.classList.remove("i-" + kind); m.busy = null; m.eyes = null; m.pose = "sit"; done && done(); paintMate(m); placeMates() }, ms);
  }
  function interact() {
    const p = $("bbPal"); if (!p || !mates.length || visiting || moving || document.hidden || act === "nap") return;
    const m = mates[Math.random() * mates.length | 0]; if (m.busy || m.moving) return;
    if (treeBox && m.slot !== T_ADJ[palSlot]) { hopTo(m, T_ADJ[palSlot]); setTimeout(interact, 1300); return }   // come over first
    const kind = ["nuzzle", "chase", "groom", "pounce"][Math.random() * 4 | 0];
    p.style.setProperty("--side", -m.side);
    if (kind === "nuzzle") {   // lean in, heads touch, hearts
      busy(m, "nuzzle", 2600, () => { m.eyes = "happy"; p.classList.add("i-nuzzle"); setMood("happy", 2600); fx(m.el, ["💛", "💕", "💛"]) }, () => p.classList.remove("i-nuzzle"));
    } else if (kind === "groom") {   // a few licks on his head; he closes his eyes happily
      busy(m, "groom", 2600, () => { m.eyes = "focus"; setMood("happy", 2600); fx(p, ["✨", "💧", "✨"]) });
    } else if (kind === "pounce") {   // crouch, wiggle, play-pounce; he hops
      busy(m, "pounce", 2200, () => { m.pose = "stand"; m.face = m.side > 0 ? -1 : 1; m.eyes = "dilated"; setTimeout(() => { p.classList.remove("hop"); void p.offsetWidth; p.classList.add("hop"); setMood("wide", 900) }, 1300) });
    } else {   // chase: a lap behind and around him, while he watches
      busy(m, "chase", 2800, () => { m.pose = "stand"; m.face = m.side > 0 ? -1 : 1; m.eyes = "dilated"; setMood("dilated", 2800); m.el.style.setProperty("--run", (palSize() * 1.6 + mateSize(m.c)) + "px") });
    }
  }
  // hop to another floor of the tree (swapping with whoever is there)
  function hopTo(m, slot) {
    if (!treeBox || slot == null || m.slot === slot) return;
    if (slot === palSlot) return;
    const other = mates.find(x => x !== m && x.slot === slot);
    const leap = x => { x.el.classList.remove("leap"); void x.el.offsetWidth; x.el.classList.add("leap"); setTimeout(() => x.el.classList.remove("leap"), 900) };
    if (other) { other.slot = m.slot; leap(other) }
    m.slot = slot; leap(m); placeMates(); setTimeout(() => mates.forEach(paintMate), 450);
  }
  // now and then someone moves around the tree; two companions sometimes play together
  function treeLife() {
    if (!treeBox || !mates.length || visiting || moving || document.hidden || act === "nap") return;
    const r = Math.random(), taken = takenSlots(), free = [0, 1, 2, 3, 4].filter(x => !taken.has(x));
    if (mates.length > 1 && r < .35 && !mates[0].busy && !mates[1].busy) {   // the two companions play: swap floors with a bump and hearts
      const [a, b2] = mates; const sa = a.slot; hopTo(a, b2.slot); if (b2.slot === sa || b2.slot === a.slot) { } fx(a.el, ["💞", "✨"], 2); fx(b2.el, ["😺"], 1); return;
    }
    if (r < .75 && free.length) { const m = mates[Math.random() * mates.length | 0]; if (!m.busy) hopTo(m, free[Math.random() * free.length | 0]); return }
    if (free.length && !$("bbPal").classList.contains("drag")) { palSlot = free[Math.random() * free.length | 0]; settle(); setTimeout(() => { if (Math.random() < .5) { palSlot = 0 === palSlot ? 0 : (takenSlots().has(0) ? palSlot : 0); settle() } }, 9000) }
  }
  function mateReact(good) {
    mates.forEach((m, i) => { if (m.busy) return;
      if (good) { m.eyes = "happy"; m.el.classList.remove("hop"); void m.el.offsetWidth; m.el.classList.add("hop"); paintMate(m); setTimeout(() => { m.eyes = null; m.el.classList.remove("hop"); paintMate(m) }, 1500) }
      else if (i === 0) busy(m, "nuzzle", 2000, () => { m.eyes = "sad"; const p = $("bbPal"); if (p) { p.style.setProperty("--side", -m.side); p.classList.add("i-nuzzle") } fx(m.el, ["💗"], 1) }, () => { const p = $("bbPal"); if (p) p.classList.remove("i-nuzzle") });   // a comforting nuzzle
    });
  }
  addEventListener("resize", () => { mates.forEach(paintMate); placeMates() });
  function settle() {
    if (!palOn || visiting) return;
    const h = home(); if (palAt && Math.abs(h.x - palAt.x) < 1 && Math.abs(h.y - palAt.y) < 1) return;
    if (!palAt || document.body.classList.contains("bb-scrolling")) place(h); else walkTo(h);
  }
  function checkPal() {
    if (off()) { palOn = false; const p = $("bbPal"); if (p) p.remove(); document.body.classList.remove("bb-palon"); clearMates(); layoutTree(); return }
    if (!palOn && document.querySelector(".opt")) { palOn = true; document.body.classList.add("bb-palon"); paintPal(); place(home()); refreshMates() }
  }
  function paintPal() {
    if (!palOn || off()) return;
    const s = load(), k = stageOf(s.pts), mult = XP() ? XP().multiplier(s.streak) : 1;
    let p = $("bbPal");
    if (!p) { p = document.createElement("button"); p.id = "bbPal"; p.type = "button"; p.className = "bb-pal"; p.onclick = () => openPal("closet", null, household().active); document.body.appendChild(p); makeMovable(p, palSize, (x, y) => place({ x, y })); if (palAt) place(palAt) }
    p.style.setProperty("--ps", palSize() + "px");
    p.setAttribute("aria-label", `Study buddy ${name(s)}, level ${level(s.pts)}, ${ACT_LABEL[act]}. Open closet and shop`); p.title = `${name(s)} is ${ACT_LABEL[act]} · drag to move him`;
    ACTS.concat("nap").forEach(a => p.classList.toggle("act-" + a, a === act));
    const pose = moving ? "stand" : treeBox && T_SLOTS[palSlot].pose === "lie" && act !== "box" ? "lie" : ACT_POSE[act] || "sit";
    ["sit", "stand", "lie"].forEach(x => p.classList.toggle("pose-" + x, x === pose)); p.classList.toggle("moving", moving);
    p.innerHTML = `<span class="bb-toy">${TOYS[act]}</span><span class="bb-palart">${art(k, null, { eyes: moving && !mood ? "open" : eyesNow(k), pose, flip: pose === "stand" && facing > 0, boxed: act === "box" && !moving })}</span>${act === "box" ? `<span class="bb-boxfront">${BOX_FRONT}</span>` : ""}<span class="bb-lv">Lv ${level(s.pts)}</span>${s.streak >= 3 ? `<span class="bb-streak" title="${s.streak} right in a row">${FLAME}×${mult}</span>` : ""}`;
  }
  // When she picks an answer, Dexter scurries to it (beside it on wide screens, peeking over its edge on phones)
  function visit() {
    const p = $("bbPal"); if (!palOn || !p || !lastOpt || Date.now() - lastOptAt > 2000 || !document.contains(lastOpt) || (anchored() && getSpot())) return;
    const S = palSize(), r = lastOpt.getBoundingClientRect(), card = questionCard(), cr = card ? card.getBoundingClientRect() : null;
    const pos = cr && cr.right + S + 28 <= innerWidth ? { x: cr.right + 16, y: r.top + r.height / 2 - S * .6 } : { x: Math.min(r.right - S * .8, innerWidth - S - 6), y: r.top + r.height / 2 - S * .85 };
    pos.y = Math.min(Math.max(pos.y, 8), innerHeight - S - 8);
    if (!avOff()) {   // the answer's own empty space is fine to perch on, just not its words
      const G = avCopy(avMap(true)), W = G.W, y0 = Math.max(0, Math.floor(r.top / CELL)), y1 = Math.min(G.H, Math.ceil(r.bottom / CELL)), x0 = Math.max(0, Math.floor(r.left / CELL)), x1 = Math.min(W, Math.ceil(r.right / CELL));
      for (let y = y0; y < y1; y++) G.g.fill(0, y * W + x0, y * W + x1);
      const rg = document.createRange(), tw = document.createTreeWalker(lastOpt, NodeFilter.SHOW_TEXT); let t;
      while ((t = tw.nextNode())) { if (!/\S/.test(t.data)) continue; rg.selectNodeContents(t); for (const q of rg.getClientRects()) for (let y = Math.max(0, Math.floor((q.top - 3) / CELL)); y <= Math.min(G.H - 1, Math.floor((q.bottom + 3) / CELL)); y++) G.g.fill(1, y * W + Math.max(0, Math.floor((q.left - 3) / CELL)), y * W + Math.min(W, Math.floor((q.right + 3) / CELL) + 1)) }
      lastOpt.querySelectorAll("svg,img").forEach(e => { const q = e.getBoundingClientRect(); for (let y = Math.max(0, Math.floor(q.top / CELL)); y <= Math.min(G.H - 1, Math.floor(q.bottom / CELL)); y++) G.g.fill(1, y * W + Math.max(0, Math.floor(q.left / CELL)), y * W + Math.min(W, Math.floor(q.right / CELL) + 1)) });
      // he dashes over on his own; the tower hops down and waits beside him, then stacks back up when he's home
      const f = avFind(avSum(G), S, pos, null); stackN = 0; pos.x = f.x; pos.y = f.y; avSet(p, f.ov);
    }
    clearTimeout(visiting); p.classList.remove("run"); void p.offsetWidth; p.classList.add("run");
    moving = true; facing = palAt && pos.x > palAt.x + 2 ? 1 : -1; paintPal(); matesMove(pos); place(pos);
    setTimeout(() => { if (visiting) { moving = false; paintPal() } }, 650);   // arrives: back to his game's pose to react
    visiting = setTimeout(() => { visiting = 0; p.classList.remove("run"); settle() }, 2300);
  }
  // ===== Moving Dexter: she can drag him (or use arrow keys) anywhere and he stays there. Saved on this device as a
  // fraction of the screen, so the spot survives resizing and rotating; Progress has a button to let him roam again.
  const SPOT_KEY = KEY + "-spot", PAD = 8;
  function getSpot() { try { const v = JSON.parse(localStorage.getItem(SPOT_KEY) || "null"); return v && isFinite(v.fx) && isFinite(v.fy) ? v : null } catch (e) { return null } }
  function setSpot(v) { try { v ? localStorage.setItem(SPOT_KEY, JSON.stringify(v)) : localStorage.removeItem(SPOT_KEY) } catch (e) { } const d = $("bbDock"); if (d) dockSpot(d); clearTimeout(visiting); visiting = 0; settle() }
  const c01 = v => Math.min(1, Math.max(0, v));
  const spotXY = (sp, S) => ({ x: PAD + sp.fx * Math.max(0, innerWidth - S - 2 * PAD), y: PAD + sp.fy * Math.max(0, innerHeight - S - 2 * PAD) });
  const xySpot = (x, y, S) => ({ fx: c01((x - PAD) / Math.max(1, innerWidth - S - 2 * PAD)), fy: c01((y - PAD) / Math.max(1, innerHeight - S - 2 * PAD)) });
  const clampXY = (x, y, S) => ({ x: Math.min(Math.max(x, PAD), innerWidth - S - PAD), y: Math.min(Math.max(y, PAD), innerHeight - S - PAD) });
  function dockSpot(d) {
    const sp = getSpot();
    if (!sp) { d.style.left = d.style.top = d.style.right = d.style.bottom = ""; return }
    const q = spotXY(sp, 64); d.style.left = q.x + "px"; d.style.top = q.y + "px"; d.style.right = d.style.bottom = "auto";
  }
  function makeMovable(el, size, moveTo, opts = {}) {
    let g = null, dragged = 0;
    el.addEventListener("pointerdown", e => {
      if (e.button) return;
      e.preventDefault();   // no text selection or native link drag from what's under him (a tap still clicks)
      const o = opts.origin ? opts.origin() : el.id === "bbPal" && palAt ? palAt : { x: el.offsetLeft, y: el.offsetTop };   // layout box, ignoring any scale
      g = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: o.x, oy: o.y, moved: false };
      try { el.setPointerCapture(e.pointerId) } catch (err) { }   // keep getting moves even when a fast flick leaves him behind
    });
    el.addEventListener("pointermove", e => {
      if (!g || e.pointerId !== g.id) return;
      const dx = e.clientX - g.sx, dy = e.clientY - g.sy;
      if (!g.moved) {
        if (Math.hypot(dx, dy) < 8) return;   // a tap still opens the Closet; only a real drag moves him
        g.moved = true;
        if (!opts.drop) { clearTimeout(visiting); visiting = 0 } el.classList.add("drag", "run");
      }
      const q = clampXY(g.ox + dx, g.oy + dy, size()); g.x = q.x; g.y = q.y; moveTo(q.x, q.y);
    });
    const end = e => {
      if (!g || e.pointerId !== g.id) return;
      const was = g; g = null;
      if (!was.moved) return;
      dragged = Date.now(); el.classList.remove("drag", "run");
      if (was.x !== undefined) { if (opts.drop) opts.drop(was.x, was.y); else { setSpot(xySpot(was.x, was.y, size())); say("I'll sit here!") } }
    };
    el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
    el.addEventListener("dragstart", e => e.preventDefault());   // no native drag-and-drop ghost (it would cancel our drag)
    el.addEventListener("click", e => { if (Date.now() - dragged < 400) { e.stopImmediatePropagation(); e.preventDefault() } }, true);
    el.addEventListener("keydown", e => {   // arrow keys nudge him (Shift for bigger steps)
      const k = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key]; if (!k) return;
      e.preventDefault(); e.stopPropagation();
      const S = size(), o = opts.origin ? opts.origin() : el.id === "bbPal" && palAt ? palAt : { x: el.offsetLeft, y: el.offsetTop }, step = e.shiftKey ? 80 : 24;
      const q = clampXY(o.x + k[0] * step, o.y + k[1] * step, S); moveTo(q.x, q.y); (opts.drop ? opts.drop(q.x, q.y) : setSpot(xySpot(q.x, q.y, S)));
    });
  }
  let lastQ = 0, qT = 0;
  const queue = () => { if (rafQ) return; rafQ = requestAnimationFrame(() => { rafQ = 0; const now = Date.now(); clearTimeout(qT);
    if (now - lastQ < 180) { qT = setTimeout(queue, 190 - (now - lastQ)); return } lastQ = now; checkPal(); settle(); if (palOn && !visiting) placeMates() }) };
  document.addEventListener("click", e => { const o = e.target.closest && e.target.closest(".opt"); if (o) { lastOpt = o; lastOptAt = Date.now() } }, true);
  addEventListener("scroll", queue, { passive: true }); addEventListener("resize", () => { paintPal(); const d = $("bbDock"); if (d) dockSpot(d); queue() });
  new MutationObserver(queue).observe(document.documentElement, { childList: true, subtree: true });

  // ===== Greeting: once per visit, Dexter walks in and says hello, then heads to his spot
  const GREET_KEY = KEY + "-greeted";
  function greet() {
    if (off()) return;
    try { if (sessionStorage.getItem(GREET_KEY)) return; sessionStorage.setItem(GREET_KEY, "1") } catch (e) { return }
    const s = load(), k = stageOf(s.pts), nm = name(s), h = new Date().getHours(), L = level(s.pts), nx = nextAt(k);
    const hello = h < 5 ? "Up late studying?" : h < 12 ? "Good morning!" : h < 18 ? "Good afternoon!" : "Good evening!";
    let line;
    if (!s.correct && !s.pts) line = `Hi, I'm ${nm}! Answer questions and I'll grow up with you. Every right answer earns XP, and gold for my closet.`;
    else {
      let days = null; try { const ex = window.BioSettings && window.BioSettings.examDate && window.BioSettings.examDate(); if (ex) days = Math.ceil((ex - Date.now()) / 864e5) } catch (e) { }
      const tip = days !== null && days >= 0 && days <= 7 ? (days === 0 ? "Your exam is today. You've got this!" : `${days} day${days === 1 ? "" : "s"} until your exam. Let's practice!`)
        : nx !== null && nx - s.pts <= 80 ? `Only ${fmt(nx - s.pts)} XP until I evolve!`
        : s.gold >= 60 ? `You have ${fmt(s.gold)} gold. Want to dress me up?`
        : `${fmt(lvXP(L + 1) - s.pts)} XP to Level ${L + 1}. Let's go!`;
      line = `${hello} Welcome back. ${tip}`;
    }
    const g = document.createElement("div"); g.className = "bb-greet"; g.setAttribute("role", "status");
    g.innerHTML = `<div class="gwrap"><div class="gbubble"><b>${esc(nm)}</b><span>${esc(line)}</span><button type="button" class="gbtn">Let's study!</button></div><button type="button" class="gdex" style="transform-origin:50% 100%;scale:${sizeFor(s.pts).toFixed(2)}" aria-label="Close the greeting">${art(k, null, { eyes: "happy" })}</button></div>`;
    document.body.appendChild(g); document.body.classList.add("bb-greeting");
    let gone = false;
    const leave = () => { if (gone) return; gone = true; g.classList.add("leave"); setTimeout(() => { g.remove(); document.body.classList.remove("bb-greeting") }, 600) };
    g.querySelector(".gbtn").onclick = leave; g.querySelector(".gdex").onclick = leave;
    setTimeout(leave, 8000);
  }

  function setEnabled(on) { try { on ? localStorage.removeItem(OFF_KEY) : localStorage.setItem(OFF_KEY, "1") } catch (e) { } paintDock() }
  window.addEventListener("bio:correct", gain);
  window.addEventListener("bio:wrong", miss);
  window.addEventListener("bio:correct", () => mateReact(true));
  window.addEventListener("bio:wrong", () => mateReact(false));

  function mount() { const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st); syncBadges(); paintDock(); greet() }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
  // who's in the café right now, drawn for the storefront windows on the landing page
  function cafeWindow(n = 6) {
    const R = cafeResidents(), mine = R.filter(r => r.mine), g = R.filter(r => !r.mine), d = Math.floor(Date.now() / 864e5) % Math.max(1, g.length);
    const pick = mine.concat(g.slice(d), g.slice(0, d)).slice(0, n), eyes = ["happy", "open", "wide", "sleepy", "happy", "open"];
    return { count: R.length, cats: pick.map((r, i) => ({ mine: !!r.mine, nick: r.nick || "", name: breedName(r.breed, r.color),
      svg: art(stageOf(r.pts | 0), r.equip || { badges: [] }, { breed: r.breed, color: r.color, collar: r.collar || "navy", w: r.weight || 1, eyes: eyes[i % eyes.length], pose: i === 2 ? "lie" : "sit", plain: !r.mine }) })) };
  }
  window.BioBuddy = { openCafe: () => openCafe(), openSafari: () => openCafe("safari"), safariOpen, cafeWindow, showLv, setShowLv, size: userScale, setSize, anchored, setAnchored, enabled: () => !off(), setEnabled, soundOn, setSound, open: openCard, openShop, openBadges, syncBadges, play: a => setAct(a), activity: () => act, art, STAGES, state: load, level };
})();

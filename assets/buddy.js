// ANTH 104 Drills · Study buddy
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
    return H;
  }
  const saveHouse = H => { try { localStorage.setItem(CATS_KEY, JSON.stringify(H)) } catch (e) { } };
  function catList() {   // every cat, the one in training with its live state
    const H = household(), s = load();
    H.cats[H.active] = Object.assign({}, H.cats[H.active], pickCat(s));
    return { H, list: Object.entries(H.cats).map(([id, c]) => Object.assign({ id, active: id === H.active, along: H.along.includes(id), co: H.co.includes(id) }, c)) };
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
  function adoptCat(breed, nick, color) {
    const H = household(); if (Object.keys(H.cats).length >= MAX_CATS) return null;
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
  // older saves used one key per coat; map them to breed + color
  const LEGACY = { golden: ["domestic", "golden"], orange: ["tabby", "orange"], silver: ["tabby", "silver"], black: ["bombay", "black"], tuxedo: ["tuxedo", "black"], siamese: ["siamese", "seal"], calico: ["calico", "classic"], russian: ["russian", "blue"], snow: ["persian", "white"] };
  function resolveBreed(breed, color) {
    if (LEGACY[breed] && !BREEDS[breed]) { const [b, c] = LEGACY[breed]; return [b, BREEDS[b].colors[color] ? color : c] }
    const b = BREEDS[breed] ? breed : "domestic", cs = BREEDS[b].colors;
    return [b, cs[color] ? color : Object.keys(cs)[0]];
  }
  const breedName = (breed, color) => { const [b, c] = resolveBreed(breed, color); const B = BREEDS[b]; return Object.keys(B.colors).length > 1 && b !== "domestic" ? `${B.colors[c].name} ${B.name}` : b === "domestic" ? `${B.colors[c].name} ${B.name}` : B.name };
  let SHAPE = {};
  function setCoat(breed, color) {
    const [b, c] = resolveBreed(breed, color), B = BREEDS[b], C = B.colors[c];
    [FUR, FUR_D, FUR_L] = C.fur; [PINK, PINK_D] = C.pink; IRIS = C.eyes; SHAPE = B.shape || {};
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
      <path d="M${x + m(-6.6)} ${y - 6.4} Q${x} ${y - 5.4} ${x + m(6.6)} ${y - 6.4} L${x + m(6.6)} ${y - 2 + dI} Q${x} ${y - 3.2 + (dO + dI) / 2} ${x + m(-6.6)} ${y - 2 + dO}Z" fill="${FUR}"/><path d="M${x + m(-7.2)} ${y - 1.6 + dO} Q${x} ${y - 3.6 + (dO + dI) / 2} ${x + m(7.4)} ${y - 1.2 + dI}" stroke="${OL}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
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
  function furTail(d, w2) { w2 = SHAPE.tail || w2; return `<path d="${d}" stroke="${OL}" stroke-width="${w2 + 4.4}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${FUR}" stroke-width="${w2}" fill="none" stroke-linecap="round"/>` }
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
  function drawHead(u, o) {
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
    const P = pose === "stand" ? standBody(o, w, u) : pose === "lie" ? lieBody(o, w, u) : sitBody(o, w);
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
    let out = (it && it.collar ? "" : collar(collarHex(collarKey))) + (it ? it.svg : "");
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
.sh-tabs.pal{margin:2px 16px 10px;--tabs:5}.sh-tabs.pal button{font-size:13.5px;padding:7px 2px}
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
      <p class="bb-sub">Level ${L} of ${MAX_LV} · ${esc(st.form)} · ${esc(stageName(k, s))} · ${esc(breedName(s.breed, s.color))}</p>
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
      <div class="bb-spot"><b>Where ${esc(name(s))} sits</b>${anchored() && getSpot() ? `Anchored right where you put him. He stays there, even when you pick an answer.` : getSpot() ? `Right where you put him. He still runs over to each answer you pick, then goes back to his spot.` : `Next to your questions. He runs over to each answer you pick.`}<small>Drag ${esc(name(s))} anywhere on the screen to move him (or focus him and use the arrow keys). Each companion cat can be dragged to its own spot too.</small>
        <label class="bb-size"><span>Size</span><input type="range" id="bbSize" min="60" max="180" step="10" value="${Math.round(userScale() * 100)}" aria-label="Cat size"><output id="bbSizeOut">${Math.round(userScale() * 100)}%</output></label>
        <label class="pf-tog pf-prog"><span>Anchor him in place (he won't run to your answers)</span><input type="checkbox" id="bbAnchor"${anchored() ? " checked" : ""}></label>
        ${getSpot() ? `<button type="button" id="bbSpotReset">Put him back beside my questions</button>` : ""}</div>

      <label class="pf-tog pf-prog"><span>Show levels on the cats on screen</span><input type="checkbox" id="pgShowLv"${showLv() ? " checked" : ""}></label>
      <div class="bb-acts"><button type="button" id="bbRename">Rename</button><button type="button" id="bbHide">Hide buddy</button></div>
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
      const { H, list } = catList(), n = list.length, full = n >= MAX_CATS;
      return `<p class="ct-h">Your cats<small>The cat in training earns XP from your answers. Any of your other cats can come along on screen too. Tick <b>Co-train</b> to train several at once: each answer's XP is split evenly between them.</small></p>
        <div class="ct-list">${list.map(c => { const k2 = stageOf(c.pts | 0); return `<div class="ct-cat${c.active ? " on" : ""}">
          ${art(k2, c.equip || { badges: [] }, { breed: c.breed, color: c.color, collar: c.collar, w: c.weight, eyes: "happy", plain: true })}
          <span><b>${esc(c.nick || "Dexter")}</b><small>${esc(breedName(c.breed, c.color))} · Lv ${level(c.pts | 0)} · ${esc(STAGES[k2].form)}</small></span>
          <span class="ct-btns"><button type="button" class="ct-dress" data-dressgo="${c.id}" aria-label="Dress ${esc(c.nick || "Dexter")}">👗 Dress</button>${c.active ? `<span class="ct-tag">✓ Training</span>${H.co.length ? `<span class="ct-split">XP split ${H.co.length + 1} ways</span>` : ""}` : `<button type="button" class="sh-act" data-train="${c.id}">Train</button>
            <label class="ct-along"><input type="checkbox" data-along="${c.id}"${c.along ? " checked" : ""}${!c.along && H.along.length >= MAX_ALONG ? " disabled" : ""}> On screen</label>
            <label class="ct-along ct-co"><input type="checkbox" data-co="${c.id}"${c.co ? " checked" : ""}${c.along ? "" : " disabled"}> 📚 Co-train</label>${c.along && H.spots && H.spots[c.id] ? `<button type="button" class="ct-unpin" data-unpin="${c.id}">↺ Back beside him</button>` : ""}`}</span></div>` }).join("")}</div>
        <button type="button" class="ct-cafe" id="ctCafe"><span class="ic" aria-hidden="true">☕</span><span><b>Visit the Cat Café</b><small>${full ? `Your home is full (${MAX_CATS} cats), but your cats love to hang out here.` : "Meet cats of every breed, pick a coat color, and bring one home to study."}</small></span><i aria-hidden="true">›</i></button>`;
    }
    // Badge case: one badge per Read & Learn chapter, like a trainer's case. Earned badges can be pinned on Dexter.
    function badgesHTML(s) {
      const B = W.ITEMS.filter(i => i.slot === "badge"), got = B.filter(i => s.owned.includes(i.id));
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
      const body = st.tab === "cats" ? catsHTML() : st.tab === "progress" || !W ? progressHTML(s) : st.tab === "shop" ? shopHTML(s) : st.tab === "badges" ? badgesHTML(load()) : closetHTML(d, stageOf(d.pts));
      shop.innerHTML = `<div class="bb-card bb-shop${st.opened ? " still" : ""}" role="dialog" aria-modal="true" aria-labelledby="shTitle">
        <div class="sh-head"><h3 id="shTitle">${esc(name(d || s))}</h3><span class="sh-gold" aria-label="${s.gold} gold">${COIN}${fmt(s.gold)}</span><button type="button" class="sh-done" id="shDone">Done</button></div>
        <div class="sh-tabs pal" role="tablist">${[["cats", "Cats"], ["closet", "Closet"], ["shop", "Shop"], ["badges", "Badges"], ["progress", "Progress"]].map(([key, label]) => `<button type="button" role="tab" aria-selected="${st.tab === key}" data-tab="${key}">${label}</button>`).join("")}</div>
        ${d ? `${dressPicker()}<div class="sh-stage cl-stage" style="--dz:${sizeFor(d.pts).toFixed(2)}">${many ? `<button type="button" class="cl-arrow l" data-step="-1" aria-label="Previous cat">‹</button>` : ""}<span class="cl-who">${dressArt(d, "wide")}</span>${many ? `<span class="cl-name">Dressing <b>${esc(name(d))}</b></span><button type="button" class="cl-arrow r" data-step="1" aria-label="Next cat">›</button>` : ""}</div>`
          : st.tab === "progress" || st.tab === "cats" ? "" : `<div class="sh-stage" style="--dz:${sizeFor(s.pts).toFixed(2)}">${art(k, st.tab === "shop" ? st.tryEq : s.equip, { eyes: "wide" })}</div>`}
        ${d ? statsHTML(d) + `<p class="sh-cap pf-acc">Accessories &amp; looks</p>` : ""}
        ${body}
      </div>`;
      $("shDone").onclick = closeShop;
      shop.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => { st.tab = b.dataset.tab; st.sel = null; st.tryEq = Object.assign({}, load().equip); paint(); shop.querySelector(".bb-shop").scrollTop = 0 });
      shop.querySelectorAll("[data-sub]").forEach(b => b.onclick = () => keepScroll(() => { st.sub = b.dataset.sub; st.sel = null; st.tryEq = Object.assign({}, load().equip); paint() }));
      if (st.tab === "progress") {
        $("bbRename").onclick = () => { const n = prompt("Name your study buddy:", s.nick || "Dexter"); if (n === null) return; const t = load(); t.nick = n.trim().slice(0, 24); save(t); paintDock(); paint() };
        $("bbHide").onclick = () => { setEnabled(false); closeShop() };
        if ($("pgShowLv")) $("pgShowLv").onchange = e => { setShowLv(e.target.checked); refreshMates() };
        if ($("bbSize")) $("bbSize").oninput = e => { $("bbSizeOut").textContent = e.target.value + "%"; setSize(e.target.value / 100) };
        if ($("bbAnchor")) $("bbAnchor").onchange = e => { setAnchored(e.target.checked); paint() };
        if ($("bbSpotReset")) $("bbSpotReset").onclick = () => { setAnchored(false); setSpot(null); const H = household(); H.spots = {}; saveHouse(H); paint(); placeMates() };
        return;
      }
      if (st.tab === "cats") {
        shop.querySelectorAll("[data-dressgo]").forEach(b => b.onclick = () => { st.dress = b.dataset.dressgo; st.tab = "closet"; paint(); shop.querySelector(".bb-shop").scrollTop = 0 });
        shop.querySelectorAll("[data-train]").forEach(b => b.onclick = () => keepScroll(() => { trainCat(b.dataset.train); paint(); paintDock(); refreshMates() }));
        shop.querySelectorAll("[data-unpin]").forEach(b => b.onclick = () => keepScroll(() => { setMateSpot(b.dataset.unpin, null); paint(); placeMates() }));
        shop.querySelectorAll("[data-along]").forEach(b => b.onchange = () => keepScroll(() => { const H = household(); const id = b.dataset.along; H.along = b.checked ? H.along.concat(id).slice(0, MAX_ALONG) : H.along.filter(x => x !== id); H.co = H.co.filter(x => H.along.includes(x)); saveHouse(H); paint(); refreshMates() }));
        shop.querySelectorAll("[data-co]").forEach(b => b.onchange = () => keepScroll(() => { const H = household(); const id = b.dataset.co; H.co = b.checked ? H.co.filter(x => x !== id).concat(id) : H.co.filter(x => x !== id); saveHouse(H); paint(); refreshMates() }));
        $("ctCafe").onclick = () => { closeShop(); openCafe() };
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
    { x: 278, y: 591, z: 40, pose: "sit", tree: 1, inside: 1 }
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
    <rect x="-1440" width="3240" height="400" fill="url(#cfWall)"/><rect x="-1440" width="3240" height="300" fill="url(#cfPaw)"/>
    <rect x="-1440" y="300" width="3240" height="100" fill="#d3a679"/><path d="M-1440 300 H1800" stroke="#8a5a32" stroke-width="4"/>${[-1422, -1332, -1242, -1152, -1062, -972, -882, -792, -702, -612, -522, -432, -342, -252, -162, -72, 18, 108, 198, 288, 378, 468, 558, 648, 738, 828, 918, 1008, 1098, 1188, 1278, 1368, 1458, 1548, 1638].map(x => `<rect x="${x}" y="314" width="66" height="72" rx="4" fill="none" stroke="#b9875a" stroke-width="2.4"/>`).join("")}
    <rect x="-1440" y="400" width="3240" height="240" fill="url(#cfFloor)"/>${[430, 470, 515, 565, 620].map(y => `<path d="M-1440 ${y} H1800" stroke="#b07c4a" stroke-width="1.4" opacity=".6"/>`).join("")}${[60, 150, 250, 330].map((x, i) => `<path d="M${x} ${400 + i * 10} v30" stroke="#b07c4a" stroke-width="1.2" opacity=".5"/>`).join("")}
    ${(() => {   // only seen on wide screens, where the café fills the screen: more room to either side
      const win = x => `<g transform="translate(${x} 0)"><rect x="0" y="80" width="120" height="160" rx="10" fill="#9fd0f2" stroke="#8a5a32" stroke-width="7"/><rect x="0" y="180" width="120" height="60" fill="#ffc9a0" opacity=".7"/><path d="M60 80 V240 M0 160 H120" stroke="#8a5a32" stroke-width="4"/><rect x="-8" y="236" width="136" height="12" rx="4" fill="url(#cfWood)" stroke="#3a2a1e" stroke-width="2"/><g transform="translate(100 236)"><path d="M-9 0 L-7 -14 H7 L9 0Z" fill="#d9774a" stroke="#3a2a1e" stroke-width="1.8"/><circle cy="-24" r="11" fill="#5ea85a" stroke="#3a2a1e" stroke-width="1.6"/><circle cx="-4" cy="-27" r="2.2" fill="#ff8fb3"/></g></g>`;
      const frame = (x, y, c) => `<g transform="translate(${x} ${y})"><rect width="54" height="42" rx="3" fill="#8a5a32" stroke="#3a2a1e" stroke-width="1.8"/><rect x="5" y="5" width="44" height="32" fill="${c}"/><path d="M14 30 l6 -9 l6 9 M30 30 l6 -9 l6 9" fill="#3a2a1e" opacity=".55"/><ellipse cx="27" cy="31" rx="13" ry="4" fill="#3a2a1e" opacity=".55"/></g>`;
      const plant = x => `<g transform="translate(${x} 400)"><path d="M-16 0 L-12 -30 H12 L16 0Z" fill="#d9744a" stroke="#3a2a1e" stroke-width="2"/><path d="M0 -30 Q-26 -70 -12 -96 M0 -30 Q4 -80 18 -100 M0 -30 Q24 -60 30 -78 M0 -30 Q-14 -50 -30 -60" stroke="#4f9a4a" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
      const lamp = x => `<g transform="translate(${x} 0)"><path d="M0 0 V40" stroke="#3a2a1e" stroke-width="2"/><path d="M-16 58 Q0 34 16 58Z" fill="#ffd36e" stroke="#3a2a1e" stroke-width="2"/><circle cy="70" r="26" fill="url(#cfGlow)"/></g>`;
      return [-180, -560, -940, 420, 800, 1180].map(win).join("") + [[-300, 110, "#ffd9b0"], [-680, 150, "#cfe8ff"], [-1060, 110, "#ffe4ec"], [560, 150, "#d7f5d0"], [940, 110, "#ffe9a8"], [1320, 150, "#e8dcff"]].map(f => frame(...f)).join("")
        + [-40, -420, -800, -1180, 400, 780, 1160, 1540].map(plant).join("") + [-90, -470, -850, 450, 830, 1210].map(lamp).join("");
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
  function cafeResidents() {
    const { list } = catList(), chill = list.filter(c => !c.active && !c.along).slice(0, 3);
    const day = Math.floor(Date.now() / 864e5);
    const guests = [0, 1].flatMap(n => Object.keys(BREEDS).map((b, i) => { const cs = Object.keys(BREEDS[b].colors); return { guest: true, breed: b, color: cs[(day + i + n) % cs.length], nick: "", pts: n ? 150 + i * 90 : 0 } }));
    return chill.map(c => Object.assign({ mine: true }, c)).concat(guests).slice(0, CAFE_SPOTS.length - 3);
  }
  let cafe = null;
  function openCafe() {
    if (cafe) cafe.remove();
    const R = cafeResidents(), spots = CAFE_SPOTS.map((_, i) => i), tree = spots.filter(i => CAFE_SPOTS[i].tree), rest = spots.filter(i => !CAFE_SPOTS[i].tree);
    const order = tree.sort(() => Math.random() - .5).slice(0, 3).concat(rest.sort(() => Math.random() - .5), tree.slice(3));
    R.forEach((r, i) => { r.spot = order[i] });
    cafe = document.createElement("div"); cafe.className = "cf-veil"; cafe.setAttribute("role", "dialog"); cafe.setAttribute("aria-modal", "true"); cafe.setAttribute("aria-label", "The Cat Café");
    cafe.innerHTML = `<div class="cf-room"><div class="cf-top"><span><b>☕ The Cat Café</b><small>Tap a cat to meet them</small></span><button type="button" class="cf-x" aria-label="Leave the café">✕</button></div>
      <svg class="cf-scene" viewBox="0 0 360 640" preserveAspectRatio="${innerWidth >= 900 ? "xMidYMax meet" : "xMidYMax slice"}">${CAFE_SCENE}<g transform="translate(246 462) scale(.56)">${TREE_SVG.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "")}</g>${CAFE_WALL}${CAFE_TOYS}<defs><clipPath id="cfHole"><circle cx="277.9" cy="572.9" r="10.4"/></clipPath></defs><g class="cf-cats"></g><g class="cf-fx"></g></svg>
      <div class="cf-sheet" hidden></div></div>`;
    document.body.appendChild(cafe);
    const G = cafe.querySelector(".cf-cats"), sheet = cafe.querySelector(".cf-sheet");
    const drawCat = (r, walking) => {
      const sp = CAFE_SPOTS[r.spot], pose = walking ? "stand" : sp.pose, k = stageOf(r.pts | 0);
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
      const sp = CAFE_SPOTS[r.spot]; g.style.transform = `translate(${sp.x}px,${sp.y}px) scale(${sp.z / 80})`; g.innerHTML = drawCat(r); if (sp.act) g.classList.add("act-" + sp.act);
      const w = document.createElementNS("http://www.w3.org/2000/svg", "g"); if (sp.inside) w.setAttribute("clip-path", "url(#cfHole)"); w.appendChild(g); G.appendChild(w); r.g = g; r.w = w;
      const open = () => meet(r); g.addEventListener("click", open); g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open() } });
    });
    // life in the café: cats wander between spots, blink, and chirp
    const free = () => CAFE_SPOTS.map((_, i) => i).filter(i => !R.some(r => r.spot === i));
    const bubble = (r, text) => { if (!cafe) return; const sp = CAFE_SPOTS[r.spot], t = document.createElementNS("http://www.w3.org/2000/svg", "g"); t.setAttribute("class", "cf-bub"); t.innerHTML = `<rect x="${sp.x - 22}" y="${sp.y - sp.z - 18}" width="44" height="16" rx="8" fill="#fff" stroke="#3a2a1e" stroke-width="1.2"/><text x="${sp.x}" y="${sp.y - sp.z - 7}" font-size="9" font-weight="700" text-anchor="middle" font-family="-apple-system,sans-serif" fill="#3a2a1e">${text}</text>`; cafe.querySelector(".cf-fx").appendChild(t); setTimeout(() => t.remove(), 2200) };
    const life = setInterval(() => {
      if (!cafe || !document.body.contains(cafe)) { clearInterval(life); return }
      if (!sheet.hidden) return;
      const ins = R.find(x => CAFE_SPOTS[x.spot].inside), r = ins && Math.random() < .25 ? ins : R[Math.random() * R.length | 0];   // the cat in the house comes out now and then
      if (r === ins || Math.random() < .55) { const f = free(); if (!f.length) return; const hole = f.find(i => CAFE_SPOTS[i].inside); const to = hole != null && Math.random() < .35 ? hole : f[Math.random() * f.length | 0], a = CAFE_SPOTS[r.spot], b = CAFE_SPOTS[to];
        r.face = b.x > a.x ? 1 : -1; r.w.removeAttribute("clip-path"); r.g.setAttribute("class", "cf-cat"); r.g.innerHTML = drawCat(r, true); r.spot = to; r.g.classList.add("walk"); r.g.style.transform = `translate(${b.x}px,${b.y}px) scale(${b.z / 80})`;
        setTimeout(() => { r.g.classList.remove("walk"); if (CAFE_SPOTS[r.spot].inside) { r.w.setAttribute("clip-path", "url(#cfHole)"); bubble(r, "mrrp ♥") } if (CAFE_SPOTS[r.spot].act) r.g.classList.add("act-" + CAFE_SPOTS[r.spot].act); r.g.innerHTML = drawCat(r) }, 2400);
      } else {
        const onTree = R.filter(x => CAFE_SPOTS[x.spot].tree);
        if (onTree.length > 1 && Math.random() < .5) { const [a, b] = onTree.sort(() => Math.random() - .5); bubble(a, "♥"); bubble(b, ["mrrp!", "purr…", "♥"][Math.random() * 3 | 0]); [a, b].forEach(x => { x.g.classList.remove("play"); void x.g.getBBox(); x.g.classList.add("play"); setTimeout(() => x.g.classList.remove("play"), 900) }) }
        else bubble(r, ["mrrp?", "meow!", "purr…", "♥", "mew", "zzz"][Math.random() * 6 | 0]);
      }
    }, 1700);
    const close = () => { clearInterval(life); if (cafe) { cafe.remove(); cafe = null } };
    cafe.querySelector(".cf-x").onclick = close;
    cafe.addEventListener("keydown", e => { if (e.key === "Escape") { if (!sheet.hidden) sheet.hidden = true; else close() } });
    // meeting a cat
    function meet(r) {
      const H = household(), n = Object.keys(H.cats).length, full = n >= MAX_CATS, B = BREEDS[resolveBreed(r.breed)[0]];
      let color = resolveBreed(r.breed, r.color)[1];
      const used = new Set(catList().list.map(c => (c.nick || "Dexter").toLowerCase()));
      const draw = () => {
        const k = r.mine ? stageOf(r.pts | 0) : 0;
        sheet.innerHTML = `<button type="button" class="cf-close" aria-label="Back to the café">✕</button>
          <div class="cf-meet">${art(k, r.equip || { badges: [] }, { breed: r.breed, color, collar: r.collar || "navy", w: r.weight || 1, eyes: "happy", plain: !r.mine })}
          <div><p class="cf-kicker">${r.mine ? "Your cat" : "Looking for a study buddy"}</p><h3>${r.mine ? esc(r.nick || "Dexter") : esc(B.name)}</h3><p class="cf-desc">${esc(B.desc)}.</p>
          ${r.mine ? `<p class="cf-desc">${esc(breedName(r.breed, r.color))} · Lv ${level(r.pts | 0)} · ${esc(STAGES[stageOf(r.pts | 0)].form)}</p>` : ""}</div></div>
          ${r.mine ? `<div class="cf-acts"><button type="button" class="cf-go" data-do="train">📚 Study with me</button><button type="button" class="cf-go alt" data-do="along">🎒 Come along</button><button type="button" class="cf-go ghost" data-do="stay">Keep chilling</button></div>`
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
  const READ_KEY = KEY.split("-")[0] + "-read-v1";
  // how many times a chapter has been finished (restarting keeps the count; older saves only have "finished")
  function completions(k) { let r = {}; try { r = JSON.parse(localStorage.getItem(READ_KEY) || "{}") || {} } catch (e) { } const c = r[k] || {}; return Math.max(c.done | 0, c.finished ? 1 : 0) }
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
  window.BioBuddy = { openCafe: () => openCafe(), cafeWindow, showLv, setShowLv, size: userScale, setSize, anchored, setAnchored, enabled: () => !off(), setEnabled, soundOn, setSound, open: openCard, openShop, openBadges, syncBadges, play: a => setAct(a), activity: () => act, art, STAGES, state: load, level };
})();

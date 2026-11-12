// Shared engine · Dexter's wardrobe (the shop catalog)
// Every item is original SVG, drawn in Dexter's "kitten space": the 120 × 120 frame of his full-size form,
// which buddy.js scales for each stage. So one drawing fits all six forms.
//   hat     over the head and ears (head top ≈ y 32, ear tips at y 15)
//   outfit  over the body (torso x 41–79, y 76–108)
//   face    at the eyes (eyes at x 48.5 and 71.5, y 60)
//   neck    at the collar (y ≈ 80–96)
//   held    on the ground beside him, on the left (x 4–34, ground y 108; not scaled)
// To add an item: append { id, slot, name, set, price, svg } to ITEMS. Ids are saved in progress, so never reuse one.
(function () {
  const OL = "#3a2a1e";
  const ln = (w = 2.2) => `stroke="${OL}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const TORSO = "M41.5 86 Q41 77 50 76.5 L70 76.5 Q79 77 78.5 86 Q80 104 70 108 L50 108 Q40 104 41.5 86Z";
  const GOLD = "#ffcf33", GOLD_D = "#d9a21b";
  // circles merged under one outline
  const puff = (cs, fill, shade) => cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}" stroke="${OL}" stroke-width="4.4"/>`).join("") +
    cs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${shade}"/>`).join("") + cs.map(([x, y, r]) => `<circle cx="${x - r * .1}" cy="${y - r * .16}" r="${r * .82}" fill="${fill}"/>`).join("");
  const star = (x, y, r, fill) => { let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += `${i ? "L" : "M"}${(x + Math.cos(a) * rr).toFixed(2)} ${(y + Math.sin(a) * rr).toFixed(2)} ` } return `<path d="${d}Z" fill="${fill}" ${ln(1.4)}/>` };
  const heart = (x, y, s, fill) => `<path d="M${x} ${y + s * .9} C${x - s * 1.4} ${y} ${x - s * 1.1} ${y - s * 1.1} ${x} ${y - s * .35} C${x + s * 1.1} ${y - s * 1.1} ${x + s * 1.4} ${y} ${x} ${y + s * .9}Z" fill="${fill}" ${ln(1.6)}/>`;
  const flower = (x, y, r, c) => [0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - r * .8}" rx="${r * .5}" ry="${r * .8}" fill="${c}" stroke="${OL}" stroke-width="1" transform="rotate(${a} ${x} ${y})"/>`).join("") + `<circle cx="${x}" cy="${y}" r="${r * .42}" fill="#ffd84a" stroke="${OL}" stroke-width=".9"/>`;
  const peakCap = (top, band, visor) => `<path d="M38 34 C38 22 46 16 60 16 C74 16 82 22 82 34Z" fill="${top}" ${ln()}/><path d="M40 24 Q60 18 80 24" stroke="#fff" stroke-width="1.2" fill="none" opacity=".35"/>
    <path d="M38 30.5 h44 v6 h-44Z" fill="${band}" ${ln()}/><path d="M36.5 36 Q60 47 83.5 36 Q60 41 36.5 36Z" fill="${visor}" ${ln()}/>`;

  const ITEMS = [
    // ===== Hats
    { id: "hat-police", slot: "hat", set: "Police", name: "Police cap", price: 120,
      svg: peakCap("#23407a", "#14203d", "#111827") + `<path d="M60 19.5 l5.4 2.2 v4.4 q0 4.2 -5.4 6.4 q-5.4 -2.2 -5.4 -6.4 v-4.4Z" fill="${GOLD}" ${ln(1.3)}/><circle cx="60" cy="25.4" r="1.6" fill="#23407a"/>` },
    { id: "hat-fire", slot: "hat", set: "Firefighter", name: "Firefighter helmet", price: 140,
      svg: `<path d="M30 36 Q60 45 90 36 Q93 41 86 43 Q60 50 34 43 Q27 41 30 36Z" fill="#b92a20" ${ln()}/><path d="M36 37 C36 20 46 11 60 11 C74 11 84 20 84 37 Q60 41 36 37Z" fill="#d7372b" ${ln()}/>
        <path d="M57.5 11.4 Q60 10.6 62.5 11.4 L62.5 38.6 L57.5 38.6Z" fill="#ef5a4c" ${ln(1.4)}/><path d="M51 18 h18 v8 q0 6.4 -9 9.4 q-9 -3 -9 -9.4Z" fill="${GOLD}" ${ln(1.4)}/><circle cx="60" cy="25" r="4" fill="#1f2937"/><path d="M59 23 h2 v4 h-2Z" fill="${GOLD}"/>` },
    { id: "hat-hard", slot: "hat", set: "Construction", name: "Hard hat", price: 110,
      svg: `<path d="M38 36 C38 20 47 13 60 13 C73 13 82 20 82 36Z" fill="#ffcc1a" ${ln()}/><path d="M56 13.6 Q60 12.6 64 13.6 L64 36 L56 36Z" fill="#ffe066" ${ln(1.3)}/>
        <path d="M33 35 h54 q3 4.6 -2.4 5.6 h-49.2 q-5.4 -1 -2.4 -5.6Z" fill="#f2b705" ${ln()}/><path d="M44 22 q4 -5 10 -6" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/>` },
    { id: "hat-chef", slot: "hat", set: "Chef", name: "Chef's toque", price: 120,
      svg: puff([[46, 20, 8.5], [53, 14, 8.5], [60, 11, 10], [67, 14, 8.5], [74, 20, 8.5]], "#ffffff", "#dfe3ea") +
        `<path d="M42 26 h36 v12 q-18 3 -36 0Z" fill="#fff" ${ln()}/><path d="M48 28 v8 M54 28 v9 M60 28 v9.4 M66 28 v9 M72 28 v8" stroke="#cfd5de" stroke-width="1.2"/>` },
    { id: "hat-straw", slot: "hat", set: "Farmer", name: "Straw hat", price: 100,
      svg: `<ellipse cx="60" cy="35" rx="37" ry="7.5" fill="#eac36f" ${ln()}/><path d="M28 35 Q60 44 92 35 M33 32 Q60 39 87 32" stroke="#c99a3c" stroke-width="1" fill="none"/>
        <path d="M45 35 C45 22 51 17 60 17 C69 17 75 22 75 35Z" fill="#f0cd7c" ${ln()}/><path d="M45.4 29.5 h29.2 v5 h-29.2Z" fill="#c0392b" ${ln(1.4)}/><path d="M50 22 l2 6 M58 19 l1 9 M66 20 l-1 8" stroke="#c99a3c" stroke-width="1"/>` },
    { id: "hat-pilot", slot: "hat", set: "Pilot", name: "Pilot cap", price: 130,
      svg: peakCap("#f4f6f8", "#1f2028", "#1f2028") + `<path d="M48 24 q6 -3 9 0 M72 24 q-6 -3 -9 0" stroke="${GOLD_D}" stroke-width="2.4" stroke-linecap="round" fill="none"/><circle cx="60" cy="24" r="3" fill="${GOLD}" ${ln(1.2)}/>` },
    { id: "hat-sailor", slot: "hat", set: "Sailor", name: "Sailor hat", price: 90,
      svg: `<path d="M41 33 C41 22 49 18 60 18 C71 18 79 22 79 33Z" fill="#fff" ${ln()}/><path d="M37 30.5 h46 v7 q-23 4.4 -46 0Z" fill="#fff" ${ln()}/><path d="M38 33.6 h44" stroke="#2a4a8a" stroke-width="1.8"/>` },
    { id: "hat-scrub", slot: "hat", set: "Doctor", name: "Scrub cap", price: 90,
      svg: `<path d="M38 37 C38 21 47 15 60 15 C73 15 82 21 82 37 Q60 32.5 38 37Z" fill="#2bb3a3" ${ln()}/><path d="M78 34 q8 0 10 5 q-6 1 -9 -2 q2 6 -1 10" fill="#2bb3a3" ${ln(1.6)}/>
        <path d="M58 21 h4 v3.4 h3.4 v4 h-3.4 v3.4 h-4 v-3.4 h-3.4 v-4 h3.4Z" fill="#fff" ${ln(1)}/>` },
    { id: "hat-beanie", slot: "hat", set: "Cozy", name: "Pom-pom beanie", price: 80,
      svg: `<path d="M38 38 C38 20 47 13 60 13 C73 13 82 20 82 38Z" fill="#ff8fb3" ${ln()}/><path d="M37 31 h46 v8 q-23 3 -46 0Z" fill="#f56b98" ${ln()}/>
        <path d="M42 32 v6 M48 32 v6.6 M54 32 v7 M60 32 v7 M66 32 v7 M72 32 v6.6 M78 32 v6" stroke="#d94c7d" stroke-width="1.2"/>${puff([[60, 11, 5.4]], "#fff", "#e7e9ee")}` },
    { id: "hat-party", slot: "hat", set: "Party", name: "Party hat", price: 70,
      svg: `<path d="M47 36 L60 4 L73 36Z" fill="#7c5cff" ${ln()}/><path d="M51.2 26 L68.8 26 M54.4 18 L65.6 18 M57.2 11 L62.8 11" stroke="#ffd84a" stroke-width="2.6"/><path d="M47 36 L60 4 L73 36Z" fill="none" ${ln()}/>${puff([[60, 4, 3.6]], "#ff5f87", "#d9436a")}` },
    { id: "hat-cowboy", slot: "hat", set: "Ranch", name: "Cowboy hat", price: 130,
      svg: `<path d="M26 33 Q33 41 60 41 Q87 41 94 33 Q90 29.5 83 32.6 Q60 37.4 37 32.6 Q30 29.5 26 33Z" fill="#a0672f" ${ln()}/><path d="M42 34 C40 21 46 14 52 16.4 Q60 21 68 16.4 C74 14 80 21 78 34 Q60 37 42 34Z" fill="#b8783a" ${ln()}/>
        <path d="M42.6 30 Q60 33.4 77.4 30 L77.8 33.6 Q60 37 42.2 33.6Z" fill="#5a3a1a"/>` },
    { id: "hat-flowers", slot: "hat", set: "Botanist", name: "Flower crown", price: 110,
      svg: `<path d="M36 37 Q60 26 84 37" stroke="#4f9d3a" stroke-width="3.4" fill="none" stroke-linecap="round"/>` + [[38, 35, "#ff8fb3"], [47, 30.5, "#ffd84a"], [56, 28.5, "#ff8fb3"], [65, 28.5, "#c3a6ff"], [74, 30.5, "#ffd84a"], [82, 35, "#ff8fb3"]].map(([x, y, c]) => flower(x, y, 4.6, c)).join("") +
        `<ellipse cx="51.5" cy="31" rx="3" ry="1.6" fill="#5fae45" transform="rotate(-30 51.5 31)"/><ellipse cx="69.5" cy="31" rx="3" ry="1.6" fill="#5fae45" transform="rotate(30 69.5 31)"/>` },
    { id: "hat-crown", slot: "hat", set: "Royal", name: "Golden crown", price: 400,
      svg: `<path d="M40 35 L41.5 17 L51 27 L60 13 L69 27 L78.5 17 L80 35Z" fill="${GOLD}" ${ln()}/><path d="M40 30 h40 v5 h-40Z" fill="${GOLD_D}" ${ln(1.4)}/>
        <circle cx="41.5" cy="17" r="2.2" fill="#fff" ${ln(1)}/><circle cx="60" cy="13" r="2.4" fill="#fff" ${ln(1)}/><circle cx="78.5" cy="17" r="2.2" fill="#fff" ${ln(1)}/>
        <circle cx="60" cy="25" r="3" fill="#e8455f" ${ln(1.2)}/><circle cx="49" cy="32.4" r="1.6" fill="#4f8dff"/><circle cx="71" cy="32.4" r="1.6" fill="#4f8dff"/>` },

    // ===== Outfits
    { id: "fit-police", slot: "outfit", set: "Police", name: "Police uniform", price: 200,
      svg: `<path d="${TORSO}" fill="#7fa7d9" ${ln()}/><path d="M50 76.6 L56 84.5 L60 80.5 L64 84.5 L70 76.6Z" fill="#6b93c6" ${ln(1.4)}/>
        <path d="M58.4 81 h3.2 l1.6 14 l-3.2 3.2 l-3.2 -3.2Z" fill="#1f2f55" ${ln(1.1)}/>${star(48.5, 89, 3.6, "#ffcf33")}<path d="M65 86.5 h9 v5 h-9Z" fill="#6b93c6" ${ln(1.1)}/><circle cx="60" cy="101" r="1.2" fill="#fff"/>` },
    { id: "fit-fire", slot: "outfit", set: "Firefighter", name: "Turnout coat", price: 220,
      svg: `<path d="${TORSO}" fill="#c9952f" ${ln()}/><path d="M50 76.6 L60 85 L70 76.6" stroke="${OL}" stroke-width="1.6" fill="none"/>
        <path d="M41 94 h38.6 v5 h-38.6Z" fill="#f7e04b" ${ln(1.2)}/><path d="M41 95.8 h38.6" stroke="#d6dbe1" stroke-width="1.6"/><path d="M59 86 h3 v2.6 h-3Z M59 101 h3 v2.6 h-3Z" fill="#1f2937"/><path d="M60.5 85 V108" stroke="${OL}" stroke-width="1.2"/>` },
    { id: "fit-vest", slot: "outfit", set: "Construction", name: "Safety vest", price: 160,
      svg: `<path d="M42 84 Q42 77 50 76.6 L56 77 L57 108 L50 108 Q41 104 42 84Z" fill="#ff7a1a" ${ln()}/><path d="M78 84 Q78 77 70 76.6 L64 77 L63 108 L70 108 Q79 104 78 84Z" fill="#ff7a1a" ${ln()}/>
        <path d="M41.5 93 h15.5 v4 h-15.5Z M63 93 h15.5 v4 h-15.5Z" fill="#e5e7eb" ${ln(1.1)}/><path d="M45 79 l3 15 M75 79 l-3 15" stroke="#e5e7eb" stroke-width="3"/>` },
    { id: "fit-chef", slot: "outfit", set: "Chef", name: "Chef's jacket", price: 180,
      svg: `<path d="${TORSO}" fill="#fff" ${ln()}/><path d="M52 77 L60 87 L68 77Z" fill="#e63946" ${ln(1.3)}/>` + [86, 93, 100].map(y => `<circle cx="54" cy="${y}" r="1.6" fill="#fff" ${ln(1)}/><circle cx="66" cy="${y}" r="1.6" fill="#fff" ${ln(1)}/>`).join("") + `<path d="M60 87 V107" stroke="#d6dbe1" stroke-width="1.2"/>` },
    { id: "fit-overalls", slot: "outfit", set: "Farmer", name: "Overalls", price: 170,
      svg: `<path d="M46.5 82 L44 76.6 M73.5 82 L76 76.6" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M46.5 82 L44 76.6 M73.5 82 L76 76.6" stroke="#3d6fb6" stroke-width="3.4" stroke-linecap="round"/>
        <path d="M47 81 h26 v14 h-26Z" fill="#3d6fb6" ${ln()}/><path d="M41.6 93 h37 Q80 104 70 108 h-20 Q40 104 41.6 93Z" fill="#3d6fb6" ${ln()}/>
        <path d="M53 85 h14 v6 h-14Z" fill="#355f9c" stroke="#9ec0ef" stroke-width=".9" stroke-dasharray="1.6 1.2"/><circle cx="48.5" cy="83" r="1.6" fill="${GOLD}" ${ln(.9)}/><circle cx="71.5" cy="83" r="1.6" fill="${GOLD}" ${ln(.9)}/><path d="M60 95 V107" stroke="#9ec0ef" stroke-width=".9" stroke-dasharray="1.6 1.2"/>` },
    { id: "fit-scrubs", slot: "outfit", set: "Doctor", name: "Scrubs", price: 160,
      svg: `<path d="${TORSO}" fill="#3fb8a8" ${ln()}/><path d="M53 77 L60 89 L67 77Z" fill="#fff0c2" ${ln(1.3)}/><path d="M46 92 h9 v7 h-9Z" fill="#35a394" ${ln(1.1)}/><path d="M48 92 v-4 M51.5 92 v-3" stroke="#e8455f" stroke-width="1.4" stroke-linecap="round"/>` },
    { id: "fit-pilot", slot: "outfit", set: "Pilot", name: "Pilot jacket", price: 210,
      svg: `<path d="${TORSO}" fill="#1d2b4f" ${ln()}/><path d="M53 77 L60 90 L67 77Z" fill="#fff" ${ln(1.2)}/><path d="M58.6 80 h2.8 l1.2 10 l-2.6 2.6 l-2.6 -2.6Z" fill="#1f2028"/>
        <path d="M51 77 L56 92 L50 88Z M69 77 L64 92 L70 88Z" fill="#2c3d6a" ${ln(1.2)}/><path d="M44 86 q4 -2 6 0 q-2 0 -6 0" stroke="${GOLD}" stroke-width="1.6" fill="none"/>${[95, 101].map(y => `<circle cx="56" cy="${y}" r="1.4" fill="${GOLD}"/><circle cx="64" cy="${y}" r="1.4" fill="${GOLD}"/>`).join("")}` },
    { id: "fit-sailor", slot: "outfit", set: "School", name: "Sailor school uniform", price: 200,
      svg: `<path d="${TORSO}" fill="#fff" ${ln()}/><path d="M46 77 L60 93 L74 77 L80.4 83 Q76 88 70.6 86.4 L60 97 L49.4 86.4 Q44 88 39.6 83Z" fill="#22356b" ${ln(1.6)}/>
        <path d="M43 81 L60 95 M77 81 L60 95" stroke="#fff" stroke-width="1.2" opacity=".85"/><path d="M60 94 L53 99 L55 103 L60 98 L65 103 L67 99Z" fill="#e63946" ${ln(1.2)}/><circle cx="60" cy="97" r="2" fill="#c92d3a" ${ln(1)}/>` },
    { id: "fit-yukata", slot: "outfit", set: "Festival", name: "Festival yukata", price: 190,
      svg: `<path d="${TORSO}" fill="#2c3e75" ${ln()}/>` + [[46, 84], [70, 84], [52, 92], [68, 92], [48, 104], [72, 104]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="none" stroke="#c9d6ff" stroke-width="1.1"/>`).join("") +
        `<path d="M51 77 L66 97 M69 77 L56 89" stroke="#f4ecd6" stroke-width="3" stroke-linecap="round"/><path d="M41.2 95 h38.4 v5.6 h-38.4Z" fill="#d64545" ${ln(1.3)}/><path d="M66 95 l6 -3 v11 l-6 -3Z" fill="#d64545" ${ln(1.1)}/>` },
    { id: "fit-hoodie", slot: "outfit", set: "Cozy", name: "Cozy hoodie", price: 150,
      svg: `<path d="M44 80 Q60 72 76 80 Q74 86 60 86 Q46 86 44 80Z" fill="#9b84d1" ${ln()}/><path d="${TORSO}" fill="#b39ddb" ${ln()}/><path d="M46 79 Q60 88 74 79" stroke="${OL}" stroke-width="1.6" fill="none"/>
        <path d="M56 85 l-1 9 M64 85 l1 9" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><path d="M48 97 h24 l-3 9 h-18Z" fill="#a58fd2" ${ln(1.3)}/>` },
    { id: "fit-tux", slot: "outfit", set: "Formal", name: "Tuxedo", price: 260,
      svg: `<path d="${TORSO}" fill="#1f2028" ${ln()}/><path d="M52 77 L60 97 L68 77Z" fill="#fff" ${ln(1.2)}/><path d="M52 77 L57 91 L49.6 87Z M68 77 L63 91 L70.4 87Z" fill="#3a3c48" ${ln(1.1)}/>
        <circle cx="60" cy="88" r="1.1" fill="${OL}"/><circle cx="60" cy="92.4" r="1.1" fill="${OL}"/><path d="M45 92 h6" stroke="#fff" stroke-width="1.4"/>` },

    // ===== Accessories: face
    { id: "face-shades", slot: "face", set: "Pilot", name: "Sunglasses", price: 90,
      svg: `<rect x="38.5" y="53" width="20" height="13.5" rx="5.4" fill="#1f2028" ${ln(2)}/><rect x="61.5" y="53" width="20" height="13.5" rx="5.4" fill="#1f2028" ${ln(2)}/><path d="M58.5 57 Q60 55 61.5 57" stroke="${OL}" stroke-width="2" fill="none"/>
        <path d="M42 56 l5 -1.6 M65 56 l5 -1.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".8"/>` },
    { id: "face-stars", slot: "face", set: "Party", name: "Star shades", price: 110,
      svg: star(48.5, 60, 11, "#ff8fd1") + star(71.5, 60, 11, "#ff8fd1") + `<path d="M58 58 Q60 56 62 58" stroke="${OL}" stroke-width="2" fill="none"/>` },
    { id: "face-hearts", slot: "face", set: "Party", name: "Heart shades", price: 110,
      svg: heart(48.5, 59, 7.6, "#ff5f87") + heart(71.5, 59, 7.6, "#ff5f87") + `<path d="M57 57.6 Q60 55.6 63 57.6" stroke="${OL}" stroke-width="2" fill="none"/><path d="M43 55 l2.6 -1.4 M66 55 l2.6 -1.4" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` },
    { id: "face-round", slot: "face", set: "Botanist", name: "Round glasses", price: 70,
      svg: `<circle cx="48.5" cy="60" r="10" fill="#bfe6ff" fill-opacity=".18" stroke="${OL}" stroke-width="2"/><circle cx="71.5" cy="60" r="10" fill="#bfe6ff" fill-opacity=".18" stroke="${OL}" stroke-width="2"/><path d="M58.5 58.5 Q60 56.5 61.5 58.5" stroke="${OL}" stroke-width="2" fill="none"/>` },
    { id: "face-monocle", slot: "face", set: "Formal", name: "Monocle", price: 130,
      svg: `<circle cx="71.5" cy="60" r="10" fill="#bfe6ff" fill-opacity=".2" stroke="${GOLD_D}" stroke-width="2.4"/><path d="M80 66 Q86 80 78 92" stroke="${GOLD_D}" stroke-width="1.2" fill="none" stroke-dasharray="1.6 1.2"/>` },

    // ===== Accessories: neck
    { id: "neck-bow", slot: "neck", set: "Formal", name: "Bow tie", price: 60,
      svg: `<path d="M60 84 L49 78 L49 90Z M60 84 L71 78 L71 90Z" fill="#e63946" ${ln(1.6)}/><rect x="57" y="81" width="6" height="6" rx="2" fill="#c92d3a" ${ln(1.4)}/>` },
    { id: "neck-bell", slot: "neck", set: "Cozy", name: "Bell collar", price: 80, collar: [43, 80.5, 60, 89, 77, 80.5],
      svg: `<path d="M43 80.5 Q60 89 77 80.5" stroke="${OL}" stroke-width="6.4" fill="none" stroke-linecap="round"/><path d="M43 80.5 Q60 89 77 80.5" stroke="#e63946" stroke-width="3.6" fill="none" stroke-linecap="round"/>
        <circle cx="60" cy="90" r="4.6" fill="${GOLD}" ${ln(1.4)}/><path d="M56 89.4 h8" stroke="${OL}" stroke-width="1"/><circle cx="60" cy="92.4" r="1" fill="${OL}"/><circle cx="58.4" cy="88.4" r="1" fill="#fff"/>` },
    { id: "neck-bandana", slot: "neck", set: "Ranch", name: "Bandana", price: 70, collar: [43.5, 80.6, 60, 89, 76.5, 80.6],
      svg: `<path d="M43 79.5 Q60 88 77 79.5 L60 98Z" fill="#d6453a" ${ln(1.6)}/>` + [[52, 85], [60, 88], [68, 85], [56, 91], [64, 91], [60, 94]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="#fff"/>`).join("") },
    { id: "neck-steth", slot: "neck", set: "Doctor", name: "Stethoscope", price: 120,
      svg: `<path d="M45 79 Q44 93 54 96 M75 79 Q76 90 68 94 Q64 97 66 101" stroke="${OL}" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="M45 79 Q44 93 54 96 M75 79 Q76 90 68 94 Q64 97 66 101" stroke="#6b7280" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <circle cx="66" cy="103" r="3.6" fill="#d6dbe1" ${ln(1.4)}/><circle cx="66" cy="103" r="1.6" fill="#9aa3ad"/>` },
    { id: "neck-whistle", slot: "neck", set: "Police", name: "Whistle", price: 60,
      svg: `<path d="M46 79 L60 94 L74 79" stroke="#2563eb" stroke-width="2" fill="none"/><path d="M57 93 h9 q3 0 3 3 v1 q0 3 -3 3 h-5 q-4 0 -4 -4Z" fill="#d6dbe1" ${ln(1.3)}/><circle cx="64" cy="96.6" r="1.4" fill="#6b7280"/>` },
    { id: "neck-medal", slot: "neck", set: "Royal", name: "Gold medal", price: 250,
      svg: `<path d="M48 79 L57 95 M72 79 L63 95" stroke="#2563eb" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="98" r="5.6" fill="${GOLD}" ${ln(1.5)}/>${star(60, 98, 3, "#fff2b3")}` },
    { id: "neck-scarf", slot: "neck", set: "Cozy", name: "Blue scarf", price: 90, collar: [41, 82, 60, 93.4, 79, 82],
      svg: `<path d="M41 79 Q60 91 79 79 L80 85 Q60 96 40 85Z" fill="#4f8dff" ${ln()}/><path d="M70 88 L76 103 L68 101 L65 90Z" fill="#4f8dff" ${ln()}/><path d="M45 84 Q60 92 75 84" stroke="#a9c8ff" stroke-width="1.4" fill="none"/>` },

    // ===== Accessories: held (beside him, unscaled)
    { id: "held-spatula", slot: "held", set: "Chef", name: "Spatula", price: 70,
      svg: `<path d="M24 108 L18 84" stroke="${OL}" stroke-width="5.4" stroke-linecap="round"/><path d="M24 108 L18 84" stroke="#8b5a2b" stroke-width="3" stroke-linecap="round"/><path d="M12 70 h12 l-1 14 h-10Z" fill="#d6dbe1" ${ln(1.6)}/><path d="M15.4 73 v8 M18 73 v8 M20.6 73 v8" stroke="#9aa3ad" stroke-width="1.2"/>` },
    { id: "held-wrench", slot: "held", set: "Construction", name: "Big wrench", price: 80,
      svg: `<path d="M12 106 L28 80" stroke="${OL}" stroke-width="7" stroke-linecap="round"/><path d="M12 106 L28 80" stroke="#9aa3ad" stroke-width="4.2" stroke-linecap="round"/><path d="M24 74 a8 8 0 1 0 10 9 l-5 -2 l-1 -4 l3 -4Z" fill="#9aa3ad" ${ln(1.8)}/>` },
    { id: "held-cone", slot: "held", set: "Construction", name: "Traffic cone", price: 60,
      svg: `<path d="M8 108 h26 v-3 h-26Z" fill="#ff7a1a" ${ln(1.6)}/><path d="M12 105 L18 76 h6 L30 105Z" fill="#ff7a1a" ${ln(1.6)}/><path d="M15.2 94 h11.6 l1.2 5 h-14Z M17.6 84 h6.8 l.9 4 h-8.6Z" fill="#fff"/>` },
    { id: "held-can", slot: "held", set: "Farmer", name: "Watering can", price: 90,
      svg: `<path d="M10 108 h20 v-20 h-20Z" fill="#4caf50" ${ln(1.8)}/><path d="M30 92 L40 82" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><path d="M30 92 L40 82" stroke="#4caf50" stroke-width="2.6" stroke-linecap="round"/>
        <path d="M12 88 Q20 76 28 88" stroke="${OL}" stroke-width="2.4" fill="none"/><path d="M10 96 h20" stroke="#3d8b40" stroke-width="1.4"/><path d="M42 85 l1.4 3 M44 81 l2 2 M45 87 l1.4 3" stroke="#5ab0e6" stroke-width="1.6" stroke-linecap="round"/>` },
    { id: "held-sprout", slot: "held", set: "Botanist", name: "Potted sprout", price: 100,
      svg: `<path d="M10 92 h22 l-3 16 h-16Z" fill="#d9734e" ${ln(1.8)}/><path d="M9 90 h24 v4 h-24Z" fill="#c45f3c" ${ln(1.4)}/><path d="M21 90 Q20 82 21 76" stroke="#4f9d3a" stroke-width="2.2" fill="none" stroke-linecap="round"/>
        <ellipse cx="16" cy="75" rx="5.6" ry="3.2" fill="#8bc34a" ${ln(1.3)} transform="rotate(-24 16 75)"/><ellipse cx="26" cy="75" rx="5.6" ry="3.2" fill="#8bc34a" ${ln(1.3)} transform="rotate(24 26 75)"/>` },
    { id: "held-extinguisher", slot: "held", set: "Firefighter", name: "Fire extinguisher", price: 110,
      svg: `<rect x="12" y="80" width="14" height="28" rx="6" fill="#d7372b" ${ln(1.8)}/><path d="M15 77 h8 v4 h-8Z" fill="#1f2937"/><path d="M23 78 h7 l2 -3" stroke="${OL}" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M12 84 Q4 90 8 102" stroke="#1f2937" stroke-width="2.4" fill="none" stroke-linecap="round"/><rect x="14" y="90" width="10" height="7" rx="1.4" fill="#fff" opacity=".85"/>` },
    { id: "held-megaphone", slot: "held", set: "Police", name: "Megaphone", price: 90,
      svg: `<path d="M10 86 L30 76 L30 100 L10 92Z" fill="#f4f6f8" ${ln(1.8)}/><path d="M6 84 h5 v10 h-5Z" fill="#e63946" ${ln(1.4)}/><path d="M18 94 l2 12" stroke="${OL}" stroke-width="3" stroke-linecap="round"/><path d="M34 80 q3 8 0 16" stroke="${OL}" stroke-width="1.6" fill="none" opacity=".6"/>` },
    { id: "held-clipboard", slot: "held", set: "Doctor", name: "Clipboard", price: 70,
      svg: `<rect x="8" y="80" width="22" height="28" rx="2.4" fill="#b8783a" ${ln(1.8)}/><rect x="11" y="85" width="16" height="20" fill="#fff" ${ln(1)}/><rect x="15" y="77.6" width="8" height="4.4" rx="1.4" fill="#9aa3ad" ${ln(1.2)}/><path d="M13.6 90 h10.8 M13.6 94 h10.8 M13.6 98 h7" stroke="#9aa3ad" stroke-width="1.2"/>` }
  ];
  // ===== Reading badges: earned (never bought) by finishing a Read & Learn chapter, pinned on Dexter's chest.
  // Each is an original badge shape drawn in a 20 × 20 box around (0, 0); badge() places and scales it.
  const BADGE_ART = {
    // Social action: a speech bubble with a heart
    social: `<circle r="9.8" fill="#0a84ff" ${ln(1.4)}/><path d="M-6 -4.4 Q-6 -6.6 -3.8 -6.6 H3.8 Q6 -6.6 6 -4.4 V1.4 Q6 3.6 3.8 3.6 H-0.6 L-3.6 6.4 V3.6 H-3.8 Q-6 3.6 -6 1.4Z" fill="#fff" ${ln(1)}/><path d="M0 1.6 C-3.4 -0.6 -3 -4.2 -1.2 -4.2 C-0.4 -4.2 0 -3.6 0 -3.2 C0 -3.6 .4 -4.2 1.2 -4.2 C3 -4.2 3.4 -0.6 0 1.6Z" fill="#ff375f"/>`,
    // Gesture & sign: an open hand
    gesture: `<path d="M0 -10 L8.7 -5 L8.7 5 L0 10 L-8.7 5 L-8.7 -5Z" fill="#ff9f0a" ${ln(1.4)}/><path d="M-4.2 6 Q-6 2 -6 -0.4 Q-6 -1.8 -4.8 -1.6 L-3.6 0.4 V-6 Q-3.6 -7 -2.6 -7 Q-1.6 -7 -1.6 -6 V-1.6 V-7.4 Q-1.6 -8.4 -.6 -8.4 Q.4 -8.4 .4 -7.4 V-1.6 V-6.8 Q.4 -7.8 1.4 -7.8 Q2.4 -7.8 2.4 -6.8 V-1.4 V-5.2 Q2.4 -6.2 3.4 -6.2 Q4.4 -6.2 4.4 -5.2 V1.6 Q4.4 6 0 6.6Z" fill="#fff4dc" ${ln(1)}/>`,
    // Research: a notebook and pencil
    methods: `<circle r="9.8" fill="#30b0c7" ${ln(1.4)}/><rect x="-5.6" y="-6.6" width="9" height="12" rx="1.2" fill="#fff" ${ln(1)}/><path d="M-3.6 -3.4 H1.6 M-3.6 -0.8 H1.6 M-3.6 1.8 H0" stroke="#30b0c7" stroke-width="1"/><path d="M2.6 4.8 L6.8 -3.4 L8.2 -2.6 L4 5.6 L2.4 6.4Z" fill="#ffd60a" ${ln(.9)}/>`,
    // Acquisition & socialization: a baby's rattle
    socialization: `<path d="M-8.4 -9 H8.4 V0 Q8.4 7.4 0 10 Q-8.4 7.4 -8.4 0Z" fill="#ff6482" ${ln(1.4)}/><circle cy="-2.4" r="4.6" fill="#ffe4ec" ${ln(1)}/><circle cx="-1.6" cy="-3.4" r=".9" fill="#ff6482"/><circle cx="1.6" cy="-1.6" r=".9" fill="#ff6482"/><path d="M0 2.2 V7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/><circle cy="7.4" r="1.4" fill="#fff" ${ln(.8)}/>`,
    // Thought & culture: a lightbulb
    thought: `<circle r="9.8" fill="#5e5ce6" ${ln(1.4)}/><path d="M0 -7.4 C-4 -7.4 -5.4 -4.4 -5.4 -2.4 C-5.4 0.4 -3 1.6 -2.6 4 H2.6 C3 1.6 5.4 0.4 5.4 -2.4 C5.4 -4.4 4 -7.4 0 -7.4Z" fill="#ffe066" ${ln(1)}/><path d="M-2.2 5.2 H2.2 M-1.6 6.8 H1.6" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><path d="M-1.4 -1 L0 1.4 L1.4 -1" stroke="#b8860b" stroke-width=".9" fill="none"/>`,
    // Multilingualism: two overlapping speech bubbles
    multilingual: `<path d="M0 -10.4 L2.6 -6.2 L7.4 -7.4 L6.2 -2.6 L10.4 0 L6.2 2.6 L7.4 7.4 L2.6 6.2 L0 10.4 L-2.6 6.2 L-7.4 7.4 L-6.2 2.6 L-10.4 0 L-6.2 -2.6 L-7.4 -7.4 L-2.6 -6.2Z" fill="#34c759" ${ln(1.3)}/><rect x="-6.4" y="-5.4" width="7.6" height="5.6" rx="1.4" fill="#fff" ${ln(.9)}/><rect x="-1.2" y="-1" width="7.6" height="5.6" rx="1.4" fill="#d1f5d8" ${ln(.9)}/><path d="M-4.6 -2.6 H-.6 M.6 1.8 H4.6" stroke="#1f7a3a" stroke-width=".9"/>`,
    // Literacy & online: an envelope
    literacy: `<circle r="9.8" fill="#af52de" ${ln(1.4)}/><rect x="-6.4" y="-4.4" width="12.8" height="9" rx="1.2" fill="#fff" ${ln(1)}/><path d="M-6.2 -4 L0 1 L6.2 -4" stroke="#af52de" stroke-width="1.1" fill="none"/><path d="M0 -6.4 C-1.6 -7.6 -3 -6.2 -1.6 -5 L0 -3.8 L1.6 -5 C3 -6.2 1.6 -7.6 0 -6.4Z" fill="#ff375f"/>`,
    // Performance & gender: a microphone with a star
    performance: `<path d="M0 -10 L8.7 -5 L8.7 5 L0 10 L-8.7 5 L-8.7 -5Z" fill="#ff375f" ${ln(1.4)}/><rect x="-2.4" y="-6.6" width="4.8" height="7.4" rx="2.4" fill="#e5e5ea" ${ln(1)}/><path d="M-4.2 -1.4 Q-4.2 3.4 0 3.4 Q4.2 3.4 4.2 -1.4 M0 3.4 V6.4 M-2.4 6.6 H2.4" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M5.6 -7.6 l.6 1.4 1.4 .6 -1.4 .6 -.6 1.4 -.6 -1.4 -1.4 -.6 1.4 -.6Z" fill="#ffd60a"/>`,
    // Race & ethnicity: linked hands of many colors (three joined rings)
    race: `<circle r="9.8" fill="#a2845e" ${ln(1.4)}/><circle cx="-3.4" cy="-1.6" r="3.4" fill="none" stroke="#ffd8b1" stroke-width="1.8"/><circle cx="3.4" cy="-1.6" r="3.4" fill="none" stroke="#6b4423" stroke-width="1.8"/><circle cy="3.4" r="3.4" fill="none" stroke="#f1c27d" stroke-width="1.8"/>`,
    // Endangerment, power & agency: a sprouting voice (a leaf from a sound wave)
    power: `<path d="M-8.4 -9 H8.4 V0 Q8.4 7.4 0 10 Q-8.4 7.4 -8.4 0Z" fill="#1c7c54" ${ln(1.4)}/><path d="M-5.6 3 Q-4 -0.4 -2.4 3 T0.8 3 T4 3" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M0 1 V-3.4" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/><path d="M0 -3.4 C-1 -6.6 -4.6 -6.8 -5 -4.6 C-3.4 -3 -1 -3 0 -3.4Z M0 -3.8 C1 -7 4.6 -7.2 5 -5 C3.4 -3.4 1 -3.4 0 -3.8Z" fill="#a8e6a3" ${ln(.7)}/>`,
    // ----- Bi 239 (plants, fungi and signals)
    land: `<path d="M0 -10 L8.7 -5 L8.7 5 L0 10 L-8.7 5 L-8.7 -5Z" fill="#4caf50" ${ln(1.4)}/><path d="M0 -7.4 L6.4 -3.7 L6.4 3.7 L0 7.4 L-6.4 3.7 L-6.4 -3.7Z" fill="#8fd16a"/><path d="M0 5.6 C-5.6 2.4 -4.8 -4.4 0 -6.6 C4.8 -4.4 5.6 2.4 0 5.6Z" fill="#2e7d32" ${ln(1)}/><path d="M0 5 V-5.4 M0 -1 l-2.4 -1.8 M0 1.8 l2.4 -1.8" stroke="#bfe8a4" stroke-width=".8" fill="none"/>`,
    vascular: `<path d="M-8.4 -9 H8.4 V0 Q8.4 7.4 0 10 Q-8.4 7.4 -8.4 0Z" fill="#1f9e8f" ${ln(1.4)}/><path d="M-6 -6.6 H6 V0 Q6 5 0 7.2 Q-6 5 -6 0Z" fill="#5fd3c4"/><path d="M0 6.4 Q1.4 0 0 -6.4" stroke="#1b5e20" stroke-width="1.2" fill="none"/>${[-4.6, -2.2, 0.2, 2.6].map((y, i) => `<path d="M0.4 ${y} q-3.8 -0.8 -${4.2 - i * .5} 1.4 M0.4 ${y} q3.8 -0.8 ${4.2 - i * .5} 1.4" stroke="#1b5e20" stroke-width="1" fill="none" stroke-linecap="round"/>`).join("")}`,
    seed: [0, 72, 144, 216, 288].map(a => `<circle cx="0" cy="-5.4" r="4.6" fill="#ff7aa8" ${ln(1.2)} transform="rotate(${a})"/>`).join("") + [0, 72, 144, 216, 288].map(a => `<circle cx="0" cy="-5.4" r="3.4" fill="#ffb3cc" transform="rotate(${a})"/>`).join("") + `<circle r="3.4" fill="#ffd84a" ${ln(1.1)}/>`,
    signals: `<circle r="9.6" fill="#ffd84a" ${ln(1.4)}/><circle r="7" fill="#fff3b0"/><path d="M0 6 V-1" stroke="#2e7d32" stroke-width="1.6" stroke-linecap="round"/><path d="M0 0 C-1 -4 -5 -5 -6 -2 C-4 0 -1 0 0 0Z M0 -1 C1 -5 5 -6 6 -3 C4 -1 1 -1 0 -1Z" fill="#4caf50" ${ln(.9)}/><path d="M-4 6 H4" stroke="#8b5a2b" stroke-width="1.6" stroke-linecap="round"/>`,
    hormones: `<circle cy="1" r="9" fill="#e53935" ${ln(1.4)}/><circle cx="-3" cy="-1.6" r="2.4" fill="#ff8a80" opacity=".8"/><path d="M0 -7.6 l1.6 -2.4 1 2.8 3 -.6 -2 2.4 2.4 1.8 -3 .4 -.6 2.8 -2.4 -1.8 -2.4 1.8 -.6 -2.8 -3 -.4 2.4 -1.8 -2 -2.4 3 .6 1 -2.8Z" fill="#43a047" ${ln(.9)}/>`,
    light: `<circle r="9.6" fill="#26365e" ${ln(1.4)}/><path d="M2 -7.2 A7.4 7.4 0 1 0 2 7.2 A5.8 5.8 0 1 1 2 -7.2Z" fill="#ffe9a8" ${ln(.9)}/><path d="M5.2 -3.4 l.7 1.6 1.6 .7 -1.6 .7 -.7 1.6 -.7 -1.6 -1.6 -.7 1.6 -.7Z" fill="#fff"/>`,
    stress: `<path d="M0 -10.4 L2.6 -6.2 L7.4 -7.4 L6.2 -2.6 L10.4 0 L6.2 2.6 L7.4 7.4 L2.6 6.2 L0 10.4 L-2.6 6.2 L-7.4 7.4 L-6.2 2.6 L-10.4 0 L-6.2 -2.6 L-7.4 -7.4 L-2.6 -6.2Z" fill="#ff9f0a" ${ln(1.3)}/><circle r="5.4" fill="#ffd166" ${ln(1)}/><path d="M0 4 V-3 M0 -.4 q-2.4 0 -2.4 -2.2 M0 .6 q2.4 0 2.4 -2.2" stroke="#2e7d32" stroke-width="1.5" fill="none" stroke-linecap="round"/>`,
    fungi: `<path d="M-9.4 1.4 Q-9.4 -9.4 0 -9.4 Q9.4 -9.4 9.4 1.4Z" fill="#9b59d0" ${ln(1.4)}/><path d="M-3.4 1.4 h6.8 v6.4 q0 2.2 -3.4 2.2 q-3.4 0 -3.4 -2.2Z" fill="#f1e3c8" ${ln(1.2)}/><circle cx="-4.4" cy="-3.4" r="1.6" fill="#fff"/><circle cx="1.4" cy="-6" r="1.4" fill="#fff"/><circle cx="4.6" cy="-1.8" r="1.2" fill="#fff"/>`
  };
  const shine = `<ellipse cx="-3.6" cy="-5.4" rx="3.4" ry="1.6" fill="#fff" opacity=".35" transform="rotate(-30 -3.6 -5.4)"/>`;
  const badge = (k, x, y, r) => `<g transform="translate(${x} ${y}) scale(${r / 10})">${BADGE_ART[k]}${shine}</g>`;
  // one badge per Read & Learn chapter, per course: [course id, the course's key prefix, [[chapter key, badge name, chapter title] …]]
  const COURSE_BADGES = [
    ["a104", "a104-", [["social", "Voice Badge", "Language as social action"], ["gesture", "Hand Badge", "Gesture, sign and multimodality"], ["methods", "Fieldnote Badge", "Doing research"], ["socialization", "Rattle Badge", "Acquisition and socialization"], ["thought", "Lightbulb Badge", "Language, thought and culture"],
    ["multilingual", "Polyglot Badge", "Multilingualism and communities"], ["literacy", "Letter Badge", "Literacy and online language"], ["performance", "Spotlight Badge", "Performance and gender"], ["race", "Unity Badge", "Race and ethnicity"], ["power", "Revival Badge", "Endangerment, power and agency"]]],
    ["bio", "bio-", [["land", "Moss Badge", "Plants move to land"], ["vascular", "Frond Badge", "Seedless vascular plants"], ["seed", "Bloom Badge", "Seed plants"], ["signals", "Sprout Badge", "Signals and tropisms"],
    ["hormones", "Ripening Badge", "Plant hormones"], ["light", "Moonlight Badge", "Light, clocks and seasons"], ["stress", "Thorn Badge", "Stress, touch and defense"], ["fungi", "Spore Badge", "Fungi"]]]
  ];
  for (const [course, prefix, BADGES] of COURSE_BADGES) for (const [k, name, ch] of BADGES) ITEMS.push({ id: "badge-" + k, slot: "badge", set: "Badge", name, price: 0, earn: k, course, readKey: prefix + "read-v1", chapter: ch, svg: badge(k, 69, 88, 6.4), big: badge(k, 0, 0, 10) });
  // ===== Badge sparkle: finishing a chapter again and again polishes its badge.
  // Completions → tier: 1 Earned · 2 Shiny (a glint sweeps across) · 3 Sparkling (+ twinkling stars) · 5 Dazzling (+ golden glow)
  // · 8 Legendary (+ a spinning rainbow ring). Drawn with SVG <animate> so it works anywhere the badge appears, even on Dexter.
  const TIERS = [{ at: 1, name: "Earned" }, { at: 2, name: "Shiny" }, { at: 3, name: "Sparkling" }, { at: 5, name: "Dazzling" }, { at: 8, name: "Legendary" }];
  function tier(n) {
    let i = 0; TIERS.forEach((t, j) => { if (n >= t.at) i = j });
    return { lv: n > 0 ? i : -1, name: n > 0 ? TIERS[i].name : "Locked", next: n > 0 ? TIERS[i + 1] || null : TIERS[0], count: n };
  }
  let spkN = 0;
  const STARS = [[-11, -8, 1.9], [10.6, -9.4, 1.6], [11.4, 6, 2], [-10.2, 9, 1.5], [0, -12.4, 1.4], [-12.6, 0, 1.3], [5.6, 11.6, 1.5]];
  const star4 = (x, y, r) => `<path d="M${x} ${y - r * 2} Q${x + r * .3} ${y - r * .3} ${x + r * 2} ${y} Q${x + r * .3} ${y + r * .3} ${x} ${y + r * 2} Q${x - r * .3} ${y + r * .3} ${x - r * 2} ${y} Q${x - r * .3} ${y - r * .3} ${x} ${y - r * 2}Z" fill="#fff8c4" stroke="#f5b400" stroke-width=".35"/>`;
  // a badge (centered on 0,0, radius 10) with the sparkle for n completions
  function badgeArt(item, n) {
    const t = tier(n), id = "bspk" + (++spkN); let back = "", front = "";
    if (t.lv >= 4) back += `<g><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="7s" repeatCount="indefinite"/>${["#ff375f", "#ff9f0a", "#ffd60a", "#34c759", "#0a84ff", "#bf5af2"].map((c, i) => `<path d="M${(12.6 * Math.cos(i * Math.PI / 3)).toFixed(2)} ${(12.6 * Math.sin(i * Math.PI / 3)).toFixed(2)} A12.6 12.6 0 0 1 ${(12.6 * Math.cos((i + 1) * Math.PI / 3)).toFixed(2)} ${(12.6 * Math.sin((i + 1) * Math.PI / 3)).toFixed(2)}" stroke="${c}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
    if (t.lv >= 3) back += `<circle r="12" fill="#ffd84a" opacity=".35"><animate attributeName="r" values="11;12.6;11" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".2;.5;.2" dur="2.4s" repeatCount="indefinite"/></circle>`;
    if (t.lv >= 1) front += `<defs><clipPath id="${id}"><circle r="9.6"/></clipPath></defs><g clip-path="url(#${id})"><path d="M-3 -14 L1 -14 L-5 14 L-9 14Z" fill="#fff" opacity=".55"><animateTransform attributeName="transform" type="translate" values="-14 0;22 0;22 0" keyTimes="0;.45;1" dur="${t.lv >= 3 ? 2.2 : 3.2}s" repeatCount="indefinite"/></path></g>`;
    const ns = t.lv >= 4 ? 7 : t.lv >= 3 ? 5 : t.lv >= 2 ? 3 : 0;
    STARS.slice(0, ns).forEach(([x, y, r], i) => { front += `<g opacity="0">${star4(x, y, r)}<animate attributeName="opacity" values="0;1;0" dur="${1.5 + (i % 3) * .35}s" begin="${(i * .37).toFixed(2)}s" repeatCount="indefinite"/></g>` });
    return back + item.big + front;
  }
  const SLOTS = [
    { key: "hat", name: "Hats" }, { key: "outfit", name: "Outfits" },
    { key: "face", name: "Glasses", group: "Accessories" }, { key: "neck", name: "Neckwear", group: "Accessories" }, { key: "held", name: "Things to hold", group: "Accessories" },
    { key: "badge", name: "Badges", group: "Badges" }
  ];
  // Tile crops of kitten space, for showing an item on its own
  const VIEW = { hat: "24 2 72 48", outfit: "34 70 52 42", face: "34 44 52 30", neck: "36 73 48 33", held: "2 66 46 44", badge: "61.6 80.6 14.8 14.8" };
  window.BioWardrobe = { ITEMS, SLOTS, VIEW, byId: Object.fromEntries(ITEMS.map(i => [i.id, i])), badgeArt, tier, TIERS };
})();

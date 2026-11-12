// Read & Learn activities: the interactive pieces inside the reading (figures from the lecture slides, label-the-diagram,
// put-in-order, matching, sorting, the trait table, flip cards, and three simulations of the lecture's experiments).
// ReadPlay.html(block, key, done) returns markup; ReadPlay.wire(el, block, key, onDone) makes it work.
// onDone(perfect) fires once when the activity is finished; the page saves it and rewards a perfect first try.
(() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0;[a[i], a[j]] = [a[j], a[i]] } return a };
  const img = n => `img/${n}.jpg`;
  const head = (b, kind, icon) => `<div class="pl-head"><span class="pl-ico">${icon}</span><span><b>${esc(b.title || kind)}</b>${b.how ? `<small>${esc(b.how)}</small>` : ""}</span></div>`;
  const doneBar = d => d ? `<div class="pl-done">${d.perfect ? "★ Perfect! +XP for Dexter" : "✓ Done"}<button type="button" class="pl-again">Play again</button></div>` : "";
  const shake = el => { el.classList.remove("pl-shake"); void el.offsetWidth; el.classList.add("pl-shake") };

  function figHTML(b) {
    const many = b.src.length > 1;
    return `<figure class="pl-fig${many ? " many" : ""}">${b.src.map(n => `<button type="button" class="pl-zoom" data-src="${img(n)}"><img loading="lazy" src="${img(n)}" alt="${esc(b.alt || b.cap || "Figure from the lecture slides")}"></button>`).join("")}
      <figcaption>${b.cap || ""}<span class="pl-src">From the lecture slides · tap to zoom</span></figcaption></figure>`;
  }

  const R = {
    fig: { html: b => figHTML(b), wire() { } },

    flipbook: {
      html: b => `<figure class="pl-fig pl-book"><div class="pl-frames">${b.src.map((n, i) => `<img loading="lazy" src="${img(n)}" alt="${esc(b.labels[i])}" class="${i ? "" : "on"}">`).join("")}<span class="pl-flab">${esc(b.labels[0])}</span></div>
        <div class="pl-bookbar"><button type="button" class="pl-btn pl-playb">▶ Play</button><input type="range" min="0" max="${b.src.length - 1}" value="0" step="1" aria-label="Time-lapse frame"></div>
        <figcaption>${b.cap}<span class="pl-src">From the lecture slides</span></figcaption></figure>`,
      wire(el, b) {
        const fr = [...el.querySelectorAll(".pl-frames img")], lab = el.querySelector(".pl-flab"), rg = el.querySelector("input"), pb = el.querySelector(".pl-playb");
        let t = 0;
        const show = i => { fr.forEach((f, j) => f.classList.toggle("on", j === i)); lab.textContent = b.labels[i]; rg.value = i };
        rg.oninput = () => { clearInterval(t); t = 0; pb.textContent = "▶ Play"; show(+rg.value) };
        pb.onclick = () => {
          if (t) { clearInterval(t); t = 0; pb.textContent = "▶ Play"; return }
          let i = +rg.value; if (i === fr.length - 1) i = -1; pb.textContent = "❚❚ Pause";
          t = setInterval(() => { i++; show(i); if (i >= fr.length - 1) { clearInterval(t); t = 0; pb.textContent = "▶ Play" } }, 900);
        };
      }
    },

    // Label the diagram: the slide's own figure with its labels removed. Tap a label, then tap the spot where it goes.
    label: {
      html: (b, k, d) => `${head(b, "Label the diagram", "🏷️")}
        <div class="pl-lab"><img src="${img(b.src + "-bare")}" alt="${esc(b.cap || "Diagram to label")}">${b.pins.map((p, i) => `<button type="button" class="pl-pin${d ? " ok" : ""}" data-i="${i}" style="left:${p[0] * 100}%;top:${p[1] * 100}%" aria-label="${d ? esc(p[2]) : "Empty label " + (i + 1)}">${d ? esc(p[2]) : "?"}</button>`).join("")}</div>
        ${d ? "" : `<div class="pl-bank">${shuffle(b.pins.map((p, i) => [p[2], i])).map(([t, i]) => `<button type="button" class="pl-chip" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div><p class="pl-tip">Tap a label, then tap the <b>?</b> where it belongs.</p>`}
        ${b.cap ? `<p class="pl-cap">${b.cap}</p>` : ""}${doneBar(d)}`,
      wire(el, b, k, done) {
        let sel = null, miss = 0, left = b.pins.length;
        el.querySelectorAll(".pl-chip").forEach(c => c.onclick = () => { el.querySelectorAll(".pl-chip").forEach(x => x.classList.remove("sel")); sel = c; c.classList.add("sel") });
        el.querySelectorAll(".pl-pin").forEach(p => p.onclick = () => {
          if (!sel || p.classList.contains("ok")) { if (!sel && !p.classList.contains("ok")) shake(el.querySelector(".pl-bank")); return }
          if (b.pins[+p.dataset.i][2] === sel.dataset.t) {
            p.classList.add("ok"); p.textContent = sel.dataset.t; sel.remove(); sel = null; left--;
            if (!left) done(miss === 0, `${miss} wrong tr${miss === 1 ? "y" : "ies"}`);
          } else { miss++; shake(p); shake(sel) }
        });
      }
    },

    // Put the steps in order: tap them in the order they happen
    order: {
      html: (b, k, d) => `${head(b, "Put it in order", "🔢")}
        <ol class="pl-seq">${d ? b.items.map(t => `<li class="ok">${t}</li>`).join("") : ""}</ol>
        ${d ? "" : `<div class="pl-pool">${shuffle(b.items.map((t, i) => [t, i])).map(([t, i]) => `<button type="button" class="pl-chip" data-i="${i}">${t}</button>`).join("")}</div><p class="pl-tip">Tap the steps in the order they happen.</p>`}${doneBar(d)}`,
      wire(el, b, k, done) {
        let next = 0, miss = 0; const seq = el.querySelector(".pl-seq");
        el.querySelectorAll(".pl-pool .pl-chip").forEach(c => c.onclick = () => {
          if (+c.dataset.i === next) { const li = document.createElement("li"); li.className = "ok pop"; li.innerHTML = c.innerHTML; seq.appendChild(li); c.remove(); next++; if (next === b.items.length) done(miss === 0, `${miss} wrong tap${miss === 1 ? "" : "s"}`) }
          else { miss++; shake(c) }
        });
      }
    },

    // Match pairs: tap something on the left, then its partner on the right
    match: {
      html: (b, k, d) => `${head(b, "Match them up", "🔗")}
        ${d ? `<div class="pl-pairs">${b.pairs.map(([a, z]) => `<div class="pl-pair"><b>${a}</b><span>${z}</span></div>`).join("")}</div>`
          : `<div class="pl-match"><div class="pl-col">${shuffle(b.pairs.map((p, i) => [p[0], i])).map(([t, i]) => `<button type="button" class="pl-chip pl-a" data-i="${i}">${t}</button>`).join("")}</div>
          <div class="pl-col">${shuffle(b.pairs.map((p, i) => [p[1], i])).map(([t, i]) => `<button type="button" class="pl-chip pl-z" data-i="${i}">${t}</button>`).join("")}</div></div><p class="pl-tip">Tap one on the left, then its match on the right.</p>`}${doneBar(d)}`,
      wire(el, b, k, done) {
        let a = null, miss = 0, left = b.pairs.length, hue = 0;
        el.querySelectorAll(".pl-a").forEach(c => c.onclick = () => { if (c.disabled) return; el.querySelectorAll(".pl-a").forEach(x => x.classList.remove("sel")); a = c; c.classList.add("sel") });
        el.querySelectorAll(".pl-z").forEach(z => z.onclick = () => {
          if (!a) { shake(z); return }
          if (a.dataset.i === z.dataset.i) {
            const col = ["#34c759", "#0a84ff", "#ff9f0a", "#bf5af2", "#ff375f", "#30b0c7", "#ac8e68", "#5e5ce6", "#64d2ff"][hue++ % 9];
            [a, z].forEach(x => { x.disabled = true; x.classList.remove("sel"); x.classList.add("paired"); x.style.setProperty("--pc", col) }); a = null; left--;
            if (!left) done(miss === 0, `${miss} wrong match${miss === 1 ? "" : "es"}`);
          } else { miss++; shake(z); shake(a) }
        });
      }
    },

    // Sort the cards into bins: tap a card, then the bin it belongs in
    sort: {
      html: (b, k, d) => `${head(b, "Sort it", "🗂️")}
        <div class="pl-bins" style="--n:${b.bins.length}">${b.bins.map((n, j) => `<div class="pl-bin" data-j="${j}"><button type="button" class="pl-binh" data-j="${j}">${n}</button><div class="pl-bin-in">${d ? b.items.filter(x => x[1] === j).map(x => `<span class="pl-card ok">${x[0]}</span>`).join("") : ""}</div></div>`).join("")}</div>
        ${d ? "" : `<div class="pl-pool">${shuffle(b.items.map((x, i) => [x[0], i])).map(([t, i]) => `<button type="button" class="pl-chip" data-i="${i}">${t}</button>`).join("")}</div><p class="pl-tip">Tap a card, then tap the box it belongs in.</p>`}${doneBar(d)}`,
      wire(el, b, k, done) {
        let sel = null, miss = 0, left = b.items.length;
        el.querySelectorAll(".pl-pool .pl-chip").forEach(c => c.onclick = () => { el.querySelectorAll(".pl-pool .pl-chip").forEach(x => x.classList.remove("sel")); sel = c; c.classList.add("sel") });
        el.querySelectorAll(".pl-binh").forEach(h => h.onclick = () => {
          if (!sel) { shake(el.querySelector(".pl-pool")); return }
          if (b.items[+sel.dataset.i][1] === +h.dataset.j) {
            const s = document.createElement("span"); s.className = "pl-card ok pop"; s.innerHTML = sel.innerHTML; h.nextElementSibling.appendChild(s); sel.remove(); sel = null; left--;
            if (!left) done(miss === 0, `${miss} wrong drop${miss === 1 ? "" : "s"}`);
          } else { miss++; shake(sel); shake(h) }
        });
      }
    },

    // The clicker table: which plant groups have which key traits? Tap cells to tick them, then check.
    table: {
      html: (b, k, d) => `${head(b, "Fill in the table", "✅")}
        <div class="pl-tablewrap"><table class="pl-table"><tr><th></th>${b.cols.map(c => `<th>${c}</th>`).join("")}</tr>
        ${b.rows.map((r, i) => `<tr><th>${r}</th>${b.cols.map((c, j) => `<td><button type="button" class="pl-cell${d && b.ans[i][j] ? " on ok" : ""}" data-i="${i}" data-j="${j}" aria-label="${esc(r)} have ${esc(c)}" aria-pressed="${!!(d && b.ans[i][j])}"></button></td>`).join("")}</tr>`).join("")}</table></div>
        ${d ? "" : `<div class="pl-row"><button type="button" class="pl-btn pri pl-check">Check my table</button><span class="pl-msg"></span></div>`}${doneBar(d)}`,
      wire(el, b, k, done) {
        let tries = 0;
        el.querySelectorAll(".pl-cell").forEach(c => c.onclick = () => { if (el.querySelector(".pl-check")) { c.classList.toggle("on"); c.classList.remove("bad", "ok"); c.setAttribute("aria-pressed", c.classList.contains("on")) } });
        const chk = el.querySelector(".pl-check"); if (!chk) return;
        chk.onclick = () => {
          tries++; let wrong = 0;
          el.querySelectorAll(".pl-cell").forEach(c => { const want = !!b.ans[+c.dataset.i][+c.dataset.j], on = c.classList.contains("on"); c.classList.toggle("bad", want !== on); c.classList.toggle("ok", want && on); if (want !== on) wrong++ });
          if (!wrong) done(tries === 1, tries === 1 ? "first try" : `${tries} tries`);
          else el.querySelector(".pl-msg").textContent = `${wrong} cell${wrong > 1 ? "s" : ""} to fix (shown in red). Tap to change, then check again.`;
        };
      }
    },

    flip: {
      html: (b, k, d) => `${head(b, "Flip cards", "🃏")}<div class="pl-flips">${b.cards.map(([f, bk], i) => `<button type="button" class="pl-flip" data-i="${i}"><span class="f">${f}</span><span class="b">${bk}</span></button>`).join("")}</div><p class="pl-tip">Say the answer to yourself, then tap to flip.</p>${doneBar(d)}`,
      wire(el, b, k, done) {
        const seen = new Set();
        el.querySelectorAll(".pl-flip").forEach(c => c.onclick = () => { c.classList.toggle("on"); seen.add(c.dataset.i); if (seen.size === b.cards.length) done(false, "all flipped", true) });
      }
    },

    sim: { html: (b, k, d) => SIM[b.kind].html(b, d), wire: (el, b, k, done) => SIM[b.kind].wire(el, b, done) }
  };

  // ===== Simulations of the lecture's experiments
  const SIM = {};
  // Darwin, Boysen-Jensen: predict whether the coleoptile bends toward the light, then watch
  const COLEO = [
    ["Control", "Nothing done to it", "bend", "The tip senses light from one side; auxin moves to the shaded side, and the region below the tip bends toward the light."],
    ["Tip removed", "Darwin & Darwin", "none", "No tip, no response: the tip is what senses the light (and makes the signal)."],
    ["Opaque cap on the tip", "Darwin & Darwin", "none", "The tip can't see the light, so there's no bending even though the rest of the shoot is lit."],
    ["Clear cap on the tip", "Darwin & Darwin", "bend", "Light passes through the clear cap, so the tip still senses it: proof that the cap itself wasn't the problem."],
    ["Opaque shield below the tip", "Darwin & Darwin", "bend", "Only the tip needs light. The bending region can be covered and still bends."],
    ["Tip on a gelatin block", "Boysen-Jensen", "bend", "Chemicals can diffuse through gelatin, so the signal still reaches the stem: the signal is a mobile chemical."],
    ["Tip on a mica block", "Boysen-Jensen", "none", "Mica blocks chemicals, so the signal can't get down: no bending."]
  ];
  function coleoSVG(i, bend) {
    const tip = i !== 1, rot = bend ? -28 : 0;
    const cap = i === 2 ? `<path d="M44 34 Q50 20 56 34 Z" fill="#1d1d1f"/>` : i === 3 ? `<path d="M43.5 35 Q50 19 56.5 35 Z" fill="rgba(180,220,255,.35)" stroke="#5aa9e6" stroke-width="1.2"/>` : "";
    const block = i === 5 ? `<rect x="43" y="46" width="14" height="6" rx="1.5" fill="#f2d48a" stroke="#b8902d"/>` : i === 6 ? `<rect x="42" y="47" width="16" height="4" fill="#9aa3ad" stroke="#5d6670"/>` : "";
    const shield = i === 4 ? `<rect x="43.5" y="62" width="13" height="26" rx="2" fill="#1d1d1f"/>` : "";
    return `<svg viewBox="0 0 120 120" class="pl-coleo"><defs><linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b98a5a"/><stop offset="1" stop-color="#8b6239"/></linearGradient></defs>
      <circle cx="12" cy="46" r="7" fill="#ffd60a" stroke="#f5a400" stroke-width="1.5"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<path d="M12 36 V33" stroke="#f5a400" stroke-width="1.6" stroke-linecap="round" transform="rotate(${a} 12 46)"/>`).join("")}
      <path d="M24 42 H38 M24 50 H38" stroke="#f5c400" stroke-width="2" stroke-dasharray="3 3"/><path d="M36 39 l3 3 -3 3 M36 47 l3 3 -3 3" stroke="#f5c400" stroke-width="1.6" fill="none"/>
      <rect x="0" y="96" width="120" height="24" fill="url(#soil)"/>
      <path d="M46 96 L46 88 Q46 86 48 86 L52 86 Q54 86 54 88 L54 96Z" fill="#4caf50"/>
      <g class="pl-bend" style="transform:rotate(${rot}deg)">
        <path d="M46 88 L46 ${tip ? 38 : 50} ${tip ? "Q50 26 54 38" : "L54 50"} L54 88Z" fill="#5cc160" stroke="#2e7d32" stroke-width="1.2"/>
        ${block}${cap}${shield}
      </g></svg>`;
  }
  SIM.coleo = {
    html: (b, d) => `${head({ title: "Coleoptile experiments", how: "Predict, then watch. Light comes from the left." }, "", "🌱")}
      <div class="pl-sim pl-coleowrap"><div class="pl-stage">${coleoSVG(0, false)}</div>
      <div class="pl-side"><div class="pl-trials">${COLEO.map((c, i) => `<button type="button" class="pl-trial" data-i="${i}"><b>${c[0]}</b><small>${c[1]}</small><i></i></button>`).join("")}</div>
      <div class="pl-predict" hidden><p class="pl-q"></p><div class="pl-row"><button type="button" class="pl-btn" data-p="bend">Bends toward the light</button><button type="button" class="pl-btn" data-p="none">Doesn't bend</button></div></div>
      <p class="pl-out" aria-live="polite">Pick an experiment.</p></div></div>${doneBar(d)}`,
    wire(el, b, done) {
      let cur = -1, miss = 0; const res = {}, stage = el.querySelector(".pl-stage"), pr = el.querySelector(".pl-predict"), out = el.querySelector(".pl-out");
      el.querySelectorAll(".pl-trial").forEach(t => t.onclick = () => {
        cur = +t.dataset.i; el.querySelectorAll(".pl-trial").forEach(x => x.classList.toggle("sel", x === t));
        stage.innerHTML = coleoSVG(cur, false);
        if (res[cur]) { out.textContent = COLEO[cur][3]; pr.hidden = true; requestAnimationFrame(() => requestAnimationFrame(() => { const g = stage.querySelector(".pl-bend"); if (COLEO[cur][2] === "bend") g.style.transform = "rotate(-28deg)" })); return }
        pr.hidden = false; pr.querySelector(".pl-q").textContent = `${COLEO[cur][0]}: what will it do?`; out.textContent = "";
      });
      pr.querySelectorAll("[data-p]").forEach(p => p.onclick = () => {
        if (cur < 0) return; const ok = p.dataset.p === COLEO[cur][2]; if (!ok) miss++;
        res[cur] = 1; pr.hidden = true;
        const t = el.querySelector(`.pl-trial[data-i="${cur}"]`); t.classList.add(ok ? "right" : "wrong"); t.querySelector("i").textContent = ok ? "✓" : "✗";
        stage.innerHTML = coleoSVG(cur, false);
        setTimeout(() => { const g = stage.querySelector(".pl-bend"); if (COLEO[cur][2] === "bend") g.style.transform = "rotate(-28deg)" }, 60);
        out.innerHTML = `<b>${ok ? "You called it!" : "Surprise!"}</b> ${COLEO[cur][3]}`;
        if (Object.keys(res).length === COLEO.length) done(miss === 0, `${COLEO.length - miss} of ${COLEO.length} predicted`);
      });
    }
  };
  // Phytochrome: flash red / far-red light at lettuce seeds; the LAST flash decides
  SIM.phyto = {
    html: (b, d) => `${head({ title: "The lettuce-seed experiment", how: "Flash red (R) or far-red (FR) light at the seeds. Then test yourself." }, "", "💡")}
      <div class="pl-sim pl-phyto"><div class="pl-stage"><svg viewBox="0 0 160 90" class="pl-seeds">${[20, 55, 90, 125].map(x => `<g transform="translate(${x} 58)"><ellipse rx="11" ry="7" fill="#c9a26b" stroke="#7a5a2e" stroke-width="1.4"/><path class="sprout" d="M0 -4 Q-2 -18 6 -26" stroke="#4caf50" stroke-width="3" fill="none" stroke-linecap="round"/><path class="sprout" d="M6 -26 q6 -4 10 0 q-5 4 -10 0" fill="#66bb6a"/></g>`).join("")}</svg>
        <div class="pl-gauge"><span>Pr</span><b><i></i></b><span>Pfr</span></div></div>
      <div class="pl-side"><div class="pl-row"><button type="button" class="pl-btn pl-r" data-f="R">Red flash</button><button type="button" class="pl-btn pl-fr" data-f="FR">Far-red flash</button><button type="button" class="pl-btn" data-f="0">Back to dark</button></div>
      <div class="pl-flashes" aria-live="polite"></div><p class="pl-out">Seeds kept in the dark: Pr only, no germination.</p>
      <div class="pl-quiz"><b>Test yourself:</b> <span class="pl-qtext"></span><div class="pl-row"><button type="button" class="pl-btn" data-y="1">Germinates</button><button type="button" class="pl-btn" data-y="0">Stays dormant</button></div><span class="pl-qmsg"></span></div></div></div>${doneBar(d)}`,
    wire(el, b, done) {
      let seq = []; const st = el.querySelector(".pl-stage"), fl = el.querySelector(".pl-flashes"), out = el.querySelector(".pl-out");
      const paint = () => {
        const last = seq[seq.length - 1], germ = last === "R";
        fl.innerHTML = seq.length ? seq.map(f => `<span class="pl-f ${f === "R" ? "r" : "fr"}">${f}</span>`).join("→") : "";
        st.classList.toggle("germ", germ); st.querySelector(".pl-gauge i").style.width = (germ ? 85 : 8) + "%";
        out.innerHTML = !seq.length ? "Seeds kept in the dark: Pr only, no germination." : germ ? "<b>Last flash red:</b> Pr → Pfr (active). The seeds germinate!" : "<b>Last flash far-red:</b> Pfr → Pr. The seeds stay dormant.";
      };
      el.querySelectorAll("[data-f]").forEach(x => x.onclick = () => { if (x.dataset.f === "0") seq = []; else if (seq.length < 8) seq.push(x.dataset.f); paint() });
      const Q = shuffle([["R", "FR", "R"], ["R", "FR"], ["R", "FR", "R", "FR"], ["R", "FR", "R", "FR", "R"]]); let qi = 0, miss = 0;
      const qt = el.querySelector(".pl-qtext"), qm = el.querySelector(".pl-qmsg");
      const ask = () => { qt.innerHTML = Q[qi].map(f => `<span class="pl-f ${f === "R" ? "r" : "fr"}">${f}</span>`).join("→") + ` (${qi + 1} of ${Q.length})` };
      ask();
      el.querySelectorAll("[data-y]").forEach(y => y.onclick = () => {
        if (qi >= Q.length) return;
        const ans = Q[qi][Q[qi].length - 1] === "R", ok = (y.dataset.y === "1") === ans; if (!ok) miss++;
        seq = Q[qi].slice(); paint();
        qm.innerHTML = ok ? "✓ Right: the last flash wins." : `✗ The last flash was ${ans ? "red" : "far-red"}, so it ${ans ? "germinates" : "stays dormant"}.`;
        qi++; if (qi < Q.length) ask(); else { qt.textContent = "All done!"; done(miss === 0, `${Q.length - miss} of ${Q.length} right`) }
      });
    }
  };
  // Photoperiodism: set the night length and an optional flash; see which plant flowers
  SIM.night = {
    html: (b, d) => `${head({ title: "Night-length lab", how: "Critical night length here: 12 hours. Complete the 3 missions." }, "", "🌙")}
      <div class="pl-sim pl-night"><div class="pl-stage"><div class="pl-day"><i class="d"></i><i class="n"></i><em></em></div><div class="pl-hours"><span>Day <b class="dh"></b> h</span><span>Night <b class="nh"></b> h</span></div>
        <div class="pl-plants"><div class="pl-plant sdp"><svg viewBox="0 0 60 80"><path d="M30 78 V30" stroke="#3d8b40" stroke-width="3"/><path d="M30 60 q-14 -4 -18 -14 q12 0 18 10 M30 50 q14 -4 18 -14 q-12 0 -18 10" fill="#5cb85c"/><g class="bloom">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="30" cy="18" rx="5" ry="10" transform="rotate(${a} 30 26)" fill="#ffcc00" stroke="#d9a400"/>`).join("")}<circle cx="30" cy="26" r="5" fill="#a0522d"/></g><ellipse class="bud" cx="30" cy="27" rx="4" ry="6" fill="#7cc576"/></svg><b>Short-day plant</b><small></small></div>
          <div class="pl-plant ldp"><svg viewBox="0 0 60 80"><path d="M30 78 V30" stroke="#3d8b40" stroke-width="3"/><path d="M30 64 q-14 -4 -18 -14 q12 0 18 10 M30 54 q14 -4 18 -14 q-12 0 -18 10" fill="#5cb85c"/><g class="bloom">${[0, 120, 240].map(a => `<path d="M30 26 q-8 -14 0 -22 q8 8 0 22" transform="rotate(${a} 30 26)" fill="#a78bfa" stroke="#7c3aed"/>`).join("")}<circle cx="30" cy="26" r="3.5" fill="#fde047"/></g><ellipse class="bud" cx="30" cy="27" rx="4" ry="6" fill="#7cc576"/></svg><b>Long-day plant</b><small></small></div></div></div>
      <div class="pl-side"><label class="pl-slider">Night length <input type="range" min="6" max="18" step="1" value="10"></label>
        <div class="pl-row pl-flashpick" role="radiogroup" aria-label="Flash in the middle of the night">${[["", "No flash"], ["R", "Red flash"], ["RF", "Red then far-red"], ["RFR", "R, FR, R"]].map(([v, t], i) => `<button type="button" class="pl-btn${i ? "" : " on"}" data-v="${v}" role="radio" aria-checked="${!i}">${t}</button>`).join("")}</div>
        <ol class="pl-missions"><li data-m="0">Make the <b>short-day</b> plant flower.</li><li data-m="1">Set a 16-hour night, then make the <b>long-day</b> plant flower anyway.</li><li data-m="2">Keep a flash in the night but make the <b>short-day</b> plant flower.</li></ol>
        <p class="pl-out" aria-live="polite"></p></div></div>${doneBar(d)}`,
    wire(el, b, done) {
      const rg = el.querySelector("input"); let flash = "", got = new Set(), fin = false;
      const paint = () => {
        const night = +rg.value, interrupted = flash.endsWith("R") && flash !== "", longest = interrupted ? night / 2 : night;
        const sdp = longest >= 12, ldp = longest < 12;
        el.querySelector(".pl-day .d").style.width = (100 * (24 - night) / 24) + "%"; el.querySelector(".pl-day .n").style.width = (100 * night / 24) + "%";
        const em = el.querySelector(".pl-day em"); em.hidden = !flash; em.style.left = (100 * (24 - night / 2) / 24) + "%"; em.className = flash === "R" || flash === "RFR" ? "r" : "fr";
        el.querySelector(".dh").textContent = 24 - night; el.querySelector(".nh").textContent = night;
        el.querySelector(".sdp").classList.toggle("on", sdp); el.querySelector(".ldp").classList.toggle("on", ldp);
        el.querySelector(".sdp small").textContent = sdp ? "Flowering!" : "Not flowering"; el.querySelector(".ldp small").textContent = ldp ? "Flowering!" : "Not flowering";
        el.querySelector(".pl-out").innerHTML = interrupted ? `The red flash splits the night: the longest dark stretch is only <b>${longest} h</b>.` : flash ? `The far-red reverses the red flash, so the night counts as one unbroken <b>${night} h</b>.` : `One unbroken night of <b>${night} h</b>. Critical night length: 12 h.`;
        if (sdp) got.add(0); if (night === 16 && ldp) got.add(1); if (flash && sdp) got.add(2);
        got.forEach(m => el.querySelector(`[data-m="${m}"]`).classList.add("ok"));
        if (got.size === 3 && !fin) { fin = true; done(true, "all 3 missions") }
      };
      rg.oninput = paint;
      el.querySelectorAll(".pl-flashpick button").forEach(x => x.onclick = () => { flash = x.dataset.v; el.querySelectorAll(".pl-flashpick button").forEach(y => { y.classList.toggle("on", y === x); y.setAttribute("aria-checked", y === x) }); paint() });
      got = new Set(); paint(); got = new Set(); el.querySelectorAll(".pl-missions li").forEach(l => l.classList.remove("ok"));   // the starting setup doesn't count
    }
  };

  window.ReadPlay = {
    html(b, key, d) { const r = R[b.t]; return `<div class="pl pl--${b.t}" data-k="${key}">${r.html(b, key, d)}</div>` },
    wire(el, b, key, onDone) {
      const r = R[b.t]; if (!r) return;
      el.querySelectorAll(".pl-zoom").forEach(z => z.onclick = () => window.ReadPlay.zoom(z.dataset.src));
      const again = el.querySelector(".pl-again");
      if (again) again.onclick = () => { el.outerHTML = window.ReadPlay.html(b, key, null); const n = document.querySelector(`.pl[data-k="${key}"]`); window.ReadPlay.wire(n, b, key, onDone); n.dataset.replay = "1" };
      r.wire(el, b, key, (perfect, note, quiet) => onDone(el, perfect, note, quiet));
    },
    zoom(src) { const lb = document.getElementById("lightbox"); document.getElementById("lbImg").src = src; lb.hidden = false },
    confetti(el) {
      const r = el.getBoundingClientRect(), C = ["#ff9f0a", "#34c759", "#0a84ff", "#ff375f", "#bf5af2", "#ffd60a"];
      for (let i = 0; i < 26; i++) {
        const p = document.createElement("i"); p.className = "pl-conf";
        p.style.cssText = `left:${r.left + r.width / 2}px;top:${r.top + Math.min(r.height, innerHeight) / 3}px;background:${C[i % 6]};--dx:${(Math.random() - .5) * 360}px;--dy:${-80 - Math.random() * 160}px;--r:${Math.random() * 720}deg`;
        document.body.appendChild(p); setTimeout(() => p.remove(), 1300);
      }
    }
  };
})();

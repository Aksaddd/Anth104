// Class covers for the library: an original illustration per class, and the markup for a cover.
// Used by the front page's library and by the "what awaits you" walkthrough (shared/tour.js).
(() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // Cover art: an original illustration for each class, drawn in a 200 × 200 box (a class without one gets a plain cover).
  //   a104  language: speech bubbles in several scripts      bio  plants, fungi and signals: a mushroom, a fern, a sprout, the sun
  //   a102  human evolution: a family tree (cladogram) with one tip picked out
  const SERIF = `font-family="ui-serif,'New York','Iowan Old Style',Georgia,serif"`;
  const ART = {
    a104: `<path d="M30 38h72a14 14 0 0 1 14 14v36a14 14 0 0 1-14 14H64l-19 17v-17H30a14 14 0 0 1-14-14V52a14 14 0 0 1 14-14z" fill="#ff7a59"/>
      <text x="66" y="83" font-size="38" font-weight="700" text-anchor="middle" fill="#fff" ${SERIF}>Aa</text>
      <path d="M96 84h74a14 14 0 0 1 14 14v38a14 14 0 0 1-14 14h-15v17l-19-17H96a14 14 0 0 1-14-14V98a14 14 0 0 1 14-14z" fill="#ffc94d"/>
      <text x="133" y="132" font-size="36" font-weight="700" text-anchor="middle" fill="#0c1f57" ${SERIF}>文</text>
      <path d="M130 18h42a10 10 0 0 1 10 10v22a10 10 0 0 1-10 10h-23l-11 10V60h-8a10 10 0 0 1-10-10V28a10 10 0 0 1 10-10z" fill="#f6efe0"/>
      <text x="151" y="49" font-size="26" font-weight="700" text-anchor="middle" fill="#24439c" ${SERIF}>ñ</text>
      <path d="M26 132h40a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H50l-10 10v-10H26a10 10 0 0 1-10-10v-20a10 10 0 0 1 10-10z" fill="#5fd0c5"/>
      <text x="46" y="162" font-size="26" font-weight="700" text-anchor="middle" fill="#0c1f57" ${SERIF}>ع</text>`,
    bio: `<circle cx="158" cy="38" r="13" fill="#ffd166"/><g fill="none" stroke="#ffd166" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="1 7"><path d="M132 38a26 26 0 0 0 26 26"/><path d="M118 38a40 40 0 0 0 40 40"/></g>
      <g fill="none" stroke="#f3ead2" stroke-width="3.4" stroke-linecap="round"><path d="M42 178Q56 124 46 62"/></g>
      <g fill="#8fd19e">${[[48, 78, -62, 15], [44, 98, 58, 17], [52, 116, -60, 18], [46, 136, 60, 18], [56, 152, -58, 16], [48, 64, 40, 11]].map(([x, y, r, l]) => `<ellipse cx="${x + (r < 0 ? 12 : -12)}" cy="${y - 6}" rx="${l}" ry="5.4" transform="rotate(${r < 0 ? -28 : 28} ${x + (r < 0 ? 12 : -12)} ${y - 6})"/>`).join("")}</g>
      <path d="M97 106Q93 140 100 176H126Q133 140 129 106Z" fill="#f3ead2"/><path d="M99 118h28" stroke="#d9cdb0" stroke-width="2.4"/>
      <path d="M64 108Q64 60 113 60Q162 60 162 108Q113 96 64 108Z" fill="#e4572e"/>
      <g fill="#fff3d6"><circle cx="92" cy="84" r="6.4"/><circle cx="118" cy="74" r="5"/><circle cx="140" cy="90" r="6"/><circle cx="110" cy="94" r="3.4"/><circle cx="78" cy="98" r="3"/></g>
      <g stroke="#f3ead2" stroke-width="3" stroke-linecap="round" fill="none"><path d="M160 178v-26"/></g><path d="M160 156q-14-2-16-16q14 0 16 16zM160 162q14-2 16-16q-14 0-16 16z" fill="#8fd19e"/>
      <path d="M22 178h160" stroke="#f3ead2" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="2 8" opacity=".7"/>`,
    a102: `<g fill="none" stroke="#f6e7cf" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M100 184V152M58 152H142M58 152V118M142 152V118M36 118H80M120 118H164M36 118V62M80 118V86M120 118V46M164 118V74"/></g>
      <g fill="#f6e7cf"><circle cx="36" cy="56" r="8"/><circle cx="80" cy="80" r="8"/><circle cx="164" cy="68" r="8"/></g>
      <circle cx="120" cy="38" r="19" fill="#ffd166" opacity=".28"/><circle cx="120" cy="38" r="11" fill="#ffd166"/>
      <g fill="#7a2e12" opacity=".55"><circle cx="36" cy="56" r="3"/><circle cx="80" cy="80" r="3"/><circle cx="164" cy="68" r="3"/></g>`
  };
  const cover = (c, locked) => `<span class="cover${locked ? " locked" : ""}${ART[c.id] ? " art" : ""}" style="--c1:${c.cover[0]};--c2:${c.cover[1]}">${locked ? `<span class="lock" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 10V8a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zm2 0h6V8a3 3 0 0 0-6 0z"/></svg></span>` : ""}<span class="k">${esc(c.name)}<small>${esc(c.school)}</small></span>${ART[c.id] ? `<svg class="a" viewBox="0 0 200 200" aria-hidden="true">${ART[c.id]}</svg>` : ""}<span class="t">${esc(c.title)}</span>${c.professor ? `<span class="au">${esc(c.professor)}</span>` : ""}<span class="p">Eureka</span></span>`;
  // the styles a cover needs (the front page has them in its own stylesheet; the walkthrough's shadow root uses these)
  const CSS = `.cover{position:relative;display:flex;flex-direction:column;justify-content:space-between;aspect-ratio:2/3;border-radius:5px 9px 9px 5px;padding:12% 11% 10% 15%;color:#fff;overflow:hidden;background:linear-gradient(150deg,var(--c1),var(--c2));box-shadow:0 1px 1px rgba(0,0,0,.14),0 10px 22px -6px rgba(0,0,0,.34),0 22px 40px -18px rgba(0,0,0,.3)}
.cover::before{content:"";position:absolute;inset:0 auto 0 0;width:7%;background:linear-gradient(90deg,rgba(0,0,0,.28),rgba(255,255,255,.22) 45%,rgba(0,0,0,.12) 70%,transparent)}
.cover::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 80% at 80% 0%,rgba(255,255,255,.3),transparent 55%);pointer-events:none}
.cover .k{position:relative;font:600 .62em/1.2 -apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.9}
.cover .k small{display:block;margin-top:.5em;font-size:.82em;font-weight:500;letter-spacing:.02em;text-transform:none;opacity:.82}
.cover .t{position:relative;font:700 1.02em/1.08 ui-serif,"New York","Iowan Old Style",Georgia,serif;letter-spacing:-.01em;margin-top:auto}
.cover .au{position:relative;font:500 .6em/1.25 -apple-system,BlinkMacSystemFont,sans-serif;opacity:.9;margin-top:.55em}
.cover .p{position:relative;font:600 .56em/1 -apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:.14em;text-transform:uppercase;opacity:.82;margin-top:.9em}
.cover .a{position:relative;display:block;width:86%;margin:4% auto 6% 0;flex:1;min-height:0}
.cover.art{justify-content:flex-start;padding:10% 10% 9% 14%}`;
  window.EurekaCovers = { ART, cover, CSS };
})();

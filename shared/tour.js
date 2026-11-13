// Two more walkthroughs for the "What is Eureka?" explanation (shared/about.js adds them after "What's inside a class"):
//   1. "Your library": a typical student's library, as a preview of what signing in opens.
//   2. "Study companions": what it is like to study with one (find the tag, adopt, earn XP, watch it grow).
// Each is a stage of scenes on a timer (six for the library: the shelf, four portals of a class, the shelf again; four for companions), like the first demonstration: it loops, pauses off screen, shows its last
// scene for reduced motion, and a click on it (or its dots) moves it along. Everything shown is sample data.
(() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const CSS = `
.tour{max-width:980px;margin:46px auto 0}
.tstage{--paper:#fff;--ink:#1d1d1f;--muted:#6e6e73;--faint:#86868b;--line:#d2d2d7;--alt:#f5f5f7;--accent:#0071e3;--good:#248a3d;color:#1d1d1f;position:relative;aspect-ratio:16/10;border-radius:28px;overflow:hidden;cursor:pointer;text-align:left;
  background:linear-gradient(160deg,#fff,#f1f1f4);box-shadow:0 40px 120px -30px rgba(0,0,0,.8),0 0 0 1px rgba(255,255,255,.14),0 0 90px rgba(120,160,255,.12);font-size:clamp(8.5px,1.42vw,15px)}
.tstage.warm{background:linear-gradient(160deg,#fff7ea,#ffe9cf)}
.tstage *{letter-spacing:-.015em;box-sizing:border-box}
.tsc{position:absolute;inset:0;opacity:0;transition:opacity .6s ease;pointer-events:none}
.tstage[data-s="1"] .t1,.tstage[data-s="2"] .t2,.tstage[data-s="3"] .t3,.tstage[data-s="4"] .t4,.tstage[data-s="5"] .t5,.tstage[data-s="6"] .t6{opacity:1}
.tcap{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:20px;min-height:28px;flex-wrap:wrap}
.tcap p{margin:0;font:500 17px/1.3 var(--display);color:#f5f5f7}
.tdots{display:flex;gap:8px}.tdots button{width:8px;height:8px;border-radius:50%;border:0;padding:0;background:rgba(255,255,255,.3);cursor:pointer;transition:background .3s,width .3s}
.tdots button[aria-current="true"]{background:#fff;width:22px;border-radius:980px}
.tsample{margin:10px 0 0;font-size:13px;color:rgba(235,238,245,.5);text-align:center}
/* ----- library walkthrough: a little app window */
.win{position:absolute;inset:5% 6%;background:#fff;border-radius:1.2em;box-shadow:0 1.2em 3.4em rgba(0,0,0,.18);display:grid;grid-template-columns:22% 1fr;overflow:hidden}
.win aside{background:#f5f5f7;padding:1.1em .8em;display:flex;flex-direction:column;gap:.2em;border-right:1px solid #e5e5ea}
.win aside b{font:700 1.2em/1 var(--display);padding:.2em .5em .9em}
.win aside span{font-size:.82em;padding:.55em .6em;border-radius:.6em;color:#1d1d1f;display:flex;justify-content:space-between}
.win aside span.on{background:#e3e3e8;font-weight:600}
.win aside small{font:600 .68em/1 var(--body);color:#86868b;padding:1em .6em .4em}
.win aside .who{margin-top:auto;display:flex;align-items:center;gap:.5em;font-size:.78em;padding:.4em .5em}
.win aside .who i{width:1.9em;height:1.9em;border-radius:50%;background:linear-gradient(135deg,#ff9f0a,#ff375f);display:grid;place-items:center;color:#fff;font:700 .85em var(--body);font-style:normal}
.win main{padding:1.2em 1.4em;min-width:0;position:relative}
.win h5{margin:0 0 .7em;font:700 1.5em/1.1 var(--display)}
.cont2{display:grid;grid-template-columns:16% 1fr;gap:1.1em;align-items:center;background:#f5f5f7;border-radius:1em;padding:1em}
.cont2 .cover{font-size:.44em}
.cont2 .k2{font:600 .66em/1 var(--body);color:#86868b;text-transform:uppercase;letter-spacing:.04em}
.cont2 h6{margin:.35em 0 .2em;font:700 1.18em/1.1 var(--display)}
.cont2 .sm{font-size:.74em;color:#6e6e73}
.cont2 .bar{height:.36em;border-radius:980px;background:#e0e0e5;margin:.6em 0 .4em;max-width:60%;overflow:hidden}
.cont2 .bar i{display:block;height:100%;width:42%;border-radius:inherit;background:#0071e3;transition:width 1.2s ease .4s}
.cont2 .pillx{display:inline-block;margin-top:.6em;font:500 .8em/1 var(--body);color:#fff;background:#0071e3;border-radius:980px;padding:.55em 1.1em;transition:transform .15s}
.shelf2{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1em;margin-top:1.1em}
.shelf2 .cover{font-size:.5em}
.shelf2 small{display:flex;justify-content:space-between;font-size:.7em;color:#86868b;margin-top:.5em}
.shelf2 .bk{position:relative}
.star2{position:absolute;left:8%;top:5%;z-index:2;width:1.5em;height:1.5em;border-radius:50%;background:rgba(0,0,0,.36);display:grid;place-items:center;color:#ffd60a;font-size:.8em;opacity:0;transform:scale(.4);transition:opacity .3s ease 1.5s,transform .4s cubic-bezier(.3,1.6,.5,1) 1.5s}
.chips2{display:flex;gap:.5em;margin:.9em 0 0}.chips2 span{font:500 .72em/1 var(--body);background:#f5f5f7;border-radius:980px;padding:.55em .9em}.chips2 span.on{background:#1d1d1f;color:#fff}
.chips2 .newc{opacity:0;transform:translateX(-.6em);transition:opacity .4s ease 2s,transform .4s ease 2s;background:#e8f1fc;color:#0071e3}
.menu2{position:absolute;right:30%;top:44%;width:13.5em;background:rgba(255,255,255,.96);border-radius:.9em;box-shadow:0 .8em 2.4em rgba(0,0,0,.24),0 0 0 .5px rgba(0,0,0,.1);padding:.35em;opacity:0;transform:scale(.94);transform-origin:top right;transition:opacity .3s ease .5s,transform .3s ease .5s;font-size:.78em}
.menu2 div{padding:.6em .7em;border-radius:.55em;display:flex;justify-content:space-between}.menu2 div.hi{background:#e8f1fc;color:#0071e3;font-weight:600}
.menu2 hr{border:0;border-top:1px solid #e5e5ea;margin:.25em .4em}
/* ----- inside a class: one window per portal (readings, drill, mock exam, discussion), each laid out differently */
.cw{position:absolute;inset:5% 6%;background:#fff;border-radius:1.2em;box-shadow:0 1.2em 3.4em rgba(0,0,0,.18);overflow:hidden;display:flex;flex-direction:column}
.cnav{display:flex;align-items:center;gap:1.5em;padding:.85em 1.4em;border-bottom:1px solid #e5e5ea;font-size:.8em;color:#6e6e73;flex:none}
.cnav b{font:700 1.25em/1 var(--display);color:#1d1d1f;margin-right:auto}
.cnav span.on{color:#fff;background:#1d1d1f;border-radius:980px;padding:.45em .95em;font-weight:600}
.k3{display:block;font:600 .64em/1.2 var(--body);color:#86868b;text-transform:uppercase;letter-spacing:.05em}
.rd{position:relative;flex:1;padding:1.5em 16% 0;background:#fbf8f1}
.rprog{position:absolute;left:0;right:0;top:0;height:.28em;background:#ece6d8}.rprog i{display:block;height:100%;width:22%;background:#0071e3;transition:width 2.6s ease .3s}
.lib[data-s="2"] .rprog i{width:64%}
.rd h5{margin:.45em 0 .5em;font:700 1.55em/1.12 ui-serif,"New York",Georgia,serif;letter-spacing:-.01em}
.rd p{margin:0;font:400 .98em/1.62 ui-serif,"New York",Georgia,serif;color:#2b2b2e}
.rd mark{background:linear-gradient(#ffe9a6,#ffe9a6) no-repeat 0 0/0 100%;color:inherit;transition:background-size 1.4s ease .7s}
.lib[data-s="2"] .rd mark{background-size:100% 100%}
.rd .p2{margin-top:.8em}
@media (max-width:700px){.rd .p2{display:none}.bub{top:58%}}
.rd u{text-decoration:underline dotted #0071e3;text-underline-offset:.2em}
.bub{position:absolute;left:21%;top:50%;width:15.5em;background:#1d1d1f;color:#fff;border-radius:.9em;padding:.75em .9em;box-shadow:0 .8em 2.2em rgba(0,0,0,.3);opacity:0;transform:translateY(.6em) scale(.96);transition:opacity .4s ease 2.2s,transform .4s ease 2.2s}
.bub b{display:block;font:700 .92em/1.2 var(--display)}.bub span{display:block;font-size:.74em;line-height:1.35;opacity:.8;margin-top:.2em}.bub em{display:inline-block;font:600 .66em/1 var(--body);font-style:normal;color:#64b5ff;margin-top:.6em}
.lib[data-s="2"] .bub{opacity:1;transform:none}
.chk{position:absolute;left:16%;right:16%;bottom:7%;display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #e6dfd0;border-radius:.9em;padding:.7em 1em;font-size:.8em}
.chk span{font-weight:600}.chk b{color:#248a3d}
.dr{flex:1;display:grid;grid-template-columns:1fr 32%;gap:1.6em;padding:1.6em 1.8em;align-items:start;font-size:1.12em;background:#f5f5f7;min-height:0}
.dq{background:#fff;border-radius:1em;padding:1.1em 1.2em}
.dq h6{margin:.5em 0 .6em;font:700 1.08em/1.25 var(--display)}
.dq .o{border:1.5px solid #d2d2d7;border-radius:.8em;padding:.5em .8em;margin-top:.4em;font-size:.84em;display:flex;justify-content:space-between;transition:background .3s ease .9s,border-color .3s ease .9s,color .3s ease .9s}
.dq .o b{opacity:0;transition:opacity .3s ease .9s}
.lib[data-s="3"] .dq .o.ok{background:#e5f6e9;border-color:#248a3d;color:#248a3d;font-weight:600}.lib[data-s="3"] .dq .o.ok b{opacity:1}
.whyx{margin:.7em 0 0;font-size:.76em;line-height:1.45;color:#424245;background:#f5f5f7;border-radius:.7em;padding:.6em .8em;opacity:0;transform:translateY(.5em);transition:opacity .4s ease 1.6s,transform .4s ease 1.6s}
.lib[data-s="3"] .whyx{opacity:1;transform:none}
.subj{display:flex;flex-direction:column;gap:.75em;padding-top:.3em}
.subj div span{display:block;font-size:.76em;font-weight:500}
.subj div i{display:block;height:.42em;border-radius:980px;background:#e0e0e5;margin-top:.35em;overflow:hidden}
.subj div u{display:block;height:100%;width:0;border-radius:inherit;background:#0071e3;transition:width 1.2s ease .5s}
.lib[data-s="3"] .subj div u{width:var(--w)}
.subj em{font:600 .72em/1 var(--body);font-style:normal;color:#c93400;margin-top:.4em}
.mk{flex:1;display:grid;grid-template-columns:1fr 30%;gap:1.6em;padding:1.3em 1.6em;background:#1d1d1f;color:#f5f5f7;align-items:center;min-height:0}
.mk .k3{color:#98989f;margin-top:.5em}
.mhead{display:flex;justify-content:space-between;align-items:center}.mhead b{font:700 1.4em/1 var(--display)}
.clock{font:600 .9em/1 ui-monospace,SFMono-Regular,Menlo,monospace;background:rgba(255,255,255,.12);border-radius:980px;padding:.5em .9em;letter-spacing:0}
.grid2{position:relative;margin-top:1em}
.cells{display:grid;grid-template-columns:repeat(10,1fr);gap:.4em}
.cells i{aspect-ratio:1;border-radius:.4em;background:rgba(255,255,255,.1);display:grid;place-items:center;font:600 .6em/1 var(--body);font-style:normal;color:rgba(255,255,255,.5)}
.cells.done{position:absolute;inset:0;clip-path:inset(0 100% 0 0);transition:clip-path 2.4s steps(10) .4s}
.cells.done i{background:#30d158;color:#04310f}.cells.done i.x{background:#ff453a;color:#fff}
.lib[data-s="4"] .cells.done{clip-path:inset(0)}
.score{position:relative;text-align:center;opacity:0;transform:scale(.9);transition:opacity .5s ease 2.9s,transform .5s ease 2.9s}
.lib[data-s="4"] .score{opacity:1;transform:none}
.score svg{width:78%;display:block;margin:0 auto}
.ring2{stroke:#30d158;stroke-dasharray:314;stroke-dashoffset:314;transition:stroke-dashoffset 1.2s ease 3.1s}
.lib[data-s="4"] .ring2{stroke-dashoffset:47}
.score b{position:absolute;left:0;right:0;top:27%;font:700 1.9em/1 var(--display)}
.score span{display:block;font-size:.8em;color:#98989f;margin-top:.5em}.score em{display:block;font:600 .74em/1 var(--body);font-style:normal;color:#64b5ff;margin-top:.7em}
.ds{flex:1;padding:1.1em 14% 0;display:flex;flex-direction:column;gap:.6em;background:#fff;min-height:0}
.prompt{background:#eef5ff;border-radius:1em;padding:.9em 1.1em}
.prompt h6{margin:.5em 0 0;font:700 1.02em/1.3 var(--display)}
.beta{font:700 .9em/1 var(--body);font-style:normal;color:#fff;background:#0071e3;border-radius:980px;padding:.2em .6em;margin-left:.5em;letter-spacing:.04em}
.rep{display:flex;gap:.7em;align-items:flex-start;opacity:0;transform:translateY(.6em);transition:opacity .45s ease,transform .45s ease}
.rep i{flex:none;width:2em;height:2em;border-radius:50%;display:grid;place-items:center;color:#fff;font:700 .8em var(--body);font-style:normal}
.rep p{margin:0;font-size:.8em;line-height:1.4;background:#f5f5f7;border-radius:.2em 1em 1em 1em;padding:.55em .85em}.rep p b{display:block;font-size:.9em}
.lib[data-s="5"] .rep{opacity:1;transform:none}.lib[data-s="5"] .rep:nth-of-type(2){transition-delay:.6s}.lib[data-s="5"] .rep:nth-of-type(3){transition-delay:1.4s}.lib[data-s="5"] .rep:nth-of-type(4){transition-delay:2.2s}
.write2{margin-top:auto;margin-bottom:1em;border:1.5px solid #d2d2d7;border-radius:980px;padding:.6em 1em;font-size:.78em;color:#86868b}
/* scene states */
.lib[data-s="6"] .cont2 .bar i{width:58%}
.lib[data-s="1"] .cont2 .pillx{animation:tPress .5s ease 2.6s}
@keyframes tPress{50%{transform:scale(.9)}}
.lib[data-s="6"] .menu2{opacity:1;transform:none}
.lib[data-s="6"] .star2{opacity:1;transform:none}
.lib[data-s="6"] .chips2 .newc{opacity:1;transform:none}
.toast2{position:absolute;left:50%;bottom:7%;transform:translate(-50%,1em);background:#1d1d1f;color:#fff;border-radius:980px;padding:.7em 1.2em;font:500 .8em/1 var(--body);opacity:0;transition:opacity .4s ease .9s,transform .4s ease .9s;white-space:nowrap}
.lib[data-s="6"] .toast2{opacity:1;transform:translate(-50%,0)}
.devs{position:absolute;inset:0;display:grid;place-items:center;background:linear-gradient(160deg,#fff,#f1f1f4)}
.devs .row2{display:flex;align-items:flex-end;gap:4%;width:78%}
.lap{flex:1;aspect-ratio:16/10;background:#fff;border:.5em solid #1d1d1f;border-radius:1em;box-shadow:0 1em 3em rgba(0,0,0,.2);padding:.8em;display:grid;grid-template-columns:repeat(3,1fr);gap:.7em;align-content:center}
.pho{width:17%;aspect-ratio:9/18;background:#fff;border:.4em solid #1d1d1f;border-radius:1.3em;box-shadow:0 1em 3em rgba(0,0,0,.2);padding:.6em .45em;display:flex;flex-direction:column;gap:.5em;justify-content:center}
.lap .cover{font-size:.4em}.pho .cover{font-size:.3em}
.syncl{position:absolute;bottom:9%;left:0;right:0;text-align:center;font:500 .9em/1 var(--body);color:#6e6e73}
.syncl b{color:#248a3d}
/* ----- companions walkthrough */
.cmp .mid{position:absolute;inset:0;display:grid;place-items:center}
.navx{width:78%;background:#fff;border-radius:1em;box-shadow:0 1em 3em rgba(0,0,0,.14);padding:1em 1.3em;display:flex;align-items:center;gap:1.4em;font-size:.86em}
.navx b{font:700 1.2em/1 var(--display);margin-right:auto}
.navx span{color:#424245}
.navx .cl{color:#1d1d1f;font-weight:600;display:inline-flex;align-items:center;gap:.5em;position:relative}
.ntag{padding:.25em .6em;border-radius:980px;font:700 .68em/1.3 var(--body);letter-spacing:.04em;color:#fff;background:linear-gradient(110deg,#ff9f0a 0%,#ff9f0a 32%,#ffe7a8 48%,#fff6dc 50%,#ffe7a8 52%,#ff9f0a 68%,#ff9f0a 100%);background-size:260% 100%;animation:tShine 2.6s linear infinite;box-shadow:0 .2em .8em rgba(255,159,10,.5)}
@keyframes tShine{from{background-position:130% 0}to{background-position:-130% 0}}
.hintx{position:absolute;top:63%;left:0;right:0;text-align:center;font:italic 400 1.05em/1.4 ui-serif,Georgia,serif;color:#8a6a3a}
.cafe2{display:flex;gap:5%;align-items:flex-end;justify-content:center;width:84%}
.pet{flex:1;max-width:24%;background:#fff;border-radius:1.2em;box-shadow:0 .8em 2.2em rgba(120,70,20,.16);padding:.9em .7em 1em;text-align:center;transition:transform .5s cubic-bezier(.3,1.5,.5,1) .9s,box-shadow .4s ease .9s}
.pet svg{width:100%;height:auto;display:block}
.pet b{display:block;font:700 1em/1.2 var(--display)}.pet small{display:block;font-size:.72em;color:#86868b;margin-top:.15em}
.pet .adopt{display:inline-block;margin-top:.7em;font:600 .72em/1 var(--body);border-radius:980px;padding:.55em 1em;background:#f5f5f7;color:#86868b;transition:background .3s ease 1.1s,color .3s ease 1.1s}
.cmp[data-s="2"] .pet.pick{transform:translateY(-8%) scale(1.07);box-shadow:0 1.4em 3em rgba(255,140,0,.35)}
.cmp[data-s="2"] .pet.pick .adopt{background:linear-gradient(135deg,#ff9f0a,#ff6b00);color:#fff}
.study{width:84%;display:grid;grid-template-columns:1fr 34%;gap:5%;align-items:center}
.qx{background:#fff;border-radius:1.2em;box-shadow:0 1em 3em rgba(0,0,0,.14);padding:1.2em 1.3em}
.qx h6{margin:0 0 .7em;font:700 1.05em/1.25 var(--display)}
.qx div{border:1.5px solid #d2d2d7;border-radius:.8em;padding:.55em .8em;margin-top:.45em;font-size:.86em;transition:background .3s ease 1s,border-color .3s ease 1s,color .3s ease 1s}
.cmp[data-s="3"] .qx div.ok{background:#e5f6e9;border-color:#248a3d;color:#248a3d;font-weight:600}
.buddy{position:relative;text-align:center}
.buddy svg{width:100%;height:auto;display:block}
.cmp[data-s="3"] .buddy svg{animation:tHop .7s cubic-bezier(.3,1.6,.5,1) 1.2s 2}
@keyframes tHop{50%{transform:translateY(-12%)}}
.xpf{position:absolute;right:-4%;top:6%;font:800 1.25em/1 var(--body);color:#248a3d;opacity:0}
.cmp[data-s="3"] .xpf{animation:tXp 1.8s ease 1.3s forwards}
@keyframes tXp{0%{opacity:0;transform:translateY(40%)}25%{opacity:1}100%{opacity:0;transform:translateY(-70%)}}
.xpb2{height:.5em;border-radius:980px;background:rgba(0,0,0,.1);overflow:hidden;margin:.5em 8% 0}.xpb2 i{display:block;height:100%;width:35%;background:linear-gradient(90deg,#34c759,#30d158);border-radius:inherit;transition:width 1s ease 1.4s}
.cmp[data-s="3"] .xpb2 i{width:78%}
.buddy small{display:block;font:600 .78em/1 var(--body);color:#6e6e73;margin-top:.5em}
.grow{width:92%;display:flex;align-items:flex-end;justify-content:center;gap:2%}
.grow .g{flex:1;text-align:center;opacity:0;transform:translateY(1em);transition:opacity .5s ease,transform .5s ease}
.grow .g svg{display:block;margin:0 auto;height:auto}
.grow .g b{display:block;font:700 .92em/1.2 var(--display);margin-top:.3em}.grow .g small{display:block;font-size:.7em;color:#86868b}
.grow .arr{font-size:1.4em;color:#c9a06a;padding-bottom:18%;opacity:0;transition:opacity .4s ease}
.cmp[data-s="4"] .grow .g,.cmp[data-s="4"] .grow .arr{opacity:1;transform:none}
.cmp[data-s="4"] .grow>:nth-child(2){transition-delay:.5s}.cmp[data-s="4"] .grow>:nth-child(3){transition-delay:.8s}.cmp[data-s="4"] .grow>:nth-child(4){transition-delay:1.3s}.cmp[data-s="4"] .grow>:nth-child(5){transition-delay:1.6s}
.grow .side{flex:.9;border-left:1px dashed #d9b98a;padding-left:3%;margin-left:1%}
.cmp[data-s="4"] .grow .side{transition-delay:2.2s}
.gate2{margin:30px auto 0;display:flex;justify-content:center;gap:20px;flex-wrap:wrap;align-items:center}
@media (prefers-reduced-motion:reduce){.tsc,.pet,.grow .g,.grow .arr,.cont2 .bar i,.menu2,.star2,.chips2 .newc,.toast2,.xpb2 i,.qx div,.rprog i,.rd mark,.bub,.dq .o,.dq .o b,.whyx,.subj div u,.cells.done,.score,.ring2,.rep{transition:none!important}.lib .cont2 .pillx{animation:none!important}.ntag,.cmp[data-s="3"] .buddy svg,.cmp[data-s="3"] .xpf{animation:none!important}}
`;
  function html(lib) {
    const P = window.Platform, CV = window.EurekaCovers, A = window.COMPANION_ART || {};
    const byId = id => P.COURSES.find(c => c.id === id), cov = id => CV.cover(byId(id));
    // the bar across the top of a class page, with one portal lit
    const cnav = on => `<div class="cnav"><b>ANTH 104</b>${["Readings", "Drill", "Mock Exam", "Discussion", "Syllabus"].map(n => `<span${n === on ? ' class="on"' : ""}>${n}</span>`).join("")}</div>`;
    // the 40 squares of a mock exam; in the answered copy six are marked as missed
    const cells = k => Array.from({ length: 40 }, (_, n) => `<i${k && [4, 11, 17, 23, 30, 36].includes(n) ? ' class="x"' : ""}>${n + 1}</i>`).join("");
    // the library window (scenes 1 and 6 both show it; what is lit inside depends on the scene)
    const win = `<div class="win">
        <aside><b>Eureka</b><span class="on">Studying Now</span><small>Library</small><span>All Classes <i style="font-style:normal;color:#86868b">3</i></span><span>Favorites</span><span>Finished</span><small>My Collections</small><span>This semester</span><span class="who"><i>M</i>Maya R.</span></aside>
        <main><h5>Studying Now</h5>
          <div class="cont2">${cov("a104")}<div><span class="k2">Continue</span><h6>Language, Culture &amp; Society</h6><span class="sm">Dr. Keisha I. Wiel · Queens College</span><div class="bar"><i></i></div><span class="sm">Last time: Chapter 5 · Language, thought and culture</span><br><span class="pillx">Continue</span></div></div>
          <div class="chips2"><span class="on">All</span><span>Favorites</span><span>Finished</span><span class="newc">This semester · 2</span></div>
          <div class="shelf2"><div class="bk"><span class="star2">★</span>${cov("a104")}<small><span>42%</span><span>•••</span></small></div><div class="bk">${cov("a102")}<small><span>68%</span><span>•••</span></small></div><div class="bk">${cov("bio")}<small><span style="color:#0071e3;font-weight:700">NEW</span><span>•••</span></small></div><div></div></div>
          <div class="menu2"><div>Open <span>›</span></div><hr><div class="hi">Add to Favorites <span>★</span></div><div>Mark as Finished <span>✓</span></div><hr><div class="hi">This semester <span>✓</span></div><div>New Collection… <span>＋</span></div></div>
          <div class="toast2">✓ Saved to your account · 42% → 58%</div>
        </main></div>`;
    const sized = (svg, w) => String(svg || "").replace("<svg ", `<svg style="width:${w}" `);
    return `
<section class="alt" id="yourlibrary"><div class="inner center">
  <p class="eyebrow">Your library</p>
  <h2>Sign in, and your classes<br>are waiting for you.</h2>
  <p class="lede">This is what a student sees after signing in: every class as a book on a shelf. Open one and each part of it has its own room: readings, drills, mock exams and the discussion board.</p>
  <div class="tour">
    <div class="tstage lib" id="libStage" data-s="1" role="img" aria-label="Walkthrough: a student's library after signing in, then the parts of a class it opens: a reading passage with a word looked up, a practice drill with an explanation, a mock exam with a score, and the discussion board. It ends back in the library with progress saved and the classes arranged into favorites and a collection.">
      <div class="tsc t1" aria-hidden="true">${win}</div>
      <div class="tsc t2" aria-hidden="true"><div class="cw">${cnav("Readings")}<div class="rd">
        <div class="rprog"><i></i></div>
        <span class="k3">Chapter 5 · Language, thought and culture</span>
        <h5>Does language shape how we think?</h5>
        <p>Speakers do not simply label a world that is already there. <mark>The Sapir-Whorf hypothesis proposes that the language we speak influences how we perceive and sort our experience.</mark> Its strongest form, linguistic <u>determinism</u>, claims that language sets the limits of thought.</p>
        <p class="p2">Most linguists today hold a milder view, linguistic relativity: language nudges attention and memory without locking anyone in. Speakers of languages with several words for blue tell those shades apart a little faster.</p>
        <div class="bub"><b>determinism</b><span>the idea that one thing fully decides another</span><em>＋ Word bank</em></div>
        <div class="chk"><span>Check yourself</span><b>1 of 2 ✓</b></div>
      </div></div></div>
      <div class="tsc t3" aria-hidden="true"><div class="cw">${cnav("Drill")}<div class="dr">
        <div class="dq"><span class="k3">Signs and meaning · Question 6 of 20</span><h6>Which term describes how a word points to its social context?</h6>
          <div class="o">Arbitrariness</div><div class="o ok">Indexicality <b>✓</b></div><div class="o">Displacement</div>
          <p class="whyx"><b>Why:</b> an index points to its context, the way an accent points to where a speaker grew up.</p></div>
        <div class="subj"><span class="k3">By subject</span>
          <div><span>Signs and meaning</span><i><u style="--w:72%"></u></i></div><div><span>Language and thought</span><i><u style="--w:47%"></u></i></div><div><span>Multilingualism</span><i><u style="--w:30%"></u></i></div><div><span>Language and identity</span><i><u style="--w:12%"></u></i></div>
          <em>⚑ 4 flagged for review</em></div>
      </div></div></div>
      <div class="tsc t4" aria-hidden="true"><div class="cw">${cnav("Mock Exam")}<div class="mk">
        <div class="mleft"><div class="mhead"><b>Mock Exam 3</b><span class="clock">◷ 38:12</span></div><span class="k3">40 questions · drawn from the whole class</span>
          <div class="grid2"><div class="cells">${cells("")}</div><div class="cells done">${cells("d")}</div></div></div>
        <div class="score"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="#e5e5ea" stroke-width="10"/><circle class="ring2" cx="60" cy="60" r="50" fill="none" stroke="#248a3d" stroke-width="10" stroke-linecap="round" transform="rotate(-90 60 60)"/></svg><b>85%</b><span>34 of 40</span><em>Review the 6 you missed ›</em></div>
      </div></div></div>
      <div class="tsc t5" aria-hidden="true"><div class="cw">${cnav("Discussion")}<div class="ds">
        <div class="prompt"><span class="k3">This week's question <i class="beta">BETA</i></span><h6>Think of a word you only use with family. What does using it say about who you are with?</h6></div>
        <div class="rep"><i style="background:linear-gradient(135deg,#ff9f0a,#ff375f)">M</i><p><b>Maya R.</b> My grandmother's word for slippers. Saying it means I'm home.</p></div>
        <div class="rep"><i style="background:linear-gradient(135deg,#30b0c7,#0071e3)">J</i><p><b>Jordan T.</b> That sounds like indexicality from chapter 4: the word points to the setting.</p></div>
        <div class="rep"><i style="background:linear-gradient(135deg,#34c759,#248a3d)">A</i><p><b>Aisha K.</b> We switch languages mid-sentence, but only at the dinner table.</p></div>
        <div class="write2">Write a response…</div>
      </div></div></div>
      <div class="tsc t6" aria-hidden="true">${win}</div>
    </div>
    <div class="tcap"><p id="libCap"></p><div class="tdots" id="libDots" role="tablist" aria-label="Library walkthrough scenes"></div></div>
    <p class="tsample">A sample student's library. Click the walkthrough to move it along.</p>
  </div>
  <div class="gate2"><a class="pill" href="${lib}">Sign in to open your library</a></div>
</div></section>

<section id="companions"><div class="inner center">
  <p class="eyebrow">Study companions</p>
  <h2>Serious about learning.<br>Still a kid about it.</h2>
  <p class="lede">Tucked inside every class is a small companion who studies with you. It grows when you get things right, and it is entirely optional.</p>
  <div class="tour">
    <div class="tstage warm cmp" id="cmpStage" data-s="1" role="img" aria-label="Walkthrough: studying with a companion. A New tag on the class dashboard leads to a café of cats, the student adopts one, it celebrates a right answer and earns experience points, and it grows from a kitten into Professor Dexter. In ANTH 102 the companions are primates.">
      <div class="tsc t1" aria-hidden="true"><div class="mid"><div class="navx"><b>ANTH 104</b><span class="cl">Companions <i class="ntag" style="font-style:normal">NEW</i></span><span>Drill</span><span>Readings</span><span>Mock Exam</span><span>Syllabus</span></div></div><p class="hintx">One small tag on the dashboard. Curiosity does the rest.</p></div>
      <div class="tsc t2" aria-hidden="true"><div class="mid"><div class="cafe2">
        <div class="pet">${sized(A.siamese, "100%")}<b>Miso</b><small>Seal point Siamese</small><span class="adopt">Adopt</span></div>
        <div class="pet pick">${sized(A.kittenOpen, "100%")}<b>Dexter</b><small>Golden Domestic Shorthair</small><span class="adopt">Adopt · come study</span></div>
        <div class="pet">${sized(A.persian, "100%")}<b>Snowball</b><small>White Persian</small><span class="adopt">Adopt</span></div>
      </div></div></div>
      <div class="tsc t3" aria-hidden="true"><div class="mid"><div class="study">
        <div class="qx"><h6>Which term describes how a word points to its social context?</h6><div>Arbitrariness</div><div class="ok">Indexicality</div><div>Displacement</div></div>
        <div class="buddy"><span class="xpf">+10 XP</span>${sized(A.kitten, "100%")}<div class="xpb2"><i></i></div><small>Dexter · Level 2</small></div>
      </div></div></div>
      <div class="tsc t4" aria-hidden="true"><div class="mid"><div class="grow">
        <div class="g">${sized(A.kitten, "70%")}<b>Freshman</b><small>Level 1</small></div><span class="arr">→</span>
        <div class="g" style="flex:1.25">${sized(A.senior, "90%")}<b>Senior</b><small>Level 13</small></div><span class="arr">→</span>
        <div class="g" style="flex:1.6">${sized(A.prof, "100%")}<b>Professor Dexter</b><small>Level 30</small></div>
        <div class="g side" style="flex:1.1">${sized(A.chimp, "88%")}<b>In ANTH 102</b><small>the companions are primates</small></div>
      </div></div></div>
    </div>
    <div class="tcap"><p id="cmpCap"></p><div class="tdots" id="cmpDots" role="tablist" aria-label="Companions walkthrough scenes"></div></div>
    <p class="tsample">Companions stay out of the way until you go looking for them.</p>
  </div>
</div></section>`;
  }
  // a stage of scenes on a timer; click to advance
  function run(root, stageId, capId, dotsId, SC) {
    const stage = root.getElementById(stageId), cap = root.getElementById(capId), dots = root.getElementById(dotsId); if (!stage) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; let i = 0, timer = 0, playing = false;
    dots.innerHTML = SC.map((s, n) => `<button type="button" role="tab" aria-label="Scene ${n + 1}: ${esc(s[1])}"></button>`).join(""); const D = [...dots.children];
    const show = n => { i = n; stage.dataset.s = n + 1; cap.textContent = SC[n][1]; D.forEach((d, k) => d.setAttribute("aria-current", k === n)) };
    const next = () => { clearTimeout(timer); if (!playing) return; timer = setTimeout(() => { show((i + 1) % SC.length); next() }, SC[i][0]) };
    const play = () => { if (playing || reduce) return; playing = true; next() }, pause = () => { playing = false; clearTimeout(timer) };
    D.forEach((d, n) => d.onclick = e => { e.stopPropagation(); show(n); if (playing) next() });
    stage.addEventListener("click", () => { show((i + 1) % SC.length); if (playing) next() });
    show(reduce ? SC.length - 1 : 0);
    if ("IntersectionObserver" in window) new IntersectionObserver(es => { es[0].isIntersecting && !document.hidden ? play() : pause() }, { threshold: .35 }).observe(stage); else play();
    document.addEventListener("visibilitychange", () => { document.hidden ? pause() : play() });
  }
  function attach(root, opts) {
    if (!window.Platform || !window.EurekaCovers) return;
    const before = root.getElementById("thanks") || root.querySelector("section.center:last-of-type"); if (!before) return;
    const st = document.createElement("style"); st.textContent = window.EurekaCovers.CSS + CSS; root.appendChild(st);
    before.insertAdjacentHTML("beforebegin", html((opts && opts.library) || "#classes"));
    run(root, "libStage", "libCap", "libDots", [[3800, "After signing in: your classes on a shelf, the current one on top."], [5200, "Readings: the class in short passages. Tap any word to look it up."], [4800, "Drills: practice by subject, with an explanation every time."], [5600, "Mock exams: a fresh one whenever you want, then review what you missed."], [5200, "Discussion (beta): the week's question and everyone's responses."], [4800, "Back in the library: progress saved, arranged your way."]]);
    run(root, "cmpStage", "cmpCap", "cmpDots", [[3600, "It starts with a small tag on the class dashboard."], [4200, "Behind it, a café of cats. Pick one to study with you."], [4600, "Every right answer earns it experience."], [5600, "Keep studying and it grows up with you."]]);
  }
  window.EurekaTour = { attach };
})();

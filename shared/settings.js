// ANTH 104 Drills · Settings (every page)
// Load in <head>, right after the stylesheet, so the theme is set before the page paints.
// - Appearance: Light (default) / Dark / Automatic (follows the device). Saved as "a104-theme".
// - Exam date for the home-page countdown. Saved as "a104-exam-date" (default below).
// - Reading font and text size, shared with the drills' Options menu. Saved as "a104-reading".
// Adds a "Settings" button to the top of the page: beside "← All drills" on inner pages,
// or into any element with id="settingsBtn" (the home page's nav bar).
(() => {
  const THEME_KEY = "a104-theme", READ_KEY = "a104-reading", CP = (window.COURSE && window.COURSE.prefix) || "a104-", DATE_KEY = CP + "exam-date", SKIP_KEY = CP + "exam-date-skip";
  const DEFAULT_EXAM = (window.COURSE && window.COURSE.exam) || "";   // no built-in date: each student sets their own exam date in Settings
  const SF = '-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif';
  const FONTS = {
    system: { label: "San Francisco", note: "Apple's system font (default)", stack: SF },
    plex: { label: "IBM Plex Sans", note: "Open and even", stack: '"IBM Plex Sans",system-ui,sans-serif', href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap" },
    atkinson: { label: "Atkinson Hyperlegible", note: "Every letter easy to tell apart", stack: '"Atkinson Hyperlegible Next","Atkinson Hyperlegible",system-ui,sans-serif', href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Next:wght@400;600;700&display=swap" },
    literata: { label: "Literata", note: "A serif made for screen reading", stack: 'Literata,Georgia,"Times New Roman",serif', href: "https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;600;700&display=swap" }
  };
  const SIZES = [{ k: .9, label: "A−", name: "Small" }, { k: 1, label: "A", name: "Default" }, { k: 1.12, label: "A+", name: "Large" }, { k: 1.25, label: "A++", name: "Extra large" }];
  const root = document.documentElement;
  // Google account (assets/account.js): loaded next to this file on every page
  const BASE = (document.currentScript && document.currentScript.src || "").replace(/settings\.js(\?.*)?$/, "");
  if (BASE && !window.BioAccount) { const sc = document.createElement("script"); sc.src = BASE + "account.js"; document.head.appendChild(sc) }
  const get = k => { try { return localStorage.getItem(k) } catch (e) { return null } };
  const set = (k, v) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch (e) { } };
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));

  // ===== Appearance
  const mq = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
  const themePref = () => { const t = get(THEME_KEY); return t === "dark" || t === "light" ? t : "auto" };   // Automatic by default: follows the device's light or dark setting
  function applyTheme() {
    const t = themePref(), dark = t === "dark" || (t === "auto" && mq && mq.matches);
    root.dataset.theme = dark ? "dark" : "light";
    root.style.colorScheme = dark ? "dark" : "light";
    let m = document.querySelector('meta[name="theme-color"]');
    if (!m) { m = document.createElement("meta"); m.name = "theme-color"; document.head.appendChild(m) }
    m.content = dark ? "#000000" : "#f5f5f7";
  }
  applyTheme();
  if (mq) (mq.addEventListener ? mq.addEventListener("change", applyTheme) : mq.addListener(applyTheme));

  // ===== Reading font + size
  function reading() {
    let r = { font: "system", size: 1 };
    try { const o = JSON.parse(get(READ_KEY) || "null"); if (o && FONTS[o.font]) r.font = o.font; if (o && SIZES[o.size]) r.size = o.size } catch (e) { }
    return r;
  }
  function applyReading(r) {
    const f = FONTS[r.font];
    if (f.href && !document.querySelector(`link[data-font="${r.font}"]`)) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = f.href; l.dataset.font = r.font; document.head.appendChild(l) }
    root.style.setProperty("--read", f.stack);
    root.style.setProperty("--rs", SIZES[r.size].k);
  }
  applyReading(reading());

  // ===== Exam date
  function examDate() { const raw = get(DATE_KEY) || DEFAULT_EXAM; const d = raw ? new Date(raw) : null; return d && !isNaN(d) ? d : null }
  const pad = n => String(n).padStart(2, "0");
  const localISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const fmt = d => d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  // ===== The Settings sheet (iOS-style grouped list)
  const CSS = `
.st-btn{display:inline-flex;align-items:center;gap:6px;font:400 15px -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",sans-serif;color:var(--accent,#0071e3);background:none;border:0;padding:4px 2px;cursor:pointer;letter-spacing:-.01em}
.st-btn:hover{opacity:.75}
.st-btn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.st-top{display:flex;align-items:center;justify-content:space-between;gap:12px}
.st-veil{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;padding:max(16px,env(safe-area-inset-top,0px)) 16px max(16px,env(safe-area-inset-bottom,0px));animation:stFade .2s ease}
.st-sheet{--s-bg:#f2f2f7;--s-row:#fff;--s-ink:#1d1d1f;--s-muted:#6e6e73;--s-sep:rgba(60,60,67,.18);--s-fill:#e3e3e8;--s-thumb:#fff;--s-acc:#0071e3;
  width:min(440px,100%);max-height:min(88vh,760px);overflow:auto;background:var(--s-bg);color:var(--s-ink);border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.3);
  font:17px/1.35 -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Helvetica,Arial,sans-serif;letter-spacing:-.022em;animation:stUp .28s cubic-bezier(.2,.8,.2,1)}
[data-theme="dark"] .st-sheet{--s-bg:#1c1c1e;--s-row:#2c2c2e;--s-ink:#f5f5f7;--s-muted:#98989f;--s-sep:rgba(84,84,88,.6);--s-fill:#3a3a3c;--s-thumb:#636366;--s-acc:#0a84ff}
[data-theme="dark"] .st-veil{background:rgba(0,0,0,.55)}
.st-head{position:sticky;top:0;z-index:1;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:14px 16px 10px;background:color-mix(in srgb,var(--s-bg) 85%,transparent);-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px)}
.st-head h2{grid-column:2;margin:0;font-weight:600;font-size:17px;font-family:inherit}
.st-done{grid-column:3;justify-self:end;font-weight:600;font-size:17px;font-family:inherit;color:var(--s-acc);background:none;border:0;cursor:pointer;padding:4px}
.st-sec{margin:8px 16px 22px}
.st-cap{font-size:13px;color:var(--s-muted);text-transform:uppercase;letter-spacing:.01em;margin:0 16px 7px}
.st-foot{font-size:13px;color:var(--s-muted);margin:7px 16px 0;line-height:1.4}
.st-group{background:var(--s-row);border-radius:12px;overflow:hidden}
.st-row{display:flex;align-items:center;gap:12px;min-height:46px;padding:9px 16px;width:100%;border:0;background:none;color:inherit;font:inherit;text-align:left;position:relative}
.st-row+.st-row::before{content:"";position:absolute;top:0;left:16px;right:0;border-top:.5px solid var(--s-sep)}
button.st-row{cursor:pointer} button.st-row:active{background:var(--s-fill)}
.st-row .st-l{flex:1;display:flex;flex-direction:column;min-width:0}
.st-row small{font-size:13px;color:var(--s-muted)}
.st-check{width:20px;flex:none;color:var(--s-acc);font-weight:600;visibility:hidden}
.st-row[aria-checked="true"] .st-check{visibility:visible}
.st-seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:2px;background:var(--s-fill);border-radius:9px;padding:2px;margin:12px}
.st-seg button{border:0;background:transparent;color:inherit;border-radius:7px;padding:6px 4px;font-weight:500;font-size:14px;font-family:inherit;cursor:pointer}
.st-seg button[aria-pressed="true"]{background:var(--s-thumb);box-shadow:0 3px 8px rgba(0,0,0,.12),0 3px 1px rgba(0,0,0,.04)}
.st-modes{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:16px 14px 14px}
.st-mode{display:flex;flex-direction:column;align-items:center;gap:8px;border:0;background:none;color:inherit;font-weight:400;font-size:14px;font-family:inherit;cursor:pointer;padding:0}
.st-prev{width:64px;height:98px;border-radius:12px;border:.5px solid var(--s-sep);overflow:hidden;position:relative;box-shadow:0 1px 3px rgba(0,0,0,.1)}
.st-prev i{position:absolute;left:8px;right:8px;height:9px;border-radius:3px}
.st-prev.l{background:#f5f5f7} .st-prev.l i{background:#fff} .st-prev.d{background:#000} .st-prev.d i{background:#2c2c2e}
.st-prev.a{background:linear-gradient(90deg,#f5f5f7 50%,#000 50%)} .st-prev.a i{background:linear-gradient(90deg,#fff 0 24px,#2c2c2e 24px)}
.st-radio{width:22px;height:22px;border-radius:50%;border:1.5px solid var(--s-muted);display:grid;place-items:center}
.st-mode[aria-checked="true"] .st-radio{background:var(--s-acc);border-color:var(--s-acc)}
.st-mode[aria-checked="true"] .st-radio::after{content:"";width:9px;height:5px;border:2px solid #fff;border-top:0;border-right:0;transform:rotate(-45deg) translate(1px,-1px)}
.st-date{font:inherit;font-size:16px;color:inherit;background:var(--s-fill);border:0;border-radius:8px;padding:6px 10px;color-scheme:inherit;min-width:0;max-width:62%;flex:0 1 auto}
.st-row .st-l{white-space:nowrap}
.st-row .st-l small,.st-row .st-l span{white-space:normal}
.st-link{color:var(--s-acc);background:none;border:0;font:inherit;cursor:pointer;padding:0}
.st-sw{appearance:none;-webkit-appearance:none;flex:none;width:51px;height:31px;border-radius:999px;background:var(--s-fill);position:relative;cursor:pointer;transition:background .2s;margin:0}
.st-sw::after{content:"";position:absolute;top:2px;left:2px;width:27px;height:27px;border-radius:50%;background:#fff;box-shadow:0 3px 8px rgba(0,0,0,.15),0 1px 1px rgba(0,0,0,.16);transition:transform .2s}
.st-sw:checked{background:#34c759} .st-sw:checked::after{transform:translateX(20px)}
.st-acct{display:flex;align-items:center;gap:12px;padding:12px 16px}.st-av{width:44px;height:44px;border-radius:50%;flex:none;object-fit:cover;background:var(--s-fill);display:grid;place-items:center;font-weight:600;font-size:18px;color:var(--s-muted)}
.st-acct .st-l{flex:1;min-width:0;display:flex;flex-direction:column}.st-acct b{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.st-acct small{font-size:13px;color:var(--s-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.st-gbtn{display:flex;align-items:center;justify-content:center;gap:10px;width:calc(100% - 24px);margin:12px;min-height:44px;border-radius:999px;border:1px solid var(--s-sep);background:#fff;color:#1f1f1f;font:500 16px -apple-system,BlinkMacSystemFont,"Roboto",sans-serif;cursor:pointer}
.st-gbtn[disabled]{opacity:.5;cursor:default}.st-gbtn svg{width:20px;height:20px}
[data-theme="dark"] .st-gbtn{background:#131314;color:#e3e3e3;border-color:#8e918f}
.st-sync{display:inline-flex;align-items:center;gap:6px}.st-dot{width:8px;height:8px;border-radius:50%;background:#34c759}.st-dot.busy{background:#ff9f0a;animation:stPulse 1s ease-in-out infinite}.st-dot.err{background:#ff3b30}.st-dot.off{background:var(--s-muted)}
@keyframes stPulse{50%{opacity:.35}}
.st-choose{padding:12px 16px 14px}.st-choose p{margin:0 0 10px;font-size:15px}.st-choose .st-cbtn{display:block;width:100%;margin-top:8px;border-radius:12px;border:0;background:var(--s-fill);color:inherit;font:inherit;font-size:15px;padding:10px 12px;text-align:left;cursor:pointer}.st-choose .st-cbtn b{display:block}.st-choose .st-cbtn small{color:var(--s-muted);font-size:13px}
.st-choose .st-cbtn.pri{background:var(--s-acc);color:#fff}.st-choose .st-cbtn.pri small{color:rgba(255,255,255,.85)}
.st-sample{padding:4px 16px 14px;color:var(--s-muted);font-size:calc(15px * var(--rs,1));font-family:var(--read)}
@keyframes stFade{from{opacity:0}} @keyframes stUp{from{opacity:0;transform:translateY(24px) scale(.98)}}
@media (max-width:560px){.st-veil{align-items:flex-end;padding:0}.st-sheet{border-radius:16px 16px 0 0;max-height:92vh;width:100%;padding-bottom:env(safe-area-inset-bottom,0px)}}
@media (prefers-reduced-motion:reduce){.st-veil,.st-sheet{animation:none}}`;
  const GEAR = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let veil = null, lastFocus = null, offAcct = null;

  const GLOGO = `<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>`;
  const ago = t => { const s = Math.round((Date.now() - t) / 1000); return s < 10 ? "just now" : s < 60 ? s + " s ago" : s < 3600 ? Math.round(s / 60) + " min ago" : Math.round(s / 3600) + " h ago" };
  function accountHTML() {
    const A = window.BioAccount;
    if (!A) return "";
    const I = A.info(), u = I.user, S = I.status;
    const head = `<p class="st-cap">Account</p><div class="st-sec" style="margin-top:0"><div class="st-group">`;
    if (!I.configured) return head + `<button type="button" class="st-gbtn" disabled>${GLOGO}Sign in with Google</button></div>
      <p class="st-foot">Google sign-in isn't set up on this site yet. Until it is, your progress is saved on this device only.</p></div>`;
    if (!u) return head + `<button type="button" class="st-gbtn" id="stSignIn"${I.ready ? "" : ""}>${GLOGO}Sign in with Google</button></div>
      <p class="st-foot">${S.state === "error" && S.msg ? esc(S.msg) + " " : ""}Save your progress, cats, badges and notes to your Google account and pick up on any device.</p></div>`;
    const dot = S.state === "saving" || S.state === "checking" ? "busy" : S.state === "error" ? "err" : S.state === "saved" ? "" : "off";
    const label = S.state === "saving" ? "Saving…" : S.state === "checking" ? "Checking your account…" : S.state === "error" ? esc(S.msg || "Couldn't sync") : S.state === "saved" ? `Saved to your account · ${ago(S.at)}` : S.state === "choose" ? "Choose which progress to keep" : "Signed in";
    const choose = S.state === "choose" && A.pending ? `<div class="st-choose"><p>This device and your Google account both have progress. Which do you want to keep?</p>
        <button type="button" class="st-cbtn pri" data-choose="cloud"><b>Use my account's progress</b><small>Replaces what's on this device</small></button>
        <button type="button" class="st-cbtn" data-choose="local"><b>Keep this device's progress</b><small>Replaces what's saved in your account</small></button></div>` : "";
    const av = u.photo ? `<img class="st-av" src="${esc(u.photo)}" alt="" referrerpolicy="no-referrer">` : `<span class="st-av">${esc((u.name || u.email || "?")[0].toUpperCase())}</span>`;
    return head + `<div class="st-acct">${av}<span class="st-l"><b>${esc(u.name || "Signed in")}</b><small>${esc(u.email)}</small></span></div>
        <div class="st-row"><span class="st-l"><span class="st-sync"><i class="st-dot ${dot}"></i>${label}</span></span><button type="button" class="st-link" id="stSyncNow">Sync now</button></div>
        ${choose}
        <button type="button" class="st-row" id="stSignOut"><span class="st-l" style="color:#ff3b30">Sign out</span></button></div>
      <p class="st-foot">Everything saves to your account automatically. Signing out keeps your progress on this device.</p></div>`;
  }
  function sheetHTML() {
    const t = themePref(), r = reading(), d = examDate(), custom = !!get(DATE_KEY);
    const mode = (k, label, cls) => `<button type="button" class="st-mode" role="radio" aria-checked="${t === k}" data-theme-pick="${k}"><span class="st-prev ${cls}"><i style="top:12px"></i><i style="top:27px;right:22px"></i><i style="top:42px"></i></span>${label}<span class="st-radio"></span></button>`;
    return `<div class="st-head"><h2 id="stTitle">Settings</h2><button type="button" class="st-done" id="stDone">Done</button></div>
      ${accountHTML()}
      <p class="st-cap">Appearance</p>
      <div class="st-sec" style="margin-top:0"><div class="st-group"><div class="st-modes" role="radiogroup" aria-label="Appearance">${mode("light", "Light", "l")}${mode("dark", "Dark", "d")}${mode("auto", "Automatic", "a")}</div></div>
        <p class="st-foot">Light is the default. Automatic matches your device's light or dark setting.</p></div>
      <p class="st-cap">Exam</p>
      <div class="st-sec" style="margin-top:0"><div class="st-group">
        <label class="st-row"><span class="st-l">Date &amp; time</span><input type="datetime-local" class="st-date" id="stDate" value="${d ? localISO(d) : ""}"></label>
        ${custom ? `<div class="st-row"><span class="st-l"><button type="button" class="st-link" id="stReset">${DEFAULT_EXAM ? `Reset to ${esc(fmt(new Date(DEFAULT_EXAM)))}` : "Clear the date"}</button></span></div>` : ""}
      </div><p class="st-foot">The home page counts down to this. Saved on this device, and to your account when you're signed in.</p></div>
      <p class="st-cap">Reading font</p>
      <div class="st-sec" style="margin-top:0"><div class="st-group" role="radiogroup" aria-label="Reading font">
        ${Object.entries(FONTS).map(([k, f]) => `<button type="button" class="st-row" role="radio" aria-checked="${r.font === k}" data-font-pick="${k}"><span class="st-l"><span>${esc(f.label)}</span><small>${esc(f.note)}</small></span><span class="st-check">✓</span></button>`).join("")}
      </div></div>
      <p class="st-cap">Text size</p>
      <div class="st-sec" style="margin-top:0"><div class="st-group">
        <div class="st-seg" role="group" aria-label="Text size">${SIZES.map((s, i) => `<button type="button" aria-pressed="${r.size === i}" data-size-pick="${i}" title="${s.name}">${s.label}</button>`).join("")}</div>
        <p class="st-sample">Ethylene ripens fruit; abscisic acid closes stomata during drought.</p>
      </div><p class="st-foot">Font and size apply to questions and explanations in every drill.</p></div>
      ${window.BioBuddy ? `<p class="st-cap">Study buddy</p>
      <div class="st-sec" style="margin-top:0"><div class="st-group">
        <label class="st-row"><span class="st-l"><span>Show study buddy</span><small>Dexter, a blonde kitten who grows up as you learn</small></span><input type="checkbox" class="st-sw" id="stBuddy"${window.BioBuddy.enabled() ? " checked" : ""}></label>
        ${window.BioBuddy.enabled() && window.BioBuddy.soundOn ? `<label class="st-row"><span class="st-l"><span>Dexter's meow</span><small>He meows when you get one right</small></span><input type="checkbox" class="st-sw" id="stMeow"${window.BioBuddy.soundOn() ? " checked" : ""}></label>` : ""}
        ${window.BioBuddy.enabled() && window.BioBuddy.setSize ? `<label class="st-row"><span class="st-l"><span>Buddy size</span><small id="stSizeOut">${Math.round(window.BioBuddy.size() * 100)}% · bigger on laptops and desktops</small></span><input type="range" id="stSize" min="60" max="180" step="10" value="${Math.round(window.BioBuddy.size() * 100)}" style="width:42%;accent-color:var(--s-acc)" aria-label="Buddy size"></label>
        <label class="st-row"><span class="st-l"><span>Anchor buddy in place</span><small>He stays where you drag him, even when you pick an answer</small></span><input type="checkbox" class="st-sw" id="stAnchor"${window.BioBuddy.anchored() ? " checked" : ""}></label>` : ""}
        ${window.BioBuddy.enabled() ? `<button type="button" class="st-row" id="stBuddyOpen"><span class="st-l" style="color:var(--s-acc)">See your buddy</span></button>` : ""}
      </div></div>` : ""}`;
  }
  function paint() {
    const sh = veil.querySelector(".st-sheet"), y = sh.scrollTop;
    sh.innerHTML = sheetHTML(); sh.scrollTop = y;
    sh.querySelector("#stDone").onclick = close;
    sh.querySelectorAll("[data-theme-pick]").forEach(b => b.onclick = () => { set(THEME_KEY, b.dataset.themePick === "auto" ? null : b.dataset.themePick); applyTheme(); emit("bio:theme", themePref()); paint() });
    sh.querySelectorAll("[data-font-pick]").forEach(b => b.onclick = () => { const r = reading(); r.font = b.dataset.fontPick; set(READ_KEY, JSON.stringify(r)); applyReading(r); emit("bio:reading", r); paint() });
    sh.querySelectorAll("[data-size-pick]").forEach(b => b.onclick = () => { const r = reading(); r.size = +b.dataset.sizePick; set(READ_KEY, JSON.stringify(r)); applyReading(r); emit("bio:reading", r); paint() });
    const di = sh.querySelector("#stDate");
    di.onchange = () => { if (!di.value) return; set(DATE_KEY, di.value); set(SKIP_KEY, null); emit("bio:exam", examDate()); paint() };
    const bm = sh.querySelector("#stMeow"); if (bm) bm.onchange = () => window.BioBuddy.setSound(bm.checked);
    const bs = sh.querySelector("#stBuddy"); if (bs) bs.onchange = () => { window.BioBuddy.setEnabled(bs.checked); paint() };
    const bz = sh.querySelector("#stSize"); if (bz) bz.oninput = () => { sh.querySelector("#stSizeOut").textContent = bz.value + "% · bigger on laptops and desktops"; window.BioBuddy.setSize(bz.value / 100) };
    const ba = sh.querySelector("#stAnchor"); if (ba) ba.onchange = () => window.BioBuddy.setAnchored(ba.checked);
    const bo = sh.querySelector("#stBuddyOpen"); if (bo) bo.onclick = () => { close(); window.BioBuddy.open() };
    const A = window.BioAccount;
    const si = sh.querySelector("#stSignIn"); if (si) si.onclick = () => A.signIn();
    const so = sh.querySelector("#stSignOut"); if (so) so.onclick = async () => { await A.signOut(); paint() };
    const sn = sh.querySelector("#stSyncNow"); if (sn) sn.onclick = () => A.syncNow();
    sh.querySelectorAll("[data-choose]").forEach(b => b.onclick = () => A.choose(b.dataset.choose));
    const rs = sh.querySelector("#stReset"); if (rs) rs.onclick = () => { set(DATE_KEY, null); emit("bio:exam", examDate()); paint() };
  }
  function open() {
    if (veil) return;
    lastFocus = document.activeElement;
    veil = document.createElement("div"); veil.className = "st-veil";
    veil.innerHTML = `<div class="st-sheet" role="dialog" aria-modal="true" aria-labelledby="stTitle"></div>`;
    veil.onclick = e => { if (e.target === veil) close() };
    document.body.appendChild(veil); document.body.style.overflow = "hidden";
    paint(); veil.querySelector("#stDone").focus();
    if (window.BioAccount) { offAcct = window.BioAccount.on(() => { if (veil) paint() }) }
  }
  function close() {
    if (!veil) return; if (offAcct) { offAcct(); offAcct = null } veil.remove(); veil = null; document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener("keydown", e => { if (e.key === "Escape" && veil) { e.stopPropagation(); close() } }, true);

  function mount() {
    const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    const own = document.getElementById("settingsBtn");
    if (own) { own.addEventListener("click", open); return }
    // Inner pages: put "Settings" on the same line as "← All drills"
    const back = document.querySelector("a.back"); if (!back) return;
    const bar = document.createElement("div"); bar.className = "st-top";
    back.parentNode.insertBefore(bar, back); bar.appendChild(back);
    const b = document.createElement("button"); b.type = "button"; b.className = "st-btn"; b.innerHTML = GEAR + "Settings"; b.onclick = open;
    bar.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();

  window.BioSettings = { open, close, examDate, DEFAULT_EXAM, FONTS, SIZES };
})();

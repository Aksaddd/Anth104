// ANTH 104 Drills · Google account (loaded by assets/settings.js on every page)
// Sign in with Google to save everything (progress, cats, gold, badges, notes, settings) to your account and pick up
// on any device. Uses Firebase Authentication (Google provider) + one Cloud Firestore document per person:
//   anth104-progress/{uid} = { data: "<JSON of every a104-* localStorage key>", savedAt: <ms>, device: "<id>" }
// No server of our own. Sign-in stays on until you sign out (Firebase keeps the session).
//
// SETUP (one time, by the site owner; see README → "Google sign-in"):
//   1. console.firebase.google.com → Add project → Add a Web app → copy its firebaseConfig into SITE_CONFIG below.
//   2. Authentication → Sign-in method → enable Google. Settings → Authorized domains → add this site's domain (e.g. anth104.vercel.app).
//   3. Firestore Database → Create database → Rules:
//        match /anth104-progress/{uid} { allow read, write: if request.auth != null && request.auth.uid == uid; }
// Until SITE_CONFIG is filled in, Settings shows the Account section as "not set up yet".
(() => {
  // Firebase project "MeowStudy". These values are public by design; Firestore security rules protect the data.
  const SITE_CONFIG = {
    apiKey: "AIzaSyBpGYNfuBMR9ZxZQNTS9zF8cKcx7gNwRFE",
    authDomain: "meowstudy-5750f.firebaseapp.com",
    projectId: "meowstudy-5750f",
    storageBucket: "meowstudy-5750f.firebasestorage.app",
    messagingSenderId: "800176337696",
    appId: "1:800176337696:web:e67781b3567fbe0bd9dd45"
  };
  const CONFIG = window.BIO_FIREBASE_CONFIG || SITE_CONFIG;
  const FB = "https://www.gstatic.com/firebasejs/10.12.2/";
  const META = "a104-account-sync", PREFIX = "a104-", SKIP = "a104-account", COLLECTION = "anth104-progress";   // its own collection, so it never touches the Bio site's "progress" documents   // the account's own keys are never synced
  const DOC_LIMIT = 900 * 1024;

  const LS = window.localStorage, rawSet = Storage.prototype.setItem, rawDel = Storage.prototype.removeItem;
  const readMeta = () => { try { return JSON.parse(LS.getItem(META) || "{}") || {} } catch (e) { return {} } };
  const writeMeta = m => { try { rawSet.call(LS, META, JSON.stringify(m)) } catch (e) { } };
  const synced = k => k && k.startsWith(PREFIX) && !k.startsWith(SKIP);
  const device = (() => { const m = readMeta(); if (!m.device) { m.device = Math.random().toString(36).slice(2, 10); writeMeta(m) } return m.device })();

  let fb = null, user = null, ready = false, status = { state: "idle", at: 0, msg: "" }, pushT = 0, busy = false;
  const listeners = new Set();
  const emit = () => listeners.forEach(f => { try { f(api.info()) } catch (e) { } });
  const setStatus = (state, msg) => { status = { state, at: Date.now(), msg: msg || "" }; emit() };

  // ----- what gets saved: every a104-* key on this device
  function snapshot() {
    const data = {};
    for (let i = 0; i < LS.length; i++) { const k = LS.key(i); if (synced(k)) data[k] = LS.getItem(k) }
    return data;
  }
  const hasProgress = d => Object.keys(d).some(k => /drill|readings|dexter|read|notes|board|mock|roots/.test(k));
  function applyData(data) {
    const drop = []; for (let i = 0; i < LS.length; i++) { const k = LS.key(i); if (synced(k)) drop.push(k) }
    drop.forEach(k => rawDel.call(LS, k));
    Object.entries(data || {}).forEach(([k, v]) => { if (synced(k)) try { rawSet.call(LS, k, v) } catch (e) { } });
  }

  // ----- notice local changes and save them a few seconds later
  function markDirty() {
    if (!user) return;
    const m = readMeta(); m.dirtyAt = Date.now(); writeMeta(m);
    clearTimeout(pushT); pushT = setTimeout(() => push(), 4000);
  }
  Storage.prototype.setItem = function (k, v) { const r = rawSet.call(this, k, v); if (this === LS && synced(String(k))) markDirty(); return r };
  Storage.prototype.removeItem = function (k) { const r = rawDel.call(this, k); if (this === LS && synced(String(k))) markDirty(); return r };

  // ----- Firebase, loaded only when it's set up
  async function boot() {
    if (fb || !CONFIG) return fb;
    const [app, auth, store] = await Promise.all([import(FB + "firebase-app.js"), import(FB + "firebase-auth.js"), import(FB + "firebase-firestore.js")]);
    const a = app.initializeApp(CONFIG), au = auth.getAuth(a), db = store.getFirestore(a);
    fb = { auth, store, au, db, ref: uid => store.doc(db, COLLECTION, uid) };
    auth.onAuthStateChanged(au, u => { user = u; ready = true; emit(); if (u) pull(); else setStatus("idle") });
    return fb;
  }
  async function push(force) {
    if (!fb || !user || busy) return;
    const m = readMeta(); if (!force && !m.dirtyAt) return;
    const data = snapshot(), json = JSON.stringify(data);
    if (json.length > DOC_LIMIT) { setStatus("error", "Too much data to save (over 900 KB)."); return }
    busy = true; setStatus("saving");
    try {
      const savedAt = Date.now();
      await fb.store.setDoc(fb.ref(user.uid), { data: json, savedAt, device });
      const n = readMeta(); n.uid = user.uid; n.cloudAt = savedAt; if ((n.dirtyAt || 0) <= savedAt) n.dirtyAt = 0; writeMeta(n);
      setStatus("saved");
    } catch (e) { setStatus("error", "Couldn't save: " + (e && e.code || e && e.message || "offline")) }
    busy = false;
  }
  // On sign-in and on each visit: bring this device up to date with the account (or the account with this device)
  async function pull() {
    if (!fb || !user || busy) return;
    busy = true; setStatus("checking");
    let cloud = null;
    try { const s = await fb.store.getDoc(fb.ref(user.uid)); cloud = s.exists() ? s.data() : null }
    catch (e) { busy = false; setStatus("error", "Couldn't reach your account: " + (e && e.code || "offline")); return }
    busy = false;
    const m = readMeta(), local = snapshot();
    if (!cloud) { m.uid = user.uid; m.dirtyAt = Date.now(); writeMeta(m); return push(true) }   // first time: save this device
    let cdata = {}; try { cdata = JSON.parse(cloud.data || "{}") } catch (e) { }
    if (m.uid !== user.uid) {   // this device hasn't been linked to this account before
      if (!hasProgress(local) || JSON.stringify(local) === JSON.stringify(cdata)) return useCloud(cloud, cdata);
      api.pending = { cloud, cdata, local }; setStatus("choose");
      if (api.onChoose) api.onChoose(api.pending); else if (window.BioSettings) window.BioSettings.open(); return;
    }
    if ((cloud.savedAt || 0) > (m.cloudAt || 0) && cloud.device !== device) {   // another device saved since
      if ((m.dirtyAt || 0) > (cloud.savedAt || 0)) return push(true);           // …but this one changed more recently
      return useCloud(cloud, cdata);
    }
    if (m.dirtyAt) return push(true);
    setStatus("saved");
  }
  function useCloud(cloud, cdata) {
    applyData(cdata);
    writeMeta(Object.assign(readMeta(), { uid: user.uid, cloudAt: cloud.savedAt || Date.now(), dirtyAt: 0 }));
    setStatus("saved");
    // reload once so every module reads the restored progress
    try { if (sessionStorage.getItem("a104-account-reloaded") !== String(cloud.savedAt)) { sessionStorage.setItem("a104-account-reloaded", String(cloud.savedAt)); location.reload() } } catch (e) { location.reload() }
  }

  const api = {
    configured: () => !!CONFIG,
    info: () => ({ configured: !!CONFIG, ready, user: user ? { name: user.displayName || "", email: user.email || "", photo: user.photoURL || "" } : null, status }),
    on: f => { listeners.add(f); return () => listeners.delete(f) },
    async signIn() {
      await boot(); if (!fb) return;
      const p = new fb.auth.GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" });
      try { await fb.auth.signInWithPopup(fb.au, p) }
      catch (e) { if (e && /popup-blocked|operation-not-supported/.test(e.code || "")) return fb.auth.signInWithRedirect(fb.au, p); setStatus("error", e && e.code === "auth/popup-closed-by-user" ? "" : "Sign-in failed: " + (e && e.code || "unknown")) }
    },
    async signOut() { if (!fb) return; await push(); await fb.auth.signOut(fb.au); writeMeta({ device }); setStatus("idle") },
    syncNow: async () => { await pull() },
    choose: async which => {   // first sign-in on a device that already has progress
      const P = api.pending; api.pending = null; if (!P) return;
      if (which === "cloud") useCloud(P.cloud, P.cdata);
      else { writeMeta(Object.assign(readMeta(), { uid: user.uid, dirtyAt: Date.now() })); await push(true) }
    },
    pending: null, onChoose: null
  };
  window.BioAccount = api;
  if (CONFIG) boot().catch(e => setStatus("error", "Couldn't load Google sign-in."));
  document.addEventListener("visibilitychange", () => { if (!user) return; if (document.hidden) push(); else pull() });
  addEventListener("pagehide", () => { if (user) push() });
})();

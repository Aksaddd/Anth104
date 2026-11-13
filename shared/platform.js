// Eureka platform · the classes on this site and the class codes that unlock them.
// Loaded first on every page (before a course's course.js).
//
// CLASS CODES. Each class opens with a code its students are given. The codes are not written here: only their
// SHA-256 fingerprints are, so reading this file doesn't reveal them. To set a new code for a class, run
//     node tools/class-code.js "NEW-CODE"
// and paste the line it prints over that class's `code:` below. Codes ignore capitals, spaces and dashes.
// This is a courtesy gate, not security: the site is static, so the study material itself is still public files.
(() => {
  const BASE = (document.currentScript && document.currentScript.src || "").replace(/shared\/platform\.js.*$/, "");
  // `professor` is the name of the professor whose course and materials the class was built from, written the way it
  // should be shown ("Professor Jane Doe" or "Dr. Jane Doe"). It appears on the class's cover in the library, under its
  // title, at the top of the class's front page and in the acknowledgments on the "What is Eureka?" page.
  // Leave it "" and nothing is shown.
  const COURSES = [
    { id: "a104", professor: "Dr. Keisha I. Wiel", progress: [["a104-drill-v1", 586], ["a104-readings-v1", 133]], cover: ["#24439c", "#0c1f57"], path: "anth104/", code: "795711bb812198d854084af3a23c31bb110d3085563d3ae8b16d62d4d3db94b1",
      name: "ANTH 104", title: "Language, Culture & Society", school: "Queens College", color: "#0a84ff",
      blurb: "Ahearn's Living Language, the assigned readings and the lecture slides: Read & Learn, drills, a mock exam, word roots, a discussion board and the original course files.",
      stats: "586 questions · 133 on the readings · 10 reading chapters" },
    { id: "bio", professor: "", progress: [["bio-u3-progress-v1", 203], ["bio-hw3-v1", 89]], cover: ["#1f7048", "#0b3a25"], path: "bio239/", code: "21ede34c92932dadf55f4aaaaf70999e0d8525c74760c252f88692347ee295a2",
      name: "Bi 239", title: "Plants, Fungi & Signals", school: "Queensborough Community College", color: "#34c759",
      blurb: "Plant diversity, hormones, light and defense, and the fungi: Read & Learn chapters, the multiple-choice drill, Bio-pardy, word roots, Homework 3 and a mock exam.",
      stats: "Read & Learn · drill · Bio-pardy · mock exam" },
    { id: "a102", professor: "Dr. Felicia Madimenos", progress: [["ant1-progress-v2", 192], ["ant2-progress-v1", 376], ["anthro-class-v1", 149]], cover: ["#c9682f", "#7a2e12"], path: "anth102/", code: "04d54e00cac73576f630324b220f965184bd1838897ffbed5ba3a89c973972e8",
      name: "ANTH 102", title: "Biology & Evolution of the Human Species", school: "Queens College", color: "#ff9f0a",
      blurb: "Read & Learn chapters, Exam 1 and Exam 2 drills, primate classification with a drag-and-drop chart, two review games, word roots and a mock exam.",
      stats: "717 questions · 8 reading chapters · 3 drills" }
  ];
  const KEY = "a104-classes";   // the classes this browser has unlocked (synced with the account like other progress)
  const norm = s => String(s || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  async function sha(s) { const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("meowstudy:" + s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("") }
  const unlocked = () => { try { const a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a : [] } catch (e) { return [] } };
  // students who were already studying ANTH 104 here before class codes existed keep their access
  const before = id => { if (id !== "a104") return false; try { return ["a104-drill-v1", "a104-readings-v1", "a104-read-v1"].some(k => localStorage.getItem(k)) } catch (e) { return false } };
  const has = id => unlocked().includes(id) || before(id);
  // try a code: returns the class it opened, or null
  async function join(code) {
    const c = norm(code); if (!c) return null;
    let h = ""; try { h = await sha(c) } catch (e) { return null }
    const hit = COURSES.find(x => x.code === h); if (!hit) return null;
    const u = unlocked(); if (!u.includes(hit.id)) { u.push(hit.id); try { localStorage.setItem(KEY, JSON.stringify(u)) } catch (e) { } }
    return hit;
  }
  function leave(id) { try { localStorage.setItem(KEY, JSON.stringify(unlocked().filter(x => x !== id))) } catch (e) { } }
  // on a class's pages: no code entered yet → back to the front page, which asks for it
  // every class page gets the same bar across the top (shared/classbar.js); "cb" hides the old bars straight away
  function classBar() { document.documentElement.classList.add("cb"); const s = document.createElement("script"); s.src = BASE + "shared/classbar.js"; document.head.appendChild(s) }
  function guard(id) { if (!has(id)) location.replace(BASE + "index.html?join=" + encodeURIComponent(id)); else { try { localStorage.setItem("a104-last-class", id) } catch (e) { } classBar() } }   // the library's "Continue" shows the class opened last
  // Credit lines: any element with data-credit="<class id>" is filled with the class's acknowledgment (or left empty).
  const creditOf = c => c && c.professor ? `Built from the course taught by ${c.professor} at ${c.school}. Their curriculum and materials made this possible.` : "";
  function credits() { document.querySelectorAll("[data-credit]").forEach(el => { const text = creditOf(COURSES.find(c => c.id === el.dataset.credit)); el.textContent = text; el.hidden = !text }) }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", credits); else credits();
  window.Platform = { BASE, COURSES, creditOf, credits, unlocked, has, join, leave, guard, course: id => COURSES.find(c => c.id === id) };
})();

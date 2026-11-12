# ANTH 104 Drills

Study drills for **ANTH 104: Language, Culture, and Society** (Queens College, Fall 2026). Built from Laura Ahearn's *Living Language: An Introduction to Linguistic Anthropology* (3rd ed., Ch 1–13), the eleven assigned readings and the Language Acquisition and Socialization lecture slides. It uses the same engine and approach as [anthro-drills](https://github.com/Aksaddd/anthro-drills) and [bio-drills](https://github.com/Aksaddd/bio-drills).

Everything is plain static HTML, CSS and JavaScript, with no build step and no server code. The course materials themselves (PDFs, links) stay in the `Week_*` / `week_*` folders.

| Module | Folder | What it is |
|---|---|---|
| Landing | `index.html` | Course hero, optional exam countdown (set the date in Settings), **Continue**, module bar, and a card per module |
| Read & Learn | `read/` | The whole course as 10 reading chapters (57 short passages), with **Check yourself** questions after each passage and 25 activities (match, sort, put in order, flip cards) |
| Multiple-Choice Drill | `drill/` | 586 questions in 10 subject tabs, plus **Mixed**, **Missed** and **Progress**. **Group by: Source** practices chosen chapters or the readings together |
| Anthro-pardy | `board/` | A Jeopardy-style board: 6 categories × 5 values, one hidden ×2 tile |
| Word Roots | `roots/` | 77 Greek and Latin roots behind course terms (*hetero-* + *-glossia*, *il-* + *locution*…), sorted by subject, with a drill |
| Readings | `readings/` | Its own drill: 133 questions, one tab per assigned article in syllabus order, with separate progress (`a104-readings-v1`). `readings/key.html` is the answer key, **answers hidden by default** |
| Mock Exam | `mock/` | A fresh 50- or 100-question exam each time, a quarter from the readings |
| Review List | `review/` | Every question marked ⚑ for review, from both drills and mock exams |
| Discussion Board (beta) | `discuss/` | **In testing mode** (marked Beta on the front page and the board; anyone, including the professor, can sign in and use it as a regular user). Students sign in with Google and post one response per question (32 starter questions, two per week, plus questions students add), with likes, replies and an "answer first" gate. Needs Firestore rules: see [docs/discussion-board.md](docs/discussion-board.md) |
| Archive | `archive/` | The original course materials week by week (13 textbook chapters, 12 reading PDFs, the lecture slides, 14 videos, 2 links), with search, type filters and links into Read & Learn and the readings drill |

## Subjects

| Tab | Covers |
|---|---|
| Social action | Ch 1 · Rickford & King |
| Gesture & sign | Ch 2 |
| Research | Ch 3 · García-Sánchez |
| Socialization | Ch 4 · Paugh · lecture slides |
| Thought & culture | Ch 5 · DeGraff |
| Multilingual | Ch 6 · Wiel |
| Literacy & online | Ch 7 · Ch 8 · Phyak |
| Performance & gender | Ch 9 · Ch 10 |
| Race & ethnicity | Ch 11 · Zentella · hooks · Smalls & Davis |
| Power & agency | Ch 12 · Ch 13 · Perley · Alim |

## Where the questions come from

| Deck | Count | Source |
|---|---|---|
| `C01`–`C13` | 417 | Practice written from the textbook, one deck per chapter |
| `RD` | 133 | Practice written from the assigned readings (Rickford & King, García-Sánchez, Paugh, DeGraff, Wiel, Phyak, Zentella, hooks, Smalls & Davis, Perley, Alim) |
| `LS` | 6 | Practice written from the Language Acquisition and Socialization slides |
| `AP` | 30 | Anthro-pardy clues (an optional deck the student can switch out of the drill) |

None of the questions are the professor's own, so the site marks them all **✎ Based on…** and never **★ From the professor**. Students should check anything that differs from their notes.

## Add or edit questions

Textbook, slides and Anthro-pardy rows live in `drill/questions.js`. The readings rows, the subject list (`TOPICS`) and the article list (`ARTICLES`) live in `drill/shared.js`, because both the main drill and the Readings drill read them. Each question is one line:

```js
["Tag shown above the question", "Question text?", "Correct answer", ["Wrong 1", "Wrong 2", "Wrong 3"], "Explanation", "", "topicKey"],
```

- **Append new questions to the end of a deck.** Progress is stored by position, so inserting in the middle shifts saved history onto the wrong questions.
- `topicKey` is one of `F G M A T W L P R E` (see `TOPICS` in `drill/shared.js`).
- A readings row belongs to the article whose author starts its tag (`"Perley · Zombie Linguistics"`).
- Read & Learn passages (`read/chapters.js`) point at drill questions by id (`C0112` = Ch 1, question 12; `RD40` = readings row 40), so answers count toward the drill.

**After changing questions, run:**

```bash
node tools/build.js
```

This rebuilds `review/bank.js` (Review List) and `mock/bank.js` (Mock Exam). Also update the counts on the landing page if they change.

The double-tap dictionary is `assets/lexicon.js`; the "Why not …?" notes after a wrong answer come from `assets/glossary.js`. Underlined key terms in the reading (`<b>`) should have a lexicon entry; use `<strong>` for names and other emphasis.

## Archive

`archive/files.js` lists every file and link in the `Week_*` / `week_*` folders. It's generated: after adding, renaming or removing course files, run

```bash
node tools/build-archive.js
```

Textbook PDFs are named `<chapter number> <title>.pdf`; readings are matched to the drill's article list by author name; `.txt` files hold one URL per line (videos show their YouTube thumbnail, and the title is looked up in the visitor's browser). The page has `noindex` so search engines skip it, but the files are publicly reachable by URL, like everything else in a public repository and deployment.

## How progress is saved

Progress is saved **in the student's own browser** (`localStorage`). Every key starts with `a104-`, so this site never mixes with the Bio or Anthro sites even on the same domain. The main drill uses `a104-drill-v1`, the Readings drill `a104-readings-v1`, Read & Learn `a104-read-v1`, and the mock exam `a104-mock-v1` / `a104-mock-history-v1`.

Optional **Google sign-in** (Settings → Account) syncs everything across devices through Firebase. It writes to its own Firestore collection, `anth104-progress`, so it can't touch the Bio site's data. It needs two one-time steps in the Firebase console before it works: see [docs/google-sign-in.md](docs/google-sign-in.md).

## Study buddy

Dexter the kitten, the gold, the Shop, the Cat Café and the badges work as on the Bio site (`assets/buddy.js`, `assets/wardrobe.js`). Tap any cat for its panel: **Cats** starts with the Cat Café and lets you **return a cat to the café** (it keeps its XP and outfits and can come home again, which frees a spot for a new cat), and the **⚙** tab holds every cat setting (size, anchoring, levels, meow, rename, hide). Dexter's form cards now carry linguistic anthropology facts, and finishing each Read & Learn chapter earns one of 10 new badges (Voice, Hand, Fieldnote, Rattle, Lightbulb, Polyglot, Letter, Spotlight, Unity, Revival).

## Run it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish it on Vercel

1. On <https://vercel.com/new>, import this repository.
2. Set **Framework Preset** to **Other**, leave **Build Command** empty, and leave **Output Directory** as the project root.
3. Deploy. Every later push redeploys automatically.

## A note on content

Passages and questions are written for this site as a study aid; they aren't official course material.

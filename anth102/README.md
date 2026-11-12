# Anthro Drills

Multiple-choice study drills for **ANTH 102: Introduction to Human Evolution**. They're built from the course's Top Hat questions, Brightspace activities and lecture slides.

| Drill | Folder | Subject tabs |
|---|---|---|
| Exam 1 | `exam1/` | Science · Natural selection · Scientists · Cells & DNA · Protein synthesis · Genetics · Forces of evolution (192 questions) |
| Exam 2 | `exam2/` | Speciation · Phylogeny · Primate traits · Taxonomy · Picture ID · Sociality · Chimps & bonobos · Putting it together (376 questions, including the 36 original worksheet questions and 100 synthesis questions that connect lectures) |
| Classification | `classification/` | Where traits go · Chart structure · Compare & connect (149 questions) + `chart.html` drag-and-drop chart |

Each drill also has a **Mixed** tab and a **Progress** tab. Tabs group questions by subject, or switch **Group by: Source** to tick one or more sources (Top Hat, a Brightspace activity, a worksheet…) and practice them together as one round; every question shows a "Source:" label above it (Top Hat, a Brightspace activity, a worksheet, or practice).

Everything is plain static HTML, CSS and JavaScript, with no build step and no server code.

## How progress is saved

Each student's progress is saved **in their own browser, on the device they study on** (`localStorage`). Nothing is sent to a server, there are no accounts, and classmates never see each other's data.

- Every answer is recorded per question: attempts, correct answers and the most recent result.
- Each question shows its status: not answered yet, got it right, got it wrong (its last answer), or **marked for review** by the student, which takes priority. Rounds bring up marked and missed questions first.
- The **Progress** tab in each drill shows overall accuracy, accuracy by topic (weakest first), strongest and weakest areas, and the most-missed questions. Each row has a **Practice** button that starts a focused round.
- Exam 1 and Exam 2 keep separate histories (`ant1-progress-v2` and `ant2-progress-v1`).
- History doesn't move between devices or browsers, and it's erased if the student clears their browser data. Safari can also clear it after about 7 days without a visit.

## What students see

- **Subject tabs** with a small progress bar each, a **Mixed** tab, and a **Progress** tab.
- A **question map**: one square per question in the round, colored by status (right, wrong, marked for review, not answered), full color once answered this round, and an outline on the current question.
- How many questions you answered today and your day streak, in the header (no quota).
- Instant feedback: a pop on right answers, a shake on wrong ones, the explanation, and a reminder to mark missed questions for review. After a right answer the next question comes up on its own (switch off under **Options**); any tap pauses it.
- Short messages for 5/10/15/20… in a row.
- **Free browsing:** ← Previous and Next → (or Skip) move through the round, and every square in the question map is a button that jumps to that question. Skipped questions can be answered later; answered ones open read-only.
- End-of-round summary with score, best streak, missed and marked counts, and the weakest subject to practice next.
- **⚑ Mark for review** on every question. Marked questions are amber on the question map, come first in rounds, and collect in the Review list.
- **✓ Mark as mastered** on every question (all three drills, `mastery: true` in each `window.BANK`). Mastered questions are teal on the map and leave the pool: unanswered copies drop out of the current round, new rounds skip them, and they leave the Missed tab. Tap again to put one back.
- **Classification drill** (`classification/`): 149 questions from the Primate Classification worksheet (36 written + 113 generated from its answer key), kept separate from the Exam 2 drill. The generator in `classification/questions.js` runs in a fixed order; add new ones only at the end. Exam 2 shows a dismissible prompt to study it, since the chart is on the study guide.
- **Drag-and-drop chart** (`classification/chart.html`): drag worksheet traits onto the chart (word bank beside the chart on wide screens, docked tray at the bottom on phones and iPad portrait), or tap a trait and then a box. Built on Pointer Events so mouse, touch and pen all work. Mistakes, hints and time are tracked; best result saved per device.
- **Missed tab**: a bank of every question whose most recent answer was wrong, across all subjects. It practices just those; a question leaves the bank when answered right, and Go again rebuilds the round from what is still wrong (`#missed` opens it directly).
- Tap any picture to zoom.
- **Reading settings** (Options menu): choose the reading font (IBM Plex Sans, Atkinson Hyperlegible, Literata, or the device's own font) and text size (4 steps). Saved per device and shared by both drills; extra fonts download only when chosen.
- The landing page shows a countdown to Exam 2, a **Continue** button that opens the weakest subject (`exam2/index.html#continue`), and each drill's progress bar.

## Timer

There is no timer by default anywhere on the site. Students can turn one on with **Show a timer** on the mock exam setup screen or the **Timer** switch on the drag-and-drop chart (one shared setting, `anthro-timer`, saved per device). With it on, the clock, Pause, and times in results come back.

## Review list

`roots/index.html` lists the Greek and Latin word roots behind course terms, split into Exam 1 and Exam 2 tabs and grouped by the drill subject whose questions use each root's terms most often (counted from the question banks, excluding "Putting it together"), with a tab per drill subject (plus **All roots** for one big drill and **Missed**), search, and drills: students mark roots mastered (they leave the pool) or for review (they come back first). Roots answered wrong collect in a **Missed roots** card with a retry button (a right answer removes them). Saved in `anthro-roots-v1`, separate from drill progress. Edit `roots/roots.js` to add roots.

`anthropardy/index.html` is **Anthro-pardy** (the old `jeopardy/` path redirects there): the Anthro-pardy review questions (Exam 2 deck `AP` in `exam2/questions.js`, Exam 1 deck `AP` in `exam1/questions.js`) on a categories × values board. Each clue is multiple choice; a right answer earns its value, one random tile is worth double, and an optional rule takes money away for wrong answers. Games and best scores are saved in `anthro-board-v1`. The Exam 2 Anthro-pardy questions are an optional deck (`optional` in `window.BANK`): students switch them in or out of the Exam 2 drill from the drill or the game (`ant2-progress-v1-include-AP`).

`review/index.html` collects every question marked for review in any drill (and questions flagged in a mock exam, saved on submit). Students can show answers, remove questions, or **Quiz me**: answers are saved to the question's own drill progress. It reads `review/bank.js`, generated by the same build script as the mock exam.

## Mock exam

`mock/index.html` builds a fresh 50- or 100-question exam (student's choice, 50 by default) each time from the Exam 2 and Classification drills (478 unique questions; shared and repeated questions appear once). 40% of every exam (20 of 50, or 40 of 100) comes from the "Putting it together" synthesis questions; the rest is random. Answers can be changed until submitting; results show the score, a subject breakdown and a full review. Exams in progress and past scores are saved per device.

The mock exam reads `mock/bank.js` and the Review list reads `review/bank.js`; both are generated. **After changing any question bank, run:**

```bash
node tools/build-mock.js
```

## Project layout

```
index.html            landing page
assets/drill.css      shared styles
assets/drill.js       shared app: rounds, scoring, saved progress, Progress tab
exam1/questions.js    Exam 1 questions and topics
exam2/questions.js    Exam 2 questions and topics
exam*/index.html      page shell for each drill
exam*/img/            question figures
```

## Run it locally

Opening `index.html` directly works, but a local server is closer to the real site:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Add questions to Exam 2

All Exam 2 questions live in `exam2/questions.js`. Each question is one line:

```js
["Tag shown above the question", "Question text?", "Correct answer", ["Wrong 1", "Wrong 2", "Wrong 3"], "Optional explanation", "optionalFigureKey"],
```

- **Append new questions to the end of a source list** (`TH`, `A5`, `CH`, `WS`, `PR`); the source becomes the question's origin label. Progress is stored by position, so inserting in the middle would shift people's saved history onto the wrong questions.
- To attach a picture, put the file in `exam2/img/`, add an entry to `FIG` at the top of the file, and use its key as the sixth item.
- The question's **subject tab** (also used on the Progress tab) comes from its tag, through the `TOPIC2` lists near the bottom of the file. A tag that isn't listed falls back to the tab's name, so add new tags to the right topic.
- To add a whole new tab, add an entry to `DECKS`, a new array, and include it in `DATA`.

## Publish it on Vercel

1. Push this folder to a GitHub repository (see the first two steps below).
2. On <https://vercel.com/new>, import the repository.
3. Set **Framework Preset** to **Other**, leave **Build Command** empty, and leave **Output Directory** as the project root.
4. Deploy. Vercel gives you a link like `https://anthro-drills.vercel.app` to share. Every later push redeploys automatically.

You can also deploy straight from this folder, without GitHub:

```bash
npx vercel --prod
```

## Publish it on GitHub Pages

1. Create an empty repository on GitHub, for example `anthro-drills`.
2. Push this folder:

   ```bash
   git remote add origin https://github.com/<your-username>/anthro-drills.git
   ```

   ```bash
   git push -u origin main
   ```

3. On GitHub, go to **Settings → Pages**. Under **Build and deployment**, pick **Deploy from a branch**, then select `main` and `/ (root)`, and save.
4. After a minute the site is live at `https://<your-username>.github.io/anthro-drills/`. Share that link.

Netlify and Cloudflare Pages also work: point either one at the repository with no build command and the publish directory set to `/`.

## Where the questions come from

Every question was gathered from, or written to match, ANTH 102 class materials: Top Hat questions, Brightspace activities, worksheets, the in-class Anthro-pardy game, the lecture slides and the Exam 2 study guide. Exam 2 practice questions are labeled either "from the lecture slides" or "from the study guide"; the second group covers study-guide topics that weren't in the slides used, and students are told to check those against their notes. The landing page lists the count per source (update it when adding questions).

## A note on content

The question figures are cropped from course slides and screenshots. They're shared here as a study aid for classmates and aren't official course material.

## Analytics

Every page loads Vercel Web Analytics with the plain-HTML snippet (`/_vercel/insights/script.js`); there is no build step, so the `@vercel/analytics` npm package isn't used. Turn on **Analytics** for the project in the Vercel dashboard to start collecting anonymous page views. Drill progress never leaves the browser.

## Top bar and Settings

`assets/shell.js` and `assets/shell.css` are loaded in the `<head>` of every page. They add the fixed top bar (links to the study modules, current page highlighted) and the **Settings** sheet:

- **Appearance**: Light (default), Dark, or Automatic (follows the device). Saved as `anthro-theme`; dark colors live in `shell.css` under `html[data-theme="dark"]`.
- **Exam date & time**: the home page countdown and exam title use it (`anthro-exam-date`, default 2026-11-10 10:45).
- **Reading font** and **Text size**: the same `anthro-reading` setting as the drills' Options menu.
- **Layout**: Simple (default) or Detailed (`anthro-simple`). Simple opens drills straight on a question in the Mixed set, with the subject tabs, question map (`anthro-showmap`) and reminder banners tucked away, trims the drill header, hides the home page's link guide, and folds "How it works" and the sources table into one collapsed section. Detailed shows everything up front.

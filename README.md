# Eureka

One study platform for several classes. Each class has its own study guide: reading chapters, drills, mock exams and review games.

- **Front page (`index.html`).** The hero from the Eureka app (a night sky behind "Understanding Takes Time"), then the library, laid out like Apple Books: classes are book covers on shelves ("Continue", "Your Library", "More to Explore"), with a sidebar on wide screens and a tab bar on phones. A class code adds a class to the library. An **Eureka** button on every class's dashboard goes back to it.
- **What is Eureka? (`shared/about.js`).** The explanation of the service: the problem, how it works in four steps, what students and professors get, what a class contains, and thanks to the professors. "How it works" and "Who it's for" are set as plain text columns rather than cards, each idea with a small line drawing that animates once it scrolls into view (and stays still under reduced motion). It lives in one file and is shown in two places: on the front page between the hero and the library (so "What is Eureka?" just scrolls down to it) and on its own page (`about/`). It is drawn inside a shadow root so its styles stay to themselves. Its centerpiece is a scripted demonstration (pile of files → sorted by week → a line becomes a question → a student answers) that loops, pauses off screen, and moves to the next scene when clicked. `assets/demo/eureka-demo.mp4` is the same demonstration as a 17-second video, recorded from `about/index.html?demo=1`.
- **Signing in.** The library opens only after signing in with Google (`shared/account.js`, Firebase). The session is remembered on the device as `a104-session`. While Google sign-in is still being set up, a failed sign-in offers "Continue as a guest for now" so nobody is locked out; remove that fallback in `index.html` (`fail()` and `#gGuest`) once sign-in works. This is a front door, not security: class pages still open with a class code and their direct address.
- **The class bar and the look of each part of a class (`shared/classbar.js`, `shared/maison.css`).** Every page of every class has the same bar across the top: Eureka (back to the library), the class name (its dashboard), then Readings, Drill, Mock Exam, Discussion and Syllabus, with the rest under More and the current part lit. `shared/platform.js` loads it on every class page; to change what a class lists, edit `PORTALS` in `classbar.js`. The parts follow the design shown in the library walkthrough: readings on cream paper in a serif face (ErgoRead's default "Paper" theme, changeable under Aa), the drill with its subjects alongside the question on wide screens, the mock exam in a dark exam room with a square per question and a score ring on the result, and discussion responses as speech bubbles.
- **Walkthroughs (`shared/tour.js`).** Two more animated demonstrations inside "What is Eureka?": a sample student's library (the shelf, then one scene for each part of a class: readings, drill, mock exam, discussion, then the shelf again with progress saved) and studying with a companion (the tag, adopting, XP, growing up). `shared/covers.js` holds the class cover art; `shared/companion-art.js` holds a few generated stills of the companions so the front page doesn't load the whole companion engine.
- **Organizing the library.** Students arrange the front-page library themselves: favorites, "finished", their own named collections, search, four sort orders (recent, title, progress, manual), grid or list view, drag to reorder, and hide (with undo). Every class has a ••• menu with all of it. Saved as `a104-library-v1`, so it syncs with the account like other progress.
- **Syllabus (`<class>/syllabus/`).** Every class has a Syllabus page: the original PDF, what is coming up next, grading, key dates and the week-by-week schedule. `syllabus/data.js` holds the summary and `shared/syllabus.js` draws it; a class without a `data.js` shows "not added yet". ANTH 104 and ANTH 102 have theirs; Bi 239 is waiting for its syllabus. The summaries leave email addresses and the Top Hat join code to the PDF.
- **Professors.** Each class names the professor whose course it was built from (`professor` in `shared/platform.js`): Dr. Keisha I. Wiel for ANTH 104, Dr. Felicia Madimenos for ANTH 102. Bi 239 is still blank.
- **Shared look (`shared/maison.css`).** Apple's design language on every page: the system font, white and light gray surfaces, Apple blue for anything you can tap, rounded cards and pill buttons. Loaded last, it brings ANTH 102 in line with the other classes and styles the shared pieces (the Eureka button, the Companions tag).
- **The reader (`shared/ergoread.js`).** ErgoRead from the Eureka app, on every class's Read & Learn page: reading settings (theme, contrast, size, line height, width, paragraph gap, indent, heading scale, font, alignment), a word bubble when you rest the pointer on a word, a word bank, and a reading-progress bar.
- **Companions.** Elegance for the pursuit of knowledge, and study pets for the inner child. The pets are not advertised: a **Companions** link with a shining "New" tag on each class dashboard is the way in, and the tag goes quiet once the student has a companion in that class. The pets keep their own playful colors.

### The hero video

`assets/hero/` holds the sky video re-encoded from the app's 55 MB 4K original: `eureka-1080.mp4` (1.1 MB) for larger screens and `eureka-720.mp4` (0.5 MB) for phones, plus two poster stills (59 KB and 20 KB). The poster paints first; the video is fetched only after the page has loaded, is skipped for reduced motion, data saver or a slow connection, and pauses whenever it is off screen or the tab is hidden. To re-encode from a new source:

```bash
ffmpeg -i source.mp4 -an -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart assets/hero/eureka-1080.mp4
```

| Folder | What it is |
|---|---|
| `index.html` | The front page: enter a class code, then open your classes |
| `shared/` | The engine every class uses: study buddy and Cat Café (`buddy.js`, `wardrobe.js`, `xp.js`), settings and Google account (`settings.js`, `account.js`), the drill engine (`drill.js`, `drill.css`), the double-tap dictionary (`lookup.js`), and the class list and class codes (`platform.js`) |
| `anth104/` | ANTH 104: Language, Culture & Society. See [anth104/README.md](anth104/README.md) |
| `bio239/` | Bi 239: Plants, Fungi & Signals. See [bio239/README.md](bio239/README.md) |
| `anth102/` | ANTH 102: Biology & Evolution of Human Species. See [anth102/README.md](anth102/README.md). Its drills run on its own older drill engine (`anth102/assets/`) with the shared study buddy on top, and its café visitors are primates |
| `docs/` | Setting up Google sign-in and the ANTH 104 discussion board |
| `tools/class-code.js` | Makes the fingerprint for a new class code |

## Class codes

Each class opens with a code. A student types it once on the front page and that class stays open on that device. A class page opened without the code sends the student back to the front page to enter it.

| Class | Starting code |
|---|---|
| ANTH 104 | `ANTH104-MEOW` |
| Bi 239 | `BI239-MEOW` |
| ANTH 102 | `ANTH102-MEOW` |

Codes ignore capitals, spaces and dashes. **Change these before sharing the site**, since this README is public. To set a new code:

```bash
node tools/class-code.js "NEW-CODE"
```

Paste the line it prints over that class's `code:` in `shared/platform.js`. Only the fingerprint is stored there, so the file doesn't reveal the code. Then delete the table above.

Two things to know:

- Students who already had ANTH 104 progress in their browser before class codes existed keep their access without a code.
- The codes are a courtesy gate, not security. The site is static, so the study files are public to anyone who knows their address. Real access control would need sign-in checked by a server.

## Study pets

- **Nobody starts with a pet.** The Companions link on a class dashboard opens the café (the safari in ANTH 102), and the pet a student picks there is theirs. Answers before adopting earn nothing. Students who already had a buddy keep it.
- **Two separate sides.** ANTH 102 has primates only (adopted from the Primate Safari Café); every other class has cats only (from the Cat Café). The other kind is never listed, shown or trained on the wrong side, and each kind has its own limit of six.
- **Each class remembers its own choice.** Which pet is in training and which ones come along is saved per class (`per` inside `a104-dexter-cats-v1`) and restored when the student opens that class again. The pets themselves, with their XP, gold and outfits, are shared.
- **Nothing is locked in.** Any pet, the first one included, can study with you, take a break ("💤 Take a break": nobody studies with you in that class until you pick someone), or go back to the café or safari. Returned pets keep their XP and outfits and can come home again. Returning your last pet brings back the adopt prompt.
- Every pet on screen shows its level unless the student switches levels off.

## How a class plugs in

Every page of a class loads `shared/platform.js`, then the class's own `course.js`, then the shared engine. `course.js` tells the engine what is specific to the class: its storage prefix (`a104-`, `bio-`), the name of its review game, its XP bonuses, Dexter's facts and which Read & Learn badges belong to it.

Progress is saved in the browser per class (`a104-drill-v1`, `bio-read-v1`, `ant1-progress-v2` …). The cats, gold, outfits, theme and reading settings are shared by every class; they keep their original `a104-` key names so nobody's existing cats were lost in the move.

To add a class: make a folder with its pages and a `course.js`, add it to `COURSES` in `shared/platform.js`, and (if it has Read & Learn chapters) add its badges to `COURSE_BADGES` in `shared/wardrobe.js`.

## Primates and the Primate Safari Café (ANTH 102 only)

`shared/buddy.js` has ten primate species in taxonomic order: ring-tailed lemur, tarsier, golden lion tamarin, capuchin, macaque, gibbon, orangutan, gorilla, chimpanzee and bonobo. They belong to ANTH 102: the **Primate Safari Café** opens only inside that class (its front page and the Cats tab), for students who have its class code, and outside that class primates are not listed, shown or trained, and inside it cats aren't (see Study pets above).

The safari is one continuous landscape of six habitats, left to right in taxonomic order, separated the way real ones are (limestone pinnacles, a river with a log across it, foothills and a snowy mountain range, a waterfall and stream, tall grass and boulders): Madagascar's spiny forest (lemurs), a Southeast Asian night forest (tarsiers), the Amazon canopy (tamarins, capuchins), the Jigokudani hot spring in Japan (macaques), the Borneo rainforest (gibbons, orangutans) and an African forest (gorillas, chimpanzees, bonobos). Each primate sits and wanders only in its own habitat. On a laptop the whole scene fits; on a phone you swipe sideways.

What the models show:

- **Bodies and postures:** knuckle-walking great apes that stand taller at the shoulder, an upright gibbon with its arms raised (it hangs from the vine), a crouched tarsier, monkeys sitting with their hands on their knees, the lemur's sun-worship posture, grasping hands and feet, and relative body size (tarsier smallest, gorilla largest).
- **Anatomy:** platyrrhine and catarrhine nostrils, the lemur's snout, wet nose and ringed tail, the capuchin's prehensile tail, the macaque's sitting pads and cheek ruffs, no tails on the apes, the gorilla's sagittal crest, broad nose and silver saddle, the orangutan's cheek flanges and throat sac, the chimpanzee's big ears and white chin beard, the bonobo's parted hair, cheek whiskers and pink lips.
- **Behavior:** each holds what it is known for (the capuchin's hammer stone and nut, the chimpanzee's termite-fishing stick, the gorilla's bamboo, the macaque's sweet potato, the tarsier's insect, the bonobo's fruit to share, the orangutan's leaf umbrella), macaques soak in the hot spring, and each species has its own calls in its speech bubbles (pant-hoot, long call, duet, chest beat).

They wear a bead necklace where the cats wear a collar.

## Old addresses

ANTH 104 used to live at the top of the site. `vercel.json` redirects its old addresses (`/drill/…`, `/readings/…`, `/Week_1/…`) into `/anth104/`.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

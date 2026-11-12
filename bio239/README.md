# Bio Drills

Multiple-choice study drills for **Bi 239**: Ch 29 (Plant Diversity I), Ch 30 (Plant Diversity II), Ch 31 (Fungi) and Ch 39 (Plant Responses to Internal and External Signals). Built from the course's lecture slides, clicker questions and Homework 3. It uses the same engine and approach as [anthro-drills](https://github.com/Aksaddd/anthro-drills).

Everything is plain static HTML, CSS and JavaScript, with no build step and no server code.

The landing page follows the anthro site's organization: an exam panel whose modules always come in the same order. **Multiple-Choice Drill → Bio-pardy → Word Roots → HW 3 (multiple choice + answer key) → Mock Exam → Review List**. Then "How it works" with the color legend, and the sources table (★ from the professor, ✎ practice written from the slides).

The look follows Apple's design language: the system font (San Francisco), `#f5f5f7` backgrounds, Apple blue (`#0071e3`) for anything tappable, borderless white cards, pill buttons, iOS segmented controls and frosted bars and menus.

| Module | Folder | What it is |
|---|---|---|
| Landing | `index.html` | Frosted nav, countdown to the exam (Wed, Nov 11, 2:00 pm; changeable per device), **Continue** (resumes the drill used last at its weakest subject), module bar, exam panel |
| Multiple-Choice Drill | `drill/` | 203 questions in 8 subject tabs, plus **Mixed**, **Missed** and **Progress**. **Group by: Source** practices chosen sources together |
| Bio-pardy | `board/` | A Jeopardy-style board: 6 categories × 5 values, one hidden ×2 tile |
| Word Roots | `roots/` | 94 Greek and Latin roots, sorted into the drill's 8 subjects, with a drill for all of them or one subject at a time (`roots/roots.js`). Missed roots are saved: retry the ones missed in a round from its summary, or the whole missed list from the start card or a subject |
| HW 3 | `hw3/` | Its own drill (like anthro's Classification): the 89 HW 3 questions in 5 tabs that follow the homework's sections, with separate progress (`bio-hw3-v1`). `hw3/key.html` is the answer key, **answers hidden by default** |
| Mock Exam | `mock/` | A fresh 50- or 100-question exam each time from the drill, 40% from HW 3. Change answers until you submit; flagged questions go to the Review List |
| Review List | `review/` | Every question marked ⚑ for review, from both drills and mock exams |

## Read & Learn (`read/`)

The first module on the home page: the whole unit as reading comprehension. Eight chapters (the drill's eight subjects), 36 short passages written from the slides and HW 3, about a minute of reading each. After each passage come **Check yourself** questions about what was just read, shown one at a time, right in the text. Answering 3 (or all, if fewer) unlocks the next passage; the rest are bonus practice, and *Skip the questions* is always there. Key terms are bold with a soft highlight. The chapter ends with a score and links to the next chapter, the drill, or reading it again.

- **Figures and activities from the slides:** 43 figures cropped from the lecture and clicker slides (`read/img/`, rendered with their labels), plus an activity in nearly every passage (`play` in `read/chapters.js`, engine in `read/play.js`):
  - **Label the diagram** (5): the slide's own figure with its labels removed (`*-bare.jpg`); tap a label, then the **?** where it goes. Covers the signal transduction model, phytochrome's de-etiolation pathway, acid growth, the pathogen defenses figure (HR + SAR) and the maize/parasitoid wasp figure.
  - **Experiment labs** (3): the coleoptile experiments (predict, then watch Darwin & Darwin's caps and shields and Boysen-Jensen's gelatin and mica), the lettuce-seed red/far-red switch (free play plus a predict quiz), and a night-length lab (slider plus red/far-red flashes, with 3 missions for short-day and long-day plants).
  - **Put in order**, **match**, **sort**, the clicker **trait table** (cuticle / vascular tissue / seeds / flowers), **flip cards**, and a morning-glory **time-lapse**.
  - A perfect first try earns Dexter XP (as an Easy answer) with confetti; every activity can be replayed. Done activities are saved in `bio-read-v1` under `w`.
- **Content:** `read/chapters.js` (`window.READ`). Each section is `{ h, html, qs }`, where `qs` lists question ids from the drill bank (`drill/questions.js`), so there's one source of truth for questions, answers and explanations. 159 of the bank's questions appear in the reading (all but a few figure-only and duplicate ones; Bio-pardy clues stay on the board).
- **Progress:** saved per device as `bio-read-v1` (`{ chapterId: { at, finished, a: { questionId: { ok, p, o } } } }`); a finished chapter shows every passage and answer. Each answer is also written into the drill's progress (`bio-u3-progress-v1`: history, stats, Missed list, today's count), so the drill knows what you've learned and a miss shows up in its Missed tab. Answers fire `bio:correct` / `bio:wrong` like the drill, so Dexter follows along and earns XP and gold.

## Highlights and notes (Read & Learn)

To highlight, select text in any passage. A toolbar offers four colors (yellow, green, blue, pink) and ✎ Note. Tap a highlight to edit its note, change its color or delete it; highlights with a note show a small ✎.

- **On touch screens:** press and hold a word to start a selection, then drag the handles. Double-tap is the word lookup.
- **Notebook:** 🗒 Notes lists the chapter's highlights and notes. *My notebook* on the chapter list collects all of them. Tap any item to jump to it.
- **Storage:** saved per device as `bio-notes-v1`, by passage and character offsets (`read/notes.js`).

## Try again

Every answered question can be tried again:
- **Drill and HW 3:** the *Try this question again* button reshuffles the options. The new answer replaces the old one in the round's score, and the question's history keeps both.
- **Read & Learn:** *↻ Try again* under any answered question. A right answer after a retry shows "Correct on try 2!".

## Reading badges and the Badge Case

Finishing a Read & Learn chapter earns that chapter's badge:
- **The badges:** Moss, Frond, Bloom, Sprout, Ripening, Moonlight, Thorn and Spore. They're original SVG badges in `assets/wardrobe.js`, in a new `badge` wardrobe slot that can't be bought.
- **Earning one:** a celebration screen offers *Pin it on Dexter*, and the badge is then worn on his chest in every form.
- **Badge Case:** Dexter's panel has a new **Badges** tab, a trainer-style red case with 8 slots. Locked slots show only the badge's silhouette and which chapter earns it. Tap a badge to pin it on Dexter or take it off. Earned badges also appear in the Closet's accessories, in a **Badges** row right after *Things to hold*. Each earned badge is a tile: tap to pin it on the collar (📌 On collar) or tap again to take it off. The row shows how many are earned and pinned, and a 🔒 tile shows how many are left to earn (it opens the Badge Case). These are the same pins as the Badge Case.
- **Elsewhere in Read & Learn:** the chapter list shows the case as a strip, and finished chapters show their badge.
- **Collar and pinned badges:** every Dexter wears a collar in every form, starting navy. The Closet has 12 collar colors (saved as `collar` in his state). Any number of earned badges can be pinned on it at once: *📌 Pin on his collar*, *Unpin* and *Pin all* in the Badge Case (`equip.badges`; older saves with one pinned badge carry over).
  - Badges spread along the band in chapter order, keeping their sparkle, and shrink a little when there are many.
  - A collar-like neck accessory (bell collar, bandana, scarf; marked with `collar` in `assets/wardrobe.js`) replaces the base collar, and the badges move onto it.
  - Other neckwear (bow tie, stethoscope, whistle, medal) is worn over the collar, with the badges to either side.
  - The Closet's resets keep the collar and the pinned badges.
- **Restart and sparkle:** ↺ Restart in a chapter's top bar (or *↺ Restart chapter* at its end) starts it over from passage 1. Answers are cleared; notes, XP and the badge stay, and activities don't pay XP twice. Each finish adds to the chapter's count (`done` in `bio-read-v1`), and the badge levels up:
  - **2 Shiny:** a glint sweeps across it.
  - **3 Sparkling:** twinkling stars.
  - **5 Dazzling:** a golden glow.
  - **8 Legendary:** a spinning rainbow ring.

  The sparkle shows everywhere the badge does, including pinned on Dexter. A new level gets its own celebration screen. The art is `badgeArt()` and `tier()` in `assets/wardrobe.js`, drawn with SVG `<animate>`.
- **Syncing:** badges sync from `bio-read-v1` whenever a page loads (`syncBadges()` in `assets/buddy.js`), so chapters finished earlier count too.

## Double-tap a word

On every page, double-tap any word (double-click on a computer) to get a card with its definition, its word parts (each root's meaning and Greek or Latin origin, linked to the Word Roots page) and its literal meaning. The word is highlighted while the card is open; tap anywhere to close it. Links and buttons keep their normal taps, but the words of an answered question can be looked up. Plurals and Latin plurals work (sporangia, hyphae, sori, stomata), as do multi-word terms (abscisic acid, alternation of generations, systemic acquired resistance).

- In the reading, every underlined key term (`<b>` in `read/chapters.js`) has a definition. Double-tapping any word in it looks up the whole term, e.g. *abscisic acid (ABA)* or *seedless vascular plants*. Emphasis that isn't vocabulary uses `<strong>`: bold, no underline.
- `assets/lexicon.js`: the course dictionary, about 160 terms with definitions and word parts.
- `assets/lookup.js`: the engine. When a word isn't in the dictionary, it uses the Word Roots list (`roots/roots.js` example terms), then the glossary, then finds known roots inside the word. The data loads on the first hold. A one-time tip (`bio-lookup-tip`) points the feature out.

## Settings

Every page has **Settings** at the top: in the home page's nav bar, and beside "← All drills" on the other pages. It opens an iOS-style sheet (`assets/settings.js`, loaded in each page's `<head>` so the theme applies before the page paints):

- **Appearance**: Light (the default), Dark, or Automatic (follows the device). Saved as `bio-theme`. Dark mode uses Apple's dark system colors (`:root[data-theme="dark"]` in `assets/drill.css`).
- **Exam date**: drives the home-page countdown. The default (Wed, Nov 11, 2:00 pm) is `DEFAULT_EXAM` in `assets/settings.js`. A change is saved per device as `bio-exam-date` and can be reset.
- **Reading font** and **text size**, shared with the drill's Options menu (`bio-reading`).

## Study buddy

`assets/buddy.js` adds **Dexter**, an original blonde kitten drawn as SVG in an anime/chibi style (the same companion as on the Bio 2010 site), living in the bottom-right corner of every practice page. Every correct answer in the main drill, the HW 3 drill, Word Roots and Bio-pardy earns XP based on the question's difficulty, multiplied by the current win streak (see "XP and difficulty" below). He grows up at 100, 350, 900, 1,800 and 3,200 XP: **Freshman** → **Sophomore** → **Junior** → **Senior** → **Grad Student** → **Professor Dexter** (school titles, from a sleepy freshman to a professor). Each form's card ties Dexter to this course (seed dormancy, monocot cat grass, catnip's chemical defense, plant immunity, phototropism, fungi). He meows on a right answer (the sound can be switched off in Settings) and drops his yarn ball on a miss. Saved as `bio-dexter-v1`; the first time he loads he inherits the XP earned with the earlier sea-turtle buddy. Wrong answers never hurt it. Tap it for its card (progress, evolution line, rename, hide). It can be switched off in Settings. Saved per device as `bio-buddy-v1`.

Pages announce a correct answer with `window.dispatchEvent(new CustomEvent("bio:correct"))`.

## Gold and Dexter's Shop

Every right answer also earns **gold**: Easy 3, Medium 5, Hard 8, Expert 12, multiplied by the win streak (half for questions already answered right 3+ times), plus 50 gold each time Dexter evolves. New players start with a 50-gold welcome gift (plus gold for any XP already earned).

**Tap Dexter** (the study pal or the corner buddy) to open his panel. It opens on the **Cats** tab (your cats: train, on screen, co-train, the café). The other tabs are **Closet** (dress him), **Shop** (buy items) and **Progress** (level, XP, streaks, gold, the biology, the evolution line, rename or hide). Gold buys items in the Shop: 13 hats, 11 outfits and 20 accessories (glasses, neckwear, things to hold), grouped in themed sets: Police, Firefighter, Construction, Chef, Farmer, Doctor, Pilot, School, Festival, Cozy, Formal, Party, Ranch, Botanist and Royal. In the Shop, tap an item to try it on, then buy, wear or take it off. In the **Closet**, each slot (hat, outfit, glasses, neckwear, held item) offers any item she owns, **Dexter's own** (that form's built-in gear, like the professor's cap) or **None** (nothing, even hiding the built-in gear), plus *Dexter's own look* and *Take everything off*, so she can dress him however she wants. **Tap a cat on screen to see its profile:** tapping the cat in training or any companion opens the panel on that cat: its picture, a stats card and its accessories. The stats card shows a big level circle, the form title, breed and coat, its role (in training, co-training, on screen, or chilling in the café), an XP bar to the next level, XP until it evolves, and six numbers: total XP, right answers, best streak, current streak, badges pinned and weight. Below it are that cat's accessories (hats, outfits, glasses, neckwear, things to hold, badges, collar, weight). The corner icon (portal) still opens the Cats tab. **Levels are hidden on screen by default.** A *Show levels on the cats on screen* switch, in the stats card and in Progress, shows the Lv pill on the cat in training and on the corner icon, and adds "· Lv N" to the companions' name tags (`bio-dexter-showlv`, `BioBuddy.setShowLv`).

**Dress any cat:** with more than one cat, the Closet has a strip of all your cats at the top and ‹ › arrows on the stage ("Dressing Maple"). Pick a cat and dress it however you like. Hats, outfits, accessories, pinned badges, collar color and weight are saved per cat: in `bio-dexter-v1` for the cat in training, and on that cat in `bio-dexter-cats-v1` for the others. Owned items and gold are shared by the household. Every cat in the Cats tab also has a *👗 Dress* button that opens the Closet on that cat, and cats on screen update right away. Worn items replace each form's own gear slot by slot and show on Dexter everywhere: the corner buddy, his card, the evolution scene and the evolution line.

The catalog is `assets/wardrobe.js`. Items are drawn once in Dexter's full-size "kitten space" (120 × 120), so they fit all six forms. To add one, append `{ id, slot, name, set, price, svg }` (slots: `hat`, `outfit`, `face`, `neck`, `held`); ids are saved in progress, so never reuse one. Wallet, owned items and worn items are saved with Dexter (`bio-dexter-v1`: `gold`, `owned`, `equip`).

## Dexter greets you and studies with you

- **Greeting:** the first page of each visit (once per browser session), Dexter walks in wearing his current outfit and says hello in a speech bubble: an introduction on the very first visit, then a time-of-day welcome with one tip (days until the exam, XP until he evolves, gold to spend, or XP to the next level). Tap him or *Let's study!* to send him to his spot; he also leaves on his own after 8 seconds.
- **Study pal:** on any page with questions (drills, Lab Practical / HW 3, Word Roots drill, Bio-pardy, mock exam), the corner icon becomes a bigger Dexter who stays with the student: beside the question card on wide screens (he moves with it as you scroll and change questions), in the bottom corner on phones. While you read he plays, switching games about every 15 seconds: batting his yarn ball, chasing a butterfly, hunting a toy mouse, chasing a laser dot, swatting a feather wand, pouncing on a falling leaf, sitting in a cardboard box, or chasing his tail (hover him to see what he's up to). Each game has its own cat body language, since Dexter is drawn as separate parts (head, ears, eyes, tail, torso, front paws; worn items move with the right part): he swats the yarn with a paw, tracks the butterfly with his head and eyes and rears up on his hind legs, crouches and butt-wiggles before pouncing on the mouse, jerks his head after each jump of the laser dot, swats up at the feather with alternating paws, tilts his head at the falling leaf then pins it, peeks around from the box, and looks back over his shoulder at his tail. He blinks and flicks his ears now and then. After 45 seconds with no interaction he takes a cat nap (closed eyes, floating z's) and wakes when you do something. When you pick an answer he scurries over to it; a right answer makes him hop and meow with his tail straight up and ears perked; a wrong one flattens his ears, drops his tail and makes him lose his toy (it rolls away and comes back). Tap him for the Closet, Shop and Progress.
- **Move Dexter:** drag him (or the corner icon) anywhere on the screen and he stays there ("I'll sit here!"). Keyboard users can focus him and nudge him with the arrow keys (Shift for bigger steps). He still runs over to each answer you pick, then goes back to his spot. The spot is saved per device as a fraction of the screen (`<prefix>-dexter-v1-spot`), so it survives resizing and rotating, and the same spot is used for the corner icon and the study pal. Progress → *Where Dexter sits* has *Put him back beside my questions* to undo it. A tap still opens his panel (Cats tab); only a real drag (8 px or more) moves him. The code is `makeMovable()` in `assets/buddy.js`.
- **Cat body and poses:** Dexter has a real cat body under his chibi head, drawn in three poses (`sitBody`, `standBody` and `lieBody` in `assets/buddy.js`):
  - **Sitting:** haunches, two front legs, hind feet and a tail around his side. Used in the Closet, the dock and most games.
  - **Standing:** side view on four legs. He trots on all fours whenever he travels (to an answer, or back to his spot): diagonal legs swing together, his body bobs, his tail streams and he faces the way he's going. He also hunts the mouse, the laser dot and his own tail on all fours, with tensed hind legs.
  - **Lying:** a curled loaf for naps, paws tucked and tail wrapped around.
  - Hats, glasses, neckwear and badges move with his head. Outfits are mapped onto the side of his standing or lying body.
- **Weight:** a slider in the Closet goes from Slim through Just right, Well fed and Chubby to Absolute chonk (0.75–1.5, saved as `weight` in his state). It widens his body, belly, haunches and legs in every pose.
- **Breeds and colors:** 9 breeds, each with its own build (`shape` in `BREEDS`, `assets/buddy.js`: ear size, head shape, tail thickness, body build, ruff, ear tufts, fluff, gloss) and 2–4 coat colors, 28 in all:
  - **Domestic Shorthair** (Dexter): golden, cream, gray, chocolate
  - **Tabby**: orange, silver, brown, cream
  - **Tuxedo**: black, gray or orange, each with white
  - **Bombay**: sleek black or smoke
  - **Siamese**: slender, with big ears, a wedge face and points: seal, chocolate, blue, lilac
  - **Calico**: classic or dilute
  - **Russian Blue**: blue or silver blue
  - **Persian**: tiny ears, a round face, a fluffy ruff and tail: white, cream, chinchilla silver, black
  - **Maine Coon**: lynx tufts, a lion's ruff and a huge tail: brown tabby, red, silver

  Older saved coats map to breed + color (`LEGACY`).
- **The Cat Café** (the café storefront on the landing page, or Cats tab → *Visit the Cat Café*): a cozy illustrated café where cats lounge.
  - **Landing-page entrance:** a storefront card above the exam panel (`#cafeDoor`). It has a striped awning, twinkling string lights, a sign, and a door with a swinging OPEN sign that swings open on hover. The windows show who's inside today (your chilling cats first, marked ♥, then today's guests), drawn by `BioBuddy.cafeWindow()`, with a live count. Tap anywhere on it to go in; the windows refresh when you come back out.
  - **The room:** an arched sunset window with drifting clouds, twinkling string lights, swaying lamps, a chalkboard menu, shelves with books and plants, a coffee counter with a steaming espresso machine, a sofa, a rug, a basket and a little cat tree.
  - **Who's there:** two cats of every breed in different coats (colors rotate daily), plus your own cats who aren't studying, so the café is packed (about 19 cats), with a few spots left free for wandering.
  - **Wall climbing:** a rope bridge from the window sill to the shelves and two wooden wall steps, each with cats lounging on them (`CAFE_WALL`).
  - **Toys everywhere** (`CAFE_TOYS`): rolling yarn balls, a robot mouse that zooms back and forth across the rug with a blinking antenna, a red laser dot, a swinging feather wand, a ball-track toy with a ball circling, a fish plush and crinkle balls.
  - **Cats at play:** spots with an `act` (yarn, mouse, feather, laser) have the cat play that game with the same body animations as the study pal (swatting, butt-wiggle stalking, tail twitching) and big hunting eyes.
  - **Life in the café:** cats blink, swish their tails, chirp ("mrrp?") and wander between spots every couple of seconds.
  - **Meeting a cat:** tap a guest to pick a coat color and a name, then *Bring to study* (adopt and train) or *Adopt · come along*. Tap one of your cats to study with it, bring it along, or let it keep chilling.
- **The cat tree (in the Café):** a big multi-floor cat tree stands in the café's corner: a carpeted top perch for two, a pink hammock, a cubby house with a roof perch (the cat sits right on the roof, above the doorway) and a base, plus a swinging pom-pom, a toy mouse and a ball (`TREE_SVG`).
  - Cats can go inside the cubby house: one at a time, a cat walks in and only its face peeks out of the round doorway (clipped to the hole, `inside` spot), sometimes dozing, until it comes back out and another takes a turn. Tap the face to meet that cat.
  - Its floors are lounging spots: cats nap in the hammock, sit on the perches and wander on and off. Cats on the tree play together now and then, hopping with hearts and chirps.
  - On study pages there's no tree (`treeOn()` is false): the companions float beside the cat in training so the questions stay uncluttered.
- **A household of cats:** the **Cats** tab in the companion's panel lists every cat in the household. A free adoption picks from 9 breeds, each the same chibi cat with its own coat, eyes and markings: Golden (Dexter), Orange Tabby, Silver Tabby, Black Cat, Tuxedo, Siamese, Calico, Russian Blue, Snow White (`BREEDS` / `setCoat()` in `assets/buddy.js`). Up to 6 cats.
  - **Training:** one cat is *in training* and earns the XP. *Train* switches with one tap.
  - **What's per cat:** XP, level, evolution, name, breed, outfit, collar color, pinned badges and weight.
  - **What's shared:** gold, owned items and earned badges belong to the household.
  - **Storage:** the cat in training lives in `bio-dexter-v1` as before, and the others wait in `bio-dexter-cats-v1` (`household()`, `trainCat()`, `adoptCat()`). Stage names use each cat's own name ("Freshman Mango").
- **Staying out of the way:** as you scroll, the cats move along with the page but never sit on text, questions or answers. After each scroll (checked about 5 times a second) the screen is mapped on a 6 px grid: every line of text (its real line boxes, so the empty end of a short line or the space between cards counts as free) and every button, link, input, image and answer choice. Each cat goes to the free spot nearest where it wants to be: its saved spot, beside the cat in training, or the answer just picked. It stays put while its spot is still clear. When you pick an answer the cat runs to it and perches on the empty part of the answer box, not on its words. If the screen is completely full, a cat peeks in from the edge; if it still has to overlap something, it turns see-through (`bb-inway`). This is off while a sheet, the café or a drag is open.
- **Cat tower (default):** companions stack up on the head of the cat in training, each a little off-center so they look piled up, with the top cat drawn in front. The tower needs a clear column. If the whole tower doesn't fit without covering something, as many cats as fit stay stacked and the rest find their own free spots. Stacked cats hide their name tags; co-trainees show a small 📚. When she picks an answer, the cat in training dashes over on his own and the tower stacks back up when he's home. A cat you drag somewhere leaves the tower and stays put (*↺ Back beside him* puts it back).
- **Companions on screen:** tick *On screen* for any of your other cats (all 6 can be out at once), and they sit beside the cat in training on question pages, on the open side so they don't cover the questions. With more than 3 out they wrap into rows and their name tags shrink. A cat you stop training comes along automatically.
- **Co-training (split XP):** tick *📚 Co-train* on any cat that's on screen to train it at the same time. Each correct answer's XP (after the streak multiplier) is split evenly between the cat in training and every co-trainee (rounded, at least 1 each), and each one's correct count goes up. Gold isn't split; it belongs to the household. The XP pop shows "×N cats · X XP split N ways", co-trainees hop and wear a 📚 name tag, and level-ups and evolutions are announced for them too. Stored as `co` (ids) in `bio-dexter-cats-v1`; switching *Train* to a co-trainee keeps the group together.
  - **Following:** they trot after him when he moves, play their own games, and nap when he naps.
  - **Answers:** they hop with happy eyes on a right answer. After a miss, one comes over for a comforting nuzzle.
  - **Interactions:** about every 13 seconds one interacts with him: a nuzzle with hearts, grooming his head (he closes his eyes happily), a crouch-and-pounce game (he hops), or a chase lap around him while he watches.
  - **Tapping one** opens the Cats tab.
  - **Moving companions:** drag any companion on its own (or focus it and use the arrow keys). It stays where it's dropped, even when the cat in training runs to an answer, and the spot is saved per cat (`spots` in `bio-dexter-cats-v1`). *↺ Back beside him* in the Cats tab returns one cat; Progress → *Put him back* returns everyone.
- **Tiny kittens you raise:** every cat starts at Level 1 as a tiny kitten (`baby` form in `FORM_GEAR[0]`).
  - **Look:** a small body, big sparkly eyes (16% larger), smaller ears, rosy cheeks, no grown-up brows and a stubby tail. Awake and curious; asleep only for naps.
  - **Growth:** cats grow with every bit of XP, not just at evolutions (`sizeFor()`): 62% size at 0 XP, a little bigger after each right answer, then a jump at each evolution, up to 126% at Level 100. The study pal, companions, the Closet preview and the greeting all use it.
- **Mystic Dexter:** every form is a little magical, and more so as he evolves. He also grows bigger with each evolution: the study pal goes from 84% size as a freshman to 119% as the Professor, as do the Closet stage, the greeting and the evolution line. The layers are drawn with SVG `<animate>`, so they move everywhere he appears (`MYST` and `mystic()` in `assets/buddy.js`):
  - **Every form:** a glowing forehead gem, a soft pulsing aura that grows and changes color, and floating sparks of light.
  - **Sophomore and up:** a spirit flame on his tail tip.
  - **Junior and up:** luminous cheek marks.
  - **Senior and Grad Student:** one ghostly spirit tail; **Professor:** two, like the twin-tailed cat of folklore, that sway beside his real one.
  - **Grad Student:** a turning half ring of glowing paw prints.
  - **Professor:** a full golden ring of paw prints. The aura is kept light so he always reads as a cat first.
- **Expressions:** Dexter's eyes (and mouth) show his mood. Everyday eyes for the yarn; wide, sparkly wonder eyes with raised brows and a little "o" mouth for the butterfly and the leaf; big dilated pupils while hunting the laser, feather and his tail; lowered, focused lids and angled brows while stalking the mouse; heavy content lids in the box; relaxed closed eyes when napping. A right answer gives happy ^ ^ eyes and an open smile; a wrong one gives droopy eyes, worried brows, a tear and a wobbly frown. He greets you with happy eyes and looks sparkly-eyed at himself in the Closet and Shop. The newborn keeps his eyes shut except to react. The code is `eye()`, `mouth()` and `ACT_EYES` in `assets/buddy.js`.
- Both respect *Reduce motion* and switch off with *Show study buddy* in Settings. The code is in `assets/buddy.js` (search for "Study pal" and "Greeting").

## XP and difficulty

`assets/xp.js` rates every question and turns it into XP (it runs in Node too, for calibration):

| Tier | XP | Share of the drill |
|---|---|---|
| Easy | 10 | 44% |
| Medium | 20 | 38% |
| Hard | 35 | 13% |
| Expert | 50 | 4% |

The score adds up what makes a question hard: the professor's clicker question or a homework concept (+1), EXCEPT/NOT wording (+2), putting steps in order (+2), several numbered statements or blanks (+1), reading an experiment or a figure (+1 each), comparing two things or explaining why/how (+1 each), five choices, long similar answers or "All of the above" (+1 each), a long question (+1), and the Bio-pardy dollar value. It also adds the student's own history: missed it last time, or usually misses it (+1). Score 0–1 is Easy, 2–3 Medium, 4–5 Hard, 6+ Expert. A question already answered right 3+ times earns half XP. Word roots are Easy (Medium for a root missed before).

**Win streaks** (right answers in a row, across every module) multiply XP: 3 in a row ×1.25, 5 ×1.5, 10 ×2, 15 ×2.5, 25 ×3. A wrong answer resets the streak but never removes XP; a streak also cools off after 3 hours away. Levels run from 1 to 100 and follow total XP: level L needs about 20,000 × ((L−1)/99)^1.5 XP, so the forms arrive at Lv 3, 7, 13, 20 and 30 and Level 100 (20,000 XP) is a long-term mastery goal. Each drill question shows its tier and XP; hover or long-press the badge for the reasons.

## Subject tabs

Land plants · Seedless vascular · Seed plants · Signals · Hormones · Light & time · Stress & defense · Fungi

## Where the questions come from

| Deck | Count | Source |
|---|---|---|
| `HW` | 89 | Homework 3. The professor's questions, rewritten as multiple choice; questions with several parts become one question per part. Answers are written from the slides. |
| `C29` `C30` `C31` `C39` | 17 · 8 · 15 · 17 | The professor's clicker decks, with the answer keys from the slide notes |
| `LS` | 27 | Practice on Ch 39 lecture-slide details the homework doesn't ask about directly |
| `AP` | 30 | Bio-pardy clues (an optional deck the student can switch out of the drill) |

The Ch 39 answers come straight from the lecture slides. There were no lecture slides for Ch 29–31, so those answers follow the clicker questions and the Campbell *Biology* chapters they come from. Homework questions 29–35 aren't in the homework file.

## How progress is saved

Progress is saved **in the student's own browser** (`localStorage`). Nothing is sent to a server, and there are no accounts. Every key starts with `bio-`, so this site never mixes with anthro-drills even on the same domain. The main drill uses `bio-u3-progress-v1`, the HW 3 drill `bio-hw3-v1`, and the mock exam `bio-mock-v1` / `bio-mock-history-v1`.

## Add questions

Questions live in `drill/questions.js`, one line each. The Homework 3 rows, figures and topics live in `drill/shared.js`, because both the main drill and the HW 3 drill read them:

```js
["Tag shown above the question", "Question text?", "Correct answer", ["Wrong 1", "Wrong 2", "Wrong 3"], "Explanation", "figureKey or empty", "topicKey"],
```

- **Append new questions to the end of a deck.** Progress is stored by position, so inserting in the middle shifts saved history onto the wrong questions.
- `topicKey` is one of `L V S T H P D F` (see `TOPICS` at the top of the file).
- Figures live in `drill/img/` and are listed in `FIG`.
- Questions may contain small bits of HTML (`<sub>`, `<sup>`, `<i>`).
- For a new course unit, copy `drill/` to a new folder and give it a new `storageKey`.

**After changing questions, run:**

```bash
node tools/build.js
```

This rebuilds `review/bank.js` (Review List) and `mock/bank.js` (Mock Exam). Also update the counts on the landing page (`data-total` and the "Where the questions come from" list).

The "Why not …?" notes after a wrong answer come from `assets/glossary.js`: add a term there to explain a wrong option.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish it on Vercel

1. Push this folder to a GitHub repository.
2. On <https://vercel.com/new>, import the repository.
3. Set **Framework Preset** to **Other**, leave **Build Command** empty, and leave **Output Directory** as the project root.
4. Deploy. Every later push redeploys automatically.

Vercel Web Analytics is wired in with the plain-HTML snippet. Turn on **Analytics** for the project in the Vercel dashboard to collect anonymous page views. Drill progress never leaves the browser.

## A note on content

The question figures are cropped from course slides. They're shared here as a study aid and aren't official course material.

## Google sign-in

Settings → **Account** → *Sign in with Google* saves everything (progress, cats, gold, badges, notes, settings) to the person's Google account and syncs it across devices. It uses Firebase Authentication and Firestore (project `meowstudy-5750f`, config in `assets/account.js`), with no server of our own. How it works, sync rules, limits and the console setup are in [docs/google-sign-in.md](docs/google-sign-in.md).

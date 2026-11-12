# MeowStudy

One study platform for several classes. Each class has its own study guide (reading chapters, drills, mock exams, review games), and one study buddy (Dexter and the other cats, gold, outfits, the Cat Café) follows the student across all of them.

It combines three repositories that used to be separate sites: [Anth104](https://github.com/Aksaddd/Anth104), [bio-drills](https://github.com/Aksaddd/bio-drills) and [anthro-drills](https://github.com/Aksaddd/anthro-drills). Everything is plain static HTML, CSS and JavaScript, with no build step.

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

## How a class plugs in

Every page of a class loads `shared/platform.js`, then the class's own `course.js`, then the shared engine. `course.js` tells the engine what is specific to the class: its storage prefix (`a104-`, `bio-`), the name of its review game, its XP bonuses, Dexter's facts and which Read & Learn badges belong to it.

Progress is saved in the browser per class (`a104-drill-v1`, `bio-read-v1`, `ant1-progress-v2` …). The cats, gold, outfits, theme and reading settings are shared by every class; they keep their original `a104-` key names so nobody's existing cats were lost in the move.

To add a class: make a folder with its pages and a `course.js`, add it to `COURSES` in `shared/platform.js`, and (if it has Read & Learn chapters) add its badges to `COURSE_BADGES` in `shared/wardrobe.js`.

## Primates (ANTH 102)

Alongside the cat breeds, `shared/buddy.js` has ten primate species in taxonomic order: ring-tailed lemur, tarsier, golden lion tamarin, capuchin, macaque, gibbon, orangutan, gorilla, chimpanzee and bonobo. In ANTH 102 they visit the Cat Café and can be adopted; once adopted they come along in every class, like any cat.

They have their own bodies and postures (knuckle-walking great apes that stand taller at the shoulder, an upright gibbon with its arms raised, a crouched tarsier, monkeys with their hands on their knees) and the anatomy the course teaches: platyrrhine and catarrhine nostrils, the lemur's wet nose and ringed tail, the capuchin's prehensile tail, the macaque's sitting pads, no tails on the apes, the gorilla's sagittal crest and silver saddle, the orangutan's cheek flanges. They wear a bead necklace where the cats wear a collar.

## Old addresses

ANTH 104 used to live at the top of the site. `vercel.json` redirects its old addresses (`/drill/…`, `/readings/…`, `/Week_1/…`) into `/anth104/`.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

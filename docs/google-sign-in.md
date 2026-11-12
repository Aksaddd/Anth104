# Google sign-in

**Status:** the code is in place and points at the same Firebase project as the Bio site, **MeowStudy** (`meowstudy-5750f`), configured in `assets/account.js`. This site stores its data in its **own collection**, `anth104-progress`, so it can never overwrite the Bio site's `progress` documents. Sign-in starts working after the two one-time steps below. Until then, *Sign in with Google* in Settings shows an error and nothing else changes: progress still saves in the browser.

## What it does

Everything the site saves (drill progress, Read & Learn, notes, Anthro-pardy, mock exams, the review list, every cat, gold, items, badges, settings) lives in the browser's `localStorage` on one device. Signing in with Google keeps all of it in the student's account, so they can pick up on any phone, tablet or laptop.

| Piece | What | Details |
|---|---|---|
| Sign-in | Firebase Authentication | Google popup (falls back to a redirect if popups are blocked). Firebase keeps the student signed in until they sign out. |
| Storage | Cloud Firestore | One document per person: `anth104-progress/{uid}` = `{ data: "<JSON of every a104-* localStorage key>", savedAt: <ms>, device: "<id>" }` |
| Code | `assets/account.js` | Loaded by `assets/settings.js` on every page. Firebase SDK 10.x from `www.gstatic.com/firebasejs/`. |

**Sync rules**

1. **Save:** any write to an `a104-*` key marks the device as changed. It saves about 4 seconds later, and again when the page is hidden or closed.
2. **Load:** on every visit, and when the tab comes back into view, it reads the account.
   - If another device saved more recently and this device hasn't changed since, it takes the account's data and reloads the page once.
   - If this device changed more recently, it saves over the account.
3. The account's own keys (`a104-account-*`) are never synced. The size cap is 900 KB, far above what the site stores.

## Turning it on (site owner, about 5 minutes)

1. In <https://console.firebase.google.com>, open **MeowStudy** → **Authentication → Settings → Authorized domains → Add domain** and add this site's domain (for example `anth104.vercel.app`, plus any custom domain).
2. **Firestore Database → Rules**: add the `anth104-progress` block next to the existing `progress` one and publish:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{db}/documents {
       match /progress/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
       match /anth104-progress/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
3. Test on two devices: sign in on the one with progress, then on a second one. Both should show the same cats and progress.

To use a separate Firebase project instead, paste its `firebaseConfig` into `SITE_CONFIG` at the top of `assets/account.js` and repeat the steps there (enable the Google provider, create the Firestore database, add the rule).

# Discussion board

`discuss/index.html` is a class discussion board. Students sign in with Google (the same sign-in as progress sync), pick a question and post a response. Each person gets **one response per question**, which they can edit or delete. They can also reply to and like (♥) classmates' responses, and add the exact question their professor asked.

- **Starter questions:** 32 in `discuss/prompts.js`, two per week, written from that week's materials. Keep their `id`s stable: responses are linked by id.
- **Answer first:** classmates' responses stay hidden until you post your own, with a *Show them anyway* button.
- **Who sees what:** only signed-in users can read responses and replies. Anyone can see the starter questions.
- **Drafts** are kept in the browser until posted.

## Data (Cloud Firestore, project MeowStudy)

| Collection | Document | Fields |
|---|---|---|
| `anth104-prompts` | auto id | `title`, `text`, `week`, `uid`, `name`, `createdAt` |
| `anth104-responses` | `<promptId>__<uid>` (one per person per question) | `promptId`, `uid`, `name`, `photo`, `text`, `likes` (uids), `createdAt`, `updatedAt` |
| `anth104-replies` | auto id | `promptId`, `responseId`, `uid`, `name`, `photo`, `text`, `createdAt` |

## Turning it on (site owner, one time)

The board needs Google sign-in working (see [google-sign-in.md](google-sign-in.md): the site's domain must be an authorized domain). Then, in the Firebase console → **Firestore Database → Rules**, add these blocks inside `match /databases/{db}/documents { … }` next to the existing ones, replace `YOUR_EMAIL@example.com` with your own Google address (so you can remove posts), and publish:

```
    function signedIn() { return request.auth != null; }
    function isAdmin() { return signedIn() && request.auth.token.email in ['YOUR_EMAIL@example.com']; }
    function isText(s, max) { return s is string && s.size() > 0 && s.size() <= max; }

    match /anth104-prompts/{id} {
      allow read: if true;
      allow create: if signedIn() && request.resource.data.uid == request.auth.uid
        && isText(request.resource.data.title, 140) && isText(request.resource.data.text, 1500)
        && request.resource.data.week is int && request.resource.data.week >= 1 && request.resource.data.week <= 16;
      allow delete: if signedIn() && (resource.data.uid == request.auth.uid || isAdmin());
    }

    match /anth104-responses/{id} {
      allow read: if signedIn();
      allow create: if signedIn() && request.resource.data.uid == request.auth.uid
        && id == request.resource.data.promptId + '__' + request.auth.uid
        && isText(request.resource.data.text, 4000) && request.resource.data.likes == [];
      allow update: if signedIn() && (
        (resource.data.uid == request.auth.uid
          && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['text', 'name', 'photo', 'updatedAt'])
          && isText(request.resource.data.text, 4000))
        || (resource.data.uid != request.auth.uid
          && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likes'])
          && request.resource.data.likes.toSet().difference(resource.data.likes.toSet()).hasOnly([request.auth.uid])
          && resource.data.likes.toSet().difference(request.resource.data.likes.toSet()).hasOnly([request.auth.uid])));
      allow delete: if signedIn() && (resource.data.uid == request.auth.uid || isAdmin());
    }

    match /anth104-replies/{id} {
      allow read: if signedIn();
      allow create: if signedIn() && request.resource.data.uid == request.auth.uid && isText(request.resource.data.text, 1500);
      allow delete: if signedIn() && (resource.data.uid == request.auth.uid || isAdmin());
    }
```

Until the rules are added, the board shows "The discussion board isn't switched on yet."

**Moderation:** the admin email can delete any question, response or reply from the Firebase console (Firestore Database → Data). The rules also allow it from code, but the page only shows Delete buttons on your own posts.

**Limits:** Firebase's free Spark plan allows 50,000 reads and 20,000 writes a day, plenty for a class. The board listens live, so new responses appear without reloading.

# Pointing eureka.it.com at this site

The site is deployed on Vercel from this repository's `main` branch. Connecting a domain is done in two places:
the Vercel project (so it answers for the domain) and the domain's DNS (so the domain points at Vercel).
Nothing in the repository needs to change.

## 1. Add the domain in Vercel

1. Open <https://vercel.com>, choose this project, then **Settings → Domains**.
2. Type `eureka.it.com`, press **Add**, and choose to connect it to the **Production** environment (`main`).
3. Vercel now shows the DNS record it expects. Keep that page open: use the exact values it shows.

If Vercel says the domain is already in use by another project (the earlier Eureka app), open that project's
**Settings → Domains**, remove `eureka.it.com` there, and add it here again.

## 2. Set the DNS record where the domain is managed

In the DNS settings for `eureka.it.com` (the it.com account, or wherever its nameservers point), create the record
Vercel showed. It is normally one of these:

| Type | Name | Value |
|---|---|---|
| `CNAME` | `@` (or `eureka`, depending on the panel) | `cname.vercel-dns.com` |
| `A` (if the panel doesn't allow a CNAME there) | `@` | `76.76.21.21` |

Remove any older `A`, `AAAA` or `CNAME` record for the same name first, or the old site will keep answering.

## 3. Wait and check

DNS changes usually take a few minutes, sometimes up to a day. In **Settings → Domains** the domain shows
**Valid Configuration** when it's working, and Vercel issues the HTTPS certificate by itself.

## 4. After it works

- **Google sign-in:** in the Firebase console (project MeowStudy) add `eureka.it.com` under
  **Authentication → Settings → Authorized domains**, or sign-in will be refused on the new address.
- **Progress:** browsers keep saved progress per address, so anything students did on the `vercel.app` address
  does not appear on `eureka.it.com` (unless they sign in to sync). Share the new address from the start.
- To send visitors of the old `vercel.app` address to the new one, set `eureka.it.com` as the primary domain in
  **Settings → Domains** and choose "Redirect to" on the other entry.

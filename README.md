# Ökoplan Landscaping — the system and the website

Independent of Ninety since 16 Oct 2026 (Mahmoud): the code here is Ökoplan's own copy and is edited directly —
nothing is rebuilt from the Ninety studio engine any more (`tools/legacy-mk-oeko.py` is kept only as a record of how the first copy was derived).

| Path | What | URL |
|---|---|---|
| `/` | the public website (`index.html`, `work.html`, `services.html`, `studio.html`, `contact.html`, `site.css`, `site.js`) | https://mahmoudfawzy1212mf-crypto.github.io/oekoplan-landscaping/ |
| `app/` | the office system (PWA): `index.html`, `app.js` (engine), `oekoplan.js` + `oeko-home.js` (Ökoplan layer), `sw.js`, `config.js`, `manifest.json`, `vendor/`, `icons/`, `_src/` (brand, portfolio photos, awards, partners, team), `meet.html`, `get/`, `Oekoplan.apk` | https://mahmoudfawzy1212mf-crypto.github.io/oekoplan-landscaping/app/ |
| `tools/` | `legacy-mk-oeko.py` (archive) | — |

Database: Supabase project `hwpffrjvwnbpzpzbpeml` (own project). Edge functions: `oeko-smart`, `oeko-learn`, `oeko-rules`, `oeko-mail`, `oeko-site` (website: published gallery projects + the contact form → Enquiries).

## Publishing the app
1. Edit `app/…` directly (engine changes go in `app/app.js`; Ökoplan features in `app/oekoplan.js`).
2. Bump the build: write a new tag in `app/BUILD.txt` (`YYYYMMDD-HHMM-<sha6>`), and update the `?v=` on `app.js` in `app/index.html` and in `app/sw.js` (`SHELL` + `BUILD`).
3. Commit, push. GitHub Pages serves it in ~1 minute; the service worker picks the new build up on the next open.

Later: custom domain `oekoplanlandscaping.com` (website) and `app.oekoplanlandscaping.com` (system) — a CNAME file here + DNS.

# book-prash

A modern, animated booking page for Prash — Technical Integrations & AI Solutions at Sector Growth.

Live: https://prash.sectorgrowth.com

## Stack

Pure static site — vanilla HTML, CSS, and JavaScript. No build step. No framework. No backend.

Booking is integrated via Google Calendar's official scheduling button script — clicking either duration card opens Google's native booking modal in-page.

## Files

- `index.html` — single semantic page
- `assets/styles.css` — all styling (tokens, layout, ambient effects, animations, responsive)
- `assets/app.js` — Google booking integration + click delegation
- `assets/logo.webp` — Sector Growth logo
- `assets/favicon.png` — favicon
- `CNAME` — GitHub Pages custom domain (prash.sectorgrowth.com)

## Editing booking URLs

Both Google Workspace Appointment booking page URLs are constants at the top of `assets/app.js`:

```js
const BOOKING_30MIN_URL = '...';
const BOOKING_60MIN_URL = '...';
```

Edit those, commit, push. GitHub Pages will redeploy automatically.

## Deploy

This repo is auto-deployed via GitHub Pages from the `main` branch root.

### One-time setup (already done)

1. Repo Settings → Pages → Source: `Deploy from a branch`, Branch: `main`, Folder: `/` (root)
2. Custom domain: `prash.sectorgrowth.com`
3. Enforce HTTPS: enabled (after Let's Encrypt cert provisions)
4. DNS at the domain provider for `sectorgrowth.com`:

   | Type  | Host    | Value                       | TTL |
   |-------|---------|-----------------------------|-----|
   | CNAME | `prash` | `sector-growth.github.io`   | 300 |

   If `sectorgrowth.com` has CAA records, ensure `letsencrypt.org` is permitted:
   `sectorgrowth.com. CAA 0 issue "letsencrypt.org"`

# Embedding this app in Figma Sites

Figma Sites can't run the Vite/React build itself — it embeds live web content via
an iframe. This repo deploys to GitHub Pages, and that URL goes into a Figma Sites
**Embed** block.

## One-time setup

1. **Push to GitHub** (if no remote yet):
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. The [`Deploy to GitHub Pages`](.github/workflows/deploy.yml) workflow runs on every
   push to `main`. When it finishes, the **Actions → Deploy** job prints the live URL,
   e.g. `https://<you>.github.io/<repo>/`.

## Put it in Figma Sites

1. Open your site in Figma Sites → add an **Embed** block.
2. Paste the GitHub Pages URL. For the full app, size the embed to fill the
   viewport (100% width/height of a full-bleed section).
3. Publish.

## Notes

- `vite.config.ts` uses `base: './'` (relative) and the app uses **HashRouter**, so it
  works at any sub-path with no server rewrites — ideal for project Pages + iframe.
- Images (Unsplash) and the review translation API (MyMemory) need internet; both work
  inside the iframe.
- `localStorage` (language, applications, reviews) is keyed to the Pages origin. Strict
  browser privacy settings can limit third-party iframe storage.
- Figma has no build step: re-deploy (push to `main`) to update what the embed shows.
- Single-file alternative: `npm run build:single` produces
  `lotte-roaming-standalone.html` — host that one file and embed it the same way.

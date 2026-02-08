# Propose Day (simple static site)

## What it does
- Clicking **No** grows **Yes** and changes **No** text (5 times).
- After the 5th **No** click, **No** disappears.
- Clicking **Yes** shows the love letter section and starts audio.

## Customize
- Edit the text in `script.js` (the `content` object).
- Replace placeholder images in `images/` (currently `1.svg`, `2.svg`, `3.svg`, `4.svg`).
- Optional background decals: add transparent PNGs as `images/bg1.png` .. `images/bg6.png`.
- Add your song as `song.mp3` in the project root (same level as `index.html`).
  - If `song.mp3` is missing, the site plays a short placeholder tone instead.

## Run locally
Easiest options:
- VS Code extension: **Live Server** → "Open with Live Server"
- Or run a simple server:
  - `python -m http.server 5173`
  - then open `http://localhost:5173`

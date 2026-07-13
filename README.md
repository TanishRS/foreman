# Foreman — AI Automation Studio

Single-page site for Foreman, a solo AI automation studio (custom n8n workflows + web systems around them).

Dark, restrained design: near-black `#0A0A0B` ground, vivid red `#C4293D` accent with a soft accent glow, procedural SVG grain texture, and an animated lead-intake workflow diagram.

## Stack
Static HTML rendered by a small same-origin client runtime (`support.js`). No build step.

## Local
```bash
python3 -m http.server 8000   # runtime needs same-origin, so serve over HTTP
# open http://localhost:8000
```

## Deploy
Live on Vercel: https://foreman-studio.vercel.app

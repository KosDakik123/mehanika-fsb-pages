# Mehanika (GitHub Pages)

Jednostavna **Vite + React** verzija FSB Mehanika workspacea za statički hosting.

- 3 panela: unos · SVG skica (pan/zoom, Skica/FBD) · lokalno korak-po-korak rješenje
- **Bez OpenAI / bez backend API** — sve radi u pregledniku
- Katalog Mehanika 1 / 2 / MDT + generator

## Live (GitHub Pages)

Nakon deploya:

`https://<github-user>.github.io/mehanika-fsb-pages/`

## Lokalno

```bash
git clone https://github.com/<github-user>/mehanika-fsb-pages.git
cd mehanika-fsb-pages
npm install
npm run dev
```

Build za Pages:

```bash
VITE_BASE=/mehanika-fsb-pages/ npm run build
npm run preview
```

## Deploy

Push na `main` pokreće GitHub Action **Deploy GitHub Pages**.  
U repo Settings → Pages → Source: **GitHub Actions**.

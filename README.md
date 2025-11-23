# HL1.css

HL1.css is a small retro UI CSS library inspired by Half‑Life 1. It provides classic-style components (buttons, inputs, dialogs, tabs, tooltips, etc.) and a demo page to try them out.

## Quick start

Add the minified stylesheet to your HTML:

```html
<link rel="stylesheet" href="/css/HL1.min.css">
```

Or use the compiled (non-minified) stylesheet:

```html
<link rel="stylesheet" href="/css/HL1.css">
```

Demo script (optional):

```html
<script type="module" src="./src/main.js"></script>
```

## Development

Install dependencies:

```powershell
npm install
```

Run dev server (Vite):

```powershell
npm run dev
```

Build CSS (compile + minify):

```powershell
npm run build:css
```

Build production bundle (Vite):

```powershell
npm run build
```

Preview production build:

```powershell
npm run preview
```

## Main files

- `index.html` — demo page and entry for examples
- `src/HL1.css` — source CSS (PostCSS input)
- `css/HL1.css` — compiled CSS
- `css/HL1.min.css` — minified CSS for production
- `src/index.css` — demo-specific styles
- `src/main.js` — small demo JS (toggle code, copy to clipboard)
- `package.json` — scripts and dependencies

## Contributing

Issues and pull requests are welcome. If you want a license added (e.g. MIT), tell me and I can add it.

---

If you want a shorter or longer version, or an additional English/Markdown badge, I can update it.
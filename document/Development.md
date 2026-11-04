## ⚙️Development

Install Dependencies:

```powershell
npm install
```

### 1. Dev (Edit + Live Reload)

Run Dev Server (Vite):

```powershell
npm run dev
```

- Open `http://localhost:5173` — doc pages load `src/HL1.css` + `src/HL1.js` directly, so edits in `src/` show up right away (no build needed)
- Edit CSS in `src/css/` (`base.css`, `base.scoped.css`, `components.css`)
- Edit JS in `src/HL1.js`
- Add / update examples in `src/doc/*.html` and framework tabs in `src/doc/framework-tabs.js`

### 2. Build Library (CDN Files 🌎)

Build CSS + JS For CDN (Compile + Minify → `HL1/`):

```powershell
npm run build:hl1
```

Or build one part only:

```powershell
npm run build:css   # HL1/HL1.min.css + HL1/HL1.scoped.min.css
npm run build:js    # HL1/HL1.min.js
```

- Commit the `HL1/` folder — jsDelivr serves it from GitHub (`@main`)
- After pushing, jsDelivr may cache the old file for a while. Purge it if needed:
  `https://purge.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css` (same for `HL1.scoped.min.css`, `HL1.min.js`)

### 3. Build Doc Site (Vite)

Build Production Bundle (→ `dist/`, not committed):

```powershell
npm run build
```

Preview Production Build:

```powershell
npm run preview
```

- New doc page? Add it to `rollupOptions.input` in `vite.config.js`, otherwise it won't be in `dist/`

### Release Checklist

1. `npm run dev` → check the change on the doc pages
2. `npm run build:hl1` → update CDN files in `HL1/`
3. `npm run build` → make sure the doc site builds
4. Update `VersionUpdate.txt` + checklist in `README.md`
5. Commit + push

## ⚙️Main files

- `index.html` — Doc Home Page (links to each doc page)
- `src/HL1.css` — Source CSS, full build (PostCSS input → `HL1/HL1.min.css`)
- `src/HL1.scoped.css` — Source CSS, scoped build for Tailwind / MUI / Bootstrap (→ `HL1/HL1.scoped.min.css`)
- `src/css/base.css` — Color variables, reset, body, scrollbar
- `src/css/base.scoped.css` — Same variables for the scoped build (no global selectors)
- `src/css/components.css` — All `.hl-*` components + layout / utilities
- `src/HL1.js` — Library JS: Modal, Dropdown, Notification, Code Block (→ `HL1/HL1.min.js`)
- `src/index.css` — Doc-Only Styles (not in the library)
- `src/doc/*.html` — Doc Pages (Elements, Components, Form, Layout, Spacing, Flexbox, Color Palette)
- `src/doc/framework-tabs.js` — Doc-Only: HTML / React / Next.js / Vue code tabs
- `HL1/HL1.min.css` — Minified CSS For Production 🌎
- `HL1/HL1.scoped.min.css` — Minified Scoped CSS For Production 🌎
- `HL1/HL1.min.js` — Minified JS For Production 🌎
- `postcss.config.cjs` — PostCSS Plugins (import, nesting, autoprefixer, px → rem, cssnano)
- `vite.config.js` — Doc Pages For `npm run build`
- `package.json` — Scripts And Dependencies

---

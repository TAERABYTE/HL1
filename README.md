
<div style="background-color: #4a5942; padding: 40px 30px; border-radius: 8px;">
  <div style="display: flex; gap: 15px; align-items: center; justify-content: center; color: #ffffff;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/8/8f/Orange_lambda.svg" alt="HL1.css logo" height="60" style="margin: 0;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Official_CSS_Logo.svg" alt="CSS logo" height="60" style="margin: 0;">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png" alt="CSS logo" height="60" style="margin: 0;">
  </div>
</div>
<br>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->


# 入 HL1.css

**A Lightweight, Retro UI CSS Framework 入 Inspired by Half-Life 1.** <br>
**[🔗Documentation](https://hl1css.vercel.app/ "🔗Documentation")**

<br>

## 📥 Installation

### CDN (Content Delivery Network)
Skip the download with jsDelivr to deliver cached version of HL1 compiled CSS and JS to your project.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css"/>
<script src="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js" defer></script>
```

### Using with Tailwind / MUI / Bootstrap
Use the scoped build. It does not touch `body`, `*` or the page scrollbar — HL1's reset and font apply only inside `.hl-root`, and `.hl-*` components work anywhere.
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.scoped.min.css"/>

<div class="hl-root">
  <button class="hl-btn">OK</button>
</div>
```

### React / Next.js / Vue
Works with the same CDN links (SSR-safe, safe to load twice). To drive a modal from state, add `data-hl-controlled` to the overlay: HL1 then never toggles `hidden` itself and only fires `hl:modal-close` (with `detail.reason`: `button` | `overlay` | `escape` | `api`) so your framework can update its state. See the docs for ready-made `HLModal` components.

<br>
<br>

## 📚 CSS Library

### 1. ⚛️ Elements

* **Block** [ ]
* **Box** [ ]
* **Button** [X]
* **Content** [ ]
* **Delete** [ ]
* **Icon** [X]
* **Image** [ ]
* **Notification** [ ]
* **Tag** [ ]
* **Title** [ ]
* **Horizontal Rule** [X]

---

### 2. 🧩 Components

* **Card** [ ]
* **Dropdown** [ ]
* **Menu** [ ]
* **Message** [ ]
* **Modal** [X]
* **Navbar** [ ]
* **Pagination** [ ]
* **Panel** [ ]
* **Tabs** [X]
* **Progress bars** [X]

---

### 3. 📝 Forms 

* **General** [ ]
* **Input** [X]
* **Textarea** [ ]
* **Select** [X]
* **Checkbox** [X]
* **Radio** [ ]
* **File** [ ]

---

### 4. 📐 Layout 

* **Container** [X]
* **Hero** [ ]
* **Section** [ ]
* **Media Object** [ ]
* **Columns** [ ]
* **Grid** [ ]

---

### 5. 🛠️ Utilities

* **Color Palette** [ ]
* **Spacing** [X]
* **Visibility** [ ]
* **Flexbox** [ ]
* **Other** [ ]

---

<br>
<br>
<br>
<br>
<br>

```html
🧡 Inspiration and Backstory

HL1.css was born from warm childhood memories of spending countless hours on classic legendary games like Half-Life 1 and Counter-Strike 1.6!

We were deeply captivated by the simple, angular Interface and HUD design, along with the unique low-fidelity colors characteristic of the '90s and '2000s. This inspired us to bring that exact "feeling" back to the modern web.

This project is not just a typical CSS Library; it's a Love Letter to the golden age of PC gaming we grew up with. It meticulously recreates familiar UI elements like Beveled Buttons, Bitmap Fonts, and Green-Gray Tones using modern CSS.

```

<br>
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ -->
<div align="center">

`[HL1.css: NON-PROFIT PROJECT] Built purely out of passion, with no intention of commercial trade or financial gain. Its sole purpose is to share joy and nostalgia through web development.` 🧑‍💻

</div>
<br>

<div align="center">
  <a href="https://github.com/TAERABYTE/HL1.css/blob/main/src/README.md">
    <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW9rd3o4aDdndWIwbmp1aTMyNzNtNG10dWppcXZlZDlzazJ5bDJyNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2x4b4X7yUnmww/giphy.gif" alt="HL1.css" height="150" />
  </a>
    <img src="https://media.moddb.com/images/members/5/4640/4639916/profile/color.png" alt="HL1.css" height="150" />

</div>
<br>
<div align="center">

![Version](https://img.shields.io/github/v/tag/TAERABYTE/HL1.css?label=Version)
![Size](https://img.shields.io/bundlephobia/minzip/hl1.css)
![License](https://img.shields.io/github/license/TAERABYTE/HL1.css)

</div>
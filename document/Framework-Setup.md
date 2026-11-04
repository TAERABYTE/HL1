# 🧩 ติดตั้ง HL1 ใน Next.js / React / Vue (Step by Step)

หลักการเดียวกันทุก framework:

> **วาง CDN 2 บรรทัด (CSS + JS) ไว้ที่ "ไฟล์กลาง" ที่ครอบทุกหน้า แค่ครั้งเดียว**
> จากนั้นทุกหน้า / ทุก component ใช้ class `hl-*` ได้เลย ไม่ต้อง import ซ้ำ

| Framework | ไฟล์กลาง |
|---|---|
| Next.js (App Router) | `app/layout.tsx` |
| Next.js (Pages Router) | `pages/_document.tsx` + `pages/_app.tsx` |
| React (Vite) | `index.html` |
| React (Create React App) | `public/index.html` |
| Vue (Vite) | `index.html` |
| Nuxt 3 | `nuxt.config.ts` |

### เลือก CSS ตัวไหนดี

| ไฟล์ | ใช้เมื่อ |
|---|---|
| `HL1.min.css` | โปรเจคใช้ HL1 อย่างเดียว |
| `HL1.scoped.min.css` | ใช้คู่กับ Tailwind / MUI / Bootstrap (ไม่แตะ `body`, `*`, scrollbar ของทั้งหน้า) |

ใช้ **ตัวใดตัวหนึ่ง** เท่านั้น ส่วน JS มีไฟล์เดียวคือ `HL1.min.js`

```txt
CSS ปกติ  : https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css
CSS scoped: https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.scoped.min.css
JS        : https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js
```

---

## ▲ Next.js (App Router)

### Step 1 — วาง CDN ที่ `app/layout.tsx`

ไฟล์นี้ครอบทุกหน้าในโปรเจค วางที่นี่ที่เดียวพอ

```tsx
// app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 1) CSS */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css"
        />
      </head>
      <body>
        {children}

        {/* 2) JS — ใช้ <Script> ของ Next ไม่ใช่ <script> ธรรมดา */}
        <Script
          src="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

> ถ้าใช้ Tailwind ให้เปลี่ยน CSS เป็น `HL1.scoped.min.css` และวาง `<link>` นี้ **ก่อน** CSS ของ Tailwind

### Step 2 — (TypeScript) ประกาศ type ให้ `window.HLModal`

สร้างไฟล์ `types/hl1.d.ts` — ถ้าไม่เรียก `window.HLModal` ในโค้ด ข้ามขั้นนี้ได้

```ts
// types/hl1.d.ts
declare global {
  interface Window {
    HLModal?: { open: (id: string) => void; close: (id: string) => void };
  }
}
export {};
```

### Step 3 — ใช้งานในหน้าไหนก็ได้

ใช้ `className` แทน `class` — component ที่ไม่มี state / onClick เป็น Server Component ได้เลย

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="hl-con">
      <button className="hl-btn">Button</button>
      <button className="hl-btn-success">Success</button>
      <hr className="hl-hr" />
    </main>
  );
}
```

ถ้ามี `useState` / `onClick` ต้องใส่ `"use client"` บรรทัดแรก

```tsx
// app/settings/page.tsx
"use client";
import { useState } from "react";

export default function Settings() {
  const [name, setName] = useState("");

  return (
    <div className="hl-con">
      <label className="hl-input__label" htmlFor="name">Name</label>
      <input
        id="name"
        className="hl-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}
```

### Step 4 — Modal

**แบบง่าย (ไม่ใช้ state)** — HL1 เปิด/ปิด/ลากให้เอง

```tsx
<button className="hl-btn" data-hl-modal-open="my-modal">Open</button>

<div className="hl-modal-overlay hidden" data-hl-modal-id="my-modal">
  <div className="hl-modal">
    <div className="heading">
      <div className="wrapper"><div className="icon"></div><p className="text">Title</p></div>
      <button className="hl-btn close no-drag" data-hl-modal-close="my-modal"></button>
    </div>
    <div className="content">Hello</div>
  </div>
</div>
```

**แบบผูกกับ state** — ใส่ `data-hl-controlled` แล้วฟัง event `hl:modal-close`
(component `HLModal` แบบเต็มอยู่ในหน้า doc → Components → Modal → แท็บ Next.js)

```tsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const onClose = () => setOpen(false);
    el?.addEventListener("hl:modal-close", onClose);
    return () => el?.removeEventListener("hl:modal-close", onClose);
  }, []);

  return (
    <>
      <button className="hl-btn" onClick={() => setOpen(true)}>Open</button>

      <div
        ref={ref}
        className={"hl-modal-overlay" + (open ? "" : " hidden")}
        data-hl-modal-id="settings"
        data-hl-controlled
      >
        <div className="hl-modal">
          <div className="heading">
            <div className="wrapper"><div className="icon"></div><p className="text">Settings</p></div>
            <button className="hl-btn close no-drag" data-hl-modal-close="settings"></button>
          </div>
          <div className="content">Hello</div>
        </div>
      </div>
    </>
  );
}
```

### Next.js (Pages Router)

ถ้าโปรเจคเป็นแบบเก่า (มีโฟลเดอร์ `pages/`) แยกวาง 2 ไฟล์

```tsx
// pages/_document.tsx  → CSS
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

```tsx
// pages/_app.tsx  → JS
import type { AppProps } from "next/app";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Script
        src="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js"
        strategy="afterInteractive"
      />
    </>
  );
}
```

---

## ⚛️ React (Vite)

### Step 1 — วาง CDN ที่ `index.html` (อยู่ที่ root ของโปรเจค)

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>

    <!-- HL1 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css" />
    <script src="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js" defer></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

> Create React App: วางเหมือนกันแต่ที่ไฟล์ `public/index.html`

### Step 2 — ใช้งานใน component ไหนก็ได้

```jsx
// src/App.jsx
import { useState } from "react";

export default function App() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="hl-con">
      <button className="hl-btn" onClick={() => alert("hi")}>Button</button>

      <div className="hl-checkbox">
        <input
          id="agree"
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <label className="hl-checkbox__label" htmlFor="agree">Agree</label>
      </div>
    </div>
  );
}
```

### Step 3 — แปลง HTML จาก doc เป็น JSX

copy โค้ดจากแท็บ HTML แล้วแก้ตามนี้ (หรือกดแท็บ React ในหน้า doc ได้เลย)

| HTML | JSX |
|---|---|
| `class="..."` | `className="..."` |
| `for="..."` | `htmlFor="..."` |
| `tabindex="1"` | `tabIndex={1}` |
| `checked="checked"` | `defaultChecked` |
| `value="..."` (ไม่ผูก state) | `defaultValue="..."` |
| `style="width: 80%"` | `style={{ width: "80%" }}` |
| `<input>` | `<input />` (ต้องปิด tag) |

### Step 4 — Modal

เหมือน Next.js ทุกอย่าง (ดู Step 4 ของ Next.js) แค่ไม่ต้องใส่ `"use client"`

---

## 🟩 Vue 3 (Vite)

### Step 1 — วาง CDN ที่ `index.html` (อยู่ที่ root ของโปรเจค)

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>

    <!-- HL1 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css" />
    <script src="https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js" defer></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

### Step 2 — ใช้งานใน component ไหนก็ได้

Vue ใช้ `class` / `for` เหมือน HTML ปกติ copy จากแท็บ HTML ได้เกือบตรงๆ

```vue
<!-- src/App.vue -->
<script setup>
import { ref } from "vue";

const name = ref("");
const checked = ref(false);
</script>

<template>
  <div class="hl-con">
    <label class="hl-input__label" for="name">Name</label>
    <input id="name" class="hl-input" v-model="name" />

    <div class="hl-checkbox">
      <input id="agree" type="checkbox" v-model="checked" />
      <label class="hl-checkbox__label" for="agree">Agree</label>
    </div>

    <button class="hl-btn" @click="name = ''">Clear</button>
  </div>
</template>
```

### Step 3 — Modal

**แบบง่าย** — ใช้ markup เดียวกับแท็บ HTML (`data-hl-modal-open` / `data-hl-modal-close`)

**แบบผูกกับ state** — ใส่ `data-hl-controlled` แล้วฟัง `@hl:modal-close` ได้ตรงๆ
(component `HLModal.vue` แบบ `v-model:open` อยู่ในหน้า doc → Components → Modal → แท็บ Vue)

```vue
<script setup>
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <button class="hl-btn" @click="open = true">Open</button>

  <div
    :class="['hl-modal-overlay', { hidden: !open }]"
    data-hl-modal-id="settings"
    data-hl-controlled
    @hl:modal-close="open = false"
  >
    <div class="hl-modal">
      <div class="heading">
        <div class="wrapper"><div class="icon"></div><p class="text">Settings</p></div>
        <button class="hl-btn close no-drag" data-hl-modal-close="settings"></button>
      </div>
      <div class="content">Hello</div>
    </div>
  </div>
</template>
```

### Nuxt 3

ไม่มี `index.html` → วางที่ `nuxt.config.ts` แทน (ใช้ได้ทุกหน้าเหมือนกัน)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css",
        },
      ],
      script: [
        {
          src: "https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js",
          defer: true,
        },
      ],
    },
  },
});
```

---

## ✅ เช็คว่าติดตั้งสำเร็จ

1. รันโปรเจค แล้วเปิด DevTools (`F12`) → แท็บ **Console**
2. ต้องเห็นข้อความ `HL1 CDN loaded ✓` (ขึ้นครั้งเดียว)
3. ปุ่ม `<button className="hl-btn">` ต้องเป็นสไตล์ Half-Life (สีเขียวเทา มีขอบนูน)

## ❓ ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| ปุ่มไม่มีสไตล์ | ลืมวาง `<link>` CSS หรือพิมพ์ `class` แทน `className` ใน React |
| Modal กดเปิดไม่ขึ้น | ลืมวาง `<script>` JS / `data-hl-modal-open` กับ `data-hl-modal-id` ชื่อไม่ตรงกัน |
| Modal ผูก state แล้วเปิดครั้งที่ 2 ไม่ขึ้น | ลืมใส่ `data-hl-controlled` หรือไม่ได้ฟัง event `hl:modal-close` |
| Tabs หลายชุดในหน้าเดียวกดแล้วตีกัน | `name` ของ radio ซ้ำกัน → ใช้ `useId()` (React / Vue 3.5+) |
| font / margin ของทั้งเว็บเปลี่ยน | ใช้ `HL1.min.css` คู่กับ Tailwind/MUI → เปลี่ยนเป็น `HL1.scoped.min.css` แล้วครอบด้วย `<div class="hl-root">` |
| แก้ไฟล์แล้วแต่ CDN ยังเป็นของเก่า | กดลิงก์ purge ใน [NoteDev.md](NoteDev.md) |

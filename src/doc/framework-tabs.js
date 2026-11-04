/* -------------------------------------------------------
   Doc only: เพิ่มแท็บ HTML / React / Next.js / Vue ในทุก .code-block
   key = id ของ section ที่ครอบ code-block อยู่
------------------------------------------------------- */

const CSS_URL = "https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.css";
const CSS_SCOPED_URL = "https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.scoped.min.css";
const JS_URL = "https://cdn.jsdelivr.net/gh/TAERABYTE/HL1@main/HL1/HL1.min.js";

const SCOPED_NOTE = `ใช้คู่กับ Tailwind / MUI / Bootstrap → เปลี่ยน CSS เป็นตัว scoped:
  ${CSS_SCOPED_URL}
  - ไม่แตะ body, *, scrollbar ของทั้งหน้า
  - ใส่ class="hl-root" ที่กล่องที่อยากได้ font + reset ของ HL1
  - component .hl-* ใช้ได้ทุกที่ แม้อยู่นอก .hl-root`;

/* -------------------------------------------------------
   Component ที่เป็น markup ล้วน (ไม่มี state / event)
   เขียน HTML ครั้งเดียว → แปลงเป็น React / Next.js / Vue ให้อัตโนมัติ
------------------------------------------------------- */

const indent = (str, n) =>
  str
    .split("\n")
    .map((line) => (line ? " ".repeat(n) + line : line))
    .join("\n");

const toJsx = (html) =>
  html
    .replace(/<!--\s*([\s\S]*?)\s*-->/g, "{/* $1 */}")
    .replace(/\sclass=/g, " className=")
    .replace(/\sfor=/g, " htmlFor=")
    .replace(/<(img|input|br|hr)\b([^>]*?)\s*\/?>/g, "<$1$2 />");

function staticExamples(name, html) {
  const component = `export default function ${name}() {
  return (
    <>
${indent(toJsx(html), 6)}
    </>
  );
}`;

  return {
    html,
    react: component,
    next: `// ไม่มี state / event → เป็น Server Component ได้ (ไม่ต้อง "use client")\n${component}`,
    vue: `<template>\n${indent(html, 2)}\n</template>`,
  };
}

const FRAMEWORKS = [
  { key: "html", label: "HTML" },
  { key: "react", label: "React" },
  { key: "next", label: "Next.js" },
  { key: "vue", label: "Vue" },
];

const EXAMPLES = {
  /* ---------------------------------------------------- */
  Installation: {
    html: `<!-- วางใน <head> -->
<link rel="stylesheet" href="${CSS_URL}" />
<script src="${JS_URL}" defer></script>

<!--
${SCOPED_NOTE}
-->
<link rel="stylesheet" href="${CSS_SCOPED_URL}" />
<div class="hl-root">
  <button class="hl-btn">OK</button>
</div>`,

    react: `<!-- React (Vite / CRA): index.html หรือ public/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="${CSS_URL}" />
    <script src="${JS_URL}" defer></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>

// ใช้ class ปกติผ่าน className ได้เลย
export default function App() {
  return <button className="hl-btn">Hello HL1</button>;
}

/*
${SCOPED_NOTE}
*/
export function AppWithTailwind() {
  return (
    <div className="hl-root p-4">
      <button className="hl-btn">Hello HL1</button>
    </div>
  );
}`,

    next: `// Next.js (App Router): app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="${CSS_URL}" />
      </head>
      <body>
        {children}
        <Script src="${JS_URL}" strategy="afterInteractive" />
      </body>
    </html>
  );
}

// (ถ้าใช้ TypeScript) types/hl1.d.ts — ให้เรียก window.HLModal / HLNotify ได้
declare global {
  interface Window {
    HLModal?: { open: (id: string) => void; close: (id: string) => void };
    HLDropdown?: { close: () => void };
    HLNotify?: {
      show: (
        message: string,
        options?: { type?: "" | "success" | "warning" | "danger"; title?: string; timeout?: number }
      ) => { close: () => void };
    };
  }
}
export {};

// Pages Router: วาง <link> ใน pages/_document.tsx
// และ <Script src="..." strategy="afterInteractive" /> ใน pages/_app.tsx

/*
${SCOPED_NOTE}
  - Tailwind v4: วาง <link> ของ HL1 ไว้ก่อน CSS ของ Tailwind
*/`,

    vue: `<!-- Vue (Vite): index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="${CSS_URL}" />
    <script src="${JS_URL}" defer></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>

// Nuxt 3: nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: "stylesheet", href: "${CSS_URL}" }],
      script: [{ src: "${JS_URL}", defer: true }],
    },
  },
});

/*
${SCOPED_NOTE}
*/`,
  },

  /* ---------------------------------------------------- */
  Input: {
    react: `import { useState } from "react";

export default function InputDemo() {
  const [name, setName] = useState("");

  return (
    <>
      <input
        className="hl-input"
        id="input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="hl-input__label" htmlFor="input">First name</label>

      <br />
      <br />

      <input type="text" defaultValue="john wick" className="hl-input" />
      <input type="text" disabled defaultValue="Disabled" className="hl-input" />
    </>
  );
}`,

    next: `"use client";
import { useState } from "react";

export default function InputDemo() {
  const [name, setName] = useState("");

  return (
    <>
      <input
        className="hl-input"
        id="input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="hl-input__label" htmlFor="input">First name</label>

      <br />
      <br />

      <input type="text" defaultValue="john wick" className="hl-input" />
      <input type="text" disabled defaultValue="Disabled" className="hl-input" />
    </>
  );
}`,

    vue: `<script setup>
import { ref } from "vue";

const name = ref("");
</script>

<template>
  <input class="hl-input" id="input" type="text" v-model="name" />
  <label class="hl-input__label" for="input">First name</label>

  <br />
  <br />

  <input type="text" value="john wick" class="hl-input" />
  <input type="text" disabled value="Disabled" class="hl-input" />
</template>`,
  },

  /* ---------------------------------------------------- */
  Checkbox: {
    react: `import { useState } from "react";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="hl-checkbox">
      <input
        id="checkbox"
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <label className="hl-checkbox__label" htmlFor="checkbox">Checkbox</label>
    </div>
  );
}`,

    next: `"use client";
import { useState } from "react";

export default function CheckboxDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="hl-checkbox">
      <input
        id="checkbox"
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <label className="hl-checkbox__label" htmlFor="checkbox">Checkbox</label>
    </div>
  );
}`,

    vue: `<script setup>
import { ref } from "vue";

const checked = ref(false);
</script>

<template>
  <div class="hl-checkbox">
    <input id="checkbox" type="checkbox" v-model="checked" />
    <label class="hl-checkbox__label" for="checkbox">Checkbox</label>
  </div>
</template>`,
  },

  /* ---------------------------------------------------- */
  Select: {
    react: `import { useState } from "react";

const options = ["i", "love", "you", "so much"];

export default function SelectDemo() {
  const [value, setValue] = useState(options[0]);

  return (
    <>
      <label className="hl-select__label" htmlFor="something">choose something:</label>
      <select
        className="hl-select"
        name="something"
        id="something"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </>
  );
}`,

    next: `"use client";
import { useState } from "react";

const options = ["i", "love", "you", "so much"];

export default function SelectDemo() {
  const [value, setValue] = useState(options[0]);

  return (
    <>
      <label className="hl-select__label" htmlFor="something">choose something:</label>
      <select
        className="hl-select"
        name="something"
        id="something"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </>
  );
}`,

    vue: `<script setup>
import { ref } from "vue";

const options = ["i", "love", "you", "so much"];
const value = ref(options[0]);
</script>

<template>
  <label class="hl-select__label" for="something">choose something:</label>
  <select class="hl-select" name="something" id="something" v-model="value">
    <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
  </select>
</template>`,
  },

  /* ---------------------------------------------------- */
  RadioGroup: {
    react: `import { useState } from "react";

const animals = ["Elephant", "Monkey", "Cheetah", "Giraffe"];

export default function RadioGroupDemo() {
  const [animal, setAnimal] = useState("");

  return (
    <fieldset className="hl-fieldset">
      <legend>What is your favorite wild animal?</legend>
      {animals.map((a) => (
        <div className="radio-wrapper" key={a}>
          <input
            type="radio"
            name="animal"
            id={a.toLowerCase()}
            value={a}
            checked={animal === a}
            onChange={(e) => setAnimal(e.target.value)}
          />
          <label htmlFor={a.toLowerCase()}>{a}</label>
        </div>
      ))}
    </fieldset>
  );
}`,

    next: `"use client";
import { useState } from "react";

const animals = ["Elephant", "Monkey", "Cheetah", "Giraffe"];

export default function RadioGroupDemo() {
  const [animal, setAnimal] = useState("");

  return (
    <fieldset className="hl-fieldset">
      <legend>What is your favorite wild animal?</legend>
      {animals.map((a) => (
        <div className="radio-wrapper" key={a}>
          <input
            type="radio"
            name="animal"
            id={a.toLowerCase()}
            value={a}
            checked={animal === a}
            onChange={(e) => setAnimal(e.target.value)}
          />
          <label htmlFor={a.toLowerCase()}>{a}</label>
        </div>
      ))}
    </fieldset>
  );
}`,

    vue: `<script setup>
import { ref } from "vue";

const animals = ["Elephant", "Monkey", "Cheetah", "Giraffe"];
const animal = ref("");
</script>

<template>
  <fieldset class="hl-fieldset">
    <legend>What is your favorite wild animal?</legend>
    <div class="radio-wrapper" v-for="a in animals" :key="a">
      <input type="radio" name="animal" :id="a.toLowerCase()" :value="a" v-model="animal" />
      <label :for="a.toLowerCase()">{{ a }}</label>
    </div>
  </fieldset>
</template>`,
  },

  /* ---------------------------------------------------- */
  Slider: {
    react: `import { useState } from "react";

export default function SliderDemo() {
  const [brightness, setBrightness] = useState(25);

  return (
    <div className="hl-slider">
      <div className="value">
        <p>Dark</p>
        <p>Light</p>
      </div>
      <div className="ruler"></div>
      <input
        id="range"
        type="range"
        min="1"
        max="100"
        value={brightness}
        onChange={(e) => setBrightness(Number(e.target.value))}
      />
      <label htmlFor="range">Brightness</label>
    </div>
  );
}`,

    next: `"use client";
import { useState } from "react";

export default function SliderDemo() {
  const [brightness, setBrightness] = useState(25);

  return (
    <div className="hl-slider">
      <div className="value">
        <p>Dark</p>
        <p>Light</p>
      </div>
      <div className="ruler"></div>
      <input
        id="range"
        type="range"
        min="1"
        max="100"
        value={brightness}
        onChange={(e) => setBrightness(Number(e.target.value))}
      />
      <label htmlFor="range">Brightness</label>
    </div>
  );
}`,

    vue: `<script setup>
import { ref } from "vue";

const brightness = ref(25);
</script>

<template>
  <div class="hl-slider">
    <div class="value">
      <p>Dark</p>
      <p>Light</p>
    </div>
    <div class="ruler"></div>
    <input id="range" type="range" min="1" max="100" v-model.number="brightness" />
    <label for="range">Brightness</label>
  </div>
</template>`,
  },

  /* ---------------------------------------------------- */
  ProgressBar: {
    react: `export default function ProgressBar({ value = 80 }) {
  return (
    <div className="hl-progress-bar">
      <div className="bars" style={{ width: value + "%" }}></div>
    </div>
  );
}

// <ProgressBar value={80} />`,

    next: `// ไม่มี state → เป็น Server Component ได้ (ไม่ต้อง "use client")
export default function ProgressBar({ value = 80 }: { value?: number }) {
  return (
    <div className="hl-progress-bar">
      <div className="bars" style={{ width: value + "%" }}></div>
    </div>
  );
}

// <ProgressBar value={80} />`,

    vue: `<script setup>
defineProps({ value: { type: Number, default: 80 } });
</script>

<template>
  <div class="hl-progress-bar">
    <div class="bars" :style="{ width: value + '%' }"></div>
  </div>
</template>

<!-- <ProgressBar :value="80" /> -->`,
  },

  /* ---------------------------------------------------- */
  Button: {
    react: `export default function ButtonDemo() {
  return (
    <>
      <button className="hl-btn" onClick={() => alert("clicked")}>Button</button>
      <button className="hl-btn-success">Success</button>
      <button className="hl-btn-primary">Primary</button>
      <button className="hl-btn-warning">Warning</button>
      <button className="hl-btn-danger">Danger</button>
      <button className="hl-btn" disabled>Disabled</button>
    </>
  );
}`,

    next: `"use client"; // ต้องมีเพราะใช้ onClick

export default function ButtonDemo() {
  return (
    <>
      <button className="hl-btn" onClick={() => alert("clicked")}>Button</button>
      <button className="hl-btn-success">Success</button>
      <button className="hl-btn-primary">Primary</button>
      <button className="hl-btn-warning">Warning</button>
      <button className="hl-btn-danger">Danger</button>
      <button className="hl-btn" disabled>Disabled</button>
    </>
  );
}`,

    vue: `<script setup>
const onClick = () => window.alert("clicked");
</script>

<template>
  <button class="hl-btn" @click="onClick">Button</button>
  <button class="hl-btn-success">Success</button>
  <button class="hl-btn-primary">Primary</button>
  <button class="hl-btn-warning">Warning</button>
  <button class="hl-btn-danger">Danger</button>
  <button class="hl-btn" disabled>Disabled</button>
</template>`,
  },

  /* ---------------------------------------------------- */
  Tooltip: {
    react: `const positions = {
  Right: { left: "125%" },
  Left: { right: "125%" },
  // set some width, and then set margin-left to be half of the width
  Top: { bottom: "100%", width: 100, left: "50%", marginLeft: -50 },
  Bottom: { top: "100%", width: 100, left: "50%", marginLeft: -50 },
};

export default function TooltipDemo() {
  return (
    <>
      {Object.entries(positions).map(([name, style]) => (
        <div key={name}>
          <div className="hl-tooltip">
            {name}
            <span className="text" style={style}>Tooltip text</span>
          </div>
          <br />
        </div>
      ))}
    </>
  );
}`,

    next: `import type { CSSProperties } from "react";

const positions: Record<string, CSSProperties> = {
  Right: { left: "125%" },
  Left: { right: "125%" },
  // set some width, and then set margin-left to be half of the width
  Top: { bottom: "100%", width: 100, left: "50%", marginLeft: -50 },
  Bottom: { top: "100%", width: 100, left: "50%", marginLeft: -50 },
};

export default function TooltipDemo() {
  return (
    <>
      {Object.entries(positions).map(([name, style]) => (
        <div key={name}>
          <div className="hl-tooltip">
            {name}
            <span className="text" style={style}>Tooltip text</span>
          </div>
          <br />
        </div>
      ))}
    </>
  );
}`,

    vue: `<script setup>
const positions = {
  Right: { left: "125%" },
  Left: { right: "125%" },
  // set some width, and then set margin-left to be half of the width
  Top: { bottom: "100%", width: "100px", left: "50%", marginLeft: "-50px" },
  Bottom: { top: "100%", width: "100px", left: "50%", marginLeft: "-50px" },
};
</script>

<template>
  <div v-for="(style, name) in positions" :key="name">
    <div class="hl-tooltip">
      {{ name }}
      <span class="text" :style="style">Tooltip text</span>
    </div>
    <br />
  </div>
</template>`,
  },

  /* ---------------------------------------------------- */
  Dialog: {
    react: `import { useRef } from "react";

export default function DialogDemo() {
  const dialogRef = useRef(null);

  return (
    <section>
      <button type="button" className="hl-btn" onClick={() => dialogRef.current?.showModal()}>
        Open dialog
      </button>

      <dialog className="hl-dialog" ref={dialogRef}>
        <form method="dialog">
          <div className="heading">
            <div className="wrapper drag-handle">
              <div className="icon"></div>
              <p className="text">Options</p>
            </div>
            <button className="hl-btn close no-drag"></button>
          </div>
          <div className="content">Dialog content...</div>
          <menu className="footer-btns">
            <button className="hl-btn" value="ok">OK</button>
            <button className="hl-btn" value="cancel">Cancel</button>
            <button className="hl-btn" value="apply">Apply</button>
          </menu>
        </form>
      </dialog>
    </section>
  );
}`,

    next: `"use client";
import { useRef } from "react";

export default function DialogDemo() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <section>
      <button type="button" className="hl-btn" onClick={() => dialogRef.current?.showModal()}>
        Open dialog
      </button>

      <dialog className="hl-dialog" ref={dialogRef}>
        <form method="dialog">
          <div className="heading">
            <div className="wrapper drag-handle">
              <div className="icon"></div>
              <p className="text">Options</p>
            </div>
            <button className="hl-btn close no-drag"></button>
          </div>
          <div className="content">Dialog content...</div>
          <menu className="footer-btns">
            <button className="hl-btn" value="ok">OK</button>
            <button className="hl-btn" value="cancel">Cancel</button>
            <button className="hl-btn" value="apply">Apply</button>
          </menu>
        </form>
      </dialog>
    </section>
  );
}`,

    vue: `<script setup>
import { ref } from "vue";

const dialogRef = ref(null);
</script>

<template>
  <section>
    <button type="button" class="hl-btn" @click="dialogRef?.showModal()">
      Open dialog
    </button>

    <dialog class="hl-dialog" ref="dialogRef">
      <form method="dialog">
        <div class="heading">
          <div class="wrapper drag-handle">
            <div class="icon"></div>
            <p class="text">Options</p>
          </div>
          <button class="hl-btn close no-drag"></button>
        </div>
        <div class="content">Dialog content...</div>
        <menu class="footer-btns">
          <button class="hl-btn" value="ok">OK</button>
          <button class="hl-btn" value="cancel">Cancel</button>
          <button class="hl-btn" value="apply">Apply</button>
        </menu>
      </form>
    </dialog>
  </section>
</template>`,
  },

  /* ---------------------------------------------------- */
  Modal: {
    html: `<section>
  <button type="button" class="hl-btn" data-hl-modal-open="demo-modal">
    Open modal
  </button>

  <!-- modal overlay + box -->
  <div class="hl-modal-overlay hidden" data-hl-modal-id="demo-modal">
    <div class="hl-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="heading">
        <div class="wrapper drag-handle">
          <div class="icon"></div>
          <p class="text" id="modal-title">Custom Modal</p>
        </div>
        <button class="hl-btn close no-drag" data-hl-modal-close="demo-modal"></button>
      </div>
      <div class="content">
        This is a custom modal (not a native <dialog>). It can be
        moved by dragging the header and closed with the close button,
        by clicking the overlay or with ESC.
      </div>
      <menu class="footer-btns">
        <button class="hl-btn" data-hl-modal-close="demo-modal">OK</button>
        <button class="hl-btn" data-hl-modal-close="demo-modal">Cancel</button>
      </menu>
    </div>
  </div>
</section>

<!-- เปิด/ปิดด้วย JS: HLModal.open("demo-modal") / HLModal.close("demo-modal") -->`,

    react: `// components/HLModal.jsx — modal ที่ผูกกับ state ได้ (data-hl-controlled)
// HL1 จะไม่แตะ class "hidden" เอง แค่ยิง event "hl:modal-close"
// ตอนผู้ใช้กดปิด / คลิก overlay / กด ESC → เราเรียก onClose ไปเปลี่ยน state
import { useEffect, useId, useRef } from "react";

export function HLModal({ open, onClose, title, children, footer }) {
  const id = useId();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const handler = (e) => onClose?.(e.detail.reason);
    el.addEventListener("hl:modal-close", handler);
    return () => el.removeEventListener("hl:modal-close", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={"hl-modal-overlay" + (open ? "" : " hidden")}
      data-hl-modal-id={id}
      data-hl-controlled
    >
      <div className="hl-modal" role="dialog" aria-modal="true" aria-labelledby={id + "-title"}>
        <div className="heading">
          <div className="wrapper drag-handle">
            <div className="icon"></div>
            <p className="text" id={id + "-title"}>{title}</p>
          </div>
          <button className="hl-btn close no-drag" data-hl-modal-close={id}></button>
        </div>
        <div className="content">{children}</div>
        {footer && <menu className="footer-btns">{footer}</menu>}
      </div>
    </div>
  );
}

// ---------- ใช้งาน ----------
import { useState } from "react";

export default function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button type="button" className="hl-btn" onClick={() => setOpen(true)}>
        Open modal
      </button>

      <HLModal
        open={open}
        onClose={() => setOpen(false)}
        title="Custom Modal"
        footer={
          <>
            <button className="hl-btn" onClick={() => setOpen(false)}>OK</button>
            <button className="hl-btn" onClick={() => setOpen(false)}>Cancel</button>
          </>
        }
      >
        Drag the header to move. Close with the button, overlay or ESC.
      </HLModal>
    </section>
  );
}

// แบบไม่ใช้ state ก็ได้: ใช้ markup เหมือนแท็บ HTML (ไม่มี data-hl-controlled)
// แล้วเปิดด้วย data-hl-modal-open="..." หรือ window.HLModal.open("...")`,

    next: `// components/HLModal.tsx — modal ที่ผูกกับ state ได้ (data-hl-controlled)
// HL1 จะไม่แตะ class "hidden" เอง แค่ยิง event "hl:modal-close"
// ตอนผู้ใช้กดปิด / คลิก overlay / กด ESC → เราเรียก onClose ไปเปลี่ยน state
"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose?: (reason: "button" | "overlay" | "escape" | "api") => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

export function HLModal({ open, onClose, title, children, footer }: Props) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: Event) => onClose?.((e as CustomEvent).detail.reason);
    el.addEventListener("hl:modal-close", handler);
    return () => el.removeEventListener("hl:modal-close", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className={"hl-modal-overlay" + (open ? "" : " hidden")}
      data-hl-modal-id={id}
      data-hl-controlled
    >
      <div className="hl-modal" role="dialog" aria-modal="true" aria-labelledby={id + "-title"}>
        <div className="heading">
          <div className="wrapper drag-handle">
            <div className="icon"></div>
            <p className="text" id={id + "-title"}>{title}</p>
          </div>
          <button className="hl-btn close no-drag" data-hl-modal-close={id}></button>
        </div>
        <div className="content">{children}</div>
        {footer && <menu className="footer-btns">{footer}</menu>}
      </div>
    </div>
  );
}

// ---------- ใช้งาน: app/page.tsx ----------
"use client";
import { useState } from "react";
import { HLModal } from "@/components/HLModal";

export default function Page() {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button type="button" className="hl-btn" onClick={() => setOpen(true)}>
        Open modal
      </button>

      <HLModal
        open={open}
        onClose={() => setOpen(false)}
        title="Custom Modal"
        footer={
          <>
            <button className="hl-btn" onClick={() => setOpen(false)}>OK</button>
            <button className="hl-btn" onClick={() => setOpen(false)}>Cancel</button>
          </>
        }
      >
        Drag the header to move. Close with the button, overlay or ESC.
      </HLModal>
    </section>
  );
}`,

    vue: `<!-- components/HLModal.vue — modal ที่ผูกกับ v-model ได้ (data-hl-controlled)
     HL1 จะไม่แตะ class "hidden" เอง แค่ยิง event "hl:modal-close"
     ตอนผู้ใช้กดปิด / คลิก overlay / กด ESC → เราตั้ง open = false -->
<script setup>
import { useId } from "vue"; // Vue 3.5+

const open = defineModel("open", { type: Boolean, default: false });
defineProps({ title: String });
const id = useId();
</script>

<template>
  <div
    :class="['hl-modal-overlay', { hidden: !open }]"
    :data-hl-modal-id="id"
    data-hl-controlled
    @hl:modal-close="open = false"
  >
    <div class="hl-modal" role="dialog" aria-modal="true" :aria-labelledby="id + '-title'">
      <div class="heading">
        <div class="wrapper drag-handle">
          <div class="icon"></div>
          <p class="text" :id="id + '-title'">{{ title }}</p>
        </div>
        <button class="hl-btn close no-drag" :data-hl-modal-close="id"></button>
      </div>
      <div class="content"><slot /></div>
      <menu v-if="$slots.footer" class="footer-btns"><slot name="footer" /></menu>
    </div>
  </div>
</template>

<!-- ---------- ใช้งาน ---------- -->
<script setup>
import { ref } from "vue";
import HLModal from "./components/HLModal.vue";

const open = ref(false);
</script>

<template>
  <section>
    <button type="button" class="hl-btn" @click="open = true">Open modal</button>

    <HLModal v-model:open="open" title="Custom Modal">
      Drag the header to move. Close with the button, overlay or ESC.
      <template #footer>
        <button class="hl-btn" @click="open = false">OK</button>
        <button class="hl-btn" @click="open = false">Cancel</button>
      </template>
    </HLModal>
  </section>
</template>`,
  },

  /* ---------------------------------------------------- */
  ModalTabs: {
    react: `import { Fragment, useId } from "react";

const configs = ["ONE", "TWO", "THREE", "FOUR"];

export default function ModalTabsDemo() {
  const uid = useId();

  return (
    <section>
      <button type="button" className="hl-btn" data-hl-modal-open="my-modal-tabs">
        Open Modal Tabs
      </button>

      <div className="hl-modal-overlay hidden" data-hl-modal-id="my-modal-tabs">
        <div className="hl-modal-tabs">
          <div className="heading" data-hl-modal-header>
            <div className="wrapper">
              <div className="icon"></div>
              <p className="text">Tabs Modal</p>
            </div>
            <button className="hl-btn close" data-hl-modal-close="my-modal-tabs"></button>
          </div>

          <div className="content">
            <div className="hl-tabs-custom">
              <input className="radiotab" name={uid} type="radio" id={uid + "a"} defaultChecked />
              <label className="label" htmlFor={uid + "a"}>Settings</label>
              <div className="panel">
                <h2>Settings</h2>
                <label className="hl-input__label" htmlFor={uid + "first"}>First name</label>
                <input className="hl-input" id={uid + "first"} type="text" />
              </div>

              <input className="radiotab" name={uid} type="radio" id={uid + "b"} />
              <label className="label" htmlFor={uid + "b"}>Config</label>
              <div className="panel">
                <h2>Config</h2>
                {configs.map((c) => (
                  <div className="hl-checkbox" key={c}>
                    <input id={uid + c} type="checkbox" />
                    <label className="hl-checkbox__label" htmlFor={uid + c}>Config {c}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <menu className="footer-btns">
            <button className="hl-btn" data-hl-modal-close="my-modal-tabs">OK</button>
            <button className="hl-btn" data-hl-modal-close="my-modal-tabs">Cancel</button>
          </menu>
        </div>
      </div>
    </section>
  );
}`,

    next: `import { useId } from "react";

const configs = ["ONE", "TWO", "THREE", "FOUR"];

// ไม่มี state/onClick → เป็น Server Component ได้ (HL1.min.js จัดการ modal ให้)
export default function ModalTabsDemo() {
  const uid = useId();

  return (
    <section>
      <button type="button" className="hl-btn" data-hl-modal-open="my-modal-tabs">
        Open Modal Tabs
      </button>

      <div className="hl-modal-overlay hidden" data-hl-modal-id="my-modal-tabs">
        <div className="hl-modal-tabs">
          <div className="heading" data-hl-modal-header>
            <div className="wrapper">
              <div className="icon"></div>
              <p className="text">Tabs Modal</p>
            </div>
            <button className="hl-btn close" data-hl-modal-close="my-modal-tabs"></button>
          </div>

          <div className="content">
            <div className="hl-tabs-custom">
              <input className="radiotab" name={uid} type="radio" id={uid + "a"} defaultChecked />
              <label className="label" htmlFor={uid + "a"}>Settings</label>
              <div className="panel">
                <h2>Settings</h2>
                <label className="hl-input__label" htmlFor={uid + "first"}>First name</label>
                <input className="hl-input" id={uid + "first"} type="text" />
              </div>

              <input className="radiotab" name={uid} type="radio" id={uid + "b"} />
              <label className="label" htmlFor={uid + "b"}>Config</label>
              <div className="panel">
                <h2>Config</h2>
                {configs.map((c) => (
                  <div className="hl-checkbox" key={c}>
                    <input id={uid + c} type="checkbox" />
                    <label className="hl-checkbox__label" htmlFor={uid + c}>Config {c}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <menu className="footer-btns">
            <button className="hl-btn" data-hl-modal-close="my-modal-tabs">OK</button>
            <button className="hl-btn" data-hl-modal-close="my-modal-tabs">Cancel</button>
          </menu>
        </div>
      </div>
    </section>
  );
}`,

    vue: `<script setup>
import { useId } from "vue"; // Vue 3.5+

const configs = ["ONE", "TWO", "THREE", "FOUR"];
const uid = useId();
</script>

<template>
  <section>
    <button type="button" class="hl-btn" data-hl-modal-open="my-modal-tabs">
      Open Modal Tabs
    </button>

    <div class="hl-modal-overlay hidden" data-hl-modal-id="my-modal-tabs">
      <div class="hl-modal-tabs">
        <div class="heading" data-hl-modal-header>
          <div class="wrapper">
            <div class="icon"></div>
            <p class="text">Tabs Modal</p>
          </div>
          <button class="hl-btn close" data-hl-modal-close="my-modal-tabs"></button>
        </div>

        <div class="content">
          <div class="hl-tabs-custom">
            <input class="radiotab" :name="uid" type="radio" :id="uid + 'a'" checked />
            <label class="label" :for="uid + 'a'">Settings</label>
            <div class="panel">
              <h2>Settings</h2>
              <label class="hl-input__label" :for="uid + 'first'">First name</label>
              <input class="hl-input" :id="uid + 'first'" type="text" />
            </div>

            <input class="radiotab" :name="uid" type="radio" :id="uid + 'b'" />
            <label class="label" :for="uid + 'b'">Config</label>
            <div class="panel">
              <h2>Config</h2>
              <div class="hl-checkbox" v-for="c in configs" :key="c">
                <input :id="uid + c" type="checkbox" />
                <label class="hl-checkbox__label" :for="uid + c">Config {{ c }}</label>
              </div>
            </div>
          </div>
        </div>

        <menu class="footer-btns">
          <button class="hl-btn" data-hl-modal-close="my-modal-tabs">OK</button>
          <button class="hl-btn" data-hl-modal-close="my-modal-tabs">Cancel</button>
        </menu>
      </div>
    </div>
  </section>
</template>`,
  },

  /* ---------------------------------------------------- */
  Container: {
    react: `// hl-con-s = เล็ก, hl-con-m = กลาง, hl-con = เต็ม
export default function Layout({ children }) {
  return (
    <>
      <div className="hl-con-s"></div>
      <div className="hl-con-m"></div>
      <div className="hl-con">{children}</div>
    </>
  );
}`,

    next: `// app/layout.tsx หรือ component ใดก็ได้ (Server Component)
export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hl-con-s"></div>
      <div className="hl-con-m"></div>
      <div className="hl-con">{children}</div>
    </>
  );
}`,

    vue: `<template>
  <div class="hl-con-s"></div>
  <div class="hl-con-m"></div>
  <div class="hl-con">
    <slot />
  </div>
</template>`,
  },

  /* ---------------------------------------------------- */
  Textarea: {
    html: `<label class="hl-textarea__label" for="message">Message</label>
<textarea class="hl-textarea" id="message" rows="4" placeholder="Type here..."></textarea>

<label class="hl-textarea__label" for="message-disabled">Disabled</label>
<textarea class="hl-textarea" id="message-disabled" disabled>Read only</textarea>`,

    react: `import { useState } from "react";

export default function TextareaDemo() {
  const [message, setMessage] = useState("");

  return (
    <>
      <label className="hl-textarea__label" htmlFor="message">
        Message ({message.length}/200)
      </label>
      <textarea
        className="hl-textarea"
        id="message"
        rows={4}
        maxLength={200}
        placeholder="Type here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <label className="hl-textarea__label" htmlFor="message-disabled">Disabled</label>
      <textarea className="hl-textarea" id="message-disabled" disabled defaultValue="Read only" />
    </>
  );
}`,

    next: `"use client";
import { useState } from "react";

export default function TextareaDemo() {
  const [message, setMessage] = useState("");

  return (
    <>
      <label className="hl-textarea__label" htmlFor="message">
        Message ({message.length}/200)
      </label>
      <textarea
        className="hl-textarea"
        id="message"
        rows={4}
        maxLength={200}
        placeholder="Type here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <label className="hl-textarea__label" htmlFor="message-disabled">Disabled</label>
      <textarea className="hl-textarea" id="message-disabled" disabled defaultValue="Read only" />
    </>
  );
}`,

    vue: `<script setup>
import { ref } from "vue";

const message = ref("");
</script>

<template>
  <label class="hl-textarea__label" for="message">
    Message ({{ message.length }}/200)
  </label>
  <textarea
    class="hl-textarea"
    id="message"
    rows="4"
    maxlength="200"
    placeholder="Type here..."
    v-model="message"
  ></textarea>

  <label class="hl-textarea__label" for="message-disabled">Disabled</label>
  <textarea class="hl-textarea" id="message-disabled" disabled>Read only</textarea>
</template>`,
  },

  /* ---------------------------------------------------- */
  Box: staticExamples(
    "BoxDemo",
    `<!-- กล่องบุ๋ม (ค่าเริ่มต้น) -->
<div class="hl-box">Sunken box</div>

<!-- กล่องนูน -->
<div class="hl-box raised">Raised box</div>

<!-- เลื่อนได้เมื่อเนื้อหายาว (สูงสุด 200px) -->
<div class="hl-box scroll">
  <p>Line 1</p>
  <p>Line 2</p>
  <p>...</p>
</div>`
  ),

  /* ---------------------------------------------------- */
  Panel: staticExamples(
    "PanelDemo",
    `<div class="hl-panel">
  <div class="heading">
    <p class="text">Server Info</p>
  </div>
  <div class="content">
    <p>Map: crossfire</p>
    <p>Players: 12 / 16</p>
  </div>
  <div class="footer">
    <button class="hl-btn">Connect</button>
    <button class="hl-btn">Refresh</button>
  </div>
</div>`
  ),

  /* ---------------------------------------------------- */
  Card: staticExamples(
    "CardDemo",
    `<div class="hl-grid hl-grid-auto">
  <div class="hl-card">
    <img class="image" src="/your-image.jpg" alt="Black Mesa" />
    <div class="body">
      <p class="title">Black Mesa</p>
      <p class="text">Research facility in New Mexico.</p>
    </div>
    <div class="footer">
      <button class="hl-btn">Open</button>
    </div>
  </div>

  <!-- ไม่มีรูปก็ได้ -->
  <div class="hl-card">
    <div class="body">
      <p class="title">Lambda Core</p>
      <p class="text">Teleportation research lab.</p>
    </div>
  </div>
</div>`
  ),

  /* ---------------------------------------------------- */
  Navbar: {
    html: `<nav class="hl-navbar">
  <a class="brand" href="/">HL1</a>
  <a class="active" href="/">Home</a>
  <a href="/docs">Docs</a>
  <a href="/about">About</a>
  <div class="end">
    <button class="hl-btn">Login</button>
  </div>
</nav>

<!-- ลิงก์ที่เลือกอยู่: ใส่ class="active" หรือ aria-current="page" -->`,

    react: `// ใส่ class "active" ที่ลิงก์ของหน้าปัจจุบัน
// (ถ้าใช้ react-router: <NavLink> ใส่ class "active" ให้เองอยู่แล้ว)
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/docs", label: "Docs" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  return (
    <nav className="hl-navbar">
      <NavLink className="brand" to="/">HL1</NavLink>
      {links.map((l) => (
        <NavLink key={l.to} to={l.to} end>
          {l.label}
        </NavLink>
      ))}
      <div className="end">
        <button className="hl-btn">Login</button>
      </div>
    </nav>
  );
}`,

    next: `// components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="hl-navbar">
      <Link className="brand" href="/">HL1</Link>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={pathname === l.href ? "page" : undefined}
        >
          {l.label}
        </Link>
      ))}
      <div className="end">
        <button className="hl-btn">Login</button>
      </div>
    </nav>
  );
}

// วางใน app/layout.tsx → <Navbar /> จะโชว์ทุกหน้า`,

    vue: `<!-- components/Navbar.vue (ใช้กับ vue-router) -->
<script setup>
const links = [
  { to: "/", label: "Home" },
  { to: "/docs", label: "Docs" },
  { to: "/about", label: "About" },
];
</script>

<template>
  <nav class="hl-navbar">
    <RouterLink class="brand" to="/">HL1</RouterLink>
    <!-- RouterLink ใส่ aria-current="page" ให้ลิงก์ที่ตรงกับหน้าปัจจุบันเอง -->
    <RouterLink v-for="l in links" :key="l.to" :to="l.to">
      {{ l.label }}
    </RouterLink>
    <div class="end">
      <button class="hl-btn">Login</button>
    </div>
  </nav>
</template>`,
  },

  /* ---------------------------------------------------- */
  Menu: {
    html: `<nav class="hl-menu">
  <p class="label">Game</p>
  <a class="active" href="#">New Game</a>
  <a href="#">Load Game</a>
  <a href="#">Options</a>
  <div class="divider"></div>
  <p class="label">Multiplayer</p>
  <a href="#">Find Servers</a>
  <a href="#">Create Server</a>
</nav>`,

    react: `import { useState } from "react";

const groups = [
  { label: "Game", items: ["New Game", "Load Game", "Options"] },
  { label: "Multiplayer", items: ["Find Servers", "Create Server"] },
];

export default function Menu() {
  const [active, setActive] = useState("New Game");

  return (
    <nav className="hl-menu">
      {groups.map((g, i) => (
        <div key={g.label}>
          {i > 0 && <div className="divider"></div>}
          <p className="label">{g.label}</p>
          {g.items.map((item) => (
            <a
              key={item}
              href="#"
              className={active === item ? "active" : undefined}
              onClick={(e) => {
                e.preventDefault();
                setActive(item);
              }}
            >
              {item}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}`,

    next: `// components/Sidebar.tsx — เมนูข้างที่ไฮไลต์ตาม URL
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const groups = [
  { label: "Game", items: [{ href: "/new", label: "New Game" }, { href: "/load", label: "Load Game" }] },
  { label: "Multiplayer", items: [{ href: "/servers", label: "Find Servers" }] },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="hl-menu">
      {groups.map((g, i) => (
        <div key={g.label}>
          {i > 0 && <div className="divider"></div>}
          <p className="label">{g.label}</p>
          {g.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );
}`,

    vue: `<script setup>
import { ref } from "vue";

const groups = [
  { label: "Game", items: ["New Game", "Load Game", "Options"] },
  { label: "Multiplayer", items: ["Find Servers", "Create Server"] },
];
const active = ref("New Game");
</script>

<template>
  <nav class="hl-menu">
    <template v-for="(g, i) in groups" :key="g.label">
      <div v-if="i > 0" class="divider"></div>
      <p class="label">{{ g.label }}</p>
      <a
        v-for="item in g.items"
        :key="item"
        href="#"
        :class="{ active: active === item }"
        @click.prevent="active = item"
      >
        {{ item }}
      </a>
    </template>
  </nav>
</template>

<!-- ใช้กับ vue-router: เปลี่ยน <a> เป็น <RouterLink :to="..."> ได้เลย -->`,
  },

  /* ---------------------------------------------------- */
  Dropdown: {
    html: `<div class="hl-dropdown">
  <button class="hl-btn" data-hl-dropdown>Options</button>
  <div class="menu">
    <button class="item">New Game</button>
    <button class="item">Load Game</button>
    <a class="item" href="#">Settings</a>
    <div class="divider"></div>
    <button class="item" disabled>Quit</button>
  </div>
</div>

<!-- เมนูชิดขวา: class="hl-dropdown right" / เปิดขึ้นด้านบน: class="hl-dropdown up" -->
<!-- HL1.js เปิด/ปิดให้เอง + คลิกข้างนอก / ESC / เลือก item = ปิด + ใช้ลูกศรขึ้นลงได้ -->`,

    react: `// HL1.js เปิด/ปิด menu ให้เอง → ใส่แค่ onClick ที่ item
// สำคัญ: className ของ .hl-dropdown ให้เป็นค่าคงที่ (HL1 จะเติม class "open" เอง)
export default function GameMenu() {
  return (
    <div className="hl-dropdown">
      <button className="hl-btn" data-hl-dropdown>Options</button>
      <div className="menu">
        <button className="item" onClick={() => console.log("new")}>New Game</button>
        <button className="item" onClick={() => console.log("load")}>Load Game</button>
        <a className="item" href="/settings">Settings</a>
        <div className="divider"></div>
        <button className="item" disabled>Quit</button>
      </div>
    </div>
  );
}

// ปิดด้วยโค้ด: window.HLDropdown.close()`,

    next: `"use client"; // ต้องมีเพราะใช้ onClick
import Link from "next/link";
import { useRouter } from "next/navigation";

// HL1.js เปิด/ปิด menu ให้เอง → ใส่แค่ onClick ที่ item
// สำคัญ: className ของ .hl-dropdown ให้เป็นค่าคงที่ (HL1 จะเติม class "open" เอง)
export default function GameMenu() {
  const router = useRouter();

  return (
    <div className="hl-dropdown">
      <button className="hl-btn" data-hl-dropdown>Options</button>
      <div className="menu">
        <button className="item" onClick={() => router.push("/new")}>New Game</button>
        <button className="item" onClick={() => router.push("/load")}>Load Game</button>
        <Link className="item" href="/settings">Settings</Link>
        <div className="divider"></div>
        <button className="item" disabled>Quit</button>
      </div>
    </div>
  );
}`,

    vue: `<script setup>
// HL1.js เปิด/ปิด menu ให้เอง → ใส่แค่ @click ที่ item
// สำคัญ: class ของ .hl-dropdown ให้เป็นค่าคงที่ (HL1 จะเติม class "open" เอง)
const select = (action) => console.log(action);
</script>

<template>
  <div class="hl-dropdown">
    <button class="hl-btn" data-hl-dropdown>Options</button>
    <div class="menu">
      <button class="item" @click="select('new')">New Game</button>
      <button class="item" @click="select('load')">Load Game</button>
      <RouterLink class="item" to="/settings">Settings</RouterLink>
      <div class="divider"></div>
      <button class="item" disabled>Quit</button>
    </div>
  </div>
</template>`,
  },

  /* ---------------------------------------------------- */
  Message: {
    html: `<div class="hl-message">
  <div class="body">Default message.</div>
</div>

<div class="hl-message success">
  <div class="body">
    <p class="title">Success</p>
    <p>Game saved.</p>
  </div>
  <!-- data-hl-dismiss = กดแล้วซ่อนกล่องนี้ -->
  <button class="hl-btn close" data-hl-dismiss aria-label="Close"></button>
</div>

<div class="hl-message warning">
  <div class="body">Low health.</div>
</div>

<div class="hl-message danger">
  <div class="body">Connection lost.</div>
</div>`,

    react: `import { useState } from "react";

// ใน React ให้ซ่อนด้วย state (ไม่ต้องใช้ data-hl-dismiss)
export default function SaveMessage() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="hl-message success">
      <div className="body">
        <p className="title">Success</p>
        <p>Game saved.</p>
      </div>
      <button className="hl-btn close" aria-label="Close" onClick={() => setVisible(false)}></button>
    </div>
  );
}

// type: "" | "success" | "warning" | "danger"
export function Message({ type = "", title, children }) {
  return (
    <div className={"hl-message " + type}>
      <div className="body">
        {title && <p className="title">{title}</p>}
        <p>{children}</p>
      </div>
    </div>
  );
}

// <Message type="danger" title="Error">Connection lost.</Message>`,

    next: `// components/Message.tsx — ไม่มี state → Server Component ได้
import type { ReactNode } from "react";

type Props = {
  type?: "" | "success" | "warning" | "danger";
  title?: string;
  children: ReactNode;
};

export function Message({ type = "", title, children }: Props) {
  return (
    <div className={"hl-message " + type}>
      <div className="body">
        {title && <p className="title">{title}</p>}
        <p>{children}</p>
      </div>
    </div>
  );
}

// ---------- แบบกดปิดได้ (ต้อง "use client") ----------
"use client";
import { useState } from "react";

export function DismissibleMessage(props: Props) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className={"hl-message " + (props.type ?? "")}>
      <div className="body">
        {props.title && <p className="title">{props.title}</p>}
        <p>{props.children}</p>
      </div>
      <button className="hl-btn close" aria-label="Close" onClick={() => setVisible(false)}></button>
    </div>
  );
}`,

    vue: `<!-- components/Message.vue -->
<script setup>
import { ref } from "vue";

// type: "" | "success" | "warning" | "danger"
defineProps({
  type: { type: String, default: "" },
  title: String,
  dismissible: Boolean,
});
const visible = ref(true);
</script>

<template>
  <div v-if="visible" :class="['hl-message', type]">
    <div class="body">
      <p v-if="title" class="title">{{ title }}</p>
      <p><slot /></p>
    </div>
    <button v-if="dismissible" class="hl-btn close" aria-label="Close" @click="visible = false"></button>
  </div>
</template>

<!-- <Message type="success" title="Success" dismissible>Game saved.</Message> -->`,
  },

  /* ---------------------------------------------------- */
  Notification: {
    html: `<!-- แบบไม่เขียน JS: ใส่ data-hl-notify ที่ปุ่ม -->
<button class="hl-btn" data-hl-notify="Game saved." data-hl-notify-type="success" data-hl-notify-title="Success">
  Save
</button>
<button class="hl-btn" data-hl-notify="Connection lost." data-hl-notify-type="danger">
  Error
</button>

<!-- แบบเรียกด้วย JS -->
<script>
  HLNotify.show("Game saved.", {
    type: "success",   // "" | "success" | "warning" | "danger"
    title: "Success",  // ไม่ใส่ก็ได้
    timeout: 4000,     // ms, 0 = ไม่ปิดเอง
  });
</script>`,

    react: `// popup อยู่นอก React tree → เรียก window.HLNotify.show() จากที่ไหนก็ได้
export default function SaveButton() {
  const save = async () => {
    try {
      // await api.save();
      window.HLNotify?.show("Game saved.", { type: "success", title: "Success" });
    } catch {
      window.HLNotify?.show("Save failed.", { type: "danger", timeout: 0 });
    }
  };

  return <button className="hl-btn" onClick={save}>Save</button>;
}

// ปิดด้วยโค้ด: const n = HLNotify.show("Loading..."); n.close();`,

    next: `"use client";

// popup อยู่นอก React tree → เรียก window.HLNotify.show() จากที่ไหนก็ได้
// (type ของ window.HLNotify ดูได้ที่หัวข้อ Installation → Next.js)
export default function SaveButton() {
  const save = async () => {
    try {
      // await fetch("/api/save", { method: "POST" });
      window.HLNotify?.show("Game saved.", { type: "success", title: "Success" });
    } catch {
      window.HLNotify?.show("Save failed.", { type: "danger", timeout: 0 });
    }
  };

  return <button className="hl-btn" onClick={save}>Save</button>;
}`,

    vue: `<script setup>
// popup อยู่นอก Vue app → เรียก window.HLNotify.show() จากที่ไหนก็ได้
async function save() {
  try {
    // await api.save();
    window.HLNotify?.show("Game saved.", { type: "success", title: "Success" });
  } catch {
    window.HLNotify?.show("Save failed.", { type: "danger", timeout: 0 });
  }
}
</script>

<template>
  <button class="hl-btn" @click="save">Save</button>
</template>`,
  },

  /* ---------------------------------------------------- */
  Grid: staticExamples(
    "GridDemo",
    `<!-- 3 คอลัมน์เท่ากัน (จอ < 600px เหลือ 1 คอลัมน์) -->
<div class="hl-grid hl-grid-3">
  <div class="hl-box">1</div>
  <div class="hl-box">2</div>
  <div class="hl-box">3</div>
  <div class="hl-box hl-span-2">span 2</div>
  <div class="hl-box">5</div>
  <div class="hl-box hl-span-full">full width</div>
</div>

<!-- จำนวนคอลัมน์อัตโนมัติ ตามความกว้าง (ช่องละอย่างน้อย 200px) -->
<div class="hl-grid hl-grid-auto">
  <div class="hl-box">A</div>
  <div class="hl-box">B</div>
  <div class="hl-box">C</div>
</div>`
  ),

  /* ---------------------------------------------------- */
  Columns: staticExamples(
    "ColumnsDemo",
    `<!-- แบ่งเท่ากัน -->
<div class="hl-cols">
  <div class="hl-col hl-box">col</div>
  <div class="hl-col hl-box">col</div>
  <div class="hl-col hl-box">col</div>
</div>

<!-- กำหนดความกว้าง + ที่เหลือใช้ hl-col -->
<div class="hl-cols">
  <div class="hl-col-25 hl-box">25%</div>
  <div class="hl-col hl-box">auto</div>
</div>`
  ),

  /* ---------------------------------------------------- */
  Flexbox: staticExamples(
    "FlexboxDemo",
    `<!-- แถวแนวนอน จัดกลางแนวตั้ง ระยะห่าง 8px -->
<div class="hl-flex hl-items-center hl-gap-2">
  <button class="hl-btn">One</button>
  <button class="hl-btn">Two</button>
  <button class="hl-btn">Three</button>
</div>

<!-- ชิดซ้าย-ขวา -->
<div class="hl-flex hl-justify-between hl-items-center">
  <p>Title</p>
  <button class="hl-btn">Action</button>
</div>

<!-- แนวตั้ง + ช่องที่ยืดเต็ม -->
<div class="hl-flex hl-flex-col hl-gap-1">
  <div class="hl-box">top</div>
  <div class="hl-box hl-flex-1">grow</div>
</div>`
  ),

  /* ---------------------------------------------------- */
  HorizontalRule: {
    react: `export default function Divider() {
  return <hr className="hl-hr" />;
}`,

    next: `export default function Divider() {
  return <hr className="hl-hr" />;
}`,

    vue: `<template>
  <hr class="hl-hr" />
</template>`,
  },

  /* ---------------------------------------------------- */
  Tabs: {
    react: `import { Fragment, useId } from "react";

const tabs = [
  { title: "Tab One", content: "Tab content..." },
  { title: "Tab Two", content: "Tab content..." },
  { title: "Tab Three", content: "Tab content..." },
];

export default function TabsDemo() {
  const uid = useId(); // name/id ไม่ชนกันเมื่อมีหลาย Tabs ในหน้าเดียว

  return (
    <div className="hl-tabs">
      {tabs.map((tab, i) => (
        <Fragment key={tab.title}>
          <input
            className="radiotab"
            name={uid}
            tabIndex={1}
            type="radio"
            id={uid + i}
            defaultChecked={i === 0}
          />
          <label className="label" htmlFor={uid + i}>{tab.title}</label>
          <div className="panel" tabIndex={1}>
            <h2>{tab.title} Content</h2>
            <p>{tab.content}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}`,

    next: `import { Fragment, useId } from "react";

const tabs = [
  { title: "Tab One", content: "Tab content..." },
  { title: "Tab Two", content: "Tab content..." },
  { title: "Tab Three", content: "Tab content..." },
];

// ใช้ CSS ล้วน (radio) → เป็น Server Component ได้
export default function TabsDemo() {
  const uid = useId();

  return (
    <div className="hl-tabs">
      {tabs.map((tab, i) => (
        <Fragment key={tab.title}>
          <input
            className="radiotab"
            name={uid}
            tabIndex={1}
            type="radio"
            id={uid + i}
            defaultChecked={i === 0}
          />
          <label className="label" htmlFor={uid + i}>{tab.title}</label>
          <div className="panel" tabIndex={1}>
            <h2>{tab.title} Content</h2>
            <p>{tab.content}</p>
          </div>
        </Fragment>
      ))}
    </div>
  );
}`,

    vue: `<script setup>
import { useId } from "vue"; // Vue 3.5+

const tabs = [
  { title: "Tab One", content: "Tab content..." },
  { title: "Tab Two", content: "Tab content..." },
  { title: "Tab Three", content: "Tab content..." },
];
const uid = useId();
</script>

<template>
  <div class="hl-tabs">
    <template v-for="(tab, i) in tabs" :key="tab.title">
      <input
        class="radiotab"
        :name="uid"
        tabindex="1"
        type="radio"
        :id="uid + i"
        :checked="i === 0"
      />
      <label class="label" :for="uid + i">{{ tab.title }}</label>
      <div class="panel" tabindex="1">
        <h2>{{ tab.title }} Content</h2>
        <p>{{ tab.content }}</p>
      </div>
    </template>
  </div>
</template>`,
  },
};

/* -------------------------------------------------------
   Render tabs
------------------------------------------------------- */

const STORAGE_KEY = "hl1-doc-framework";

function getSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "html";
  } catch {
    return "html";
  }
}

function selectFramework(key) {
  document.querySelectorAll(".fw-tabs").forEach((bar) => {
    bar.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.fw === key);
    });
    bar.parentElement.querySelectorAll("pre[data-fw]").forEach((pre) => {
      pre.hidden = pre.dataset.fw !== key;
    });
  });
  try {
    localStorage.setItem(STORAGE_KEY, key);
  } catch {
    // ignore
  }
}

document.querySelectorAll(".code-block").forEach((block) => {
  const section = block.closest("[id]");
  const examples = section && EXAMPLES[section.id];
  const inner = block.querySelector(".inner");
  const htmlPre = inner?.querySelector("pre");
  if (!examples || !htmlPre) return;

  // HTML tab ใช้ <pre> เดิมในหน้า เว้นแต่มีกำหนดไว้ใน EXAMPLES
  htmlPre.dataset.fw = "html";
  if (examples.html) htmlPre.querySelector("code").textContent = examples.html;

  const bar = document.createElement("div");
  bar.className = "fw-tabs";

  FRAMEWORKS.forEach(({ key, label }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hl-btn";
    btn.dataset.fw = key;
    btn.textContent = label;
    btn.addEventListener("click", () => selectFramework(key));
    bar.appendChild(btn);

    if (key === "html") return;
    const pre = document.createElement("pre");
    const code = document.createElement("code");
    pre.dataset.fw = key;
    code.textContent = examples[key] || "";
    pre.appendChild(code);
    inner.appendChild(pre);
  });

  inner.insertBefore(bar, htmlPre);
});

selectFramework(getSaved());

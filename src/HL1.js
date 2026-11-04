(function () {
  "use strict";

  /* -------------------------------------------------------
     Guards
     - SSR (Next.js / Nuxt): ไม่มี window/document → ไม่ทำอะไร
     - โหลดซ้ำ (HMR, StrictMode, script ซ้ำ): init แค่ครั้งเดียว
  ------------------------------------------------------- */
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.__HL1_LOADED__) return;
  window.__HL1_LOADED__ = true;

  // ทุก event ใช้ delegation ที่ document → ใช้ได้กับ element ที่ React/Vue render ทีหลัง

  /* -------------------------------------------------------
     Code Block: Show/Hide code + Copy to Clipboard
  ------------------------------------------------------- */
  document.addEventListener("click", async function (e) {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const toggle = target.closest(".code-block .toggle-vision");
    if (toggle) {
      const block = toggle.closest(".code-block")?.querySelector(".inner");
      if (!block) return;
      block.classList.toggle("hidden");
      toggle.textContent = block.classList.contains("hidden")
        ? "Show code"
        : "Hide code";
      return;
    }

    const copy = target.closest(".code-block .inner > .hl-btn");
    if (copy) {
      const inner = copy.closest(".inner");
      const codeEl =
        inner?.querySelector("pre:not([hidden]) code") ||
        inner?.querySelector("code");
      if (!codeEl) return;
      try {
        await navigator.clipboard.writeText(codeEl.textContent.trim());
        copy.textContent = "Copied!";
        clearTimeout(copy._hlTimeout);
        copy._hlTimeout = setTimeout(() => (copy.textContent = "Copy"), 2000);
      } catch (err) {
        console.error("Clipboard copy failed:", err);
      }
    }
  });

  /* -------------------------------------------------------
     Modal System - Event Delegation

     2 โหมด:
     - ปกติ: HL1 เพิ่ม/ลบ class "hidden" ที่ overlay ให้เอง
     - controlled (overlay มี data-hl-controlled): HL1 ไม่แตะ class เลย
       แค่ยิง event "hl:modal-open" / "hl:modal-close" ให้ React/Vue ไปเปลี่ยน state เอง
  ------------------------------------------------------- */

  // Event delegation - จับ clicks ที่ document level
  document.addEventListener("click", function (e) {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    // เปิด Modal (closest → รองรับ <button><span>..</span></button>)
    const opener = target.closest("[data-hl-modal-open]");
    if (opener) {
      e.preventDefault();
      openModal(opener.getAttribute("data-hl-modal-open"));
      return;
    }

    // ปิด Modal - ปุ่ม close
    const closer = target.closest("[data-hl-modal-close]");
    if (closer) {
      e.preventDefault();
      closeModal(closer.getAttribute("data-hl-modal-close"), "button");
      return;
    }

    // ปิด Modal - คลิก overlay
    if (target.classList.contains("hl-modal-overlay")) {
      const modalId = target.getAttribute("data-hl-modal-id");
      if (modalId) {
        closeModal(modalId, "overlay");
      }
    }
  });

  // ESC key
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;

    // Dropdown ปิดก่อน (dropdown ใน modal → ไม่ปิด modal ไปด้วย)
    const openDropdown = document.querySelector(".hl-dropdown.open");
    if (openDropdown) {
      closeDropdowns();
      openDropdown.querySelector("[data-hl-dropdown]")?.focus();
      return;
    }

    // Close any open .hl-modal-overlay
    const openModals = document.querySelectorAll(
      ".hl-modal-overlay:not(.hidden)"
    );
    openModals.forEach((overlay) => {
      const modalId = overlay.getAttribute("data-hl-modal-id");
      if (modalId) closeModal(modalId, "escape");
    });

    // Close any open <dialog.hl-dialog>
    document.querySelectorAll("dialog.hl-dialog").forEach((d) => {
      try {
        if (typeof d.open === "boolean" ? d.open : d.hasAttribute("open")) {
          d.close?.();
        }
      } catch {
        // ignore
      }
    });
  });

  /* -------------------------------------------------------
     Modal Functions
  ------------------------------------------------------- */

  function getOverlay(modalId) {
    return document.querySelector(
      `[data-hl-modal-id="${CSS.escape(String(modalId))}"]`
    );
  }

  function isControlled(overlay) {
    return overlay.hasAttribute("data-hl-controlled");
  }

  function emit(overlay, name, detail) {
    overlay.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }));
  }

  function openModal(modalId) {
    const overlay = getOverlay(modalId);
    if (!overlay) {
      console.warn(`Modal "${modalId}" not found`);
      return;
    }

    // controlled: แค่แจ้ง ให้ framework เปิดเอง
    if (!isControlled(overlay)) overlay.classList.remove("hidden");

    emit(overlay, "hl:modal-open", { id: modalId });
  }

  function closeModal(modalId, reason = "api") {
    const overlay = getOverlay(modalId);
    if (!overlay || overlay.classList.contains("hidden")) return;

    // controlled: แค่แจ้ง ให้ framework ปิดเอง
    if (!isControlled(overlay)) overlay.classList.add("hidden");

    emit(overlay, "hl:modal-close", { id: modalId, reason });
  }

  /* -------------------------------------------------------
     จัดกลาง + focus ทุกครั้งที่ overlay โผล่ขึ้นมา
     ไม่ว่าจะเปิดด้วย HL1, เปลี่ยน class ด้วย state หรือ render แบบมีเงื่อนไข
  ------------------------------------------------------- */

  function syncOverlay(overlay) {
    const visible = !overlay.classList.contains("hidden");
    if (visible === !!overlay._hlVisible) return;
    overlay._hlVisible = visible;
    if (!visible) return;

    const modal = overlay.querySelector(".hl-modal, .hl-modal-tabs");
    if (!modal) return;

    // Reset position
    modal.style.left = "50%";
    modal.style.top = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.position = "fixed";

    // Focus trap
    modal.setAttribute("tabindex", "-1");
    modal.focus();
  }

  function syncWithin(node) {
    if (!(node instanceof Element)) return;
    if (node.matches(".hl-modal-overlay")) syncOverlay(node);
    node.querySelectorAll(".hl-modal-overlay").forEach(syncOverlay);
  }

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === "childList") m.addedNodes.forEach(syncWithin);
      else if (m.target.matches(".hl-modal-overlay")) syncOverlay(m.target);
    }
  }).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ["class"],
  });

  syncWithin(document.documentElement);

  /* -------------------------------------------------------
     Draggable - Event Delegation
     ลากได้ทุก modal ที่อยู่ใน DOM ไม่ต้อง setup ทีละตัว
  ------------------------------------------------------- */

  const handleSelector =
    ".hl-modal > .heading, .hl-modal-tabs > .heading, [data-hl-modal-header]";
  const interactiveSelector =
    'button, a, input, textarea, select, [role="button"], .no-drag, [data-hl-modal-close]';

  document.addEventListener("pointerdown", function (ev) {
    if (ev.button !== 0) return;
    const target = ev.target instanceof Element ? ev.target : null;
    if (!target || target.closest(interactiveSelector)) return;

    const handle = target.closest(handleSelector);
    const el = handle?.closest(".hl-modal, .hl-modal-tabs");
    if (!el) return;

    ev.preventDefault();

    const rect = el.getBoundingClientRect();
    const offsetX = ev.clientX - rect.left;
    const offsetY = ev.clientY - rect.top;

    el.style.position = "fixed";
    el.style.margin = "0";

    function onMove(e) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const dRect = el.getBoundingClientRect();
      const left = Math.min(
        Math.max(e.clientX - offsetX, 0),
        vw - dRect.width
      );
      const top = Math.min(
        Math.max(e.clientY - offsetY, 0),
        vh - dRect.height
      );

      el.style.left = left + "px";
      el.style.top = top + "px";
      el.style.transform = "";
    }

    function onUp() {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  });

  /* -------------------------------------------------------
     Dropdown - Event Delegation
     <div class="hl-dropdown">
       <button data-hl-dropdown>..</button>
       <div class="menu"><button class="item">..</button></div>
     </div>
  ------------------------------------------------------- */

  function closeDropdowns(except) {
    document.querySelectorAll(".hl-dropdown.open").forEach((dd) => {
      if (dd === except) return;
      dd.classList.remove("open");
      dd.querySelector("[data-hl-dropdown]")?.setAttribute("aria-expanded", "false");
    });
  }

  function toggleDropdown(dd, force) {
    const open = force ?? !dd.classList.contains("open");
    closeDropdowns(dd);
    dd.classList.toggle("open", open);
    dd.querySelector("[data-hl-dropdown]")?.setAttribute("aria-expanded", String(open));
  }

  document.addEventListener("click", function (e) {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;

    const trigger = target.closest("[data-hl-dropdown]");
    const dd = trigger?.closest(".hl-dropdown");
    if (dd) {
      e.preventDefault();
      toggleDropdown(dd);
      return;
    }

    // เลือก item หรือคลิกข้างนอก → ปิด
    if (target.closest(".hl-dropdown .item") || !target.closest(".hl-dropdown")) {
      closeDropdowns();
    }
  });

  // ลูกศรขึ้น/ลง: เปิด menu + เลื่อน focus ระหว่าง item
  document.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const dd = e.target instanceof Element ? e.target.closest(".hl-dropdown") : null;
    if (!dd) return;

    const items = [
      ...dd.querySelectorAll(".menu .item:not(:disabled):not(.disabled)"),
    ];
    if (!items.length) return;
    e.preventDefault();
    toggleDropdown(dd, true);

    const i = items.indexOf(document.activeElement);
    const last = items.length - 1;
    const next =
      e.key === "ArrowDown"
        ? items[i < 0 || i === last ? 0 : i + 1]
        : items[i <= 0 ? last : i - 1];
    next.focus();
  });

  /* -------------------------------------------------------
     Message: ปุ่ม data-hl-dismiss → ซ่อน .hl-message ที่ครอบอยู่
     (ใช้ attribute hidden ไม่ลบ element → ไม่ชนกับ React/Vue)
  ------------------------------------------------------- */

  document.addEventListener("click", function (e) {
    const target = e.target instanceof Element ? e.target : null;
    const btn = target?.closest("[data-hl-dismiss]");
    const box = btn?.closest(".hl-message");
    if (!box) return;

    // popup ที่ HL1 สร้างเอง → ลบทิ้งได้
    if (box.classList.contains("hl-notify")) box.remove();
    else box.hidden = true;
  });

  /* -------------------------------------------------------
     Notification: HLNotify.show("Saved!", { type, title, timeout })
     หรือ <button data-hl-notify="Saved!" data-hl-notify-type="success">
  ------------------------------------------------------- */

  function getNotifyStack() {
    let stack = document.querySelector(".hl-notify-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "hl-notify-stack";
      stack.setAttribute("aria-live", "polite");
      document.body.appendChild(stack);
    }
    return stack;
  }

  function notify(message, { type = "", title = "", timeout = 4000 } = {}) {
    const el = document.createElement("div");
    el.className = "hl-message hl-notify" + (type ? " " + type : "");
    el.setAttribute("role", type === "danger" ? "alert" : "status");

    // textContent → ข้อความจากผู้ใช้ไม่ถูกตีความเป็น HTML
    const body = document.createElement("div");
    body.className = "body";
    if (title) {
      const titleEl = document.createElement("p");
      titleEl.className = "title";
      titleEl.textContent = title;
      body.appendChild(titleEl);
    }
    const text = document.createElement("p");
    text.textContent = message;
    body.appendChild(text);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "hl-btn close";
    close.setAttribute("aria-label", "Close");
    close.setAttribute("data-hl-dismiss", "");

    el.append(body, close);
    getNotifyStack().appendChild(el);

    // timeout: 0 = ไม่ปิดเอง / เอาเมาส์ชี้ = หยุดนับ
    let timer;
    const remove = () => {
      clearTimeout(timer);
      el.remove();
    };
    const start = () => {
      if (timeout > 0) timer = setTimeout(remove, timeout);
    };
    el.addEventListener("mouseenter", () => clearTimeout(timer));
    el.addEventListener("mouseleave", start);
    start();

    return { close: remove };
  }

  document.addEventListener("click", function (e) {
    const target = e.target instanceof Element ? e.target : null;
    const btn = target?.closest("[data-hl-notify]");
    if (!btn) return;
    notify(btn.getAttribute("data-hl-notify"), {
      type: btn.getAttribute("data-hl-notify-type") || "",
      title: btn.getAttribute("data-hl-notify-title") || "",
    });
  });

  /* -------------------------------------------------------
     Public API
  ------------------------------------------------------- */

  window.HLModal = {
    open: openModal,
    close: closeModal,
  };

  window.HLDropdown = {
    close: () => closeDropdowns(),
  };

  window.HLNotify = {
    show: notify,
  };

  console.log("HL1 CDN loaded ✓");
})();

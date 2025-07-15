"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const DevtoolsButton = core.component$(({ state }) => {
  const position = core.useSignal({
    x: 16,
    y: 16
  });
  const isDragging = core.useSignal(false);
  const elementRef = core.useSignal();
  const startMousePos = core.useSignal({
    x: 0,
    y: 0
  });
  const startElementPos = core.useSignal({
    x: 0,
    y: 0
  });
  const isMoved = core.useSignal(false);
  const handleMouseMove = core.$((event) => {
    if (!isDragging.value) return;
    const deltaX = event.clientX - startMousePos.value.x;
    const deltaY = event.clientY - startMousePos.value.y;
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      isMoved.value = true;
    }
    let newX = startElementPos.value.x - deltaX;
    let newY = startElementPos.value.y - deltaY;
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);
    position.value = {
      x: newX,
      y: newY
    };
  });
  const handleMouseUp = core.$(() => {
    if (isDragging.value) {
      isDragging.value = false;
    }
    if (!isMoved.value) {
      state.isOpen.value = !state.isOpen.value;
    }
  });
  const handleMouseDown = core.$((event) => {
    if (event.button !== 0) return;
    if (!elementRef.value) return;
    event.preventDefault();
    startMousePos.value = {
      x: event.clientX,
      y: event.clientY
    };
    const computedStyle = window.getComputedStyle(elementRef.value);
    const currentRight = parseFloat(computedStyle.right) || 0;
    const currentBottom = parseFloat(computedStyle.bottom) || 0;
    startElementPos.value = {
      x: currentRight,
      y: currentBottom
    };
    position.value = {
      x: currentRight,
      y: currentBottom
    };
    isDragging.value = true;
    isMoved.value = false;
  });
  core.useTask$(({ track, cleanup }) => {
    track(() => isDragging.value);
    if (isDragging.value && typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      cleanup(() => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      });
    }
  });
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    ref: elementRef,
    class: {
      "fixed flex h-9 w-9 origin-center select-none items-center justify-center rounded-lg border border-border bg-background backdrop-blur-md": true,
      "border-accent/50 bg-background/95 shadow-accent/35 rotate-90 shadow-lg": state.isOpen.value && !isDragging.value,
      "cursor-grab": !isDragging.value,
      "cursor-grabbing": isDragging.value,
      "transition-all duration-300 ease-in-out": !isDragging.value
    },
    style: {
      bottom: `${position.value.y}px`,
      right: `${position.value.x}px`,
      userSelect: isDragging.value ? "none" : void 0,
      transition: isDragging.value ? "none" : void 0
    },
    onMouseDown$: handleMouseDown,
    children: /* @__PURE__ */ jsxRuntime.jsx("img", {
      width: 20,
      height: 20,
      src: "https://qwik.dev/logos/qwik-logo.svg",
      alt: "Qwik Logo",
      draggable: false,
      class: "pointer-events-none h-5 w-5 opacity-90 drop-shadow-md"
    })
  });
});
exports.DevtoolsButton = DevtoolsButton;

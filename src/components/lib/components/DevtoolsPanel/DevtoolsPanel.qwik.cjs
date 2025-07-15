"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const DevtoolsPanel = core.component$(({ state }) => {
  const panelRef = core.useSignal();
  core.useTask$(({ cleanup }) => {
    const handleKeyPress = (e) => {
      if (e.key === "`" && e.metaKey) {
        state.isOpen.value = !state.isOpen.value;
      }
      if (e.key === "Escape" && state.isOpen.value) {
        state.isOpen.value = false;
      }
    };
    const handleClickOutside = (e) => {
      if (state.isOpen.value && panelRef.value && !panelRef.value.parentElement?.contains(e.target)) {
        state.isOpen.value = !state.isOpen.value;
      }
    };
    if (!core.isBrowser) return;
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", handleClickOutside);
    cleanup(() => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", handleClickOutside);
    });
  });
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    ref: panelRef,
    class: "fixed bottom-6 right-6 flex h-[calc(100vh-3rem)] w-[calc(100vw-3rem)] translate-y-0 transform overflow-hidden rounded-lg border-2 border-border bg-background text-foreground backdrop-blur-lg transition-transform duration-300 ease-in-out",
    children: /* @__PURE__ */ jsxRuntime.jsx(core.Slot, {})
  });
});
exports.DevtoolsPanel = DevtoolsPanel;

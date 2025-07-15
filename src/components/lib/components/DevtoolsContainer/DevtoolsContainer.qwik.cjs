"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const DevtoolsContainer = core.component$(() => {
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    class: "fixed bottom-0 right-0 z-[9999] font-sans",
    "q:slot": "content",
    children: /* @__PURE__ */ jsxRuntime.jsx(core.Slot, {})
  });
});
exports.DevtoolsContainer = DevtoolsContainer;

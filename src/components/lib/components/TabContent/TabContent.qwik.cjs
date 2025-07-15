"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const TabContent = core.component$(() => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", {
    class: "flex h-full w-full flex-col space-y-6",
    children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", {
        class: "flex items-center justify-between border-b border-border pb-4",
        children: /* @__PURE__ */ jsxRuntime.jsx(core.Slot, {
          name: "title"
        })
      }),
      /* @__PURE__ */ jsxRuntime.jsx(core.Slot, {
        name: "content"
      })
    ]
  });
});
exports.TabContent = TabContent;

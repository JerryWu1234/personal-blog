"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const TabTitle = core.component$(({ title }) => {
  return /* @__PURE__ */ jsxRuntime.jsx("h3", {
    class: "text-xl font-semibold",
    children: title
  });
});
exports.TabTitle = TabTitle;

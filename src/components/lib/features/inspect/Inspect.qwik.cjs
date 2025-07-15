"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const constant = require("./constant.qwik.cjs");
const Inspect = core.component$(() => {
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    class: "flex-1 overflow-hidden",
    children: /* @__PURE__ */ jsxRuntime.jsx("iframe", {
      src: `${location.href}${constant.inspectorLink}`,
      width: "100%",
      height: "100%",
      id: "inspect_qwik"
    })
  });
});
exports.Inspect = Inspect;

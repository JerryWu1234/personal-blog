"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
require("@qwik.dev/core");
const internal = require("@qwik.dev/core/internal");
function htmlContainer() {
  if (internal.isServer) return;
  const htmlElement = document.documentElement;
  return internal._getDomContainer(htmlElement);
}
exports.htmlContainer = htmlContainer;

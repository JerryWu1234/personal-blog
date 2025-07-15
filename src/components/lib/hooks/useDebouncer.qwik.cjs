"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const core = require("@qwik.dev/core");
const useDebouncer = (fn, delay) => {
  const timeoutId = core.useSignal();
  return core.$((...args) => {
    window.clearTimeout(timeoutId.value);
    timeoutId.value = window.setTimeout(() => {
      fn(...args);
    }, delay);
  });
};
exports.useDebouncer = useDebouncer;

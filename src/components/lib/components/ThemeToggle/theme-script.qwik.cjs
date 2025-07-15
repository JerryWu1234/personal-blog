"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const themeScript = require("../router-head/theme-script.qwik.cjs");
const ThemeScript = () => {
  const themeScript$1 = `
        try {
          const getItem = localStorage.getItem('${themeScript.themeStorageKey}')
          if(getItem === 'light' || getItem === 'dark'){
              document.firstElementChild.setAttribute('data-theme', getItem);
          }
        } catch (err) { }`;
  return /* @__PURE__ */ jsxRuntime.jsx("script", {
    dangerouslySetInnerHTML: themeScript$1
  });
};
exports.ThemeScript = ThemeScript;

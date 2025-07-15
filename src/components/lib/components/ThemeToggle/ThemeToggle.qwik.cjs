"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const themeScript = require("../router-head/theme-script.qwik.cjs");
const hi_qwik = require("../../node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/hi.qwik.qwik.cjs");
const bs_qwik = require("../../node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/bs.qwik.qwik.cjs");
const themToggle = require("./themToggle.css.qwik.cjs");
const getTheme = () => {
  if (core.isServer) {
    return "auto";
  }
  let theme;
  try {
    theme = localStorage.getItem(themeScript.themeStorageKey);
  } catch {
  }
  return theme || "auto";
};
const setTheme = (theme) => {
  if (theme === "auto") {
    document.firstElementChild?.removeAttribute("data-theme");
  } else {
    document.firstElementChild?.setAttribute("data-theme", theme);
  }
  localStorage.setItem(themeScript.themeStorageKey, theme);
};
const ThemeToggle = core.component$(() => {
  core.useStyles$(themToggle);
  const onClick$ = core.event$(() => {
    let currentTheme = getTheme();
    if (currentTheme === "dark") {
      currentTheme = "light";
    } else if (currentTheme === "light") {
      currentTheme = "auto";
    } else {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";
    }
    setTheme(currentTheme);
  });
  return /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, {
    children: /* @__PURE__ */ jsxRuntime.jsx("button", {
      onClick$,
      class: "group relative flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:opacity-60",
      children: /* @__PURE__ */ jsxRuntime.jsxs("div", {
        class: "absolute inset-0 grid place-items-center transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-75",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiSunOutline, {
            class: "themeIcon light col-start-1 row-start-1"
          }),
          /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiMoonOutline, {
            class: "themeIcon dark col-start-1 row-start-1"
          }),
          /* @__PURE__ */ jsxRuntime.jsx(bs_qwik.BsBrilliance, {
            class: "themeIcon auto col-start-1 row-start-1"
          })
        ]
      })
    })
  });
});
exports.ThemeToggle = ThemeToggle;
exports.getTheme = getTheme;
exports.setTheme = setTheme;

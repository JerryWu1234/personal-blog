import { jsx, Fragment, jsxs } from "@qwik.dev/core/jsx-runtime";
import { component$, useStyles$, event$, isServer } from "@qwik.dev/core";
import { themeStorageKey } from "../router-head/theme-script.qwik.mjs";
import { HiSunOutline, HiMoonOutline } from "../../node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/hi.qwik.qwik.mjs";
import { BsBrilliance } from "../../node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/bs.qwik.qwik.mjs";
import themeTogglecss from "./themToggle.css.qwik.mjs";
const getTheme = () => {
  if (isServer) {
    return "auto";
  }
  let theme;
  try {
    theme = localStorage.getItem(themeStorageKey);
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
  localStorage.setItem(themeStorageKey, theme);
};
const ThemeToggle = component$(() => {
  useStyles$(themeTogglecss);
  const onClick$ = event$(() => {
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
  return /* @__PURE__ */ jsx(Fragment, {
    children: /* @__PURE__ */ jsx("button", {
      onClick$,
      class: "group relative flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:opacity-60",
      children: /* @__PURE__ */ jsxs("div", {
        class: "absolute inset-0 grid place-items-center transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-75",
        children: [
          /* @__PURE__ */ jsx(HiSunOutline, {
            class: "themeIcon light col-start-1 row-start-1"
          }),
          /* @__PURE__ */ jsx(HiMoonOutline, {
            class: "themeIcon dark col-start-1 row-start-1"
          }),
          /* @__PURE__ */ jsx(BsBrilliance, {
            class: "themeIcon auto col-start-1 row-start-1"
          })
        ]
      })
    })
  });
});
export {
  ThemeToggle,
  getTheme,
  setTheme
};

import { jsx } from "@qwik.dev/core/jsx-runtime";
import { themeStorageKey } from "../router-head/theme-script.qwik.mjs";
const ThemeScript = () => {
  const themeScript = `
        try {
          const getItem = localStorage.getItem('${themeStorageKey}')
          if(getItem === 'light' || getItem === 'dark'){
              document.firstElementChild.setAttribute('data-theme', getItem);
          }
        } catch (err) { }`;
  return /* @__PURE__ */ jsx("script", {
    dangerouslySetInnerHTML: themeScript
  });
};
export {
  ThemeScript
};

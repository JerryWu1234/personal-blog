import { jsx } from "@qwik.dev/core/jsx-runtime";
import { component$ } from "@qwik.dev/core";
import { inspectorLink } from "./constant.qwik.mjs";
const Inspect = component$(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "flex-1 overflow-hidden",
    children: /* @__PURE__ */ jsx("iframe", {
      src: `${location.href}${inspectorLink}`,
      width: "100%",
      height: "100%",
      id: "inspect_qwik"
    })
  });
});
export {
  Inspect
};

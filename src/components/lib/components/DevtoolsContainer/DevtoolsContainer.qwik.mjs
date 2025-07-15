import { jsx } from "@qwik.dev/core/jsx-runtime";
import { component$, Slot } from "@qwik.dev/core";
const DevtoolsContainer = component$(() => {
  return /* @__PURE__ */ jsx("div", {
    class: "fixed bottom-0 right-0 z-[9999] font-sans",
    "q:slot": "content",
    children: /* @__PURE__ */ jsx(Slot, {})
  });
});
export {
  DevtoolsContainer
};

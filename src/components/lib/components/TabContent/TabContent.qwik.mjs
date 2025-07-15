import { jsxs, jsx } from "@qwik.dev/core/jsx-runtime";
import { component$, Slot } from "@qwik.dev/core";
const TabContent = component$(() => {
  return /* @__PURE__ */ jsxs("div", {
    class: "flex h-full w-full flex-col space-y-6",
    children: [
      /* @__PURE__ */ jsx("div", {
        class: "flex items-center justify-between border-b border-border pb-4",
        children: /* @__PURE__ */ jsx(Slot, {
          name: "title"
        })
      }),
      /* @__PURE__ */ jsx(Slot, {
        name: "content"
      })
    ]
  });
});
export {
  TabContent
};

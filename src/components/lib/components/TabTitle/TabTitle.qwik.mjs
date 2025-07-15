import { jsx } from "@qwik.dev/core/jsx-runtime";
import { component$ } from "@qwik.dev/core";
const TabTitle = component$(({ title }) => {
  return /* @__PURE__ */ jsx("h3", {
    class: "text-xl font-semibold",
    children: title
  });
});
export {
  TabTitle
};

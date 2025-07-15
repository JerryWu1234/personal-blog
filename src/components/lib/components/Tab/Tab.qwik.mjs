import { jsx } from "@qwik.dev/core/jsx-runtime";
import { component$, Slot } from "@qwik.dev/core";
const Tab = component$(({ state, id, title }) => {
  return /* @__PURE__ */ jsx("button", {
    onClick$: () => state.activeTab = id,
    title,
    class: {
      "flex h-10 w-10 items-center justify-center rounded-lg p-2.5 transition-all duration-200": true,
      "bg-foreground/5 hover:bg-foreground/10 text-muted-foreground hover:bg-primary-hover hover:text-foreground": state.activeTab !== id,
      "shadow-accent/35 bg-accent text-white shadow-lg": state.activeTab === id
    },
    children: /* @__PURE__ */ jsx(Slot, {})
  });
});
export {
  Tab
};

import { jsx } from "@qwik.dev/core/jsx-runtime";
import { component$, useSignal, useTask$, isBrowser, Slot } from "@qwik.dev/core";
const DevtoolsPanel = component$(({ state }) => {
  const panelRef = useSignal();
  useTask$(({ cleanup }) => {
    const handleKeyPress = (e) => {
      if (e.key === "`" && e.metaKey) {
        state.isOpen.value = !state.isOpen.value;
      }
      if (e.key === "Escape" && state.isOpen.value) {
        state.isOpen.value = false;
      }
    };
    const handleClickOutside = (e) => {
      if (state.isOpen.value && panelRef.value && !panelRef.value.parentElement?.contains(e.target)) {
        state.isOpen.value = !state.isOpen.value;
      }
    };
    if (!isBrowser) return;
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("mousedown", handleClickOutside);
    cleanup(() => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("mousedown", handleClickOutside);
    });
  });
  return /* @__PURE__ */ jsx("div", {
    ref: panelRef,
    class: "fixed bottom-6 right-6 flex h-[calc(100vh-3rem)] w-[calc(100vw-3rem)] translate-y-0 transform overflow-hidden rounded-lg border-2 border-border bg-background text-foreground backdrop-blur-lg transition-transform duration-300 ease-in-out",
    children: /* @__PURE__ */ jsx(Slot, {})
  });
});
export {
  DevtoolsPanel
};

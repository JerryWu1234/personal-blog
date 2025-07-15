import { jsx, jsxs } from "@qwik.dev/core/jsx-runtime";
import "../../../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.qwik.mjs";
import { getViteClientRpc } from "../../../../packages/kit/src/context.qwik.mjs";
import "../../../../node_modules/.pnpm/dree@5.1.5/node_modules/dree/bundled/lib/esm/index.esm.qwik.mjs";
import { component$ } from "@qwik.dev/core";
const InstallButton = component$(({ pkg, installingPackage }) => {
  return /* @__PURE__ */ jsx("button", {
    onClick$: async () => {
      installingPackage.value = pkg.name;
      const rpc = getViteClientRpc();
      const result = await rpc.installPackage(pkg.name);
      if (!result.success) {
        return Promise.reject(result.error || "Installation failed");
      }
    },
    disabled: installingPackage.value === pkg.name,
    class: [
      "rounded-full px-2 py-1 text-xs",
      installingPackage.value === pkg.name ? "bg-primary/5 text-primary/50 cursor-not-allowed" : "bg-primary/10 hover:bg-primary/20 text-primary"
    ].join(" "),
    children: installingPackage.value === pkg.name ? /* @__PURE__ */ jsxs("div", {
      class: "flex items-center gap-1",
      children: [
        /* @__PURE__ */ jsx("div", {
          class: "animate-spin h-3 w-3 rounded-full border border-current border-t-transparent"
        }),
        /* @__PURE__ */ jsx("span", {
          children: "Installing..."
        })
      ]
    }) : "Install"
  });
});
export {
  InstallButton
};

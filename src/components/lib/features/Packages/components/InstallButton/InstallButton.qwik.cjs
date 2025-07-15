"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
require("../../../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.qwik.cjs");
const context = require("../../../../packages/kit/src/context.qwik.cjs");
require("../../../../node_modules/.pnpm/dree@5.1.5/node_modules/dree/bundled/lib/esm/index.esm.qwik.cjs");
const core = require("@qwik.dev/core");
const InstallButton = core.component$(({ pkg, installingPackage }) => {
  return /* @__PURE__ */ jsxRuntime.jsx("button", {
    onClick$: async () => {
      installingPackage.value = pkg.name;
      const rpc = context.getViteClientRpc();
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
    children: installingPackage.value === pkg.name ? /* @__PURE__ */ jsxRuntime.jsxs("div", {
      class: "flex items-center gap-1",
      children: [
        /* @__PURE__ */ jsxRuntime.jsx("div", {
          class: "animate-spin h-3 w-3 rounded-full border border-current border-t-transparent"
        }),
        /* @__PURE__ */ jsxRuntime.jsx("span", {
          children: "Installing..."
        })
      ]
    }) : "Install"
  });
});
exports.InstallButton = InstallButton;

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const useDebouncer = require("../../hooks/useDebouncer.qwik.cjs");
const InstallButton = require("./components/InstallButton/InstallButton.qwik.cjs");
const Packages = core.component$(() => {
  const debouncedQuery = core.useSignal("");
  const installingPackage = core.useSignal(null);
  const debounceSearch = useDebouncer.useDebouncer(core.$((value) => {
    debouncedQuery.value = value;
  }), 300);
  const searchResults = core.useResource$(async ({ track }) => {
    const query = track(() => debouncedQuery.value);
    if (!query || query.length < 2) {
      return [];
    }
    const response = await fetch(`https://registry.npmjs.org/-/v1/search?text=${query}`);
    const data = await response.json();
    const packages = data.objects.map((obj) => ({
      name: obj.package.name,
      version: obj.package.version,
      description: obj.package.description || "No description available"
    }));
    return packages;
  });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", {
    class: "space-y-4",
    children: [
      /* @__PURE__ */ jsxRuntime.jsx("div", {
        class: "relative",
        children: /* @__PURE__ */ jsxRuntime.jsx("input", {
          type: "text",
          onInput$: (_, target) => {
            debounceSearch(target.value);
          },
          placeholder: "Search npm packages...",
          class: "w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-ring"
        })
      }),
      /* @__PURE__ */ jsxRuntime.jsx(core.Resource, {
        value: searchResults,
        onPending: () => /* @__PURE__ */ jsxRuntime.jsx("div", {
          class: "absolute right-3 top-1",
          children: /* @__PURE__ */ jsxRuntime.jsx("div", {
            class: "border-t-foreground/40 animate-spin h-5 w-5 rounded-full border-2 border-border"
          })
        }),
        onRejected: (error) => /* @__PURE__ */ jsxRuntime.jsx("div", {
          class: "mt-2 text-xs text-red-400",
          children: error.message || "Failed to fetch packages"
        }),
        onResolved: (packages) => {
          return /* @__PURE__ */ jsxRuntime.jsx("div", {
            class: "grid gap-3 md:grid-cols-2",
            children: packages.map((pkg) => {
              return /* @__PURE__ */ jsxRuntime.jsxs("div", {
                class: "bg-foreground/5 flex flex-col gap-2 rounded-lg p-3",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsxs("div", {
                    class: "flex items-center justify-between",
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx("div", {
                        class: "text-sm",
                        children: pkg.name
                      }),
                      /* @__PURE__ */ jsxRuntime.jsxs("div", {
                        class: "flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsxRuntime.jsx("div", {
                            class: "bg-foreground/5 rounded-full border border-border px-2 py-1 text-xs text-muted-foreground",
                            children: pkg.version
                          }),
                          /* @__PURE__ */ jsxRuntime.jsx(InstallButton.InstallButton, {
                            pkg,
                            installingPackage
                          })
                        ]
                      })
                    ]
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", {
                    class: "line-clamp-2 text-xs text-muted-foreground",
                    children: pkg.description
                  })
                ]
              }, pkg.name);
            })
          });
        }
      })
    ]
  });
});
exports.Packages = Packages;

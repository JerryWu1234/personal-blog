"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const hi_qwik = require("../../node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/hi.qwik.qwik.cjs");
const lu_qwik = require("../../node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/lu.qwik.qwik.cjs");
const Overview = core.component$(({ state }) => {
  const pageJump = core.$((pageName) => {
    state.activeTab = pageName;
  });
  const stopPropagation = core.sync$((e) => {
    e.preventDefault();
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", {
        class: "grid grid-cols-1 gap-5 md:grid-cols-3",
        children: [
          /* @__PURE__ */ jsxRuntime.jsxs("div", {
            onClick$: [
              core.$(() => pageJump("routes")),
              stopPropagation
            ],
            class: "flex cursor-pointer items-center gap-5 rounded-xl border border-border bg-card-item-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card-item-hover-bg",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", {
                class: "bg-foreground/5 rounded-lg border border-border p-3.5",
                children: /* @__PURE__ */ jsxRuntime.jsx(lu_qwik.LuFolderTree, {
                  class: "h-6 w-6 text-accent"
                })
              }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", {
                    class: "text-3xl font-semibold",
                    children: state.routes?.length
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", {
                    class: "text-sm text-muted-foreground",
                    children: "pages"
                  })
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", {
            onClick$: [
              core.$(() => pageJump("components")),
              stopPropagation
            ],
            class: "flex cursor-pointer items-center gap-5 rounded-xl border border-border bg-card-item-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card-item-hover-bg",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", {
                class: "bg-foreground/5 rounded-lg border border-border p-3.5",
                children: /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiCubeOutline, {
                  class: "h-6 w-6 text-accent"
                })
              }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", {
                    class: "text-3xl font-semibold",
                    children: state.components.length
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", {
                    class: "text-sm text-muted-foreground",
                    children: "components"
                  })
                ]
              })
            ]
          }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", {
            onClick$: [
              core.$(() => pageJump("assets")),
              stopPropagation
            ],
            class: "flex cursor-pointer items-center gap-5 rounded-xl border border-border bg-card-item-bg p-5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-card-item-hover-bg",
            children: [
              /* @__PURE__ */ jsxRuntime.jsx("div", {
                class: "bg-foreground/5 rounded-lg border border-border p-3.5",
                children: /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiPhotoOutline, {
                  class: "h-6 w-6 text-accent"
                })
              }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("div", {
                    class: "text-3xl font-semibold",
                    children: state.assets.length || 0
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", {
                    class: "text-sm text-muted-foreground",
                    children: "assets"
                  })
                ]
              })
            ]
          })
        ]
      }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", {
        onClick$: [
          core.$(() => pageJump("packages")),
          stopPropagation
        ],
        class: "cursor-pointer space-y-4 rounded-xl border border-border bg-card-item-bg p-5 hover:-translate-y-0.5 hover:bg-card-item-hover-bg",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", {
            class: "text-lg font-semibold",
            children: "Installed Packages"
          }),
          /* @__PURE__ */ jsxRuntime.jsx("div", {
            class: "grid grid-cols-1 gap-3 md:grid-cols-2",
            children: state.npmPackages.map(([name, version]) => /* @__PURE__ */ jsxRuntime.jsxs("div", {
              class: "bg-foreground/5 flex items-center justify-between rounded-lg p-3",
              children: [
                /* @__PURE__ */ jsxRuntime.jsx("div", {
                  class: "text-sm",
                  children: name
                }),
                /* @__PURE__ */ jsxRuntime.jsx("div", {
                  class: "bg-foreground/5 rounded-full border border-border px-2 py-1 text-xs text-muted-foreground",
                  children: version
                })
              ]
            }, name))
          })
        ]
      }),
      /* @__PURE__ */ jsxRuntime.jsxs("div", {
        class: "space-y-4 rounded-xl border border-border bg-card-item-bg p-5",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("h3", {
            class: "text-lg font-semibold",
            children: "Performance"
          }),
          /* @__PURE__ */ jsxRuntime.jsxs("div", {
            class: "space-y-3",
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", {
                class: "flex justify-between border-b border-border py-2",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", {
                    class: "text-muted-foreground",
                    children: "SSR to full load"
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", {
                    class: "font-medium",
                    children: "-"
                  })
                ]
              }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", {
                class: "flex justify-between border-b border-border py-2",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", {
                    class: "text-muted-foreground",
                    children: "Page load"
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", {
                    class: "font-medium",
                    children: "-"
                  })
                ]
              }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", {
                class: "flex justify-between py-2",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx("span", {
                    class: "text-muted-foreground",
                    children: "Navigation"
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("span", {
                    class: "font-medium",
                    children: "-"
                  })
                ]
              })
            ]
          })
        ]
      })
    ]
  });
});
exports.Overview = Overview;

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const index = require("./node_modules/.pnpm/vite-hot-client@2.0.4_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0_/node_modules/vite-hot-client/dist/index.qwik.cjs");
const hi_qwik = require("./node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/hi.qwik.qwik.cjs");
const bs_qwik = require("./node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/bs.qwik.qwik.cjs");
const lu_qwik = require("./node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/lu.qwik.qwik.cjs");
const client = require("./packages/kit/src/client.qwik.cjs");
require("./node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.qwik.cjs");
const context = require("./packages/kit/src/context.qwik.cjs");
const index_esm = require("./node_modules/.pnpm/dree@5.1.5/node_modules/dree/bundled/lib/esm/index.esm.qwik.cjs");
const global = require("./global.css.qwik.cjs");
const Tab = require("./components/Tab/Tab.qwik.cjs");
const TabContent = require("./components/TabContent/TabContent.qwik.cjs");
const Overview = require("./features/Overview/Overview.qwik.cjs");
const Assets = require("./features/Assets/Assets.qwik.cjs");
const Routes = require("./features/Routes/Routes.qwik.cjs");
const TabTitle = require("./components/TabTitle/TabTitle.qwik.cjs");
const RenderTree = require("./features/RenderTree/RenderTree.qwik.cjs");
const DevtoolsButton = require("./components/DevtoolsButton/DevtoolsButton.qwik.cjs");
const DevtoolsContainer = require("./components/DevtoolsContainer/DevtoolsContainer.qwik.cjs");
const DevtoolsPanel = require("./components/DevtoolsPanel/DevtoolsPanel.qwik.cjs");
const Packages = require("./features/Packages/Packages.qwik.cjs");
const Components = require("./features/Components/Components.qwik.cjs");
const Inspect = require("./features/inspect/Inspect.qwik.cjs");
const ThemeToggle = require("./components/ThemeToggle/ThemeToggle.qwik.cjs");
const themeScript = require("./components/ThemeToggle/theme-script.qwik.cjs");
function getClientRpcFunctions() {
  return {
    healthCheck: () => true
  };
}
const QwikDevtools = core.component$(() => {
  core.useStyles$(global);
  const state = core.useStore({
    isOpen: core.useSignal(false),
    activeTab: "overview",
    npmPackages: [],
    assets: [],
    components: [],
    routes: void 0
  });
  core.useVisibleTask$(async ({ track }) => {
    const hot = await index.tryCreateHotContext(void 0, [
      "/"
    ]);
    if (!hot) {
      throw new Error("Vite Hot Context not connected");
    }
    context.setViteClientContext(hot);
    client.createClientRpc(getClientRpcFunctions());
    track(() => {
      if (state.isOpen.value) {
        const rpc = context.getViteClientRpc();
        rpc.getAssetsFromPublicDir().then((data) => {
          state.assets = data;
        });
        rpc.getComponents().then((data) => {
          state.components = data;
        });
        rpc.getRoutes().then((data) => {
          const children = data?.children || [];
          const directories = children.filter((child) => child.type === "directory");
          const values = [
            {
              relativePath: "",
              name: "index",
              type: index_esm.Type.DIRECTORY,
              path: "",
              isSymbolicLink: false,
              children: void 0
            },
            ...directories
          ];
          state.routes = core.noSerialize(values);
        });
        rpc.getQwikPackages().then((data) => {
          state.npmPackages = data;
        });
      }
    });
  });
  return /* @__PURE__ */ jsxRuntime.jsxs(jsxRuntime.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntime.jsx(themeScript.ThemeScript, {}),
      /* @__PURE__ */ jsxRuntime.jsxs(DevtoolsContainer.DevtoolsContainer, {
        children: [
          /* @__PURE__ */ jsxRuntime.jsx(DevtoolsButton.DevtoolsButton, {
            state
          }),
          state.isOpen.value && /* @__PURE__ */ jsxRuntime.jsxs(DevtoolsPanel.DevtoolsPanel, {
            state,
            children: [
              /* @__PURE__ */ jsxRuntime.jsxs("div", {
                class: "bg-background/95 flex flex-col gap-2 border-r border-border p-3",
                children: [
                  /* @__PURE__ */ jsxRuntime.jsx(Tab.Tab, {
                    state,
                    id: "overview",
                    title: "Overview",
                    children: /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiBoltOutline, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx(Tab.Tab, {
                    state,
                    id: "packages",
                    title: "Packages",
                    children: /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiCubeOutline, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx(Tab.Tab, {
                    state,
                    id: "renderTree",
                    title: "renderTree",
                    children: /* @__PURE__ */ jsxRuntime.jsx(bs_qwik.BsDiagram3, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx(Tab.Tab, {
                    state,
                    id: "routes",
                    title: "Routes",
                    children: /* @__PURE__ */ jsxRuntime.jsx(lu_qwik.LuFolderTree, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx(Tab.Tab, {
                    state,
                    id: "assets",
                    title: "Assets",
                    children: /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiPhotoOutline, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx(Tab.Tab, {
                    state,
                    id: "components",
                    title: "Components Tree",
                    children: /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiCodeBracketMini, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx(Tab.Tab, {
                    state,
                    id: "inspect",
                    title: "inspect",
                    children: /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiMegaphoneMini, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsxRuntime.jsx("div", {
                    class: "mt-auto",
                    children: /* @__PURE__ */ jsxRuntime.jsx(ThemeToggle.ThemeToggle, {})
                  })
                ]
              }),
              /* @__PURE__ */ jsxRuntime.jsxs("div", {
                class: "custom-scrollbar flex-1 overflow-y-auto p-4",
                children: [
                  state.activeTab === "overview" && /* @__PURE__ */ jsxRuntime.jsxs(TabContent.TabContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsxs("div", {
                        class: "flex items-center gap-3",
                        "q:slot": "title",
                        children: [
                          /* @__PURE__ */ jsxRuntime.jsx("img", {
                            width: 32,
                            height: 32,
                            src: "https://qwik.dev/logos/qwik-logo.svg",
                            alt: "Qwik Logo",
                            class: "h-8 w-8"
                          }),
                          /* @__PURE__ */ jsxRuntime.jsx("h1", {
                            class: "text-2xl font-semibold",
                            children: "Qwik DevTools"
                          })
                        ]
                      }),
                      /* @__PURE__ */ jsxRuntime.jsx(Overview.Overview, {
                        state,
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "assets" && /* @__PURE__ */ jsxRuntime.jsxs(TabContent.TabContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(TabTitle.TabTitle, {
                        title: "Public Assets",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsxRuntime.jsxs("div", {
                        class: "flex gap-4 text-sm text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntime.jsxs("span", {
                            children: [
                              "Total Size:",
                              " ",
                              (state.assets?.reduce((acc, asset) => acc + asset.size, 0) / 1024).toFixed(2),
                              " ",
                              "KB"
                            ]
                          }),
                          /* @__PURE__ */ jsxRuntime.jsxs("span", {
                            children: [
                              "Count: ",
                              state.assets?.length || 0
                            ]
                          })
                        ]
                      }),
                      /* @__PURE__ */ jsxRuntime.jsx(Assets.Assets, {
                        state,
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "packages" && /* @__PURE__ */ jsxRuntime.jsxs(TabContent.TabContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(TabTitle.TabTitle, {
                        title: "Install an npm package",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsxRuntime.jsx(Packages.Packages, {
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "routes" && /* @__PURE__ */ jsxRuntime.jsxs(TabContent.TabContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(TabTitle.TabTitle, {
                        title: "Application Routes",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsxRuntime.jsx(Routes.Routes, {
                        state,
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "components" && /* @__PURE__ */ jsxRuntime.jsxs(TabContent.TabContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(TabTitle.TabTitle, {
                        title: "Components Tree",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsxRuntime.jsx(Components.Components, {
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "inspect" && /* @__PURE__ */ jsxRuntime.jsx(TabContent.TabContent, {
                    children: /* @__PURE__ */ jsxRuntime.jsx(Inspect.Inspect, {
                      "q:slot": "content"
                    })
                  }),
                  state.activeTab === "renderTree" && /* @__PURE__ */ jsxRuntime.jsxs(TabContent.TabContent, {
                    children: [
                      /* @__PURE__ */ jsxRuntime.jsx(TabTitle.TabTitle, {
                        title: "render Tree",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsxRuntime.jsx(RenderTree.RenderTree, {
                        "q:slot": "content"
                      })
                    ]
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
exports.QwikDevtools = QwikDevtools;

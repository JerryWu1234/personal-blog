import { jsxs, Fragment, jsx } from "@qwik.dev/core/jsx-runtime";
import { component$, useStyles$, useStore, useSignal, useVisibleTask$, noSerialize } from "@qwik.dev/core";
import { tryCreateHotContext } from "./node_modules/.pnpm/vite-hot-client@2.0.4_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0_/node_modules/vite-hot-client/dist/index.qwik.mjs";
import { HiBoltOutline, HiCubeOutline, HiPhotoOutline, HiCodeBracketMini, HiMegaphoneMini } from "./node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/hi.qwik.qwik.mjs";
import { BsDiagram3 } from "./node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/bs.qwik.qwik.mjs";
import { LuFolderTree } from "./node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/lu.qwik.qwik.mjs";
import { createClientRpc } from "./packages/kit/src/client.qwik.mjs";
import "./node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.qwik.mjs";
import { setViteClientContext, getViteClientRpc } from "./packages/kit/src/context.qwik.mjs";
import { Type as re } from "./node_modules/.pnpm/dree@5.1.5/node_modules/dree/bundled/lib/esm/index.esm.qwik.mjs";
import globalCss from "./global.css.qwik.mjs";
import { Tab } from "./components/Tab/Tab.qwik.mjs";
import { TabContent } from "./components/TabContent/TabContent.qwik.mjs";
import { Overview } from "./features/Overview/Overview.qwik.mjs";
import { Assets } from "./features/Assets/Assets.qwik.mjs";
import { Routes } from "./features/Routes/Routes.qwik.mjs";
import { TabTitle } from "./components/TabTitle/TabTitle.qwik.mjs";
import { RenderTree } from "./features/RenderTree/RenderTree.qwik.mjs";
import { DevtoolsButton } from "./components/DevtoolsButton/DevtoolsButton.qwik.mjs";
import { DevtoolsContainer } from "./components/DevtoolsContainer/DevtoolsContainer.qwik.mjs";
import { DevtoolsPanel } from "./components/DevtoolsPanel/DevtoolsPanel.qwik.mjs";
import { Packages } from "./features/Packages/Packages.qwik.mjs";
import { Components } from "./features/Components/Components.qwik.mjs";
import { Inspect } from "./features/inspect/Inspect.qwik.mjs";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle.qwik.mjs";
import { ThemeScript } from "./components/ThemeToggle/theme-script.qwik.mjs";
function getClientRpcFunctions() {
  return {
    healthCheck: () => true
  };
}
const QwikDevtools = component$(() => {
  useStyles$(globalCss);
  const state = useStore({
    isOpen: useSignal(false),
    activeTab: "overview",
    npmPackages: [],
    assets: [],
    components: [],
    routes: void 0
  });
  useVisibleTask$(async ({ track }) => {
    const hot = await tryCreateHotContext(void 0, [
      "/"
    ]);
    if (!hot) {
      throw new Error("Vite Hot Context not connected");
    }
    setViteClientContext(hot);
    createClientRpc(getClientRpcFunctions());
    track(() => {
      if (state.isOpen.value) {
        const rpc = getViteClientRpc();
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
              type: re.DIRECTORY,
              path: "",
              isSymbolicLink: false,
              children: void 0
            },
            ...directories
          ];
          state.routes = noSerialize(values);
        });
        rpc.getQwikPackages().then((data) => {
          state.npmPackages = data;
        });
      }
    });
  });
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [
      /* @__PURE__ */ jsx(ThemeScript, {}),
      /* @__PURE__ */ jsxs(DevtoolsContainer, {
        children: [
          /* @__PURE__ */ jsx(DevtoolsButton, {
            state
          }),
          state.isOpen.value && /* @__PURE__ */ jsxs(DevtoolsPanel, {
            state,
            children: [
              /* @__PURE__ */ jsxs("div", {
                class: "bg-background/95 flex flex-col gap-2 border-r border-border p-3",
                children: [
                  /* @__PURE__ */ jsx(Tab, {
                    state,
                    id: "overview",
                    title: "Overview",
                    children: /* @__PURE__ */ jsx(HiBoltOutline, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsx(Tab, {
                    state,
                    id: "packages",
                    title: "Packages",
                    children: /* @__PURE__ */ jsx(HiCubeOutline, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsx(Tab, {
                    state,
                    id: "renderTree",
                    title: "renderTree",
                    children: /* @__PURE__ */ jsx(BsDiagram3, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsx(Tab, {
                    state,
                    id: "routes",
                    title: "Routes",
                    children: /* @__PURE__ */ jsx(LuFolderTree, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsx(Tab, {
                    state,
                    id: "assets",
                    title: "Assets",
                    children: /* @__PURE__ */ jsx(HiPhotoOutline, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsx(Tab, {
                    state,
                    id: "components",
                    title: "Components Tree",
                    children: /* @__PURE__ */ jsx(HiCodeBracketMini, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsx(Tab, {
                    state,
                    id: "inspect",
                    title: "inspect",
                    children: /* @__PURE__ */ jsx(HiMegaphoneMini, {
                      class: "h-5 w-5"
                    })
                  }),
                  /* @__PURE__ */ jsx("div", {
                    class: "mt-auto",
                    children: /* @__PURE__ */ jsx(ThemeToggle, {})
                  })
                ]
              }),
              /* @__PURE__ */ jsxs("div", {
                class: "custom-scrollbar flex-1 overflow-y-auto p-4",
                children: [
                  state.activeTab === "overview" && /* @__PURE__ */ jsxs(TabContent, {
                    children: [
                      /* @__PURE__ */ jsxs("div", {
                        class: "flex items-center gap-3",
                        "q:slot": "title",
                        children: [
                          /* @__PURE__ */ jsx("img", {
                            width: 32,
                            height: 32,
                            src: "https://qwik.dev/logos/qwik-logo.svg",
                            alt: "Qwik Logo",
                            class: "h-8 w-8"
                          }),
                          /* @__PURE__ */ jsx("h1", {
                            class: "text-2xl font-semibold",
                            children: "Qwik DevTools"
                          })
                        ]
                      }),
                      /* @__PURE__ */ jsx(Overview, {
                        state,
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "assets" && /* @__PURE__ */ jsxs(TabContent, {
                    children: [
                      /* @__PURE__ */ jsx(TabTitle, {
                        title: "Public Assets",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsxs("div", {
                        class: "flex gap-4 text-sm text-muted-foreground",
                        children: [
                          /* @__PURE__ */ jsxs("span", {
                            children: [
                              "Total Size:",
                              " ",
                              (state.assets?.reduce((acc, asset) => acc + asset.size, 0) / 1024).toFixed(2),
                              " ",
                              "KB"
                            ]
                          }),
                          /* @__PURE__ */ jsxs("span", {
                            children: [
                              "Count: ",
                              state.assets?.length || 0
                            ]
                          })
                        ]
                      }),
                      /* @__PURE__ */ jsx(Assets, {
                        state,
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "packages" && /* @__PURE__ */ jsxs(TabContent, {
                    children: [
                      /* @__PURE__ */ jsx(TabTitle, {
                        title: "Install an npm package",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsx(Packages, {
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "routes" && /* @__PURE__ */ jsxs(TabContent, {
                    children: [
                      /* @__PURE__ */ jsx(TabTitle, {
                        title: "Application Routes",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsx(Routes, {
                        state,
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "components" && /* @__PURE__ */ jsxs(TabContent, {
                    children: [
                      /* @__PURE__ */ jsx(TabTitle, {
                        title: "Components Tree",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsx(Components, {
                        "q:slot": "content"
                      })
                    ]
                  }),
                  state.activeTab === "inspect" && /* @__PURE__ */ jsx(TabContent, {
                    children: /* @__PURE__ */ jsx(Inspect, {
                      "q:slot": "content"
                    })
                  }),
                  state.activeTab === "renderTree" && /* @__PURE__ */ jsxs(TabContent, {
                    children: [
                      /* @__PURE__ */ jsx(TabTitle, {
                        title: "render Tree",
                        "q:slot": "title"
                      }),
                      /* @__PURE__ */ jsx(RenderTree, {
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
export {
  QwikDevtools
};

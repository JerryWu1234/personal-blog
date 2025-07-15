import { jsx, jsxs } from "@qwik.dev/core/jsx-runtime";
import { component$, useSignal, useStore, useVisibleTask$, useComputed$, $, isSignal } from "@qwik.dev/core";
import { Tree } from "../../components/Tree/Tree.qwik.mjs";
import { vnode_toObject } from "../../components/Tree/filterVnode.qwik.mjs";
import { htmlContainer } from "../../utils/location.qwik.mjs";
import { ISDEVTOOL } from "../../components/Tree/type.qwik.mjs";
import { objectToTree, QSEQ, createTreeNodeObj } from "./transfromqseq.qwik.mjs";
import { removeNodeFromTree } from "../../components/Tree/vnode.qwik.mjs";
import { isStore } from "@qwik.dev/core/optimizer";
const RenderTree = component$(() => {
  const data = useSignal([]);
  const exampleState = {
    user: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      "q:seq": {
        count: 5
      },
      preferences: {
        theme: "dark",
        language: "en-US",
        notifications: true
      },
      roles: [
        "admin",
        "user",
        "moderator"
      ]
    },
    counter: 42,
    isLoading: false,
    items: [
      {
        id: 1,
        name: "Item 1",
        price: 10.99,
        inStock: true
      },
      {
        id: 2,
        name: "Item 2",
        price: 20.5,
        inStock: false
      }
    ],
    config: {
      apiUrl: "https://api.example.com",
      timeout: 5e3,
      retry: 3
    }
  };
  const store = useStore({
    const: 1
  });
  const pureStore = {
    const: 1
  };
  console.log(isStore(store));
  console.log(isStore(pureStore));
  useVisibleTask$(() => {
    console.log(isStore(store));
    console.log(isStore(pureStore));
  });
  const stateTree = useSignal(objectToTree(exampleState));
  const qwikContainer = useComputed$(() => {
    try {
      return htmlContainer();
    } catch (error) {
      console.error(error);
      return null;
    }
  });
  useVisibleTask$(() => {
    data.value = removeNodeFromTree(vnode_toObject(qwikContainer.value.rootVNode), (node) => {
      return node.name === ISDEVTOOL;
    });
  });
  const onNodeClick = $((node) => {
    if (Array.isArray(node.props?.[QSEQ])) {
      stateTree.value = node.props?.[QSEQ].map((item) => {
        if (isSignal(item)) {
          return createTreeNodeObj("useStore", objectToTree(item));
        }
        return item;
      }).flat();
      console.log(stateTree.value.flat(), ">>>>");
    }
  });
  const currentTab = useSignal("state");
  return /* @__PURE__ */ jsx("div", {
    class: "h-full w-full flex-1 overflow-hidden rounded-md border  border-border",
    children: /* @__PURE__ */ jsxs("div", {
      class: "flex h-full w-full",
      children: [
        /* @__PURE__ */ jsx("div", {
          class: "w-[50%] overflow-hidden p-4",
          children: /* @__PURE__ */ jsx(Tree, {
            data,
            onNodeClick
          })
        }),
        /* @__PURE__ */ jsx("div", {
          class: "border-l border-border"
        }),
        /* @__PURE__ */ jsxs("div", {
          class: "flex h-full w-[50%] flex-col overflow-y-auto p-4",
          children: [
            /* @__PURE__ */ jsx("div", {
              class: "border-b border-border",
              children: /* @__PURE__ */ jsxs("div", {
                class: "flex space-x-4 border-b border-border",
                children: [
                  /* @__PURE__ */ jsx("button", {
                    onClick$: () => currentTab.value = "state",
                    style: currentTab.value === "state" ? {
                      borderBottom: "2px solid var(--color-primary-active)"
                    } : {},
                    class: "px-4 py-3 text-sm font-medium border-b-transparent border-b-2 transition-all duration-300 ease-in-out",
                    children: "state"
                  }),
                  /* @__PURE__ */ jsx("button", {
                    onClick$: () => currentTab.value = "code",
                    style: currentTab.value === "code" ? {
                      borderBottom: "2px solid var(--color-primary-active)"
                    } : {},
                    class: "px-4 py-3 text-sm font-medium border-b-transparent border-b-2  transition-all duration-300 ease-in-out",
                    children: "code"
                  })
                ]
              })
            }),
            currentTab.value === "state" && /* @__PURE__ */ jsx("div", {
              class: "mt-5 flex-1 rounded-lg border border-border bg-card-item-bg p-2 shadow-sm",
              children: /* @__PURE__ */ jsx(Tree, {
                data: stateTree,
                gap: 10,
                renderNode: $((node) => {
                  const elementType = node.elementType;
                  const label = node.label || node.name || "";
                  if (elementType === "string") {
                    return /* @__PURE__ */ jsx("span", {
                      class: "text-green-600 dark:text-green-400",
                      children: label
                    });
                  }
                  if (elementType === "number") {
                    return /* @__PURE__ */ jsx("span", {
                      class: "text-blue-600 dark:text-blue-400",
                      children: label
                    });
                  }
                  if (elementType === "boolean") {
                    return /* @__PURE__ */ jsx("span", {
                      class: "text-purple-600 dark:text-purple-400",
                      children: label
                    });
                  }
                  if (elementType === "null") {
                    return /* @__PURE__ */ jsx("span", {
                      class: "text-gray-500 dark:text-gray-400 italic",
                      children: label
                    });
                  }
                  if (elementType === "function") {
                    return /* @__PURE__ */ jsx("span", {
                      class: "text-orange-600 dark:text-orange-400 italic",
                      children: label
                    });
                  }
                  if (elementType === "array" || elementType === "object") {
                    return /* @__PURE__ */ jsx("span", {
                      class: "font-medium",
                      children: label
                    });
                  }
                  return /* @__PURE__ */ jsx("span", {
                    children: label
                  });
                })
              })
            }),
            currentTab.value === "code" && /* @__PURE__ */ jsx("div", {
              class: "mt-5 flex-1 rounded-lg border border-border bg-card-item-bg p-2 shadow-sm",
              children: "This is where the code view will be displayed. You can inspect the component source code here."
            })
          ]
        })
      ]
    })
  });
});
export {
  RenderTree
};

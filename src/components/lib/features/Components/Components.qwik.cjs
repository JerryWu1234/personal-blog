"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const Tree = require("./components/Tree.qwik.cjs");
const styleModern = require("../../node_modules/.pnpm/react-complex-tree@2.4.6_react@18.2.0/node_modules/react-complex-tree/lib/style-modern.css.qwik.cjs");
const styles = require("./styles.css.qwik.cjs");
const Components = core.component$(() => {
  core.useStyles$(styleModern);
  core.useStyles$(styles);
  return /* @__PURE__ */ jsxRuntime.jsxs("div", {
    children: [
      /* @__PURE__ */ jsxRuntime.jsx(Tree.QGreetings, {}),
      /* @__PURE__ */ jsxRuntime.jsx(ComponentsStore, {})
    ]
  });
});
const ComponentsStore = core.component$(() => {
  const selectedComponent = core.useSignal(null);
  const components = window.__QWIK_DEVTOOLS__.appState;
  const componentStore = Object.keys(components);
  const handleComponentSelected = core.$((key) => {
    selectedComponent.value = key;
  });
  return /* @__PURE__ */ jsxRuntime.jsxs("div", {
    children: [
      /* @__PURE__ */ jsxRuntime.jsxs("select", {
        class: "mt-2 w-1/2 rounded-md border border-border bg-transparent p-2 font-mono text-foreground",
        onChange$: (_, e) => handleComponentSelected(e.value),
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("option", {
            value: "",
            children: "Select component"
          }),
          componentStore.map((key) => /* @__PURE__ */ jsxRuntime.jsx("option", {
            value: key,
            class: "p-2",
            children: key
          }, key))
        ]
      }),
      selectedComponent.value && /* @__PURE__ */ jsxRuntime.jsx(ComponentStoreUpdate, {
        value: components[selectedComponent.value].state
      })
    ]
  });
});
const ComponentStoreUpdate = core.component$(({ value }) => {
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    class: "mt-2 flex w-1/2 flex-col font-mono text-foreground",
    children: Object.keys(value).map((key) => {
      if (value[key].type === "signal") {
        return /* @__PURE__ */ jsxRuntime.jsxs("div", {
          class: "flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs("h2", {
              class: "text-lg font-bold",
              children: [
                "Signal: ",
                key
              ]
            }),
            /* @__PURE__ */ jsxRuntime.jsx("input", {
              class: "mt-2 rounded-md border border-border bg-transparent p-2 font-mono text-foreground",
              type: typeof value[key].value === "string" ? "text" : "number",
              "bind:value": value[key].value
            })
          ]
        }, key);
      }
      if (value[key].type === "store") {
        return /* @__PURE__ */ jsxRuntime.jsxs("div", {
          class: "flex flex-col",
          children: [
            /* @__PURE__ */ jsxRuntime.jsxs("h2", {
              class: "text-lg font-bold",
              children: [
                "Store: ",
                key
              ]
            }),
            Object.keys(value[key].value).map((storeKey) => /* @__PURE__ */ jsxRuntime.jsxs("div", {
              class: "flex flex-col",
              children: [
                /* @__PURE__ */ jsxRuntime.jsxs("h3", {
                  class: "text-md font-bold",
                  children: [
                    "Key: ",
                    storeKey
                  ]
                }),
                /* @__PURE__ */ jsxRuntime.jsx("input", {
                  class: "mt-2 rounded-md border border-border bg-transparent p-2 font-mono text-foreground",
                  type: typeof value[key].value[storeKey] === "string" ? "text" : "number",
                  value: value[key].value[storeKey],
                  onChange$: (_, e) => {
                    value[key].value[storeKey] = typeof value[key].value[storeKey] === "string" ? e.value : Number(e.value);
                  }
                })
              ]
            }, storeKey))
          ]
        }, key);
      }
    })
  });
});
exports.Components = Components;

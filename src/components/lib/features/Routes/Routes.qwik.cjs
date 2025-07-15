"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const Routes = core.component$(({ state }) => {
  return /* @__PURE__ */ jsxRuntime.jsxs("div", {
    class: "flex-1 overflow-hidden rounded-xl border border-border",
    children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", {
        class: "grid grid-cols-4 gap-4 bg-card-item-bg p-4 text-sm font-medium",
        children: [
          /* @__PURE__ */ jsxRuntime.jsx("div", {
            children: "Route Path"
          }),
          /* @__PURE__ */ jsxRuntime.jsx("div", {
            children: "Name"
          }),
          /* @__PURE__ */ jsxRuntime.jsx("div", {
            children: "Middleware"
          }),
          /* @__PURE__ */ jsxRuntime.jsx("div", {
            children: "Layout"
          })
        ]
      }),
      state.routes?.map((route, i) => {
        const children = route.children || [];
        const layout = route.relativePath !== "" && route.type === "directory" && children.find((child) => child.name.startsWith("layout"));
        return /* @__PURE__ */ jsxRuntime.jsxs("div", {
          class: "grid grid-cols-4 gap-4 border-t border-border p-4 text-sm hover:bg-card-item-hover-bg",
          children: [
            /* @__PURE__ */ jsxRuntime.jsx("div", {
              children: /* @__PURE__ */ jsxRuntime.jsx("span", {
                class: {
                  "text-accent": location.pathname === "/" && route.relativePath === "" || location.pathname === `/${route.relativePath}/`
                },
                children: route.relativePath === "" ? "/" : `/${route.relativePath}/`
              })
            }),
            /* @__PURE__ */ jsxRuntime.jsx("div", {
              class: "text-muted-foreground",
              children: route.name
            }),
            /* @__PURE__ */ jsxRuntime.jsx("div", {
              class: "text-muted-foreground",
              children: "-"
            }),
            /* @__PURE__ */ jsxRuntime.jsx("div", {
              children: /* @__PURE__ */ jsxRuntime.jsx("span", {
                class: {
                  "text-accent": layout && i > 0,
                  "text-muted-foreground": !layout || i === 0
                },
                children: layout && i > 0 ? `${route.relativePath}/layout` : "default"
              })
            })
          ]
        }, route.relativePath);
      })
    ]
  });
});
exports.Routes = Routes;

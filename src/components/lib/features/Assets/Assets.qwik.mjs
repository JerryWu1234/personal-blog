import { jsx, jsxs } from "@qwik.dev/core/jsx-runtime";
import { component$ } from "@qwik.dev/core";
const Assets = component$(({ state }) => {
  return /* @__PURE__ */ jsx("div", {
    class: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
    children: state.assets?.map((asset) => {
      const isImage = asset.path.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i);
      const fileExt = asset.path.split(".").pop()?.toUpperCase();
      return /* @__PURE__ */ jsxs("div", {
        class: "overflow-hidden rounded-xl border border-border bg-card-item-bg transition-all duration-200 hover:bg-card-item-hover-bg",
        children: [
          isImage ? /* @__PURE__ */ jsx("div", {
            class: "aspect-square overflow-hidden bg-black/20",
            children: /* @__PURE__ */ jsx("img", {
              width: 176,
              height: 176,
              src: asset.publicPath,
              alt: asset.path,
              class: "h-full w-full object-cover"
            })
          }) : /* @__PURE__ */ jsx("div", {
            class: "flex aspect-square items-center justify-center bg-black/20",
            children: /* @__PURE__ */ jsx("span", {
              class: "font-mono text-2xl text-muted-foreground",
              children: fileExt
            })
          }),
          /* @__PURE__ */ jsxs("div", {
            class: "space-y-2 p-4",
            children: [
              /* @__PURE__ */ jsx("div", {
                class: "truncate text-sm",
                title: asset.path,
                children: asset.path.split("/").pop()
              }),
              /* @__PURE__ */ jsxs("div", {
                class: "flex items-center justify-between text-xs text-muted-foreground",
                children: [
                  /* @__PURE__ */ jsxs("span", {
                    children: [
                      (asset.size / 1024).toFixed(2),
                      " KB"
                    ]
                  }),
                  /* @__PURE__ */ jsx("span", {
                    class: "bg-foreground/5 rounded-full px-2 py-1",
                    children: fileExt
                  })
                ]
              })
            ]
          })
        ]
      }, asset.filePath);
    })
  });
});
export {
  Assets
};

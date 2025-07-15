"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("../../../_virtual/jsx-runtime.qwik.cjs");
const index_qwik = require("../../../node_modules/.pnpm/@qwik.dev_react@2.0.0-beta.5_@qwik.dev_core@2.0.0-beta.5_prettier@3.3.3_vite@6.2.6_@typ_9cb9a6fd9f7a5ebe9466335af0e3fbd2/node_modules/@qwik.dev/react/lib/index.qwik.qwik.cjs");
const UncontrolledTreeEnvironment = require("../../../node_modules/.pnpm/react-complex-tree@2.4.6_react@18.2.0/node_modules/react-complex-tree/lib/esm/uncontrolledEnvironment/UncontrolledTreeEnvironment.qwik.cjs");
const StaticTreeDataProvider = require("../../../node_modules/.pnpm/react-complex-tree@2.4.6_react@18.2.0/node_modules/react-complex-tree/lib/esm/uncontrolledEnvironment/StaticTreeDataProvider.qwik.cjs");
const Tree = require("../../../node_modules/.pnpm/react-complex-tree@2.4.6_react@18.2.0/node_modules/react-complex-tree/lib/esm/tree/Tree.qwik.cjs");
const readTemplate = (template, data = {
  items: {}
}) => {
  for (const [key, value] of Object.entries(template)) {
    data.items[key] = {
      index: key,
      canMove: true,
      isFolder: value !== null,
      children: value !== null ? Object.keys(value) : void 0,
      data: key,
      canRename: true
    };
    if (value !== null) {
      readTemplate(value, data);
    }
  }
  return data;
};
const longTree = {
  root: {
    "<QwikRouterProvider />": {
      "<RouterHead />": null,
      "<RouterOutlet />": null
    }
  }
};
function Greetings() {
  return /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(UncontrolledTreeEnvironment.UncontrolledTreeEnvironment, {
    dataProvider: new StaticTreeDataProvider.StaticTreeDataProvider(readTemplate(longTree).items, (item, data) => ({
      ...item,
      data
    })),
    getItemTitle: (item) => item.data,
    canDragAndDrop: false,
    canReorderItems: false,
    canDropOnFolder: false,
    canDropOnNonFolder: false,
    viewState: {
      "tree-1": {
        expandedItems: []
      }
    },
    children: /* @__PURE__ */ jsxRuntime.jsxRuntimeExports.jsx(Tree.Tree, {
      treeId: "tree-1",
      rootItem: "root",
      treeLabel: "Tree Example"
    })
  });
}
const QGreetings = index_qwik.qwikify$(Greetings, {
  eagerness: "load"
});
exports.QGreetings = QGreetings;

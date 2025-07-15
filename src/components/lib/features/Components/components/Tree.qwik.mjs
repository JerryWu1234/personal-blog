import { j as jsxRuntimeExports } from "../../../_virtual/jsx-runtime.qwik.mjs";
import { qwikify$ } from "../../../node_modules/.pnpm/@qwik.dev_react@2.0.0-beta.5_@qwik.dev_core@2.0.0-beta.5_prettier@3.3.3_vite@6.2.6_@typ_9cb9a6fd9f7a5ebe9466335af0e3fbd2/node_modules/@qwik.dev/react/lib/index.qwik.qwik.mjs";
import { UncontrolledTreeEnvironment } from "../../../node_modules/.pnpm/react-complex-tree@2.4.6_react@18.2.0/node_modules/react-complex-tree/lib/esm/uncontrolledEnvironment/UncontrolledTreeEnvironment.qwik.mjs";
import { StaticTreeDataProvider } from "../../../node_modules/.pnpm/react-complex-tree@2.4.6_react@18.2.0/node_modules/react-complex-tree/lib/esm/uncontrolledEnvironment/StaticTreeDataProvider.qwik.mjs";
import { Tree } from "../../../node_modules/.pnpm/react-complex-tree@2.4.6_react@18.2.0/node_modules/react-complex-tree/lib/esm/tree/Tree.qwik.mjs";
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(UncontrolledTreeEnvironment, {
    dataProvider: new StaticTreeDataProvider(readTemplate(longTree).items, (item, data) => ({
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
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tree, {
      treeId: "tree-1",
      rootItem: "root",
      treeLabel: "Tree Example"
    })
  });
}
const QGreetings = qwikify$(Greetings, {
  eagerness: "load"
});
export {
  QGreetings
};

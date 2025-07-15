"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const jsxRuntime = require("@qwik.dev/core/jsx-runtime");
const core = require("@qwik.dev/core");
const hi_qwik = require("../../node_modules/.pnpm/@qwikest_icons@0.0.13_@builder.io_qwik@1.11.0_vite@6.2.6_@types_node@20.14.11_jiti@2.4.2_tsx@4.19.2_yaml@2.7.0__/node_modules/@qwikest/icons/lib/hi.qwik.qwik.cjs");
const TreeNodeComponent = core.component$((props) => {
  const isExpanded = core.useSignal(props.expandLevel <= props.level);
  const hasChildren = props.node.children && props.node.children.length > 0;
  const handleNodeClick = core.$(() => {
    props.onNodeClick(props.node);
    if (hasChildren) {
      isExpanded.value = !isExpanded.value;
    }
  });
  const iterateProps = (porps) => {
    const displayProp = [
      "q:id",
      "q:key"
    ];
    return displayProp.reduce((totalStr, prop) => {
      if (porps[prop]) {
        totalStr += `${prop}="${porps[prop]}" `;
      }
      return totalStr;
    }, "");
  };
  const isActive = props.node.id === props.activeNodeId;
  return /* @__PURE__ */ jsxRuntime.jsxs("div", {
    style: {
      paddingLeft: `${props.level * props.gap}px`
    },
    children: [
      /* @__PURE__ */ jsxRuntime.jsxs("div", {
        class: `flex cursor-pointer items-center rounded-md p-1 transition-colors duration-150 
                ${isActive ? "bg-primary  text-white " : "hover:bg-primary-hover "}`,
        onClick$: handleNodeClick,
        children: [
          hasChildren ? /* @__PURE__ */ jsxRuntime.jsx(hi_qwik.HiChevronUpMini, {
            class: `mr-2 h-4 w-4 flex-shrink-0 transition-transform duration-200 ${isExpanded.value ? "rotate-90" : "rotate-180"}`
          }) : /* @__PURE__ */ jsxRuntime.jsx("div", {
            class: "mr-2 w-4 flex-shrink-0"
          }),
          /* @__PURE__ */ jsxRuntime.jsx("span", {
            class: "text-sm",
            children: props.renderNode ? /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, {
              children: props.renderNode(props.node)
            }) : `<${props.node.label || props.node.name} ${iterateProps(props.node.props || {})}>`
          })
        ]
      }),
      !isExpanded.value && hasChildren && /* @__PURE__ */ jsxRuntime.jsx(jsxRuntime.Fragment, {
        children: props.node.children?.map((child) => /* @__PURE__ */ jsxRuntime.jsx(TreeNodeComponent, {
          node: child,
          gap: props.gap,
          expandLevel: props.expandLevel,
          level: props.level + 1,
          activeNodeId: props.activeNodeId,
          onNodeClick: props.onNodeClick,
          renderNode: props.renderNode
        }, child.id))
      })
    ]
  });
});
const Tree = core.component$((props) => {
  const ref = core.useSignal();
  const store = props.data;
  const activeNodeId = core.useSignal("");
  const setActiveNode = core.$((node) => {
    ref.value.scrollLeft = ref.value.scrollWidth;
    activeNodeId.value = node.id;
    props.onNodeClick && props.onNodeClick(node);
  });
  return /* @__PURE__ */ jsxRuntime.jsx("div", {
    class: "h-full w-full overflow-x-auto overflow-y-auto",
    ref,
    children: store.value.map((rootNode) => /* @__PURE__ */ jsxRuntime.jsx(TreeNodeComponent, {
      gap: props.gap || 20,
      node: rootNode,
      level: 0,
      expandLevel: 2,
      activeNodeId: activeNodeId.value,
      onNodeClick: setActiveNode,
      renderNode: props.renderNode
    }, rootNode.id))
  });
});
exports.Tree = Tree;

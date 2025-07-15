"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const vnode = require("./vnode.qwik.cjs");
const type = require("./type.qwik.cjs");
const location = require("../../utils/location.qwik.cjs");
let index = 0;
function initVnode({ name = "text", props = {}, element = {}, children = [] }) {
  return {
    name,
    props,
    element,
    children,
    label: name,
    id: `vnode-${index++}`
  };
}
function vnode_toObject(vnodeItem) {
  if (vnodeItem === null || vnodeItem === void 0) {
    return null;
  }
  return buildTreeRecursive(vnodeItem);
}
const container = location.htmlContainer();
function buildTreeRecursive(vnode$1, materialize) {
  if (!vnode$1) {
    return [];
  }
  const result = [];
  let currentVNode = vnode$1;
  while (currentVNode) {
    const isVirtual = vnode.vnode_isVirtualVNode(currentVNode);
    const isFragment = isVirtual && typeof container.getHostProp(currentVNode, type.RENDER_TYPE) === "function";
    if (isFragment) {
      const vnodeObject = initVnode({
        element: currentVNode
      });
      vnode.vnode_getAttrKeys(currentVNode).forEach((key) => {
        if (key === type.DEBUG_TYPE) return;
        const value = container.getHostProp(currentVNode, key);
        vnode.vnode_getProps(currentVNode)[vnode.vnode_getProps(currentVNode).indexOf(key) + 1] = value;
        vnodeObject.props[key] = vnode.vnode_getAttr(currentVNode, key);
        if (key === type.RENDER_TYPE) {
          vnodeObject.label = vnode.normalizeName(value.getSymbol());
          vnodeObject.name = vnode.normalizeName(value.getSymbol());
        }
      });
      const firstChild = vnode.vnode_getFirstChild(currentVNode);
      const children = firstChild ? buildTreeRecursive(firstChild) : [];
      if (children.length > 0) {
        vnodeObject.children = children;
      }
      result.push(vnodeObject);
    } else if (vnode.vnode_isMaterialized(currentVNode) || isVirtual && !isFragment) {
      const firstChild = vnode.vnode_getFirstChild(currentVNode);
      if (firstChild) {
        result.push(...buildTreeRecursive(firstChild));
      }
    }
    currentVNode = vnode.vnode_getNextSibling(currentVNode);
  }
  return result;
}
exports.vnode_toObject = vnode_toObject;

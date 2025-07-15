import { vnode_isVirtualVNode, vnode_getAttrKeys, vnode_getProps, vnode_getAttr, normalizeName, vnode_getFirstChild, vnode_isMaterialized, vnode_getNextSibling } from "./vnode.qwik.mjs";
import { RENDER_TYPE, DEBUG_TYPE } from "./type.qwik.mjs";
import { htmlContainer } from "../../utils/location.qwik.mjs";
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
const container = htmlContainer();
function buildTreeRecursive(vnode, materialize) {
  if (!vnode) {
    return [];
  }
  const result = [];
  let currentVNode = vnode;
  while (currentVNode) {
    const isVirtual = vnode_isVirtualVNode(currentVNode);
    const isFragment = isVirtual && typeof container.getHostProp(currentVNode, RENDER_TYPE) === "function";
    if (isFragment) {
      const vnodeObject = initVnode({
        element: currentVNode
      });
      vnode_getAttrKeys(currentVNode).forEach((key) => {
        if (key === DEBUG_TYPE) return;
        const value = container.getHostProp(currentVNode, key);
        vnode_getProps(currentVNode)[vnode_getProps(currentVNode).indexOf(key) + 1] = value;
        vnodeObject.props[key] = vnode_getAttr(currentVNode, key);
        if (key === RENDER_TYPE) {
          vnodeObject.label = normalizeName(value.getSymbol());
          vnodeObject.name = normalizeName(value.getSymbol());
        }
      });
      const firstChild = vnode_getFirstChild(currentVNode);
      const children = firstChild ? buildTreeRecursive(firstChild) : [];
      if (children.length > 0) {
        vnodeObject.children = children;
      }
      result.push(vnodeObject);
    } else if (vnode_isMaterialized(currentVNode) || isVirtual && !isFragment) {
      const firstChild = vnode_getFirstChild(currentVNode);
      if (firstChild) {
        result.push(...buildTreeRecursive(firstChild));
      }
    }
    currentVNode = vnode_getNextSibling(currentVNode);
  }
  return result;
}
export {
  vnode_toObject
};

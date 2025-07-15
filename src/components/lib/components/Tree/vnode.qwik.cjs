"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const type = require("./type.qwik.cjs");
const vnode_isTextVNode = (vNode) => {
  const flag = vNode[type.VNodeProps.flags];
  return (flag & type.VNodeFlags.Text) === type.VNodeFlags.Text;
};
const vnode_isVirtualVNode = (vNode) => {
  const flag = vNode[type.VNodeProps.flags];
  return (flag & type.VNodeFlags.Virtual) === type.VNodeFlags.Virtual;
};
const vnode_getFirstChild = (vnode) => {
  if (vnode_isTextVNode(vnode)) {
    return null;
  }
  let vFirstChild = vnode[type.ElementVNodeProps.firstChild];
  if (vFirstChild === void 0) {
    vFirstChild = vnode;
  }
  return vFirstChild;
};
const vnode_isMaterialized = (vNode) => {
  const flag = vNode[type.VNodeProps.flags];
  return (flag & type.VNodeFlags.Element) === type.VNodeFlags.Element && vNode[type.ElementVNodeProps.firstChild] !== void 0 && vNode[type.ElementVNodeProps.lastChild] !== void 0;
};
const vnode_getNextSibling = (vnode) => {
  return vnode[type.VNodeProps.nextSibling];
};
const vnode_getPropStartIndex = (vnode) => {
  const type$1 = vnode[type.VNodeProps.flags] & type.VNodeFlags.TYPE_MASK;
  if (type$1 === type.VNodeFlags.Element) {
    return type.ElementVNodeProps.PROPS_OFFSET;
  } else if (type$1 === type.VNodeFlags.Virtual) {
    return type.VirtualVNodeProps.PROPS_OFFSET;
  }
  throw type$1;
};
const vnode_getProps = (vnode) => {
  return vnode[vnode_getPropStartIndex(vnode)];
};
const mapApp_findIndx = (array, key, start) => {
  let bottom = start >> 1;
  let top = array.length - 2 >> 1;
  while (bottom <= top) {
    const mid = bottom + (top - bottom >> 1);
    const midKey = array[mid << 1];
    if (midKey === key) {
      return mid << 1;
    }
    if (midKey < key) {
      bottom = mid + 1;
    } else {
      top = mid - 1;
    }
  }
  return bottom << 1 ^ -1;
};
const mapArray_set = (array, key, value, start) => {
  const indx = mapApp_findIndx(array, key, start);
  if (indx >= 0) {
    if (value == null) {
      array.splice(indx, 2);
    } else {
      array[indx + 1] = value;
    }
  } else if (value != null) {
    array.splice(indx ^ -1, 0, key, value);
  }
};
const vnode_ensureElementInflated = (vnode) => {
  const flags = vnode[type.VNodeProps.flags];
  if ((flags & type.VNodeFlags.INFLATED_TYPE_MASK) === type.VNodeFlags.Element) {
    const elementVNode = vnode;
    elementVNode[type.VNodeProps.flags] ^= type.VNodeFlags.Inflated;
    const element = elementVNode[type.ElementVNodeProps.element];
    const attributes = element.attributes;
    const props = vnode_getProps(elementVNode);
    for (let idx = 0; idx < attributes.length; idx++) {
      const attr = attributes[idx];
      const key = attr.name;
      if (key === type.Q_PROPS_SEPARATOR || !key) {
        break;
      } else if (key.startsWith(type.QContainerAttr)) {
        if (attr.value === type.QContainerValue.TEXT && "value" in element) {
          mapArray_set(props, "value", element.value, 0);
        }
      } else if (!key.startsWith("on:")) {
        const value = attr.value;
        mapArray_set(props, key, value, 0);
      }
    }
  }
};
const vnode_getAttrKeys = (vnode) => {
  const type$1 = vnode[type.VNodeProps.flags];
  if ((type$1 & type.VNodeFlags.ELEMENT_OR_VIRTUAL_MASK) !== 0) {
    vnode_ensureElementInflated(vnode);
    const keys = [];
    const props = vnode_getProps(vnode);
    for (let i = 0; i < props.length; i = i + 2) {
      const key = props[i];
      if (!key.startsWith(type.Q_PROPS_SEPARATOR)) {
        keys.push(key);
      }
    }
    return keys;
  }
  return [];
};
const mapArray_get = (array, key, start) => {
  const indx = mapApp_findIndx(array, key, start);
  if (indx >= 0) {
    return array[indx + 1];
  } else {
    return null;
  }
};
const vnode_getAttr = (vnode, key) => {
  const type$1 = vnode[type.VNodeProps.flags];
  if ((type$1 & type.VNodeFlags.ELEMENT_OR_VIRTUAL_MASK) !== 0) {
    vnode_ensureElementInflated(vnode);
    const props = vnode_getProps(vnode);
    return mapArray_get(props, key, 0);
  }
  return null;
};
function normalizeName(str) {
  const array = str.split("_");
  if (array.length > 0) {
    const componentName = array[0];
    return componentName.charAt(0).toUpperCase() + componentName.slice(1).toLowerCase();
  } else {
    return "";
  }
}
function removeNodeFromTree(tree, callback) {
  return tree.filter((node) => {
    if (callback(node)) {
      return false;
    }
    if (node.children && node.children.length > 0) {
      node.children = removeNodeFromTree(node.children, callback);
    }
    return true;
  });
}
exports.mapApp_findIndx = mapApp_findIndx;
exports.mapArray_get = mapArray_get;
exports.mapArray_set = mapArray_set;
exports.normalizeName = normalizeName;
exports.removeNodeFromTree = removeNodeFromTree;
exports.vnode_ensureElementInflated = vnode_ensureElementInflated;
exports.vnode_getAttr = vnode_getAttr;
exports.vnode_getAttrKeys = vnode_getAttrKeys;
exports.vnode_getFirstChild = vnode_getFirstChild;
exports.vnode_getNextSibling = vnode_getNextSibling;
exports.vnode_getPropStartIndex = vnode_getPropStartIndex;
exports.vnode_getProps = vnode_getProps;
exports.vnode_isMaterialized = vnode_isMaterialized;
exports.vnode_isTextVNode = vnode_isTextVNode;
exports.vnode_isVirtualVNode = vnode_isVirtualVNode;

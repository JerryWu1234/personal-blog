import { VNodeProps, VNodeFlags, ElementVNodeProps, Q_PROPS_SEPARATOR, VirtualVNodeProps, QContainerAttr, QContainerValue } from "./type.qwik.mjs";
const vnode_isTextVNode = (vNode) => {
  const flag = vNode[VNodeProps.flags];
  return (flag & VNodeFlags.Text) === VNodeFlags.Text;
};
const vnode_isVirtualVNode = (vNode) => {
  const flag = vNode[VNodeProps.flags];
  return (flag & VNodeFlags.Virtual) === VNodeFlags.Virtual;
};
const vnode_getFirstChild = (vnode) => {
  if (vnode_isTextVNode(vnode)) {
    return null;
  }
  let vFirstChild = vnode[ElementVNodeProps.firstChild];
  if (vFirstChild === void 0) {
    vFirstChild = vnode;
  }
  return vFirstChild;
};
const vnode_isMaterialized = (vNode) => {
  const flag = vNode[VNodeProps.flags];
  return (flag & VNodeFlags.Element) === VNodeFlags.Element && vNode[ElementVNodeProps.firstChild] !== void 0 && vNode[ElementVNodeProps.lastChild] !== void 0;
};
const vnode_getNextSibling = (vnode) => {
  return vnode[VNodeProps.nextSibling];
};
const vnode_getPropStartIndex = (vnode) => {
  const type = vnode[VNodeProps.flags] & VNodeFlags.TYPE_MASK;
  if (type === VNodeFlags.Element) {
    return ElementVNodeProps.PROPS_OFFSET;
  } else if (type === VNodeFlags.Virtual) {
    return VirtualVNodeProps.PROPS_OFFSET;
  }
  throw type;
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
  const flags = vnode[VNodeProps.flags];
  if ((flags & VNodeFlags.INFLATED_TYPE_MASK) === VNodeFlags.Element) {
    const elementVNode = vnode;
    elementVNode[VNodeProps.flags] ^= VNodeFlags.Inflated;
    const element = elementVNode[ElementVNodeProps.element];
    const attributes = element.attributes;
    const props = vnode_getProps(elementVNode);
    for (let idx = 0; idx < attributes.length; idx++) {
      const attr = attributes[idx];
      const key = attr.name;
      if (key === Q_PROPS_SEPARATOR || !key) {
        break;
      } else if (key.startsWith(QContainerAttr)) {
        if (attr.value === QContainerValue.TEXT && "value" in element) {
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
  const type = vnode[VNodeProps.flags];
  if ((type & VNodeFlags.ELEMENT_OR_VIRTUAL_MASK) !== 0) {
    vnode_ensureElementInflated(vnode);
    const keys = [];
    const props = vnode_getProps(vnode);
    for (let i = 0; i < props.length; i = i + 2) {
      const key = props[i];
      if (!key.startsWith(Q_PROPS_SEPARATOR)) {
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
  const type = vnode[VNodeProps.flags];
  if ((type & VNodeFlags.ELEMENT_OR_VIRTUAL_MASK) !== 0) {
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
export {
  mapApp_findIndx,
  mapArray_get,
  mapArray_set,
  normalizeName,
  removeNodeFromTree,
  vnode_ensureElementInflated,
  vnode_getAttr,
  vnode_getAttrKeys,
  vnode_getFirstChild,
  vnode_getNextSibling,
  vnode_getPropStartIndex,
  vnode_getProps,
  vnode_isMaterialized,
  vnode_isTextVNode,
  vnode_isVirtualVNode
};

import "@qwik.dev/core";
const QSEQ = "q:seq";
let nodeIdCounter = 0;
const objectToTree = (obj, parentPath = "") => {
  if (!obj || typeof obj !== "object") {
    return [];
  }
  const result = [];
  if (Array.isArray(obj)) {
    return obj.map((item, index) => {
      return createTreeNode(item, `[${index}]`);
    }).filter(Boolean);
  }
  Object.entries(obj).forEach(([key, value]) => {
    const node = createTreeNode(value, key);
    if (node) {
      result.push(node);
    }
  });
  return result;
};
function createTreeNode(value, key, path) {
  const node = createTreeNodeObj(key);
  if (value === null || value === void 0) {
    node.label = `${key}: ${value}`;
    node.elementType = "null";
    return node;
  }
  if (typeof value === "boolean") {
    node.label = `${key}: ${value}`;
    node.elementType = "boolean";
    return node;
  }
  if (typeof value === "number") {
    node.label = `${key}: ${value}`;
    node.elementType = "number";
    return node;
  }
  if (typeof value === "string") {
    node.label = `${key}: "${value}"`;
    node.elementType = "string";
    return node;
  }
  if (typeof value === "function") {
    node.label = `${key}: ƒ()`;
    node.elementType = "function";
    if (value.name) {
      node.label = `${key}: ƒ ${value.name}()`;
    }
    return node;
  }
  if (Array.isArray(value)) {
    node.label = `${key}: Array[${value.length}]`;
    node.elementType = "array";
    node.children = value.map((item, index) => {
      return createTreeNode(item, index.toString());
    }).filter(Boolean);
    return node;
  }
  if (typeof value === "object") {
    if (value.constructor.name !== "Object") {
      node.label = `${key}: Class {${value.constructor.name}}`;
      node.elementType = "object";
    } else {
      const keys = Object.keys(value);
      node.label = `${key}: Object {${keys.length}}`;
      node.elementType = "object";
      node.children = Object.entries(value).map(([childKey, childValue]) => {
        return createTreeNode(childValue, childKey);
      }).filter(Boolean);
    }
    return node;
  }
  return null;
}
const createTreeNodeObj = (label, children = []) => {
  return {
    id: `node-${nodeIdCounter++}`,
    label,
    props: {},
    children
  };
};
export {
  QSEQ,
  createTreeNodeObj,
  objectToTree
};

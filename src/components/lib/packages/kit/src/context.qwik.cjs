"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const shared = require("./shared.qwik.cjs");
const globals = require("./globals.qwik.cjs");
function getViteClientContext() {
  return shared.target[globals.CLIENT_CTX];
}
function setViteClientContext(ctx) {
  shared.target[globals.CLIENT_CTX] = ctx;
}
function getViteClientRpc() {
  return shared.target[globals.CLIENT_RPC];
}
function setViteClientRpc(rpc) {
  shared.target[globals.CLIENT_RPC] = rpc;
}
exports.getViteClientContext = getViteClientContext;
exports.getViteClientRpc = getViteClientRpc;
exports.setViteClientContext = setViteClientContext;
exports.setViteClientRpc = setViteClientRpc;

"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const index$1 = require("../../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.qwik.cjs");
const index = require("../../../node_modules/.pnpm/birpc@0.2.19/node_modules/birpc/dist/index.qwik.cjs");
const constants = require("./constants.qwik.cjs");
const context = require("./context.qwik.cjs");
function createClientRpc(functions) {
  const client = context.getViteClientContext();
  const rpc = index.createBirpc(functions, {
    post: (data) => client.send(constants.DEVTOOLS_VITE_MESSAGING_EVENT, index$1.default.stringify(data)),
    on: (fn) => client.on(constants.DEVTOOLS_VITE_MESSAGING_EVENT, (data) => {
      fn(index$1.default.parse(data));
    }),
    timeout: 12e4
  });
  context.setViteClientRpc(rpc);
}
exports.createClientRpc = createClientRpc;

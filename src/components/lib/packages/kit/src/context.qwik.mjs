import { target } from "./shared.qwik.mjs";
import { CLIENT_CTX, CLIENT_RPC } from "./globals.qwik.mjs";
function getViteClientContext() {
  return target[CLIENT_CTX];
}
function setViteClientContext(ctx) {
  target[CLIENT_CTX] = ctx;
}
function getViteClientRpc() {
  return target[CLIENT_RPC];
}
function setViteClientRpc(rpc) {
  target[CLIENT_RPC] = rpc;
}
export {
  getViteClientContext,
  getViteClientRpc,
  setViteClientContext,
  setViteClientRpc
};

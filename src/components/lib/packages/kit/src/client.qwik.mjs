import SuperJSON from "../../../node_modules/.pnpm/superjson@2.2.2/node_modules/superjson/dist/index.qwik.mjs";
import { createBirpc } from "../../../node_modules/.pnpm/birpc@0.2.19/node_modules/birpc/dist/index.qwik.mjs";
import { DEVTOOLS_VITE_MESSAGING_EVENT } from "./constants.qwik.mjs";
import { setViteClientRpc, getViteClientContext } from "./context.qwik.mjs";
function createClientRpc(functions) {
  const client = getViteClientContext();
  const rpc = createBirpc(functions, {
    post: (data) => client.send(DEVTOOLS_VITE_MESSAGING_EVENT, SuperJSON.stringify(data)),
    on: (fn) => client.on(DEVTOOLS_VITE_MESSAGING_EVENT, (data) => {
      fn(SuperJSON.parse(data));
    }),
    timeout: 12e4
  });
  setViteClientRpc(rpc);
}
export {
  createClientRpc
};

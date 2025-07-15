import "@qwik.dev/core";
import { isServer, _getDomContainer } from "@qwik.dev/core/internal";
function htmlContainer() {
  if (isServer) return;
  const htmlElement = document.documentElement;
  return _getDomContainer(htmlElement);
}
export {
  htmlContainer
};

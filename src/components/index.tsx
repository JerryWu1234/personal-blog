import { component$} from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { ModalExample } from "~/components/modal/modal-example";

export default component$(() => {
  return (
    <>
      <h1>Hi 👋</h1>
      <div>
        Can't wait to see what you build with qwik!
        <br />
        Happy coding.
        <ModalExample />
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};

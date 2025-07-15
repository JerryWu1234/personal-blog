import { component$ } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";
import { ModalExample } from "~/components/modal/modal-example";

export default component$(() => {
  return (
    <div>
      <h1>模态组件测试</h1>
      <ModalExample />
    </div>
  );
});

export const head: DocumentHead = {
  title: "模态组件测试",
  meta: [
    {
      name: "description",
      content: "测试模态组件功能",
    },
  ],
}; 
import { component$, useSignal, $ } from "@qwik.dev/core";
import { Modal } from "./modal";

export const ModalExample = component$(() => {
  const isModalOpen = useSignal(false);

  const openModal = $(() => {
    isModalOpen.value = true;
  });

  const closeModal = $(() => {
    isModalOpen.value = false;
  });

  return (
    <div>
      <button onClick$={openModal}>
        打开模态
      </button>

      <Modal
        isOpen={isModalOpen.value}
        onClose={closeModal}
        title="示例模态"
        closeOnOverlayClick={true}
        closeOnEscape={true}
      >
        <div>
          <p>这是模态的内容。</p>
          <p>你可以在这里放置任何内容。</p>
          <button onClick$={closeModal}>
            关闭模态
          </button>
        </div>
      </Modal>
    </div>
  );
}); 
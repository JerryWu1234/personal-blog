import { component$, useSignal, $, useOnWindow, useStore, useVisibleTask$, QRL } from "@qwik.dev/core";
import { isStore } from "@qwik.dev/core/optimizer";

export interface ModalProps {
  isOpen: boolean;
  onClose: QRL<() => void>;
  title?: string;
  children?: any;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export const Modal = component$((props: ModalProps) => {
  const { isOpen, title, children, closeOnOverlayClick = true, closeOnEscape = true } = props;
  const store = useStore({const: 1})
  const pureStore = {
    const: 1
  }
  console.log(isStore(store))
  console.log(isStore(pureStore))

  useVisibleTask$(() => {
    console.log(isStore(store))
    console.log(isStore(pureStore))
  }) 

  const modalRef = useSignal<HTMLDivElement>();
  
  // 将onClose包装在$()中以便在事件处理程序中使用

  // 处理ESC键关闭模态
  useOnWindow(
    'keydown',
    $((event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape' && isOpen) {
        props.onClose();
      }
    })
  );

  // 处理点击遮罩层关闭模态
  const handleOverlayClick = $((event: MouseEvent) => {
    if (!closeOnOverlayClick) return;
    
    const target = event.target as HTMLElement;
    if (target === modalRef.value) {
      closeModal();
    }
  });

  // 阻止模态内容区域的点击事件冒泡
  const handleContentClick = $((event: MouseEvent) => {
    event.stopPropagation();
  });

  // 处理关闭按钮点击
  const handleCloseClick = $(() => {
    closeModal();
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={modalRef}
      onClick$={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* 遮罩层 */}
      <div>
        {/* 模态内容 */}
        <div onClick$={handleContentClick}>
          {/* 模态头部 */}
          {title && (
            <div>
              <h2 id="modal-title">{title}</h2>
              <button
                type="button"
                onClick$={handleCloseClick}
                aria-label="关闭模态"
              >
                ×
              </button>
            </div>
          )}
          
          {/* 模态主体内容 */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}); 
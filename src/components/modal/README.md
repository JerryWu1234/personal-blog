# 模态组件 (Modal Component)

这是一个可重用的模态组件，专为Qwik框架设计。该组件不包含任何CSS样式，你可以根据需要自定义样式。

## 功能特性

- ✅ 可控制显示/隐藏
- ✅ 点击遮罩层关闭（可配置）
- ✅ 关闭按钮
- ✅ 无障碍访问支持
- ✅ 事件冒泡控制
- ✅ 无CSS依赖，完全可自定义

## 使用方法

### 基本用法

```tsx
import { component$, useSignal, $ } from "@qwik.dev/core";
import { Modal } from "./modal";

export const MyComponent = component$(() => {
  const isModalOpen = useSignal(false);

  const openModal = $(() => {
    isModalOpen.value = true;
  });

  const closeModal = $(() => {
    isModalOpen.value = false;
  });

  return (
    <div>
      <button onClick$={openModal}>打开模态</button>
      
      <Modal
        isOpen={isModalOpen.value}
        onClose={closeModal}
        title="我的模态"
      >
        <p>这是模态的内容</p>
        <button onClick$={closeModal}>关闭</button>
      </Modal>
    </div>
  );
});
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `isOpen` | `boolean` | - | 控制模态是否显示 |
| `onClose` | `() => void` | - | 关闭模态的回调函数 |
| `title` | `string` | `undefined` | 模态标题（可选） |
| `children` | `any` | - | 模态内容 |
| `closeOnOverlayClick` | `boolean` | `true` | 是否允许点击遮罩层关闭 |
| `closeOnEscape` | `boolean` | `true` | 是否允许按ESC键关闭 |

## 自定义样式

由于组件不包含任何CSS样式，你需要自己添加样式。以下是一个基本的样式示例：

```css
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 模态内容 */
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

/* 模态头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 关闭按钮 */
.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 注意事项

1. 确保在组件中正确使用 `$()` 包装函数
2. 模态组件会自动处理事件冒泡
3. 组件支持无障碍访问，包含适当的ARIA属性
4. 可以根据需要添加更多功能，如动画、焦点管理等

## 示例

查看 `modal-example.tsx` 文件获取完整的使用示例。 
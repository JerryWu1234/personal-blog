import { useSignal, $ } from "@qwik.dev/core";
const useDebouncer = (fn, delay) => {
  const timeoutId = useSignal();
  return $((...args) => {
    window.clearTimeout(timeoutId.value);
    timeoutId.value = window.setTimeout(() => {
      fn(...args);
    }, delay);
  });
};
export {
  useDebouncer
};

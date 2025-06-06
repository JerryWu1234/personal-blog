import {
  component$,
  useStore,
  noSerialize,
  useStyles$,
  useSignal,
  useTask$,
  isBrowser,
} from '@qwik.dev/core';


import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { ThemeScript } from './components/ThemeToggle/theme-script';


export const QwikDevtools = component$(() => {
  return (
    <>
      <ThemeScript />
      <div class="mt-auto">
        <ThemeToggle />
      </div>
    </>
  );
});

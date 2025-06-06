import {
  component$,
  createSignal,
  Signal,
  event$,
  isServer,
} from '@qwik.dev/core';
import {
  HiSunOutline,
  HiMoonOutline,
  HiStopCircleOutline,
} from '@qwikest/icons/heroicons';

type ThemeName = 'dark' | 'light' | 'auto';

export const getTheme = (): ThemeName => {
  if (isServer) {
    return 'auto';
  }
  let theme;
  try {
    theme = localStorage.getItem("themeStorageKey");
  } catch {
    //
  }
  if (theme) {
    return theme as ThemeName;
  } else {
    // should be 'auto' when no theme is set
    return 'auto';
  }
};

let currentThemeSignal: Signal<ThemeName>;
export const getThemeSignal = () => {
  if (isServer) {
    throw new Error('getThemeSignal is only available in the browser');
  }
  if (!currentThemeSignal) {
    currentThemeSignal = createSignal(getTheme());
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        currentThemeSignal.value = getTheme();
      });
  }
  return currentThemeSignal;
};

export const setTheme = (theme: ThemeName) => {
  if (theme === 'auto') {
    document.firstElementChild?.removeAttribute('data-theme');
  } else {
    document.firstElementChild?.setAttribute('data-theme', theme!);
  }

  localStorage.setItem("themeStorageKey", theme);

  if (currentThemeSignal) {
    currentThemeSignal.value = theme;
  }
};

export const ThemeToggle = component$(() => {
  const themeValue = createSignal(getTheme());
  const onClick$ = event$(() => {
    let newTheme = getTheme();
    if (newTheme === 'dark') {
      newTheme = 'light';
      setTheme(newTheme);
    } else if (newTheme === 'light') {
      newTheme = 'auto';
      setTheme(newTheme);
    } else {
      newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'light'
        : 'dark';
      setTheme(newTheme);
    }
    themeValue.value = newTheme;
  });

  return (
    <>
      <button
        onClick$={onClick$}
        class="group flex h-8 w-8 items-center justify-center rounded-md bg-background text-foreground hover:opacity-60"
      >

          {themeValue.value === 'light' && (
            <HiSunOutline class="animate-in zoom-in-50 h-5 w-5 duration-300 ease-out" />
          )}
          {themeValue.value === 'dark' && (
            <HiMoonOutline class="animate-in zoom-in-50 h-5 w-5 duration-300 ease-out" />
          )}
          {themeValue.value === 'auto' && (
            <HiStopCircleOutline class="animate-in zoom-in-50 h-5 w-5 duration-300 ease-out" />
          )}
      </button>
    </>
  );
});

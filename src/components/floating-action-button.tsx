import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';

export const FloatingActionButton = component$(() => {
  const isVisible = useSignal(false);

  useVisibleTask$(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        isVisible.value = true;
      } else {
        isVisible.value = false;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <button 
      onClick$={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }} 
      class={`floating-action-button ${isVisible.value ? 'visible' : ''}`}
      aria-label="Scroll to top"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M18 15l-6-6-6 6"/>
      </svg>
    </button>
  );
});

export default FloatingActionButton;
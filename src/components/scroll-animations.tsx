import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';

export const ScrollAnimations = component$(() => {
  const initialized = useSignal(false);

  useVisibleTask$(() => {
    if (initialized.value) return;
    initialized.value = true;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    
    // Observe all elements with reveal classes
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  });

  return null;
});

export default ScrollAnimations;
import { component$, useVisibleTask$, useSignal } from '@qwik.dev/core';
import type { Container, Engine } from 'tsparticles-slim';
import { loadSlim } from 'tsparticles-slim';

export const ParticleBackground = component$(() => {
  const containerRef = useSignal<HTMLDivElement>();
  const initialized = useSignal(false);

  useVisibleTask$(async () => {
    if (initialized.value || !containerRef.value) return;
    initialized.value = true;

    try {
      await loadSlim(async (engine: Engine) => {
        // Initialize tsParticles
        await engine.init();
      });

      // Load the particles configuration
      const particles: Container | undefined = await (window as any).tsParticles.load(
        'tsparticles',
        {
          fullScreen: { enable: false },
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: ['#6366f1', '#f43f5e', '#10b981'],
            },
            links: {
              color: '#c7d2fe',
              distance: 150,
              enable: true,
              opacity: 0.3,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: true,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }
      );
    } catch (error) {
      console.error('Error initializing particles:', error);
    }
  });

  return (
    <div
      ref={containerRef}
      id="tsparticles"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
});

export default ParticleBackground;
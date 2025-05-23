import { component$, Slot } from "@qwik.dev/core";
import type { RequestHandler } from "@qwik.dev/router";

import { Link } from '@builder.io/qwik-city';
import ScrollAnimations from '~/components/scroll-animations';

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

export default component$(() => {
  return (
    <>
      <ScrollAnimations />
      <header class="fade-in">
        <nav>
          <Link href="/" class="nav-link">Home</Link>
          <Link href="/blog" class="nav-link">Blog</Link>
          <Link href="/projects" class="nav-link">Projects</Link>
          <Link href="/about" class="nav-link">About</Link>
        </nav>
      </header>
      <main>
        <Slot />
      </main>
      <footer class="fade-in">
        <p>Jerry Wu's Personal Site &copy; {new Date().getFullYear()}</p>
        <div class="footer-links">
          <a href="https://github.com/JerryWu1234" target="_blank" rel="noopener noreferrer" class="hover-scale">GitHub</a>
          <span>•</span>
          <a href="https://twitter.com/JerryWu" target="_blank" rel="noopener noreferrer" class="hover-scale">Twitter</a>
          <span>•</span>
          <a href="https://linkedin.com/in/jerrywu" target="_blank" rel="noopener noreferrer" class="hover-scale">LinkedIn</a>
        </div>
        <p class="built-with">Built with <a href="https://qwik.dev/" target="_blank" rel="noopener noreferrer" class="hover-scale">Qwik</a></p>
      </footer>
    </>
  );
});

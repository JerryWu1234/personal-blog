import { component$, Slot } from "@qwik.dev/core";
import type { RequestHandler } from "@qwik.dev/router";

import { Link } from '@builder.io/qwik-city';
import ScrollAnimations from '~/components/scroll-animations';
import ThemeToggle from '~/components/theme-toggle';
import FloatingActionButton from '~/components/floating-action-button';

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
      <ThemeToggle />
      <header class="fade-in">
        <div class="logo">
          <Link href="/">JW</Link>
        </div>
        <nav>
          <Link href="/" class="nav-link">Home</Link>
          <Link href="/blog" class="nav-link">Blog</Link>
          <Link href="/projects" class="nav-link">Projects</Link>
          <Link href="/about" class="nav-link">About</Link>
          <Link href="/contact" class="nav-link">Contact</Link>
        </nav>
      </header>
      <main>
        <Slot />
      </main>
      <footer class="fade-in">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Jerry Wu</h3>
            <p>Frontend Developer & JavaScript Enthusiast</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Connect</h3>
            <div class="footer-social">
              <a href="https://github.com/JerryWu1234" target="_blank" rel="noopener noreferrer" class="hover-scale">GitHub</a>
              <a href="https://twitter.com/JerryWu" target="_blank" rel="noopener noreferrer" class="hover-scale">Twitter</a>
              <a href="https://linkedin.com/in/jerrywu" target="_blank" rel="noopener noreferrer" class="hover-scale">LinkedIn</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Jerry Wu's Personal Site. All rights reserved.</p>
          <p class="built-with">Built with <a href="https://qwik.dev/" target="_blank" rel="noopener noreferrer" class="hover-scale">Qwik</a></p>
        </div>
      </footer>
      <FloatingActionButton />
    </>
  );
});

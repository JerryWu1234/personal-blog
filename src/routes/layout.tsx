import { component$, Slot } from "@qwik.dev/core";
import type { RequestHandler } from "@qwik.dev/router";

import { Link } from '@builder.io/qwik-city';

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
      {/* Inline styles for background-color, padding, and margin-bottom were removed 
          as they are now handled by src/global.css using attribute selectors 
          to target this specific header.
      */}
      <header>
        {/* Inline styles for display, gap, and justify-content were removed 
            as they are now handled by src/global.css.
        */}
        <nav>
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
        </nav>
      </header>
      {/* Inline style for padding was removed, handled by global main style */}
      <main>
        <Slot />
      </main>
      {/* Inline styles for text-align, padding, margin-top, and border-top were removed
          as they are now handled by src/global.css using attribute selectors
          to target this specific footer.
      */}
      <footer>
        <p>Jerry's Personal Site &copy; {new Date().getFullYear()}</p>
        {/* Optional: Builder.io attribution. The global CSS has a style for 'footer a' if this is uncommented. */}
        {/* 
        <a href="https://www.builder.io/" target="_blank" rel="noopener noreferrer">
          Made with ♡ by Builder.io
        </a> 
        */}
      </footer>
    </>
  );
});

import { component$ } from '@builder.io/qwik';
import { routeLoader$, Link, useLocation } from '@builder.io/qwik-city';
import { getPostBySlug, type PostData } from '../../../lib/markdown'; // Adjusted path

export const usePost = routeLoader$<PostData | null>(async (requestEv) => {
  // The 'slug' parameter is automatically available in requestEv.params
  const slug = requestEv.params.slug;
  if (!slug) {
    // This case should ideally not happen if routing is set up correctly
    // but it's good to handle it.
    // You could throw an error here or return null.
    // If you throw an error, Qwik's error handling would take over.
    // For now, returning null, which will be handled by the component.
    console.warn('Slug not found in requestEv.params');
    return null; 
  }
  return await getPostBySlug(slug);
});

export default component$(() => {
  const postSignal = usePost();
  const post = postSignal.value;
  const location = useLocation(); // To get the current path for "post not found" scenario

  if (!post) {
    return (
      <main>
        <h1>Post not found</h1>
        <p>Sorry, we couldn't find the post at <code>{location.url.pathname}</code>.</p>
        <p>
          <Link href="/blog/">Back to Blog List</Link>
        </p>
      </main>
    );
  }

  // Format the date for better readability
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Handle tags, whether it's a string or an array of strings
  let tagsDisplay: string | null = null;
  if (post.frontmatter.tags) {
    if (Array.isArray(post.frontmatter.tags)) {
      tagsDisplay = post.frontmatter.tags.join(', ');
    } else {
      tagsDisplay = post.frontmatter.tags;
    }
  }

  return (
    <main>
      <article>
        <header>
          <h1>{post.frontmatter.title}</h1>
          <p>Published on: {formattedDate}</p>
          {/* Inline style removed, covered by 'article header p[style*="font-style: italic"]' or general 'article header p' in global.css */}
          {tagsDisplay && <p class="tags">Tags: {tagsDisplay}</p>}
        </header>
        {/* Inline style removed, covered by global 'hr' style */}
        <hr />
        <div dangerouslySetInnerHTML={post.html} /> 
        {/* 
          NOTE: dangerouslySetInnerHTML is used here because post.html is pre-rendered HTML from Markdown.
          The `marked` library, by default, does sanitize input, but always be cautious when 
          the source of the Markdown is not fully trusted. For this project, we trust our own Markdown files.
        */}
        {/* Inline style removed, covered by global 'article footer' style */}
        <footer>
          <Link href="/blog/">Back to Blog List</Link>
        </footer>
      </article>
    </main>
  );
});

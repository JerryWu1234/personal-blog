import { component$ } from '@builder.io/qwik';
import { routeLoader$, Link } from '@builder.io/qwik-city';
import { getAllPosts, type PostData } from '../../lib/markdown'; // Adjusted path

export const usePosts = routeLoader$<PostData[]>(async () => {
  return await getAllPosts();
});

export default component$(() => {
  const postsSignal = usePosts();
  const posts = postsSignal.value;

  return (
    <main>
      <h1>Blog</h1>
      {posts.length === 0 ? (
        <p>No blog posts yet. Stay tuned!</p>
      ) : (
        <ul class="post-list"> {/* Added class for ul if specific ul styling is needed, global ul style already removes list-style and padding */}
          {posts.map((post) => (
            <li key={post.slug} class="list-item"> {/* Replaced inline style with class */}
              <h2>
                <Link href={`/blog/${post.slug}/`}>{post.frontmatter.title}</Link>
              </h2>
              {/* Inline style for date paragraph removed, covered by 'article header p' or a more specific rule if needed */}
              <p>{/* Date style is handled by global CSS under article context, or can be a specific class */}
                Published on: {new Date(post.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
});

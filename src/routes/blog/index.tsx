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
      <h1 class="slide-up">Blog</h1>
      {posts.length === 0 ? (
        <p class="fade-in">No blog posts yet. Stay tuned!</p>
      ) : (
        <ul class="post-list">
          {posts.map((post, index) => (
            <li key={post.slug} class="list-item card stagger-item hover-lift" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
              <h2>
                <Link href={`/blog/${post.slug}/`} class="hover-scale">{post.frontmatter.title}</Link>
              </h2>
              <p>
                Published on: {new Date(post.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
});

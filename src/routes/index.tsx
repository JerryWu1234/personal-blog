import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <main>
      <h1>Jerry</h1>
      <p>Frontend developer with 10 years of experience.</p>
      <nav>
        <h2>Links</h2>
        <ul>
          <li>
            <a href="https://github.com/Jerry_wu" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
          <li>
            <a href="mailto:409187100@qq.com">Email</a>
          </li>
        </ul>
      </nav>
    </main>
  );
});

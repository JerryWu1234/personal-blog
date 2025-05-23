import { component$ } from '@builder.io/qwik';

export default component$(() => {
  return (
    <main>
      <section class="hero fade-in">
        <h1 class="slide-up">Jerry Wu</h1>
        <p class="tagline slide-up" style={{ animationDelay: '0.2s' }}>Frontend Developer & JavaScript Enthusiast</p>
        <p class="slide-up" style={{ animationDelay: '0.4s' }}>With 10+ years of experience building modern web applications with a focus on performance and user experience.</p>
      </section>

      <section class="featured-content reveal">
        <h2>What I Do</h2>
        <div class="skills-container">
          <div class="skill-card hover-lift reveal-left" style={{ animationDelay: '0.1s' }}>
            <h3>Frontend Development</h3>
            <p>Building responsive, accessible, and performant user interfaces with modern JavaScript frameworks.</p>
          </div>
          <div class="skill-card hover-lift reveal" style={{ animationDelay: '0.3s' }}>
            <h3>Performance Optimization</h3>
            <p>Analyzing and improving web application performance for better user experience.</p>
          </div>
          <div class="skill-card hover-lift reveal-right" style={{ animationDelay: '0.5s' }}>
            <h3>Technical Writing</h3>
            <p>Sharing knowledge through blog posts about JavaScript, frameworks, and web development best practices.</p>
          </div>
        </div>
      </section>

      <section class="social-links reveal">
        <h2>Connect With Me</h2>
        <ul class="social-list">
          <li class="stagger-item">
            <a href="https://github.com/JerryWu1234" target="_blank" rel="noopener noreferrer" class="hover-scale">
              GitHub
            </a>
          </li>
          <li class="stagger-item">
            <a href="https://twitter.com/JerryWu" target="_blank" rel="noopener noreferrer" class="hover-scale">
              Twitter
            </a>
          </li>
          <li class="stagger-item">
            <a href="https://linkedin.com/in/jerrywu" target="_blank" rel="noopener noreferrer" class="hover-scale">
              LinkedIn
            </a>
          </li>
          <li class="stagger-item">
            <a href="mailto:409187100@qq.com" class="hover-scale">
              Email
            </a>
          </li>
        </ul>
      </section>

      <section class="cta reveal">
        <h2>Latest Articles</h2>
        <p>Check out my latest articles on web development and JavaScript.</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/blog" class="btn btn-primary btn-shine">View Blog Posts</a>
        </div>
      </section>
    </main>
  );
});

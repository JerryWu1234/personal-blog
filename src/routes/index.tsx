import { component$ } from '@qwik.dev/core';
import { Link } from '@builder.io/qwik-city';
import ParticleBackground from '~/components/particle-background';
import Skills from '~/components/skills';
import Testimonials from '~/components/testimonials';

export default component$(() => {
  const skills = [
    { name: 'JavaScript', level: 95, color: '#f7df1e' },
    { name: 'React', level: 90, color: '#61dafb' },
    { name: 'Vue.js', level: 85, color: '#42b883' },
    { name: 'TypeScript', level: 88, color: '#3178c6' },
    { name: 'Node.js', level: 80, color: '#68a063' },
    { name: 'CSS/SCSS', level: 92, color: '#264de4' },
  ];

  const testimonials = [
    {
      text: "Jerry is an exceptional frontend developer who consistently delivers high-quality code. His attention to detail and problem-solving skills make him a valuable asset to any team.",
      author: "Sarah Johnson",
      position: "CTO",
      company: "TechInnovate"
    },
    {
      text: "Working with Jerry was a pleasure. He has a deep understanding of modern web technologies and always finds elegant solutions to complex problems.",
      author: "Michael Chen",
      position: "Lead Developer",
      company: "WebSolutions"
    },
    {
      text: "Jerry's expertise in performance optimization transformed our application. Load times decreased by 40% after implementing his recommendations.",
      author: "Emily Rodriguez",
      position: "Product Manager",
      company: "AppWorks"
    }
  ];

  return (
    <>
      <div class="hero-container">
        <ParticleBackground />
        <section class="hero fade-in">
          <h1 class="slide-up">Jerry Wu</h1>
          <p class="tagline slide-up" style={{ animationDelay: '0.2s' }}>Frontend Developer & JavaScript Enthusiast</p>
          <p class="slide-up" style={{ animationDelay: '0.4s' }}>With 10+ years of experience building modern web applications with a focus on performance and user experience.</p>
          <div class="hero-buttons slide-up" style={{ animationDelay: '0.6s' }}>
            <Link href="/projects" class="btn btn-primary btn-shine">View My Work</Link>
            <Link href="/contact" class="btn btn-outline">Get In Touch</Link>
          </div>
        </section>
      </div>

      <section class="about-section reveal">
        <div class="section-header">
          <h2>About Me</h2>
          <div class="section-divider"></div>
        </div>
        <div class="about-content">
          <div class="about-text reveal-left">
            <p>I'm a passionate frontend developer with a strong focus on creating fast, responsive, and user-friendly web applications. With over a decade of experience in the industry, I've worked with a wide range of technologies and frameworks.</p>
            <p>My approach combines technical expertise with creative problem-solving to deliver solutions that not only meet but exceed client expectations. I believe in writing clean, maintainable code and staying up-to-date with the latest industry trends.</p>
            <Link href="/about" class="btn btn-text">Learn more about me <span class="arrow">→</span></Link>
          </div>
          <div class="about-skills reveal-right">
            <h3>My Skills</h3>
            <Skills skills={skills} />
          </div>
        </div>
      </section>

      <section class="services-section reveal">
        <div class="section-header">
          <h2>What I Do</h2>
          <div class="section-divider"></div>
        </div>
        <div class="services-grid">
          <div class="service-card hover-lift reveal-left" style={{ animationDelay: '0.1s' }}>
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <h3>Frontend Development</h3>
            <p>Building responsive, accessible, and performant user interfaces with modern JavaScript frameworks like React, Vue, and Angular.</p>
          </div>
          <div class="service-card hover-lift reveal" style={{ animationDelay: '0.3s' }}>
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
              </svg>
            </div>
            <h3>Performance Optimization</h3>
            <p>Analyzing and improving web application performance for better user experience, faster load times, and improved SEO rankings.</p>
          </div>
          <div class="service-card hover-lift reveal-right" style={{ animationDelay: '0.5s' }}>
            <div class="service-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                <path d="M2 2l7.586 7.586"></path>
                <circle cx="11" cy="11" r="2"></circle>
              </svg>
            </div>
            <h3>Technical Writing</h3>
            <p>Sharing knowledge through blog posts about JavaScript, frameworks, and web development best practices to help others grow.</p>
          </div>
        </div>
      </section>

      <section class="testimonials-section reveal">
        <div class="section-header">
          <h2>What People Say</h2>
          <div class="section-divider"></div>
        </div>
        <Testimonials testimonials={testimonials} />
      </section>

      <section class="latest-posts reveal">
        <div class="section-header">
          <h2>Latest Articles</h2>
          <div class="section-divider"></div>
        </div>
        <p class="section-intro">Check out my latest articles on web development and JavaScript.</p>
        <div class="posts-grid">
          <div class="post-card hover-lift reveal-left">
            <div class="post-date">May 15, 2025</div>
            <h3>Creating Beautiful Animations with CSS</h3>
            <p>Learn how to create smooth, performant animations using modern CSS techniques.</p>
            <Link href="/blog/creating-beautiful-animations-with-css" class="btn btn-text">Read more <span class="arrow">→</span></Link>
          </div>
          <div class="post-card hover-lift reveal">
            <div class="post-date">April 28, 2025</div>
            <h3>Optimizing React Applications</h3>
            <p>Practical tips and techniques for improving the performance of your React applications.</p>
            <Link href="/blog" class="btn btn-text">Read more <span class="arrow">→</span></Link>
          </div>
          <div class="post-card hover-lift reveal-right">
            <div class="post-date">April 10, 2025</div>
            <h3>Introduction to TypeScript</h3>
            <p>A beginner-friendly guide to getting started with TypeScript in your projects.</p>
            <Link href="/blog" class="btn btn-text">Read more <span class="arrow">→</span></Link>
          </div>
        </div>
        <div class="view-all-container reveal">
          <Link href="/blog" class="btn btn-primary btn-shine">View All Articles</Link>
        </div>
      </section>

      <section class="contact-cta reveal">
        <h2>Let's Work Together</h2>
        <p>Have a project in mind? I'd love to hear about it!</p>
        <Link href="/contact" class="btn btn-primary btn-shine">Get In Touch</Link>
      </section>
    </>
  );
});

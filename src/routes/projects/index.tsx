import { component$, useResource$, Resource } from '@qwik.dev/core';
import ProjectCard from '~/components/project-card';

// Define an interface for the project data
interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

// Define our featured projects with more details
interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  demoUrl?: string;
  githubUrl: string;
  featured: boolean;
}

export default component$(() => {
  // Featured projects data
  const featuredProjects: FeaturedProject[] = [
    {
      id: 'project1',
      title: 'E-Commerce Dashboard',
      description: 'A comprehensive dashboard for e-commerce businesses with real-time analytics, inventory management, and sales tracking.',
      tags: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
      demoUrl: 'https://ecommerce-dashboard.example.com',
      githubUrl: 'https://github.com/JerryWu1234/ecommerce-dashboard',
      featured: true
    },
    {
      id: 'project2',
      title: 'Weather App',
      description: 'A beautiful weather application with 7-day forecast, location-based weather data, and interactive maps.',
      tags: ['Vue.js', 'JavaScript', 'OpenWeatherAPI'],
      demoUrl: 'https://weather-app.example.com',
      githubUrl: 'https://github.com/JerryWu1234/weather-app',
      featured: true
    },
    {
      id: 'project3',
      title: 'Task Management System',
      description: 'A collaborative task management system with real-time updates, task assignments, and progress tracking.',
      tags: ['React', 'Redux', 'Firebase', 'SCSS'],
      demoUrl: 'https://task-management.example.com',
      githubUrl: 'https://github.com/JerryWu1234/task-management',
      featured: true
    },
    {
      id: 'project4',
      title: 'Portfolio Template',
      description: 'A customizable portfolio template for developers and designers with multiple themes and sections.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      demoUrl: 'https://portfolio-template.example.com',
      githubUrl: 'https://github.com/JerryWu1234/portfolio-template',
      featured: true
    }
  ];

  // Fetch GitHub repos
  const reposResource = useResource$<GitHubRepo[]>(async () => {
    const controller = new AbortController();

    try {
      const res = await fetch('https://api.github.com/users/JerryWu1234/repos?sort=updated&direction=desc', {
        signal: controller.signal,
        headers: { 
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Qwik-JerryWu-Website' 
        }
      });

      if (!res.ok) {
        let errorBody = '';
        try {
          errorBody = await res.text();
        } catch (e) {
          // Ignore if reading the body fails
        }
        throw new Error(`GitHub API request failed: ${res.status} ${res.statusText}. ${errorBody}`);
      }
      
      const data = await res.json();
      return data as GitHubRepo[];
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      return [];
    }
  });

  return (
    <div class="projects-page">
      <section class="page-header fade-in">
        <h1>My Projects</h1>
        <div class="section-divider"></div>
        <p class="section-intro">Here are some of my recent projects. Each one represents a unique challenge and learning experience.</p>
      </section>

      <section class="featured-projects-section reveal">
        <h2>Featured Projects</h2>
        <div class="featured-projects-grid">
          {featuredProjects.map((project, index) => (
            <div key={project.id} class="project-card-wrapper reveal" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
              <ProjectCard
                project={{
                  title: project.title,
                  description: project.description,
                  image: project.image,
                  tags: project.tags,
                  link: project.demoUrl,
                  github: project.githubUrl
                }}
              />
            </div>
          ))}
        </div>
      </section>

      <section class="github-projects-section reveal">
        <h2>GitHub Projects</h2>
        <p>Below are some of my public projects on GitHub. Feel free to explore and contribute!</p>
        <div class="github-cta">
          <a href="https://github.com/JerryWu1234" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-3d">
            View All Projects on GitHub
          </a>
        </div>
        
        <Resource
          value={reposResource}
          onPending={() => <p class="loading-message fade-in">Fetching projects...</p>}
          onRejected={(error) => <p class="error-message fade-in">Error fetching projects: {error.message}</p>}
          onResolved={(repos) => (
            <>
              {repos.length > 0 ? (
                <div class="github-projects-grid">
                  {repos.slice(0, 6).map((repo, index) => (
                    <div key={repo.id} class="github-project-card hover-lift stagger-item" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                      <h3>
                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" class="hover-scale">
                          {repo.name}
                        </a>
                      </h3>
                      <p class="github-project-description">{repo.description || 'No description available.'}</p>
                      <div class="github-project-meta">
                        {repo.language && <span class="github-project-language">{repo.language}</span>}
                        <span class="github-project-stars">⭐ {repo.stargazers_count}</span>
                        <span class="github-project-forks">🍴 {repo.forks_count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p class="no-projects-message fade-in">No public projects found on GitHub.</p>
              )}
            </>
          )}
        />
      </section>

      <section class="contact-cta reveal">
        <h2>Interested in Working Together?</h2>
        <p>I'm always open to discussing new projects and opportunities.</p>
        <a href="/contact" class="btn btn-primary btn-shine">Get In Touch</a>
      </section>
    </div>
  );
});

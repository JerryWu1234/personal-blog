import { component$ } from '@qwik.dev/core';
import { routeLoader$ } from '@builder.io/qwik-city';
import Timeline, { TimelineItem } from '~/components/timeline';
import Skills from '~/components/skills';

// Define the GitHubRepo interface focusing on the language field
interface GitHubRepo {
  language: string | null;
  id: number;
  name: string;
}

export const useProficientTechnologies = routeLoader$<string[]>(async () => {
  const controller = new AbortController();

  try {
    const res = await fetch('https://api.github.com/users/JerryWu1234/repos', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Qwik-JerryWu-Website-AboutPage'
      }
    });

    if (!res.ok) {
      console.error(`GitHub API request failed: ${res.status} ${res.statusText}`);
      return []; 
    }
    
    const repos = await res.json() as GitHubRepo[];
    const languages = new Set<string>();
    
    if (Array.isArray(repos)) {
      for (const repo of repos) {
        if (repo.language) {
          languages.add(repo.language);
        }
      }
    } else {
      console.warn('GitHub API did not return an array of repositories.');
      return [];
    }
    
    return Array.from(languages).sort();
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return [];
  }
});

export default component$(() => {
  const proficientTechnologiesSignal = useProficientTechnologies();

  const workExperience: TimelineItem[] = [
    {
      title: 'Senior Frontend Developer',
      subtitle: 'Tech Solutions Inc.',
      date: '2020 - Present',
      description: 'Lead the frontend development team in building and maintaining multiple web applications. Implemented performance optimizations that improved load times by 40%. Established coding standards and best practices for the team.'
    },
    {
      title: 'Frontend Developer',
      subtitle: 'Web Innovations',
      date: '2016 - 2020',
      description: 'Developed responsive web applications using React and Vue.js. Collaborated with UX/UI designers to implement pixel-perfect interfaces. Mentored junior developers and conducted code reviews.'
    },
    {
      title: 'Web Developer',
      subtitle: 'Digital Creations',
      date: '2013 - 2016',
      description: 'Built and maintained client websites using HTML, CSS, and JavaScript. Implemented responsive designs and ensured cross-browser compatibility. Worked with backend developers to integrate frontend with APIs.'
    }
  ];

  const education: TimelineItem[] = [
    {
      title: 'Bachelor of Science in Computer Science',
      subtitle: 'University of Technology',
      date: '2009 - 2013',
      description: 'Graduated with honors. Specialized in web development and user interface design.'
    },
    {
      title: 'Advanced Web Development Certification',
      subtitle: 'Frontend Masters',
      date: '2015',
      description: 'Completed intensive training in advanced JavaScript, React, and modern frontend development techniques.'
    }
  ];

  const skills = [
    { name: 'JavaScript', level: 95, color: '#f7df1e' },
    { name: 'React', level: 90, color: '#61dafb' },
    { name: 'Vue.js', level: 85, color: '#42b883' },
    { name: 'TypeScript', level: 88, color: '#3178c6' },
    { name: 'Node.js', level: 80, color: '#68a063' },
    { name: 'CSS/SCSS', level: 92, color: '#264de4' },
    { name: 'HTML5', level: 95, color: '#e34f26' },
    { name: 'GraphQL', level: 75, color: '#e535ab' }
  ];

  return (
    <div class="about-page">
      <section class="page-header fade-in">
        <h1>About Me</h1>
        <div class="section-divider"></div>
      </section>

      <section class="about-intro reveal">
        <div class="about-intro-content">
          <div class="about-image reveal-left">
            <div class="profile-image-placeholder">
              <span>JW</span>
            </div>
          </div>
          <div class="about-text reveal-right">
            <p>I'm Jerry Wu, a passionate frontend developer with over 10 years of experience in the web development industry. I specialize in building high-performance, responsive web applications using modern JavaScript frameworks and libraries.</p>
            <p>Throughout my career, I've worked with various companies ranging from startups to large enterprises, helping them create exceptional user experiences through clean, efficient code and intuitive interfaces.</p>
            <p>My approach to development combines technical expertise with creative problem-solving to deliver solutions that not only meet but exceed client expectations. I believe in writing clean, maintainable code and staying up-to-date with the latest industry trends.</p>
          </div>
        </div>
      </section>

      <section class="skills-section reveal">
        <h2>My Skills</h2>
        <Skills skills={skills} />
      </section>
      
      <section class="experience-section reveal">
        <h2>Work Experience</h2>
        <Timeline items={workExperience} />
      </section>
      
      <section class="education-section reveal">
        <h2>Education</h2>
        <Timeline items={education} />
      </section>
      
      <section class="technologies-section reveal">
        <h2>Technologies I Work With</h2>
        <div class="technologies-grid">
          {(() => {
            const technologies = proficientTechnologiesSignal.value.length > 0 
              ? proficientTechnologiesSignal.value 
              : ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Node.js', 'HTML5', 'CSS3', 'SCSS', 'GraphQL', 'Webpack', 'Git'];

            return technologies.map((tech, index) => (
              <div key={tech} class="technology-item stagger-item hover-scale" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                {tech}
              </div>
            ));
          })()}
        </div>
      </section>
      
      <section class="current-focus-section reveal">
        <h2>Current Focus</h2>
        <p>I'm currently focused on improving performance and developer experience in frontend architectures, especially with server-first frameworks like Qwik and Next.js. I'm also exploring the potential of AI in web development and how it can enhance user experiences.</p>
        <div class="cta-container">
          <a href="/contact" class="btn btn-primary btn-shine">Get In Touch</a>
        </div>
      </section>
    </div>
  );
});

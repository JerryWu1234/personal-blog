import { component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';

// Define the GitHubRepo interface focusing on the language field
interface GitHubRepo {
  language: string | null;
  // Add other fields if needed, but language is key here
  // For consistency with the projects page, let's add a few more
  id: number; // Though not strictly needed for this feature, good for consistency
  name: string; // Also not strictly needed here
}

export const useProficientTechnologies = routeLoader$<string[]>(async () => {
  const controller = new AbortController();

  const res = await fetch('https://api.github.com/users/JerryWu1234/repos', {
    signal: controller.signal,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Qwik-JerryWu-Website-AboutPage'
    }
  });

  if (!res.ok) {
    // In a real app, you might want to log this error or handle it more gracefully
    console.error(`GitHub API request failed: ${res.status} ${res.statusText}`);
    // Return empty array or throw, depending on how you want to handle errors upstream
    // For this page, returning an empty array will lead to the "Could not infer..." message.
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
    // Handle cases where the API might not return an array (e.g. error object that wasn't caught by !res.ok)
    console.warn('GitHub API did not return an array of repositories.');
    return [];
  }
  
  return Array.from(languages).sort(); // Sort for consistent order
});

export default component$(() => {
  const proficientTechnologiesSignal = useProficientTechnologies();

  return (
    <main>
      <h1 class="slide-up">About Me</h1>
      <section class="reveal">
        <h2>Background</h2>
        <p>I'm Jerry Wu, a passionate frontend developer with over 10 years of experience in the web development industry. I specialize in building high-performance, responsive web applications using modern JavaScript frameworks and libraries.</p>
        <p>Throughout my career, I've worked with various companies ranging from startups to large enterprises, helping them create exceptional user experiences through clean, efficient code and intuitive interfaces.</p>
      </section>
      
      <section class="reveal">
        <h2>Work Experience</h2>
        <div class="experience-item card hover-lift reveal-left" style={{ animationDelay: '0.1s' }}>
          <h3>Senior Frontend Developer - Tech Solutions Inc.</h3>
          <p class="date">2020 - Present</p>
          <ul>
            <li class="stagger-item">Lead the frontend development team in building and maintaining multiple web applications</li>
            <li class="stagger-item">Implemented performance optimizations that improved load times by 40%</li>
            <li class="stagger-item">Established coding standards and best practices for the team</li>
          </ul>
        </div>
        
        <div class="experience-item card hover-lift reveal" style={{ animationDelay: '0.3s' }}>
          <h3>Frontend Developer - Web Innovations</h3>
          <p class="date">2016 - 2020</p>
          <ul>
            <li class="stagger-item">Developed responsive web applications using React and Vue.js</li>
            <li class="stagger-item">Collaborated with UX/UI designers to implement pixel-perfect interfaces</li>
            <li class="stagger-item">Mentored junior developers and conducted code reviews</li>
          </ul>
        </div>
        
        <div class="experience-item card hover-lift reveal-right" style={{ animationDelay: '0.5s' }}>
          <h3>Web Developer - Digital Creations</h3>
          <p class="date">2013 - 2016</p>
          <ul>
            <li class="stagger-item">Built and maintained client websites using HTML, CSS, and JavaScript</li>
            <li class="stagger-item">Implemented responsive designs and ensured cross-browser compatibility</li>
            <li class="stagger-item">Worked with backend developers to integrate frontend with APIs</li>
          </ul>
        </div>
      </section>
      
      <section class="reveal">
        <h2>Education</h2>
        <p><strong>Bachelor of Science in Computer Science</strong> - University of Technology, 2013</p>
      </section>
      
      <section class="reveal">
        <h2>Current Focus</h2>
        <p>I'm currently focused on improving performance and developer experience in frontend architectures, especially with server-first frameworks like Qwik and Next.js. I'm also exploring the potential of AI in web development and how it can enhance user experiences.</p>
        <div style={{ marginTop: '1.5rem' }}>
          <a href="mailto:409187100@qq.com" class="btn btn-primary btn-pulse">Contact Me</a>
        </div>
      </section>
      
      <section class="reveal">
        <h2>Proficient Technologies</h2>
        {(() => {
          const technologies = proficientTechnologiesSignal.value;

          if (technologies.length > 0) {
            return (
              <ul>
                {technologies.map((lang, index) => (
                  <li key={lang} class="stagger-item hover-scale" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>{lang}</li>
                ))}
              </ul>
            );
          } else {
            return <p class="fade-in">Primary technologies will be listed here as they appear on public projects, or if GitHub data could not be fetched.</p>;
          }
        })()}
      </section>
    </main>
  );
});

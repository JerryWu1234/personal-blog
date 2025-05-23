import { component$, useResource$, Resource } from '@builder.io/qwik';

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

export default component$(() => {
  const reposResource = useResource$<GitHubRepo[]>(async () => {
    const controller = new AbortController();

    const res = await fetch('https://api.github.com/users/JerryWu1234/repos?sort=updated&direction=desc', {
      signal: controller.signal,
      headers: { 
        'Accept': 'application/vnd.github.v3+json',
        // It's good practice to add a User-Agent header when using the GitHub API
        'User-Agent': 'Qwik-JerryWu-Website' 
      }
    });

    if (!res.ok) {
      // Handle non-OK responses by throwing an error
      // Try to parse the error message from GitHub if available
      let errorBody = '';
      try {
        errorBody = await res.text();
      } catch (e) {
        // Ignore if reading the body fails
      }
      throw new Error(`GitHub API request failed: ${res.status} ${res.statusText}. ${errorBody}`);
    }
    const data = await res.json();
    return data as GitHubRepo[]; // Assuming data is an array of repos
  });

  return (
    <main>
      <h1 class="slide-up">My Projects</h1>
      <div class="reveal" style={{ marginBottom: '2rem' }}>
        <p>Below are some of my public projects on GitHub. Feel free to explore and contribute!</p>
        <a href="https://github.com/JerryWu1234" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-3d">
          View All Projects on GitHub
        </a>
      </div>
      <Resource
        value={reposResource}
        onPending={() => <p class="fade-in">Fetching projects...</p>}
        onRejected={(error) => <p class="fade-in">Error fetching projects: {error.message}</p>}
        onResolved={(repos) => (
          <>
            {repos.length > 0 ? (
              <ul class="project-list">
                {repos.map((repo, index) => (
                  <li key={repo.id} class="list-item card hover-lift stagger-item" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                    <h2>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer" class="hover-scale">
                        {repo.name}
                      </a>
                    </h2>
                    <p>{repo.description || 'No description available.'}</p>
                    {repo.language && <p><strong>Language:</strong> {repo.language}</p>}
                    <p>
                      <strong>Stars:</strong> {repo.stargazers_count} | <strong>Forks:</strong> {repo.forks_count}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p class="fade-in">No public projects found on GitHub.</p>
            )}
          </>
        )}
      />
    </main>
  );
});

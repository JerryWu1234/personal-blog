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
  const reposResource = useResource$<GitHubRepo[]>(async ({ cleanup }) => {
    const controller = new AbortController();
    cleanup(() => controller.abort());

    const res = await fetch('https://api.github.com/users/Jerry_wu/repos?sort=updated&direction=desc', {
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
      <h1>My Projects</h1>
      <Resource
        value={reposResource}
        onPending={() => <p>Fetching projects...</p>}
        onRejected={(error) => <p>Error fetching projects: {error.message}</p>}
        onResolved={(repos) => (
          <>
            {repos.length > 0 ? (
              <ul class="project-list"> {/* Added class for ul, global ul style already removes list-style and padding */}
                {repos.map((repo) => (
                  <li key={repo.id} class="list-item"> {/* Replaced inline style with class */}
                    <h2>
                      <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
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
              <p>No public projects found on GitHub.</p>
            )}
          </>
        )}
      />
    </main>
  );
});

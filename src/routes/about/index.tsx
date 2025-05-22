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

export const useProficientTechnologies = routeLoader$<string[]>(async ({ cleanup }) => {
  const controller = new AbortController();
  cleanup(() => controller.abort());

  const res = await fetch('https://api.github.com/users/Jerry_wu/repos', {
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
      <h1>About Me</h1>
      <section>
        <h2>Work Experience</h2>
        <p>10 years</p>
      </section>
      <section>
        <h2>Current Focus</h2>
        <p>I'm currently focused on improving performance and DX in frontend architectures, especially with server-first frameworks.</p>
      </section>
      <section>
        <h2>Proficient Technologies</h2>
        {(() => {
          // Check if the loader is still running (value is not yet resolved)
          // Qwik's routeLoader$ doesn't have an explicit "loading" state in the signal itself
          // like useResource$. Instead, the value is available once resolved.
          // For a loading state, you'd typically use <Resource> or manage it manually if not using routeLoader directly for rendering.
          // However, since routeLoader blocks rendering until data is ready (for SSR), 
          // a "loading" state visible to the client might only flash briefly or not at all.
          // For client-side navigation, Qwik handles this.
          // For this example, we'll directly use the resolved value.
          // If proficientTechnologiesSignal.value is not yet populated, it means it's loading or failed.
          // The loader returns [] on failure, so length check covers this.

          const technologies = proficientTechnologiesSignal.value;

          if (technologies.length > 0) {
            return (
              <ul>
                {technologies.map((lang) => <li key={lang}>{lang}</li>)}
              </ul>
            );
          } else {
            // This message covers both "no languages found" and "failed to fetch" (as loader returns [] on error)
            return <p>Primary technologies will be listed here as they appear on public projects, or if GitHub data could not be fetched.</p>;
          }
        })()}
      </section>
    </main>
  );
});

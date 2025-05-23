import { component$ } from '@qwik.dev/core';

export interface Project {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  link?: string;
  github?: string;
}

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = component$<ProjectCardProps>(({ project }) => {
  return (
    <div class="project-card">
      <div class="project-card-inner">
        <div class="project-card-front">
          {project.image ? (
            <div 
              class="project-image" 
              style={{ backgroundImage: `url(${project.image})` }}
            ></div>
          ) : (
            <div class="project-image project-image-placeholder">
              <span>{project.title.charAt(0)}</span>
            </div>
          )}
          <div class="project-content">
            <h3>{project.title}</h3>
            <div class="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} class="project-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div class="project-card-back">
          <div class="project-content">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div class="project-links">
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" class="btn btn-sm">
                  View Project
                </a>
              )}
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProjectCard;
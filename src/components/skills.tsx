import { component$ } from '@qwik.dev/core';

export interface Skill {
  name: string;
  level: number; // 0-100
  color?: string;
}

interface SkillsProps {
  skills: Skill[];
}

export const Skills = component$<SkillsProps>(({ skills }) => {
  return (
    <div class="skills-grid">
      {skills.map((skill, index) => (
        <div key={index} class="skill-item reveal" style={{ animationDelay: `${index * 0.1}s` }}>
          <div class="skill-header">
            <h3 class="skill-name">{skill.name}</h3>
            <span class="skill-percentage">{skill.level}%</span>
          </div>
          <div class="skill-bar">
            <div 
              class="skill-progress" 
              style={{ 
                width: `${skill.level}%`,
                backgroundColor: skill.color || 'var(--primary-color)'
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
});

export default Skills;
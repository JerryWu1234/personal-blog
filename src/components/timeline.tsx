import { component$ } from '@qwik.dev/core';

export interface TimelineItem {
  title: string;
  subtitle?: string;
  date: string;
  description: string;
  icon?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export const Timeline = component$<TimelineProps>(({ items }) => {
  return (
    <div class="timeline">
      {items.map((item, index) => (
        <div key={index} class="timeline-item reveal">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <h3>{item.title}</h3>
            {item.subtitle && <h4>{item.subtitle}</h4>}
            <div class="timeline-date">{item.date}</div>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
});

export default Timeline;
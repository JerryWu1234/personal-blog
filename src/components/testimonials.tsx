import { component$, useSignal, useVisibleTask$ } from '@qwik.dev/core';

export interface Testimonial {
  text: string;
  author: string;
  position?: string;
  company?: string;
  avatar?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export const Testimonials = component$<TestimonialsProps>(({ testimonials }) => {
  const currentIndex = useSignal(0);
  const autoplayInterval = useSignal<any>(null);

  // Set up autoplay
  useVisibleTask$(() => {
    autoplayInterval.value = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % testimonials.length;
    }, 5000);

    return () => {
      if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
      }
    };
  });

  return (
    <div class="testimonials-container reveal">
      <div class="testimonials-slider">
        <div 
          class="testimonials-track" 
          style={{ transform: `translateX(-${currentIndex.value * 100}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} class="testimonial-slide">
              <div class="testimonial-content">
                <blockquote>"{testimonial.text}"</blockquote>
                <div class="testimonial-author">
                  {testimonial.avatar ? (
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author} 
                      class="testimonial-avatar" 
                    />
                  ) : (
                    <div class="testimonial-avatar-placeholder">
                      {testimonial.author.charAt(0)}
                    </div>
                  )}
                  <div class="testimonial-info">
                    <div class="testimonial-name">{testimonial.author}</div>
                    {(testimonial.position || testimonial.company) && (
                      <div class="testimonial-position">
                        {testimonial.position}
                        {testimonial.position && testimonial.company && ' at '}
                        {testimonial.company}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div class="testimonials-dots">
        {testimonials.map((_, index) => (
          <button 
            key={index}
            class={`testimonial-dot ${index === currentIndex.value ? 'active' : ''}`}
            onClick$={() => {
              currentIndex.value = index;
              
              // Reset autoplay timer
              if (autoplayInterval.value) {
                clearInterval(autoplayInterval.value);
                autoplayInterval.value = setInterval(() => {
                  currentIndex.value = (currentIndex.value + 1) % testimonials.length;
                }, 5000);
              }
            }}
            aria-label={`Go to testimonial ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
});

export default Testimonials;
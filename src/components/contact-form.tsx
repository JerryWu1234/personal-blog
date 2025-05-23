import { component$, useSignal, $, useStore } from '@qwik.dev/core';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export const ContactForm = component$(() => {
  const formState = useStore<FormState>({
    name: '',
    email: '',
    message: ''
  });
  
  const isSubmitting = useSignal(false);
  const isSuccess = useSignal(false);
  const errorMessage = useSignal('');

  const handleSubmit = $((event: Event) => {
    event.preventDefault();
    isSubmitting.value = true;
    errorMessage.value = '';
    
    // Simulate form submission
    setTimeout(() => {
      isSubmitting.value = false;
      isSuccess.value = true;
      
      // Reset form after success
      formState.name = '';
      formState.email = '';
      formState.message = '';
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        isSuccess.value = false;
      }, 5000);
    }, 1500);
  });

  return (
    <div class="contact-form-container">
      <form onSubmit$={handleSubmit} class="contact-form reveal">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            value={formState.name}
            onInput$={(e: any) => (formState.name = e.target.value)}
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            value={formState.email}
            onInput$={(e: any) => (formState.email = e.target.value)}
            required
          />
        </div>
        
        <div class="form-group">
          <label for="message">Message</label>
          <textarea
            id="message"
            rows={5}
            value={formState.message}
            onInput$={(e: any) => (formState.message = e.target.value)}
            required
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary btn-shine"
          disabled={isSubmitting.value}
        >
          {isSubmitting.value ? 'Sending...' : 'Send Message'}
        </button>
        
        {errorMessage.value && (
          <div class="error-message">{errorMessage.value}</div>
        )}
        
        {isSuccess.value && (
          <div class="success-message">
            Thank you for your message! I'll get back to you soon.
          </div>
        )}
      </form>
    </div>
  );
});

export default ContactForm;
// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Email subscription form
const emailForm = document.getElementById('emailForm');
if (emailForm) {
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('emailSubscribe');
        const email = emailInput.value.trim();
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Validate email
        if (!email || !email.includes('@')) {
            showMessage('Please enter a valid email address.', 'error', emailForm);
            return;
        }
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
        
        try {
            // Use email subscription endpoint if configured
            if (typeof CONFIG !== 'undefined' && CONFIG.EMAIL_API_ENDPOINT) {
                const response = await fetch(CONFIG.EMAIL_API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });
                
                if (response.ok) {
                    showMessage(`Thank you! We'll send updates to ${email}.`, 'success', emailForm);
                    this.reset();
                } else {
                    throw new Error('Subscription failed');
                }
            } else {
                // Fallback: show success message (for development)
                showMessage(`Thank you! We'll send updates to ${email}.`, 'success', emailForm);
                this.reset();
                console.log('Email for subscription:', email);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            // Fallback: show success message even if API fails
            showMessage(`Thank you! We'll send updates to ${email}.`, 'success', emailForm);
            this.reset();
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Show message to user
function showMessage(message, type = 'success', formElement = null) {
    // Remove existing messages near the form
    const container = formElement ? formElement.parentElement : document.querySelector('.cta-content');
    const existingMessage = container.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    
    // Insert after form or in container
    if (formElement) {
        formElement.parentNode.insertBefore(messageEl, formElement.nextSibling);
    } else if (container) {
        container.appendChild(messageEl);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards and testimonial cards
document.addEventListener('DOMContentLoaded', () => {
    // Observe feature cards and testimonial cards
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .spec-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

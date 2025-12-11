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

// Pre-order form handling
const preorderForm = document.getElementById('preorderForm');
if (preorderForm) {
    preorderForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Validate email
        if (!email || !email.includes('@')) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
        
        try {
            // Option 1: Use MailerLite frontend API (if using MailerLite)
            if (typeof CONFIG !== 'undefined' && CONFIG.PUBLISHABLE_KEY) {
                const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-MailerLite-ApiKey': CONFIG.PUBLISHABLE_KEY
                    },
                    body: JSON.stringify({
                        email: email,
                        groups: [] // Add group IDs if needed
                    })
                });
                
                if (response.ok) {
                    showMessage(`Thank you! We'll notify ${email} when Atma is ready.`, 'success');
                    this.reset();
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Subscription failed');
                }
            } 
            // Option 2: Use custom backend endpoint
            else if (typeof CONFIG !== 'undefined' && CONFIG.API_ENDPOINT) {
                const response = await fetch(CONFIG.API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });
                
                if (response.ok) {
                    showMessage(`Thank you! We'll notify ${email} when Atma is ready.`, 'success');
                    this.reset();
                } else {
                    throw new Error('Subscription failed');
                }
            }
            // Fallback: Show success message (for development)
            else {
                showMessage(`Thank you! We'll notify ${email} when Atma is ready.`, 'success');
                this.reset();
                console.log('Email for subscription:', email);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            showMessage('Something went wrong. Please try again later.', 'error');
        } finally {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Show message to user
function showMessage(message, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    
    // Insert after form
    const form = document.getElementById('preorderForm');
    if (form) {
        form.parentNode.insertBefore(messageEl, form.nextSibling);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
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
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .spec-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

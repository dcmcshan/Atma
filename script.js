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

// Initialize Stripe
let stripe = null;
if (typeof Stripe !== 'undefined' && typeof CONFIG !== 'undefined' && CONFIG.STRIPE_PUBLISHABLE_KEY) {
    stripe = Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY);
}

// Payment forms handling (Stripe Checkout)
const checkoutForms = document.querySelectorAll('[data-checkout-form]');
checkoutForms.forEach(form => {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const submitButton = e.submitter || form.querySelector('[data-checkout-button]');
        const email = emailInput ? emailInput.value.trim() : '';
        const originalButtonText = submitButton ? submitButton.textContent : '';
        
        if (!email || !email.includes('@')) {
            showMessage('Please enter a valid email address.', 'error', form);
            return;
        }
        
        if (!stripe) {
            showMessage('Payment system not configured. Please contact support.', 'error', form);
            return;
        }
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = submitButton.dataset.loadingText || 'Processing...';
        }
        
        const checkoutPayload = {
            email: email,
            priceId: (submitButton && submitButton.dataset.priceId) || CONFIG.PRODUCT.priceId,
            productName: (submitButton && submitButton.dataset.productName) || CONFIG.PRODUCT.name,
            productDescription: (submitButton && submitButton.dataset.productDescription) || CONFIG.PRODUCT.description
        };
        
        try {
            const response = await fetch(CONFIG.CREATE_CHECKOUT_ENDPOINT || '/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(checkoutPayload)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }
            
            const session = await response.json();
            const result = await stripe.redirectToCheckout({ sessionId: session.id });
            
            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showMessage(error.message || 'Something went wrong. Please try again later.', 'error', form);
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
});

// Email-only subscription form
const emailForm = document.getElementById('emailForm');
if (emailForm) {
    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('emailSubscribe');
        const useCaseInput = document.getElementById('useCase');
        const email = emailInput.value.trim();
        const useCase = useCaseInput ? useCaseInput.value.trim() : '';
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        if (!email || !email.includes('@')) {
            showMessage('Please enter a valid email address.', 'error', emailForm);
            return;
        }
        
        submitButton.disabled = true;
        submitButton.textContent = 'Subscribing...';
        
        try {
            const endpoint = CONFIG.EMAIL_API_ENDPOINT || '/api/subscribe';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, useCase })
            });
            
            if (!response.ok) {
                throw new Error('Subscription failed');
            }
            
            showMessage(`Thank you! We'll send updates to ${email}.`, 'success', emailForm);
            this.reset();
        } catch (error) {
            console.error('Subscription error:', error);
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

// Check for payment success/cancel in URL
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
        showMessage('Payment successful! Thank you for your order. We\'ll send you updates via email.', 'success');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get('canceled')) {
        showMessage('Payment canceled. You can try again anytime.', 'error');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
        observer.observe(el);
    });
});

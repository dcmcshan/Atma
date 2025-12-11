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

// Payment form handling (Stripe Checkout)
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = document.getElementById('email');
        const email = emailInput.value.trim();
        const checkoutButton = document.getElementById('checkout-button');
        const originalButtonText = checkoutButton.textContent;
        
        // Validate email
        if (!email || !email.includes('@')) {
            showMessage('Please enter a valid email address.', 'error', paymentForm);
            return;
        }
        
        // Check if Stripe is initialized
        if (!stripe) {
            showMessage('Payment system not configured. Please contact support.', 'error', paymentForm);
            return;
        }
        
        // Disable button and show loading state
        checkoutButton.disabled = true;
        checkoutButton.textContent = 'Processing...';
        
        try {
            // Create checkout session via backend
            const response = await fetch(CONFIG.CREATE_CHECKOUT_ENDPOINT || '/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    priceId: CONFIG.PRODUCT.priceId,
                    productName: CONFIG.PRODUCT.name,
                    productDescription: CONFIG.PRODUCT.description
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }
            
            const session = await response.json();
            
            // Redirect to Stripe Checkout
            const result = await stripe.redirectToCheckout({
                sessionId: session.id
            });
            
            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showMessage(error.message || 'Something went wrong. Please try again later.', 'error', paymentForm);
            checkoutButton.disabled = false;
            checkoutButton.textContent = originalButtonText;
        }
    });
}

// Email-only subscription form
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
            // Use email subscription endpoint
            const endpoint = CONFIG.EMAIL_API_ENDPOINT || '/api/subscribe';
            const response = await fetch(endpoint, {
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
    
    // Observe feature cards and testimonial cards
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .spec-item');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
});

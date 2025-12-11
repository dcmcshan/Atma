// Configuration for Atma landing page
// IMPORTANT: Secret keys should NEVER be stored in frontend code
// Use environment variables or a backend service for secret keys

const CONFIG = {
    // Stripe Publishable Key - safe to use in frontend
    // Replace with your actual Stripe publishable key (starts with pk_)
    STRIPE_PUBLISHABLE_KEY: 'pk_test_...', // Replace with your Stripe publishable key
    
    // Stripe Secret Key - MUST be used only in backend/server-side code
    // Do NOT expose this in frontend JavaScript
    // STRIPE_SECRET_KEY: 'sk_test_...', // Use this in your backend only
    
    // API endpoints for Stripe integration
    CREATE_CHECKOUT_ENDPOINT: '/api/create-checkout-session', // Create checkout session
    CREATE_CUSTOMER_ENDPOINT: '/api/create-customer', // Create customer (for email list)
    
    // Product/Price configuration
    PRODUCT: {
        name: 'Atma Node',
        description: 'Distributed Ambient Audio Field System Node',
        // Price ID from Stripe Dashboard (create a product/price first)
        priceId: 'price_...', // Replace with your Stripe Price ID
        amount: 9900, // Amount in cents ($99.00)
        currency: 'usd'
    },
    
    // Email subscription (optional - separate from payment)
    EMAIL_SERVICE: null, // 'mailerlite', 'mailchimp', etc.
    EMAIL_API_ENDPOINT: '/api/subscribe'
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

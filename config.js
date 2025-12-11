// Configuration for Atma landing page
// IMPORTANT: Secret keys should NEVER be stored in frontend code
// Use environment variables or a backend service for secret keys

const CONFIG = {
    // Stripe Publishable Key - safe to use in frontend
    // Get from: https://dashboard.stripe.com/apikeys
    // Replace with your actual Stripe publishable key (starts with pk_test_ or pk_live_)
    STRIPE_PUBLISHABLE_KEY: 'pk_test_...', // ⚠️ REPLACE WITH YOUR KEY
    
    // Stripe Secret Key - MUST be used only in backend/server-side code
    // Do NOT expose this in frontend JavaScript
    // STRIPE_SECRET_KEY: 'sk_test_...', // Use this in your backend only
    
    // API endpoints for Stripe integration
    // For GitHub Pages: Use absolute URL to your backend API
    // For Vercel/Netlify: Use relative path like '/api/create-checkout-session'
    CREATE_CHECKOUT_ENDPOINT: '/api/create-checkout-session', // Update to your backend URL
    
    // Product/Price configuration
    PRODUCT: {
        name: 'Atma Node',
        description: 'Distributed Ambient Audio Field System Node',
        // Get Price ID from: Stripe Dashboard → Products → Your Product → Pricing
        priceId: 'price_...', // ⚠️ REPLACE WITH YOUR STRIPE PRICE ID
        amount: 9900, // Amount in cents ($99.00) - for display only
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

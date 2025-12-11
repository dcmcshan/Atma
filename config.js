// Configuration for Atma landing page
// IMPORTANT: Secret keys should NEVER be stored in frontend code
// Use environment variables or a backend service for secret keys

const CONFIG = {
    // Publishable key - safe to use in frontend (if service supports it)
    // For MailerLite, use the API key here (but ideally use backend)
    PUBLISHABLE_KEY: 'mk_1Sd0HQB4s5NBjXmnc6KJqsDq',
    
    // Secret key - MUST be used only in backend/server-side code
    // Do NOT expose this in frontend JavaScript
    // SECRET_KEY: 'mk_1Sd0IEB4s5NBjXmnMt1QLK5U', // Use this in your backend only
    
    // API endpoint for form submissions (recommended approach)
    // Create a serverless function or backend API that uses the secret key
    API_ENDPOINT: null, // Set to your backend endpoint, e.g., '/api/subscribe' or 'https://your-api.com/subscribe'
    
    // Service configuration
    SERVICE: 'mailerlite', // mailerlite, mailchimp, etc.
    
    // MailerLite Group ID (optional - add subscribers to specific group)
    GROUP_ID: null
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

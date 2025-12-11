# Backend Setup for Email Subscriptions

## Security Notice

⚠️ **IMPORTANT**: The secret key (`mk_1Sd0IEB4s5NBjXmnMt1QLK5U`) should **NEVER** be exposed in frontend code. It must only be used in server-side code.

## Recommended Approach: Serverless Function

Create a serverless function (Vercel, Netlify, AWS Lambda, etc.) to handle email subscriptions securely.

### Example: Vercel Serverless Function

Create `api/subscribe.js`:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    // Use your secret key here (from environment variable)
    const SECRET_KEY = process.env.MAILERLITE_SECRET_KEY;
    
    const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-MailerLite-ApiKey': SECRET_KEY
      },
      body: JSON.stringify({
        email: email,
        groups: [] // Add group IDs if needed
      })
    });

    if (!response.ok) {
      throw new Error('Subscription failed');
    }

    res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
}
```

### Environment Variables

Set in your hosting platform:
- `MAILERLITE_SECRET_KEY=mk_1Sd0IEB4s5NBjXmnMt1QLK5U`

### Update Frontend Config

Update `config.js`:
```javascript
API_ENDPOINT: '/api/subscribe' // or your serverless function URL
```

## Alternative: MailerLite Embedded Form

If you prefer not to use a backend, you can use MailerLite's embedded form:

1. Go to MailerLite dashboard
2. Create a signup form
3. Get the embed code
4. Replace the form in `index.html` with the MailerLite embed code

## Testing

1. Test the form submission
2. Verify emails are being added to your MailerLite list
3. Check that the secret key is not exposed in browser DevTools

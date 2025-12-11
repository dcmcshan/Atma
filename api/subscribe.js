// Email subscription endpoint (optional - for email-only signups)
// This can integrate with MailerLite, Mailchimp, or your email service

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    // Option 1: MailerLite integration
    if (process.env.MAILERLITE_API_KEY) {
      const response = await fetch('https://api.mailerlite.com/api/v2/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': process.env.MAILERLITE_API_KEY
        },
        body: JSON.stringify({
          email: email,
          groups: process.env.MAILERLITE_GROUP_ID ? [process.env.MAILERLITE_GROUP_ID] : []
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Subscription failed');
      }

      return res.status(200).json({ success: true, message: 'Subscribed successfully' });
    }

    // Option 2: Mailchimp integration
    if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
      const [apiKey, server] = process.env.MAILCHIMP_API_KEY.split('-');
      const response = await fetch(
        `https://${server}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}/members`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            email_address: email,
            status: 'subscribed'
          })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Subscription failed');
      }

      return res.status(200).json({ success: true, message: 'Subscribed successfully' });
    }

    // Option 3: Simple email logging (for development)
    console.log('New subscription:', email);
    // In production, you might want to save to a database or send to your email service
    
    return res.status(200).json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to subscribe',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

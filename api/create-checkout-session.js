// Vercel Serverless Function for Stripe Checkout
// Deploy this to Vercel, Netlify, or your preferred serverless platform

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, priceId, productName, productDescription } = req.body;

  // Validate required fields
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!priceId) {
    return res.status(400).json({ error: 'Price ID is required' });
  }

  try {
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email,
      success_url: `${req.headers.origin || process.env.FRONTEND_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || process.env.FRONTEND_URL}/?canceled=true`,
      metadata: {
        product: productName || 'Atma Node',
        email: email,
      },
      payment_intent_data: {
        description: productDescription || 'Atma Distributed Audio Node',
      },
      allow_promotion_codes: true, // Allow discount codes
    });

    // Return session ID to frontend
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      message: error.message 
    });
  }
}

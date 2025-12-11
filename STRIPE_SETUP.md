# Stripe Integration Setup

## Quick Start

1. **Get your Stripe keys** from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Publishable key (starts with `pk_test_` or `pk_live_`)
   - Secret key (starts with `sk_test_` or `sk_live_`)

2. **Update `config.js`**:
   ```javascript
   STRIPE_PUBLISHABLE_KEY: 'pk_test_your_key_here',
   ```

3. **Create a Product and Price in Stripe Dashboard**:
   - Go to Products → Add Product
   - Name: "Atma Node"
   - Price: $99.00 (or your price)
   - Copy the Price ID (starts with `price_`)
   - Update `config.js`:
     ```javascript
     PRODUCT: {
       priceId: 'price_your_price_id_here',
       // ...
     }
     ```

4. **Set up backend API** (see below)

## Backend API Setup

### Option 1: Vercel Serverless Function

Create `api/create-checkout-session.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, priceId, productName } = req.body;

  try {
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
      success_url: `${req.headers.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/?canceled=true`,
      metadata: {
        product: productName || 'Atma Node',
      },
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
```

### Option 2: Netlify Function

Create `netlify/functions/create-checkout-session.js`:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const { email, priceId, productName } = JSON.parse(event.body);

  try {
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
      success_url: `${event.headers.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${event.headers.origin}/?canceled=true`,
      metadata: {
        product: productName || 'Atma Node',
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
```

### Option 3: Express.js Backend

```javascript
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());

app.post('/api/create-checkout-session', async (req, res) => {
  const { email, priceId, productName } = req.body;

  try {
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
      success_url: `${process.env.FRONTEND_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/?canceled=true`,
      metadata: {
        product: productName || 'Atma Node',
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

## Environment Variables

Set these in your hosting platform:

- `STRIPE_SECRET_KEY=sk_test_your_secret_key_here` (use `sk_live_` for production)
- `FRONTEND_URL=https://dcmcshan.github.io/Atma` (your site URL)

## Success/Cancel Pages

Update your `index.html` to handle success/cancel:

```javascript
// Check for success/cancel in URL
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('success')) {
  showMessage('Payment successful! Thank you for your order.', 'success');
}
if (urlParams.get('canceled')) {
  showMessage('Payment canceled. You can try again anytime.', 'error');
}
```

## Testing

1. Use Stripe test mode keys (`pk_test_` and `sk_test_`)
2. Test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Use any future expiry date and any CVC

## Security Notes

- ✅ Publishable key is safe in frontend code
- ❌ Secret key MUST be in backend only
- ✅ Always use HTTPS in production
- ✅ Validate email on backend
- ✅ Use webhooks to verify payments (recommended)

## Webhook Setup (Recommended)

Set up webhooks to handle payment confirmations:

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-api.com/api/webhook`
3. Select events: `checkout.session.completed`, `payment_intent.succeeded`
4. Handle in your backend to send confirmation emails, update database, etc.

# Complete Setup Instructions for Atma Landing Page

## Quick Start Checklist

- [ ] Get Stripe account and API keys
- [ ] Create Stripe product and get Price ID
- [ ] Update `config.js` with your keys
- [ ] Set up backend API (Vercel/Netlify)
- [ ] Test payment flow
- [ ] Deploy to GitHub Pages

## Step-by-Step Guide

### 1. Stripe Account Setup

1. Go to [stripe.com](https://stripe.com) and create an account
2. Navigate to [API Keys](https://dashboard.stripe.com/apikeys)
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode) - keep this secret!

### 2. Create Product in Stripe

1. Go to [Products](https://dashboard.stripe.com/products) in Stripe Dashboard
2. Click "Add product"
3. Fill in:
   - **Name**: Atma Node
   - **Description**: Distributed Ambient Audio Field System Node
   - **Pricing**: Set your price (e.g., $99.00)
   - **Currency**: USD (or your preferred currency)
4. Click "Save product"
5. Copy the **Price ID** (starts with `price_...`)

### 3. Update Frontend Configuration

Edit `config.js`:

```javascript
const CONFIG = {
    STRIPE_PUBLISHABLE_KEY: 'pk_test_YOUR_KEY_HERE', // Your publishable key
    CREATE_CHECKOUT_ENDPOINT: '/api/create-checkout-session', // Your API endpoint
    PRODUCT: {
        priceId: 'price_YOUR_PRICE_ID_HERE', // Your Price ID
        // ...
    }
};
```

### 4. Set Up Backend API

Choose one of these options:

#### Option A: Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Copy `api/create-checkout-session.js` to your project
3. Deploy: `vercel`
4. Set environment variable:
   ```bash
   vercel env add STRIPE_SECRET_KEY
   # Paste your secret key when prompted
   ```
5. Update `config.js`:
   ```javascript
   CREATE_CHECKOUT_ENDPOINT: 'https://your-project.vercel.app/api/create-checkout-session'
   ```

#### Option B: Netlify

1. Copy `netlify/functions/create-checkout-session.js` to your project
2. Deploy to Netlify (via Git or drag & drop)
3. Set environment variable in Netlify Dashboard:
   - Go to Site settings → Environment variables
   - Add `STRIPE_SECRET_KEY` with your secret key
4. Update `config.js`:
   ```javascript
   CREATE_CHECKOUT_ENDPOINT: 'https://your-site.netlify.app/.netlify/functions/create-checkout-session'
   ```

#### Option C: Your Own Server

1. Use the Express.js example from `STRIPE_SETUP.md`
2. Set environment variable: `STRIPE_SECRET_KEY`
3. Update `config.js` with your server URL

### 5. Test the Integration

1. Use Stripe test mode keys
2. Test with card: `4242 4242 4242 4242`
3. Use any future expiry date and any CVC
4. Complete a test purchase
5. Verify you're redirected back with success message

### 6. Deploy to GitHub Pages

Your site is already set up for GitHub Pages! Just:

1. Push your changes:
   ```bash
   git add .
   git commit -m "Configure Stripe integration"
   git push origin main
   ```

2. Your site will auto-deploy at: `https://dcmcshan.github.io/Atma/`

## Environment Variables Summary

### Frontend (`config.js`)
- ✅ `STRIPE_PUBLISHABLE_KEY` - Safe to commit (starts with `pk_`)

### Backend (Environment Variables)
- ❌ `STRIPE_SECRET_KEY` - Never commit (starts with `sk_`)
- ✅ `FRONTEND_URL` - Your GitHub Pages URL

## Security Checklist

- [ ] Secret key is only in backend environment variables
- [ ] Publishable key is in `config.js` (this is safe)
- [ ] Backend validates email addresses
- [ ] Backend uses HTTPS
- [ ] Test mode keys are used for development
- [ ] Production keys are used only in production

## Troubleshooting

### Payment button doesn't work
- Check browser console for errors
- Verify `STRIPE_PUBLISHABLE_KEY` is correct
- Verify `CREATE_CHECKOUT_ENDPOINT` points to your backend
- Check that Stripe.js is loaded (check Network tab)

### Backend returns 500 error
- Check backend logs
- Verify `STRIPE_SECRET_KEY` is set correctly
- Verify Price ID exists in your Stripe account
- Check CORS settings if using different domain

### Redirect after payment doesn't work
- Verify `FRONTEND_URL` in backend matches your site
- Check that success/cancel URLs are correct
- Check browser console for errors

## Going Live

1. Switch to Stripe live mode:
   - Get live keys from Stripe Dashboard
   - Update `config.js` with live publishable key
   - Update backend with live secret key
   - Update Price ID if you created a new product for live mode

2. Test with real card (use a small amount first)

3. Set up webhooks for payment confirmations (optional but recommended)

## Support

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [GitHub Pages Docs](https://docs.github.com/pages)

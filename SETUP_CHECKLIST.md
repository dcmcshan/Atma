# Atma Landing Page Setup Checklist

## ✅ Initial Setup

- [x] Repository created on GitHub
- [x] GitHub Pages enabled
- [x] Landing page deployed
- [x] Stripe integration code added

## 🔑 Stripe Setup (Required for Payments)

### 1. Get Stripe Account
- [ ] Create account at [stripe.com](https://stripe.com)
- [ ] Complete account setup
- [ ] Switch to test mode for development

### 2. Get API Keys
- [ ] Go to [Stripe Dashboard → API Keys](https://dashboard.stripe.com/apikeys)
- [ ] Copy **Publishable key** (starts with `pk_test_` or `pk_live_`)
- [ ] Copy **Secret key** (starts with `sk_test_` or `sk_live_`)
- [ ] ⚠️ **Never commit secret key to git!**

### 3. Create Product & Price
- [ ] Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/products)
- [ ] Click "Add Product"
- [ ] Name: "Atma Node"
- [ ] Description: "Distributed Ambient Audio Field System Node"
- [ ] Set price: $99.00 (or your price)
- [ ] Save and copy the **Price ID** (starts with `price_`)

### 4. Update Configuration
- [ ] Open `config.js`
- [ ] Replace `STRIPE_PUBLISHABLE_KEY` with your publishable key
- [ ] Replace `PRODUCT.priceId` with your Price ID
- [ ] Save file

### 5. Deploy Backend API
Choose one option:

#### Option A: Vercel (Recommended)
- [ ] Install Vercel CLI: `npm i -g vercel`
- [ ] Run `vercel` in project directory
- [ ] Set environment variables:
  - `STRIPE_SECRET_KEY` = your secret key
  - `FRONTEND_URL` = your site URL
- [ ] Update `config.js` → `CREATE_CHECKOUT_ENDPOINT` to your Vercel API URL

#### Option B: Netlify Functions
- [ ] Install Netlify CLI: `npm i -g netlify-cli`
- [ ] Run `netlify deploy`
- [ ] Set environment variables in Netlify dashboard
- [ ] Update endpoint in `config.js`

#### Option C: Custom Backend
- [ ] Deploy `api/create-checkout-session.js` to your server
- [ ] Set environment variables
- [ ] Update endpoint in `config.js`

### 6. Test Payment Flow
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Any future expiry date
- [ ] Any CVC
- [ ] Complete test checkout
- [ ] Verify success message appears

## 📧 Email Subscription (Optional)

- [ ] Choose email service (MailerLite, Mailchimp, etc.)
- [ ] Get API key
- [ ] Update `config.js` → `EMAIL_API_ENDPOINT`
- [ ] Test email subscription form

## 🚀 Deployment

### GitHub Pages (Frontend)
- [x] Code pushed to GitHub
- [x] GitHub Pages enabled
- [ ] Verify site loads at `https://dcmcshan.github.io/Atma/`

### Backend API
- [ ] Deploy to Vercel/Netlify/your platform
- [ ] Set environment variables
- [ ] Test API endpoints
- [ ] Update `config.js` with API URLs

## 🔒 Security Checklist

- [ ] Secret keys stored in environment variables only
- [ ] No secrets in `config.js` (only publishable key)
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enabled for production
- [ ] Webhook signature verification enabled (if using webhooks)

## 📝 Next Steps

- [ ] Customize product details and pricing
- [ ] Add product images
- [ ] Set up email notifications for orders
- [ ] Configure webhooks for order fulfillment
- [ ] Test complete purchase flow
- [ ] Switch to live mode when ready

## 🆘 Troubleshooting

**Payment button doesn't work:**
- Check browser console for errors
- Verify Stripe publishable key is correct
- Ensure backend API is deployed and accessible
- Check CORS settings on backend

**Checkout redirect fails:**
- Verify `FRONTEND_URL` is correct
- Check success/cancel URLs in backend code
- Ensure HTTPS is enabled

**Webhook not receiving events:**
- Verify webhook secret is set correctly
- Check webhook URL in Stripe Dashboard
- Ensure endpoint is publicly accessible
- Check server logs for errors

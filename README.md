# Atma - Distributed Ambient Audio Field System

A network of magical "sound jars" that render a shared spatial soundfield using ESP32 nodes, Bluetooth audio, and Wi-Fi synchronization.

## 🌳 Overview

Atma is a modular, forest-deployable audio installation composed of many small speaker "jars," each powered by an ESP32 and a compact amplifier. Together, they create a living ambient ecosystem of motion, voices, spirits, and environmental textures that move fluidly from jar to jar.

Each Atma node:
- Plays audio independently
- Computes its own DSP processing
- Receives spatial control signals
- Syncs to all other jars wirelessly
- Emits unique localized sound according to its place in the environment

The result is a **distributed, immersive, location-aware sound field**.

## ✨ Key Features

- 🌳 **Forest Deployable**: Modular speaker jars for outdoor installations
- 🎵 **Ambisonic Spatial Audio**: First-Order Ambisonics (FOA) rendering with WXYZ channels
- 📡 **Wi-Fi Synchronization**: Phase-coherent playback across unlimited nodes via UDP multicast
- 🔵 **Bluetooth Streaming**: Stream from phone via Bluetooth A2DP to master node
- ⚙️ **Local DSP Processing**: Each ESP32 performs spatial decoding, EQ, and filtering at 48kHz
- 🔌 **USB-C Power**: Simple deployment with USB-C PD (12V) power negotiation
- 🎯 **Self-Contained**: No single point of failure - each node operates independently
- 🔄 **Scalable**: Add or remove jars freely without system reconfiguration

## 🏗️ System Architecture

### Hardware Components (Per Jar)

Each jar contains:
- **ESP32 (Classic)** - Provides Bluetooth A2DP sink, Wi-Fi, and DSP processing
- **I²S DAC** - PCM5102, ES8388, AC101, or compatible
- **Audio Amplifier** - TPA3116, PAM8610, or similar
- **Speakers** - 1-3 small full-range drivers arranged vertically
- **Power System** - USB-C PD trigger → 12V rail for amplifier, regulated 5V/3.3V for ESP32
- **Optional** - LEDs, IMU sensors, environmental sensors

### Audio Pipeline

1. **Input Sources**:
   - Bluetooth A2DP → Master Jar (decodes SBC, publishes over Wi-Fi)
   - Wi-Fi Stream (PCM/Opus from controller or phone)
   - On-Node Sounds (procedural textures, triggered effects, ambient loops)

2. **Spatial Rendering**:
   - Uses First-Order Ambisonics (FOA) with four channels: W, X, Y, Z
   - Each jar performs local FOA → speaker decoding
   - Matrix multiplication: `Left = aW + bX + cY + dZ`, `Right = eW + fX + gY + hZ`
   - Results in coherent, environment-wide spatial textures

3. **DSP Pipeline (Per Node)**:
   - Audio receive & buffer (10-30ms jitter smoothing)
   - Spatial decode (FOA matrix multiply)
   - Gain staging
   - Biquad filters (EQ, jar enclosure compensation)
   - Soft limiter
   - I²S output → DAC → amplifier → speakers

### Network Synchronization

- **Transport**: Wi-Fi UDP multicast for audio, unicast/ESP-NOW for control
- **Sync Method**: Each jar maintains local sample clock, aligns using timestamps
- **Buffering**: 10-30ms buffer per node to smooth network jitter
- **Result**: Phase-coherent playback across all nodes

### Master Node Responsibilities

The Master Node (any jar or dedicated controller) performs:
- Bluetooth audio decoding (if used)
- Spatial scene computation
- FOA encoding or per-node decoding coefficients
- Audio stream distribution
- Node management and heartbeat
- Clock synchronization

## 📋 Technical Specifications

| Component | Specification |
|-----------|--------------|
| Microcontroller | ESP32 (Classic) |
| Audio Interface | I²S DAC (PCM5102/ES8388/AC101) |
| Amplifier | TPA3116 / PAM8610 |
| Speakers | 1-3 Full-Range Drivers |
| Power | USB-C PD (12V) |
| Audio Format | First-Order Ambisonics (WXYZ) |
| Sample Rate | 48 kHz |
| Connectivity | Wi-Fi, Bluetooth A2DP, ESP-NOW |
| Sync Method | UDP Multicast with Timestamps |

## 🎯 Use Cases

- **Forest Installations**: Magical ambient textures drifting between jars in natural settings
- **Art Galleries**: Immersive sound sculptures with distributed audio fields
- **Performance Spaces**: Responsive musical environments for live events
- **Meditation & Ritual**: Enchanted audio ecosystems for wellness spaces
- **Interactive Installations**: Sound that responds to movement and proximity

## 💳 Stripe Payment Integration

This landing page includes Stripe payment integration for pre-orders. See [STRIPE_SETUP.md](STRIPE_SETUP.md) for complete setup instructions.

**Quick Setup:**
1. Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
2. Update `config.js` with your publishable key
3. Create a Product/Price in Stripe and update the price ID
4. Deploy backend API (see `api/` folder for examples)
5. Set environment variables for secret key

## 🚀 Getting Started

### Website Setup

1. Clone this repository
2. Open `index.html` in a web browser
3. Or deploy to GitHub Pages (see below)

### Stripe Payment Setup

To enable payments, you need to:

1. **Get Stripe Keys**:
   - Sign up at [Stripe](https://stripe.com)
   - Get your publishable key (`pk_test_...`) and secret key (`sk_test_...`)
   - Update `config.js` with your publishable key

2. **Create a Product in Stripe**:
   - Go to Stripe Dashboard → Products
   - Create a product "Atma Node" with your price
   - Copy the Price ID (starts with `price_`)
   - Update `config.js` with the Price ID

3. **Set up Backend API**:
   - Choose a platform: Vercel, Netlify, or your own server
   - Deploy the API functions from `/api` or `/netlify/functions`
   - Set environment variable: `STRIPE_SECRET_KEY`
   - Update `config.js` with your API endpoint

See [STRIPE_SETUP.md](STRIPE_SETUP.md) for detailed instructions.

### GitHub Pages Deployment

#### Option 1: Automatic Deployment via Settings

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Select source branch (usually `main`)
4. Select folder (`/root` or `/docs` if using docs folder)
5. Your site will be live at `https://[username].github.io/Atma/`

#### Option 2: Using GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/pages.yml`) that automatically deploys to GitHub Pages when you push to the main branch.

## 📁 Project Structure

```
Atma/
├── index.html          # Main landing page
├── styles.css          # Styling and responsive design
├── script.js           # Interactive functionality
├── config.js           # Configuration (Stripe keys, API endpoints)
├── README.md           # This file
├── ATMA.md             # Detailed technical documentation
├── STRIPE_SETUP.md     # Stripe integration guide
├── BACKEND_SETUP.md    # Backend API setup guide
├── api/                # Backend API functions (Vercel)
│   ├── create-checkout-session.js
│   └── subscribe.js
├── netlify/
│   └── functions/     # Netlify serverless functions
│       └── create-checkout-session.js
├── .github/
│   └── workflows/
│       └── pages.yml   # GitHub Pages deployment workflow
└── .gitignore          # Git ignore rules
```

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... */
}
```

### Content
- Update text content directly in `index.html`
- Modify features, specs, and use cases as needed
- Replace device mockup with actual product images

### Stripe Configuration
1. Update `config.js` with your Stripe publishable key
2. Create a product/price in Stripe Dashboard
3. Update the price ID in `config.js`
4. Deploy backend API (see `api/` folder and `STRIPE_SETUP.md`)

### Email Subscription
- Update `config.js` with your email service API endpoint
- Or use the separate email-only form (no payment required)

## 📚 Documentation

- **[ATMA.md](ATMA.md)** - Complete technical documentation including:
  - Hardware architecture details
  - Audio pipeline specifications
  - Network synchronization strategies
  - DSP processing pipeline
  - Future extensions and roadmap

## 🔧 Development

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Technologies Used

- HTML5
- CSS3 (with CSS Variables)
- Vanilla JavaScript
- Google Fonts (Inter)

## 🌟 Future Extensions

- GPS or UWB positioning for dynamic spatial mapping
- Light-synchronized effects
- Environmental sensing (BME688 VOC, humidity, temp)
- AI-generated sound sprites
- Higher-order Ambisonics support
- Solar charging and weatherproof housings

## 📄 License

MIT License - feel free to use this template for your projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Technical Documentation](ATMA.md)
- [GitHub Repository](https://github.com)

---

**Atma** - Creating distributed, magical, and scalable audio ecosystems for forests, art installations, and immersive experiences.

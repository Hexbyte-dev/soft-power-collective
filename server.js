// ============================================
// The Soft Power Collective — Static Site Server
// ============================================
// Serves the static site, proxies email signups to Kit, and receives
// contact form submissions (logged to stdout for Railway visibility).
// ============================================

require('dotenv').config();

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_FORM_ID = process.env.KIT_FORM_ID || '9335347';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SOURCES = [
  'home', 'about', 'programs', 'book-club',
  'the-collective', 'quiz', 'contact-form',
];

// ============================================
// Security headers
// ============================================
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// Rate limiters
// ============================================
const subscribeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again in a minute.' },
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
});

// ============================================
// Kit (ConvertKit) subscription proxy
// ============================================
app.post('/api/subscribe', subscribeLimiter, async (req, res) => {
  const email = req.body.email_address || req.body.email;
  const source = req.body.source || '';

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  if (source && !VALID_SOURCES.includes(source)) {
    return res.status(400).json({ error: 'Invalid source' });
  }

  if (!KIT_API_KEY) {
    console.error('KIT_API_KEY not set');
    return res.status(500).json({ error: 'server not configured' });
  }

  try {
    const kitResp = await fetch(
      `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: KIT_API_KEY,
          email,
          fields: source ? { source } : {},
        }),
      }
    );

    const data = await kitResp.json().catch(() => ({}));
    if (!kitResp.ok) {
      console.error('Kit API error:', kitResp.status, data);
      return res
        .status(kitResp.status)
        .json({ error: data.message || 'Kit API error' });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Subscribe proxy error:', err);
    return res.status(500).json({ error: 'subscription failed' });
  }
});

// ============================================
// Contact form endpoint
// Logs submissions to stdout (visible in Railway logs) and subscribes
// the sender to Kit with source "contact-form" so Casey sees them.
// ============================================
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, inquiry, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  console.log('--- CONTACT FORM SUBMISSION ---');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Inquiry:', inquiry || 'not specified');
  console.log('Message:', message);
  console.log('Time:', new Date().toISOString());
  console.log('------------------------------');

  if (KIT_API_KEY) {
    try {
      await fetch(
        `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: KIT_API_KEY,
            email,
            first_name: name,
            fields: { source: 'contact-form' },
          }),
        }
      );
    } catch (err) {
      console.error('Kit subscribe from contact form failed:', err);
    }
  }

  return res.json({ success: true });
});

// ============================================
// Static assets & page routing
// ============================================
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ['html'],
    maxAge: '1d',
  })
);

app.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const file = path.join(PUBLIC_DIR, `${page}.html`);
  res.sendFile(file, (err) => {
    if (err) next();
  });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌿 The Soft Power Collective is live on port ${PORT}`);
  console.log(`   Local:  http://localhost:${PORT}\n`);
  if (!KIT_API_KEY) {
    console.warn(
      '   ⚠️  KIT_API_KEY not set — email signups will return 500 until you configure it.\n'
    );
  }
});

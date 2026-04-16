// ============================================
// The Soft Power Collective — Static Site Server
// ============================================
// Serves the static site and proxies email signups to Kit (ConvertKit) so that
// browser tracking prevention / ad blockers can't intercept the request.
// ============================================

require('dotenv').config();

const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const KIT_API_KEY = process.env.KIT_API_KEY;
const KIT_FORM_ID = process.env.KIT_FORM_ID || '9335347';

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        scriptSrcAttr: ["'unsafe-inline'"],
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
// Kit (ConvertKit) subscription proxy
// Browser POSTs to this endpoint; we forward to Kit's API using a server-side key.
// ============================================
app.post('/api/subscribe', async (req, res) => {
  const email = req.body.email_address || req.body.email;
  const source =
    req.body.source || (req.body.fields && req.body.fields.source) || '';

  if (!email) {
    return res.status(400).json({ error: 'email required' });
  }

  if (!KIT_API_KEY) {
    console.error('KIT_API_KEY not set — subscription request rejected.');
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

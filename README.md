# The Soft Power Collective

> A gentle space for bold exploration.

The official website for The Soft Power Collective — a community rooted in emotional intelligence, consent, and growth.

## Project Structure

```
soft-power-collective/
├── public/                 # All static site files
│   ├── index.html          # Home page
│   ├── about.html          # About page
│   ├── programs.html       # Programs & offerings
│   ├── bookclub.html       # Book club
│   ├── quiz.html           # Soft Power Quiz
│   ├── contact.html        # Connect / contact form
│   ├── styles.css          # Global styles & design system
│   └── script.js           # Interactivity (nav, forms, animations)
├── server.js               # Express static server
├── package.json            # Dependencies & scripts
├── railway.json            # Railway deploy config
├── .gitignore
└── README.md
```

## Local Development

```bash
npm install
npm start
```

Open http://localhost:3000

## Deploying to Railway

1. **Push to GitHub** — commit the repo to GitHub (Railway deploys from git).
2. **Create Railway project** — at [railway.app](https://railway.app), click "New Project" → "Deploy from GitHub repo" → select this repo.
3. **Railway auto-detects Node.js** — reads `package.json` and `railway.json`, runs `npm install` then `npm start`.
4. **Set custom domain** — in Railway's Settings → Networking, add `thesoftpowercollective.com`. Railway will give you DNS records to point at your domain registrar.
5. **Done** — deploys automatically on every git push.

### Environment Variables (optional)

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port the server listens on (Railway sets this automatically) |

## Brand System

Colors used throughout (defined as CSS variables in `public/styles.css`):

- `--sage-green: #B5B99A` — Primary background, calm and grounding
- `--terracotta: #A0522D` — Accent color, warmth and earthiness
- `--cream: #F5F0E8` — Light section backgrounds
- `--charcoal: #3B3A30` — Text on light backgrounds, footer background
- `--white: #FFFFFF` — Text on dark and colored backgrounds

Typography:

- Headings: **Cormorant Garamond** (elegant serif)
- Body: **Nunito Sans** (clean sans-serif)
- Accent/display: **Playfair Display** (italic serif for pull quotes)

## Replacing Placeholders

The site currently uses placeholder SVGs for the logo, portrait photos, gallery images, and book covers. To replace them:

1. Drop real images into `public/images/` (create the folder).
2. Swap the inline `<svg>` placeholders in the HTML with `<img src="images/your-file.jpg" alt="...">`.
3. The most important swaps: the hero logo on `index.html`, Casey's portrait on `index.html` and `about.html`, and the book covers on `bookclub.html`.

## Future Integrations

Placeholder hooks are already in the markup for:

- **Email signup** — connect form submit to ConvertKit, Mailchimp, or Flodesk
- **Quiz** — embed Typeform or Interact inside the dashed-border placeholder on `quiz.html`
- **Contact form** — wire up Formspree, Netlify Forms, or a simple serverless function
- **Booking** — drop a Calendly or Acuity embed on the Programs or Contact page

## License

All rights reserved. © The Soft Power Collective.

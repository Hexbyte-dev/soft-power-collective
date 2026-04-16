# Deployment Guide — The Soft Power Collective

This guide walks you through deploying the site to **Railway** and pointing `thesoftpowercollective.com` at it. If you've never deployed a web app before, follow each step in order.

---

## Pre-deployment checklist

Before you click anything on Railway, make sure you have:

- [ ] A **GitHub account** (free — sign up at https://github.com if you don't have one)
- [ ] A **Railway account** (free to start — sign up at https://railway.app and log in with GitHub)
- [ ] Your **Kit API key** ready. Get it from Kit (ConvertKit) at: Settings -> Developer -> API Keys. Copy the "V4 API Secret" (or V3 API Secret, whichever the proxy is using). Keep it somewhere safe for a minute — you'll paste it into Railway.
- [ ] The local project at `~/dev/soft-power-collective/` is a git repository with at least one commit (see "First commit" below).
- [ ] A **GitHub repository** created (empty, no README) that you'll push this code to. Name suggestion: `soft-power-collective`. Make it private if you prefer; Railway works with either.

### First commit (if you haven't done this yet)

Open a terminal in the project directory and run:

```bash
cd ~/dev/soft-power-collective
git add .
git commit -m "Initial commit"
```

Then connect to your GitHub repo (replace `YOUR-USERNAME`):

```bash
git remote add origin https://github.com/YOUR-USERNAME/soft-power-collective.git
git branch -M main
git push -u origin main
```

---

## Deployment steps (Railway web UI)

### 1. Create the project

1. Go to https://railway.app and click **"New Project"** (top-right, or the big purple button on the dashboard).
2. You'll see a list of options. Click **"Deploy from GitHub repo"**.
3. If this is your first Railway project, it will ask you to authorize Railway to access your GitHub. Click **"Configure GitHub App"** and grant access to the `soft-power-collective` repository (or all repos — your choice).
4. Back in Railway, pick `soft-power-collective` from the list.
5. Railway will start a build immediately. **It will likely fail the first time** because we haven't set environment variables yet. That's fine — continue to the next step.

### 2. Set environment variables

1. Click into your service (the tile with your repo's name).
2. Click the **"Variables"** tab at the top.
3. Click **"+ New Variable"** and add each of these:

   | Name | Value |
   |------|-------|
   | `KIT_API_KEY` | *(paste your Kit API secret — do not share this anywhere)* |
   | `KIT_FORM_ID` | `9335347` |

   **Do NOT set `PORT`.** Railway sets this automatically, and `server.js` reads it via `process.env.PORT`.

4. After adding both variables, Railway will auto-redeploy. Watch the **"Deployments"** tab — you want to see a green check and "Success."

### 3. Generate a Railway URL (temporary)

1. Go to the **"Settings"** tab of your service.
2. Scroll to the **"Networking"** section.
3. Click **"Generate Domain"**. Railway gives you a URL like `soft-power-collective-production.up.railway.app`.
4. Open that URL in your browser. You should see the homepage.

---

## Custom domain setup — `thesoftpowercollective.com`

Once the Railway URL works, point your real domain at Railway.

### On Railway
1. In your service's **Settings -> Networking** section, click **"Custom Domain"**.
2. Enter `thesoftpowercollective.com` and click **Add**.
3. Railway will show you either a **CNAME target** (something like `xyz.up.railway.app`) or instructions for an **A record**. Copy whatever it gives you.
4. Repeat for `www.thesoftpowercollective.com` if you want the `www` subdomain to work too.

### On your DNS provider (wherever you bought the domain — Namecheap, Google Domains, Cloudflare, etc.)

- **For the apex domain** (`thesoftpowercollective.com`): most DNS providers don't allow a CNAME on the root. Railway handles this with an `ALIAS` or `ANAME` record if your provider supports it, otherwise use the **A record** Railway gives you.
- **For `www.thesoftpowercollective.com`**: add a **CNAME** record pointing to the Railway target.

DNS changes can take anywhere from **5 minutes to 24 hours** to propagate. Be patient. You can check propagation at https://dnschecker.org.

### SSL / HTTPS
Railway provisions a free **Let's Encrypt** SSL certificate automatically once DNS resolves correctly. You don't need to do anything — just wait. Once it's ready, `https://thesoftpowercollective.com` will work with a valid padlock.

---

## Environment variables — full reference

| Variable | Required? | Source | Notes |
|----------|-----------|--------|-------|
| `KIT_API_KEY` | Yes | Kit -> Settings -> Developer | **Secret.** Never commit this to git. |
| `KIT_FORM_ID` | Yes | Kit form URL or dashboard | `9335347` for the main form. |
| `PORT` | No | Railway (automatic) | Do not set manually. `server.js` reads `process.env.PORT`. |
| `NODE_ENV` | Optional | — | Railway may set this to `production` automatically. |

---

## Post-deployment verification

Once the domain is live, run through this checklist:

1. **Homepage loads:** `curl -I https://thesoftpowercollective.com` returns `HTTP/2 200`.
2. **All six pages load:** click through `/`, `/about.html`, `/programs.html`, `/bookclub.html`, `/collective.html`, `/contact.html`, `/quiz.html` in a browser. No 404s, no broken images.
3. **CSS and JS load:** open DevTools -> Network tab, reload the page. `styles.css` and `script.js` should both return 200.
4. **Email signup works:** submit the form with a real email. Check your Kit dashboard — the subscriber should appear. Also check you see a success message on the page, not a red error.
5. **HTTPS works:** the padlock icon is present and clicking it shows a valid certificate.
6. **Mobile check:** open the site on your phone. Layout should look right.

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| Build fails with "Cannot find module" | Missing dependency in `package.json` | Check that `express`, `compression`, `helmet`, `dotenv`, and `node-fetch` are all in `dependencies`. Run `npm install <pkg>` locally, commit `package.json` + `package-lock.json`, push. |
| Deployment succeeds but URL shows "Application failed to respond" | App crashed on startup, or wrong port | Check Railway **Logs** tab. Make sure `server.js` uses `process.env.PORT`, not a hardcoded number. |
| Form submit returns 500 error | `KIT_API_KEY` missing or wrong | Double-check the variable in Railway -> Variables. Regenerate the key in Kit if needed. |
| Form submit returns "blocked by CSP" in browser console | Helmet's Content Security Policy is blocking the request | Check `server.js` CSP config — the main conversation should have set `connectSrc` to allow `/api/subscribe` (same origin, so usually fine). |
| Custom domain shows "Not Secure" / no padlock | SSL cert not yet issued | Wait up to 30 min after DNS propagates. If still broken after 2 hours, in Railway click "Remove Domain" then re-add it. |
| `thesoftpowercollective.com` doesn't resolve | DNS not propagated, or wrong record | Check https://dnschecker.org. Verify the A/CNAME record matches exactly what Railway gave you. |
| Old version still showing after a deploy | Browser cache | Hard-reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac). |

---

## What's in this repo

Files that get deployed (everything tracked by git):

- `server.js` — Express server
- `package.json`, `package-lock.json` — dependencies
- `railway.json` — Railway build/deploy config
- `public/` — all HTML, CSS, JS, images
- `docs/` — included in the repo but never served (server only serves `public/`)
- `README.md`

Files that are **never** deployed (in `.gitignore`):

- `node_modules/` — Railway reinstalls fresh on every build
- `.env`, `.env.local` — local secrets only
- `.superpowers/`, `.vscode/`, `.idea/`, `.DS_Store` — editor/system files

---

## If something goes wrong and you need help

Save the Railway **deployment logs** (Deployments -> click the failed deploy -> copy the log). Those logs are the single most useful thing for debugging — paste them into a new Claude session along with what you were trying to do.

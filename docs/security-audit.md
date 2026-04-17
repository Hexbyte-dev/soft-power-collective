# Security & Error Audit — The Soft Power Collective

**Date:** 2026-04-15
**Auditor:** Automated (Claude Code)
**Scope:** Full codebase — server.js, 7 HTML files, script.js, dependencies, static assets

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 1     |
| High     | 2     |
| Medium   | 5     |
| Low      | 5     |
| Info     | 4     |
| **Total**| **17**|

**Overall assessment: Ship with caveats.** One critical credential issue must be resolved before any public git push. The high-severity items (no rate limiting, contact form is a no-op) should be addressed before or shortly after launch. Everything else is hardening.

---

## 1. Secret / Credential Exposure

**[SEVERITY: critical]** — Real API key present in `.env` file
The `.env` file contains a live Kit (ConvertKit) API key (`KIT_API_KEY=ljjaY89CTdqCZDWl5i1USg`). While `.env` IS listed in `.gitignore` and is NOT tracked by git (`git ls-files .env` returned empty), this key is still a risk if the repo is ever pushed without the gitignore in place, if backups capture it, or if the file is accidentally shared. The key was also visible to this audit process. **Recommended:** Rotate the key after confirming the gitignore is solid. Consider using a secrets manager for production.

**[SEVERITY: low]** — KIT_FORM_ID hardcoded as fallback in server.js
Line 19: `const KIT_FORM_ID = process.env.KIT_FORM_ID || '9335347';` — The form ID is not secret (it's a public form endpoint), but hardcoding it means a code change is needed to switch forms. Minor.

**[SEVERITY: info]** — `.env.example` contains a real form ID
The `.env.example` file has `KIT_FORM_ID=9335347`. This is fine since form IDs are public, but noting for completeness.

**[SEVERITY: info]** — `.gitignore` coverage is adequate
`.env`, `.env.local`, `node_modules/`, `.superpowers/` are all covered. No issues found.

---

## 2. Content Security Policy (CSP)

**[SEVERITY: medium]** — `script-src 'unsafe-inline'` allows inline script injection
The CSP includes `scriptSrc: ["'self'", "'unsafe-inline'"]`. This weakens XSS protection significantly because any injected inline `<script>` tag would execute. Currently, the site has NO inline `<script>` blocks in any HTML file — all JS is loaded from `script.js`. **However**, the contact form uses an inline `onsubmit` handler (see finding below), which is the reason `script-src-attr 'unsafe-inline'` exists. If that handler is moved to script.js, both `'unsafe-inline'` directives could potentially be removed. **Recommended:** Move the contact form's `onsubmit` handler to `script.js`, then remove `'unsafe-inline'` from `scriptSrc` and `scriptSrcAttr`. If removal breaks something, use nonce-based CSP instead.

**[SEVERITY: medium]** — `script-src-attr 'unsafe-inline'` required by contact form `onsubmit`
`contact.html` line 157 has: `onsubmit="event.preventDefault(); alert('Thank you...'); this.reset();"`. This inline event handler is the sole reason `scriptSrcAttr: ["'unsafe-inline'"]` is needed. Moving this to script.js would allow removing the directive entirely.

**[SEVERITY: low]** — `img-src https:` allows loading images from any HTTPS source
`imgSrc: ["'self'", 'data:', 'https:']` means any HTTPS image URL can be loaded. Currently all images are self-hosted. This is likely intentional for flexibility (e.g., future CDN or external book cover images), but it could be tightened to specific domains if desired.

**[SEVERITY: info]** — Missing optional CSP directives
The following directives are not set (they fall back to `default-src 'self'`, which is fine): `style-src-attr`, `worker-src`, `manifest-src`, `base-uri`, `object-src`. Consider adding `object-src 'none'` and `base-uri 'self'` explicitly for defense-in-depth.

---

## 3. Server-Side Security

**[SEVERITY: high]** — No rate limiting on `/api/subscribe` endpoint
The subscription endpoint has no rate limiting. An attacker could flood it with requests, which would: (a) exhaust your Kit API quota, (b) potentially get your Kit API key rate-limited or banned, (c) waste server resources. **Recommended:** Add `express-rate-limit` middleware — e.g., 5 requests per IP per minute on `/api/subscribe`.

**[SEVERITY: medium]** — No email format validation on server side
Line 50: `const email = req.body.email_address || req.body.email;` — The server checks that email is truthy (`if (!email)`) but does not validate that it's actually an email address. An attacker could POST `email_address: "not-an-email"` or even a very long string. The Kit API will likely reject invalid emails, but validating server-side prevents unnecessary API calls and potential abuse. **Recommended:** Add a regex or library-based email validation before forwarding to Kit.

**[SEVERITY: low]** — `source` field passes user input to Kit without sanitization
Line 52: The `source` field is taken from `req.body.source` or `req.body.fields.source` and passed directly to the Kit API. While Kit likely sanitizes on their end, passing unvalidated user input to a third-party API is not ideal. **Recommended:** Validate `source` against an allowlist of known values (e.g., "home", "about", "programs", "book-club", "the-collective", "quiz").

**[SEVERITY: low]** — 404 handler serves `index.html` for all unknown routes
Line 111-113: Any request to a non-existent route returns `index.html` with a 404 status code. This is a common SPA pattern but can be confusing since the user sees the homepage content but with a 404 status. It also means directory traversal attempts get a 200-byte homepage instead of a proper error. Not a security vulnerability but worth noting. The `path.join` in the `/:page` route (line 105) is safe against directory traversal because Express's `sendFile` resolves relative to `PUBLIC_DIR`.

**[SEVERITY: info]** — Error responses are clean
The server returns generic error messages (`"email required"`, `"server not configured"`, `"subscription failed"`) and never leaks stack traces, file paths, or the API key to the client. This is good.

---

## 4. Client-Side Security

**[SEVERITY: medium]** — Contact form is a non-functional placeholder (uses `alert()` + `preventDefault()`)
`contact.html` line 157: `onsubmit="event.preventDefault(); alert('Thank you for reaching out! We\'ll be in touch soon.'); this.reset();"` — This form does NOT actually send the message anywhere. It shows an alert and resets, giving the user a false impression that their message was sent. This is not a security issue but is a significant functional bug for a contact page. **Recommended:** Either wire this up to an API endpoint (or mailto) or clearly label it as a placeholder.

**[SEVERITY: low]** — No XSS vectors found in script.js
`script.js` does not use `innerHTML`, `outerHTML`, `document.write`, `eval()`, or `Function()`. All DOM manipulation is class-based (`classList.add/remove`). The `fetch()` call to `/api/subscribe` has proper error handling. No user input is rendered into the DOM. Clean.

---

## 5. Dependency Audit

**[SEVERITY: info] (positive)** — `npm audit` reports 0 vulnerabilities
All four dependencies (compression, dotenv, express, helmet) are clean. The `engines` field correctly requires Node >= 18.0.0.

---

## 6. HTML Validation / Errors

**[SEVERITY: medium]** — `<style>` block placed after `</body>` in `programs.html`
Lines 209-214 of `programs.html` contain a `<style>` block that appears AFTER the closing `</script>` tag but technically before `</html>`. While browsers will still apply these styles, this is invalid HTML. The `<style>` block should be in the `<head>` or within the `<body>`. **Recommended:** Move the responsive styles into the `<head>` or into `styles.css`.

**[SEVERITY: low] (positive)** — All images have `alt` attributes
Every `<img>` tag across all 7 HTML files includes a descriptive `alt` attribute. Good accessibility practice.

**[SEVERITY: info] (positive)** — All HTML files are well-structured
All 7 HTML files have proper `<!DOCTYPE html>`, `<html lang="en">`, `<meta charset>`, `<meta viewport>`, and valid nesting. No unclosed tags found. All form inputs have appropriate `type` attributes. External links use `target="_blank" rel="noopener noreferrer"`.

---

## 7. General Errors / Broken Links

**[SEVERITY: high]** — Contact form does not send messages (functional gap)
As noted in section 4, the contact form on `contact.html` uses `event.preventDefault()` + `alert()` — messages typed by users are silently discarded. For a live site this is a critical UX issue: visitors think they've contacted Casey but haven't. **Recommended:** This needs a backend endpoint or integration (e.g., email forwarding service, form backend like Formspree, or a custom `/api/contact` route).

**All routes return 200:** `/`, `/about`, `/programs`, `/bookclub`, `/collective`, `/contact`, `/quiz` — all verified.

**All images load:** All 10 images in `public/images/` plus `favicon.ico` return HTTP 200.

**External links (not curl-verified but reviewed):**
- Book links all point to `betterworldbooks.com` — plausible URLs with ISBNs, likely valid.
- Instagram link: `https://instagram.com/thesoftpowercollective` — cannot verify account existence without fetching.
- Email: `thesoftpowercollective@gmail.com` — appears in all footers consistently. Not verifiable but consistent.

**No `logo.png` reference in HTML:** The file `public/images/logo.png` exists but is not referenced in any HTML file. It may be unused or referenced only in CSS.

**OG image paths are relative:** `<meta property="og:image" content="/images/og-image.png">` — This will only work if the site has a proper domain. Social media crawlers need an absolute URL (e.g., `https://yourdomain.com/images/og-image.png`). This will not generate link previews until fixed. **Severity: low** — not a security issue but affects social sharing.

---

## Recommendations Priority

1. **Rotate the Kit API key** after confirming gitignore protection (critical)
2. **Add rate limiting** to `/api/subscribe` (high)
3. **Wire up the contact form** to actually send messages (high)
4. **Move inline `onsubmit` handler** to script.js and tighten CSP (medium)
5. **Add server-side email validation** (medium)
6. **Fix `<style>` placement** in programs.html (medium)
7. **Add OG image absolute URLs** when domain is known (low)

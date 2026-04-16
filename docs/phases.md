# The Soft Power Collective — Launch Phases

> Reference document for what ships at initial launch (**Phase 1**) vs. what's preserved for later (**Phase 2**).
> Last updated: 2026-04-15

The goal of splitting into phases is to keep Phase 1 **small, focused, and achievable**. Everything in Phase 2 is a "yes, eventually" — not abandoned. Content is preserved here so nothing gets lost.

---

## Phase 1 — Launch Now

The initial public site. Lean, credible, and ready for first visitors.

### Pages live at launch

| Page | Purpose | Status |
|------|---------|--------|
| **Home** (`index.html`) | Brand introduction, tagline, offerings overview, email capture | Keep as-is, replace placeholder portrait + logo |
| **About** (`about.html`) | Casey's story, approach, credentials | 3-card "My Approach" grid (Trauma-Aware card already removed) |
| **Programs** (`programs.html`) | What's offered — coaching, mentorship, events | **Trimmed** (see removals below) |
| **Book Club** (`bookclub.html`) | Monthly reads, signup | Keep — lowest-lift, highest-signal offering |
| **Contact** (`contact.html`) | Contact form, FAQ, email/Instagram | Keep — needs integration (Formspree or similar) |

### What's offered in Phase 1

**Peer Coaching Circles** — monthly themed group conversations
- All 9 example themes currently on the Programs page stay
- Pricing: "Inquire About Pricing" (no public number yet)

**Mentor Pairings** — only these pairing types:
- **Sub to Sub**
- **Couples Mentorship**

**Workshops + Events** — only these event types:
- **Daytime Meetups** (discussion-based, theme-driven)

**Book Club** — all 4 current books stay
(Polysecure, The Topping Book, The Bottoming Book, The Ethical Slut)

**Email capture** — on home, programs, book club, and quiz pages
(Needs wiring to ConvertKit/Mailchimp/Flodesk before launch)

### Nav at launch
Home · About · Programs · Book Club · Connect

(The Quiz link gets removed in Phase 1 — see Phase 2 below.)

---

## Phase 2 — Deferred

These are good ideas, not launch-ready. Each entry below keeps the existing copy + asset notes so we can restore quickly when it's time.

### 2.1 — Dom to Dom Mentorship

**Why deferred:** Requires a founding group of experienced Doms willing to mentor, plus screening/onboarding protocol.

**Where it lives now:** `public/programs.html`, Section 3C "Mentor Pairings" — first card (lines ~103-113).

**Preserved copy:**
> **Dom to Dom** — A space to ask questions, share experiences, and learn methods from those who understand the weight and responsibility of dominance.

**Before launching:**
- [ ] Minimum 3 Dom mentors committed
- [ ] Screening/application flow defined
- [ ] Boundary / discretion expectations documented

---

### 2.2 — After Dark Events

**Why deferred:** Requires a vetted venue partner, a safety/consent framework, and a named first event before it's ready to advertise.

**Where it lives now:** `public/programs.html`, Section 3D "Workshops + Events" — second card (lines ~162-173).

**Preserved copy:**
> **After Dark** — Social and experiential events that carry the SPC mission of safety and intentionality into the evening hours.

**Before launching:**
- [ ] Confirmed venue partner (Bound Studio or similar)
- [ ] Documented safety / consent / vetting protocol
- [ ] First event on the calendar with date, location, ticketing

---

### 2.3 — Retreats

**Why deferred:** Already marked "Coming Soon" on the site. Highest-lift offering — multi-day, multi-instructor, venue partnership required.

**Where it lives now:** `public/programs.html`, Section 3D "Workshops + Events" — third card (lines ~174-183).

**Preserved copy:**
> **Retreats** — Weekend immersion experiences: shibari intro, breathwork, guided meditation, deeper kink exploration, and confidence building through play.

**Before launching:**
- [ ] Venue partnership locked
- [ ] Co-facilitators identified (shibari, breathwork, meditation)
- [ ] Pricing model
- [ ] Dates on the calendar

---

### 2.4 — The Soft Power Quiz

**Why deferred:** The quiz itself doesn't exist yet — it's a dashed-border "Coming Soon" placeholder. Building it well is its own project (question design, typology, personalized email results).

**Where it lives now:** `public/quiz.html` (entire page), plus the "Take the Soft Power Quiz" CTA button on the home page hero (`public/index.html` line ~58).

**Preserved idea:**
> A quiz to help users discover their "Soft Power type" — how they naturally approach power, intimacy, and connection. Results delivered by email with personalized resources.

**Before launching:**
- [ ] Quiz questions + typology designed
- [ ] Platform chosen (Typeform, Interact, custom)
- [ ] Email automation set up to deliver results
- [ ] Landing page for each result type

**Phase 1 action:** remove the Quiz nav link, remove the home hero CTA, archive `quiz.html` (don't delete — just don't link to it).

---

### 2.5 — Peer Coaching Circle Example Themes (public list)

**Why deferred:** Listing 9 specific themes publicly implies each has a schedule, a facilitation guide, and a running cadence. Until those are in place, showing the list creates expectations we can't fulfill. Kept internally as the planning menu; shown publicly once the circle rhythm is real.

**Where it lived:** `public/programs.html`, Section 3B "Peer Coaching Circles" — right column "Example Themes" (removed 2026-04-16).

**Preserved theme list (verbatim):**

- **Kink & What Drives You** — BDSM test and open discussions
- **Top Three Aftercare Needs** — How to define and practice each
- **Open Relationships & Conscious Kink** — Non-monogamy and intentional play
- **Is Poly for Me?** — Ethical Slut discussions
- **Finding Your Baseline** — How to come back to yourself
- **The Search for the Perfect Dynamic** — Dom/sub exploration
- **Safety as a Unicorn** — Navigating with confidence
- **Emotional Security** — Opening our relationship
- **Sobriety & Kink** — Exploration without substances

**Before re-launching publicly:**
- [ ] Rolling schedule (e.g., 1 theme/month for 6-9 months)
- [ ] Facilitation notes / prompts for each theme
- [ ] Handout template
- [ ] Journal prompt card template
- [ ] Registration flow (email list, seat cap, location/virtual)

---

### 2.6 — Events Calendar (Google Calendar integration)

**Why deferred:** No recurring event cadence yet. Building calendar infrastructure before there are events to populate it creates "coming soon" debt and makes the site feel unfinished. Wait until 2-3 confirmed events exist.

**Concept:** A public events calendar on the site, synced with Casey's Google Calendar. Visitors see upcoming events (daytime meetups, book club, future workshops) and can RSVP or add to their own calendar.

**Implementation options (easiest → most branded):**
1. **Public Google Calendar link** — make her calendar public, link to it from Events page. ~5 min.
2. **Google Calendar iframe embed** — paste the embed snippet on the Events page. ~10 min. Looks like Google Calendar.
3. **Custom event list via Google Calendar API** — server fetches events, renders them in SPC brand style. ~1-2 hours + Google Cloud OAuth setup. Best visual match.
4. **Booking platform (Calendly / Acuity)** — syncs to Google Calendar automatically, adds 1:1 coaching booking alongside events. Best if booking is also desired.

**Recommendation when ready:** Start with option 2 for fastest launch, upgrade to option 3 or 4 once event cadence is established.

**Before launching:**
- [ ] 2-3 confirmed events on the calendar
- [ ] Decision on embed vs. custom vs. booking platform
- [ ] Dedicated Events page in nav, or section on an existing page
- [ ] Google Calendar access (either public or API credentials)

---

### 2.7 — Photo Gallery (About page)

**Why deferred:** Gallery previously existed as 6 placeholder tiles (Portrait, Community, Lifestyle, Nature, Connection, Moments) on the About page with no real photos. Empty placeholders read as "unfinished" rather than "curated." Removed until there's real imagery to fill it.

**Where it lived:** `public/about.html`, Section 2D — between "Background & Continued Learning" and the Email Signup (removed 2026-04-16).

**Preserved tile concept (6 themes):**
- Portrait
- Community
- Lifestyle
- Nature
- Connection
- Moments

**Before re-launching:**
- [ ] 6+ real photos, ideally in consistent visual treatment (golden hour, film grain, or a deliberate mix)
- [ ] Decision on whether to keep these 6 themed categories or let the imagery speak for itself without labels
- [ ] Alt text for each photo
- [ ] Image optimization (web-friendly dimensions + file sizes under ~250KB each)
- [ ] Optional: lightbox interaction so clicking a tile opens it larger

---

### 2.8 — Pricing page (standalone)

**Why deferred:** A dedicated pricing page only makes sense once program prices are set. Phase 1 uses "Inquire About Pricing" CTAs instead.

**Where it lives now:** Currently a section on `programs.html` (Section 3E, lines ~191-200) that links to Contact. That stays.

**Before launching:** Just need prices decided.

---

## Summary: what physically changes in the codebase for Phase 1

When you approve this doc, the next step is for me to make these edits to the live site:

1. **`public/programs.html`** — remove the Dom-to-Dom, After Dark, and Retreats cards. The Mentor Pairings section will have 2 cards (Sub-to-Sub, Couples) instead of 3. The Workshops + Events section will have 1 card (Daytime Meetups) — may need to adjust layout since a single card in a 3-column grid looks lonely. Two options: center it, or restructure as a feature block.
2. **`public/index.html`** — remove the "Take the Soft Power Quiz" hero CTA. The "Explore the Collective" button becomes the single primary CTA.
3. **All pages' nav** — remove the "Quiz" link.
4. **Footer Quick Links** — remove the "Quiz" entry.
5. **`public/quiz.html`** — leave the file in place (so nothing breaks if someone has the URL), but it's no longer linked from anywhere.

---

## Open questions for Casey

Things to decide before/during Phase 1:

1. **Email platform** — ConvertKit, Mailchimp, or Flodesk? (Determines how we wire the signup forms.)
2. **Contact form backend** — Formspree is simplest; Railway-hosted custom endpoint is more work but lets you save submissions to a database later.
3. **Real photography / portrait** — the home + about pages both have placeholder portrait SVGs. Headshot + any brand imagery should land before launch.
4. **Real logo file** — Downloads has `The Soft Power Collective Logo.png`. Need to swap it in for the SVG placeholder on the hero.
5. **Workshops + Events layout** — with only Daytime Meetups in Phase 1, do we keep that section, reframe it ("Events" singular), or move it into the Coaching Circles section?
6. **Public name** — **Casey Lynn**. Real name in public use.

---

## Founder reflections & writing seeds

A place to park thoughts, quotes, and framings to return to later — as Casey builds out her voice, content pillars, and the eventual essay / manifesto / about-me long form.

### Seed — 2026-04-16: Hard power → harm power

> *"Where the hard power turns into harm power. We need the balance of the soft power and the healing of the hard power."*
> — Casey Lynn

**Direction to develop:** Compare the effects of **late-stage capitalism** on humans to the effects of **late-stage patriarchy** on humans. Both systems extract, commodify, and disconnect bodies from their own knowing. Soft power as the corrective — not a rejection of power itself, but a rebalancing. The hard power isn't evil; left unchecked, it hardens into harm. The work: help people recognize where that tipping point is in their own lives, their relationships, their bodies.

Possible homes when developed:
- A long-form essay on the About page
- A content pillar for newsletter writing
- A talk / podcast framing
- Foundation for the philosophical section of a future book

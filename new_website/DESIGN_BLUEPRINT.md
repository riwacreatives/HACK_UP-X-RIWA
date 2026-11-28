# REDRAFTED DESIGN BLUEPRINT — HACK UTTAR PRADESH 2026
> **Architecture:** 100% Static High-Performance Web Experience
> **Registration Integration:** Official Unstop Portal (`https://unstop.com/hackathons/hack-uttar-pradesh-2026-riwa-creatives-1817499`)
> **Visual Identity:** Official Riwa Media Theme (Warm Paper Cream `#F5EFEB`, Deep Midnight Navy `#0C1B2A`, Saffron Orange `#EF6627`, Emerald Green `#169855`)
> **Animation Specification:** Falling Sun Inspired (Infinite Dual Marquees, 60fps Interactive Celestial/Grid Canvas, 2.5D Spring-Press Physics, Floating Badges, Dynamic Arena Accordions, Live Ticking Countdown)

---

## 1. DESIGN SYSTEM & TOKENS

```css
:root {
  /* Surfaces & Canvas */
  --bg-canvas: #f5efeb;         /* Official Warm Paper Cream */
  --bg-card: #ffffff;           /* Crisp White Card Surface */
  --bg-navy: #0c1b2a;           /* Deep Midnight Navy (Text & Heavy Borders) */
  --bg-orange: #ef6627;         /* Vibrant Saffron/Sunset Orange */
  --bg-green: #169855;          /* Bharat Emerald Green */
  
  /* Text & Ink */
  --text-primary: #0c1b2a;      /* High-contrast Midnight Navy */
  --text-muted: #536473;        /* Slate Navy for secondary descriptions */
  --text-light: #f5efeb;        /* Cream text on Navy & Orange blocks */
  --text-orange: #ef6627;       /* Orange Accent Text */
  --text-green: #169855;        /* Green Accent Text */

  /* Neo-Brutalist Hard Shadows */
  --border-main: 2.5px solid #0c1b2a;
  --border-thin: 1.5px solid #0c1b2a;
  --shadow-btn: 5px 5px 0px #0c1b2a;
  --shadow-card: 6px 6px 0px #0c1b2a;
  --shadow-heavy: 8px 8px 0px #0c1b2a;
  --shadow-orange: 6px 6px 0px #ef6627;
  --shadow-green: 6px 6px 0px #169855;

  /* Typography */
  --font-display: 'Londrina Solid', Impact, sans-serif;
  --font-hand: 'Caveat Brush', cursive;
  --font-tech: 'Space Grotesk', system-ui, sans-serif;
}
```

---

## 2. OFFICIAL ASSETS MAPPED

1. `assets/logo_lockup.png`: Header navigation brand logo
2. `assets/icon_badge.png`: Favicon & floating stamp badge
3. `assets/banner_main.png` & `assets/banner_wide.png`: High-res hero graphics
4. `assets/poster_hero_starts.jpg`: "The Build Starts Here" hero section badge
5. `assets/poster_five_arenas.jpg`: "Five Building Arenas" section illustration
6. `assets/poster_how_it_works.jpg`: "Bring a team. Build something real." 3-step hybrid route
7. `assets/poster_ready_to_build.jpg`: Unstop registration callout poster
8. `assets/sponsor_adaption_labs.jpg`: Official Sponsor highlight: Adaption Labs

---

## 3. SECTIONS FLOW & ANIMATION BLUEPRINT

1. **Header Navigation:**
   * Live status badge: `● REGISTRATIONS ACTIVE ON UNSTOP` (pulsing emerald green dot)
   * Official logo lockup + navigation links: `About`, `How it Works`, `Arenas`, `Prizes`, `Schedule`, `Sponsors`, `FAQs`
   * Tactile punch CTA button: `REGISTER ON UNSTOP ↗`
2. **Hero Section (Interactive Poster + Canvas Engine):**
   * Background: 60fps interactive canvas with retro wireframe terminal mesh and floating code particles responding to mouse hover.
   * Kicker: `OPEN-SOURCE × FRONTIER-TECH • 75 DISTRICTS • LUCKNOW & GR. NOIDA`
   * Titan Headline: `HACK UTTAR PRADESH 2026`
   * Subtitle Badge: `LOCAL CHALLENGES. WORLD-CLASS BUILDS.`
   * High-contrast CTA Box:
     * Massive tactile button: `REGISTER ON UNSTOP →` (links to `https://unstop.com/hackathons/hack-uttar-pradesh-2026-riwa-creatives-1817499`)
     * Live Countdown Timer: Ticking days, hours, minutes to registration deadline.
   * 4 Quick Highlight Ticket Stamps:
     * `01 // ₹45,000+ CASH` (Direct PPO / PPI Pipelines)
     * `02 // 75 DISTRICTS` (Statewide representation)
     * `03 // ₹10,00,000` (Seed Incubation Term Sheet)
     * `04 // OPEN GREENS` (Outdoor lawn workstations along Gomti Riverfront)
3. **Dual Infinite Marquee Ribbons:**
   * Ribbon 1 (Navy & Orange): `* 75 DISTRICTS * FROM UTTAR PRADESH, BUILDING FOR BHARAT * CODE / CREATE / CHANGE * 240 FINALISTS * REGISTER ON UNSTOP *`
   * Ribbon 2 (Reverse Cream & Green): `* AI & VERNACULAR TECH * ODOP HERITAGE * AGRITECH * SPATIAL CIVIC WEB * OPEN FINTECH * ADAPTION LABS *`
4. **How It Works (The 3-Step Route):**
   * Styled directly from Poster 03/04:
     * Card 01 (Navy): **HYBRID** — Online rounds → in-person finale.
     * Card 02 (Orange): **TEAM UP** — 1-4 builders (Solo or squad with Discord matchmaking).
     * Card 03 (Green): **FREE ENTRY** — 100% free for all eligible builders.
5. **The Five Building Arenas (Interactive Filter & Detail Cards):**
   * Dynamic tabs with smooth accordion transitions:
     * `01 AI FOR BHARAT + VERNACULAR TECH`
     * `02 ODOP + CULTURAL HERITAGE`
     * `03 AGRITECH + CLIMATE RESILIENCE`
     * `04 SPATIAL WEB + SMART CIVIC SYSTEMS`
     * `05 OPEN INNOVATION + NEXT-GEN FINTECH`
6. **Open Greens Experience (Lawn Workstations):**
   * Visual feature grid with starlit coding, 10 Gbps mesh Wi-Fi, solar battery hubs, and 24/7 kulhad chai.
7. **Rewards & Career Pipelines:**
   * 🥇 1st Place Champion: ₹20,000 Cash + Direct PPO + ₹10L Incubation Term Sheet
   * 🥈 2nd Place Runner-Up: ₹15,000 Cash + Direct PPI
   * 🥉 3rd Place 2nd Runner-Up: ₹10,000 Cash + Direct PPI
   * Merch & Bounties: ₹19,000+ official swag kits
8. **Featured Sponsor Spotlight:**
   * Adaption Labs announcement card ("Building Intelligence That Adapts").
9. **Timeline & Postal Dispatch Sprints:**
   * Interactive timeline with status indicators:
     * Phase 1: Online Registration on Unstop
     * Phase 2: Online Prelims & Virtual Workshops
     * Phase 3: Shortlist (60 Squads / 240 Finalists)
     * Phase 4: Grand Finale in Lucknow & Greater Noida
10. **Frequently Asked Questions (Interactive Accordion):**
    * 5 accordion cards with smooth expanding animations.
11. **Footer & Unstop Floating Dock:**
    * Sticky micro-dock with "Hack Uttar Pradesh 2026 is officially live on Unstop" + "Register on Unstop →" button.

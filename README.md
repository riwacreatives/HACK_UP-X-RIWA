# Hack Uttar Pradesh 2026 | Official Platform
*Powered by Riwa Creatives Foundry ([riwacreatives.in](https://riwacreatives.in))*

[![Registration Live on Unstop](https://img.shields.io/badge/Unstop-Apply%20Now-EF6627?style=for-the-badge&logo=unstop&logoColor=white)](https://unstop.com/hackathons/hack-uttar-pradesh-2026-riwa-creatives-1817499)
[![Framework](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Design System](https://img.shields.io/badge/Design-Neo--Brutalist%20Risograph-0F172A?style=for-the-badge)](https://unstop.com/hackathons/hack-uttar-pradesh-2026-riwa-creatives-1817499)
[![Deploy on Vercel](https://img.shields.io/badge/Vercel-Production%20Ready-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> **75 Districts • One Confluence • उत्तर प्रदेश 2026**  
> Northern India's premier hybrid hackathon uniting 240 elite builders, engineers, and designers across all 75 districts of Uttar Pradesh.

---

## 🌿 About Hack Uttar Pradesh 2026

**Hack Uttar Pradesh 2026** is India's first **Open Greens Hackathon**. Moving beyond sterile indoor auditoriums, shortlisted finalist squads assemble at open-air lawn workstations in **Lucknow** (Gomti Riverfront) and **Greater Noida** (Expressway Tech Hub) equipped with 10 Gbps outdoor mesh Wi-Fi, solar battery hubs, 24/7 kulhad chai bars, campfire founder circles, and starlit night coding.

### 📅 Key Milestones
- **Phase 01 (Registrations Open):** Until December 31, 2025 on [Unstop](https://unstop.com/hackathons/hack-uttar-pradesh-2026-riwa-creatives-1817499)
- **Phase 02 (Online Prelims & Mentorship):** January 01 – January 08, 2026
- **Phase 03 (Finalist Squad Shortlist):** January 09, 2026 *(Top 60 Squads / 240 Finalists)*
- **Phase 04 (In-Person Grand Finale):** January 10 – January 15, 2026 *(Finale: Jan 11)*

### 🏆 Prize Pool & Fast-Track Pipelines
- **₹45,000+ Direct Cash Grants:**
  - 🥇 **1st Place Champion:** ₹20,000 Cash + Guaranteed Direct PPO + ₹10,00,000 Seed Term Sheet Evaluation
  - 🥈 **2nd Place Runner-Up:** ₹15,000 Cash + Direct PPI Fast-Track Bypass
  - 🥉 **3rd Place Runner-Up:** ₹10,000 Cash + Direct PPI Opportunity with Hiring Alliance
- **₹19,000+ in Track Bounties & Builder Swag:** Official Riwa hackathon hoodies, vacuum bottles, and developer starter kits.

---

## 🎨 Design System: Tactile Postage-Stamp & Risograph

The platform features an authentic **Neo-Brutalist Risograph** aesthetic inspired by tactile print media and philatelic stamp design:
- **Perforated Scallop Edges:** Scalloped cutouts dynamically calibrated to canvas backgrounds (`radial-gradient` masks).
- **Inner Dashed Border:** Scalloped dashed border frame with warm hover illumination.
- **Magnetic 3D Perspective Micro-Tilt:** Cards smoothly track mouse position on hover (`perspective(900px)` with 60 FPS lerp physics).
- **Holographic Prismatic Sweep:** Multi-stop iridescent foil sheen reflection across cards.
- **Rubber-Stamp Imprint Waves & Sparkles:** Tactile 70ms mechanical press-down (`:active`), radial ink ripple waves, and floating metallic foil sparkles on click.
- **Dual-Speed Retro Marquee Ribbon:** High-contrast ticker tape highlighting regional corridors.

---

## 🛠️ Tech Stack & Architecture

- **Bundler / Dev Server:** [Vite 6.0](https://vitejs.dev/)
- **Core Technologies:** Semantic HTML5, Modular CSS3, Vanilla JavaScript (ES2022)
- **Interactive Canvases:** Hardware-accelerated 2D Canvas with auto-pausing `IntersectionObserver`
- **Typography:** Space Grotesk, Spline Sans Mono, Newsreader, Red Hat Display
- **Deployment Platform:** [Vercel](https://vercel.com/) (configured via `vercel.json`)

---

## 🚀 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The site runs locally at `http://localhost:3000/`.

### 3. Production Build
```bash
npm run build
```
Compiles and optimizes assets into the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## ☁️ Deployment on Vercel

The repository is pre-configured with [`vercel.json`](vercel.json) for instant, zero-config deployment:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true
}
```

### Automatic Deployments via GitHub
1. Connect the GitHub repository `riwacreatives/HACK_UP-X-RIWA` in your [Vercel Dashboard](https://vercel.com/dashboard).
2. Every push to the `main` branch triggers an automated global edge deployment.

### Manual CLI Deployment
```bash
npx vercel
npx vercel --prod
```

---

## 📂 Repository Layout

```
.
├── new_website/              # Active production source files
│   ├── index.html            # Main semantic HTML document
│   ├── style.css             # Complete design system & responsive styling
│   ├── animation.js          # Interactive canvas, tilt physics, cursor & card effects
│   ├── DESIGN_BLUEPRINT.md   # Architectural design token blueprint
│   └── assets/               # Photography, vector banners, sponsor graphics
├── old_website/              # Archived previous website version and documents
├── vercel.json               # Vercel production build & routing config
├── package.json              # Project scripts & Vite dev dependency
├── package-lock.json         # Dependency lockfile
├── .gitignore                # Git ignore rules (node_modules, dist, .vercel)
└── README.md                 # Official platform documentation
```

---

## 🤝 Ecosystem Partners & Contact

- **Organizer:** Riwa Creatives Foundry ([riwacreatives.in](https://riwacreatives.in))
- **Official Sponsor:** Adaption Labs (*Building Intelligence That Adapts*)
- **Portal & Registrations:** [Unstop Portal](https://unstop.com/hackathons/hack-uttar-pradesh-2026-riwa-creatives-1817499)
- **Sponsorship Inquiries:** [riwacreatives@gmail.com](mailto:riwacreatives@gmail.com)
- **Official Community:** [Discord & WhatsApp Alliance](https://unstop.com/hackathons/hack-uttar-pradesh-2026-riwa-creatives-1817499)

---
*© 2026 Riwa Creatives Foundry. All rights reserved.*

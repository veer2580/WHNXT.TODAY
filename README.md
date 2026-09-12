# WHNXT.TODAY — Future Intelligence Platform

> **SEE WHAT COMES NEXT.**  
> A cinematic, luxury 3D cosmic web experience built for **WHNXT.TODAY**, **ANTELLAY LABS**, and **Celebso Group**.

---

## ✦ Key Features

- **Procedural 3D WebGL Cosmic Environment**:
  - 40,000+ multi-spectral scintillating stars with proximity near-fade (no camera glare).
  - Volumetric galactic nebula dust clouds with organic breathing shaders.
  - Procedural shooting stars (meteors) and interactive stardust cursor trail tracking in 3D space.
- **Cinematic Scroll Narrative**:
  - `SIGNALS` → `PATTERNS` → `INTELLIGENCE` → `POSSIBILITY` → `WHAT'S NEXT?` → `SEE WHAT COMES NEXT`.
  - Driven by GSAP & ScrollTrigger with word-by-word reveal, tracking contractions, and depth parallax.
- **About Us & Founder Profile (`about.html`)**:
  - Complete future intelligence manifesto: *"The future doesn't arrive without signals."*
  - 5-Step Approach Pipeline with custom vector geometry.
  - Founder profile of **Veer Singh** (Founder, CEO & Chairman — Celebso Group; Founder — ANTELLAY LABS) with high-res portrait and quote.
  - Action pillars: `OBSERVE.`, `UNDERSTAND.`, `EXPLORE.`, `ACT.`.
- **Interactive Meeting Scheduler & Consultation Intake (`contact.html` & Page 3)**:
  - Interactive calendar with month navigation and available time slots.
  - Interactive 3-step questionnaire modal routing directly to [Calendly (30-min consultation)](https://calendly.com/space-antellay/30min).
- **Cloudflare Ready**:
  - Configured for zero-config deployment to **Cloudflare Workers** (with Static Assets binding) and **Cloudflare Pages**.

---

## ✦ Technology Stack

- **Core**: Vanilla HTML5, CSS3, ES Modules
- **3D Graphics**: [Three.js](https://threejs.org/) (Custom GLSL Shaders, Points, BufferGeometry)
- **Animation**: [GSAP](https://greensock.com/gsap/) + ScrollTrigger
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Deployment**: [Cloudflare Wrangler](https://developers.cloudflare.com/workers/wrangler/)

---

## ✦ Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` or `pnpm`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/<your-username>/whnxt-today.git

# Navigate into the project folder
cd whnxt-today

# Install dependencies
npm install
```

### 3. Running Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build
```bash
npm run build
```
The optimized production bundle will be generated in `./dist`.

---

## ✦ Deployment to Cloudflare

### Deploy to Cloudflare Workers:
```bash
# 1. Log in to Cloudflare (one-time setup)
npx wrangler login

# 2. Deploy
npm run deploy
# or: npx wrangler deploy
```

### Alternative: Deploy to Cloudflare Pages:
```bash
npm run deploy:pages
```

---

## ✦ License & Colophon

© 2026 Futuhr. All rights reserved.  
A venture of **ANTELLAY LABS** • **Celebso Group**.

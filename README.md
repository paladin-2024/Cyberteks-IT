<p align="center">
  <img src="/assets/cyberteks-it-logo-33783fbc-fb2c-484a-b670-9f269d8493cf.png" alt="CyberteksIT" height="84" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Framer%20Motion-11-0055FF?logo=framer&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Three.js-fiber/drei-000000?logo=three.js&logoColor=white&style=for-the-badge" />
</p>

<h1 align="center">CyberteksIT – Future-Ready ICT Website</h1>

> Light, professional tech site with bold red/blue accents, smooth motion, responsive layouts, and a subtle 3D hero.

## ✨ Highlights
- 🎯 Fixed translucent navbar with dropdown services + mobile menu
- 🛰️ Animated hero with 3D background shapes
- 🚀 Marquee strips for trusted companies and testimonials (pause on hover)
- 🧭 Service grid with imagery, hover states, and detailed online skilling dropdown
- 🛒 Product grid with click-to-view modal (pricing/support/lead time)
- ✉️ Contact + Get Started forms with confirmation animation
- 🔤 Sora + Space Grotesk typography for a modern tech feel

## 🛠️ Stack
- React 18 + Vite
- Tailwind CSS 3
- Framer Motion 11
- GSAP (ScrollTrigger)
- Three.js with @react-three/fiber and @react-three/drei
- React Router 7

## 📑 Pages
- Home: hero, why choose us, trusted logos, testimonials carousel, service shortcuts
- About: vision, mission, delivery model, core values
- Services: remote IT, access control, CCTV, VOIP, online skilling, software/AI
- Products: printers, telecom masts, endpoints, biometrics, CCTV systems, digital cameras (modal details)
- Careers: why work with us, who we hire, openings
- Contact: contact details, map placeholder, enquiry form
- Get Started: enrollment form with confirmation state

## 🚀 Getting Started
```bash
npm install
npm run dev
```
Visit the printed URL (default http://localhost:5173). For production: `npm run build` then `npm run preview`.

## 🗂️ Structure
- `src/main.jsx` – app entry
- `src/App.jsx` – routing + transitions
- `src/components/` – shared UI (`Navbar`, `Layout`, `Hero3DBackground`, `SectionHeader`)
- `src/pages/` – page views listed above
- `src/styles.css` – global Tailwind layers and custom utilities
- `tailwind.config.cjs` – design tokens (colors, fonts, animations)

## 🎨 Design Notes
- Light theme, primary colors: red `#E11D48`, blue `#2563EB`, no gradients
- Motion: Framer Motion entrances; GSAP ScrollTrigger for reveal/parallax; marquee animations pause on hover
- 3D: Floating shapes in hero via Three.js fiber/drei
- Accessibility: generous font sizes, contrasty CTAs, clear focus/hover states

## 📦 Assets
All imagery/logos live in `/assets` and are referenced by services/products for brand consistency.

## 🤝 Contributing
PRs welcome. Keep to Tailwind utility patterns, maintain light theme, and respect the primary color system.

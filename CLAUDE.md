# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio website built with Nuxt 4 (Vue 3), Tailwind CSS 4, and Nuxt UI 4. Single-page app with SSR enabled, using a monolithic `app/pages/index.vue` as the sole route.

## Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run generate` — Static site generation
- `npm run preview` — Preview production build

No test runner or linter is configured.

## Architecture

**Single-page portfolio** — All content lives in `app/pages/index.vue` (~530 lines). There are no sub-pages, no shared components, and no state management library. This is intentional for the portfolio's scope.

**Root component** (`app/app.vue`) wraps everything in `<UApp>` from Nuxt UI and renders `<NuxtPage />`.

**Styling** (`app/assets/css/main.css`, ~929 lines) — Tailwind CSS + Nuxt UI imports, custom CSS variables for a dark theme (lime green accent `#c4f553` on dark `#0a0a0f`), three font families (Instrument Serif, DM Sans, JetBrains Mono), and extensive custom animations (fade, slide, float, glow, marquee, cursor effects).

**Contact form** — Uses vee-validate with Zod schemas. Submits directly to the Mailgun API via client-side fetch (no server API route). API key and recipient email come from runtime config (`MAILGUN_API_KEY`, `WEBMASTER_EMAIL`).

**Interactive effects** — Cursor glow, magnetic buttons, scroll-triggered reveals, section tracking, and text cycling animation — all wired up in `onMounted()` using IntersectionObserver, requestAnimationFrame, and manual event listeners. Cleanup happens in `onUnmounted()`.

## Environment Variables

Copy `.env.example` and fill in:
- `MAILGUN_API_KEY` — Mailgun API key for contact form
- `WEBMASTER_EMAIL` — Recipient email address

## Code Style

- **No inline event handlers in templates** — All DOM event listeners and click handlers must be registered in `onMounted()` (and cleaned up in `onUnmounted()` if needed), not as inline `@click` or `v-on` directives in the template. This keeps logic centralized in the script block.

## Key Conventions

- CSS custom properties define the color scheme; change them in `main.css` under `:root`
- Responsive breakpoints: mobile (≤480px), tablet (≤768px), desktop (≥1280px for tech constellation)
- `prefers-reduced-motion` is respected for animations
- Static assets (resume PDF, favicons) live in `public/`

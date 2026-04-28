# Venkatesan & Pavithra — Wedding Invitation

> _Two hearts, one journey._
>
> The official wedding invitation site for Venkatesan & Pavithra — **May 18, 2026** at Rajamalar Thirumana Mahal, Cheyyar, Tamil Nadu.

Live at: <https://two-heart-dreams.vercel.app/>

## Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** with a custom ivory / blush / gold design system
- **Framer Motion** for animations and scroll-linked parallax
- **React Three Fiber** + **drei** for the hero's floating 3D petals & rings
- **shadcn/ui** primitives (Radix UI under the hood)
- **React Router** for routing
- **TanStack Query** for data fetching
- **Vitest** + **Testing Library** for tests

## Getting started

```bash
# Install dependencies (uses your preferred package manager)
pnpm install
# or: npm install / yarn

# Start the dev server (http://localhost:8080)
pnpm dev

# Build for production
pnpm build

# Preview the production build locally
pnpm preview

# Run tests
pnpm test
```

## Project layout

```
public/                Static assets served at site root (incl. og-image.jpg)
src/
  assets/              Imagery imported via Vite (hero bg, gallery, story photos)
  components/
    wedding/           Hero, Story, Gallery, Events, Location, Countdown, RSVP, Footer, …
    ui/                shadcn/ui primitives
  hooks/               Reusable React hooks (use-parallax, use-toast, …)
  pages/               Top-level route pages (Index, Admin, NotFound)
  lib/                 Utilities
index.html             Root HTML — also hosts the SEO meta + JSON-LD structured data
tailwind.config.ts     Tailwind theme (palette, gradients, shadows, fonts)
```

## Customizing the invitation

Most copy lives in [`src/components/wedding/config.ts`](./src/components/wedding/config.ts) — names, dates, venue, contact info. Edit there and the whole site updates.

For the share preview that appears in WhatsApp / Twitter / Facebook / iMessage, edit the `<meta>` tags and JSON-LD inside [`index.html`](./index.html) and replace [`public/og-image.jpg`](./public/og-image.jpg).

## Deployment

The site is deployed on **Vercel**. Pushing to the connected branch triggers an automatic build and deploy.

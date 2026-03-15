# EntrSphere

AI-powered business audits for South African SMEs.

## Live Site

**Production**: https://www.entrsphere.com

## Features

- **Audit Landing Page** (`/`) — marketing page with pricing, social proof, FAQ
- **PayFast Payments** — three tiers: Quick Scan (R2,500), Deep Dive (R6,000), Full Audit (R7,500)
- **Intake Form** (`/intake`) — post-payment business intake form
- **Email Notifications** — automated submission alerts via Resend

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Convex (real-time database)
- **Payments**: PayFast (ZAR)
- **Email**: Resend
- **Analytics**: PostHog
- **Deploy**: Vercel

## Development

```bash
npm install
npm run dev:memory    # Start dev server (memory-safe)
npm run build         # Production build
```

## Environment

Copy `.env.example` to `.env.local` and fill in your values.

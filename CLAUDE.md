# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

EntrSphere is a **productized business audit service** that helps South African SMEs find revenue they're leaving on the table. The site is a marketing landing page + payment flow + intake form.

**Primary goal**: Convert visitors into paying audit customers (Quick Scan R2,500 / Deep Dive R6,000 / Full Audit R7,500).

## Project Tree

```
entrsphere.com/
├── CLAUDE.md                  # THIS FILE — read first every session
├── context/                   # Training materials & learnings
│   ├── brand-voice.md         # Tone, copy standards, approved messaging
│   ├── tech-standards.md      # Code patterns, conventions, gotchas
│   └── product-knowledge.md   # Audit service features, pricing, flows
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx           # Homepage (audit landing page)
│   │   ├── intake/            # Post-payment intake form
│   │   ├── payment/           # PayFast success/cancel flows
│   │   ├── api/
│   │   │   ├── notify/        # Email notifications (Resend)
│   │   │   └── payments/      # PayFast initiate + ITN webhook
│   │   ├── layout.tsx         # Root layout
│   │   └── not-found.tsx      # 404 page
│   ├── components/
│   │   ├── audit/             # Audit landing page sections
│   │   ├── payments/          # PayFastButton
│   │   └── ui/                # shadcn/ui primitives
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities (cn, payfast, pricing, posthog)
│   └── styles/                # Global CSS
├── convex/                    # Backend: schema, mutations, queries
│   ├── schema.ts              # contacts, subscribers, purchases, intakeSubmissions
│   ├── payments.ts            # Payment mutations/queries
│   ├── intakeSubmissions.ts   # Intake form mutations/queries
│   ├── contacts.ts            # Contact submissions
│   └── subscribers.ts         # Email subscribers
├── docs/                      # Strategy docs, marketing copy
└── context/                   # Session learnings, brand voice
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Convex (real-time database)
- **Payments**: PayFast (ZAR)
- **Icons**: Phosphor Icons
- **State**: TanStack React Query
- **Analytics**: PostHog
- **Email**: Resend
- **Deploy**: Vercel (auto-deploy on push to main)

## Rules

### Code Standards
- Use `@/` prefix for all imports (maps to `./src/`)
- Pages in `src/app/` are Server Components by default
- Client components must have `"use client"` at top
- Convex queries/mutations require client components
- Use `npm run dev:memory` to start dev server (avoids heap errors)
- Add shadcn components via: `npx shadcn@latest add [name]` (goes to `src/components/ui/`)

### Environment Variables
- Client-side vars use `NEXT_PUBLIC_` prefix
- Required: `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_APP_URL`
- Payments: `PAYFAST_MERCHANT_ID`, `PAYFAST_MERCHANT_KEY`, `PAYFAST_PASSPHRASE`, `PAYFAST_SANDBOX`
- Email: `RESEND_API_KEY`, `NOTIFY_EMAIL`
- Optional: `NEXT_PUBLIC_POSTHOG_API_KEY`
- Never commit `.env.local` — use `.env.example` as reference

### Business Rules
- SA market first: ZAR pricing, PayFast payments
- Three tiers: Quick Scan (R2,500), Deep Dive (R6,000), Full Audit (R7,500)
- Ship fast, validate with real users before polishing

## Note-Taking Protocol

After completing work in this project, add a dated one-liner to the relevant `context/*.md` file under its **Session Learnings** section. Format:

```
- [observation or preference learned] (learned YYYY-MM-DD)
```

When 3+ related learnings accumulate, graduate them into a new context file.

Always read `context/` files at session start to build on prior learnings.

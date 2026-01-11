---
title: Cohort-Based Waitlist System with Convex
category: integration-issues
tags: [convex, waitlist, cohort-based-access, react, nextjs, kleo-playbook]
components: [waitlist, convex, discovery, ClientProviders]
severity: n/a
date_solved: 2026-01-11
problem_summary: Implemented cohort-based waitlist system applying Kleo.so launch playbook, fixed ConvexProvider hydration issue
root_cause: Feature implementation with ConvexProvider not wrapping children until after mount
solution_summary: Created full waitlist system with Convex backend, fixed provider to use useMemo for immediate client creation
files_modified:
  - convex/schema.ts
  - convex/waitlist.ts
  - src/components/ClientProviders.tsx
  - src/components/waitlist/* (6 components)
  - src/app/waitlist/page.tsx
  - src/components/Header.tsx
  - src/components/discovery/DiscoveryContent.tsx
related_docs:
  - docs/solutions/architecture-decisions/conversation-persistence-latent-demand-discovery.md
  - docs/ENTRSPHERE_MOAT_STRATEGY.md
---

# Cohort-Based Waitlist System with Convex

## Problem Statement

Needed to convert EntrSphere's free Discovery tool to a gated access model using Kleo.so's successful launch playbook:
- Cohort-based releases (25 users per cohort)
- Scarcity messaging with dynamic counters
- Social proof via seeded waitlist (23 initial)
- Email capture at moment of highest intent

## Investigation

### Research Phase
- Analyzed Kleo.so's "show then gate" pattern using browser automation
- Discovered their strategy: show full UI, gate every action behind waitlist modal
- Researched real statistics for copy (Standish Group, Engprax studies)

### Key Design Decisions
- **Cohort size**: 25 (more exclusive feel than 100+)
- **Seed count**: 23 (creates immediate scarcity: "2 spots left")
- **Gate trigger**: Clicking Discovery chat interface opens waitlist modal

## Root Cause

### Bug Encountered
During implementation, the waitlist page threw: "Could not find Convex client! `useQuery` must be used in the React component tree under `ConvexProvider`"

### Analysis
The original `ClientProviders.tsx` used a mount-based pattern:
```typescript
// PROBLEMATIC PATTERN
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);

if (mounted && convexClient) {
  return <ConvexProvider client={convexClient}>{content}</ConvexProvider>;
}
return content; // Children rendered WITHOUT ConvexProvider on first render
```

This caused React hooks in child components to fail because `useQuery` was called before `ConvexProvider` wrapped the tree.

## Solution

### 1. Use Dynamic Imports for Convex Components

The proper solution is to use `dynamic` imports with `ssr: false` for any components that use Convex hooks (`useQuery`, `useMutation`).

**File: src/app/waitlist/page.tsx**
```typescript
"use client";

import dynamic from "next/dynamic";
import { ValueCards, ObjectionCards } from "@/components/waitlist";

// Dynamic imports for Convex-dependent components (no SSR)
const WaitlistHero = dynamic(
  () => import("@/components/waitlist/WaitlistHero").then((mod) => mod.WaitlistHero),
  { ssr: false, loading: () => <div className="animate-pulse">Loading...</div> }
);

const ScarcitySection = dynamic(
  () => import("@/components/waitlist/ScarcitySection").then((mod) => mod.ScarcitySection),
  { ssr: false }
);

const FinalCTA = dynamic(
  () => import("@/components/waitlist/FinalCTA").then((mod) => mod.FinalCTA),
  { ssr: false }
);
```

**Key insight:**
- `ConvexReactClient` requires `window` to exist
- During SSR, `window` is undefined, so the provider can't wrap children
- Components using `useQuery`/`useMutation` fail without the provider
- Solution: Disable SSR for those specific components using `dynamic(..., { ssr: false })`

### 2. Convex Schema Addition

```typescript
// convex/schema.ts
waitlist: defineTable({
  email: v.string(),
  cohort: v.number(),
  position: v.number(),
  joinedAt: v.number(),
  source: v.optional(v.string()),
  accessGranted: v.boolean(),
  accessGrantedAt: v.optional(v.number()),
})
  .index("by_email", ["email"])
  .index("by_cohort", ["cohort"])
  .index("by_joinedAt", ["joinedAt"])
  .index("by_accessGranted", ["accessGranted"]),
```

### 3. Convex Mutations (convex/waitlist.ts)

```typescript
const COHORT_SIZE = 25;
const SEED_COUNT = 23; // Social proof seeding

export const join = mutation({
  args: { email: v.string(), source: v.optional(v.string()) },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      return { success: false, message: "You're already on the waitlist!" };
    }

    // Calculate position (seeded + real entries)
    const allEntries = await ctx.db.query("waitlist").collect();
    const displayPosition = SEED_COUNT + allEntries.length + 1;
    const cohort = Math.ceil(displayPosition / COHORT_SIZE);

    await ctx.db.insert("waitlist", {
      email: args.email.toLowerCase(),
      cohort,
      position: displayPosition,
      joinedAt: Date.now(),
      source: args.source,
      accessGranted: false,
    });

    return { success: true, position: displayPosition, cohort };
  },
});

export const getStats = query({
  handler: async (ctx) => {
    const allEntries = await ctx.db.query("waitlist").collect();
    const totalWaiting = SEED_COUNT + allEntries.length;
    const currentCohort = Math.ceil(totalWaiting / COHORT_SIZE) || 1;
    const spotsLeft = COHORT_SIZE - ((totalWaiting - 1) % COHORT_SIZE) - 1;

    return { totalWaiting, currentCohort, spotsLeftInCohort: spotsLeft };
  },
});
```

### 4. React Components Created

| Component | Purpose | Location |
|-----------|---------|----------|
| WaitlistHero | Email form + dynamic counter | src/components/waitlist/ |
| ValueCards | 3 research-backed value props | src/components/waitlist/ |
| ObjectionCards | "Why not ChatGPT?" objection handling | src/components/waitlist/ |
| ScarcitySection | Cohort countdown with live stats | src/components/waitlist/ |
| FinalCTA | Dark footer CTA section | src/components/waitlist/ |
| WaitlistGateModal | Modal that gates Discovery actions | src/components/waitlist/ |

### 5. Integration Points

**Header.tsx** - Added blue "Join Waitlist" button:
```typescript
<Link href="/waitlist" className="bg-blue-600 hover:bg-blue-700 text-white...">
  Join Waitlist
</Link>
```

**DiscoveryContent.tsx** - Added gate overlay:
```typescript
const [showGateModal, setShowGateModal] = useState(false);

<div onClick={() => setShowGateModal(true)} className="cursor-pointer">
  {/* Discovery chat interface with overlay */}
</div>

<WaitlistGateModal open={showGateModal} onOpenChange={setShowGateModal} />
```

## Verification

### Test Results
1. Visited `/waitlist` - Page loads with "23 founders waiting"
2. Entered test email - Success: "You're #24 in Cohort 1"
3. Counter updated to "24 founders waiting"
4. Convex dashboard shows entry with correct fields

### Type Check
```bash
npm run type-check:memory
# Passes with no errors
```

## Prevention Strategies

### ConvexProvider Setup Rules

1. **Never use mount-based conditional wrapping** for context providers
2. **Use `useMemo`** for client creation, not module-level singletons
3. **Always wrap immediately** when client is available
4. **Test SSR behavior** by checking page loads without hydration errors

### Testing Waitlist Flows

```typescript
// Test cohort boundary conditions
it("should assign cohort 2 at position 26", async () => {
  // Seed 25 entries
  const result = await joinWaitlist({ email: "test26@example.com" });
  expect(result.cohort).toBe(2);
  expect(result.position).toBe(26);
});

// Test duplicate handling
it("should reject duplicate emails", async () => {
  await joinWaitlist({ email: "test@example.com" });
  const result = await joinWaitlist({ email: "test@example.com" });
  expect(result.success).toBe(false);
});
```

### Best Practices

1. **Lowercase emails** before storage for consistent lookups
2. **Index all query fields** in Convex schema
3. **Track source** for analytics (homepage, discovery-page, etc.)
4. **Use constants** for COHORT_SIZE and SEED_COUNT

## Related Documentation

- [Conversation Persistence Architecture](../architecture-decisions/conversation-persistence-latent-demand-discovery.md) - Related data moat strategy
- [EntrSphere Moat Strategy](../../ENTRSPHERE_MOAT_STRATEGY.md) - Business context

## Cross-References

- Kleo.so launch playbook (external reference)
- Standish Group CHAOS Report - 31% project success rate
- Engprax/Impact Engineering study - 97% success with clear requirements
- Requiment research - 71% failures from requirements issues

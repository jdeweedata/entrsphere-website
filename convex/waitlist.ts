import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const COHORT_SIZE = 25;
const SEED_COUNT = 23; // Start with seeded social proof

// Join the waitlist
export const join = mutation({
  args: {
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if email already exists
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (existing) {
      return {
        success: false,
        message: "You're already on the waitlist!",
        position: existing.position,
        cohort: existing.cohort,
      };
    }

    // Get current waitlist count (excluding seed)
    const allEntries = await ctx.db.query("waitlist").collect();
    const realCount = allEntries.length;
    const displayPosition = SEED_COUNT + realCount + 1;

    // Calculate cohort (1-indexed)
    const cohort = Math.ceil(displayPosition / COHORT_SIZE);
    const positionInCohort = ((displayPosition - 1) % COHORT_SIZE) + 1;

    // Insert new entry
    await ctx.db.insert("waitlist", {
      email: args.email.toLowerCase(),
      cohort,
      position: displayPosition,
      joinedAt: Date.now(),
      source: args.source,
      accessGranted: false,
    });

    return {
      success: true,
      message: `You're #${displayPosition} on the waitlist!`,
      position: displayPosition,
      positionInCohort,
      cohort,
      spotsLeftInCohort: COHORT_SIZE - positionInCohort,
    };
  },
});

// Get waitlist stats for display
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const allEntries = await ctx.db.query("waitlist").collect();
    const realCount = allEntries.length;
    const totalWaiting = SEED_COUNT + realCount;

    // Current cohort being filled
    const currentCohort = Math.ceil(totalWaiting / COHORT_SIZE) || 1;
    const filledInCurrentCohort = ((totalWaiting - 1) % COHORT_SIZE) + 1;
    const spotsLeft = COHORT_SIZE - filledInCurrentCohort;

    return {
      totalWaiting,
      currentCohort,
      spotsLeftInCohort: spotsLeft > 0 ? spotsLeft : 0,
      cohortSize: COHORT_SIZE,
    };
  },
});

// Check if email has access
export const checkAccess = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!entry) {
      return { onWaitlist: false, hasAccess: false };
    }

    return {
      onWaitlist: true,
      hasAccess: entry.accessGranted,
      position: entry.position,
      cohort: entry.cohort,
    };
  },
});

// Grant access to a cohort (admin action)
export const grantCohortAccess = mutation({
  args: {
    cohort: v.number(),
  },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("waitlist")
      .withIndex("by_cohort", (q) => q.eq("cohort", args.cohort))
      .collect();

    let granted = 0;
    for (const entry of entries) {
      if (!entry.accessGranted) {
        await ctx.db.patch(entry._id, {
          accessGranted: true,
          accessGrantedAt: Date.now(),
        });
        granted++;
      }
    }

    return { granted, cohort: args.cohort };
  },
});

// Get waitlist entries (admin)
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    const entries = await ctx.db
      .query("waitlist")
      .withIndex("by_joinedAt")
      .order("desc")
      .take(limit);

    return entries;
  },
});

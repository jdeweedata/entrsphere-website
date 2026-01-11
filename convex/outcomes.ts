import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate a random token for outcome URLs
function createRandomToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// Add outcome token to a session (called when session completes)
export const generateOutcomeToken = mutation({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("discoverySessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    // Don't regenerate if already exists
    if (session.outcomeToken) {
      return { token: session.outcomeToken };
    }

    const token = createRandomToken();

    await ctx.db.patch(session._id, {
      outcomeToken: token,
    });

    return { token };
  },
});

// Get session by outcome token (for the outcome capture page)
export const getSessionByOutcomeToken = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("discoverySessions")
      .withIndex("by_outcomeToken", (q) => q.eq("outcomeToken", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Return limited info (privacy)
    return {
      sessionId: session.sessionId,
      route: session.route,
      createdAt: session.createdAt,
      completedAt: session.completedAt,
      outcome: session.outcome,
      outcomeReportedAt: session.outcomeReportedAt,
      contributedToBenchmarks: session.contributedToBenchmarks,
    };
  },
});

// Record outcome (called when user clicks outcome button)
export const recordOutcome = mutation({
  args: {
    token: v.string(),
    outcome: v.union(
      v.literal("shipped"),
      v.literal("delayed"),
      v.literal("failed"),
      v.literal("paused"),
      v.literal("ongoing")
    ),
    outcomeNotes: v.optional(v.string()),
    timelineAccuracy: v.optional(v.number()),
    industry: v.optional(v.string()),
    projectType: v.optional(v.string()),
    contributeToBenchmarks: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("discoverySessions")
      .withIndex("by_outcomeToken", (q) => q.eq("outcomeToken", args.token))
      .first();

    if (!session) {
      throw new Error("Invalid outcome token");
    }

    await ctx.db.patch(session._id, {
      outcome: args.outcome,
      outcomeReportedAt: Date.now(),
      outcomeNotes: args.outcomeNotes,
      timelineAccuracy: args.timelineAccuracy,
      industry: args.industry,
      projectType: args.projectType,
      contributedToBenchmarks: args.contributeToBenchmarks ?? true,
    });

    return {
      success: true,
      route: session.route,
    };
  },
});

// Get route benchmarks (for insights display)
export const getRouteBenchmarks = query({
  args: {
    route: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D")
    ),
    industry: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try to find industry-specific benchmarks first
    if (args.industry) {
      const industryBenchmark = await ctx.db
        .query("routeBenchmarks")
        .withIndex("by_route_industry", (q) =>
          q.eq("route", args.route).eq("industry", args.industry)
        )
        .first();

      if (industryBenchmark) {
        return industryBenchmark;
      }
    }

    // Fall back to route-level benchmarks
    const routeBenchmark = await ctx.db
      .query("routeBenchmarks")
      .withIndex("by_route", (q) => q.eq("route", args.route))
      .first();

    return routeBenchmark;
  },
});

// Get aggregate stats for display (no contribution required)
export const getAggregateStats = query({
  args: {},
  handler: async (ctx) => {
    // Count total sessions with outcomes
    const sessionsWithOutcomes = await ctx.db
      .query("discoverySessions")
      .filter((q) => q.neq(q.field("outcome"), undefined))
      .collect();

    const totalSessions = sessionsWithOutcomes.length;

    if (totalSessions === 0) {
      return {
        totalSessions: 0,
        hasEnoughData: false,
      };
    }

    // Calculate aggregate stats
    const outcomeCount = {
      shipped: 0,
      delayed: 0,
      failed: 0,
      paused: 0,
      ongoing: 0,
    };

    for (const session of sessionsWithOutcomes) {
      if (session.outcome) {
        outcomeCount[session.outcome]++;
      }
    }

    const successRate =
      totalSessions > 0
        ? outcomeCount.shipped / (outcomeCount.shipped + outcomeCount.failed) || 0
        : 0;

    return {
      totalSessions,
      hasEnoughData: totalSessions >= 10,
      outcomeCount,
      successRate: Math.round(successRate * 100),
    };
  },
});

// Update session with follow-up email sent timestamp
export const markFollowUpSent = mutation({
  args: {
    sessionId: v.string(),
    type: v.union(v.literal("initial"), v.literal("reminder")),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("discoverySessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!session) {
      throw new Error("Session not found");
    }

    const update =
      args.type === "initial"
        ? { followUpEmailSentAt: Date.now() }
        : { followUpReminderSentAt: Date.now() };

    await ctx.db.patch(session._id, update);

    return { success: true };
  },
});

// Get sessions needing follow-up (for cron job)
export const getSessionsNeedingFollowUp = query({
  args: {},
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;

    // Get sessions with email, completed 30+ days ago, no outcome yet
    const sessions = await ctx.db
      .query("discoverySessions")
      .filter((q) =>
        q.and(
          q.neq(q.field("email"), undefined),
          q.lt(q.field("createdAt"), thirtyDaysAgo),
          q.eq(q.field("outcome"), undefined)
        )
      )
      .collect();

    // Separate into initial and reminder groups
    const needsInitial = sessions.filter(
      (s) => !s.followUpEmailSentAt && s.createdAt < thirtyDaysAgo
    );

    const needsReminder = sessions.filter(
      (s) =>
        s.followUpEmailSentAt &&
        !s.followUpReminderSentAt &&
        s.createdAt < sixtyDaysAgo
    );

    return {
      needsInitial: needsInitial.map((s) => ({
        sessionId: s.sessionId,
        email: s.email,
        route: s.route,
        outcomeToken: s.outcomeToken,
      })),
      needsReminder: needsReminder.map((s) => ({
        sessionId: s.sessionId,
        email: s.email,
        route: s.route,
        outcomeToken: s.outcomeToken,
      })),
    };
  },
});

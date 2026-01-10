// Convex functions for Discovery Sessions
// These power the MOAT data accumulation

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save a completed discovery session
export const saveSession = mutation({
  args: {
    sessionId: v.string(),
    route: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D")
    ),
    answers: v.object({
      q1_opener: v.optional(v.string()),
      q2_clarity: v.optional(v.string()),
      q3_systems: v.optional(v.string()),
      q4_authority: v.optional(v.string()),
      q5_constraints: v.optional(v.string()),
    }),
    signals: v.object({
      A: v.number(),
      B: v.number(),
      C: v.number(),
      D: v.number(),
    }),
    email: v.optional(v.string()),
    wantsUpdates: v.optional(v.boolean()),
    durationSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if session already exists (prevent duplicates)
    const existing = await ctx.db
      .query("discoverySessions")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      // Update existing session with email if provided
      if (args.email) {
        await ctx.db.patch(existing._id, {
          email: args.email,
          wantsUpdates: args.wantsUpdates,
          completedAt: Date.now(),
          durationSeconds: args.durationSeconds,
        });
      }
      return { success: true, message: "Session updated", id: existing._id };
    }

    // Create new session
    const id = await ctx.db.insert("discoverySessions", {
      sessionId: args.sessionId,
      route: args.route,
      answers: args.answers,
      signals: args.signals,
      email: args.email,
      wantsUpdates: args.wantsUpdates,
      durationSeconds: args.durationSeconds,
      completedAt: Date.now(),
      createdAt: Date.now(),
    });

    return { success: true, message: "Session saved", id };
  },
});

// Get session count by route (for displaying stats)
export const getRouteStats = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("discoverySessions").collect();

    const stats = {
      total: sessions.length,
      byRoute: {
        A: sessions.filter((s) => s.route === "A").length,
        B: sessions.filter((s) => s.route === "B").length,
        C: sessions.filter((s) => s.route === "C").length,
        D: sessions.filter((s) => s.route === "D").length,
      },
      avgDurationSeconds:
        sessions.length > 0
          ? Math.round(
              sessions
                .filter((s) => s.durationSeconds)
                .reduce((acc, s) => acc + (s.durationSeconds || 0), 0) /
                sessions.filter((s) => s.durationSeconds).length
            )
          : 0,
    };

    return stats;
  },
});

// Get recent sessions (for admin dashboard)
export const listSessions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;

    const sessions = await ctx.db
      .query("discoverySessions")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);

    return sessions;
  },
});

// Get pattern insights (for future Discovery Intelligence feature)
export const getPatternInsights = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("discoverySessions").collect();

    if (sessions.length < 10) {
      return {
        hasEnoughData: false,
        message: "Need at least 10 sessions for pattern analysis",
        sessionCount: sessions.length,
      };
    }

    // Analyze common answer patterns per route
    const routePatterns: Record<string, Record<string, Record<string, number>>> = {
      A: {},
      B: {},
      C: {},
      D: {},
    };

    sessions.forEach((session) => {
      const route = session.route;
      Object.entries(session.answers).forEach(([questionId, answerId]) => {
        if (!answerId) return;
        if (!routePatterns[route][questionId]) {
          routePatterns[route][questionId] = {};
        }
        routePatterns[route][questionId][answerId] =
          (routePatterns[route][questionId][answerId] || 0) + 1;
      });
    });

    // Find most common patterns
    const insights: string[] = [];

    // Route B analysis (exploratory)
    const routeB = sessions.filter((s) => s.route === "B");
    if (routeB.length > 5) {
      const avgDuration =
        routeB.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / routeB.length;
      if (avgDuration < 120) {
        insights.push(
          `Exploratory projects complete discovery ${Math.round(avgDuration)}s faster than average`
        );
      }
    }

    // Route C analysis (strategic ambiguity)
    const routeC = sessions.filter((s) => s.route === "C");
    if (routeC.length > 3) {
      const pct = Math.round((routeC.length / sessions.length) * 100);
      insights.push(
        `${pct}% of sessions detected political/strategic complexity`
      );
    }

    // Route D analysis (integration)
    const routeD = sessions.filter((s) => s.route === "D");
    if (routeD.length > 3) {
      const pct = Math.round((routeD.length / sessions.length) * 100);
      insights.push(
        `${pct}% of projects involve existing system integrations`
      );
    }

    return {
      hasEnoughData: true,
      sessionCount: sessions.length,
      routeDistribution: {
        A: Math.round((sessions.filter((s) => s.route === "A").length / sessions.length) * 100),
        B: Math.round((sessions.filter((s) => s.route === "B").length / sessions.length) * 100),
        C: Math.round((sessions.filter((s) => s.route === "C").length / sessions.length) * 100),
        D: Math.round((sessions.filter((s) => s.route === "D").length / sessions.length) * 100),
      },
      insights,
      routePatterns,
    };
  },
});

// Check if email already exists (for duplicate prevention)
export const checkEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("discoverySessions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return { exists: !!existing };
  },
});

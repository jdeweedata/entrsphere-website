// Convex functions for Discovery Sessions
// These power the MOAT data accumulation

import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

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

// Save SPEC preview lead (email capture for freemium flow)
export const saveSpecPreviewLead = mutation({
  args: {
    email: v.string(),
    sessionId: v.string(),
    route: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D")
    ),
    signals: v.object({
      A: v.number(),
      B: v.number(),
      C: v.number(),
      D: v.number(),
    }),
    conversationLength: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if this email already got a preview
    const existing = await ctx.db
      .query("specPreviewLeads")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing lead with new session info
      await ctx.db.patch(existing._id, {
        lastSessionId: args.sessionId,
        route: args.route,
        signals: args.signals,
        previewCount: (existing.previewCount || 1) + 1,
        lastPreviewAt: Date.now(),
      });
      return { success: true, message: "Lead updated", isRepeat: true };
    }

    // Create new lead
    const id = await ctx.db.insert("specPreviewLeads", {
      email: args.email,
      sessionId: args.sessionId,
      lastSessionId: args.sessionId,
      route: args.route,
      signals: args.signals,
      conversationLength: args.conversationLength,
      previewCount: 1,
      convertedToFullSpec: false,
      createdAt: Date.now(),
      lastPreviewAt: Date.now(),
    });

    return { success: true, message: "Lead captured", id, isRepeat: false };
  },
});

// Get SPEC preview lead stats (for admin)
export const getSpecLeadStats = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("specPreviewLeads").collect();

    return {
      total: leads.length,
      converted: leads.filter((l) => l.convertedToFullSpec).length,
      byRoute: {
        A: leads.filter((l) => l.route === "A").length,
        B: leads.filter((l) => l.route === "B").length,
        C: leads.filter((l) => l.route === "C").length,
        D: leads.filter((l) => l.route === "D").length,
      },
      repeatUsers: leads.filter((l) => (l.previewCount || 1) > 1).length,
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

// Route descriptions for email
const ROUTE_INFO: Record<string, { name: string; title: string; description: string; approach: string }> = {
  A: {
    name: "Route A",
    title: "Standard Discovery",
    description: "You know what you need. Time to document it properly.",
    approach: "Generate a rigorous PRD & SPEC.json immediately. Focus on acceptance criteria and edge cases.",
  },
  B: {
    name: "Route B",
    title: "Exploratory Prototype",
    description: "You'll know it when you see it. Let's build something fast.",
    approach: "Stop talking. Build a 5-minute disposable prototype. Test assumptions before committing.",
  },
  C: {
    name: "Route C",
    title: "Strategic Ambiguity",
    description: "There are factors you can't fully explain. Political complexity detected.",
    approach: "Stop. This is a political trap. Use the Ambiguity Prompt to force stakeholder alignment.",
  },
  D: {
    name: "Route D",
    title: "Integration Discovery",
    description: "You need to connect to existing systems. Dual-track discovery required.",
    approach: "Run parallel Business + Technical discovery to prevent integration hell.",
  },
};

// Send discovery profile email via Resend
export const sendDiscoveryEmail = action({
  args: {
    email: v.string(),
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
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return { success: false, error: "Email service not configured" };
    }

    const resend = new Resend(resendApiKey);
    const routeInfo = ROUTE_INFO[args.route];

    // Format signals as percentage
    const totalSignals = args.signals.A + args.signals.B + args.signals.C + args.signals.D;
    const signalPcts = {
      A: Math.round((args.signals.A / totalSignals) * 100),
      B: Math.round((args.signals.B / totalSignals) * 100),
      C: Math.round((args.signals.C / totalSignals) * 100),
      D: Math.round((args.signals.D / totalSignals) * 100),
    };

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Discovery Profile</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #0f172a; margin-bottom: 5px;">Your Discovery Profile</h1>
    <p style="color: #64748b; margin: 0;">From EntrSphere's Discovery Agent</p>
  </div>

  <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 12px; margin-bottom: 25px;">
    <div style="font-size: 14px; opacity: 0.8; margin-bottom: 8px;">${routeInfo.name}</div>
    <h2 style="margin: 0 0 15px 0; font-size: 24px;">${routeInfo.title}</h2>
    <p style="margin: 0; opacity: 0.9;">${routeInfo.description}</p>
  </div>

  <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="margin: 0 0 15px 0; color: #0f172a;">Recommended Approach</h3>
    <p style="margin: 0; color: #475569;">${routeInfo.approach}</p>
  </div>

  <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
    <h3 style="margin: 0 0 15px 0; color: #0f172a;">Your Signal Distribution</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
      <div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: ${args.route === 'A' ? '#10b981' : '#64748b'};">${signalPcts.A}%</div>
        <div style="font-size: 12px; color: #64748b;">Standard</div>
      </div>
      <div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: ${args.route === 'B' ? '#10b981' : '#64748b'};">${signalPcts.B}%</div>
        <div style="font-size: 12px; color: #64748b;">Exploratory</div>
      </div>
      <div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: ${args.route === 'C' ? '#10b981' : '#64748b'};">${signalPcts.C}%</div>
        <div style="font-size: 12px; color: #64748b;">Strategic</div>
      </div>
      <div style="background: white; padding: 12px; border-radius: 8px; text-align: center;">
        <div style="font-size: 24px; font-weight: bold; color: ${args.route === 'D' ? '#10b981' : '#64748b'};">${signalPcts.D}%</div>
        <div style="font-size: 12px; color: #64748b;">Integration</div>
      </div>
    </div>
  </div>

  <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #f59e0b;">
    <h3 style="margin: 0 0 10px 0; color: #92400e;">Want the Full Discovery Toolkit?</h3>
    <p style="margin: 0 0 15px 0; color: #78350f; font-size: 14px;">
      Get the complete prompts, PRD generators, and SPEC.json templates for all 4 routes.
    </p>
    <a href="https://entrsphere.com/solutions/discovery-router"
       style="display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
      Get Full Toolkit — R850
    </a>
  </div>

  <div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px;">
    <p style="margin: 0 0 10px 0;">
      <a href="https://entrsphere.com" style="color: #64748b;">EntrSphere</a> ·
      AI-Native Development Frameworks
    </p>
    <p style="margin: 0;">Session ID: ${args.sessionId}</p>
  </div>

</body>
</html>
    `;

    try {
      const { data, error } = await resend.emails.send({
        from: "EntrSphere Discovery <onboarding@resend.dev>",
        to: [args.email],
        subject: `Your Discovery Profile: ${routeInfo.title}`,
        html: emailHtml,
      });

      if (error) {
        console.error("Resend error:", error);
        return { success: false, error: error.message };
      }

      console.log("Email sent successfully:", data?.id);
      return { success: true, emailId: data?.id };
    } catch (err) {
      console.error("Failed to send email:", err);
      return { success: false, error: "Failed to send email" };
    }
  },
});

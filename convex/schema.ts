import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Contact form submissions
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    createdAt: v.number(),
  }),

  // Newsletter subscriptions
  subscribers: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
  }).index("by_email", ["email"]),

  // Blog posts
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    category: v.string(),
    tags: v.optional(v.array(v.string())),
    author: v.object({
      name: v.string(),
      avatar: v.optional(v.string()),
      bio: v.optional(v.string()),
    }),
    publishedAt: v.optional(v.number()),
    readTime: v.number(),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    featured: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_published", ["publishedAt"])
    .index("by_featured", ["featured"]),

  // Discovery sessions - for MOAT data accumulation
  discoverySessions: defineTable({
    // Session identity
    sessionId: v.string(), // Client-generated ID

    // Route detection
    route: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D")
    ),

    // Answers to routing questions (anonymized)
    answers: v.object({
      q1_opener: v.optional(v.string()),
      q2_clarity: v.optional(v.string()),
      q3_systems: v.optional(v.string()),
      q4_authority: v.optional(v.string()),
      q5_constraints: v.optional(v.string()),
    }),

    // Signal scores
    signals: v.object({
      A: v.number(),
      B: v.number(),
      C: v.number(),
      D: v.number(),
    }),

    // Optional email (if user opts in)
    email: v.optional(v.string()),
    wantsUpdates: v.optional(v.boolean()),

    // Session metadata
    durationSeconds: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    createdAt: v.number(),

    // Future: Full SPEC.json from Agent SDK sessions
    specJson: v.optional(v.any()),

    // Outcome tracking (for MOAT data)
    outcomeToken: v.optional(v.string()), // Unique token for outcome URL
    outcome: v.optional(
      v.union(
        v.literal("shipped"),
        v.literal("delayed"),
        v.literal("failed"),
        v.literal("paused"),
        v.literal("ongoing")
      )
    ),
    outcomeReportedAt: v.optional(v.number()),
    outcomeNotes: v.optional(v.string()), // Optional context
    timelineAccuracy: v.optional(v.number()), // Actual vs estimated (0-2x+)

    // Progressive trust levels
    contributedToBenchmarks: v.optional(v.boolean()),
    industry: v.optional(v.string()), // e.g., "fintech", "saas", "ecommerce"
    projectType: v.optional(v.string()), // e.g., "mvp", "integration", "redesign"

    // Follow-up tracking
    followUpEmailSentAt: v.optional(v.number()),
    followUpReminderSentAt: v.optional(v.number()),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_email", ["email"])
    .index("by_route", ["route"])
    .index("by_createdAt", ["createdAt"])
    .index("by_outcomeToken", ["outcomeToken"])
    .index("by_outcome", ["outcome"]),

  // Purchases - Discovery Router Toolkit payments
  purchases: defineTable({
    email: v.string(),
    sessionId: v.optional(v.string()), // Links to discovery session if from /discovery flow
    reference: v.string(), // Paystack payment reference
    amount: v.number(), // Amount in kobo/cents
    currency: v.string(), // ZAR
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed")
    ),
    product: v.string(), // "discovery-router-toolkit"
    paystackData: v.optional(v.any()), // Full Paystack response
    createdAt: v.number(),
    verifiedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_reference", ["reference"])
    .index("by_sessionId", ["sessionId"]),

  // SPEC preview leads - email captures from freemium flow
  specPreviewLeads: defineTable({
    email: v.string(),
    sessionId: v.string(),
    lastSessionId: v.string(),
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
    previewCount: v.number(),
    convertedToFullSpec: v.boolean(),
    createdAt: v.number(),
    lastPreviewAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_route", ["route"])
    .index("by_createdAt", ["createdAt"]),

  // Route benchmarks - aggregate insights (computed periodically)
  routeBenchmarks: defineTable({
    route: v.union(
      v.literal("A"),
      v.literal("B"),
      v.literal("C"),
      v.literal("D")
    ),
    industry: v.optional(v.string()), // null = all industries

    // Aggregate stats
    totalSessions: v.number(),
    totalWithOutcomes: v.number(),

    // Outcome distribution
    outcomeStats: v.object({
      shipped: v.number(),
      delayed: v.number(),
      failed: v.number(),
      paused: v.number(),
      ongoing: v.number(),
    }),

    // Computed insights
    successRate: v.number(), // shipped / (shipped + failed)
    avgTimelineAccuracy: v.optional(v.number()),
    topRiskFactors: v.optional(v.array(v.string())),
    avgDurationSeconds: v.optional(v.number()),

    // Metadata
    lastComputedAt: v.number(),
  })
    .index("by_route", ["route"])
    .index("by_route_industry", ["route", "industry"]),

  // Conversations - per-message persistence for latent demand discovery
  // Every message, tool call, and result is stored for analysis
  conversations: defineTable({
    sessionId: v.string(),
    timestamp: v.number(),

    // The signal
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("tool_call"),
      v.literal("tool_result")
    ),
    content: v.string(),

    // Context for analysis
    toolName: v.optional(v.string()), // Which primitive was invoked
    toolSuccess: v.optional(v.boolean()), // Did it work
    flowStage: v.optional(
      v.union(
        v.literal("routing"), // 5-question guided flow
        v.literal("discovery"), // Full agent discovery session
        v.literal("post_spec"), // After SPEC generated - KEY SIGNAL
        v.literal("ask_anything"), // Unguided requests - PURE SIGNAL
        v.literal("refinement") // Iterating on SPEC
      )
    ),

    // Optional: route context for segmented analysis
    route: v.optional(
      v.union(
        v.literal("A"),
        v.literal("B"),
        v.literal("C"),
        v.literal("D")
      )
    ),

    // For failed tool calls - what went wrong
    errorMessage: v.optional(v.string()),
  })
    .index("by_sessionId", ["sessionId"])
    .index("by_timestamp", ["timestamp"])
    .index("by_flowStage", ["flowStage"])
    .index("by_role_flowStage", ["role", "flowStage"]) // user + post_spec = primitive roadmap
    .index("by_toolSuccess", ["toolSuccess"]), // false = capability gaps
});

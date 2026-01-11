import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Persist a single message/tool call - called after each interaction
export const logMessage = mutation({
  args: {
    sessionId: v.string(),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("tool_call"),
      v.literal("tool_result")
    ),
    content: v.string(),
    toolName: v.optional(v.string()),
    toolSuccess: v.optional(v.boolean()),
    flowStage: v.optional(
      v.union(
        v.literal("routing"),
        v.literal("discovery"),
        v.literal("post_spec"),
        v.literal("ask_anything"),
        v.literal("refinement")
      )
    ),
    route: v.optional(
      v.union(
        v.literal("A"),
        v.literal("B"),
        v.literal("C"),
        v.literal("D")
      )
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("conversations", {
      ...args,
      timestamp: Date.now(),
    });
  },
});

// Batch log multiple messages (for efficiency when persisting a full exchange)
export const logMessages = mutation({
  args: {
    messages: v.array(
      v.object({
        sessionId: v.string(),
        role: v.union(
          v.literal("user"),
          v.literal("assistant"),
          v.literal("tool_call"),
          v.literal("tool_result")
        ),
        content: v.string(),
        toolName: v.optional(v.string()),
        toolSuccess: v.optional(v.boolean()),
        flowStage: v.optional(
          v.union(
            v.literal("routing"),
            v.literal("discovery"),
            v.literal("post_spec"),
            v.literal("ask_anything"),
            v.literal("refinement")
          )
        ),
        route: v.optional(
          v.union(
            v.literal("A"),
            v.literal("B"),
            v.literal("C"),
            v.literal("D")
          )
        ),
        errorMessage: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();
    for (let i = 0; i < args.messages.length; i++) {
      await ctx.db.insert("conversations", {
        ...args.messages[i],
        // Offset timestamps slightly to preserve order
        timestamp: timestamp + i,
      });
    }
  },
});

// ============================================
// ANALYSIS QUERIES - For discovering latent demand
// ============================================

// Get all user messages in post_spec stage - this is your primitive roadmap
export const getPostSpecUserMessages = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    const messages = await ctx.db
      .query("conversations")
      .withIndex("by_role_flowStage", (q) =>
        q.eq("role", "user").eq("flowStage", "post_spec")
      )
      .order("desc")
      .take(limit);

    return messages;
  },
});

// Get all user messages in ask_anything stage - pure unguided signal
export const getAskAnythingMessages = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    const messages = await ctx.db
      .query("conversations")
      .withIndex("by_role_flowStage", (q) =>
        q.eq("role", "user").eq("flowStage", "ask_anything")
      )
      .order("desc")
      .take(limit);

    return messages;
  },
});

// Get failed tool calls - capability gaps
export const getFailedToolCalls = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;

    const messages = await ctx.db
      .query("conversations")
      .withIndex("by_toolSuccess", (q) => q.eq("toolSuccess", false))
      .order("desc")
      .take(limit);

    return messages;
  },
});

// Get conversation for a session
export const getSessionConversation = query({
  args: {
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("conversations")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .order("asc")
      .collect();

    return messages;
  },
});

// Get aggregate stats for analysis
export const getConversationStats = query({
  args: {},
  handler: async (ctx) => {
    // Count by flow stage
    const allMessages = await ctx.db.query("conversations").collect();

    const stats = {
      total: allMessages.length,
      byFlowStage: {} as Record<string, number>,
      byRole: {} as Record<string, number>,
      failedToolCalls: 0,
      uniqueSessions: new Set<string>(),
    };

    for (const msg of allMessages) {
      // Flow stage counts
      const stage = msg.flowStage || "unknown";
      stats.byFlowStage[stage] = (stats.byFlowStage[stage] || 0) + 1;

      // Role counts
      stats.byRole[msg.role] = (stats.byRole[msg.role] || 0) + 1;

      // Failed tool calls
      if (msg.toolSuccess === false) {
        stats.failedToolCalls++;
      }

      // Unique sessions
      stats.uniqueSessions.add(msg.sessionId);
    }

    return {
      ...stats,
      uniqueSessions: stats.uniqueSessions.size,
    };
  },
});

// Get recent user messages for quick review
export const getRecentUserMessages = query({
  args: {
    limit: v.optional(v.number()),
    flowStage: v.optional(
      v.union(
        v.literal("routing"),
        v.literal("discovery"),
        v.literal("post_spec"),
        v.literal("ask_anything"),
        v.literal("refinement")
      )
    ),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;

    let query = ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("role"), "user"));

    if (args.flowStage) {
      query = query.filter((q) =>
        q.eq(q.field("flowStage"), args.flowStage)
      );
    }

    const messages = await query.order("desc").take(limit);

    return messages;
  },
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const subscribe = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already subscribed
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return { success: true, message: "Already subscribed" };
    }

    await ctx.db.insert("subscribers", {
      email: args.email,
      subscribedAt: Date.now(),
    });

    return { success: true, message: "Successfully subscribed" };
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").order("desc").collect();
  },
});

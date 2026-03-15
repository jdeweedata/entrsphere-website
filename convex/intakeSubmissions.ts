import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    purchaseReference: v.string(),
    email: v.string(),
    businessName: v.string(),
    contactName: v.string(),
    phone: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    monthlyRevenue: v.optional(v.string()),
    businessType: v.optional(v.string()),
    biggestChallenge: v.optional(v.string()),
    tier: v.union(
      v.literal("quick-scan"),
      v.literal("deep-dive"),
      v.literal("full-audit")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("intakeSubmissions", {
      ...args,
      createdAt: Date.now(),
      status: "submitted",
    });
  },
});

export const getByReference = query({
  args: { reference: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("intakeSubmissions")
      .withIndex("by_purchaseReference", (q) =>
        q.eq("purchaseReference", args.reference)
      )
      .first();
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("intakeSubmissions")
      .order("desc")
      .take(50);
  },
});

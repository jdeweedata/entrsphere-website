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

  // Purchases - audit service payments
  purchases: defineTable({
    email: v.string(),
    sessionId: v.optional(v.string()),
    reference: v.string(),
    amount: v.number(),
    currency: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed")
    ),
    product: v.string(),
    provider: v.optional(v.union(v.literal("paystack"), v.literal("payfast"))),
    paystackData: v.optional(v.any()),
    payfastData: v.optional(v.any()),
    createdAt: v.number(),
    verifiedAt: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_reference", ["reference"])
    .index("by_sessionId", ["sessionId"]),

  // Intake submissions - business audit intake forms
  intakeSubmissions: defineTable({
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
    createdAt: v.number(),
    status: v.union(
      v.literal("submitted"),
      v.literal("in-progress"),
      v.literal("completed")
    ),
  })
    .index("by_email", ["email"])
    .index("by_purchaseReference", ["purchaseReference"])
    .index("by_status", ["status"]),
});

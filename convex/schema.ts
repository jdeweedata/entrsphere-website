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
});

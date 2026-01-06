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
});

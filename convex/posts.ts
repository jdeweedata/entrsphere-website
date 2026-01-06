import { query } from "./_generated/server";
import { v } from "convex/values";

// List published posts, optionally filtered by category
export const list = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { category, limit } = args;

    let posts;

    if (category && category !== "All") {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_category", (q) => q.eq("category", category))
        .collect();

      // Filter to only published posts
      posts = posts.filter((post) => post.publishedAt !== null && post.publishedAt !== undefined);
    } else {
      posts = await ctx.db
        .query("posts")
        .withIndex("by_published")
        .collect();

      // Filter to only published posts
      posts = posts.filter((post) => post.publishedAt !== null && post.publishedAt !== undefined);
    }

    // Sort by publishedAt descending (most recent first)
    posts.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));

    // Apply limit if specified
    if (limit && limit > 0) {
      posts = posts.slice(0, limit);
    }

    return posts;
  },
});

// Get the featured post for hero section
export const getFeatured = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();

    // Filter to only published featured posts
    const publishedFeatured = posts.filter(
      (post) => post.publishedAt !== null && post.publishedAt !== undefined
    );

    // Return the most recently published featured post
    if (publishedFeatured.length === 0) {
      return null;
    }

    publishedFeatured.sort((a, b) => (b.publishedAt || 0) - (a.publishedAt || 0));
    return publishedFeatured[0];
  },
});

// Get single post by slug
export const getBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    // Only return if published
    if (!post || post.publishedAt === null || post.publishedAt === undefined) {
      return null;
    }

    return post;
  },
});

// Get all categories with post counts
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();

    // Filter to only published posts
    const publishedPosts = posts.filter(
      (post) => post.publishedAt !== null && post.publishedAt !== undefined
    );

    // Count posts per category
    const categoryCounts: Record<string, number> = {};

    for (const post of publishedPosts) {
      if (categoryCounts[post.category]) {
        categoryCounts[post.category]++;
      } else {
        categoryCounts[post.category] = 1;
      }
    }

    // Convert to array format
    return Object.entries(categoryCounts).map(([category, count]) => ({
      category,
      count,
    }));
  },
});

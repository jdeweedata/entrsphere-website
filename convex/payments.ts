import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a pending purchase record
export const createPurchase = mutation({
  args: {
    email: v.string(),
    sessionId: v.optional(v.string()),
    reference: v.string(),
    amount: v.number(),
    currency: v.string(),
    product: v.string(),
    provider: v.optional(v.union(v.literal("paystack"), v.literal("payfast"))),
  },
  handler: async (ctx, args) => {
    const purchaseId = await ctx.db.insert("purchases", {
      email: args.email,
      sessionId: args.sessionId,
      reference: args.reference,
      amount: args.amount,
      currency: args.currency,
      status: "pending",
      product: args.product,
      provider: args.provider || "paystack", // Default to paystack for backward compatibility
      createdAt: Date.now(),
    });
    return purchaseId;
  },
});

// Verify and update purchase status
export const verifyPurchase = mutation({
  args: {
    reference: v.string(),
    status: v.union(
      v.literal("success"),
      v.literal("failed")
    ),
    paystackData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Find purchase by reference
    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();

    if (!purchase) {
      throw new Error("Purchase not found");
    }

    // Update the purchase
    await ctx.db.patch(purchase._id, {
      status: args.status,
      paystackData: args.paystackData,
      verifiedAt: Date.now(),
    });

    return {
      success: args.status === "success",
      purchaseId: purchase._id,
      email: purchase.email,
      sessionId: purchase.sessionId,
    };
  },
});

// Verify and update PayFast purchase status
export const verifyPayFastPurchase = mutation({
  args: {
    reference: v.string(),
    status: v.union(
      v.literal("success"),
      v.literal("failed")
    ),
    payfastData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Find purchase by reference
    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();

    if (!purchase) {
      throw new Error("Purchase not found");
    }

    // Update the purchase
    await ctx.db.patch(purchase._id, {
      status: args.status,
      payfastData: args.payfastData,
      verifiedAt: Date.now(),
    });

    return {
      success: args.status === "success",
      purchaseId: purchase._id,
      email: purchase.email,
      sessionId: purchase.sessionId,
    };
  },
});

// Check if user has purchased the toolkit
export const checkPurchase = query({
  args: {
    email: v.optional(v.string()),
    reference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.reference) {
      const reference = args.reference;
      const purchase = await ctx.db
        .query("purchases")
        .withIndex("by_reference", (q) => q.eq("reference", reference))
        .first();
      return purchase && purchase.status === "success";
    }

    if (args.email) {
      const email = args.email;
      const purchase = await ctx.db
        .query("purchases")
        .withIndex("by_email", (q) => q.eq("email", email))
        .filter((q) => q.eq(q.field("status"), "success"))
        .first();
      return !!purchase;
    }

    return false;
  },
});

// Get purchase by reference (for session page)
export const getPurchaseByReference = query({
  args: {
    reference: v.string(),
  },
  handler: async (ctx, args) => {
    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_reference", (q) => q.eq("reference", args.reference))
      .first();

    if (!purchase) return null;

    return {
      email: purchase.email,
      sessionId: purchase.sessionId,
      status: purchase.status,
      product: purchase.product,
      createdAt: purchase.createdAt,
    };
  },
});

// Get all purchases for an email
export const getPurchasesByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    return purchases.map((p) => ({
      reference: p.reference,
      status: p.status,
      product: p.product,
      createdAt: p.createdAt,
    }));
  },
});

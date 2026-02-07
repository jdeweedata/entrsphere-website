import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import crypto from "crypto";

// Lazy initialization of Convex client to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  return new ConvexHttpClient(url);
}

// Paystack webhook handler
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);
    const event = payload.event;
    const data = payload.data;

    // Handle different event types
    const convex = getConvexClient();
    switch (event) {
      case "charge.success": {
        const reference = data.reference;

        // Update purchase status in Convex
        await convex.mutation(api.payments.verifyPurchase, {
          reference,
          status: "success",
          paystackData: data,
        });
        break;
      }

      case "charge.failed": {
        const reference = data.reference;

        await convex.mutation(api.payments.verifyPurchase, {
          reference,
          status: "failed",
          paystackData: data,
        });
        break;
      }

      default:
        // Unhandled event type - silently ignore
        break;
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Handle GET requests (health check)
export async function GET() {
  return NextResponse.json({ status: "Paystack webhook endpoint active" });
}

import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";

// Lazy initialization of Convex client to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  return new ConvexHttpClient(url);
}

// Paystack verification endpoint
const PAYSTACK_VERIFY_URL = "https://api.paystack.co/transaction/verify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required" },
        { status: 400 }
      );
    }

    // Verify with Paystack
    const paystackResponse = await fetch(`${PAYSTACK_VERIFY_URL}/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!paystackResponse.ok) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    const paystackData = await paystackResponse.json();

    // Check if payment was successful
    const isSuccess = paystackData.data?.status === "success";

    // Update purchase in Convex
    const convex = getConvexClient();
    const result = await convex.mutation(api.payments.verifyPurchase, {
      reference,
      status: isSuccess ? "success" : "failed",
      paystackData: paystackData.data,
    });

    if (isSuccess) {
      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        email: result.email,
        sessionId: result.sessionId,
        purchaseId: result.purchaseId,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment was not successful",
        status: paystackData.data?.status,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Paystack webhook handler
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: "Payment verification endpoint" });
}

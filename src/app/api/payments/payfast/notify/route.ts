import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import {
  PayFastITNData,
  validateITNSignature,
  verifyPaymentWithPayFast,
} from "@/lib/payfast";

// Lazy initialization of Convex client to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  return new ConvexHttpClient(url);
}

/**
 * PayFast ITN (Instant Transaction Notification) Handler
 * This endpoint receives payment notifications from PayFast
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await request.text();

    // Parse URL-encoded form data
    const params = new URLSearchParams(rawBody);
    const itnData: PayFastITNData = {
      m_payment_id: params.get("m_payment_id") || "",
      pf_payment_id: params.get("pf_payment_id") || "",
      payment_status: (params.get("payment_status") || "PENDING") as PayFastITNData["payment_status"],
      item_name: params.get("item_name") || "",
      item_description: params.get("item_description") || undefined,
      amount_gross: params.get("amount_gross") || "0",
      amount_fee: params.get("amount_fee") || "0",
      amount_net: params.get("amount_net") || "0",
      custom_str1: params.get("custom_str1") || undefined,
      custom_str2: params.get("custom_str2") || undefined,
      custom_str3: params.get("custom_str3") || undefined,
      custom_str4: params.get("custom_str4") || undefined,
      custom_str5: params.get("custom_str5") || undefined,
      custom_int1: params.get("custom_int1") || undefined,
      custom_int2: params.get("custom_int2") || undefined,
      custom_int3: params.get("custom_int3") || undefined,
      custom_int4: params.get("custom_int4") || undefined,
      custom_int5: params.get("custom_int5") || undefined,
      name_first: params.get("name_first") || undefined,
      name_last: params.get("name_last") || undefined,
      email_address: params.get("email_address") || undefined,
      merchant_id: params.get("merchant_id") || undefined,
      signature: params.get("signature") || undefined,
    };

    console.log("PayFast ITN received:", {
      paymentId: itnData.m_payment_id,
      pfPaymentId: itnData.pf_payment_id,
      status: itnData.payment_status,
    });

    // Verify the source host (optional but recommended)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const host = forwardedFor?.split(",")[0]?.trim();

    // In production, you might want to verify the IP or host
    // For now, we'll skip this check as it's optional

    // Step 1: Verify signature
    const passphrase = process.env.PAYFAST_PASSPHRASE;
    if (!validateITNSignature(itnData, passphrase)) {
      console.error("PayFast ITN signature validation failed");
      // Don't reveal signature failure to potential attackers
      return new NextResponse("OK", { status: 200 });
    }

    // Step 2: Verify the payment with PayFast server
    const isSandbox = process.env.PAYFAST_SANDBOX === "true";
    const isValid = await verifyPaymentWithPayFast(rawBody, isSandbox);

    if (!isValid) {
      console.error("PayFast server verification failed");
      return new NextResponse("OK", { status: 200 });
    }

    // Step 3: Verify merchant ID matches
    const expectedMerchantId = process.env.PAYFAST_MERCHANT_ID;
    if (itnData.merchant_id !== expectedMerchantId) {
      console.error("PayFast merchant ID mismatch:", {
        received: itnData.merchant_id,
        expected: expectedMerchantId,
      });
      return new NextResponse("OK", { status: 200 });
    }

    // Step 4: Process the payment based on status
    const reference = itnData.m_payment_id;
    const status = itnData.payment_status === "COMPLETE" ? "success" : "failed";

    // Step 5: Update purchase in Convex
    try {
      const convex = getConvexClient();
      await convex.mutation(api.payments.verifyPayFastPurchase, {
        reference,
        status,
        payfastData: {
          pf_payment_id: itnData.pf_payment_id,
          payment_status: itnData.payment_status,
          amount_gross: itnData.amount_gross,
          amount_fee: itnData.amount_fee,
          amount_net: itnData.amount_net,
          name_first: itnData.name_first,
          name_last: itnData.name_last,
          email_address: itnData.email_address,
          item_name: itnData.item_name,
        },
      });

      console.log("PayFast payment processed:", {
        reference,
        status,
        pfPaymentId: itnData.pf_payment_id,
      });
    } catch (dbError) {
      console.error("Failed to update purchase in database:", dbError);
      // Still return 200 to prevent PayFast from retrying
      // The payment was valid, just our DB update failed
    }

    // Return 200 OK to acknowledge receipt
    // PayFast expects a 200 response, otherwise it will retry
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("PayFast ITN error:", error);
    // Still return 200 to prevent infinite retries
    return new NextResponse("OK", { status: 200 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "PayFast ITN webhook endpoint active",
    timestamp: new Date().toISOString(),
  });
}

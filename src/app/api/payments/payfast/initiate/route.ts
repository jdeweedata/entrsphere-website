import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../../convex/_generated/api";
import {
  buildPayFastFormData,
  formatAmountForPayFast,
} from "@/lib/payfast";

// Lazy initialization of Convex client to avoid build-time errors
function getConvexClient() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  return new ConvexHttpClient(url);
}

export interface InitiatePaymentRequest {
  email: string;
  amount: number; // Amount in cents
  product: string;
  itemName: string;
  itemDescription?: string;
  sessionId?: string;
  nameFirst?: string;
  nameLast?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: InitiatePaymentRequest = await request.json();
    const { email, amount, product, itemName, itemDescription, sessionId, nameFirst, nameLast } = body;

    // Validate required fields
    if (!email || !amount || !product || !itemName) {
      return NextResponse.json(
        { error: "Missing required fields: email, amount, product, itemName" },
        { status: 400 }
      );
    }

    // Validate amount
    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Generate unique payment ID
    const paymentId = `PF_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("host")}`;

    // Determine if sandbox mode
    const isSandbox = process.env.PAYFAST_SANDBOX === "true";

    // Build PayFast form data
    const { formData, signature, actionUrl } = buildPayFastFormData(
      {
        return_url: `${baseUrl}/payment/success?reference=${paymentId}`,
        cancel_url: `${baseUrl}/payment/cancelled?reference=${paymentId}`,
        notify_url: `${baseUrl}/api/payments/payfast/notify`,
        name_first: nameFirst,
        name_last: nameLast,
        email_address: email,
        m_payment_id: paymentId,
        amount: formatAmountForPayFast(amount),
        item_name: itemName,
        item_description: itemDescription,
        custom_str1: product, // Store product type
        custom_str2: sessionId || "", // Store session ID if available
      },
      isSandbox
    );

    // Create pending purchase in Convex
    const convex = getConvexClient();
    await convex.mutation(api.payments.createPurchase, {
      email,
      sessionId,
      reference: paymentId,
      amount,
      currency: "ZAR",
      product,
      provider: "payfast",
    });

    // Return the form data for client-side redirect
    return NextResponse.json({
      success: true,
      paymentId,
      formData: {
        ...formData,
        signature,
      },
      actionUrl,
      sandbox: isSandbox,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to initiate payment" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "PayFast payment initiation endpoint",
    method: "POST",
    requiredFields: ["email", "amount", "product", "itemName"],
    optionalFields: ["itemDescription", "sessionId", "nameFirst", "nameLast"],
  });
}

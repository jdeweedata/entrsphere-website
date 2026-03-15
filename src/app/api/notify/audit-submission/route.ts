import { NextResponse } from "next/server";
import { Resend } from "resend";

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || "hello@entrsphere.com";

interface IntakeData {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  websiteUrl?: string;
  monthlyRevenue?: string;
  businessType?: string;
  biggestChallenge?: string;
  tier: string;
  purchaseReference: string;
}

export async function POST(request: Request) {
  try {
    const data: IntakeData = await request.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    if (!data.businessName || !data.contactName || !data.email || !data.tier) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const tierLabel =
      data.tier === "quick-scan"
        ? "Quick Scan (R2,500)"
        : data.tier === "deep-dive"
          ? "Deep Dive (R6,000)"
          : "Full Audit (R7,500)";

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "EntrSphere <notifications@entrsphere.com>",
      to: NOTIFY_EMAIL,
      subject: `New Audit Submission — ${data.businessName} (${tierLabel})`,
      html: `
        <h2>New Audit Intake Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Tier</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${tierLabel}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Business</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.businessName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Contact</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.contactName}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.email}</td></tr>
          ${data.phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.phone}</td></tr>` : ""}
          ${data.websiteUrl ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Website</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.websiteUrl}</td></tr>` : ""}
          ${data.monthlyRevenue ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Monthly Revenue</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.monthlyRevenue}</td></tr>` : ""}
          ${data.businessType ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Business Type</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.businessType}</td></tr>` : ""}
        </table>
        ${data.biggestChallenge ? `<h3>Biggest Challenge</h3><p>${data.biggestChallenge}</p>` : ""}
        <p style="margin-top: 24px; color: #666; font-size: 12px;">Reference: ${data.purchaseReference}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send notification" },
      { status: 500 }
    );
  }
}

// Email service - Resend integration for discovery profiles

import { DiscoverySession } from "@/types/discovery";
import { api } from "../../../convex/_generated/api";
import { convex } from "./client";
import { saveDiscoverySession } from "./session";

/**
 * Generate an outcome tracking token for a session
 * Returns the token that can be used in follow-up emails
 */
export async function generateOutcomeToken(
  sessionId: string
): Promise<{ success: boolean; token?: string; error?: string }> {
  if (!convex) {
    return { success: false, error: "Convex not configured" };
  }

  try {
    const result = await convex.mutation(api.outcomes.generateOutcomeToken, {
      sessionId,
    });
    return { success: true, token: result.token };
  } catch {
    return { success: false, error: "Failed to generate token" };
  }
}

/**
 * Get the outcome tracking URL for a session
 */
export function getOutcomeUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://entrsphere.com";
  return `${baseUrl}/outcome/${token}`;
}

/**
 * Send discovery profile to user's email via Resend
 * This saves the session AND sends a branded email with the results
 * Also generates outcome token for follow-up tracking
 */
export async function sendDiscoveryProfile(
  email: string,
  session: DiscoverySession
): Promise<{ success: boolean; message: string; outcomeToken?: string }> {
  if (!convex) {
    return { success: false, message: "Email service not available" };
  }

  if (!session.detectedRoute) {
    return { success: false, message: "No route detected" };
  }

  // First save the session
  const saveResult = await saveDiscoverySession(session, email, true);

  if (!saveResult.success) {
    return saveResult;
  }

  // Generate outcome token for follow-up tracking
  let outcomeToken: string | undefined;
  try {
    const tokenResult = await generateOutcomeToken(session.id);
    if (tokenResult.success && tokenResult.token) {
      outcomeToken = tokenResult.token;
    }
  } catch {
    // Continue without token
  }

  // Then send the email via Convex action
  // Note: outcomeToken is generated but not yet included in email template
  // TODO: Add outcome tracking link to follow-up emails
  try {
    const emailResult = await convex.action(api.discovery.sendDiscoveryEmail, {
      email,
      route: session.detectedRoute,
      answers: {
        q1_opener: session.answers.q1_opener,
        q2_clarity: session.answers.q2_clarity,
        q3_systems: session.answers.q3_systems,
        q4_authority: session.answers.q4_authority,
        q5_constraints: session.answers.q5_constraints,
      },
      signals: session.signals,
      sessionId: session.id,
    });

    if (!emailResult.success) {
      // Still return success since session was saved
      return {
        success: true,
        message: "Profile saved. Email delivery may be delayed.",
        outcomeToken,
      };
    }

    return {
      success: true,
      message: "Profile sent to your email!",
      outcomeToken,
    };
  } catch {
    // Still return success since session was saved
    return {
      success: true,
      message: "Profile saved. Email delivery may be delayed.",
      outcomeToken,
    };
  }
}

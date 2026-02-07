// Session management - saving sessions to Convex

import { api } from "../../../convex/_generated/api";
import { DiscoverySession } from "@/types/discovery";
import { convex } from "./client";
import { SessionData, ServiceResult } from "./types";

/**
 * Save a discovery session to Convex
 * This is the core MOAT data accumulation function
 */
export async function saveDiscoverySession(
  session: DiscoverySession,
  email?: string,
  wantsUpdates?: boolean
): Promise<ServiceResult> {
  if (!convex) {
    return { success: true, message: "Session saved locally only" };
  }

  if (!session.detectedRoute) {
    return { success: false, message: "No route detected" };
  }

  const durationSeconds = session.completedAt
    ? Math.round(
        (session.completedAt.getTime() - session.startedAt.getTime()) / 1000
      )
    : undefined;

  const sessionData: SessionData = {
    sessionId: session.id,
    route: session.detectedRoute,
    answers: {
      q1_opener: session.answers.q1_opener,
      q2_clarity: session.answers.q2_clarity,
      q3_systems: session.answers.q3_systems,
      q4_authority: session.answers.q4_authority,
      q5_constraints: session.answers.q5_constraints,
    },
    signals: session.signals,
    email,
    wantsUpdates,
    durationSeconds,
  };

  try {
    const result = await convex.mutation(api.discovery.saveSession, sessionData);
    return result;
  } catch {
    return { success: false, message: "Failed to save session" };
  }
}

/**
 * Get discovery stats for displaying on the page
 */
export async function getDiscoveryStats(): Promise<{
  total: number;
  byRoute: Record<string, number>;
  avgDurationSeconds: number;
} | null> {
  if (!convex) {
    return null;
  }

  try {
    const stats = await convex.query(api.discovery.getRouteStats);
    return stats;
  } catch {
    return null;
  }
}

/**
 * Get pattern insights for Discovery Intelligence feature
 */
export async function getPatternInsights(): Promise<{
  hasEnoughData: boolean;
  sessionCount: number;
  insights?: string[];
  routeDistribution?: Record<string, number>;
  message?: string;
} | null> {
  if (!convex) {
    return null;
  }

  try {
    const result = await convex.query(api.discovery.getPatternInsights);
    return {
      hasEnoughData: result.hasEnoughData,
      sessionCount: result.sessionCount,
      insights: result.insights,
      routeDistribution: result.routeDistribution,
      message: result.message,
    };
  } catch {
    return null;
  }
}

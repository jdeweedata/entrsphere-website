// Shared types for discovery services

import { DiscoveryRoute } from "@/types/discovery";

// Chat message type
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Signals type
export interface Signals {
  A: number;
  B: number;
  C: number;
  D: number;
}

// Session data for saving
export interface SessionData {
  sessionId: string;
  route: Exclude<DiscoveryRoute, null>;
  answers: Record<string, string>;
  signals: Signals;
  email?: string;
  wantsUpdates?: boolean;
  durationSeconds?: number;
}

// Stream event from chat API
export interface StreamEvent {
  type: "text" | "done";
  text?: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
    model: string;
    cache_read_input_tokens?: number;
  };
  model?: string;
}

// API usage info
export interface UsageInfo {
  input_tokens: number;
  output_tokens: number;
  model: string;
}

// Flow stages for the filesystem agent
export type FlowStage = "routing" | "discovery" | "post_spec" | "ask_anything" | "refinement";

// Common result type
export interface ServiceResult {
  success: boolean;
  message: string;
}

// SPEC.json structure
export interface SpecJson {
  project: {
    name: string;
    summary: string;
    route: DiscoveryRoute;
    status: "discovery-complete" | "ready-for-development";
    generated_at?: string;
  };
  users: Array<{
    type: string;
    persona: string;
    context: string;
  }>;
  features: Array<{
    id: string;
    priority: "must-have" | "nice-to-have";
    user_story: string;
    acceptance_criteria: string[];
    technical_notes?: string;
  }>;
  constraints: {
    business_rules: string[];
    technical?: string[];
    timeline?: string;
    budget?: string;
  };
  integrations?: Array<{
    system: string;
    type: "API" | "database" | "file" | "manual";
    complexity: "low" | "medium" | "high";
    notes?: string;
  }>;
  open_questions: string[];
  risks?: Array<{
    description: string;
    severity: "low" | "medium" | "high";
    mitigation: string;
  }>;
  meta?: {
    generated_at: string;
    session_id: string;
    route: string;
    model: string;
    tokens_used: number;
  };
}

// SPEC preview for freemium flow
export interface SpecPreview {
  preview: true;
  project: {
    name: string;
    summary: string;
    route: string;
    status: "preview";
  };
  features_preview: Array<{
    id: string;
    title: string;
    priority: "must-have" | "nice-to-have";
  }>;
  locked_content: {
    full_features_count: number;
    has_integrations: boolean;
    has_constraints: boolean;
    has_risks: boolean;
    has_acceptance_criteria: boolean;
  };
  upgrade_cta: string;
  meta?: {
    generated_at: string;
    session_id: string;
    route: string;
    email_captured: string;
    model: string;
  };
}

// Filesystem agent response
export interface FilesystemAgentResponse {
  content: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
    iterations: number;
    model: string;
  };
}

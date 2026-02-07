// Discovery services - modular exports
// All discovery-related API functions in one place

// Client and types
export { convex, API_BASE } from "./client";
export type {
  ChatMessage,
  Signals,
  SessionData,
  StreamEvent,
  UsageInfo,
  FlowStage,
  ServiceResult,
  SpecJson,
  SpecPreview,
  FilesystemAgentResponse,
} from "./types";

// Session management
export {
  saveDiscoverySession,
  getDiscoveryStats,
  getPatternInsights,
} from "./session";

// Chat API
export type { ChatOptions } from "./chat";
export {
  streamDiscoveryChat,
  sendDiscoveryMessage,
  checkAgentAvailability,
} from "./chat";

// SPEC generation
export type {
  GenerateSpecOptions,
  GeneratePreviewOptions,
  SaveLeadOptions,
} from "./spec";
export {
  generateSpecJson,
  generateSpecPreview,
  saveSpecPreviewLead,
} from "./spec";

// Filesystem agent
export type { FilesystemAgentOptions } from "./agent";
export {
  sendFilesystemAgentMessage,
  checkFilesystemAgentAvailability,
} from "./agent";

// Email service
export {
  generateOutcomeToken,
  getOutcomeUrl,
  sendDiscoveryProfile,
} from "./email";

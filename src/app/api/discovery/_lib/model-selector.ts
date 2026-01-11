// Tiered Model Selection for Discovery Router
// Uses Haiku 4.5 for standard flows, Sonnet 4.5 for complex scenarios

export const MODELS = {
  // Claude Haiku 4.5 - fast and cost-effective
  HAIKU: "claude-haiku-4-5-20251001",
  // Claude Sonnet 4.5 - balanced for complex scenarios
  SONNET: "claude-sonnet-4-5-20250929",
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

export interface DiscoveryContext {
  signals: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  phase: "interview" | "routing" | "deep-dive" | "spec-generation";
  messageCount: number;
  hasConflictingSignals: boolean;
  hasPoliticalComplexity: boolean;
  hasIntegrationComplexity: boolean;
  requestedDeepAnalysis: boolean;
}

/**
 * Select the appropriate model based on context
 */
export function selectModel(context: DiscoveryContext): ModelId {
  // Always use Sonnet for SPEC.json generation
  if (context.phase === "spec-generation") {
    return MODELS.SONNET;
  }

  // Use Sonnet for Route C (political complexity)
  if (context.hasPoliticalComplexity || context.signals.C > 0.4) {
    return MODELS.SONNET;
  }

  // Use Sonnet when signals are conflicting
  if (context.hasConflictingSignals) {
    return MODELS.SONNET;
  }

  // Use Sonnet for complex integration scenarios
  if (context.hasIntegrationComplexity && context.signals.D > 0.5) {
    return MODELS.SONNET;
  }

  // Use Sonnet if user explicitly requested deeper analysis
  if (context.requestedDeepAnalysis) {
    return MODELS.SONNET;
  }

  // Default to Haiku for standard flows
  return MODELS.HAIKU;
}

/**
 * Analyze conversation to build context for model selection
 */
export function analyzeConversation(
  messages: Array<{ role: string; content: string }>,
  currentSignals: { A: number; B: number; C: number; D: number }
): DiscoveryContext {
  const messageCount = messages.length;

  // Check for conflicting signals
  const signalValues = Object.values(currentSignals);
  const maxSignal = Math.max(...signalValues);
  const sortedSignals = [...signalValues].sort((a, b) => b - a);
  const secondMaxSignal = sortedSignals[1] || 0;
  const hasConflictingSignals =
    maxSignal - secondMaxSignal < 0.15 && maxSignal > 0.2;

  // Detect political complexity from language patterns
  const allContent = messages.map((m) => m.content.toLowerCase()).join(" ");
  const politicalIndicators = [
    "stakeholder",
    "approval",
    "sign-off",
    "politics",
    "it depends",
    "different opinions",
    "alignment",
    "buy-in",
    "committee",
    "board",
  ];
  const hasPoliticalComplexity = politicalIndicators.some((term) =>
    allContent.includes(term)
  );

  // Detect integration complexity
  const integrationIndicators = [
    "api",
    "integration",
    "legacy",
    "migrate",
    "salesforce",
    "sap",
    "database",
    "sync",
    "webhook",
    "existing system",
  ];
  const hasIntegrationComplexity = integrationIndicators.some((term) =>
    allContent.includes(term)
  );

  // Check if user requested deep analysis
  const deepAnalysisIndicators = [
    "analyze deeper",
    "more detail",
    "comprehensive",
    "thorough",
    "edge cases",
    "what about",
    "consider",
  ];
  const lastMessage = messages[messages.length - 1]?.content.toLowerCase() || "";
  const requestedDeepAnalysis = deepAnalysisIndicators.some((term) =>
    lastMessage.includes(term)
  );

  // Determine phase based on message count and content
  let phase: DiscoveryContext["phase"] = "interview";
  if (messageCount >= 10 || allContent.includes("route detected")) {
    phase = "routing";
  }
  if (allContent.includes("deep dive") || allContent.includes("let's document")) {
    phase = "deep-dive";
  }
  if (allContent.includes("generate spec") || allContent.includes("spec.json")) {
    phase = "spec-generation";
  }

  return {
    signals: currentSignals,
    phase,
    messageCount,
    hasConflictingSignals,
    hasPoliticalComplexity,
    hasIntegrationComplexity,
    requestedDeepAnalysis,
  };
}

/**
 * Get model-specific parameters
 */
export function getModelParams(model: ModelId) {
  if (model === MODELS.SONNET) {
    return {
      max_tokens: 4096,
    };
  }

  // Haiku parameters (optimized for speed)
  return {
    max_tokens: 2048,
  };
}

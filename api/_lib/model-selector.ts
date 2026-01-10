// Tiered Model Selection for Discovery Router
// Uses Haiku 4.5 for standard flows, Opus 4.5 for complex scenarios

export const MODELS = {
  HAIKU: "claude-haiku-4-5-20241022",
  OPUS: "claude-opus-4-5-20250514",
} as const;

export type ModelId = (typeof MODELS)[keyof typeof MODELS];

export interface DiscoveryContext {
  // Signal strengths from 0-1
  signals: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  // Current phase
  phase: "interview" | "routing" | "deep-dive" | "spec-generation";
  // Number of messages in conversation
  messageCount: number;
  // Detected complexity indicators
  hasConflictingSignals: boolean;
  hasPoliticalComplexity: boolean;
  hasIntegrationComplexity: boolean;
  // User explicitly requested deeper analysis
  requestedDeepAnalysis: boolean;
}

/**
 * Select the appropriate model based on context
 *
 * Cost optimization strategy:
 * - Haiku ($1/$5 MTok): 80% of requests - standard interview, simple routing
 * - Opus ($5/$25 MTok): 20% of requests - complex scenarios, spec generation
 */
export function selectModel(context: DiscoveryContext): ModelId {
  // Always use Opus for SPEC.json generation (requires synthesis)
  if (context.phase === "spec-generation") {
    return MODELS.OPUS;
  }

  // Use Opus for Route C (political complexity requires nuanced reasoning)
  if (context.hasPoliticalComplexity || context.signals.C > 0.4) {
    return MODELS.OPUS;
  }

  // Use Opus when signals are conflicting (needs deeper analysis)
  if (context.hasConflictingSignals) {
    return MODELS.OPUS;
  }

  // Use Opus for complex integration scenarios
  if (context.hasIntegrationComplexity && context.signals.D > 0.5) {
    return MODELS.OPUS;
  }

  // Use Opus if user explicitly requested deeper analysis
  if (context.requestedDeepAnalysis) {
    return MODELS.OPUS;
  }

  // Default to Haiku for standard flows (cost optimization)
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

  // Check for conflicting signals (multiple routes scoring similarly)
  const signalValues = Object.values(currentSignals);
  const maxSignal = Math.max(...signalValues);
  const secondMaxSignal = signalValues.sort((a, b) => b - a)[1] || 0;
  const hasConflictingSignals = maxSignal - secondMaxSignal < 0.15 && maxSignal > 0.2;

  // Detect political complexity from language patterns
  const allContent = messages.map(m => m.content.toLowerCase()).join(" ");
  const politicalIndicators = [
    "stakeholder", "approval", "sign-off", "politics", "it depends",
    "different opinions", "alignment", "buy-in", "committee", "board"
  ];
  const hasPoliticalComplexity = politicalIndicators.some(term =>
    allContent.includes(term)
  );

  // Detect integration complexity
  const integrationIndicators = [
    "api", "integration", "legacy", "migrate", "salesforce", "sap",
    "database", "sync", "webhook", "existing system"
  ];
  const hasIntegrationComplexity = integrationIndicators.some(term =>
    allContent.includes(term)
  );

  // Check if user requested deep analysis
  const deepAnalysisIndicators = [
    "analyze deeper", "more detail", "comprehensive", "thorough",
    "edge cases", "what about", "consider"
  ];
  const requestedDeepAnalysis = deepAnalysisIndicators.some(term =>
    messages[messages.length - 1]?.content.toLowerCase().includes(term)
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
  if (model === MODELS.OPUS) {
    return {
      max_tokens: 4096,
      // Enable extended thinking for complex scenarios
      // temperature: 0.7, // Slightly higher for creative synthesis
    };
  }

  // Haiku parameters (optimized for speed)
  return {
    max_tokens: 2048,
    // temperature: 0.5, // Lower for consistent routing
  };
}

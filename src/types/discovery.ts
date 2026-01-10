// Discovery Agent Types
// These types support both the client-side demo and future Agent SDK integration

export type DiscoveryRoute = 'A' | 'B' | 'C' | 'D' | null;

export interface RouteInfo {
  id: DiscoveryRoute;
  name: string;
  title: string;
  description: string;
  signal: string;
  approach: string;
  duration: string;
  riskStat: string;
}

export const ROUTES: Record<Exclude<DiscoveryRoute, null>, RouteInfo> = {
  A: {
    id: 'A',
    name: 'Standard Discovery',
    title: 'Clear Requirements',
    description: 'You know what you need. Let\'s document it properly.',
    signal: 'Clear, direct answers with specific examples',
    approach: 'Deep interview to capture all requirements, edge cases, and success criteria.',
    duration: '30-45 minutes',
    riskStat: '73% of projects with clear initial requirements ship on time',
  },
  B: {
    id: 'B',
    name: 'Exploratory Prototype',
    title: 'I\'ll Know It When I See It',
    description: 'You can\'t describe it yet, but you\'ll recognize it. That\'s okay.',
    signal: '"Show me options" / "I\'m not sure what\'s possible"',
    approach: 'Rapid prototyping cycle: Build rough version, get your reaction, iterate.',
    duration: '5 min context + multiple iterations',
    riskStat: '87% of "I\'ll know it when I see it" projects face 40% scope creep without proper discovery',
  },
  C: {
    id: 'C',
    name: 'Strategic Ambiguity',
    title: 'Political Complexity',
    description: 'Some decisions aren\'t yours to make. Let\'s navigate that carefully.',
    signal: '"That\'s still being discussed" / Visible discomfort with certain topics',
    approach: 'Document what\'s clear, identify decision points, escalate to leadership.',
    duration: '20-30 minutes',
    riskStat: '62% of failed projects had unresolved political blockers hiding as "unclear requirements"',
  },
  D: {
    id: 'D',
    name: 'Integration Discovery',
    title: 'System Complexity',
    description: 'Existing systems are involved. We need business AND technical perspectives.',
    signal: '"It needs to work with [existing system]" / "Talk to our dev about that"',
    approach: 'Dual-track: Business requirements first, then technical architecture.',
    duration: '2 sessions (Business + Technical)',
    riskStat: '58% of integration projects fail due to discovered constraints late in development',
  },
};

// Router question types
export interface RouterQuestion {
  id: string;
  question: string;
  subtext?: string;
  options: RouterOption[];
  signals: Record<string, DiscoveryRoute[]>;
}

export interface RouterOption {
  id: string;
  label: string;
  description?: string;
}

// Chat message types
export type MessageRole = 'agent' | 'user' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  options?: RouterOption[];
  selectedOption?: string;
  isTyping?: boolean;
}

// Session state
export type SessionPhase =
  | 'welcome'
  | 'routing'
  | 'route_detected'
  | 'email_capture'
  | 'complete';

export interface DiscoverySession {
  id: string;
  phase: SessionPhase;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  signals: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  detectedRoute: DiscoveryRoute;
  email?: string;
  startedAt: Date;
  completedAt?: Date;
}

// Email capture form
export interface EmailCaptureData {
  email: string;
  wantsUpdates: boolean;
}

// Discovery profile (sent to user)
export interface DiscoveryProfile {
  route: RouteInfo;
  answers: Record<string, string>;
  insights: string[];
  nextSteps: string[];
  generatedAt: Date;
}

// Analytics events
export type DiscoveryEvent =
  | 'discovery_started'
  | 'discovery_question_answered'
  | 'discovery_route_detected'
  | 'discovery_email_captured'
  | 'discovery_completed'
  | 'discovery_abandoned';

export interface DiscoveryEventData {
  sessionId: string;
  event: DiscoveryEvent;
  route?: DiscoveryRoute;
  questionId?: string;
  answerId?: string;
  email?: string;
  timeSpentSeconds?: number;
}

// Future: Agent SDK integration types
export interface AgentSDKConfig {
  apiKey?: string;
  sessionId?: string;
  allowedTools: string[];
  hooks?: {
    onToolUse?: (tool: string, input: unknown) => void;
    onMessage?: (message: ChatMessage) => void;
    onComplete?: (session: DiscoverySession) => void;
  };
}

// Supabase types (for future backend)
export interface SupabaseDiscoverySession {
  id: string;
  route: DiscoveryRoute;
  answers: Record<string, string>;
  email?: string;
  industry?: string;
  project_type?: string;
  spec_json?: Record<string, unknown>;
  created_at: string;
  completed_at?: string;
}

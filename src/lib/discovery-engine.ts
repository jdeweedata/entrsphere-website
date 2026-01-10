// Discovery Engine - Client-side state machine for the demo
// This handles the routing questions and route detection
// Future: Replace with Agent SDK for full discovery sessions

import {
  DiscoveryRoute,
  DiscoverySession,
  RouterQuestion,
  ROUTES,
  ChatMessage,
  SessionPhase,
} from '@/types/discovery';

// The 5 Router Questions based on DISCOVERY_ROUTER_PROMPT.md
export const ROUTER_QUESTIONS: RouterQuestion[] = [
  {
    id: 'q1_opener',
    question: 'In a sentence or two, what are you trying to accomplish?',
    subtext: 'Don\'t overthink this. Just tell me the high-level goal.',
    options: [
      {
        id: 'clear_goal',
        label: 'I have a specific goal',
        description: 'I know exactly what I need to build',
      },
      {
        id: 'exploring',
        label: 'I\'m still exploring',
        description: 'I have a general idea but need to figure it out',
      },
      {
        id: 'complicated',
        label: 'It\'s complicated',
        description: 'There are factors I can\'t fully explain right now',
      },
      {
        id: 'integration',
        label: 'I need to connect systems',
        description: 'It needs to work with existing tools/databases',
      },
    ],
    signals: {
      clear_goal: ['A'],
      exploring: ['B'],
      complicated: ['C'],
      integration: ['D'],
    },
  },
  {
    id: 'q2_clarity',
    question: 'How clear is this in your head?',
    subtext: 'Be honest. There\'s no wrong answer here.',
    options: [
      {
        id: 'know_exactly',
        label: 'I know exactly what I need',
        description: 'Just need to document it properly',
      },
      {
        id: 'general_idea',
        label: 'General idea, need details',
        description: 'The vision is there, specifics are fuzzy',
      },
      {
        id: 'know_when_see',
        label: 'I\'ll know it when I see it',
        description: 'Can\'t describe it, but I\'ll recognize it',
      },
      {
        id: 'its_complicated',
        label: 'It\'s complicated',
        description: 'Multiple stakeholders, different opinions',
      },
    ],
    signals: {
      know_exactly: ['A'],
      general_idea: ['A', 'B'],
      know_when_see: ['B'],
      its_complicated: ['C'],
    },
  },
  {
    id: 'q3_systems',
    question: 'Does this need to work with any existing systems?',
    subtext: 'Databases, tools, APIs - just names are fine.',
    options: [
      {
        id: 'standalone',
        label: 'No, this is standalone',
        description: 'Building something new from scratch',
      },
      {
        id: 'some_integration',
        label: 'Yes, a few integrations',
        description: 'Needs to connect to 1-2 existing systems',
      },
      {
        id: 'heavy_integration',
        label: 'Yes, significant integration',
        description: 'Multiple systems, complex data flows',
      },
      {
        id: 'not_sure',
        label: 'I think so, but not sure',
        description: 'Someone else handles the technical side',
      },
    ],
    signals: {
      standalone: [],
      some_integration: ['D'],
      heavy_integration: ['D'],
      not_sure: ['D'],
    },
  },
  {
    id: 'q4_authority',
    question: 'If we nail down requirements today, who approves them?',
    subtext: 'This helps me understand the decision-making process.',
    options: [
      {
        id: 'my_call',
        label: 'I can decide',
        description: 'I have the authority to approve',
      },
      {
        id: 'need_approval',
        label: 'Need to run it by someone',
        description: 'Leadership or stakeholder sign-off needed',
      },
      {
        id: 'being_discussed',
        label: 'That\'s being discussed',
        description: 'Decisions are happening at a higher level',
      },
      {
        id: 'different_opinions',
        label: 'Different people want different things',
        description: 'There\'s no clear consensus yet',
      },
    ],
    signals: {
      my_call: [],
      need_approval: [],
      being_discussed: ['C'],
      different_opinions: ['C'],
    },
  },
  {
    id: 'q5_constraints',
    question: 'Any sensitivities I should know about?',
    subtext: 'Topics to avoid, things still being figured out, political landmines.',
    options: [
      {
        id: 'ask_anything',
        label: 'Nope, ask anything',
        description: 'Open book, no restrictions',
      },
      {
        id: 'some_limits',
        label: 'Some things are still being figured out',
        description: 'A few open questions, but manageable',
      },
      {
        id: 'avoid_topics',
        label: 'Let\'s avoid certain topics',
        description: 'There are boundaries I need to respect',
      },
      {
        id: 'confidential',
        label: 'Rather not put some things in writing',
        description: 'Sensitive context that stays verbal',
      },
    ],
    signals: {
      ask_anything: [],
      some_limits: ['C'],
      avoid_topics: ['C'],
      confidential: ['C'],
    },
  },
];

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Create initial session
export function createSession(): DiscoverySession {
  return {
    id: generateId(),
    phase: 'welcome',
    currentQuestionIndex: -1,
    answers: {},
    signals: { A: 0, B: 0, C: 0, D: 0 },
    detectedRoute: null,
    startedAt: new Date(),
  };
}

// Create a chat message
export function createMessage(
  role: ChatMessage['role'],
  content: string,
  options?: ChatMessage['options']
): ChatMessage {
  return {
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
    options,
  };
}

// Get welcome message
export function getWelcomeMessage(): ChatMessage {
  return createMessage(
    'agent',
    `Hey! I'm EntrSphere's Discovery Agent.

Before we dive in, I need to understand what we're working with. I'll ask you 5 quick questions to figure out the best way to help you.

This takes about 2-3 minutes. Ready?`
  );
}

// Get current question as message
export function getCurrentQuestionMessage(questionIndex: number): ChatMessage | null {
  const question = ROUTER_QUESTIONS[questionIndex];
  if (!question) return null;

  let content = question.question;
  if (question.subtext) {
    content += `\n\n*${question.subtext}*`;
  }

  return createMessage('agent', content, question.options);
}

// Process an answer and update session
export function processAnswer(
  session: DiscoverySession,
  questionId: string,
  answerId: string
): DiscoverySession {
  const question = ROUTER_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return session;

  // Update answers
  const newAnswers = { ...session.answers, [questionId]: answerId };

  // Update signals
  const newSignals = { ...session.signals };
  const signalRoutes = question.signals[answerId] || [];
  signalRoutes.forEach((route) => {
    if (route) {
      newSignals[route]++;
    }
  });

  return {
    ...session,
    answers: newAnswers,
    signals: newSignals,
  };
}

// Calculate detected route based on signals
export function calculateRoute(signals: DiscoverySession['signals']): DiscoveryRoute {
  // Priority order: C (strategic) > D (integration) > B (exploratory) > A (standard)
  // This ensures we catch complexity before defaulting to simple paths

  // If any strong C signals, route to Strategic Ambiguity
  if (signals.C >= 2) return 'C';

  // If integration signals present, route to Integration
  if (signals.D >= 2) return 'D';

  // If exploratory signals present, route to Exploratory
  if (signals.B >= 2) return 'B';

  // Default to Standard Discovery
  return 'A';
}

// Get route detection message
export function getRouteDetectionMessage(route: DiscoveryRoute): ChatMessage {
  if (!route) {
    return createMessage('agent', 'Let me analyze your responses...');
  }

  const routeInfo = ROUTES[route];

  return createMessage(
    'agent',
    `Based on your answers, you're a **${routeInfo.name}** scenario.

**${routeInfo.title}**
${routeInfo.description}

${routeInfo.riskStat}

**What a full session would cover:**
${routeInfo.approach}

**Typical duration:** ${routeInfo.duration}`
  );
}

// Get email capture prompt
export function getEmailCaptureMessage(): ChatMessage {
  return createMessage(
    'agent',
    `Want your personalized Discovery Profile?

I'll send you:
- Your scenario analysis with risk factors
- Recommended questions for your specific situation
- Tips to avoid common pitfalls for your route

Enter your email below and I'll send it right over.`
  );
}

// Get completion message
export function getCompletionMessage(route: DiscoveryRoute, hasEmail: boolean): ChatMessage {
  const routeInfo = route ? ROUTES[route] : null;

  if (hasEmail) {
    return createMessage(
      'agent',
      `Done! Check your inbox for your Discovery Profile.

**Want the full experience?**
A complete ${routeInfo?.name || 'Discovery'} session generates a production-ready SPEC.json you can hand directly to developers.

[Start Full Session →](/solutions/discovery-router)`
    );
  }

  return createMessage(
    'agent',
    `Thanks for trying the Discovery Agent!

**Ready for the full experience?**
A complete ${routeInfo?.name || 'Discovery'} session generates:
- Detailed PRD (Product Requirements Document)
- Production-ready SPEC.json
- All edge cases and acceptance criteria

[Get the Discovery Router Toolkit →](/solutions/discovery-router)`
  );
}

// Get insights based on route and answers
export function getRouteInsights(
  route: DiscoveryRoute,
  answers: Record<string, string>
): string[] {
  const insights: string[] = [];

  switch (route) {
    case 'A':
      insights.push('You have clarity - don\'t let scope creep erode it.');
      insights.push('Document edge cases now, not during development.');
      if (answers.q3_systems !== 'standalone') {
        insights.push('Watch out: You mentioned integrations. Consider a hybrid A+D approach.');
      }
      break;

    case 'B':
      insights.push('Your best requirements will come FROM prototypes, not before them.');
      insights.push('Set a timebox: 3-5 iteration rounds max before committing.');
      insights.push('Warning: "I\'ll know it when I see it" projects average 40% more scope creep.');
      break;

    case 'C':
      insights.push('Document what IS clear separately from what ISN\'T.');
      insights.push('Frame ambiguities as decision points for leadership, not your problem to solve.');
      insights.push('Protect yourself: Get sign-off on the "safe to build" scope.');
      break;

    case 'D':
      insights.push('Business and technical discovery must happen separately.');
      insights.push('58% of integration projects fail due to late-discovered constraints.');
      insights.push('Map system dependencies before writing any code.');
      break;
  }

  return insights;
}

// Advance to next phase
export function advancePhase(session: DiscoverySession): DiscoverySession {
  const phases: SessionPhase[] = ['welcome', 'routing', 'route_detected', 'email_capture', 'complete'];
  const currentIndex = phases.indexOf(session.phase);
  const nextPhase = phases[currentIndex + 1] || 'complete';

  return {
    ...session,
    phase: nextPhase,
  };
}

// Move to next question
export function nextQuestion(session: DiscoverySession): DiscoverySession {
  const nextIndex = session.currentQuestionIndex + 1;

  if (nextIndex >= ROUTER_QUESTIONS.length) {
    // All questions answered, calculate route and move to detection
    const route = calculateRoute(session.signals);
    return {
      ...session,
      currentQuestionIndex: nextIndex,
      phase: 'route_detected',
      detectedRoute: route,
    };
  }

  return {
    ...session,
    currentQuestionIndex: nextIndex,
    phase: 'routing',
  };
}

// Storage keys
const STORAGE_KEY = 'entrsphere_discovery_session';

// Save session to localStorage
export function saveSession(session: DiscoverySession): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn('Failed to save discovery session:', e);
  }
}

// Load session from localStorage
export function loadSession(): DiscoverySession | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const session = JSON.parse(stored) as DiscoverySession;
    // Convert date strings back to Date objects
    session.startedAt = new Date(session.startedAt);
    if (session.completedAt) {
      session.completedAt = new Date(session.completedAt);
    }

    return session;
  } catch (e) {
    console.warn('Failed to load discovery session:', e);
    return null;
  }
}

// Clear session from localStorage
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear discovery session:', e);
  }
}

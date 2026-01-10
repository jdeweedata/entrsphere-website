// Main Discovery Chat component
// Orchestrates the router questions, route detection, and email capture

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage as ChatMessageType, DiscoverySession } from '@/types/discovery';
import {
  createSession,
  createMessage,
  getWelcomeMessage,
  getCurrentQuestionMessage,
  processAnswer,
  nextQuestion,
  getRouteDetectionMessage,
  getEmailCaptureMessage,
  getCompletionMessage,
  saveSession,
  clearSession,
  ROUTER_QUESTIONS,
  advancePhase,
} from '@/lib/discovery-engine';
import ChatMessage from './ChatMessage';
import ChoiceButtons from './ChoiceButtons';
import TypingIndicator from './TypingIndicator';
import EmailCapture from './EmailCapture';
import RouteResult from './RouteResult';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, Sparkles } from 'lucide-react';
import posthog from 'posthog-js';
import { saveDiscoverySession, sendDiscoveryProfile } from '@/services/discoveryService';

const TYPING_DELAY = 800; // ms to show typing indicator

const DiscoveryChat = () => {
  const [session, setSession] = useState<DiscoverySession>(createSession);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOptions, setCurrentOptions] = useState<ChatMessageType['options']>();
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Add message with typing effect
  const addAgentMessage = useCallback((message: ChatMessageType) => {
    setIsTyping(true);
    setCurrentOptions(undefined);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, message]);

      if (message.options) {
        setCurrentOptions(message.options);
      }
    }, TYPING_DELAY);
  }, []);

  // Start the discovery flow
  const startDiscovery = useCallback(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Track start event
    posthog.capture('discovery_started', { sessionId: session.id });

    // Show welcome message
    const welcome = getWelcomeMessage();
    addAgentMessage(welcome);

    // After welcome, show first question
    setTimeout(() => {
      const newSession = nextQuestion(session);
      setSession(newSession);
      saveSession(newSession);

      const questionMsg = getCurrentQuestionMessage(newSession.currentQuestionIndex);
      if (questionMsg) {
        addAgentMessage(questionMsg);
      }
    }, TYPING_DELAY + 500);
  }, [session, addAgentMessage]);

  // Initialize on mount
  useEffect(() => {
    startDiscovery();
  }, [startDiscovery]);

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    const currentQuestion = ROUTER_QUESTIONS[session.currentQuestionIndex];
    if (!currentQuestion) return;

    // Find the selected option label
    const selectedOption = currentQuestion.options.find((o) => o.id === optionId);
    if (!selectedOption) return;

    // Add user message
    const userMessage = createMessage('user', selectedOption.label);
    setMessages((prev) => [...prev, userMessage]);
    setCurrentOptions(undefined);

    // Track question answered
    posthog.capture('discovery_question_answered', {
      sessionId: session.id,
      questionId: currentQuestion.id,
      answerId: optionId,
    });

    // Process the answer
    let updatedSession = processAnswer(session, currentQuestion.id, optionId);

    // Move to next question or route detection
    updatedSession = nextQuestion(updatedSession);
    setSession(updatedSession);
    saveSession(updatedSession);

    // Show next content based on phase
    if (updatedSession.phase === 'route_detected') {
      // Track route detection
      posthog.capture('discovery_route_detected', {
        sessionId: session.id,
        route: updatedSession.detectedRoute,
      });

      // Show route detection message
      const routeMsg = getRouteDetectionMessage(updatedSession.detectedRoute);
      addAgentMessage(routeMsg);

      // After showing route, prompt for email
      setTimeout(() => {
        const newSession = advancePhase(updatedSession);
        setSession(newSession);
        saveSession(newSession);

        const emailMsg = getEmailCaptureMessage();
        addAgentMessage(emailMsg);
      }, TYPING_DELAY + 1500);
    } else {
      // Show next question
      const questionMsg = getCurrentQuestionMessage(updatedSession.currentQuestionIndex);
      if (questionMsg) {
        addAgentMessage(questionMsg);
      }
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (email: string, wantsUpdates: boolean) => {
    setIsEmailLoading(true);

    // Track email capture
    posthog.capture('discovery_email_captured', {
      sessionId: session.id,
      route: session.detectedRoute,
      wantsUpdates,
    });

    // Update session
    const completedSession: DiscoverySession = {
      ...session,
      email,
      phase: 'complete',
      completedAt: new Date(),
    };
    setSession(completedSession);
    saveSession(completedSession);

    // Save to Convex and send discovery profile
    try {
      await sendDiscoveryProfile(email, completedSession);
    } catch (error) {
      console.error('Failed to save session to backend:', error);
      // Continue anyway - local session is saved
    }

    // Track completion
    posthog.capture('discovery_completed', {
      sessionId: session.id,
      route: session.detectedRoute,
      hasEmail: true,
      durationSeconds: Math.round(
        (new Date().getTime() - session.startedAt.getTime()) / 1000
      ),
    });

    // Show completion message
    const completeMsg = getCompletionMessage(session.detectedRoute, true);
    addAgentMessage(completeMsg);

    setIsEmailLoading(false);
  };

  // Handle email skip
  const handleEmailSkip = async () => {
    // Update session
    const completedSession: DiscoverySession = {
      ...session,
      phase: 'complete',
      completedAt: new Date(),
    };
    setSession(completedSession);
    saveSession(completedSession);

    // Save to Convex (without email for anonymous pattern data)
    try {
      await saveDiscoverySession(completedSession);
    } catch (error) {
      console.error('Failed to save session to backend:', error);
    }

    // Track completion without email
    posthog.capture('discovery_completed', {
      sessionId: session.id,
      route: session.detectedRoute,
      hasEmail: false,
      durationSeconds: Math.round(
        (new Date().getTime() - session.startedAt.getTime()) / 1000
      ),
    });

    // Show completion message
    const completeMsg = getCompletionMessage(session.detectedRoute, false);
    addAgentMessage(completeMsg);
  };

  // Restart the discovery
  const handleRestart = () => {
    clearSession();
    hasStarted.current = false;
    setMessages([]);
    setCurrentOptions(undefined);
    setSession(createSession());

    // Restart after a brief delay
    setTimeout(() => {
      startDiscovery();
    }, 100);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm">Discovery Agent</h2>
            <p className="text-xs text-slate-500">
              {session.phase === 'complete' ? 'Session complete' : 'Finding your route...'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRestart}
          className="text-slate-500 hover:text-slate-700"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Restart
        </Button>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-1">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isTyping && <TypingIndicator />}

          {/* Choice buttons (shown below last message) */}
          {currentOptions && !isTyping && session.phase === 'routing' && (
            <div className="ml-0 md:ml-8 max-w-[85%] md:max-w-[70%]">
              <ChoiceButtons
                options={currentOptions}
                onSelect={handleOptionSelect}
              />
            </div>
          )}

          {/* Route result (shown after detection) */}
          {session.phase === 'email_capture' && session.detectedRoute && !isTyping && (
            <div className="ml-0 md:ml-8 max-w-[85%] md:max-w-[70%]">
              <RouteResult route={session.detectedRoute} answers={session.answers} />
              <EmailCapture
                onSubmit={handleEmailSubmit}
                onSkip={handleEmailSkip}
                isLoading={isEmailLoading}
              />
            </div>
          )}

          {/* Final route result after completion */}
          {session.phase === 'complete' && session.detectedRoute && !isTyping && (
            <div className="ml-0 md:ml-8 max-w-[85%] md:max-w-[70%]">
              <RouteResult route={session.detectedRoute} answers={session.answers} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer - Progress indicator */}
      <div className="px-4 py-3 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {session.phase === 'routing' && (
              <>
                Question {session.currentQuestionIndex + 1} of {ROUTER_QUESTIONS.length}
              </>
            )}
            {session.phase === 'route_detected' && 'Route detected!'}
            {session.phase === 'email_capture' && 'Get your profile'}
            {session.phase === 'complete' && 'Discovery complete'}
          </span>
          <span className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                session.phase !== 'complete' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            {session.phase !== 'complete' ? 'Active' : 'Done'}
          </span>
        </div>
        {session.phase === 'routing' && (
          <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all duration-300"
              style={{
                width: `${((session.currentQuestionIndex + 1) / ROUTER_QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryChat;

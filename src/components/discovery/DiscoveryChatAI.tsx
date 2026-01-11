// AI-Powered Discovery Chat Component
// Uses the filesystem agent for dynamic, free-form conversations
// Brand: EntrSphere Design System

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChatMessage as ChatMessageType, DiscoveryRoute } from "@/types/discovery";
import { sendFilesystemAgentMessage } from "@/services/discoveryService";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import SpecPreviewModal from "./SpecPreviewModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowsClockwise, Sparkle, PaperPlaneTilt, FileCode } from "@phosphor-icons/react";
import posthog from "posthog-js";

// Generate unique IDs
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const generateSessionId = () => `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  onSwitchMode?: () => void; // Optional callback to switch to static mode
}

const DiscoveryChatAI = ({ onSwitchMode }: Props) => {
  const [sessionId] = useState(generateSessionId);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]); // For API calls
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedRoute, setDetectedRoute] = useState<DiscoveryRoute>(null);
  const [signals, setSignals] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState({ input: 0, output: 0 });
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasStarted = useRef(false);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Create a chat message object
  const createMessage = (role: 'user' | 'assistant', content: string): ChatMessageType => ({
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  });

  // Add initial welcome message
  const startDiscovery = useCallback(async () => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Track start event
    posthog.capture('discovery_ai_started', { sessionId });

    setIsLoading(true);

    try {
      // Send initial message to get AI welcome
      const response = await sendFilesystemAgentMessage(
        [{ role: 'user', content: "Hi, I'd like to start a discovery session for a new project." }],
        sessionId,
        null,
        signals
      );

      // Add the AI response as welcome message
      const welcomeMsg = createMessage('assistant', response.content);
      setMessages([welcomeMsg]);
      setAiMessages([
        { role: 'user', content: "Hi, I'd like to start a discovery session for a new project." },
        { role: 'assistant', content: response.content }
      ]);

      setTokenUsage({
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      });
    } catch (err) {
      setError('Failed to connect to AI agent. Please try again.');
      console.error('AI agent error:', err);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [sessionId, signals]);

  // Initialize on mount
  useEffect(() => {
    startDiscovery();
  }, [startDiscovery]);

  // Detect route from AI response
  const detectRouteFromResponse = (content: string): void => {
    const lowerContent = content.toLowerCase();

    // Look for explicit route mentions
    if (lowerContent.includes('route a') || lowerContent.includes('standard discovery')) {
      setDetectedRoute('A');
      setSignals(prev => ({ ...prev, A: Math.min(prev.A + 0.2, 1) }));
    } else if (lowerContent.includes('route b') || lowerContent.includes('exploratory')) {
      setDetectedRoute('B');
      setSignals(prev => ({ ...prev, B: Math.min(prev.B + 0.2, 1) }));
    } else if (lowerContent.includes('route c') || lowerContent.includes('stakeholder')) {
      setDetectedRoute('C');
      setSignals(prev => ({ ...prev, C: Math.min(prev.C + 0.2, 1) }));
    } else if (lowerContent.includes('route d') || lowerContent.includes('integration')) {
      setDetectedRoute('D');
      setSignals(prev => ({ ...prev, D: Math.min(prev.D + 0.2, 1) }));
    }

    // Detect signals from keywords
    if (lowerContent.includes('specific') || lowerContent.includes('clear requirements')) {
      setSignals(prev => ({ ...prev, A: Math.min(prev.A + 0.1, 1) }));
    }
    if (lowerContent.includes('exploring') || lowerContent.includes('general idea')) {
      setSignals(prev => ({ ...prev, B: Math.min(prev.B + 0.1, 1) }));
    }
    if (lowerContent.includes('stakeholder') || lowerContent.includes('alignment')) {
      setSignals(prev => ({ ...prev, C: Math.min(prev.C + 0.1, 1) }));
    }
    if (lowerContent.includes('api') || lowerContent.includes('integration') || lowerContent.includes('database')) {
      setSignals(prev => ({ ...prev, D: Math.min(prev.D + 0.1, 1) }));
    }
  };

  // Send message to AI agent
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userContent = inputValue.trim();
    setInputValue('');
    setError(null);

    // Add user message to UI
    const userMsg = createMessage('user', userContent);
    setMessages(prev => [...prev, userMsg]);

    // Update AI messages for API
    const newAiMessages: AIMessage[] = [...aiMessages, { role: 'user', content: userContent }];
    setAiMessages(newAiMessages);

    // Track message sent
    posthog.capture('discovery_ai_message_sent', {
      sessionId,
      messageLength: userContent.length,
      detectedRoute,
    });

    setIsLoading(true);

    try {
      const response = await sendFilesystemAgentMessage(
        newAiMessages,
        sessionId,
        detectedRoute,
        signals
      );

      // Add AI response to UI
      const aiMsg = createMessage('assistant', response.content);
      setMessages(prev => [...prev, aiMsg]);

      // Update AI messages for next call
      setAiMessages(prev => [...prev, { role: 'assistant', content: response.content }]);

      // Update token usage
      setTokenUsage(prev => ({
        input: prev.input + response.usage.input_tokens,
        output: prev.output + response.usage.output_tokens,
      }));

      // Try to detect route from response
      detectRouteFromResponse(response.content);

    } catch (err) {
      setError('Failed to get response. Please try again.');
      console.error('AI agent error:', err);

      // Remove the user message from AI messages on error
      setAiMessages(aiMessages);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Restart the discovery
  const handleRestart = () => {
    hasStarted.current = false;
    setMessages([]);
    setAiMessages([]);
    setInputValue('');
    setDetectedRoute(null);
    setSignals({ A: 0, B: 0, C: 0, D: 0 });
    setError(null);
    setTokenUsage({ input: 0, output: 0 });

    // Restart after a brief delay
    setTimeout(() => {
      startDiscovery();
    }, 100);
  };

  // Get dominant signal for display
  const getDominantRoute = (): string => {
    const max = Math.max(signals.A, signals.B, signals.C, signals.D);
    if (max < 0.2) return 'Detecting...';
    if (signals.A === max) return 'Route A';
    if (signals.B === max) return 'Route B';
    if (signals.C === max) return 'Route C';
    return 'Route D';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200/60 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center shadow-sm border border-slate-200/60 overflow-hidden flex-shrink-0">
            <Image
              src="/entrsphere_asset_icon_transparent.webp"
              alt="EntrSphere"
              width={28}
              height={28}
              className="w-5 h-5 sm:w-7 sm:h-7"
            />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
              <span className="truncate">Discovery Agent</span>
              <span className="bg-blue-50 text-blue-600 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border border-blue-100 flex-shrink-0">
                BETA
              </span>
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium truncate">
              {detectedRoute ? `${getDominantRoute()} detected` : "Free-form conversation"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Generate SPEC Button - only show when route detected */}
          {detectedRoute && messages.length >= 2 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsSpecModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs rounded-xl shadow-lg shadow-slate-900/10 px-2 sm:px-3"
            >
              <FileCode weight="bold" className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Generate SPEC</span>
            </Button>
          )}
          {onSwitchMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwitchMode}
              className="text-slate-500 hover:text-slate-800 hover:bg-white/50 text-xs rounded-xl px-2 sm:px-3"
            >
              <Sparkle weight="bold" className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Guided</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRestart}
            className="text-slate-500 hover:text-slate-800 hover:bg-white/50 rounded-xl px-2 sm:px-3"
          >
            <ArrowsClockwise weight="bold" className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Restart</span>
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 bg-slate-50/50" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-6 px-4 md:px-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="flex justify-start w-full">
              <div className="max-w-[85%]">
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-sm text-red-600 shadow-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <div className="flex-1">{error}</div>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs font-semibold text-red-700 hover:underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="px-4 md:px-6 py-4 bg-white border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your project or answer the agent's questions..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-xl focus:border-blue-400 focus:ring-blue-100 shadow-sm h-12 text-[15px]"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-12 h-12 p-0 shadow-md shadow-blue-500/20 transition-all hover:shadow-lg"
            >
              <PaperPlaneTilt weight="fill" className="h-5 w-5" />
            </Button>
          </div>

          {/* Signal indicators */}
          <div className="flex items-center justify-between mt-3 text-xs text-slate-400 font-medium px-1">
            <div className="flex items-center gap-3 md:gap-4">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${signals.A > 0.2 ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" : "bg-slate-300"}`} />
                <span className="hidden sm:inline">Route</span> A: {(signals.A * 100).toFixed(0)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${signals.B > 0.2 ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" : "bg-slate-300"}`} />
                <span className="hidden sm:inline">Route</span> B: {(signals.B * 100).toFixed(0)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${signals.C > 0.2 ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" : "bg-slate-300"}`} />
                <span className="hidden sm:inline">Route</span> C: {(signals.C * 100).toFixed(0)}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full transition-all duration-300 ${signals.D > 0.2 ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.4)]" : "bg-slate-300"}`} />
                <span className="hidden sm:inline">Route</span> D: {(signals.D * 100).toFixed(0)}%
              </span>
            </div>
            <span className="text-slate-400">
              {tokenUsage.input + tokenUsage.output > 0 && (
                `${((tokenUsage.input + tokenUsage.output) / 1000).toFixed(1)}k tokens`
              )}
            </span>
          </div>
        </div>
      </div>

      {/* SPEC Preview Modal */}
      <SpecPreviewModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
        sessionId={sessionId}
        route={detectedRoute}
        signals={signals}
        messages={aiMessages}
      />
    </div>
  );
};

export default DiscoveryChatAI;

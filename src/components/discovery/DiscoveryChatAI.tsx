// AI-Powered Discovery Chat Component
// Uses the filesystem agent for dynamic, free-form conversations

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage as ChatMessageType, DiscoveryRoute } from '@/types/discovery';
import { sendFilesystemAgentMessage } from '@/services/discoveryService';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, Sparkles, Send, Zap } from 'lucide-react';
import posthog from 'posthog-js';

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
    <div className="flex flex-col h-full bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 text-sm flex items-center gap-1">
              AI Discovery Agent
              <span className="bg-violet-100 text-violet-700 text-[10px] font-medium px-1.5 py-0.5 rounded">
                BETA
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              {detectedRoute ? `${getDominantRoute()} detected` : 'Free-form conversation'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onSwitchMode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSwitchMode}
              className="text-slate-500 hover:text-slate-700 text-xs"
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Guided
            </Button>
          )}
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
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-1">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="ml-0 md:ml-8 max-w-[85%] md:max-w-[70%]">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="px-4 py-3 bg-white border-t border-slate-200">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your project or answer the agent's questions..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-slate-900 hover:bg-slate-800"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Signal indicators */}
        <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${signals.A > 0.3 ? 'bg-green-500' : 'bg-slate-200'}`} />
              A: {(signals.A * 100).toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${signals.B > 0.3 ? 'bg-blue-500' : 'bg-slate-200'}`} />
              B: {(signals.B * 100).toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${signals.C > 0.3 ? 'bg-amber-500' : 'bg-slate-200'}`} />
              C: {(signals.C * 100).toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${signals.D > 0.3 ? 'bg-purple-500' : 'bg-slate-200'}`} />
              D: {(signals.D * 100).toFixed(0)}%
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
  );
};

export default DiscoveryChatAI;

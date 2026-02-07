"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatMessage as ChatMessageType, DiscoveryRoute, ROUTES } from "@/types/discovery";
import { sendFilesystemAgentMessage } from "@/services/discovery";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import DiscoveryCanvas from "./DiscoveryCanvas";
import { PaymentGate, SessionHeader, ChatInput, SpecPreviewCard } from "./toolkit";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowDown, Sparkle } from "@phosphor-icons/react";
import posthog from "posthog-js";
import { cn } from "@/lib/utils";

// Generate unique IDs
const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const generateSessionId = () => `toolkit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

export default function ToolkitSessionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL params
  const referenceParam = searchParams.get("ref") || searchParams.get("reference");
  const routeParam = searchParams.get("route") as DiscoveryRoute;
  const freeSessionId = searchParams.get("sessionId");

  // Payment state
  const [isPaid, setIsPaid] = useState(false);
  const [email, setEmail] = useState("");
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);

  // Session state
  const [sessionId] = useState(generateSessionId);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedRoute, setDetectedRoute] = useState<DiscoveryRoute>(routeParam || null);
  const [signals, setSignals] = useState({ A: 0, B: 0, C: 0, D: 0 });
  const [error, setError] = useState<string | null>(null);
  const [tokenUsage, setTokenUsage] = useState({ input: 0, output: 0 });
  const [generatedSpec, setGeneratedSpec] = useState<object | null>(null);
  const [isGeneratingSpec, setIsGeneratingSpec] = useState(false);
  const [isAskAnythingMode, setIsAskAnythingMode] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasStarted = useRef(false);

  // Check payment status
  useEffect(() => {
    if (referenceParam?.startsWith("toolkit_")) {
      setIsPaid(true);
      setIsCheckingPayment(false);
      const savedEmail = localStorage.getItem("discovery_email");
      if (savedEmail) setEmail(savedEmail);
      return;
    }

    const toolkitPurchased = localStorage.getItem("toolkit_purchased");
    const toolkitReference = localStorage.getItem("toolkit_reference");
    if (toolkitPurchased === "true" && toolkitReference) {
      setIsPaid(true);
      const savedEmail = localStorage.getItem("discovery_email");
      if (savedEmail) setEmail(savedEmail);
    }

    setIsCheckingPayment(false);
  }, [referenceParam]);

  // Scroll utilities
  const getScrollViewport = useCallback(() => {
    return scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
  }, []);

  const scrollToBottom = useCallback(() => {
    const viewport = getScrollViewport();
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [getScrollViewport]);

  // Auto-scroll on new messages
  useEffect(() => {
    const timer = setTimeout(() => scrollToBottom(), 50);
    return () => clearTimeout(timer);
  }, [messages, isLoading, scrollToBottom]);

  // Handle scroll visibility
  const handleScroll = useCallback(() => {
    const viewport = getScrollViewport();
    if (!viewport) return;
    const { scrollTop, scrollHeight, clientHeight } = viewport;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight >= 100);
  }, [getScrollViewport]);

  useEffect(() => {
    const viewport = getScrollViewport();
    if (viewport) {
      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, getScrollViewport, isPaid]);

  // Focus shortcut (/)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Create message helper
  const createMessage = (role: "user" | "assistant", content: string): ChatMessageType => ({
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  });

  // Start deep-dive session
  const startDeepDiveSession = useCallback(async () => {
    if (hasStarted.current || !isPaid) return;
    hasStarted.current = true;

    posthog.capture("toolkit_session_started", { sessionId, route: detectedRoute });
    setIsLoading(true);

    try {
      const routeContext = detectedRoute
        ? `The user has been routed to ${ROUTES[detectedRoute].name} (Route ${detectedRoute}). ${ROUTES[detectedRoute].description}`
        : "No specific route has been detected yet. Start with diagnostic questions.";

      const initialMessage = `I'm starting a full Discovery Router Toolkit session. ${routeContext}

Please begin the deep-dive discovery process. Load the appropriate playbook and guide me through a thorough requirements gathering session. I want to end up with a production-ready SPEC.json.`;

      const response = await sendFilesystemAgentMessage({
        messages: [{ role: "user", content: initialMessage }],
        sessionId,
        route: detectedRoute,
        signals,
      });

      setMessages([createMessage("assistant", response.content)]);
      setAiMessages([
        { role: "user", content: initialMessage },
        { role: "assistant", content: response.content },
      ]);
      setTokenUsage({
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      });
    } catch {
      setError("Failed to start session. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isPaid, sessionId, detectedRoute, signals]);

  useEffect(() => {
    if (isPaid && !hasStarted.current) {
      startDeepDiveSession();
    }
  }, [isPaid, startDeepDiveSession]);

  // Detect route from response
  const detectRouteFromResponse = (content: string): void => {
    const lower = content.toLowerCase();
    const routeSignals: Array<{ key: DiscoveryRoute; patterns: string[] }> = [
      { key: "A", patterns: ["route a", "standard discovery"] },
      { key: "B", patterns: ["route b", "exploratory"] },
      { key: "C", patterns: ["route c", "stakeholder"] },
      { key: "D", patterns: ["route d", "integration"] },
    ];

    for (const { key, patterns } of routeSignals) {
      if (patterns.some(p => lower.includes(p))) {
        if (!detectedRoute) setDetectedRoute(key);
        setSignals(prev => ({ ...prev, [key]: Math.min(prev[key] + 0.2, 1) }));
        break;
      }
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userContent = inputValue.trim();
    setInputValue("");
    setError(null);

    setMessages(prev => [...prev, createMessage("user", userContent)]);
    const newAiMessages: AIMessage[] = [...aiMessages, { role: "user", content: userContent }];
    setAiMessages(newAiMessages);

    posthog.capture("toolkit_message_sent", { sessionId, messageLength: userContent.length, route: detectedRoute });
    setIsLoading(true);

    try {
      const flowStage = isAskAnythingMode ? "ask_anything" as const
        : generatedSpec ? "post_spec" as const
        : "discovery" as const;

      const response = await sendFilesystemAgentMessage({
        messages: newAiMessages,
        sessionId,
        route: detectedRoute,
        signals,
        flowStage,
      });

      setMessages(prev => [...prev, createMessage("assistant", response.content)]);
      setAiMessages(prev => [...prev, { role: "assistant", content: response.content }]);
      setTokenUsage(prev => ({
        input: prev.input + response.usage.input_tokens,
        output: prev.output + response.usage.output_tokens,
      }));
      detectRouteFromResponse(response.content);
    } catch {
      setError("Failed to get response. Please try again.");
      setAiMessages(aiMessages);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Generate SPEC
  const handleGenerateSpec = async () => {
    setIsGeneratingSpec(true);
    posthog.capture("toolkit_spec_generation_started", { sessionId, route: detectedRoute });

    try {
      const response = await fetch("/api/discovery/generate-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: aiMessages, route: detectedRoute, signals, sessionId }),
      });

      if (!response.ok) throw new Error("Failed to generate SPEC");
      setGeneratedSpec(await response.json());
      posthog.capture("toolkit_spec_generated", { sessionId, route: detectedRoute });
    } catch {
      setError("Failed to generate SPEC. Please try again.");
    } finally {
      setIsGeneratingSpec(false);
    }
  };

  // Download SPEC
  const handleDownloadSpec = () => {
    if (!generatedSpec) return;
    const blob = new Blob([JSON.stringify(generatedSpec, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SPEC-${sessionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    posthog.capture("toolkit_spec_downloaded", { sessionId, route: detectedRoute });
  };

  // Handlers
  const handlePaymentSuccess = (reference: string) => {
    posthog.capture("toolkit_purchase_success", { reference, route: detectedRoute });
    setIsPaid(true);
    router.push(`/solutions/discovery-router/session?reference=${reference}&route=${detectedRoute || ""}`);
  };

  const handleRestart = () => {
    if (confirm("Are you sure you want to restart? Current progress will be lost.")) {
      window.location.reload();
    }
  };

  const handleAskAnything = () => {
    setIsAskAnythingMode(true);
    posthog.capture("toolkit_ask_anything_started", { sessionId, route: detectedRoute });
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Loading state
  if (isCheckingPayment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Checking access...</p>
        </div>
      </div>
    );
  }

  // Payment gate
  if (!isPaid) {
    return (
      <PaymentGate
        email={email}
        onEmailChange={setEmail}
        sessionId={freeSessionId || sessionId}
        routeParam={routeParam}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  // Full session UI
  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] flex flex-col font-sans selection:bg-violet-100 selection:text-violet-900">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-200/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/30 blur-[100px]" />
      </div>

      <SessionHeader
        detectedRoute={detectedRoute}
        generatedSpec={generatedSpec}
        isGeneratingSpec={isGeneratingSpec}
        messagesCount={messages.length}
        onRestart={handleRestart}
        onGenerateSpec={handleGenerateSpec}
        onDownloadSpec={handleDownloadSpec}
      />

      {/* Split View Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 bg-white/40">
          {/* Left: Chat Interface */}
          <div className="md:col-span-3 flex flex-col h-full relative">
            <ScrollArea className="flex-1 relative z-10" ref={scrollRef}>
              <div className="max-w-3xl mx-auto py-8 px-4 md:px-6 min-h-[calc(100vh-180px)]">
                {messages.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-0 animate-in fade-in duration-700">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-violet-500/10 flex items-center justify-center mb-6">
                      <Sparkle weight="fill" className="h-8 w-8 text-violet-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Initialize Session</h3>
                    <p className="text-slate-500 max-w-sm">Connecting to the Discovery Router AI agent...</p>
                  </div>
                )}

                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isLoading && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <TypingIndicator />
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 mb-4 flex items-center justify-between shadow-sm animate-in shake">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      {error}
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="px-3 py-1 bg-white border border-red-100 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {generatedSpec && messages.length > 0 && (
                  <SpecPreviewCard
                    spec={generatedSpec}
                    isAskAnythingMode={isAskAnythingMode}
                    onDownload={handleDownloadSpec}
                    onAskAnything={handleAskAnything}
                  />
                )}

                {isAskAnythingMode && generatedSpec && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 animate-in fade-in duration-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Ask anything about your SPEC or implementation plan
                  </div>
                )}

                {/* Scroll to bottom button */}
                <div className={cn(
                  "fixed bottom-24 right-auto z-40 transition-all duration-300 transform md:ml-[45%]",
                  showScrollButton ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
                )}>
                  <Button
                    onClick={scrollToBottom}
                    size="icon"
                    aria-label="Scroll to bottom"
                    className="bg-white/80 backdrop-blur border border-slate-200 shadow-lg text-slate-600 hover:bg-violet-50 hover:text-violet-600 rounded-full h-10 w-10"
                  >
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </ScrollArea>

            <ChatInput
              ref={inputRef}
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSendMessage}
              isLoading={isLoading}
              isAskAnythingMode={isAskAnythingMode}
              tokenUsage={tokenUsage}
            />
          </div>

          {/* Right: Discovery Canvas */}
          <div className="hidden md:block col-span-2 h-full border-l border-slate-200">
            <DiscoveryCanvas
              messages={messages}
              route={detectedRoute}
              generatedSpec={generatedSpec}
              isGeneratingSpec={isGeneratingSpec}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

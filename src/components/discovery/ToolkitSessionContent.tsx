"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChatMessage as ChatMessageType, DiscoveryRoute, ROUTES } from "@/types/discovery";
import { sendFilesystemAgentMessage } from "@/services/discoveryService";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import DiscoveryCanvas from "./DiscoveryCanvas";
import PayFastButton from "@/components/payments/PayFastButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowsClockwise,
  PaperPlaneTilt,
  FileCode,
  Download,
  ArrowLeft,
  CheckCircle,
  LockKey,
  Sparkle,
  ChatCircleDots,
  ArrowDown,
} from "@phosphor-icons/react";
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

  // URL params - support both "ref" and "reference"
  const referenceParam = searchParams.get("ref") || searchParams.get("reference");
  const routeParam = searchParams.get("route") as DiscoveryRoute;
  const paymentSuccess = searchParams.get("payment") === "success";
  const freeSessionId = searchParams.get("sessionId");

  // Payment gate state
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

  // UX State
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasStarted = useRef(false);

  // Check payment status from URL params and localStorage
  useEffect(() => {
    // Check if we have a valid reference in URL (from successful payment redirect)
    if (referenceParam && referenceParam.startsWith("toolkit_")) {
      setIsPaid(true);
      setIsCheckingPayment(false);
      // Try to get email from localStorage
      const savedEmail = localStorage.getItem("discovery_email");
      if (savedEmail) setEmail(savedEmail);
      return;
    }

    // Check localStorage for previous purchase
    const toolkitPurchased = localStorage.getItem("toolkit_purchased");
    const toolkitReference = localStorage.getItem("toolkit_reference");
    if (toolkitPurchased === "true" && toolkitReference) {
      setIsPaid(true);
      const savedEmail = localStorage.getItem("discovery_email");
      if (savedEmail) setEmail(savedEmail);
    }

    setIsCheckingPayment(false);
  }, [referenceParam]);

  // Handle successful payment
  const handlePaymentSuccess = (reference: string) => {
    posthog.capture("toolkit_purchase_success", { reference, route: detectedRoute });
    setIsPaid(true);
    // Update URL with reference
    router.push(`/solutions/discovery-router/session?reference=${reference}&route=${detectedRoute || ""}`);
  };

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  // Get the actual scrollable viewport from ScrollArea
  const getScrollViewport = useCallback(() => {
    return scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement | null;
  }, []);

  // Handle manual scroll visibility
  const handleScroll = useCallback(() => {
    const viewport = getScrollViewport();
    if (!viewport) return;

    const { scrollTop, scrollHeight, clientHeight } = viewport;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  }, [getScrollViewport]);

  // Attach scroll listener to the actual viewport
  useEffect(() => {
    const viewport = getScrollViewport();
    if (viewport) {
      viewport.addEventListener('scroll', handleScroll);
      return () => viewport.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, getScrollViewport, isPaid]); // Re-attach when paid view loads

  const scrollToBottom = useCallback(() => {
    const viewport = getScrollViewport();
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [getScrollViewport]);

  // Focus shortcut (/)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Only trigger if not already focused on an input/textarea
      if (e.key === "/" && document.activeElement !== inputRef.current && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Restart session
  const handleRestart = () => {
    if (confirm("Are you sure you want to restart? Current progress will be lost.")) {
      // Reloading ensures clean state and re-triggers initial message
      window.location.reload();
    }
  };

  // Create message object
  const createMessage = (role: "user" | "assistant", content: string): ChatMessageType => ({
    id: generateId(),
    role,
    content,
    timestamp: new Date(),
  });

  // Start deep-dive session with playbook context
  const startDeepDiveSession = useCallback(async () => {
    if (hasStarted.current || !isPaid) return;
    hasStarted.current = true;

    posthog.capture("toolkit_session_started", { sessionId, route: detectedRoute });

    setIsLoading(true);

    try {
      // Build initial context with route info
      const routeContext = detectedRoute
        ? `The user has been routed to ${ROUTES[detectedRoute].name} (Route ${detectedRoute}). ${ROUTES[detectedRoute].description}`
        : "No specific route has been detected yet. Start with diagnostic questions.";

      const initialMessage = `I'm starting a full Discovery Router Toolkit session. ${routeContext}

Please begin the deep-dive discovery process. Load the appropriate playbook and guide me through a thorough requirements gathering session. I want to end up with a production-ready SPEC.json.`;

      const response = await sendFilesystemAgentMessage(
        [{ role: "user", content: initialMessage }],
        sessionId,
        detectedRoute,
        signals
      );

      const welcomeMsg = createMessage("assistant", response.content);
      setMessages([welcomeMsg]);
      setAiMessages([
        { role: "user", content: initialMessage },
        { role: "assistant", content: response.content },
      ]);

      setTokenUsage({
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      });
    } catch (err) {
      setError("Failed to start session. Please try again.");
      console.error("Session start error:", err);
    } finally {
      setIsLoading(false);
      // Wait for DOM update then focus
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isPaid, sessionId, detectedRoute, signals]);

  // Start session when paid
  useEffect(() => {
    if (isPaid && !hasStarted.current) {
      startDeepDiveSession();
    }
  }, [isPaid, startDeepDiveSession]);

  // Detect route from response
  const detectRouteFromResponse = (content: string): void => {
    const lowerContent = content.toLowerCase();

    if (lowerContent.includes("route a") || lowerContent.includes("standard discovery")) {
      if (!detectedRoute) setDetectedRoute("A");
      setSignals((prev) => ({ ...prev, A: Math.min(prev.A + 0.2, 1) }));
    } else if (lowerContent.includes("route b") || lowerContent.includes("exploratory")) {
      if (!detectedRoute) setDetectedRoute("B");
      setSignals((prev) => ({ ...prev, B: Math.min(prev.B + 0.2, 1) }));
    } else if (lowerContent.includes("route c") || lowerContent.includes("stakeholder")) {
      if (!detectedRoute) setDetectedRoute("C");
      setSignals((prev) => ({ ...prev, C: Math.min(prev.C + 0.2, 1) }));
    } else if (lowerContent.includes("route d") || lowerContent.includes("integration")) {
      if (!detectedRoute) setDetectedRoute("D");
      setSignals((prev) => ({ ...prev, D: Math.min(prev.D + 0.2, 1) }));
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userContent = inputValue.trim();
    setInputValue("");
    setError(null);

    const userMsg = createMessage("user", userContent);
    setMessages((prev) => [...prev, userMsg]);

    const newAiMessages: AIMessage[] = [...aiMessages, { role: "user", content: userContent }];
    setAiMessages(newAiMessages);

    posthog.capture("toolkit_message_sent", {
      sessionId,
      messageLength: userContent.length,
      route: detectedRoute,
    });

    setIsLoading(true);

    try {
      // Determine flow stage based on current state
      const flowStage = isAskAnythingMode ? "ask_anything" as const
        : generatedSpec ? "post_spec" as const
          : "discovery" as const;

      const response = await sendFilesystemAgentMessage(
        newAiMessages,
        sessionId,
        detectedRoute,
        signals,
        flowStage
      );

      const aiMsg = createMessage("assistant", response.content);
      setMessages((prev) => [...prev, aiMsg]);
      setAiMessages((prev) => [...prev, { role: "assistant", content: response.content }]);

      setTokenUsage((prev) => ({
        input: prev.input + response.usage.input_tokens,
        output: prev.output + response.usage.output_tokens,
      }));

      detectRouteFromResponse(response.content);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Message error:", err);
      setAiMessages(aiMessages);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Handle enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Generate SPEC.json
  const handleGenerateSpec = async () => {
    setIsGeneratingSpec(true);
    posthog.capture("toolkit_spec_generation_started", { sessionId, route: detectedRoute });

    try {
      const response = await fetch("/api/discovery/generate-spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: aiMessages,
          route: detectedRoute,
          signals,
          sessionId,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate SPEC");

      const spec = await response.json();
      setGeneratedSpec(spec);

      posthog.capture("toolkit_spec_generated", { sessionId, route: detectedRoute });
    } catch (err) {
      setError("Failed to generate SPEC. Please try again.");
      console.error("SPEC generation error:", err);
    } finally {
      setIsGeneratingSpec(false);
    }
  };

  // Download SPEC.json
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/solutions/discovery-router" aria-label="Back to Solutions" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </Link>
          </div>
        </header>

        <main className="pt-24 pb-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <LockKey weight="duotone" className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Unlock Full Discovery Session
              </h1>
              <p className="text-slate-600">
                Get access to the complete Discovery Router Toolkit with AI-powered deep-dive sessions and SPEC.json generation.
              </p>
            </div>

            {routeParam && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Sparkle weight="fill" className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Route {routeParam} Detected
                    </p>
                    <p className="text-xs text-blue-700">
                      {ROUTES[routeParam]?.title}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 mb-6">
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <CheckCircle weight="fill" className="h-5 w-5 text-green-500" />
                  <span className="text-slate-700">Full AI-powered discovery session</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle weight="fill" className="h-5 w-5 text-green-500" />
                  <span className="text-slate-700">Route-specific playbook guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle weight="fill" className="h-5 w-5 text-green-500" />
                  <span className="text-slate-700">Production-ready SPEC.json output</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle weight="fill" className="h-5 w-5 text-green-500" />
                  <span className="text-slate-700">Risk assessment & red flag detection</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-3xl font-bold text-slate-900">R850</span>
                  <span className="text-slate-500 text-sm">~$47 USD</span>
                </div>

                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-4"
                  aria-label="Email Address"
                />

                <PayFastButton
                  email={email}
                  sessionId={freeSessionId || sessionId}
                  onSuccess={handlePaymentSuccess}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium"
                >
                  Get Instant Access
                </PayFastButton>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Secure payment via Payfast. One-time purchase.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
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

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-4 md:px-6 py-4 shadow-sm shadow-slate-200/50">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/solutions/discovery-router"
              aria-label="Back to Analysis"
              className="group flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 hover:bg-slate-200/80 transition-colors text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-violet-500/20 blur-md rounded-full" />
                <Image
                  src="/entrsphere_asset_icon_transparent.webp"
                  alt="EntrSphere"
                  width={34}
                  height={34}
                  className="relative z-10"
                />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 tracking-tight leading-tight">Discovery Router Toolkit</h1>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {detectedRoute ? `${ROUTES[detectedRoute].name}` : "Live Session"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleRestart}
              variant="ghost"
              size="sm"
              aria-label="Restart Session"
              className="text-slate-500 hover:text-red-600 hover:bg-red-50 hidden md:flex"
            >
              <ArrowsClockwise className="h-4 w-4 mr-2" />
              Restart
            </Button>

            {generatedSpec ? (
              <Button
                onClick={handleDownloadSpec}
                aria-label="Download SPEC.json"
                className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Download SPEC
              </Button>
            ) : (
              <Button
                onClick={handleGenerateSpec}
                disabled={isGeneratingSpec || messages.length < 4}
                aria-label="Generate SPEC.json"
                className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FileCode className="h-4 w-4 mr-2" />
                {isGeneratingSpec ? "Generating..." : "Generate SPEC"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Split View Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 bg-white/40">

          {/* Left: Chat Interface (3 cols) */}
          <div className="md:col-span-3 flex flex-col h-full relative">
            <ScrollArea className="flex-1 relative z-10" ref={scrollRef}>
              <div className="max-w-3xl mx-auto py-8 px-4 md:px-6 min-h-[calc(100vh-180px)]">
                {messages.length === 0 && !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20 opacity-0 animate-in fade-in duration-700">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-violet-500/10 flex items-center justify-center mb-6">
                      <Sparkle weight="fill" className="h-8 w-8 text-violet-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Initialize Session</h3>
                    <p className="text-slate-500 max-w-sm">
                      Connecting to the Discovery Router AI agent...
                    </p>
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

                {generatedSpec && messages.length > 0 && ( /* Only show spec card inline if canvas is hidden/mobile, but for now we keep it? No let's keep it in chat stream too */
                  <div className="relative group mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-2xl shadow-slate-900/10 animate-in slide-in-from-bottom-4 duration-700">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/50">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs font-mono font-medium text-slate-400">SPEC.json</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest">
                          Generated
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-0 relative font-mono text-xs">
                      <div className="absolute top-0 right-0 p-4 pointer-events-none bg-gradient-to-l from-slate-900 via-transparent to-transparent h-full w-20 z-10" />
                      <ScrollArea className="h-64 w-full">
                        <div className="p-4">
                          <pre className="text-emerald-300/90 leading-relaxed">
                            {JSON.stringify(generatedSpec, null, 2)}
                          </pre>
                        </div>
                      </ScrollArea>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-3 p-3 bg-slate-900 border-t border-slate-800">
                      <Button
                        onClick={handleDownloadSpec}
                        size="sm"
                        aria-label="Download SPEC as JSON"
                        className="bg-green-600 hover:bg-green-500 text-white border-0"
                      >
                        <Download className="h-3.5 w-3.5 mr-2" />
                        Download
                      </Button>
                      {!isAskAnythingMode && (
                        <Button
                          onClick={() => {
                            setIsAskAnythingMode(true);
                            posthog.capture("toolkit_ask_anything_started", { sessionId, route: detectedRoute });
                            setTimeout(() => inputRef.current?.focus(), 100);
                          }}
                          variant="ghost"
                          size="sm"
                          aria-label="Ask questions"
                          className="text-slate-400 hover:text-white hover:bg-slate-800"
                        >
                          <ChatCircleDots className="h-3.5 w-3.5 mr-2" />
                          Ask Questions
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                {isAskAnythingMode && generatedSpec && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500 animate-in fade-in duration-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    Ask anything about your SPEC or implementation plan
                  </div>
                )}

                {/* Scroll to bottom button */}
                <div className={cn(
                  "fixed bottom-24 right-auto z-40 transition-all duration-300 transform md:ml-[45%]", // Adjust position for split view
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

            {/* Input Area */}
            <div className="relative z-50">
              {/* Gradient fade above input */}
              <div className="absolute bottom-full left-0 right-0 h-12 bg-gradient-to-t from-[#F8FAFC] to-transparent pointer-events-none" />

              <div className="bg-white/90 backdrop-blur-xl border-t border-slate-200/60 px-4 md:px-6 py-5 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.05)]">
                <div className="max-w-3xl mx-auto">
                  <div className="relative flex items-end gap-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:shadow-md focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all duration-300 p-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={isAskAnythingMode ? "What would you like to know about your project?" : "Describe your requirements here... (Press '/' to focus)"}
                      disabled={isLoading}
                      className="flex-1 h-auto min-h-[44px] py-3 px-3 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-[15px] resize-none"
                      aria-label="Chat Input"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isLoading}
                      aria-label="Send Message"
                      className={cn(
                        "relative h-10 w-10 p-0 rounded-xl transition-all duration-300",
                        inputValue.trim()
                          ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/25 rotate-0 scale-100"
                          : "bg-slate-100 text-slate-300 cursor-not-allowed rotate-6 scale-90"
                      )}
                    >
                      <PaperPlaneTilt weight="fill" className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mt-3 px-1">
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className={cn("w-2 h-2 rounded-full", isLoading ? "bg-violet-500 animate-pulse" : "bg-green-500")} />
                        {isLoading ? "Thinking..." : "Ready"}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
                      {tokenUsage.input + tokenUsage.output > 0 &&
                        `${((tokenUsage.input + tokenUsage.output) / 1000).toFixed(1)}k tokens used`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Discovery Canvas (2 cols) - Hidden on mobile for now */}
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

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChatMessage as ChatMessageType, DiscoveryRoute, ROUTES } from "@/types/discovery";
import { sendFilesystemAgentMessage } from "@/services/discoveryService";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import PaystackButton from "@/components/payments/PaystackButton";
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
} from "@phosphor-icons/react";
import posthog from "posthog-js";

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

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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
      inputRef.current?.focus();
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
      const response = await sendFilesystemAgentMessage(
        newAiMessages,
        sessionId,
        detectedRoute,
        signals
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
            <Link href="/solutions/discovery-router" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
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
                />

                <PaystackButton
                  email={email}
                  sessionId={freeSessionId || sessionId}
                  route={routeParam || undefined}
                  onSuccess={handlePaymentSuccess}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium"
                >
                  Get Instant Access
                </PaystackButton>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Secure payment via Paystack. One-time purchase.
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/solutions/discovery-router" className="text-slate-500 hover:text-slate-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <Image
                src="/entrsphere_asset_icon_transparent.webp"
                alt="EntrSphere"
                width={32}
                height={32}
              />
              <div>
                <h1 className="font-semibold text-slate-900">Discovery Router Toolkit</h1>
                <p className="text-xs text-slate-500">
                  {detectedRoute ? `${ROUTES[detectedRoute].name} Session` : "Deep-Dive Session"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {generatedSpec ? (
              <Button
                onClick={handleDownloadSpec}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download SPEC
              </Button>
            ) : (
              <Button
                onClick={handleGenerateSpec}
                disabled={isGeneratingSpec || messages.length < 4}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                <FileCode className="h-4 w-4 mr-2" />
                {isGeneratingSpec ? "Generating..." : "Generate SPEC"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="max-w-3xl mx-auto py-6 px-4 md:px-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && <TypingIndicator />}

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 mb-4">
              {error}
              <button onClick={() => setError(null)} className="ml-2 underline text-sm">
                Dismiss
              </button>
            </div>
          )}

          {generatedSpec && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle weight="fill" className="h-6 w-6 text-green-600" />
                <h3 className="font-semibold text-green-900">SPEC.json Generated!</h3>
              </div>
              <pre className="bg-white border border-green-100 rounded-lg p-4 text-xs overflow-auto max-h-64 text-slate-700">
                {JSON.stringify(generatedSpec, null, 2)}
              </pre>
              <Button
                onClick={handleDownloadSpec}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download SPEC.json
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 px-4 md:px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your requirements..."
              disabled={isLoading}
              className="flex-1 h-12"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-slate-900 hover:bg-slate-800 h-12 w-12 p-0"
            >
              <PaperPlaneTilt weight="fill" className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              {detectedRoute && (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Route {detectedRoute}: {ROUTES[detectedRoute].name}
                </span>
              )}
            </div>
            <span>
              {tokenUsage.input + tokenUsage.output > 0 &&
                `${((tokenUsage.input + tokenUsage.output) / 1000).toFixed(1)}k tokens`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lightning, Sparkle } from "@phosphor-icons/react";
import PaystackButton from "@/components/payments/PaystackButton";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type DiscoveryRoute = "A" | "B" | "C" | "D";

const routeLabels: Record<DiscoveryRoute, string> = {
  A: "Standard Discovery - Clear requirements",
  B: "Exploratory - Need to visualize first",
  C: "Stakeholder Alignment - Multiple decision-makers",
  D: "Integration - Existing systems involved",
};

export default function DiscoveryRouterCTA() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<DiscoveryRoute | "">("");
  const [isValidEmail, setIsValidEmail] = useState(false);

  // Check for route from URL params (from free discovery)
  useEffect(() => {
    const routeParam = searchParams.get("route");
    if (routeParam && ["A", "B", "C", "D"].includes(routeParam)) {
      setSelectedRoute(routeParam as DiscoveryRoute);
    }

    // Pre-fill email from localStorage if available
    const savedEmail = localStorage.getItem("discovery_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsValidEmail(validateEmail(savedEmail));
    }
  }, [searchParams]);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValidEmail(validateEmail(value));
  };

  const handlePaymentSuccess = (reference: string) => {
    // Save email for session
    localStorage.setItem("discovery_email", email);
    localStorage.setItem("toolkit_purchased", "true");
    localStorage.setItem("toolkit_reference", reference);

    // Redirect to session with route context
    const sessionUrl = selectedRoute
      ? `/solutions/discovery-router/session?route=${selectedRoute}&ref=${reference}`
      : `/solutions/discovery-router/session?ref=${reference}`;
    router.push(sessionUrl);
  };

  const sessionId = typeof window !== "undefined"
    ? localStorage.getItem("discovery_sessionId") || undefined
    : undefined;

  return (
    <div className="space-y-8">
      {/* Email Input */}
      <div className="max-w-md mx-auto">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
          Your email address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={handleEmailChange}
          className="w-full text-center text-lg py-3"
        />
      </div>

      {/* Optional Route Selection */}
      {!searchParams.get("route") && (
        <div className="max-w-md mx-auto">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Know your discovery scenario? (Optional)
          </label>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value as DiscoveryRoute | "")}
            className="w-full p-3 border border-slate-200 rounded-lg text-slate-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select scenario...</option>
            {(Object.keys(routeLabels) as DiscoveryRoute[]).map((route) => (
              <option key={route} value={route}>
                Route {route}: {routeLabels[route]}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Show selected route if from URL */}
      {searchParams.get("route") && selectedRoute && (
        <div className="max-w-md mx-auto bg-blue-50 border border-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Sparkle weight="fill" className="h-5 w-5" />
            <span className="font-medium">Route {selectedRoute} detected</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            {routeLabels[selectedRoute]}
          </p>
        </div>
      )}

      {/* Payment Button */}
      <div className="text-center">
        <PaystackButton
          email={email}
          sessionId={sessionId}
          route={selectedRoute || undefined}
          onSuccess={handlePaymentSuccess}
          disabled={!isValidEmail}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Lightning weight="fill" className="h-5 w-5" />
          Get Instant Access - R850
        </PaystackButton>
        <p className="text-slate-500 text-sm mt-4">
          Start your deep-dive session immediately after payment
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 max-w-md mx-auto">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-sm text-slate-500">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Free Discovery Link */}
      <div className="text-center">
        <Link
          href="/discovery"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          Try free route detection first
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="text-slate-400 text-sm mt-2">
          5 quick questions to identify your discovery route
        </p>
      </div>
    </div>
  );
}

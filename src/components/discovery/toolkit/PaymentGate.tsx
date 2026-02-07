"use client";

import Link from "next/link";
import { DiscoveryRoute, ROUTES } from "@/types/discovery";
import PayFastButton from "@/components/payments/PayFastButton";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle,
  LockKey,
  Sparkle,
} from "@phosphor-icons/react";

interface PaymentGateProps {
  email: string;
  onEmailChange: (email: string) => void;
  sessionId: string;
  routeParam: DiscoveryRoute;
  onPaymentSuccess: (reference: string) => void;
}

const FEATURES = [
  "Full AI-powered discovery session",
  "Route-specific playbook guidance",
  "Production-ready SPEC.json output",
  "Risk assessment & red flag detection",
];

export default function PaymentGate({
  email,
  onEmailChange,
  sessionId,
  routeParam,
  onPaymentSuccess,
}: PaymentGateProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/solutions/discovery-router"
            aria-label="Back to Solutions"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
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
              Get access to the complete Discovery Router Toolkit with
              AI-powered deep-dive sessions and SPEC.json generation.
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
              {FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <CheckCircle weight="fill" className="h-5 w-5 text-green-500" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
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
                onChange={(e) => onEmailChange(e.target.value)}
                className="mb-4"
                aria-label="Email Address"
              />

              <PayFastButton
                customer={{ email }}
                sessionId={sessionId}
                onSuccess={onPaymentSuccess}
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

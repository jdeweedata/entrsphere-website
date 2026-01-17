"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { CheckCircle, Spinner, ArrowRight } from "@phosphor-icons/react";
import Link from "next/link";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const purchase = useQuery(
    api.payments.getPurchaseByReference,
    reference ? { reference } : "skip"
  );

  // Loading state
  if (purchase === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Spinner className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  // Purchase not found or failed
  if (!purchase || purchase.status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Payment Processing
          </h1>
          <p className="text-slate-600 mb-6">
            Your payment is being processed. This may take a few moments.
            If you were charged but don't see confirmation, please contact support.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pending state (ITN not yet received)
  if (purchase.status === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
          <Spinner className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Confirming Payment
          </h1>
          <p className="text-slate-600 mb-4">
            We're confirming your payment with PayFast. This usually takes just a few seconds.
          </p>
          <p className="text-sm text-slate-500">
            Reference: {reference}
          </p>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-10 w-10 text-emerald-600" weight="fill" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-600 mb-6">
          Thank you for your purchase. A confirmation email has been sent to{" "}
          <strong>{purchase.email}</strong>.
        </p>

        <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-medium text-slate-900 mb-2">Order Details</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Product:</dt>
              <dd className="text-slate-900">{purchase.product}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Reference:</dt>
              <dd className="text-slate-900 font-mono text-xs">{reference}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-3">
          {purchase.sessionId ? (
            <Button asChild className="w-full">
              <Link href={`/discovery/session/${purchase.sessionId}`}>
                Continue to Your Toolkit
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button asChild className="w-full">
              <Link href="/dashboard">
                Go to Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Spinner className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

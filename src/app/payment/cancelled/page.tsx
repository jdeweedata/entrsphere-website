"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "@phosphor-icons/react";
import Link from "next/link";
import { Suspense } from "react";
import { Spinner } from "@phosphor-icons/react";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-10 w-10 text-red-600" weight="fill" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-slate-600 mb-6">
          Your payment was cancelled and you have not been charged.
          If this was a mistake, you can try again.
        </p>

        {reference && (
          <p className="text-xs text-slate-500 mb-6">
            Reference: {reference}
          </p>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/solutions/discovery-router">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Link>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <Link href="/">Return Home</Link>
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            Having trouble with payment?{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCancelledPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Spinner className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentCancelledContent />
    </Suspense>
  );
}

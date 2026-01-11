"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

export function WaitlistHero() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    position?: number;
    cohort?: number;
  } | null>(null);

  const stats = useQuery(api.waitlist.getStats);
  const joinWaitlist = useMutation(api.waitlist.join);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await joinWaitlist({
        email,
        source: "waitlist-page",
      });
      setResult(response);
      if (response.success) {
        setEmail("");
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[60vh] flex items-center pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
            Know if your project will fail{" "}
            <span className="text-blue-600">before you build it.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 mb-4 max-w-2xl mx-auto">
            Our Discovery Framework analyzes your project against real outcomes
            to predict success, flag risks, and tell you exactly what to fix.
          </p>

          {stats && (
            <p className="text-base text-slate-500 mb-8">
              Join {stats.totalWaiting} founders waiting for Cohort{" "}
              {stats.currentCohort}. Only {stats.cohortSize} spots.
            </p>
          )}

          {result?.success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 max-w-md mx-auto">
              <CheckCircle
                className="w-12 h-12 text-green-600 mx-auto mb-3"
                weight="fill"
              />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                You&apos;re on the list!
              </h3>
              <p className="text-green-700">
                You&apos;re #{result.position} in Cohort {result.cohort}.
                We&apos;ll email you when access opens.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 h-12 px-4 text-base border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {isSubmitting ? (
                  "Joining..."
                ) : (
                  <>
                    Join the Waitlist
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          )}

          {result && !result.success && (
            <p className="text-amber-600 text-sm mt-3">{result.message}</p>
          )}

          {stats && !result?.success && (
            <p className="text-sm text-slate-500 mt-4">
              {stats.totalWaiting} founders waiting &bull;{" "}
              {stats.spotsLeftInCohort} spots left in Cohort {stats.currentCohort}
            </p>
          )}

          <p className="text-xs text-slate-400 mt-6">
            No spam. Just your cohort access date + 3 emails on why projects
            fail.
          </p>
        </div>
      </div>
    </section>
  );
}

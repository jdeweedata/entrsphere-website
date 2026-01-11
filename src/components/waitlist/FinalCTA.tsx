"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react";

export function FinalCTA() {
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
        source: "waitlist-footer",
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
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Stop guessing. Start knowing.
          </h2>
          <p className="text-slate-300 mb-8">
            Join Cohort {stats?.currentCohort || 1} and get lifetime access to
            our Project Success Benchmarks. First 100 users shape what we build
            next.
          </p>

          {result?.success ? (
            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-6 max-w-md mx-auto">
              <CheckCircle
                className="w-12 h-12 text-green-400 mx-auto mb-3"
                weight="fill"
              />
              <h3 className="text-lg font-semibold text-green-100 mb-2">
                You&apos;re on the list!
              </h3>
              <p className="text-green-200">
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
                className="flex-1 h-12 px-4 text-base bg-white/10 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400"
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
                    Join Waitlist
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </form>
          )}

          {result && !result.success && (
            <p className="text-amber-400 text-sm mt-3">{result.message}</p>
          )}

          <p className="text-xs text-slate-500 mt-6">
            No spam. Just your cohort access date + 3 emails on why projects
            fail.
          </p>
        </div>
      </div>
    </section>
  );
}

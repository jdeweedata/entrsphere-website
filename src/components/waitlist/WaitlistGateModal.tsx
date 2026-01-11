"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, X } from "@phosphor-icons/react";

interface WaitlistGateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}

export function WaitlistGateModal({
  open,
  onOpenChange,
  source = "discovery",
}: WaitlistGateModalProps) {
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
        source,
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

  const handleClose = () => {
    setResult(null);
    setEmail("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Ready to discover your project&apos;s risk score?
          </DialogTitle>
        </DialogHeader>

        <div className="text-center py-4">
          {result?.success ? (
            <div className="py-4">
              <CheckCircle
                className="w-16 h-16 text-green-600 mx-auto mb-4"
                weight="fill"
              />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                You&apos;re on the list!
              </h3>
              <p className="text-slate-600">
                You&apos;re #{result.position} in Cohort {result.cohort}.
                We&apos;ll email you when access opens.
              </p>
            </div>
          ) : (
            <>
              <p className="text-slate-600 mb-6">
                We&apos;re inviting founders in small batches to ensure quality
                insights. Want to be one of the first 25?
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-center"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isSubmitting ? (
                    "Joining..."
                  ) : (
                    <>
                      Join Cohort {stats?.currentCohort || 1}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {result && !result.success && (
                <p className="text-amber-600 text-sm mt-3">{result.message}</p>
              )}

              {stats && (
                <p className="text-sm text-slate-500 mt-4">
                  {stats.totalWaiting} founders waiting &bull;{" "}
                  {stats.spotsLeftInCohort} spots left
                </p>
              )}

              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Already have access?{" "}
                  <a href="/login" className="text-blue-600 hover:underline">
                    Sign in
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

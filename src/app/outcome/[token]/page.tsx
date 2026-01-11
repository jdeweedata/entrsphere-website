"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import {
  Rocket,
  Clock,
  XCircle,
  Pause,
  Spinner,
  CheckCircle,
  ChartBar,
  ArrowRight,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Outcome = "shipped" | "delayed" | "failed" | "paused" | "ongoing";

const ROUTE_NAMES: Record<string, string> = {
  A: "Standard Discovery",
  B: "Exploratory Discovery",
  C: "Stakeholder Alignment",
  D: "Integration Discovery",
};

const OUTCOMES = [
  {
    id: "shipped" as Outcome,
    label: "Shipped",
    description: "Project launched successfully",
    icon: Rocket,
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    id: "delayed" as Outcome,
    label: "Delayed",
    description: "Taking longer than expected",
    icon: Clock,
    color: "bg-yellow-500 hover:bg-yellow-600",
  },
  {
    id: "ongoing" as Outcome,
    label: "Still Building",
    description: "Work in progress",
    icon: Spinner,
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    id: "paused" as Outcome,
    label: "Paused",
    description: "Project on hold",
    icon: Pause,
    color: "bg-slate-500 hover:bg-slate-600",
  },
  {
    id: "failed" as Outcome,
    label: "Didn't Work Out",
    description: "Project stopped or failed",
    icon: XCircle,
    color: "bg-red-500 hover:bg-red-600",
  },
];

export default function OutcomePage() {
  const params = useParams();
  const token = params.token as string;

  const session = useQuery(api.outcomes.getSessionByOutcomeToken, { token });
  const recordOutcome = useMutation(api.outcomes.recordOutcome);

  const [selectedOutcome, setSelectedOutcome] = useState<Outcome | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [industry, setIndustry] = useState("");
  const [projectType, setProjectType] = useState("");

  // Loading state
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  // Invalid token
  if (session === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Invalid Link
          </h1>
          <p className="text-slate-600 mb-6">
            This outcome tracking link is invalid or has expired.
          </p>
          <Link href="/">
            <Button variant="outline">Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Already submitted
  if (session.outcome && !isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Already Recorded
          </h1>
          <p className="text-slate-600 mb-2">
            You reported this project as:{" "}
            <span className="font-semibold capitalize">{session.outcome}</span>
          </p>
          <p className="text-sm text-slate-500 mb-6">
            {new Date(session.outcomeReportedAt!).toLocaleDateString()}
          </p>
          {session.contributedToBenchmarks && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <ChartBar className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-blue-700">
                Your data is helping improve discovery insights for everyone.
                Thank you!
              </p>
            </div>
          )}
          <Link href="/solutions/discovery-router">
            <Button>Start Another Discovery</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Success state after submission
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Thank You!
          </h1>
          <p className="text-slate-600 mb-6">
            Your outcome has been recorded. This helps us build better insights
            for the community.
          </p>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mb-6">
            <ChartBar className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-900 mb-2">
              Unlocking Insights...
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              As more teams contribute outcomes, you'll get access to benchmarks
              like:
            </p>
            <ul className="text-sm text-slate-700 space-y-2 text-left">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Success rates for {ROUTE_NAMES[session.route]} projects
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Common pitfalls and how to avoid them</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>Timeline accuracy benchmarks</span>
              </li>
            </ul>
          </div>

          <Link href="/solutions/discovery-router">
            <Button>Start Another Discovery</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleOutcomeClick = (outcome: Outcome) => {
    setSelectedOutcome(outcome);
    setShowDetails(true);
  };

  const handleSubmit = async () => {
    if (!selectedOutcome) return;

    setIsSubmitting(true);
    try {
      await recordOutcome({
        token,
        outcome: selectedOutcome,
        industry: industry || undefined,
        projectType: projectType || undefined,
        contributeToBenchmarks: true,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to record outcome:", error);
      alert("Failed to record outcome. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSubmit = async (outcome: Outcome) => {
    setIsSubmitting(true);
    try {
      await recordOutcome({
        token,
        outcome,
        contributeToBenchmarks: true,
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to record outcome:", error);
      alert("Failed to record outcome. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const daysSinceSession = session.completedAt
    ? Math.floor((Date.now() - session.completedAt) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ChartBar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            How did your project go?
          </h1>
          <p className="text-slate-600">
            Quick check-in on your {ROUTE_NAMES[session.route]} project
            {daysSinceSession && daysSinceSession > 0 && (
              <span className="text-slate-400">
                {" "}
                ({daysSinceSession} days ago)
              </span>
            )}
          </p>
        </div>

        {/* Quick outcome buttons (Phase 1 - one click) */}
        {!showDetails && (
          <div className="space-y-3 mb-8">
            {OUTCOMES.map((outcome) => (
              <button
                key={outcome.id}
                onClick={() => handleQuickSubmit(outcome.id)}
                disabled={isSubmitting}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent bg-white shadow-sm hover:shadow-md transition-all ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${outcome.color} flex items-center justify-center flex-shrink-0`}
                >
                  <outcome.icon className="h-6 w-6 text-white" weight="bold" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-slate-900">
                    {outcome.label}
                  </div>
                  <div className="text-sm text-slate-500">
                    {outcome.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Detailed form (Phase 2 - progressive trust) */}
        {showDetails && selectedOutcome && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              {(() => {
                const outcome = OUTCOMES.find((o) => o.id === selectedOutcome);
                if (!outcome) return null;
                return (
                  <>
                    <div
                      className={`w-10 h-10 rounded-lg ${outcome.color} flex items-center justify-center`}
                    >
                      <outcome.icon
                        className="h-5 w-5 text-white"
                        weight="bold"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">
                        {outcome.label}
                      </div>
                      <button
                        onClick={() => setShowDetails(false)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Industry (optional)
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select industry...</option>
                  <option value="fintech">Fintech</option>
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="media">Media & Entertainment</option>
                  <option value="logistics">Logistics</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Project type (optional)
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type...</option>
                  <option value="mvp">MVP / New Product</option>
                  <option value="feature">New Feature</option>
                  <option value="integration">Integration</option>
                  <option value="redesign">Redesign</option>
                  <option value="migration">Migration</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleQuickSubmit(selectedOutcome)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Skip Details
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </Button>
            </div>
          </div>
        )}

        {/* Trust/privacy note */}
        <div className="text-center text-sm text-slate-500">
          <p className="mb-2">
            Your contribution helps build better discovery insights.
          </p>
          <p className="text-xs text-slate-400">
            We only share anonymized, aggregate data. Your company name and
            project details are never shared.
          </p>
        </div>
      </div>
    </div>
  );
}

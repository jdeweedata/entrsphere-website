"use client";

import { useState } from "react";
import Link from "next/link";
import DiscoveryChat from "@/components/discovery/DiscoveryChat";
import DiscoveryChatAI from "@/components/discovery/DiscoveryChatAI";
import { WaitlistGateModal } from "@/components/waitlist";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkle, Clock, Target, FileJs, Lightning } from "@phosphor-icons/react";

const stats = [
  {
    icon: Clock,
    label: "2-3 min",
    description: "to find your route",
  },
  {
    icon: Target,
    label: "4 Scenarios",
    description: "detected automatically",
  },
  {
    icon: FileJs,
    label: "SPEC.json",
    description: "ready for devs",
  },
];

export default function DiscoveryContent() {
  const [mode, setMode] = useState<"guided" | "ai">("guided");
  const [showGateModal, setShowGateModal] = useState(false);

  // Handler for when user tries to interact with gated content
  const handleGatedInteraction = () => {
    setShowGateModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900">
      {/* Ambient Background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none opacity-50 mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none opacity-50 mix-blend-multiply" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/50 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
              <ArrowLeft weight="bold" className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-wide">Back</span>
          </Link>

          <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-white/50">
            <Link href="/solutions/discovery-router">Get Full Toolkit</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 w-full min-h-screen flex items-center justify-center p-4 lg:p-8 pt-24 lg:pt-24">
        <div className="w-full max-w-[1280px] grid lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          {/* Left Panel - Info & Context */}
          <div className="lg:col-span-4 space-y-10 py-4">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <Sparkle weight="fill" className="text-violet-500" />
                <span>Discovery Agent</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                {mode === "guided" ? "Find Your\nProject Route" : "AI Discovery\nAssistant"}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                {mode === "guided"
                  ? "Answer 5 strategic questions to identify the perfect discovery approach for your unique situation."
                  : "Collaborate with our AI agent to explore your project's potential and get tailored guidance in real-time."}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-1 duration-300"
                >
                  <div className="p-2 bg-slate-900/5 rounded-xl text-slate-700">
                    <stat.icon weight="duotone" className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm leading-tight">{stat.label}</div>
                    <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 mt-1">
                      {stat.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mode Switcher */}
            <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 inline-flex shadow-sm">
              <button
                onClick={() => setMode("guided")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === "guided"
                    ? "bg-white text-slate-900 shadow-md ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                }`}
              >
                <Sparkle weight={mode === "guided" ? "fill" : "regular"} className={mode === "guided" ? "text-violet-500" : ""} />
                Guided Flow
              </button>
              <button
                onClick={() => setMode("ai")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  mode === "ai"
                    ? "bg-white text-slate-900 shadow-md ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/30"
                }`}
              >
                <Lightning weight={mode === "ai" ? "fill" : "regular"} className={mode === "ai" ? "text-blue-500" : ""} />
                AI Chat
              </button>
            </div>

            {/* Footer Note */}
            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <p>Limited access • Join waitlist to unlock</p>
            </div>
          </div>

          {/* Right Panel - Chat Interface (Gated) */}
          <div className="lg:col-span-8 h-[600px] lg:h-[750px]">
            <div
              onClick={handleGatedInteraction}
              className="h-full w-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] overflow-hidden flex flex-col relative transition-all duration-500 cursor-pointer group"
            >
              {/* Gate Overlay */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-white/80 via-white/40 to-transparent flex items-end justify-center pb-12 pointer-events-none">
                <div className="text-center">
                  <p className="text-slate-900 font-semibold text-lg mb-2">
                    Click to unlock access
                  </p>
                  <p className="text-slate-500 text-sm">
                    Join the waitlist to use Discovery Agent
                  </p>
                </div>
              </div>

              {/* Decorative Gradient Blob inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-violet-50 opacity-50 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

              <div className="flex-1 relative z-10 min-h-0 h-full opacity-60 pointer-events-none">
                {mode === "guided" ? (
                  <DiscoveryChat />
                ) : (
                  <DiscoveryChatAI onSwitchMode={() => setMode("guided")} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Waitlist Gate Modal */}
      <WaitlistGateModal
        open={showGateModal}
        onOpenChange={setShowGateModal}
        source="discovery-page"
      />
    </div>
  );
}

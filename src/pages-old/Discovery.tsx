// Discovery Agent Demo Page
// Full-screen focused experience for the discovery flow

import { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import DiscoveryChat from '@/components/discovery/DiscoveryChat';
import DiscoveryChatAI from '@/components/discovery/DiscoveryChatAI';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkle, Clock, Target, FileJs, Lightning } from '@phosphor-icons/react';

const stats = [
  {
    icon: Clock,
    label: '2-3 min',
    description: 'to find your route',
  },
  {
    icon: Target,
    label: '4 Scenarios',
    description: 'detected automatically',
  },
  {
    icon: FileJs,
    label: 'SPEC.json',
    description: 'ready for devs',
  },
];

const Discovery = () => {
  const [mode, setMode] = useState<'guided' | 'ai'>('guided');

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900">
      <SEO
        title="Discovery Agent - Find Your Project Route | EntrSphere"
        description="Stop guessing requirements. Our AI Discovery Agent detects your project scenario and routes you to the right approach in 5 minutes. Free demo."
        canonical="/discovery"
      />

      {/* Ambient Background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl pointer-events-none opacity-50 mix-blend-multiply" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-3xl pointer-events-none opacity-50 mix-blend-multiply" />

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/50 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
              <ArrowLeft weight="bold" className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold tracking-wide">Back</span>
          </Link>

          <Button asChild variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-white/50">
            <Link to="/solutions/discovery-router">Get Full Toolkit</Link>
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
                {mode === 'guided' ? 'Find Your\nProject Route' : 'AI Discovery\nAssistant'}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-md">
                {mode === 'guided'
                  ? "Answer 5 strategic questions to identify the perfect discovery approach for your unique situation."
                  : "Collaborate with our AI agent to explore your project's potential and get tailored guidance in real-time."}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm flex flex-col items-center text-center gap-2 transition-transform hover:-translate-y-1 duration-300"
                >
                  <div className="p-2 bg-slate-900/5 rounded-xl text-slate-700">
                    <stat.icon weight="duotone" className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm leading-tight">{stat.label}</div>
                    <div className="text-[10px] uppercase tracking-wide font-semibold text-slate-500 mt-1">{stat.description}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mode Switcher */}
            <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 inline-flex shadow-sm">
              <button
                onClick={() => setMode('guided')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === 'guided'
                    ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
                  }`}
              >
                <Sparkle weight={mode === 'guided' ? 'fill' : 'regular'} className={mode === 'guided' ? 'text-violet-500' : ''} />
                Guided Flow
              </button>
              <button
                onClick={() => setMode('ai')}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${mode === 'ai'
                    ? 'bg-white text-slate-900 shadow-md ring-1 ring-black/5'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/30'
                  }`}
              >
                <Lightning weight={mode === 'ai' ? 'fill' : 'regular'} className={mode === 'ai' ? 'text-blue-500' : ''} />
                AI Chat
              </button>
            </div>

            {/* Footer Note */}
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                ))}
              </div>
              <p>Trusted by 1000+ Innovators</p>
            </div>

          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-8 h-[600px] lg:h-[750px]">
            <div className="h-full w-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2rem] overflow-hidden flex flex-col relative transition-all duration-500">
              {/* Decorative Gradient Blob inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-violet-50 opacity-50 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />

              <div className="flex-1 relative z-10 p-2">
                {mode === 'guided' ? (
                  <DiscoveryChat />
                ) : (
                  <DiscoveryChatAI onSwitchMode={() => setMode('guided')} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Discovery;

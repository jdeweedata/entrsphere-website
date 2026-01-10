// Discovery Agent Demo Page
// Full-screen focused experience for the discovery flow

import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import DiscoveryChat from '@/components/discovery/DiscoveryChat';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Clock, Target, FileJson } from 'lucide-react';

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
    icon: FileJson,
    label: 'SPEC.json',
    description: 'ready for devs',
  },
];

const Discovery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <SEO
        title="Discovery Agent - Find Your Project Route | EntrSphere"
        description="Stop guessing requirements. Our AI Discovery Agent detects your project scenario and routes you to the right approach in 5 minutes. Free demo."
        canonical="/discovery"
      />

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back to EntrSphere</span>
          </Link>

          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-slate-700" />
            <span className="font-semibold text-slate-900">Discovery Agent</span>
            <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
              Free Demo
            </span>
          </div>

          <Button asChild variant="outline" size="sm">
            <Link to="/solutions/discovery-router">Get Full Toolkit</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left Panel - Info */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Find Your Project Route
              </h1>
              <p className="text-slate-600">
                Answer 5 quick questions and I'll detect the best discovery approach
                for your specific situation.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-3 bg-white rounded-xl border border-slate-200"
                >
                  <stat.icon className="h-5 w-5 mx-auto mb-1 text-slate-600" />
                  <div className="font-semibold text-slate-900 text-sm">{stat.label}</div>
                  <div className="text-xs text-slate-500">{stat.description}</div>
                </div>
              ))}
            </div>

            {/* What you'll learn */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-900 mb-3">What you'll discover:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-slate-600">
                  <span className="text-green-500 mt-0.5">1.</span>
                  Which of 4 discovery scenarios fits your project
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <span className="text-green-500 mt-0.5">2.</span>
                  Risk factors specific to your situation
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <span className="text-green-500 mt-0.5">3.</span>
                  The right approach to avoid scope creep
                </li>
                <li className="flex items-start gap-2 text-slate-600">
                  <span className="text-green-500 mt-0.5">4.</span>
                  Next steps tailored to your route
                </li>
              </ul>
            </div>

            {/* Social proof */}
            <div className="bg-slate-900 text-white rounded-xl p-4">
              <p className="text-sm text-slate-300 mb-2">Did you know?</p>
              <p className="font-medium">
                42% of software projects fail due to poor requirements gathering.
              </p>
              <p className="text-sm text-slate-400 mt-2">
                The Discovery Router was built to fix that.
              </p>
            </div>

            {/* Help text */}
            <p className="text-xs text-slate-500 text-center">
              Your answers are stored locally. We only save data if you opt in.
            </p>
          </div>

          {/* Right Panel - Chat */}
          <div className="lg:col-span-2">
            <div className="h-[calc(100vh-12rem)] min-h-[500px]">
              <DiscoveryChat />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>
              Powered by{' '}
              <Link to="/" className="text-slate-900 hover:underline">
                EntrSphere
              </Link>
            </p>
            <div className="flex items-center gap-4">
              <Link to="/solutions/discovery-router" className="hover:text-slate-900">
                Full Toolkit
              </Link>
              <Link to="/contact" className="hover:text-slate-900">
                Contact
              </Link>
              <Link to="/about" className="hover:text-slate-900">
                About
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Discovery;

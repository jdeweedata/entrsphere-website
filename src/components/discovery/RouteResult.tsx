// Route detection result display

import { ROUTES, DiscoveryRoute } from '@/types/discovery';
import { getRouteInsights } from '@/lib/discovery-engine';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  Warning,
  Lightbulb,
  Clock,
  ArrowRight,
  ChartBar,
  Lock,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface RouteResultProps {
  route: DiscoveryRoute;
  answers: Record<string, string>;
}

const routeIcons: Record<Exclude<DiscoveryRoute, null>, React.ReactNode> = {
  A: <CheckCircle weight="duotone" className="h-6 w-6 text-green-500" />,
  B: <Lightbulb weight="duotone" className="h-6 w-6 text-yellow-500" />,
  C: <Warning weight="duotone" className="h-6 w-6 text-orange-500" />,
  D: <Clock weight="duotone" className="h-6 w-6 text-blue-500" />,
};

const routeColors: Record<Exclude<DiscoveryRoute, null>, string> = {
  A: 'border-green-200 bg-green-50',
  B: 'border-yellow-200 bg-yellow-50',
  C: 'border-orange-200 bg-orange-50',
  D: 'border-blue-200 bg-blue-50',
};

const RouteResult = ({ route, answers }: RouteResultProps) => {
  if (!route) return null;

  const routeInfo = ROUTES[route];
  const insights = getRouteInsights(route, answers);

  return (
    <div className="space-y-4 mt-4">
      {/* Main Result Card */}
      <div
        className={cn(
          'rounded-2xl border-2 p-6',
          routeColors[route]
        )}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{routeIcons[route]}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Route {route}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {routeInfo.name}
            </h3>
            <p className="text-slate-700 mb-4">{routeInfo.description}</p>

            <div className="grid gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-600 min-w-[80px]">Signal:</span>
                <span className="text-slate-700 italic">{routeInfo.signal}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium text-slate-600 min-w-[80px]">Duration:</span>
                <span className="text-slate-700">{routeInfo.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Stat */}
      <div className="bg-slate-900 text-white rounded-xl p-4">
        <p className="text-sm">
          <span className="font-semibold">Did you know?</span> {routeInfo.riskStat}
        </p>
      </div>

      {/* Insights */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Lightbulb weight="duotone" className="h-4 w-4 text-yellow-500" />
          Quick Insights for Your Scenario
        </h4>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
              <span className="text-slate-400 mt-0.5">-</span>
              {insight}
            </li>
          ))}
        </ul>
      </div>

      {/* Locked Benchmarks Preview (Glassdoor model) */}
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent pointer-events-none z-10" />
        <div className="relative">
          <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <ChartBar weight="duotone" className="h-4 w-4 text-blue-500" />
            Community Benchmarks
            <Lock weight="bold" className="h-3 w-3 text-slate-400 ml-auto" />
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Success rate for Route {route}:</span>
              <span className="font-mono text-slate-400 blur-[3px] select-none">78%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Avg. timeline accuracy:</span>
              <span className="font-mono text-slate-400 blur-[3px] select-none">1.4x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Top risk factor:</span>
              <span className="font-mono text-slate-400 blur-[3px] select-none">Scope creep</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Projects tracked:</span>
              <span className="font-mono text-slate-400 blur-[3px] select-none">127</span>
            </div>
          </div>
        </div>
        <div className="relative z-20 mt-4 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-600 text-center">
            <span className="font-medium">Unlock benchmarks:</span> Share your project outcome in 30 days
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-2">
        <Button asChild className="w-full bg-slate-900 hover:bg-slate-800">
          <Link href={`/solutions/discovery-router?route=${route}`}>
            Unlock Full Discovery Session
            <ArrowRight weight="duotone" className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <p className="text-xs text-slate-500 text-center mt-2">
          R850 - AI-guided deep dive + production-ready SPEC.json
        </p>
      </div>
    </div>
  );
};

export default RouteResult;

"use client";

import dynamic from "next/dynamic";

// Dynamic import for client-side only component (uses Convex hooks)
const DiscoveryRouterCTA = dynamic(
  () => import("@/components/discovery/DiscoveryRouterCTA"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 max-w-md mx-auto">
        <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-14 bg-slate-100 rounded-lg animate-pulse" />
      </div>
    ),
  }
);

export default function DiscoveryRouterCTAWrapper() {
  return <DiscoveryRouterCTA />;
}

"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamic import for client-side only component
const ToolkitSessionContent = dynamic(
  () => import("@/components/discovery/ToolkitSessionContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-12 bg-slate-200 rounded-lg animate-pulse mb-4 w-64 mx-auto" />
          <div className="h-6 bg-slate-200 rounded-lg animate-pulse w-48 mx-auto" />
        </div>
      </div>
    ),
  }
);

export default function ToolkitSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-pulse">Loading session...</div>
        </div>
      }
    >
      <ToolkitSessionContent />
    </Suspense>
  );
}

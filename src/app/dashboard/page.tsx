import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Dynamic import with SSR disabled for authenticated/Convex-dependent component
const DashboardContent = dynamic(
  () => import("@/components/admin/DashboardContent"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 bg-slate-200 rounded-lg animate-pulse mb-8 w-48" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-4 w-24" />
                <div className="h-8 bg-slate-200 rounded animate-pulse w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "Dashboard",
  description: "EntrSphere Admin Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardContent />;
}

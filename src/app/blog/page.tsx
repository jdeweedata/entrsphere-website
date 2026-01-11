import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Dynamic import with SSR disabled for Convex-dependent component
const BlogContent = dynamic(() => import("@/components/BlogContent"), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <div className="h-12 bg-slate-200 rounded-lg animate-pulse mb-4 max-w-md mx-auto" />
        <div className="h-6 bg-slate-200 rounded-lg animate-pulse w-3/4 mx-auto" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="h-48 bg-slate-200 rounded-lg animate-pulse mb-4" />
            <div className="h-6 bg-slate-200 rounded-lg animate-pulse mb-2" />
            <div className="h-4 bg-slate-200 rounded-lg animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Blog - Insights That Protect Your Budget",
  description:
    "Practical frameworks for agencies tired of scope creep, founders protecting their investments, and product teams building AI-native products.",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />
      <main className="pt-24 pb-20">
        <BlogContent />
      </main>
      <Footer />
    </div>
  );
}

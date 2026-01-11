"use client";

import dynamic from "next/dynamic";
import { ConvexWrapper } from "./ConvexWrapper";

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

export default function BlogContentWrapper() {
  return (
    <ConvexWrapper>
      <BlogContent />
    </ConvexWrapper>
  );
}

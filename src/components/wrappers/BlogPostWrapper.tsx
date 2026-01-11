"use client";

import dynamic from "next/dynamic";
import { ConvexWrapper } from "./ConvexWrapper";

const BlogPostContent = dynamic(() => import("@/components/BlogPostContent"), {
  ssr: false,
  loading: () => (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-6 w-20 bg-slate-200 rounded-full mb-6" />
        <div className="h-12 bg-slate-200 rounded-lg mb-4" />
        <div className="h-8 bg-slate-200 rounded-lg mb-8 w-3/4" />
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-200">
          <div className="w-12 h-12 bg-slate-200 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-4/6" />
        </div>
      </div>
    </div>
  ),
});

interface BlogPostWrapperProps {
  slug: string;
}

export default function BlogPostWrapper({ slug }: BlogPostWrapperProps) {
  return (
    <ConvexWrapper>
      <BlogPostContent slug={slug} />
    </ConvexWrapper>
  );
}

import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Dynamic import with SSR disabled for Convex-dependent component
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

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `Blog Post - ${slug}`,
    description: "Read our latest blog post on EntrSphere.",
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />
      <main className="py-16">
        <BlogPostContent slug={slug} />
      </main>
      <Footer />
    </div>
  );
}

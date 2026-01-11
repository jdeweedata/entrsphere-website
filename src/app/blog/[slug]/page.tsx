import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogPostWrapper from "@/components/wrappers/BlogPostWrapper";

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
        <BlogPostWrapper slug={slug} />
      </main>
      <Footer />
    </div>
  );
}

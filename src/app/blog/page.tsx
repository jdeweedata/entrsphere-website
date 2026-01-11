import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogContentWrapper from "@/components/wrappers/BlogContentWrapper";

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
        <BlogContentWrapper />
      </main>
      <Footer />
    </div>
  );
}

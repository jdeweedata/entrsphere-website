import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Dynamic import with SSR disabled for Convex-dependent component
const ContactForm = dynamic(() => import("@/components/ContactForm"), {
  ssr: false,
  loading: () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <div className="h-12 bg-slate-200 rounded-lg animate-pulse mb-4" />
        <div className="h-6 bg-slate-200 rounded-lg animate-pulse w-3/4 mx-auto" />
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
        <div className="space-y-6">
          <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-12 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-32 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Contact EntrSphere - Let's Talk About Your Pain",
  description:
    "Whether you're losing money on rework or about to make a big investment, we can help. Get in touch for AI-native development consulting and frameworks.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />
      <main className="py-16">
        <div className="container mx-auto px-6">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

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

export default function ContactFormWrapper() {
  return <ContactForm />;
}

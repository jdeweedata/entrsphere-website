import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Development Consulting - Expert AI-Native Development Guidance",
  description:
    "Expert consulting to help your team implement AI-native development pipelines. From R25,000 (~$1,500).",
};

const features = [
  "Discovery audit and analysis",
  "Integration planning workshops",
  "AI pipeline architecture",
  "Team training sessions",
  "Ongoing support access",
  "Custom framework development",
];

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-16">
              <span className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                Enterprise
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                Development Consulting
              </h1>
              <p className="text-xl text-slate-600 mb-8">
                Expert consulting to help your team implement AI-native
                development pipelines. Stop guessing and start shipping.
              </p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-4xl font-bold text-slate-900">From R25,000</span>
                <span className="text-lg text-slate-500">(~$1,500 USD)</span>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check weight="bold" className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors"
              >
                Schedule a Call
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="text-slate-500 text-sm mt-4">
                Free 30-minute discovery call
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

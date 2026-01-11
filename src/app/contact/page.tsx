import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactFormWrapper from "@/components/wrappers/ContactFormWrapper";

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
          <ContactFormWrapper />
        </div>
      </main>
      <Footer />
    </div>
  );
}

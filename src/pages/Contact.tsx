import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  MessageSquare,
  User,
  CheckCircle,
  Loader2,
  Building2,
  Rocket,
  Users,
  Briefcase,
} from "lucide-react";

const personas = [
  {
    id: "agency",
    icon: Building2,
    title: "Agency Owner",
    description: "Losing money on scope creep and rework",
    placeholder:
      "Tell us about your last project that went over budget, or the scope creep problem you're trying to solve...",
  },
  {
    id: "founder",
    icon: Rocket,
    title: "Non-Technical Founder",
    description: "About to invest in development",
    placeholder:
      "Tell us about your project and budget. What are you trying to build? What's at stake?",
  },
  {
    id: "business",
    icon: Users,
    title: "Medium Business (50-250)",
    description: "Need team training or process help",
    placeholder:
      "Tell us about your team size, current challenges with requirements, and what outcomes you're looking for...",
  },
  {
    id: "pm",
    icon: Briefcase,
    title: "Product Manager",
    description: "Looking to level up skills",
    placeholder:
      "Tell us about your current role and what challenges you're facing with AI integration or requirements...",
  },
];

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitContact = useMutation(api.contacts.submit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const fullMessage = selectedPersona
      ? `[${personas.find((p) => p.id === selectedPersona)?.title}]\n\n${message}`
      : message;

    try {
      await submitContact({ name, email, message: fullMessage });
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
      setSelectedPersona(null);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPersonaData = personas.find((p) => p.id === selectedPersona);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <SEO
        title="Contact EntrSphere - Let's Talk About Your Pain"
        description="Whether you're losing money on rework or about to make a big investment, we can help. Get in touch for AI-native development consulting and frameworks."
        canonical="/contact"
      />
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Let's Talk About Your Pain
              </h1>
              <p className="text-lg text-slate-600">
                Whether you're bleeding money on rework or about to make a big
                investment, we can help. Tell us what's happening.
              </p>
            </div>

            {isSubmitted ? (
              /* Success State */
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  Message Sent!
                </h2>
                <p className="text-slate-600 mb-6">
                  We'll review your situation and get back to you within 24
                  hours with specific recommendations.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="border-slate-300"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Persona Selection */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <p className="text-sm font-medium text-slate-700 mb-4">
                    Which best describes you?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {personas.map((persona) => {
                      const Icon = persona.icon;
                      const isSelected = selectedPersona === persona.id;
                      return (
                        <button
                          key={persona.id}
                          type="button"
                          onClick={() => setSelectedPersona(persona.id)}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-slate-900 bg-slate-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Icon
                              className={`h-4 w-4 ${isSelected ? "text-slate-900" : "text-slate-500"}`}
                            />
                            <span
                              className={`font-medium text-sm ${isSelected ? "text-slate-900" : "text-slate-700"}`}
                            >
                              {persona.title}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {persona.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-slate-700 font-medium flex items-center gap-2"
                      >
                        <User className="h-4 w-4" />
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-slate-700 font-medium flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                      />
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="message"
                        className="text-slate-700 font-medium flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        What's happening?
                      </Label>
                      <Textarea
                        id="message"
                        placeholder={
                          selectedPersonaData?.placeholder ||
                          "Tell us about your situation. What's the pain? What have you tried?"
                        }
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={5}
                        className="border-slate-200 focus:border-slate-400 focus:ring-slate-400 resize-none"
                      />
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-lg rounded-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Get Help Now"
                      )}
                    </Button>
                  </form>
                </div>

                {/* Urgency Triggers */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white">
                  <h3 className="font-bold mb-3">Is this you?</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">→</span>
                      <span>
                        Just had a project go over budget because of unclear
                        requirements
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">→</span>
                      <span>
                        About to spend R100k+ on development and terrified of
                        wasting it
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">→</span>
                      <span>
                        Just fired a freelancer or dev shop who "didn't get it"
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">→</span>
                      <span>
                        Your boss asked "What's our AI strategy?" and you
                        panicked
                      </span>
                    </li>
                  </ul>
                  <p className="mt-4 text-white font-medium">
                    These are the exact moments we help with. Reach out now.
                  </p>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="mt-12 text-center">
              <p className="text-slate-600 mb-2">Or reach us directly at:</p>
              <a
                href="mailto:hello@entrsphere.com"
                className="text-slate-900 font-medium hover:underline"
              >
                hello@entrsphere.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

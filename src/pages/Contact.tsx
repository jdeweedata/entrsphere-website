import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, User, CheckCircle, Loader2 } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitContact = useMutation(api.contacts.submit);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await submitContact({ name, email, message });
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-slate-600">
                Have a question or want to work together? We'd love to hear from
                you.
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
                  Thank you for reaching out. We'll get back to you as soon as
                  possible.
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
              /* Contact Form */
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
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project or question..."
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
                      "Send Message"
                    )}
                  </Button>
                </form>
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

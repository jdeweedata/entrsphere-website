import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Index = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [challenge, setChallenge] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter your name");
      return;
    }
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!challenge) {
      toast.error("Please select your biggest challenge");
      return;
    }
    if (!consent) {
      toast.error("Please consent to data processing to continue");
      return;
    }
    setIsSubmitting(true);
    try {
      const subject = encodeURIComponent("Beta Registration - EntrSphere AI Automation");
      const body = encodeURIComponent(`
Name: ${name}
Email: ${email}
Company: ${company || 'Not specified'}
Biggest Challenge: ${challenge}

User has consented to data processing per GDPR.
      `);
      const mailtoLink = `mailto:admin@entrsphere.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      toast.success("Opening your email client...");

      // Reset form
      setName("");
      setEmail("");
      setCompany("");
      setChallenge("");
      setConsent(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <img src="/lovable-uploads/4824a6ff-4ee4-49c4-a5e0-681407eaf295.png" alt="EntrSphere Logo" className="w-24 h-24 object-contain" />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              EntrSphere: Boost Your Startup with AI Automation
            </h1>
            
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-600 max-w-3xl mx-auto">
              Join Our Beta to Automate Your Business – Save Time and Costs Today!
            </h2>
            
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Say goodbye to manual processes and hello to seamless AI-driven growth that works anywhere, anytime.
            </p>
          </div>

          {/* Lead Magnet Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-2xl mx-auto border border-slate-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Input type="text" placeholder="Your Name *" value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 text-lg rounded-lg border-2 border-blue-500 focus:ring-4 focus:ring-blue-200 focus:border-blue-600 transition-all duration-200" style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} required />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <Input type="email" placeholder="Your Email *" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 text-lg rounded-lg border-2 border-blue-500 focus:ring-4 focus:ring-blue-200 focus:border-blue-600 transition-all duration-200" style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} required />
              </div>

              {/* Company Input */}
              <div className="space-y-2">
                <Input type="text" placeholder="Company (Optional)" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-4 py-3 text-lg rounded-lg border-2 border-blue-500 focus:ring-4 focus:ring-blue-200 focus:border-blue-600 transition-all duration-200" style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }} />
              </div>

              {/* Challenge Dropdown */}
              <div className="space-y-2">
                <Select value={challenge} onValueChange={setChallenge}>
                  <SelectTrigger className="w-full px-4 py-3 text-lg rounded-lg border-2 border-blue-500 focus:ring-4 focus:ring-blue-200 focus:border-blue-600 transition-all duration-200" style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <SelectValue placeholder="What's your biggest challenge? *" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200 shadow-lg rounded-lg">
                    <SelectItem value="manual-processes">Manual processes</SelectItem>
                    <SelectItem value="high-costs">High operational costs</SelectItem>
                    <SelectItem value="digital-transformation">Digital transformation</SelectItem>
                    <SelectItem value="scaling-operations">Scaling operations</SelectItem>
                    <SelectItem value="other">Other (please specify)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start space-x-3 text-left">
                <Checkbox id="consent" checked={consent} onCheckedChange={checked => setConsent(checked as boolean)} className="mt-1 border-2 border-blue-500" required />
                <label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer text-slate-600">
                  I consent to my data being processed per GDPR *
                </label>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={isSubmitting} className="w-full font-semibold py-4 px-8 rounded-lg text-lg text-white transition-all duration-200 hover:shadow-lg transform hover:scale-105" style={{
              background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
              border: 'none'
            }}>
                {isSubmitting ? "Joining Beta..." : "Join Beta Now"}
              </Button>
            </form>

            {/* Trust Signals */}
            <div className="mt-8 space-y-4">
              <p className="text-slate-600 font-medium">Trusted by innovative startups globally</p>
              <div className="inline-block bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                <p className="text-blue-700 font-medium text-sm">
                  GDPR & Privacy Compliant ✅
                </p>
              </div>
            </div>
          </div>

          {/* Feedback CTA */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Help Us Improve!</h3>
            <p className="text-lg mb-6">Share your thoughts on AI automation for your startup</p>
            <a href="mailto:admin@entrsphere.com?subject=Feedback on AI Automation" className="inline-block bg-white text-orange-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Send Feedback
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-300">
            © 2025 EntrSphere | 
            <a href="#" className="hover:text-cyan-400 transition-colors ml-2">About Us</a> | 
            <a href="#" className="hover:text-cyan-400 transition-colors mx-2">Privacy Policy</a> | 
            <a href="#" className="hover:text-cyan-400 transition-colors mx-2">Contact Us</a>
          </p>
        </div>
      </footer>
    </div>;
};

export default Index;

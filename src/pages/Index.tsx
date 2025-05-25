
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const Index = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (!consent) {
      toast.error("Please consent to data processing to continue");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create mailto link to send email to admin@entrsphere.com
      const subject = encodeURIComponent("Contact Request from EntrSphere Website");
      const body = encodeURIComponent(`Email: ${email}\n\nUser has consented to data processing per POPIA.`);
      const mailtoLink = `mailto:admin@entrsphere.com?subject=${subject}&body=${body}`;
      
      window.location.href = mailtoLink;
      
      toast.success("Opening your email client...");
      
      // Reset form
      setEmail("");
      setConsent(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto text-center space-y-8">
        {/* Main Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            EntrSphere: AI Automation for Startups
          </h1>
          
          {/* Subheading */}
          <h2 className="text-xl md:text-2xl text-gray-600 font-light">
            Contact us for more information.
          </h2>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg shadow-sm">
          {/* Email Input */}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start space-x-3 text-left">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
              className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              required
            />
            <label 
              htmlFor="consent" 
              className="text-sm text-gray-700 leading-relaxed cursor-pointer"
            >
              I consent to my data being processed per POPIA
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-200 text-lg"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Index;

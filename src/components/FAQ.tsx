
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly can I see results from AI automation?",
      answer: "Most clients see immediate improvements within the first week of implementation. Significant cost savings and efficiency gains typically become apparent within 30 days."
    },
    {
      question: "Do I need technical expertise to use EntrSphere?",
      answer: "Not at all! We handle all the technical implementation and provide ongoing support. Our solutions are designed to work seamlessly with your existing processes."
    },
    {
      question: "What types of processes can be automated?",
      answer: "We can automate customer onboarding, data entry, reporting, email marketing, inventory management, customer support, and many other repetitive business processes."
    },
    {
      question: "Is my data secure with EntrSphere?",
      answer: "Absolutely. We're GDPR compliant and use enterprise-grade security measures. Your data is encrypted and never shared with third parties."
    },
    {
      question: "What's included in the beta program?",
      answer: "Beta participants get early access to our platform, dedicated support, custom automation setup, and a free AI automation checklist. You'll also get priority access to new features."
    },
    {
      question: "How much can I expect to save with automation?",
      answer: "Our clients typically see 30-50% reduction in operational costs and 60-80% time savings on automated processes. The exact savings depend on your specific use case."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get answers to common questions about AI automation for your startup.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-200 last:border-b-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-6 text-left flex items-center justify-between hover:text-slate-900 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-800 pr-4">{faq.question}</h3>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="pb-6 animate-fade-in">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

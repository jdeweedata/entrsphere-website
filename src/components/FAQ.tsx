
import { useState } from "react";
import { CaretDown, CaretUp } from "@phosphor-icons/react";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How quickly can we launch our platform with EntrSphere?",
      answer: "Most platforms launch within 4-8 weeks using our PaaS solutions. Custom marketplace development typically takes 6-12 weeks, compared to 12-24 months for traditional custom development."
    },
    {
      question: "What types of platforms can you build?",
      answer: "We specialize in marketplaces (B2B, B2C, peer-to-peer), professional service networks, healthcare platforms, supply chain solutions, and industry-specific platforms across 12+ verticals."
    },
    {
      question: "Do you provide ongoing platform management?",
      answer: "Yes! Our IaaS includes 24/7 monitoring, auto-scaling, security updates, and performance optimization. You focus on growing your business while we handle the technical operations."
    },
    {
      question: "How does your AI matching technology work?",
      answer: "Our AI learns from user behavior, preferences, and successful transactions to continuously improve matching accuracy. It considers factors like location, pricing, ratings, and compatibility to optimize connections."
    },
    {
      question: "What's included in your platform strategy session?",
      answer: "We analyze your market opportunity, define your platform architecture, identify key features, estimate development timeline and costs, and provide a comprehensive go-to-market strategy."
    },
    {
      question: "Can you integrate with existing systems and third-party services?",
      answer: "Absolutely. Our platforms integrate with payment processors, CRM systems, analytics tools, communication platforms, and industry-specific software through our comprehensive API framework."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Platform Development FAQ</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get answers to common questions about building and scaling digital platforms.
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
                  <CaretUp weight="duotone" className="h-5 w-5 text-slate-500 flex-shrink-0" />
                ) : (
                  <CaretDown weight="duotone" className="h-5 w-5 text-slate-500 flex-shrink-0" />
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

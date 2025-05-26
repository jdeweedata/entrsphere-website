
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Alex Thompson",
      title: "CEO & Founder",
      company: "LogiConnect Marketplace",
      testimonial: "EntrSphere helped us launch a B2B logistics marketplace that now processes $2M monthly. Their AI matching reduced our customer acquisition cost by 60% while improving match quality.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
      metrics: "Platform Type: B2B Marketplace"
    },
    {
      name: "Jessica Chen",
      title: "Founder",
      company: "MedConnect Platform",
      testimonial: "From concept to live healthcare network in 6 weeks. EntrSphere's platform infrastructure handles our complex compliance requirements while we focus on connecting patients with specialists.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&crop=face",
      metrics: "Platform Type: Healthcare Network"
    },
    {
      name: "Michael Rodriguez",
      title: "CTO",
      company: "SkillBridge Pro",
      testimonial: "Their PaaS solution saved us 18 months of development time. We launched our professional services marketplace with advanced features that would have taken our team years to build.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face",
      metrics: "Platform Type: Professional Services"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Platform Success Stories</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join dozens of platform operators who've built thriving ecosystems with our technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <p className="text-slate-600 mb-6 leading-relaxed italic">"{testimonial.testimonial}"</p>
              
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {testimonial.metrics}
                </span>
              </div>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.title}</div>
                  <div className="text-sm text-slate-500">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

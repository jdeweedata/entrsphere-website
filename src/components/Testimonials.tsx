
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      title: "CEO, TechFlow Startup",
      company: "TechFlow",
      testimonial: "EntrSphere helped us automate our customer onboarding process. We went from 3 hours per customer to 15 minutes, and our team can now focus on product development.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Marcus Rodriguez",
      title: "Founder, GrowthLab",
      company: "GrowthLab",
      testimonial: "The ROI was immediate. Within the first month, we saved 40% on operational costs and could redirect those resources to customer acquisition.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
    },
    {
      name: "Emily Watson",
      title: "COO, InnovateCorp",
      company: "InnovateCorp",
      testimonial: "What used to take our team 2 weeks now happens automatically overnight. EntrSphere's AI automation has been a game-changer for our scaling efforts.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Join hundreds of startups that have transformed their operations with AI automation.
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


import { CheckCircle, Zap, Target, TrendingUp } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: CheckCircle,
      title: "Audit Your Current Processes",
      description: "We analyze your existing workflows to identify automation opportunities and cost-saving potential.",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Zap,
      title: "Design Custom AI Solutions",
      description: "Our team creates tailored automation workflows that fit your specific business needs and goals.",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Target,
      title: "Implement & Optimize",
      description: "We deploy your AI automation systems and continuously optimize them for maximum efficiency.",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: TrendingUp,
      title: "Scale & Grow",
      description: "Watch your business grow while costs decrease and your team focuses on high-value strategic work.",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From audit to optimization, we handle everything so you can focus on growing your business.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className={`h-8 w-8 ${step.color}`} />
              </div>
              <div className="relative">
                <div className="absolute -top-8 -left-4 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

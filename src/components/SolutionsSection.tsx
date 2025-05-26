
import { ShoppingCart, Code, Server, BarChart3 } from "lucide-react";

const SolutionsSection = () => {
  const solutions = [
    {
      icon: ShoppingCart,
      title: "Marketplace Solutions",
      description: "Complete marketplace platforms with AI matching, secure payments, trust systems, and real-time analytics",
      features: ["Smart buyer-seller matching", "Integrated payment processing", "Trust & verification systems", "Advanced analytics dashboard"],
      industries: ["Healthcare Networks", "Professional Services", "Supply Chain", "Real Estate"],
      color: "purple"
    },
    {
      icon: Code,
      title: "Platform-as-a-Service",
      description: "Custom platform development with industry-specific templates, API management, and user authentication systems",
      features: ["Industry-specific templates", "API management & documentation", "User authentication & roles", "Custom workflow builders"],
      industries: ["Fintech Platforms", "SaaS Applications", "B2B Marketplaces", "Service Networks"],
      color: "blue"
    },
    {
      icon: Server,
      title: "Infrastructure-as-a-Service",
      description: "Managed cloud hosting with auto-scaling, security monitoring, and performance optimization for platform businesses",
      features: ["Auto-scaling infrastructure", "24/7 security monitoring", "Performance optimization", "Backup & disaster recovery"],
      industries: ["High-Traffic Platforms", "Data-Intensive Apps", "Global Marketplaces", "Enterprise Solutions"],
      color: "green"
    },
    {
      icon: BarChart3,
      title: "Platform Analytics",
      description: "Advanced analytics and business intelligence tools designed specifically for platform and marketplace operators",
      features: ["Real-time performance metrics", "User behavior analytics", "Revenue optimization tools", "Predictive insights"],
      industries: ["Multi-sided Markets", "Subscription Platforms", "Transaction-based Apps", "Content Platforms"],
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      purple: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", accent: "bg-purple-600" },
      blue: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", accent: "bg-blue-600" },
      green: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", accent: "bg-green-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", accent: "bg-orange-600" }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Complete Platform Solutions</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to build, launch, and scale successful digital platforms across any industry.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {solutions.map((solution, index) => {
            const colors = getColorClasses(solution.color);
            return (
              <div key={index} className={`${colors.bg} ${colors.border} border-2 p-8 rounded-2xl`}>
                <div className="flex items-start space-x-4 mb-6">
                  <div className={`w-14 h-14 ${colors.accent} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <solution.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{solution.title}</h3>
                    <p className="text-slate-700 leading-relaxed">{solution.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Key Features:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {solution.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
                        <span className="text-sm text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Perfect For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {solution.industries.map((industry, industryIndex) => (
                      <span key={industryIndex} className={`${colors.text} bg-white px-3 py-1 rounded-full text-sm font-medium border ${colors.border}`}>
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;

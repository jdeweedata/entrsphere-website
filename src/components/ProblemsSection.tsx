
import { Buildings, Lightning, Cloud, Gear } from "@phosphor-icons/react";

const ProblemsSection = () => {
  const problems = [
    {
      icon: Buildings,
      problem: "Fragmented Markets With No Central Connection Point",
      solution: "AI-powered marketplace platforms that intelligently match supply and demand with smart algorithms",
      savings: "10x faster connections, 95% match accuracy",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Lightning,
      problem: "Building Custom Platforms Takes Years & Millions",
      solution: "Ready-to-deploy PaaS solutions with industry-specific templates and pre-built components",
      savings: "Launch in weeks, 90% cost reduction",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Cloud,
      problem: "Scaling Infrastructure Is Complex & Expensive",
      solution: "Managed IaaS with auto-scaling, monitoring, and optimization built for platform businesses",
      savings: "Handle 100x growth seamlessly",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Gear,
      problem: "Platform Management Consumes All Resources",
      solution: "Fully managed platform operations with AI-driven optimization and automated workflows",
      savings: "Focus on growth, not operations",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <section id="problems" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Platform Challenges We Solve Daily</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Stop losing opportunities to fragmented markets. Here's exactly how we've helped 50+ companies build thriving digital ecosystems.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {problems.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-200">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <item.icon weight="duotone" className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.problem}</h3>
                  <p className="text-slate-600 mb-3">{item.solution}</p>
                  <div className={`inline-flex items-center ${item.color} bg-slate-50 px-3 py-1 rounded-full text-sm font-medium`}>
                    💡 {item.savings}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-blue-50 border border-blue-200 text-blue-700 font-bold py-4 px-8 rounded-lg">
            <span className="text-2xl mr-3">🚀</span>
            <span>From concept to thriving ecosystem in record time</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;

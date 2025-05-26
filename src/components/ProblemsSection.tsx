
import { Clock, DollarSign, Users, TrendingUp } from "lucide-react";

const ProblemsSection = () => {
  const problems = [
    {
      icon: Clock,
      problem: "Customer Support Taking 6+ Hours Per Ticket",
      solution: "AI-powered auto-responses and ticket routing cut response time to 30 minutes",
      savings: "Save 18 hours/week per support agent",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: DollarSign,
      problem: "Manual Data Entry Eating 20+ Hours Weekly",
      solution: "Automated data extraction and entry from emails, PDFs, and forms",
      savings: "Eliminate 90% of manual data work",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Users,
      problem: "Invoice Processing Delays Costing Deals",
      solution: "Instant invoice generation, approval workflows, and payment tracking",
      savings: "Get paid 5x faster",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: TrendingUp,
      problem: "Manual Reporting Taking 2 Days/Month",
      solution: "Real-time dashboards with automated insights and alerts",
      savings: "Turn 16 hours into 0 hours monthly",
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <section id="problems" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Real Problems We Solve Daily</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Stop bleeding money on manual processes. Here's exactly how we've helped 500+ startups reclaim their time and boost profits.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {problems.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-slate-200">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.problem}</h3>
                  <p className="text-slate-600 mb-3">{item.solution}</p>
                  <div className={`inline-flex items-center ${item.color} bg-slate-50 px-3 py-1 rounded-full text-sm font-medium`}>
                    💰 {item.savings}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-orange-50 border border-orange-200 text-orange-700 font-bold py-4 px-8 rounded-lg">
            <span className="text-2xl mr-3">🚀</span>
            <span>Average client sees ROI within 30 days</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;

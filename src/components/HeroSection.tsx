
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetAudit: () => void;
}

const HeroSection = ({ onGetAudit }: HeroSectionProps) => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6">
          <span className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            ⚠️ Stop Losing $50K+/Year to Manual Processes
          </span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
          Turn Your Team's Busywork Into Strategic Work
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          <strong>Spending 60% of your time on manual tasks?</strong> Our AI automation cuts repetitive work by 80%, so you can scale to 10x revenue without 10x headcount.
        </p>

        <div className="mb-16">
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
            onClick={onGetAudit}
          >
            Get Your Free Automation Audit →
          </Button>
          <p className="text-sm text-slate-500 mt-3">See exactly how much time & money you could save • No commitment required</p>
        </div>

        {/* Before/After Scenarios */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-red-700 mb-4">❌ Before Automation</h3>
              <div className="space-y-3 text-left">
                <div className="text-slate-700">• Customer support: <strong>6 hours per ticket</strong></div>
                <div className="text-slate-700">• Data entry: <strong>20 hours/week</strong></div>
                <div className="text-slate-700">• Invoice processing: <strong>3 days delay</strong></div>
                <div className="text-slate-700">• Manual reporting: <strong>2 full days/month</strong></div>
              </div>
              <div className="mt-6 p-4 bg-red-100 rounded-lg">
                <div className="text-red-800 font-bold">Cost: $52,000/year in lost productivity</div>
              </div>
            </div>

            {/* After */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-green-700 mb-4">✅ After Automation</h3>
              <div className="space-y-3 text-left">
                <div className="text-slate-700">• Customer support: <strong>30 minutes per ticket</strong></div>
                <div className="text-slate-700">• Data entry: <strong>2 hours/week</strong></div>
                <div className="text-slate-700">• Invoice processing: <strong>Same day</strong></div>
                <div className="text-slate-700">• Manual reporting: <strong>Automated daily</strong></div>
              </div>
              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <div className="text-green-800 font-bold">Savings: $41,600/year + faster growth</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg animate-pulse">
            🎁 Limited: Only 50 Free Audits This Month
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

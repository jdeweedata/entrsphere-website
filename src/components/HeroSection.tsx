
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetAudit: () => void;
}

const HeroSection = ({ onGetAudit }: HeroSectionProps) => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            🚀 Transform Market Opportunities Into Thriving Digital Ecosystems
          </span>
        </div>
        
        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
          Build, Scale & Operate Digital Platforms That Connect Industries
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          <strong>Need to connect fragmented markets?</strong> From AI-powered marketplaces to complete platform infrastructure - we provide the technology stack that turns market opportunities into thriving ecosystems.
        </p>

        <div className="mb-16">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300" 
            onClick={onGetAudit}
          >
            Get Your Platform Strategy Session →
          </Button>
          <p className="text-sm text-slate-500 mt-3">Discover how to turn your market opportunity into a profitable platform • Free consultation</p>
        </div>

        {/* Solution Pillars */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="text-3xl mb-3">🏪</div>
            <h3 className="text-lg font-bold text-purple-900 mb-2">Marketplaces</h3>
            <p className="text-purple-700 text-sm">AI-powered platforms that intelligently connect buyers and sellers with smart matching and trust systems</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-blue-900 mb-2">Platform-as-a-Service</h3>
            <p className="text-blue-700 text-sm">Ready-to-deploy platform solutions with industry-specific templates and APIs</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="text-3xl mb-3">☁️</div>
            <h3 className="text-lg font-bold text-green-900 mb-2">Infrastructure-as-a-Service</h3>
            <p className="text-green-700 text-sm">Managed cloud infrastructure with auto-scaling, monitoring, and optimization</p>
          </div>
        </div>

        {/* Before/After Scenarios */}
        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-red-700 mb-4">❌ Fragmented Market</h3>
              <div className="space-y-3 text-left">
                <div className="text-slate-700">• Buyers and sellers can't find each other</div>
                <div className="text-slate-700">• Building platforms takes <strong>years & millions</strong></div>
                <div className="text-slate-700">• Infrastructure scaling is <strong>complex & expensive</strong></div>
                <div className="text-slate-700">• Platform management <strong>consumes all resources</strong></div>
              </div>
              <div className="mt-6 p-4 bg-red-100 rounded-lg">
                <div className="text-red-800 font-bold">Result: Market opportunities remain untapped</div>
              </div>
            </div>

            {/* After */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-green-700 mb-4">✅ Connected Ecosystem</h3>
              <div className="space-y-3 text-left">
                <div className="text-slate-700">• AI connects markets with <strong>95% match accuracy</strong></div>
                <div className="text-slate-700">• Launch platforms in <strong>weeks, not years</strong></div>
                <div className="text-slate-700">• Handle <strong>100x growth</strong> automatically</div>
                <div className="text-slate-700">• Focus on business, <strong>not operations</strong></div>
              </div>
              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <div className="text-green-800 font-bold">Result: Thriving profitable platforms</div>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -right-4 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold shadow-lg animate-pulse">
            🎁 Free Platform Strategy Session - Limited Time
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

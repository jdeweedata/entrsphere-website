
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onBookDemo: () => void;
  onJoinBeta: () => void;
}

const HeroSection = ({ onBookDemo, onJoinBeta }: HeroSectionProps) => {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-8 leading-tight">
          Unlock Growth, Protect Margins, and Cut Costs—Without Hiring More or Wasting Budget
        </h1>
        
        <p className="text-xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Grow smarter—not harder. Let AI do the heavy lifting so you can scale profitably, control costs, and outpace competitors.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-medium" onClick={onBookDemo}>
            Book a demo
          </Button>
          <Button variant="outline" className="px-8 py-3 rounded-full font-medium" onClick={onJoinBeta}>
            Join Beta - Get Free Checklist
          </Button>
        </div>

        {/* Platform Visual */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-500 to-teal-500 rounded-2xl p-8 shadow-2xl">
            <div className="bg-white rounded-xl p-6 text-left">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6 animate-pulse"></div>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="h-20 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 font-bold">-40% Costs</span>
                  </div>
                  <div className="h-20 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-blue-600 font-bold">+80% Speed</span>
                  </div>
                  <div className="h-20 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-purple-600 font-bold">24/7 Auto</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
            🎁 Beta Access Available
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

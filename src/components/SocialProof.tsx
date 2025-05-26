
const SocialProof = () => {
  const metrics = [
    { number: "500+", label: "Startups Automated", detail: "In 18 months" },
    { number: "$2.1M", label: "Saved in Labor Costs", detail: "This year alone" },
    { number: "87%", label: "Avg Time Reduction", detail: "First 30 days" },
    { number: "30 Days", label: "Average ROI Time", detail: "Guaranteed" }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Fast-Growing Startups</h2>
          <p className="text-lg text-slate-300">
            Real results from real companies who stopped wasting time on busywork
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
          {metrics.map((metric, index) => (
            <div key={index} className="group">
              <div className="text-4xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {metric.number}
              </div>
              <div className="text-slate-300 font-medium mb-1">{metric.label}</div>
              <div className="text-sm text-slate-400">{metric.detail}</div>
            </div>
          ))}
        </div>

        {/* Single powerful testimonial */}
        <div className="max-w-4xl mx-auto text-center bg-slate-800 p-8 rounded-xl">
          <div className="text-xl italic mb-4 text-slate-200">
            "EntrSphere saved us $41,000 in our first quarter alone. What used to take our team 3 full days now happens automatically overnight. It's like having 10 extra employees."
          </div>
          <div className="flex items-center justify-center space-x-4">
            <img 
              src="https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=60&h=60&fit=crop&crop=face" 
              alt="Sarah Chen"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold text-white">Sarah Chen</div>
              <div className="text-sm text-slate-400">CEO, TechFlow (YC S23)</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

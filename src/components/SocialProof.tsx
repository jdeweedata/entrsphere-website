
const SocialProof = () => {
  const metrics = [
    { number: "50+", label: "Platforms Launched", detail: "Across 12 industries" },
    { number: "$100M+", label: "GMV Facilitated", detail: "Through our platforms" },
    { number: "99.9%", label: "Platform Uptime", detail: "Enterprise-grade reliability" },
    { number: "10x", label: "Faster Launch", detail: "Vs custom development" }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Platform Pioneers</h2>
          <p className="text-lg text-slate-300">
            Real results from companies who turned market opportunities into thriving ecosystems
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
          {metrics.map((metric, index) => (
            <div key={index} className="group">
              <div className="text-4xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform duration-300">
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
            "EntrSphere transformed our industry connection problem into a $10M marketplace. What seemed impossible to build became our competitive advantage. Their platform infrastructure scales effortlessly as we grow."
          </div>
          <div className="flex items-center justify-center space-x-4">
            <img 
              src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&crop=face" 
              alt="Jessica Chen"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-semibold text-white">Jessica Chen</div>
              <div className="text-sm text-slate-400">Founder, MedConnect Platform</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

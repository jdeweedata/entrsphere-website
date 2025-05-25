
const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Why Automate with EntrSphere?</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Discover how our AI-powered platform can transform your startup's efficiency and scalability.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Streamline Workflows</h3>
            <p className="text-slate-600 leading-relaxed">Automate repetitive tasks and free up your team for strategic initiatives.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Reduce Costs</h3>
            <p className="text-slate-600 leading-relaxed">Optimize resource allocation and minimize operational expenses effectively.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Scale with Confidence</h3>
            <p className="text-slate-600 leading-relaxed">Grow your business without being hindered by manual process limitations.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

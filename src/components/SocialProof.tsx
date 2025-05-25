
const SocialProof = () => {
  const metrics = [
    { number: "500+", label: "Startups Automated" },
    { number: "40%", label: "Average Cost Reduction" },
    { number: "80%", label: "Time Savings" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <section className="py-16 bg-slate-900 text-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Growing Startups Worldwide</h2>
          <p className="text-lg text-slate-300">
            Join the revolution of startups scaling smarter with AI automation
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, index) => (
            <div key={index} className="group">
              <div className="text-4xl font-bold text-orange-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {metric.number}
              </div>
              <div className="text-slate-300 font-medium">{metric.label}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-slate-300 mb-8">Integrates seamlessly with your favorite tools:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold">Slack</div>
            <div className="text-2xl font-bold">Notion</div>
            <div className="text-2xl font-bold">Zapier</div>
            <div className="text-2xl font-bold">HubSpot</div>
            <div className="text-2xl font-bold">Stripe</div>
            <div className="text-2xl font-bold">Salesforce</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;

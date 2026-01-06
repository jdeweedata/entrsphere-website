import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Target, Zap, Code, Lightbulb, Building2, Rocket, Users, Briefcase } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Profit Protection",
    description:
      "Bad requirements cost you R20,000–R50,000 per project in rework. Our frameworks eliminate the guesswork that eats your margins.",
  },
  {
    icon: Zap,
    title: "Permissionless Leverage",
    description:
      "We help you build assets that work without you—code, systems, and frameworks that scale while you sleep.",
  },
  {
    icon: Code,
    title: "Ship Fast, Ship Right",
    description:
      "Speed without chaos. Our frameworks eliminate the 'what did you mean?' meetings so you can build what matters.",
  },
  {
    icon: Lightbulb,
    title: "Clarity is the Product",
    description:
      "Vague requirements kill projects. We turn fuzzy ideas into specs so clear that AI agents can execute them.",
  },
];

const audience = [
  {
    icon: Building2,
    title: "Agency Owners",
    pain: "Losing R20,000–R50,000 per project on free rework",
    description:
      "You just had another project go over budget because a client changed their mind. You're tired of scope creep eating your margins. Our toolkit pays for itself by saving just one hour of senior developer time.",
    trigger: "You're angry about the last project that went sideways.",
    offer: "Discovery Router Toolkit (R850)",
  },
  {
    icon: Rocket,
    title: "Non-Technical Founders",
    pain: "About to spend R100k–R500k on development",
    description:
      "You're terrified of losing that money on developers who 'don't get it.' You just got a confusing quote from a dev shop, or you just fired a freelancer. You need insurance that your money builds the right thing.",
    trigger: "You're about to make a big bet and want certainty.",
    offer: "Development Consulting (from R15,000)",
  },
  {
    icon: Users,
    title: "Medium-Sized Businesses",
    pain: "Chaos from growing too fast (50-250 employees)",
    description:
      "Your startup agility has turned into process chaos. Developers are frustrated with PMs, and Sales is selling things that don't exist. You're trying to integrate AI into legacy systems that weren't built for it.",
    trigger: "Your Head of Product is overwhelmed and looking for help.",
    offer: "AI-Ready Requirements Workshop (R45,000–R85,000)",
  },
  {
    icon: Briefcase,
    title: "Product Managers",
    pain: "Imposter syndrome in the AI era",
    description:
      "Your boss just asked 'What's our AI strategy?' and you panicked. You want to feel competent and prepared. Our frameworks give you the language and structure to lead confidently.",
    trigger: "You need to sound smart in the next sprint planning meeting.",
    offer: "Discovery Router Toolkit (R850)",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50/50 to-white">
      <Header />

      <main className="py-16">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Stop Losing Money on Bad Requirements
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              EntrSphere helps agencies, founders, and product teams protect
              their profits by turning vague ideas into production-ready specs.
              No more "I'll know it when I see it." No more expensive rework.
            </p>
          </div>

          {/* The Problem We Solve */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              The Expensive Problem
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
              <p className="text-slate-700 mb-6">
                Every day, we see smart teams with great ideas bleeding money
                because of one thing: <strong>unclear requirements</strong>.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-3xl font-bold text-red-600 mb-1">
                    R20k–R50k
                  </p>
                  <p className="text-sm text-red-700">Lost per project on rework</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-3xl font-bold text-red-600 mb-1">60%</p>
                  <p className="text-sm text-red-700">
                    Of dev time wasted on "clarification"
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <p className="text-3xl font-bold text-red-600 mb-1">3x</p>
                  <p className="text-sm text-red-700">
                    Longer timelines from scope creep
                  </p>
                </div>
              </div>
              <p className="text-lg text-slate-800 font-medium">
                We don't sell AI hype. We sell the boring-but-essential
                frameworks that protect your budget and timeline.
              </p>
            </div>
          </section>

          {/* Our Philosophy */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Our Philosophy
            </h2>
            <div className="bg-slate-900 text-white rounded-2xl p-8">
              <blockquote className="text-2xl font-medium mb-6">
                "Don't sell organization. Sell profit protection."
              </blockquote>
              <p className="text-slate-300 mb-6">
                The real cost of bad requirements isn't just confusion—it's
                money. Every unclear spec becomes hours of rework, missed
                deadlines, and frustrated clients who don't come back.
              </p>
              <p className="text-slate-300">
                We believe in{" "}
                <strong className="text-white">financial clarity</strong>
                —spending R850 on a toolkit that saves one hour of senior
                developer time is an instant ROI. Spending R25k on consulting
                that protects a R500k build is insurance, not expense.
              </p>
            </div>
          </section>

          {/* Who We Serve */}
          <section className="max-w-5xl mx-auto mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Who We Serve
              </h2>
              <p className="text-slate-600">
                We serve people with real financial pain from bad requirements.
                Here's how we help each group:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {audience.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-slate-700" />
                      </div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="text-red-600 font-medium text-sm mb-2">
                      Pain: {item.pain}
                    </p>
                    <p className="text-slate-600 text-sm mb-3">
                      {item.description}
                    </p>
                    <p className="text-slate-500 text-xs italic mb-3">
                      Trigger: {item.trigger}
                    </p>
                    <p className="text-slate-900 font-medium text-sm">
                      → {item.offer}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* What We Offer */}
          <section className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              What We Offer
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">
                        Discovery Router Toolkit
                      </h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        R850 (~$47)
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">
                      Turn vague ideas into production-ready specs in 30
                      minutes. The exact framework we use to scope AI-native
                      products.
                    </p>
                    <p className="text-slate-500 text-xs">
                      Best for: Agency owners, PMs wanting to level up
                    </p>
                  </div>
                  <Link
                    to="/solutions/discovery-router"
                    className="text-slate-900 font-medium hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">
                        AI-Ready Requirements Workshop
                      </h3>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        R45,000–R85,000
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">
                      2-day on-site (or virtual) deep dive with your Product &
                      Engineering leads. We install the Discovery Router
                      Framework into your existing Jira/Linear workflow and
                      customize templates for your industry.
                    </p>
                    <p className="text-slate-500 text-xs">
                      Best for: Medium businesses (50-250 employees) with budget
                      for process improvement
                    </p>
                  </div>
                  <Link
                    to="/solutions/consulting"
                    className="text-slate-900 font-medium hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-slate-900">
                        Development Consulting
                      </h3>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        From R15,000
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">
                      Insurance for your development investment. We ensure your
                      R100k–R500k build goes to the right thing. Discovery
                      audits, integration planning, and hands-on guidance.
                    </p>
                    <p className="text-slate-500 text-xs">
                      Best for: Non-technical founders about to make a big bet
                    </p>
                  </div>
                  <Link
                    to="/solutions/consulting"
                    className="text-slate-900 font-medium hover:underline whitespace-nowrap flex items-center gap-1"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="max-w-5xl mx-auto mb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
              What We Believe
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value) => {
                const Icon = value.icon;
                return (
                  <div
                    key={value.title}
                    className="bg-white rounded-xl p-6 shadow-sm border border-slate-100"
                  >
                    <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-slate-700" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-slate-600 text-sm">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* The Bottom Line */}
          <section className="max-w-4xl mx-auto mb-20">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold mb-4">The Math is Simple</h2>
              <p className="text-slate-300 mb-6">
                If you're losing R20,000+ per project on rework, spending R850
                on a toolkit is a no-brainer. If you're about to invest R500,000
                on development, spending R25,000 on consulting is cheap
                insurance.
              </p>
              <p className="text-slate-300 mb-6">
                We don't sell "process improvement." We sell profit protection.
              </p>
              <p className="text-white text-lg font-medium">
                That's EntrSphere. Frameworks that pay for themselves.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Stop the Bleeding?
            </h2>
            <p className="text-slate-600 mb-8">
              Whether you're an agency owner tired of scope creep or a founder
              about to make a big investment, we have a solution sized for your
              pain.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/solutions"
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Explore Solutions
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 px-6 py-3 rounded-lg font-medium border border-slate-200 transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;

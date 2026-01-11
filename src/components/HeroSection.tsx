import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-[70vh] flex items-center">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="max-w-2xl">
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Deliver what your clients actually paid for.
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Vague requirements → wrong product → disappointed clients. Our framework turns fuzzy ideas into specs so clear, developers build exactly what your clients need.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium"
              >
                <Link href="/solutions">View Solutions</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-900 text-slate-900 hover:bg-slate-50 px-6 py-3 rounded-lg font-medium"
              >
                <Link href="/discovery">
                  Try Discovery Agent
                  <span className="ml-2 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    Free
                  </span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Right side - Hero shape */}
          <div className="hidden lg:flex justify-center items-center">
            <Image
              src="/entrsphere_asset_hero_shape_transparent.webp"
              alt="Hero shape"
              width={512}
              height={512}
              className="w-full max-w-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

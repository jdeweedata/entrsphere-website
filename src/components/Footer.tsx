
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-6 text-center">
        <div className="border-t border-slate-200 pt-8">
          <nav className="flex items-center justify-center gap-8 mb-6">
            <Link
              to="/solutions"
              className="text-slate-700 hover:text-slate-900 transition-all border-b-2 border-transparent hover:border-slate-800 pb-1"
            >
              Solutions
            </Link>
            <Link
              to="/case-studies"
              className="text-slate-700 hover:text-slate-900 transition-all border-b-2 border-transparent hover:border-slate-800 pb-1"
            >
              Case Studies
            </Link>
            <Link
              to="/about"
              className="text-slate-700 hover:text-slate-900 transition-all border-b-2 border-transparent hover:border-slate-800 pb-1"
            >
              About
            </Link>
            <Link
              to="/blog"
              className="text-slate-700 hover:text-slate-900 transition-all border-b-2 border-transparent hover:border-slate-800 pb-1"
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="text-slate-700 hover:text-slate-900 transition-all border-b-2 border-transparent hover:border-slate-800 pb-1"
            >
              Contact
            </Link>
          </nav>
          <p className="text-slate-500 text-sm">
            &copy; 2022 EntrSpere All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

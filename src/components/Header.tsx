
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

interface HeaderProps {
  onGetAudit: () => void;
}

const Header = ({ onGetAudit }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-teal-600 rounded-lg"></div>
            <span className="text-xl font-bold text-slate-900">EntrSphere</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#problems" className="text-slate-600 hover:text-slate-900 transition-colors">Problems We Solve</a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Success Stories</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-600">Welcome, {user.name}</span>
                <Link to="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Button 
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium" 
                  onClick={onGetAudit}
                >
                  Get Free Audit
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
            <nav className="flex flex-col space-y-4 mt-4">
              <a href="#problems" className="text-slate-600 hover:text-slate-900 transition-colors">Problems We Solve</a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Success Stories</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
              {user ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-slate-600">Welcome, {user.name}</span>
                  <Link to="/dashboard">
                    <Button variant="outline" className="w-full">Dashboard</Button>
                  </Link>
                  <Button variant="ghost" onClick={handleLogout} className="w-full">Logout</Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">Login</Button>
                  </Link>
                  <Button 
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium w-full" 
                    onClick={onGetAudit}
                  >
                    Get Free Audit
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

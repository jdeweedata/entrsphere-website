
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onBookDemo: () => void;
  onJoinBeta: () => void;
}

const Header = ({ onBookDemo, onJoinBeta }: HeaderProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/4824a6ff-4ee4-49c4-a5e0-681407eaf295.png" alt="EntrSphere Logo" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-slate-900">entrsphere</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Platform Overview</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Success Stories</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-slate-600">Welcome, {user.name}</span>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/dashboard'}
                  className="text-slate-900"
                >
                  Dashboard
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/login'}
                  className="text-slate-900"
                >
                  Login
                </Button>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-full font-medium" onClick={onBookDemo}>
                  Book a Demo
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;


import React from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { Target, Trophy, Upload, Settings } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Target, label: 'Create Goal', emoji: '🎯' },
    { path: '/dashboard', icon: Trophy, label: 'Dashboard', emoji: '🏆' },
    { path: '/proof', icon: Upload, label: 'Submit Proof', emoji: '📸' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold">Self-Bet</h1>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">LOCKED IN</span>
            </div>
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Padding for Fixed Nav */}
      <div className="h-20"></div>
    </div>
  );
};

export default Layout;

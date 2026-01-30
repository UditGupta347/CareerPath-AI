import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Compass, 
  Wand2, 
  FolderOpen, 
  MessageSquare, 
  User,
  Menu,
  X,
  Sparkles,
  LogIn,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: 'Home', icon: Home },
  { name: 'Explore', href: 'Explore', icon: Compass },
  { name: 'Generator', href: 'Generator', icon: Wand2 },
  { name: 'My Projects', href: 'MyProjects', icon: FolderOpen },
  { name: 'Resume Builder', href: 'ResumeBuilder', icon: FileText },
  { name: 'AI Assistant', href: 'Assistant', icon: MessageSquare },
];

export default function Layout({ children, currentPageName }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const userData = await base44.auth.me();
        setUser(userData);
      }
    } catch (e) {
      console.error('Auth error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to={createPageUrl('Home')}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">
                ProjectPath<span className="text-indigo-600">AI</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.href)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    currentPageName === item.href
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="w-8 h-8 rounded-lg bg-slate-100 animate-pulse" />
              ) : user ? (
                <Link to={createPageUrl('Profile')}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-2 rounded-lg",
                      currentPageName === 'Profile' && "bg-indigo-50 border-indigo-200"
                    )}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.full_name || 'Profile'}</span>
                  </Button>
                </Link>
              ) : (
                <Button
                  size="sm"
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  onClick={handleLogin}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-100"
            >
              <div className="px-4 py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={createPageUrl(item.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      currentPageName === item.href
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-slate-100 md:hidden">
        <div className="flex items-center justify-around py-2">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              to={createPageUrl(item.href)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all",
                currentPageName === item.href
                  ? "text-indigo-600"
                  : "text-slate-400"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
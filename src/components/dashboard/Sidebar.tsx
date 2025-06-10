import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Settings,
  UserCircle,
  BarChart2,
  Heart,
  Calendar,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isMobile: boolean;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  onSignOut: () => Promise<void>;
}

export function DashboardSidebar({ isMobile, showSidebar, setShowSidebar, onSignOut }: SidebarProps) {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const navItems = [
    {
      icon: <MessageSquare size={20} />,
      label: "Chat",
      path: "/dashboard",
    },
    {
      icon: <UserCircle size={20} />,
      label: "Customize",
      path: "/dashboard/customize",
    },
    {
      icon: <Heart size={20} />,
      label: "Relationship",
      path: "/dashboard/relationship",
    },
    {
      icon: <Calendar size={20} />,
      label: "Activities",
      path: "/dashboard/activities",
    },
    {
      icon: <BarChart2 size={20} />,
      label: "Insights",
      path: "/dashboard/insights",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/dashboard/settings",
    },
  ];

  // Handle body scroll lock when mobile sidebar is open
  useEffect(() => {
    if (isMobile) {
      if (showSidebar) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isMobile, showSidebar]);

  const handleNavClick = () => {
    if (isMobile) {
      setIsAnimating(true);
      setTimeout(() => {
        setShowSidebar(false);
        setIsAnimating(false);
      }, 150);
    }
  };

  // Desktop sidebar - always visible
  if (!isMobile) {
    return (
      <aside className="bg-muted border-r border-muted h-full w-64 flex flex-col">
        <div className="p-4 border-b border-muted">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent">
            Botbae
          </Link>
        </div>
        
        <nav className="flex-grow p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    location.pathname === item.path
                      ? "bg-botbae-accent text-white"
                      : "hover:bg-muted/80 text-white/70 hover:text-white"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-muted mt-auto">
          <button
            onClick={onSignOut}
            className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-muted/80 transition-colors"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    );
  }

  // Mobile sidebar with overlay
  return (
    <>
      {/* Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Mobile Sidebar */}
      {showSidebar && (
        <aside 
          className={cn(
            "fixed left-0 top-0 bottom-0 bg-muted border-r border-muted w-80 max-w-[85vw] flex flex-col z-50 animate-slide-in md:hidden",
            isAnimating && "animate-slide-out"
          )}
        >
          {/* Header with close button */}
          <div className="p-4 border-b border-muted flex items-center justify-between">
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent"
              onClick={handleNavClick}
            >
              Botbae
            </Link>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 rounded-lg hover:bg-muted/80 text-white/70 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-grow p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-base",
                      location.pathname === item.path
                        ? "bg-botbae-accent text-white"
                        : "hover:bg-muted/80 text-white/70 hover:text-white"
                    )}
                    onClick={handleNavClick}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sign Out Button */}
          <div className="p-4 border-t border-muted mt-auto">
            <button
              onClick={() => {
                onSignOut();
                handleNavClick();
              }}
              className="flex w-full items-center gap-3 px-3 py-3 rounded-lg text-white/70 hover:text-white hover:bg-muted/80 transition-colors text-base"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

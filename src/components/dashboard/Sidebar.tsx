import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Settings,
  UserCircle,
  BarChart2,
  Heart,
  Calendar,
  LogOut,
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
  
  const navItems = [
    {
      icon: <MessageSquare size={isMobile ? 18 : 20} />,
      label: "Chat",
      path: "/dashboard",
    },
    {
      icon: <UserCircle size={isMobile ? 18 : 20} />,
      label: "Customize",
      path: "/dashboard/customize",
    },
    {
      icon: <Heart size={isMobile ? 18 : 20} />,
      label: "Relationship",
      path: "/dashboard/relationship",
    },
    {
      icon: <Calendar size={isMobile ? 18 : 20} />,
      label: "Activities",
      path: "/dashboard/activities",
    },
    {
      icon: <BarChart2 size={isMobile ? 18 : 20} />,
      label: "Insights",
      path: "/dashboard/insights",
    },
    {
      icon: <Settings size={isMobile ? 18 : 20} />,
      label: "Settings",
      path: "/dashboard/settings",
    },
  ];
  
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-muted border-r border-muted h-full flex flex-col transition-transform duration-300 ease-in-out",
          // Responsive width: smaller on mobile to prevent horizontal scrolling
          isMobile ? "w-72 max-w-[85vw] sm:w-64 mobile-sidebar" : "w-64",
          isMobile ? "fixed z-40" : "relative",
          isMobile && !showSidebar && "-translate-x-full",
          isMobile && showSidebar && "translate-x-0"
        )}
      >
        <div className={cn("border-b border-muted", isMobile ? "p-3" : "p-4")}>
          <Link 
            to="/" 
            className={cn(
              "font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent",
              isMobile ? "text-xl" : "text-2xl"
            )}
          >
            Botbae
          </Link>
        </div>
        
        <nav className={cn("flex-grow", isMobile ? "p-3" : "p-4")}>
          <ul className={cn(isMobile ? "space-y-1" : "space-y-2")}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-lg transition-colors nav-item",
                    // Mobile-optimized padding and text
                    isMobile ? "px-2 py-2.5 text-sm" : "px-3 py-2 text-base",
                    location.pathname === item.path
                      ? "bg-botbae-accent text-white"
                      : "hover:bg-muted/80 text-white/70 hover:text-white"
                  )}
                  onClick={() => isMobile && setShowSidebar(false)}
                >
                  <div className="flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className={cn("border-t border-muted mt-auto", isMobile ? "p-3" : "p-4")}>
          <button
            onClick={onSignOut}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg text-white/70 hover:text-white hover:bg-muted/80 transition-colors nav-item",
              isMobile ? "px-2 py-2.5 text-sm" : "px-3 py-2 text-base"
            )}
          >
            <div className="flex-shrink-0">
              <LogOut size={isMobile ? 18 : 20} />
            </div>
            <span className="truncate">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

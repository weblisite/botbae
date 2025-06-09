
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
  
  // If mobile and sidebar is not showing, don't render sidebar content
  if (isMobile && !showSidebar) return null;

  return (
    <aside 
      className={cn(
        "bg-muted border-r border-muted h-full w-64 flex flex-col",
        isMobile && "fixed z-40 animate-slide-in"
      )}
    >
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
                onClick={() => isMobile && setShowSidebar(false)}
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

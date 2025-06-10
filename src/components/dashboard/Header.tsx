import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isMobile: boolean;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  relationshipStage: string;
}

export function DashboardHeader({
  isMobile,
  showSidebar,
  setShowSidebar,
  relationshipStage,
}: HeaderProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleProfileClick = () => {
    navigate("/dashboard/settings", { state: { defaultTab: "profile" } });
  };

  const handleSubscriptionClick = () => {
    navigate("/dashboard/settings", { state: { defaultTab: "subscription" } });
  };

  const handleSettingsClick = () => {
    navigate("/dashboard/settings");
  };

  const handleNotificationsClick = () => {
    navigate("/dashboard/settings", { state: { defaultTab: "notifications" } });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <header 
      className="sticky-header sticky top-0 z-[100] h-16 border-b border-muted flex items-center px-4 justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        WebkitBackdropFilter: 'blur(8px)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Toggle menu"
          className="hover:bg-botbae-accent/20 transition-colors border-2 border-transparent hover:border-botbae-accent/30"
          >
          <Menu size={24} className="text-foreground" />
          </Button>
        
        <div className="flex flex-col">
          <h1 className="font-medium text-lg">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Relationship: {relationshipStage}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Notifications"
          onClick={handleNotificationsClick}
          className="hover:bg-botbae-accent/20 transition-colors"
        >
          <Bell size={20} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full overflow-hidden hover:bg-botbae-accent/20 transition-colors">
              <User size={20} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSubscriptionClick} className="cursor-pointer">
              Subscription
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

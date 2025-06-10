import { Menu, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  return (
    <header className="h-16 border-b border-muted flex items-center px-3 md:px-4 justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label="Toggle menu"
            className="shrink-0 h-10 w-10 md:h-9 md:w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        <div className="flex flex-col min-w-0 flex-1">
          <h1 className="font-medium text-base md:text-lg truncate">Dashboard</h1>
          <p className="text-xs text-muted-foreground truncate">
            Relationship: <span className="font-medium">{relationshipStage}</span>
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Notifications"
          className="h-10 w-10 md:h-9 md:w-9"
        >
          <Bell className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full overflow-hidden h-10 w-10 md:h-9 md:w-9"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Subscription</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

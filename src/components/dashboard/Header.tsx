import { Menu, Bell, User } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => {
      // Detect mobile keyboard by checking if the viewport height has significantly shrunk
      const windowHeight = window.innerHeight;
      const screenHeight = window.screen.height;
      const threshold = screenHeight * 0.75; // If viewport is less than 75% of screen height, keyboard is likely visible
      
      setKeyboardVisible(windowHeight < threshold);
    };

    const handleFocusIn = () => {
      // Additional keyboard detection via input focus
      setTimeout(() => {
        const windowHeight = window.innerHeight;
        const screenHeight = window.screen.height;
        const threshold = screenHeight * 0.75;
        setKeyboardVisible(windowHeight < threshold);
      }, 300); // Delay to allow keyboard animation
    };

    const handleFocusOut = () => {
      // Keyboard likely hidden when inputs lose focus
      setTimeout(() => {
        setKeyboardVisible(false);
      }, 300);
    };

    // Listen for window resize (keyboard show/hide)
    window.addEventListener('resize', handleResize);
    
    // Listen for input focus events
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [isMobile]);

  return (
    <header 
      className={`
        ${keyboardVisible && isMobile ? 'fixed' : 'sticky-header sticky'} 
        top-0 z-[100] h-16 border-b border-muted flex items-center px-4 justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0
        ${keyboardVisible && isMobile ? 'left-0 right-0' : ''}
      `}
      style={{
        position: keyboardVisible && isMobile ? 'fixed' : 'sticky',
        top: 0,
        zIndex: 100,
        WebkitBackdropFilter: 'blur(8px)',
        backdropFilter: 'blur(8px)',
        ...(keyboardVisible && isMobile && {
          left: 0,
          right: 0,
          width: '100%'
        })
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
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={20} />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
              <User size={20} />
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

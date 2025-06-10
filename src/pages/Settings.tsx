import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBotbaeData } from "@/hooks/useBotbaeData";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import SettingsForm from "@/components/settings/SettingsForm";

export default function Settings() {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const { userMemory, loading: dataLoading } = useBotbaeData();
  const [showSidebar, setShowSidebar] = useState(false);
  
  // Render immediately - SettingsForm will handle missing data gracefully
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        isMobile={isMobile}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSignOut={() => {}}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader
          isMobile={isMobile}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          relationshipStage={userMemory?.relationshipStage || "New Friend"}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            <SettingsForm />
          </div>
        </div>
      </div>
    </div>
  );
}

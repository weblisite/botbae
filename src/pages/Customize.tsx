import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";
import { useBotbaeData } from "@/hooks/useBotbaeData";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { CustomizationForm } from "@/components/dashboard/CustomizationForm";

export default function Customize() {
  const isMobile = useIsMobile();
  const { botbaeConfig, updateBotbaeConfig, loading } = useBotbaeData();
  const { userMemory } = useBotbaeData();
  const [showSidebar, setShowSidebar] = useState(false);

  // Show loading while data is being fetched
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Loading customization...</h2>
        </div>
      </div>
    );
  }

  // Show message if data is not available
  if (!botbaeConfig || !userMemory) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Unable to load customization data</h2>
          <p className="text-gray-300 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

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
          relationshipStage={userMemory.relationshipStage}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Customize Your Botbae</h1>
            
            <CustomizationForm
              botbaeConfig={botbaeConfig}
              updateBotbaeConfig={updateBotbaeConfig}
              onSave={async () => {}}
              onCancel={async () => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        isMobile={isMobile}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSignOut={async () => {}}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader
          isMobile={isMobile}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          relationshipStage={userMemory?.relationshipStage || "getting_to_know"}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 px-1">Customize Your Botbae</h1>
            
            {botbaeConfig && (
              <CustomizationForm
                botbaeConfig={botbaeConfig}
                updateBotbaeConfig={updateBotbaeConfig}
                onSave={async () => {}}
                onCancel={async () => {}}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

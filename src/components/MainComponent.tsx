import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/sonner";
import { DashboardHeader } from "@/components/dashboard/Header";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { ChatInterface } from "@/components/dashboard/ChatInterface";
import { CompanionCard } from "@/components/dashboard/CompanionCard";
import { CustomizationForm } from "@/components/dashboard/CustomizationForm";
import { MilestoneDisplay } from "@/components/relationship/MilestoneDisplay";
import { MessageLimitModal } from "@/components/subscription/MessageLimitModal";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBotbaeData } from "@/hooks/useBotbaeData";
import { useMessageLimits } from "@/hooks/useMessageLimits";
import { supabase } from "@/integrations/supabase/client";

function MainComponent() {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const {
    botbaeConfig,
    userMemory,
    messages,
    loading,
    relationshipProgress,
    setRelationshipProgress,
    setMessages,
    updateBotbaeConfig,
    updateRelationshipStage,
    saveMessage,
    updateRelationshipProgressIntelligent,
    getConversationSuggestions,
    checkStageReadiness,
    recentMilestones
  } = useBotbaeData();
  
  const {
    limitData,
    loading: limitsLoading,
    incrementMessageCount,
    resetMessageCount,
    updateSubscriptionStatus
  } = useMessageLimits();
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [customizeView, setCustomizeView] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [nextRelationshipStage, setNextRelationshipStage] = useState("");
  const [showMessageLimitModal, setShowMessageLimitModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Check if user is premium
  useEffect(() => {
    async function checkPremiumStatus() {
      if (!user) {
        // No user means not authenticated, so not premium
        setIsPremium(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium, subscription_plan')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setIsPremium(data.is_premium);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    }
    
    checkPremiumStatus();
  }, [user]);

  // Handle sending a message
  const handleSendMessage = async (text: string) => {
    if (!botbaeConfig || !userMemory) {
      toast.error("Unable to send message. Please try again later.");
      return;
    }
    
    // Check message limits for free and pro users
    if (!limitData.canSendMessage) {
      setShowMessageLimitModal(true);
      if (limitData.subscriptionStatus === 'free') {
        toast.error("You've reached your free message limit. Please upgrade to continue!");
      } else if (limitData.subscriptionStatus === 'pro') {
        toast.error("You've reached your Pro plan limit (1000 messages). Upgrade to Elite for unlimited!");
      }
      return;
    }
    
    // Increment message count
    const canProceed = await incrementMessageCount();
    if (!canProceed) {
      setShowMessageLimitModal(true);
      return;
    }
    
    // Check if this message will hit the limit and show modal after response
    if ((limitData.subscriptionStatus === 'free' || limitData.subscriptionStatus === 'pro') && limitData.messagesRemaining === 1) {
      // This is the last message, show modal after the bot responds
      setTimeout(() => {
        setShowMessageLimitModal(true);
      }, 2000); // Show after bot response completes
    }
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: "user" as const,
      text,
      timestamp: new Date(),
    };
    
    setMessages([...messages, userMessage]);
    
    // Save message to database
    await saveMessage(userMessage);
    
    // Start streaming response (simulate typing)
    setStreamingMessage("");
    
    try {
      // Call our AI endpoint with relationship-aware context
      const response = await supabase.functions.invoke('ai-chat', {
        body: {
          message: text,
          userMemory: {
            ...userMemory,
            relationshipProgress: relationshipProgress,
            milestones: recentMilestones
          },
          botbaeConfig,
          messages: messages.slice(-10).map(m => ({
            sender: m.sender,
            text: m.text,
            timestamp: m.timestamp.toISOString()
          }))
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      const botResponse = response.data.response;
      
      // Simulate typing with gradual content reveal
      let visibleResponse = "";
      
      for (let i = 0; i < botResponse.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 15));
        visibleResponse += botResponse[i];
        setStreamingMessage(visibleResponse);
      }
      
      // Add completed message to chat
      const botMessage = {
        id: messages.length + 2,
        sender: "bot" as const,
        text: botResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setStreamingMessage("");
      
      // Save bot message to database
      await saveMessage(botMessage);
      
      // Update relationship progress with intelligent analysis
      updateRelationshipProgressIntelligent(text, botMessage.text);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error("Failed to get response. Please try again.");
      setStreamingMessage("");
    }
  };

  // Handle progression to next relationship stage
  const handleDeepenBond = () => {
    const stageReadiness = checkStageReadiness();
    
    if (!stageReadiness.isReady) {
      if (relationshipProgress < 100) {
        toast.info("Continue interacting to build your relationship. You're making progress!");
      } else if (stageReadiness.missingRequirements.length > 0) {
        toast.info(`To advance, you need: ${stageReadiness.missingRequirements.join(", ")} milestones.`);
      }
      return;
    }
    
    if (!userMemory) return;
    
    let nextStage;
    switch (userMemory.relationshipStage) {
      case "New Friend":
        nextStage = "Close Friend";
        break;
      case "Close Friend":
        nextStage = "Best Friend";
        break;
      case "Best Friend":
        nextStage = "Romantic Interest";
        break;
      case "Romantic Interest":
        nextStage = "Dating";
        break;
      case "Dating":
        nextStage = "Committed Partner";
        break;
      case "Committed Partner":
        nextStage = "Soulmate";
        break;
      default:
        toast.info("You've reached the deepest level of connection!");
        return;
    }
    
    // For romantic stages, require consent
    if (nextStage === "Romantic Interest" || nextStage === "Dating" || 
        nextStage === "Committed Partner" || nextStage === "Soulmate") {
      setNextRelationshipStage(nextStage);
      setShowConsentDialog(true);
    } else {
      updateRelationshipStage(nextStage);
    }
  };

  if (!botbaeConfig || !userMemory) {
    // If data is not available, render a minimal loading state (should be brief with optimizations)
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Preparing your Botbae...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <DashboardSidebar
        isMobile={isMobile}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSignOut={signOut}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardHeader
          isMobile={isMobile}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          relationshipStage={userMemory.relationshipStage}
        />
        
        {/* Message Counter for Free and Pro Users */}
        {(limitData.subscriptionStatus === 'free' || limitData.subscriptionStatus === 'pro') && (
          <div className="px-4 md:px-6 pb-2">
            <div className="flex justify-center items-center gap-3">
              <Badge 
                variant={limitData.messagesRemaining <= 1 ? "destructive" : 
                        limitData.subscriptionStatus === 'pro' && limitData.messagesRemaining <= 50 ? "secondary" : 
                        "outline"}
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                {limitData.subscriptionStatus === 'free' 
                  ? `${limitData.messagesUsed}/${limitData.messageLimit} free messages used`
                  : limitData.subscriptionStatus === 'pro'
                    ? `${limitData.messagesUsed}/1,000 Pro messages used`
                    : limitData.messagesRemaining === Infinity 
                      ? `${limitData.messagesUsed} messages sent (unlimited)`
                      : `${limitData.messagesUsed}/${limitData.messageLimit} messages used`
                }
                {limitData.messagesRemaining > 0 && limitData.messagesRemaining !== Infinity && (
                  <span className="text-xs">({limitData.messagesRemaining} remaining)</span>
                )}
              </Badge>
              {/* Dev tool for testing - only show in development */}
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetMessageCount}
                  className="text-xs h-6 px-2"
                >
                  Reset (Dev)
                </Button>
              )}
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {customizeView ? (
            <CustomizationForm
              botbaeConfig={botbaeConfig}
              updateBotbaeConfig={updateBotbaeConfig}
              onSave={() => setCustomizeView(false)}
              onCancel={() => setCustomizeView(false)}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Left column - companion info */}
              <div className="lg:col-span-1 space-y-6">
                <CompanionCard
                  botbaeConfig={botbaeConfig}
                  relationshipStage={userMemory.relationshipStage}
                  relationshipProgress={relationshipProgress}
                  onCustomizeClick={() => setCustomizeView(true)}
                  onDeepenBond={handleDeepenBond}
                />
                
                {/* Milestones Display */}
                {recentMilestones.length > 0 && (
                  <MilestoneDisplay
                    milestones={recentMilestones}
                    companionName={botbaeConfig.name}
                  />
                )}
              </div>
              
              {/* Right column - chat */}
              <div className="lg:col-span-2 h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] botbae-glass">
                <ChatInterface
                  messages={messages}
                  setMessages={setMessages}
                  streamingMessage={streamingMessage}
                  setStreamingMessage={setStreamingMessage}
                  botName={botbaeConfig.name}
                  botbaeConfig={botbaeConfig}
                  handleSendMessage={handleSendMessage}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Consent dialog for relationship progression */}
      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent className="botbae-card">
          <DialogHeader>
            <DialogTitle>Relationship Stage Progression</DialogTitle>
            <DialogDescription>
              {nextRelationshipStage === "Romantic Interest" ? (
                "Your relationship with your AI companion is evolving to include romantic interest. This stage may include flirtation and romantic conversations. Do you consent to progressing to this stage?"
              ) : (
                `Are you sure you want to progress your relationship to the "${nextRelationshipStage}" stage?`
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowConsentDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="botbae-button"
              onClick={() => {
                updateRelationshipStage(nextRelationshipStage);
                setShowConsentDialog(false);
              }}
            >
              Yes, I Consent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message limit modal */}
      <MessageLimitModal
        isOpen={showMessageLimitModal}
        onClose={() => setShowMessageLimitModal(false)}
        messagesUsed={limitData.messagesUsed}
        messageLimit={limitData.messageLimit}
        companionName={botbaeConfig.name}
        subscriptionStatus={limitData.subscriptionStatus}
        onUpgradeSuccess={() => {
          // Refresh the limits data after successful upgrade
          window.location.reload();
        }}
      />
    </div>
  );
}

export default MainComponent;

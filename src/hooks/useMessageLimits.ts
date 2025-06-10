import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

export interface MessageLimitData {
  messagesUsed: number;
  messageLimit: number;
  subscriptionStatus: 'free' | 'premium' | 'pro' | 'elite';
  canSendMessage: boolean;
  messagesRemaining: number;
}

export function useMessageLimits() {
  const { user } = useAuth();
  const [limitData, setLimitData] = useState<MessageLimitData>({
    messagesUsed: 0,
    messageLimit: 3, // Default to 3 for testing
    subscriptionStatus: 'free',
    canSendMessage: true,
    messagesRemaining: 3,
  });
  const [loading, setLoading] = useState(true);

  // Fetch user's message usage and limits
  useEffect(() => {
    async function fetchMessageLimits() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('messages_used, message_limit, subscription_status, is_premium')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          const messagesUsed = profile.messages_used || 0;
          const messageLimit = profile.message_limit || 3; // Default to 3 for testing
          const subscriptionStatus = profile.subscription_status || 'free';
          const isPremium = profile.is_premium || false;
          
          // Handle unlimited plans (message_limit = 999999 means unlimited for Elite)
          const isUnlimited = subscriptionStatus === 'elite' && (messageLimit >= 999999);
          const messagesRemaining = isUnlimited ? Infinity : Math.max(0, messageLimit - messagesUsed);
          
          // Determine if user can send message
          let canSendMessage = true;
          if (subscriptionStatus === 'free' && messagesRemaining <= 0) {
            canSendMessage = false;
          } else if (subscriptionStatus === 'pro' && messagesRemaining <= 0) {
            canSendMessage = false;
          }
          // Elite users with unlimited can always send

          setLimitData({
            messagesUsed,
            messageLimit,
            subscriptionStatus: subscriptionStatus as 'free' | 'premium' | 'pro' | 'elite',
            canSendMessage,
            messagesRemaining,
          });
        }
      } catch (error: any) {
        console.error('Error fetching message limits:', error);
        // Set default free limits if there's an error
        setLimitData({
          messagesUsed: 0,
          messageLimit: 3, // Default to 3 for testing
          subscriptionStatus: 'free',
          canSendMessage: true,
          messagesRemaining: 3,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchMessageLimits();
  }, [user]);

  // Increment message count when user sends a message
  const incrementMessageCount = async (): Promise<boolean> => {
    if (!user) return false;

    // Check if user can send message
    if (!limitData.canSendMessage) {
      if (limitData.subscriptionStatus === 'free') {
        toast.error("You've reached your free message limit. Please upgrade to continue chatting.");
      } else if (limitData.subscriptionStatus === 'pro') {
        toast.error("You've reached your Pro plan limit (1000 messages). Upgrade to Elite for unlimited messages!");
      }
      return false;
    }

    try {
      const newMessagesUsed = limitData.messagesUsed + 1;
      
      // Update database
      const { error } = await supabase
        .from('profiles')
        .update({ 
          messages_used: newMessagesUsed,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      const isUnlimited = limitData.subscriptionStatus === 'elite' && (limitData.messageLimit >= 999999);
      const messagesRemaining = isUnlimited ? Infinity : Math.max(0, limitData.messageLimit - newMessagesUsed);
      
      let canSendMessage = true;
      if (limitData.subscriptionStatus === 'free' && messagesRemaining <= 0) {
        canSendMessage = false;
      } else if (limitData.subscriptionStatus === 'pro' && messagesRemaining <= 0) {
        canSendMessage = false;
      }

      setLimitData(prev => ({
        ...prev,
        messagesUsed: newMessagesUsed,
        messagesRemaining,
        canSendMessage,
      }));

      // Show warnings based on subscription status
      if (limitData.subscriptionStatus === 'free') {
        if (messagesRemaining === 1 && limitData.messageLimit === 3) {
          toast.warning("⚠️ Only 1 free message remaining! Consider upgrading for more chats.", {
            duration: 4000,
          });
        } else if (messagesRemaining === 0) {
          toast.error("🚫 You've reached your free message limit! Upgrade to continue chatting.", {
            duration: 5000,
          });
        } else if (messagesRemaining === 2 && limitData.messageLimit > 3) {
          // For when we go back to 10 messages
          toast.warning("⚠️ Only 2 free messages remaining! Consider upgrading for more chats.");
        } else if (messagesRemaining === 1 && limitData.messageLimit > 3) {
          toast.warning("⚠️ This is your last free message! Upgrade to continue chatting.");
        }
      } else if (limitData.subscriptionStatus === 'pro') {
        // Pro plan warnings for 1000 message limit
        if (messagesRemaining <= 50 && messagesRemaining > 10) {
          toast.warning(`⚠️ Pro plan: ${messagesRemaining} messages remaining this month. Consider upgrading to Elite for unlimited!`, {
            duration: 4000,
          });
        } else if (messagesRemaining <= 10 && messagesRemaining > 1) {
          toast.warning(`⚠️ Pro plan: Only ${messagesRemaining} messages left! Upgrade to Elite for unlimited conversations.`, {
            duration: 5000,
          });
        } else if (messagesRemaining === 1) {
          toast.warning("🚨 Pro plan: This is your last message this month! Upgrade to Elite for unlimited access.", {
            duration: 6000,
          });
        } else if (messagesRemaining === 0) {
          toast.error("🚫 You've reached your Pro plan limit (1000 messages). Upgrade to Elite for unlimited conversations!", {
            duration: 5000,
          });
        }
      }

      return true;
    } catch (error: any) {
      console.error('Error incrementing message count:', error);
      toast.error("Failed to track message usage");
      return false;
    }
  };

  // Reset message count (for new billing periods or upgrades)
  const resetMessageCount = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          messages_used: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      setLimitData(prev => ({
        ...prev,
        messagesUsed: 0,
        messagesRemaining: prev.subscriptionStatus === 'elite' && prev.messageLimit >= 999999 
          ? Infinity 
          : prev.messageLimit,
        canSendMessage: true,
      }));

      toast.success("Message count has been reset!");
    } catch (error: any) {
      console.error('Error resetting message count:', error);
      toast.error("Failed to reset message count");
    }
  };

  // Update subscription status (called after successful purchase)
  const updateSubscriptionStatus = async (newStatus: 'free' | 'premium' | 'pro' | 'elite', newLimit?: number) => {
    if (!user) return;

    try {
      const updates: any = {
        subscription_status: newStatus,
        is_premium: newStatus !== 'free',
        updated_at: new Date().toISOString()
      };

      if (newLimit !== undefined) {
        updates.message_limit = newLimit;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      const messageLimit = newLimit !== undefined ? newLimit : limitData.messageLimit;
      const isUnlimited = newStatus === 'elite' && messageLimit >= 999999;
      const messagesRemaining = isUnlimited ? Infinity : Math.max(0, messageLimit - limitData.messagesUsed);

      setLimitData(prev => ({
        ...prev,
        subscriptionStatus: newStatus,
        messageLimit,
        messagesRemaining,
        canSendMessage: true, // Premium users can always send messages
      }));

      toast.success(`Successfully upgraded to ${newStatus} plan!`);
    } catch (error: any) {
      console.error('Error updating subscription status:', error);
      toast.error("Failed to update subscription status");
    }
  };

  return {
    limitData,
    loading,
    incrementMessageCount,
    resetMessageCount,
    updateSubscriptionStatus,
  };
} 
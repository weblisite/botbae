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
          
          // Handle unlimited plans (message_limit = 999999 means unlimited)
          const isUnlimited = isPremium && (messageLimit >= 999999 || subscriptionStatus === 'elite');
          const messagesRemaining = isUnlimited ? Infinity : Math.max(0, messageLimit - messagesUsed);
          const canSendMessage = isPremium || isUnlimited || subscriptionStatus !== 'free' || messagesRemaining > 0;

          setLimitData({
            messagesUsed,
            messageLimit,
            subscriptionStatus: isPremium ? 'premium' : (subscriptionStatus as 'free' | 'premium' | 'pro' | 'elite'),
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
      toast.error("You've reached your message limit. Please upgrade to continue chatting.");
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
      const isUnlimited = limitData.subscriptionStatus !== 'free' && (limitData.messageLimit >= 999999 || limitData.subscriptionStatus === 'elite');
      const messagesRemaining = isUnlimited ? Infinity : Math.max(0, limitData.messageLimit - newMessagesUsed);
      const canSendMessage = limitData.subscriptionStatus !== 'free' || isUnlimited || messagesRemaining > 0;

      setLimitData(prev => ({
        ...prev,
        messagesUsed: newMessagesUsed,
        messagesRemaining,
        canSendMessage,
      }));

      // Show warning when approaching limit (optimized for 3-message testing)
      if (limitData.subscriptionStatus === 'free') {
        if (messagesRemaining === 1 && limitData.messageLimit === 3) {
          toast.warning("⚠️ Only 1 free message remaining! Consider upgrading for unlimited chats.", {
            duration: 4000,
          });
        } else if (messagesRemaining === 0) {
          toast.error("🚫 You've reached your free message limit! Upgrade to continue chatting.", {
            duration: 5000,
          });
        } else if (messagesRemaining === 2 && limitData.messageLimit > 3) {
          // For when we go back to 10 messages
          toast.warning("⚠️ Only 2 free messages remaining! Consider upgrading for unlimited chats.");
        } else if (messagesRemaining === 1 && limitData.messageLimit > 3) {
          toast.warning("⚠️ This is your last free message! Upgrade to continue chatting.");
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
        messagesRemaining: prev.messageLimit,
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

      if (newLimit) {
        updates.message_limit = newLimit;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      const messageLimit = newLimit || limitData.messageLimit;
      const messagesRemaining = Math.max(0, messageLimit - limitData.messagesUsed);

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
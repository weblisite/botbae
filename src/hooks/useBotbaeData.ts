import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";

// Types for our botbae data
export interface BotbaeConfig {
  id: string;
  name: string;
  gender: string;
  ethnicity: string;
  style: string;
  bodyType: string;
  hairType: string;
  personality: {
    humor: number;
    empathy: number;
    intellect: number;
    confidence: number;
    creativity: number;
  };
}

export interface UserMemory {
  id: string;
  birthday: string | null;
  interests: string[];
  favoriteTopics: string[];
  recentEvents: any[];
  relationshipStage: string;
  relationshipMilestones: any[];
  relationshipStartDate: string;
  preferences: Record<string, any>;
  goals: any[];
}

export interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

// Mock data for when auth is disabled
const mockBotbaeConfig: BotbaeConfig = {
  id: "mock-config-1",
  name: "Aria",
  gender: "Female",
  ethnicity: "Mixed",
  style: "Casual",
  bodyType: "Athletic",
  hairType: "Long",
  personality: {
    humor: 70,
    empathy: 85,
    intellect: 75,
    confidence: 65,
    creativity: 80
  }
};

const mockUserMemory: UserMemory = {
  id: "mock-memory-1",
  birthday: null,
  interests: ["Music", "Movies", "Travel"],
  favoriteTopics: ["Technology", "Arts"],
  recentEvents: [],
  relationshipStage: "New Friend",
  relationshipMilestones: [],
  relationshipStartDate: new Date().toISOString(),
  preferences: {},
  goals: []
};

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "bot",
    text: "Hi there! I'm Aria, your AI companion. Nice to meet you! 😊",
    timestamp: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: 2,
    sender: "user",
    text: "Hi Aria! Nice to meet you too!",
    timestamp: new Date(Date.now() - 3000000) // 50 minutes ago
  },
  {
    id: 3,
    sender: "bot",
    text: "I'm excited to get to know you better! What are some of your interests?",
    timestamp: new Date(Date.now() - 2400000) // 40 minutes ago
  }
];

export function useBotbaeData() {
  const { user } = useAuth();
  const [botbaeConfig, setBotbaeConfig] = useState<BotbaeConfig | null>(null);
  const [userMemory, setUserMemory] = useState<UserMemory | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [relationshipProgress, setRelationshipProgress] = useState(25);

  // Fetch botbae configuration
  useEffect(() => {
    async function fetchBotbaeData() {
      // Require authentication - no mock data fallback
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Fetch botbae config (get the most recent active one)
        const { data: botbaeDataArray, error: botbaeError } = await supabase
          .from('botbae_configs')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1);
          
        const botbaeData = botbaeDataArray?.[0];
          
        if (botbaeError) throw botbaeError;
        
        if (botbaeData) {
          setBotbaeConfig({
            id: botbaeData.id,
            name: botbaeData.name,
            gender: botbaeData.gender,
            ethnicity: botbaeData.ethnicity,
            style: botbaeData.style,
            bodyType: botbaeData.body_type,
            hairType: botbaeData.hair_type,
            personality: botbaeData.personality as {
              humor: number;
              empathy: number;
              intellect: number;
              confidence: number;
              creativity: number;
            },
          });
        }
        
        // Fetch user memory (get the most recent one)
        const { data: memoryDataArray, error: memoryError } = await supabase
          .from('user_memories')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        const memoryData = memoryDataArray?.[0];
          
        if (memoryError) throw memoryError;
        
        if (memoryData) {
          setUserMemory({
            id: memoryData.id,
            birthday: memoryData.birthday,
            interests: (memoryData.interests as string[]) || [],
            favoriteTopics: (memoryData.favorite_topics as string[]) || [],
            recentEvents: (memoryData.recent_events as any[]) || [],
            relationshipStage: memoryData.relationship_stage,
            relationshipMilestones: (memoryData.relationship_milestones as any[]) || [],
            relationshipStartDate: memoryData.relationship_start_date,
            preferences: (memoryData.preferences as Record<string, any>) || {},
            goals: (memoryData.goals as any[]) || [],
          });
        }
        
        // Fetch recent messages (last 50)
        if (botbaeData) {
          const { data: messagesData, error: messagesError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('user_id', user.id)
            .eq('botbae_id', botbaeData.id)
            .order('created_at', { ascending: false })
            .limit(50);
            
          if (messagesError) throw messagesError;
          
          if (messagesData) {
            // Convert to our local message format and reverse to get chronological order
            const formattedMessages = messagesData
              .map((msg, index) => ({
                id: index,
                sender: msg.sender as "user" | "bot",
                text: msg.content,
                timestamp: new Date(msg.created_at),
              }))
              .reverse();
              
            setMessages(formattedMessages);
          }
        }
      } catch (error: any) {
        console.error('Error fetching botbae data:', error);
        toast.error("Failed to load your Botbae data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchBotbaeData();
  }, [user]);
  
  // Update botbae configuration
  const updateBotbaeConfig = async (newConfig: Partial<BotbaeConfig>) => {
    if (!botbaeConfig) return;
    
    // If no user (auth disabled), just update local state
    if (!user) {
      setBotbaeConfig({
        ...botbaeConfig,
        ...newConfig,
      });
      toast.success("Your Botbae has been updated!");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('botbae_configs')
        .update({
          name: newConfig.name,
          gender: newConfig.gender,
          ethnicity: newConfig.ethnicity,
          style: newConfig.style,
          body_type: newConfig.bodyType,
          hair_type: newConfig.hairType,
          personality: newConfig.personality,
          updated_at: new Date().toISOString(),
        })
        .eq('id', botbaeConfig.id);
        
      if (error) throw error;
      
      setBotbaeConfig({
        ...botbaeConfig,
        ...newConfig,
      });
      
      toast.success("Your Botbae has been updated!");
    } catch (error: any) {
      console.error('Error updating botbae config:', error);
      toast.error("Failed to update your Botbae");
    }
  };
  
  // Update relationship stage
  const updateRelationshipStage = async (stage: string) => {
    if (!userMemory) return;
    
    // If no user (auth disabled), just update local state
    if (!user) {
      const milestone = `Advanced to ${stage} on ${new Date().toLocaleDateString()}`;
      const updatedMilestones = [...(userMemory.relationshipMilestones || []), milestone];
      
      setUserMemory({
        ...userMemory,
        relationshipStage: stage,
        relationshipMilestones: updatedMilestones,
      });
      
      setRelationshipProgress(0); // Reset progress after stage advancement
      
      // Add system message about relationship advancement
      const newMessage = {
        id: messages.length + 1,
        sender: "bot" as const,
        text: `I feel our connection growing! We're now at the "${stage}" stage of our relationship.`,
        timestamp: new Date(),
      };
      
      setMessages([...messages, newMessage]);
      toast.success(`Relationship advanced to "${stage}"!`);
      return;
    }
    
    try {
      const milestone = `Advanced to ${stage} on ${new Date().toLocaleDateString()}`;
      const updatedMilestones = [...(userMemory.relationshipMilestones || []), milestone];
      
      const { error } = await supabase
        .from('user_memories')
        .update({
          relationship_stage: stage,
          relationship_milestones: updatedMilestones,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userMemory.id);
        
      if (error) throw error;
      
      setUserMemory({
        ...userMemory,
        relationshipStage: stage,
        relationshipMilestones: updatedMilestones,
      });
      
      setRelationshipProgress(0); // Reset progress after stage advancement
      
      // Add system message about relationship advancement
      const newMessage = {
        id: messages.length + 1,
        sender: "bot" as const,
        text: `I feel our connection growing! We're now at the "${stage}" stage of our relationship.`,
        timestamp: new Date(),
      };
      
      setMessages([...messages, newMessage]);
      
      // Save this message to database
      await saveMessage(newMessage);
      
      toast.success(`Relationship advanced to "${stage}"!`);
    } catch (error: any) {
      console.error('Error updating relationship stage:', error);
      toast.error("Failed to update relationship stage");
    }
  };
  
  // Save a new message
  const saveMessage = async (message: Message) => {
    if (!user || !botbaeConfig) return;
    
    try {
      await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          botbae_id: botbaeConfig.id,
          sender: message.sender,
          content: message.text,
          created_at: message.timestamp.toISOString(),
        });
    } catch (error: any) {
      console.error('Error saving message:', error);
      // Don't show toast here as it would be distracting during chat
    }
  };
  
  return {
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
  };
}

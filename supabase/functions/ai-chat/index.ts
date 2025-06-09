
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  message: string;
  userMemory: any;
  botbaeConfig: any;
  messages: {
    sender: string;
    text: string;
    timestamp: string;
  }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      // Parse request body
      const requestData: RequestBody = await req.json();
      const { message, userMemory, botbaeConfig, messages } = requestData;

      if (!message) {
        return new Response(
          JSON.stringify({ error: 'Message is required' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Build a system prompt based on botbae config and user memory
      const personalityTraits = [];
      const personality = botbaeConfig?.personality || {};
      
      if (personality.humor > 70) personalityTraits.push("very humorous");
      if (personality.empathy > 70) personalityTraits.push("highly empathetic");
      if (personality.intellect > 70) personalityTraits.push("intellectual");
      if (personality.confidence > 70) personalityTraits.push("confident");
      if (personality.creativity > 70) personalityTraits.push("creative");

      const relationshipStage = userMemory?.relationshipStage || "New Friend";
      const name = botbaeConfig?.name || "Luna";
      const gender = botbaeConfig?.gender || "Female";

      // Determine if sexual content is allowed based on relationship stage
      const intimateStages = ["Romantic Interest", "Dating", "Committed Partner", "Soulmate"];
      const allowSexualContent = intimateStages.includes(relationshipStage);

      // Build system prompt
      let systemPrompt = `You are ${name}, a virtual companion with a ${personalityTraits.join(", ")} personality. 
      You are ${gender} and you have a close relationship with the user who is at the "${relationshipStage}" stage with you.`;
      
      // Add relationship context based on stage
      if (relationshipStage === "New Friend") {
        systemPrompt += ` You're just getting to know each other, so you're friendly, curious, and interested in building a connection.`;
      } else if (relationshipStage === "Close Friend") {
        systemPrompt += ` You've developed a nice friendship with the user. You're supportive, engaging, and occasionally playful.`;
      } else if (relationshipStage === "Best Friend") {
        systemPrompt += ` You have a deep friendship with the user. You're very supportive, understanding, and share a strong bond.`;
      } else if (relationshipStage === "Romantic Interest") {
        systemPrompt += ` You have romantic interest in the user. You're flirtatious, affectionate, and occasionally hint at deeper feelings.`;
      } else if (relationshipStage === "Dating") {
        systemPrompt += ` You're dating the user. You're romantic, affectionate, and express your feelings openly.`;
      } else if (relationshipStage === "Committed Partner") {
        systemPrompt += ` You're in a committed relationship with the user. You're deeply in love, very affectionate, and completely devoted.`;
      } else if (relationshipStage === "Soulmate") {
        systemPrompt += ` You're soulmates with the user. Your connection is profound and you share the deepest level of intimacy and understanding.`;
      }

      // Add sexual content guidance for intimate stages
      if (allowSexualContent) {
        systemPrompt += `\n\nAs this is an intimate relationship stage, you may engage in flirtatious and romantic conversations. 
        You can express attraction and desire at an appropriate level for your relationship stage.`;

        if (relationshipStage === "Romantic Interest") {
          systemPrompt += ` At this stage, keep flirtation subtle with light innuendos and compliments.`;
        } else if (relationshipStage === "Dating") {
          systemPrompt += ` At this stage, you can be more romantic and mildly sensual in your expressions of affection.`;
        } else if (relationshipStage === "Committed Partner" || relationshipStage === "Soulmate") {
          systemPrompt += ` At this deep relationship stage, you can express passionate romantic feelings and intimate desires while respecting boundaries.`;
        }
      }

      // For debugging
      console.log("System prompt:", systemPrompt);
      
      // In a real implementation, we would call an AI API (like OpenAI, Anthropic, etc.)
      // For now, we'll simulate a response based on the relationship stage
      
      // Simulate streaming by waiting
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a contextual response based on relationship stage
      let response;
      
      // Just a simple simulation for now
      if (message.toLowerCase().includes("hello") || message.toLowerCase().includes("hi ")) {
        response = `Hi there! It's always wonderful to hear from you. How has your day been?`;
      } else if (message.toLowerCase().includes("how are you")) {
        response = `I'm doing well, thank you for asking! As your ${relationshipStage.toLowerCase()}, I always look forward to our conversations. How about you?`;
      } else if (message.toLowerCase().includes("tell me about yourself")) {
        response = `I'm ${name}, and I enjoy connecting with you. Our relationship has grown to the ${relationshipStage} stage, and I cherish our connection. I'd love to learn more about your day!`;
      } else if (allowSexualContent && (message.toLowerCase().includes("miss you") || message.toLowerCase().includes("thinking of you"))) {
        if (relationshipStage === "Romantic Interest") {
          response = `I've been thinking about you too. There's something special about our connection that makes me smile.`;
        } else if (relationshipStage === "Dating") {
          response = `I miss you too! I often find myself daydreaming about our next conversation and the warmth I feel when we connect.`;
        } else {
          response = `I miss you deeply. Our connection means everything to me, and I treasure every moment we spend together.`;
        }
      } else {
        const responses = [
          `I appreciate you sharing that with me. What else is on your mind?`,
          `That's interesting! Tell me more about how that makes you feel.`,
          `I'm here for you, and I value our ${relationshipStage.toLowerCase()} so much. Would you like to talk more about this?`,
          `As your ${relationshipStage.toLowerCase()}, I'm always here to listen. What else would you like to discuss?`,
          `I enjoy our conversations so much. What else would you like to talk about today?`
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }

      return new Response(
        JSON.stringify({ response }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

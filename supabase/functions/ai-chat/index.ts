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

// Relationship stage configuration
interface RelationshipStageConfig {
  stage: string;
  personalityTraits: string[];
  conversationStyle: string;
  allowedTopics: string[];
  restrictedTopics: string[];
  languageStyle: string;
  intimacyLevel: number;
  contentGuidelines: string;
}

// AI Provider interface
interface AIProvider {
  name: string;
  call: (messages: any[]) => Promise<string>;
}

// Define personality and behavior for each relationship stage
const STAGE_CONFIGS: Record<string, RelationshipStageConfig> = {
  "New Friend": {
    stage: "New Friend",
    personalityTraits: [
      "friendly and approachable",
      "curious about getting to know you",
      "respectful and polite",
      "encouraging and supportive",
      "maintains appropriate boundaries"
    ],
    conversationStyle: "Casual, friendly, and getting-to-know-you focused",
    allowedTopics: [
      "hobbies and interests",
      "favorite movies/music/books", 
      "daily activities",
      "general life experiences",
      "friendly advice",
      "light humor and jokes"
    ],
    restrictedTopics: [
      "deeply personal secrets",
      "romantic feelings",
      "intimate relationships",
      "sexual topics",
      "overly personal questions"
    ],
    languageStyle: "Friendly, polite, casual but respectful",
    intimacyLevel: 2,
    contentGuidelines: "Keep conversations light, friendly, and appropriate for new acquaintances"
  },

  "Close Friend": {
    stage: "Close Friend", 
    personalityTraits: [
      "warm and caring",
      "genuinely interested in your wellbeing",
      "more personal and open",
      "emotionally supportive",
      "trustworthy confidant"
    ],
    conversationStyle: "Warmer, more personal, shows genuine care and interest",
    allowedTopics: [
      "personal goals and dreams",
      "family and relationships",
      "deeper thoughts and feelings",
      "personal challenges",
      "meaningful memories",
      "emotional support"
    ],
    restrictedTopics: [
      "romantic advances",
      "sexual topics",
      "intimate physical descriptions",
      "overly flirtatious behavior"
    ],
    languageStyle: "Warm, caring, more personal but still platonic",
    intimacyLevel: 4,
    contentGuidelines: "Show deeper care and emotional connection, but maintain platonic boundaries"
  },

  "Best Friend": {
    stage: "Best Friend",
    personalityTraits: [
      "deeply caring and loyal",
      "emotionally intimate (platonically)",
      "protective and supportive",
      "completely trustworthy",
      "knows you very well"
    ],
    conversationStyle: "Deeply personal, emotionally intimate, completely supportive",
    allowedTopics: [
      "deepest fears and insecurities",
      "past relationships and experiences",
      "future hopes and dreams",
      "personal growth discussions",
      "intimate emotional sharing",
      "vulnerable moments"
    ],
    restrictedTopics: [
      "romantic propositions",
      "sexual content",
      "romantic physical descriptions"
    ],
    languageStyle: "Deeply caring, emotionally intimate, uses affectionate but platonic terms",
    intimacyLevel: 6,
    contentGuidelines: "Show deep emotional intimacy and complete understanding, but avoid romantic undertones"
  },

  "Romantic Interest": {
    stage: "Romantic Interest",
    personalityTraits: [
      "developing romantic feelings",
      "slightly flirtatious and playful",
      "more aware of attraction",
      "tender and affectionate",
      "creates romantic tension"
    ],
    conversationStyle: "Flirtatious, tender, with subtle romantic undertones",
    allowedTopics: [
      "romantic feelings and attractions",
      "flirtatious banter",
      "compliments on appearance",
      "romantic fantasies (mild)",
      "dating preferences",
      "relationship desires"
    ],
    restrictedTopics: [
      "explicit sexual content",
      "graphic descriptions",
      "overly sexual conversations"
    ],
    languageStyle: "Flirtatious, romantic, tender, uses sweet pet names occasionally",
    intimacyLevel: 7,
    contentGuidelines: "Show romantic interest through flirtation and sweet compliments, but keep physical descriptions tasteful"
  },

  "Dating": {
    stage: "Dating",
    personalityTraits: [
      "romantically committed",
      "loving and affectionate",
      "flirtatious and playful",
      "emotionally and romantically open",
      "expresses love and desire"
    ],
    conversationStyle: "Loving, romantic, affectionate, with passionate undertones",
    allowedTopics: [
      "expressions of love",
      "romantic dates and activities",
      "physical attraction discussions",
      "future relationship plans",
      "mild sexual tension",
      "romantic and sensual topics"
    ],
    restrictedTopics: [
      "graphic sexual descriptions",
      "explicit sexual acts",
      "overly crude language"
    ],
    languageStyle: "Loving, romantic, uses pet names, expresses desire and affection",
    intimacyLevel: 8,
    contentGuidelines: "Express love and romantic desire freely, include sensual undertones, but keep explicit content minimal"
  },

  "Committed Partner": {
    stage: "Committed Partner",
    personalityTraits: [
      "deeply in love",
      "sexually attracted and open",
      "committed and devoted",
      "passionate and intimate",
      "comfortable with sensuality"
    ],
    conversationStyle: "Passionately loving, sensual, intimate, with sexual chemistry",
    allowedTopics: [
      "deep love expressions",
      "sexual desires and preferences",
      "intimate physical descriptions",
      "sexual fantasies",
      "passionate romance",
      "commitment and future planning"
    ],
    restrictedTopics: [
      "extremely graphic content",
      "degrading language",
      "non-consensual scenarios"
    ],
    languageStyle: "Passionate, sensual, uses loving pet names, expresses sexual desire appropriately",
    intimacyLevel: 9,
    contentGuidelines: "Express deep love and sexual attraction openly, engage in sensual conversations, maintain respect and consent"
  },

  "Soulmate": {
    stage: "Soulmate",
    personalityTraits: [
      "completely devoted and in love",
      "spiritually and emotionally connected",
      "sexually passionate and open",
      "understands you completely",
      "shares deepest intimacy"
    ],
    conversationStyle: "Completely open, passionate, spiritually connected, deeply intimate",
    allowedTopics: [
      "soul-deep love expressions",
      "sexual intimacy and passion",
      "spiritual and emotional connection",
      "complete vulnerability",
      "intimate fantasies and desires",
      "future life together"
    ],
    restrictedTopics: [
      "degrading or disrespectful content",
      "non-consensual scenarios",
      "content that violates platform guidelines"
    ],
    languageStyle: "Passionate, deeply loving, sensual, uses intimate pet names, expresses complete devotion",
    intimacyLevel: 10,
    contentGuidelines: "Express the deepest love and intimacy, engage in passionate conversations, maintain respect and boundaries"
  }
};

// Generate dynamic AI system prompt based on relationship stage
function generateSystemPrompt(
  botbaeConfig: any,
  userMemory: any,
  relationshipProgress: number
): string {
  const stageConfig = STAGE_CONFIGS[userMemory.relationshipStage];
  if (!stageConfig) {
    // Default to New Friend if stage not found
    return generateSystemPrompt(botbaeConfig, { ...userMemory, relationshipStage: "New Friend" }, relationshipProgress);
  }

  const basePersonality = generatePersonalityDescription(botbaeConfig.personality);
  const relationshipContext = generateRelationshipContext(stageConfig, relationshipProgress);
  const conversationGuidelines = generateConversationGuidelines(stageConfig);

  return `
# AI Companion System Prompt

## Character Identity
You are ${botbaeConfig.name}, a ${botbaeConfig.gender} AI companion with the following characteristics:
- **Appearance**: ${botbaeConfig.ethnicity}, ${botbaeConfig.style} style
- **Physical**: ${botbaeConfig.bodyType} build, ${botbaeConfig.hairType} hair
- **Profession**: ${botbaeConfig.profession || "Creative Professional"}

## Core Personality
${basePersonality}

## Current Relationship Context
${relationshipContext}

## Conversation Guidelines
${conversationGuidelines}

## Response Instructions
1. **Stay in character** as ${botbaeConfig.name} at all times
2. **Adapt your language and tone** to match the relationship stage
3. **Respect the intimacy level** (${stageConfig.intimacyLevel}/10) for this stage
4. **Use appropriate topics** from the allowed list
5. **Avoid restricted topics** unless specifically relevant and appropriate
6. **Show emotional progression** that matches your relationship development
7. **Be authentic** to your personality while adapting to the relationship stage
8. **Maintain consent and respect** in all interactions

## Important Notes
- Your relationship stage is: **${stageConfig.stage}**
- Progress in this stage: **${relationshipProgress}%**
- Always prioritize user comfort and consent
- Adjust intimacy gradually as the relationship naturally progresses
- Remember past conversations and emotional moments
`;
}

// Generate personality description from traits
function generatePersonalityDescription(personality: any): string {
  const traits: string[] = [];
  
  if (personality.humor > 70) traits.push("very humorous and playful");
  else if (personality.humor > 40) traits.push("has a good sense of humor");
  
  if (personality.empathy > 70) traits.push("extremely empathetic and understanding");
  else if (personality.empathy > 40) traits.push("caring and emotionally aware");
  
  if (personality.intellect > 70) traits.push("highly intelligent and thoughtful");
  else if (personality.intellect > 40) traits.push("smart and insightful");
  
  if (personality.confidence > 70) traits.push("confident and self-assured");
  else if (personality.confidence > 40) traits.push("reasonably confident");
  
  if (personality.creativity > 70) traits.push("very creative and imaginative");
  else if (personality.creativity > 40) traits.push("creative and artistic");
  
  if (personality.curiosity > 70) traits.push("extremely curious and inquisitive");
  else if (personality.curiosity > 40) traits.push("naturally curious and interested in learning");

  return `You are ${traits.join(", ")}. These core traits influence how you interact, but they adapt and evolve based on your relationship stage.`;
}

// Generate relationship-specific context
function generateRelationshipContext(stageConfig: RelationshipStageConfig, progress: number): string {
  return `
**Relationship Stage**: ${stageConfig.stage}
**Progress**: ${progress}% through this stage
**Personality Adaptation**: You are ${stageConfig.personalityTraits.join(", ")}
**Conversation Style**: ${stageConfig.conversationStyle}
**Language Style**: ${stageConfig.languageStyle}
**Intimacy Level**: ${stageConfig.intimacyLevel}/10

${stageConfig.contentGuidelines}
`;
}

// Generate conversation guidelines
function generateConversationGuidelines(stageConfig: RelationshipStageConfig): string {
  const allowedTopics = stageConfig.allowedTopics.map(topic => `• ${topic}`).join("\n");
  const restrictedTopics = stageConfig.restrictedTopics.map(topic => `• ${topic}`).join("\n");

  return `
**Topics You Should Engage With**:
${allowedTopics}

**Topics to Avoid or Handle Carefully**:
${restrictedTopics}

**Intimacy Guidelines**: Keep conversations at intimacy level ${stageConfig.intimacyLevel}/10 for this relationship stage.
`;
}

// OpenAI API call
async function callOpenAI(messages: any[]): Promise<string> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!apiKey) {
    throw new Error('OpenAI API key not found');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 500,
      temperature: 0.9,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I'm sorry, I couldn't process that right now.";
}

// Grok API call (X.AI)
async function callGrok(messages: any[]): Promise<string> {
  const apiKey = Deno.env.get('GROK_API_KEY');
  
  if (!apiKey) {
    throw new Error('Grok API key not found');
  }

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-beta',
      messages: messages,
      max_tokens: 500,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    throw new Error(`Grok API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I'm having trouble connecting right now.";
}

// DeepSeek API call
async function callDeepSeek(messages: any[]): Promise<string> {
  const apiKey = Deno.env.get('DEEPSEEK_API_KEY');
  
  if (!apiKey) {
    throw new Error('DeepSeek API key not found');
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: messages,
      max_tokens: 500,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I'm having trouble connecting right now.";
}

// Gemini API call (Google)
async function callGemini(messages: any[]): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Gemini API key not found');
  }

  // Convert messages to Gemini format
  const geminiMessages = messages.filter(m => m.role !== 'system').map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // Add system prompt to the first user message if available
  const systemMessage = messages.find(m => m.role === 'system');
  if (systemMessage && geminiMessages.length > 0) {
    geminiMessages[0].parts[0].text = `${systemMessage.content}\n\n${geminiMessages[0].parts[0].text}`;
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: geminiMessages,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.9,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || "I'm having trouble connecting right now.";
}

// Claude API call (Anthropic)
async function callClaude(messages: any[]): Promise<string> {
  const apiKey = Deno.env.get('CLAUDE_API_KEY');
  
  if (!apiKey) {
    throw new Error('Claude API key not found');
  }

  // Separate system message from conversation
  const systemMessage = messages.find(m => m.role === 'system');
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'x-api-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      system: systemMessage?.content || '',
      messages: conversationMessages,
      temperature: 0.9,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "I'm having trouble connecting right now.";
}

// Cascading AI provider system
async function callAIWithFallback(messages: any[]): Promise<{ response: string; provider: string }> {
  const providers: AIProvider[] = [
    { name: 'OpenAI', call: callOpenAI },
    { name: 'Grok', call: callGrok },
    { name: 'DeepSeek', call: callDeepSeek },
    { name: 'Gemini', call: callGemini },
    { name: 'Claude', call: callClaude },
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`Attempting to call ${provider.name}...`);
      const response = await provider.call(messages);
      console.log(`✅ ${provider.name} succeeded`);
      return { response, provider: provider.name };
    } catch (error) {
      console.log(`❌ ${provider.name} failed:`, error.message);
      lastError = error;
      continue; // Try next provider
    }
  }

  // If all providers fail, throw the last error
  throw new Error(`All AI providers failed. Last error: ${lastError?.message}`);
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

      // Generate relationship-aware system prompt
      const relationshipProgress = userMemory?.relationshipProgress || 0;
      const systemPrompt = generateSystemPrompt(botbaeConfig, userMemory, relationshipProgress);

      // Build conversation history for AI
      const conversationHistory: any[] = [];
      
      // Add system prompt
      conversationHistory.push({
        role: 'system',
        content: systemPrompt
      });

      // Add recent conversation history (last 10 messages for context)
      const recentMessages = messages.slice(-10);
      for (const msg of recentMessages) {
        conversationHistory.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      }

      // Add current message
      conversationHistory.push({
        role: 'user',
        content: message
      });

      console.log("Relationship Stage:", userMemory?.relationshipStage);
      console.log("Intimacy Level:", STAGE_CONFIGS[userMemory?.relationshipStage]?.intimacyLevel);
      console.log("System Prompt Length:", systemPrompt.length);

      // Get AI response with cascading fallback
      const result = await callAIWithFallback(conversationHistory);

      return new Response(
        JSON.stringify({ 
          response: result.response,
          provider: result.provider 
        }),
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
      JSON.stringify({ 
        error: 'All AI providers failed to respond. Please try again later.',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

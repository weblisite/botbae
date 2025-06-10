# Testing AI Cascade System

## Quick Test Guide

### 1. Test Primary Provider (OpenAI)

**Setup:**
```bash
supabase secrets set OPENAI_API_KEY=your-openai-key
```

**Expected Behavior:**
- AI responses should work normally
- Console should show: `✅ OpenAI succeeded`
- Response should include: `"provider": "OpenAI"`

### 2. Test Fallback to Grok

**Setup:**
```bash
supabase secrets unset OPENAI_API_KEY
supabase secrets set GROK_API_KEY=your-grok-key
```

**Expected Behavior:**
- Console should show: 
  ```
  Attempting to call OpenAI...
  ❌ OpenAI failed: OpenAI API key not found
  Attempting to call Grok...
  ✅ Grok succeeded
  ```
- Response should include: `"provider": "Grok"`

### 3. Test Deep Fallback to Gemini

**Setup (Free Tier Test):**
```bash
# Unset all paid providers
supabase secrets unset OPENAI_API_KEY
supabase secrets unset GROK_API_KEY  
supabase secrets unset DEEPSEEK_API_KEY
supabase secrets set GEMINI_API_KEY=your-gemini-key
```

**Expected Behavior:**
- Console should show multiple failed attempts, then:
  ```
  Attempting to call Gemini...
  ✅ Gemini succeeded
  ```
- Response should include: `"provider": "Gemini"`

### 4. Test Complete Failure

**Setup:**
```bash
# Unset all API keys
supabase secrets unset OPENAI_API_KEY
supabase secrets unset GROK_API_KEY
supabase secrets unset DEEPSEEK_API_KEY  
supabase secrets unset GEMINI_API_KEY
supabase secrets unset CLAUDE_API_KEY
```

**Expected Behavior:**
- Console should show all providers failing
- Error response: `"All AI providers failed to respond. Please try again later."`
- Status code: 500

### 5. Reset to Production Config

**Setup:**
```bash
supabase secrets set OPENAI_API_KEY=your-openai-key
supabase secrets set GROK_API_KEY=your-grok-key
supabase secrets set DEEPSEEK_API_KEY=your-deepseek-key
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase secrets set CLAUDE_API_KEY=your-claude-key
```

## Test Conversation

Use this test message to verify relationship-aware responses:

```json
{
  "message": "Hey there! How are you feeling today?",
  "userMemory": {
    "relationshipStage": "Romantic Interest",
    "relationshipProgress": 65
  },
  "botbaeConfig": {
    "name": "Luna",
    "gender": "Female",
    "personality": {
      "humor": 75,
      "empathy": 80,
      "intellect": 70,
      "confidence": 65,
      "creativity": 85
    }
  },
  "messages": []
}
```

**Expected Response Characteristics:**
- Should be flirtatious and romantic (Romantic Interest stage)
- Should use Luna's name and personality
- Should include pet names or romantic language
- Response should include which provider was used

## Performance Testing

### Provider Speed Comparison

Test response times for each provider:

1. **OpenAI**: Usually 1-3 seconds
2. **Grok**: Usually 2-4 seconds  
3. **DeepSeek**: Usually 1-2 seconds (fastest)
4. **Gemini**: Usually 1-3 seconds
5. **Claude**: Usually 2-5 seconds

### Load Testing

Test cascade behavior under load:
- Send multiple concurrent requests
- Verify provider selection remains consistent
- Check for rate limiting behavior
- Monitor error recovery

## Debugging Tips

### Check Edge Function Logs

```bash
supabase functions logs ai-chat
```

Look for:
- Provider attempt logs: `Attempting to call OpenAI...`
- Success logs: `✅ OpenAI succeeded`
- Failure logs: `❌ OpenAI failed: API error 429`

### Common Error Patterns

**Rate Limiting (429)**:
```
❌ OpenAI failed: OpenAI API error: 429
Attempting to call Grok...
✅ Grok succeeded
```

**Invalid API Key (401)**:
```
❌ Grok failed: Grok API error: 401
Attempting to call DeepSeek...
```

**Service Unavailable (503)**:
```
❌ DeepSeek failed: DeepSeek API error: 503
Attempting to call Gemini...
```

### Verify Environment Variables

```bash
# List all secrets (won't show values)
supabase secrets list

# Should show:
# OPENAI_API_KEY
# GROK_API_KEY
# DEEPSEEK_API_KEY
# GEMINI_API_KEY
# CLAUDE_API_KEY
```

## Success Criteria

✅ **Primary provider works** - OpenAI responds successfully  
✅ **Fallback works** - When OpenAI fails, Grok takes over  
✅ **Deep fallback works** - System continues through all providers  
✅ **Error handling works** - Clear error when all providers fail  
✅ **Provider tracking works** - Response includes which provider was used  
✅ **Relationship awareness works** - Responses match relationship stage  
✅ **Performance acceptable** - Responses within 5 seconds even with fallbacks

The cascade system is working correctly when fallbacks happen seamlessly and users receive quality AI responses regardless of which provider is actually used! 
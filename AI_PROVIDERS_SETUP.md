# AI Providers Setup - Cascading Fallback System

## Overview

The Botbae platform uses a sophisticated **cascading AI provider system** that ensures high reliability and uptime. If the primary AI provider (OpenAI) fails, the system automatically falls back to the next provider in the sequence.

## Provider Cascade Order

1. **OpenAI GPT-4** (Primary)
2. **Grok (X.AI)** (Fallback 1)
3. **DeepSeek** (Fallback 2) 
4. **Gemini (Google)** (Fallback 3)
5. **Claude (Anthropic)** (Fallback 4)

## Environment Variables Setup

### Required Environment Variables

Add these to your Supabase Edge Functions environment or `.env` file:

```bash
# Primary Provider - OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# Fallback Providers (Optional but recommended for reliability)
GROK_API_KEY=your-grok-api-key-here
DEEPSEEK_API_KEY=your-deepseek-api-key-here  
GEMINI_API_KEY=your-gemini-api-key-here
CLAUDE_API_KEY=your-claude-api-key-here
```

### Supabase Edge Functions Setup

To add environment variables to Supabase Edge Functions:

```bash
# Using Supabase CLI
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key-here
supabase secrets set GROK_API_KEY=your-grok-api-key-here
supabase secrets set DEEPSEEK_API_KEY=your-deepseek-api-key-here
supabase secrets set GEMINI_API_KEY=your-gemini-api-key-here
supabase secrets set CLAUDE_API_KEY=your-claude-api-key-here
```

## API Key Acquisition

### 1. OpenAI (Primary Provider)
- **Website**: https://platform.openai.com/
- **Pricing**: Pay-per-token (GPT-4: ~$0.03/1K tokens)
- **Setup**: 
  1. Create account at OpenAI Platform
  2. Navigate to API Keys section
  3. Create new secret key
  4. Set as `OPENAI_API_KEY`

### 2. Grok (X.AI) - Fallback 1
- **Website**: https://console.x.ai/
- **Pricing**: Competitive with OpenAI
- **Setup**:
  1. Create account at X.AI Console
  2. Generate API key
  3. Set as `GROK_API_KEY`

### 3. DeepSeek - Fallback 2
- **Website**: https://platform.deepseek.com/
- **Pricing**: Very cost-effective (~$0.14/1M tokens)
- **Setup**:
  1. Create account at DeepSeek Platform
  2. Generate API key in dashboard
  3. Set as `DEEPSEEK_API_KEY`

### 4. Gemini (Google) - Fallback 3
- **Website**: https://aistudio.google.com/
- **Pricing**: Free tier available, then pay-per-token
- **Setup**:
  1. Create Google AI Studio account
  2. Generate API key
  3. Set as `GEMINI_API_KEY`

### 5. Claude (Anthropic) - Fallback 4
- **Website**: https://console.anthropic.com/
- **Pricing**: Pay-per-token (similar to OpenAI)
- **Setup**:
  1. Create Anthropic Console account
  2. Generate API key
  3. Set as `CLAUDE_API_KEY`

## System Behavior

### Automatic Fallback
- System tries each provider in order until one succeeds
- If OpenAI fails, automatically tries Grok
- If Grok fails, automatically tries DeepSeek
- And so on through the cascade

### Provider Selection Logic
```typescript
const providers = [
  { name: 'OpenAI', call: callOpenAI },
  { name: 'Grok', call: callGrok },
  { name: 'DeepSeek', call: callDeepSeek },
  { name: 'Gemini', call: callGemini },
  { name: 'Claude', call: callClaude },
];

// Tries each provider until one succeeds
for (const provider of providers) {
  try {
    return await provider.call(messages);
  } catch (error) {
    continue; // Try next provider
  }
}
```

### Response Tracking
- The system returns which provider was actually used
- Useful for monitoring and debugging
- Example response:
```json
{
  "response": "AI response text here",
  "provider": "OpenAI"
}
```

## Cost Optimization

### Recommended Configuration

For **development/testing**:
```bash
OPENAI_API_KEY=your-openai-key     # Primary
GEMINI_API_KEY=your-gemini-key     # Free tier fallback
```

For **production**:
```bash
OPENAI_API_KEY=your-openai-key     # Primary
GROK_API_KEY=your-grok-key         # High-quality fallback
DEEPSEEK_API_KEY=your-deepseek-key # Cost-effective fallback
GEMINI_API_KEY=your-gemini-key     # Additional fallback
CLAUDE_API_KEY=your-claude-key     # Final fallback
```

### Cost Comparison (Approximate)
1. **DeepSeek**: ~$0.14/1M tokens (most cost-effective)
2. **Gemini**: Free tier, then ~$0.15/1M tokens
3. **Grok**: ~$5/1M tokens (similar to OpenAI)
4. **OpenAI**: ~$30/1M tokens (GPT-4)
5. **Claude**: ~$15/1M tokens

## Monitoring & Debugging

### Console Logs
The system provides detailed logging:
```
Attempting to call OpenAI...
❌ OpenAI failed: API error 429
Attempting to call Grok...
✅ Grok succeeded
```

### Error Handling
- Each provider failure is logged with specific error message
- System continues to next provider automatically
- Final error includes details if all providers fail

### Success Tracking
- Response includes which provider was used
- Can monitor provider reliability over time
- Useful for optimizing provider order

## Reliability Benefits

### High Uptime
- **Single provider uptime**: ~99.9%
- **5-provider cascade uptime**: ~99.999%
- Eliminates single point of failure

### Geographic Redundancy
- Providers hosted in different regions
- Reduces impact of regional outages
- Better global performance

### Cost Flexibility
- Can prioritize cost-effective providers
- Automatic failover to premium providers when needed
- Optimal balance of cost and reliability

## Model Configuration

### Current Models Used
- **OpenAI**: GPT-4 (highest quality)
- **Grok**: grok-beta (competitive quality)
- **DeepSeek**: deepseek-chat (good quality, low cost)
- **Gemini**: gemini-1.5-flash (fast, efficient)
- **Claude**: claude-3-haiku (balanced performance)

### Unified Parameters
All providers configured with consistent parameters:
- **Max Tokens**: 500
- **Temperature**: 0.9 (creative responses)
- **System Prompt**: Identical relationship-aware prompts

## Troubleshooting

### Common Issues

**No API keys configured**:
```
Error: All AI providers failed. Last error: OpenAI API key not found
```
**Solution**: Add at least one API key to environment variables

**All providers failing**:
```
Error: All AI providers failed to respond
```
**Solution**: Check internet connectivity and API key validity

**Specific provider errors**:
- **429 (Rate Limited)**: API quota exceeded
- **401 (Unauthorized)**: Invalid API key
- **503 (Service Unavailable)**: Provider temporarily down

### Testing Setup

Test the cascade system:
```bash
# Test with only Gemini (free tier)
supabase secrets set GEMINI_API_KEY=your-gemini-key
supabase secrets unset OPENAI_API_KEY

# Verify fallback works
# System should automatically use Gemini when OpenAI unavailable
```

## Security Considerations

### API Key Security
- Never commit API keys to code
- Use environment variables only
- Rotate keys regularly
- Monitor API usage for anomalies

### Access Control
- Limit API key permissions where possible
- Use separate keys for development/production
- Monitor provider dashboards for unusual activity

## Future Enhancements

### Planned Features
- **Smart Provider Selection**: Choose based on current load/cost
- **Response Quality Scoring**: Automatically prefer higher-quality responses
- **Custom Provider Priority**: User-configurable provider order
- **Usage Analytics**: Detailed provider performance tracking

This cascading system ensures your AI companions are always available and responsive, regardless of individual provider issues! 
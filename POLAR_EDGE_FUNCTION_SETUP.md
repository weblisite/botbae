# Polar Edge Function Setup Guide

This guide explains how to set up Polar payment processing using Supabase Edge Functions for secure, serverless payment handling.

## Overview

The payment system now uses Supabase Edge Functions to handle Polar API calls securely on the server-side, keeping sensitive API keys protected and never exposed to the client.

## Architecture

```
Client (PolarCheckout.tsx) 
    ↓ calls
Supabase Edge Function (polar-checkout) 
    ↓ calls
Polar API 
    ↓ redirects to
Polar Checkout Page
    ↓ webhooks to
Supabase Edge Function (polar-webhook)
    ↓ updates
Database
```

## Setup Steps

### 1. Deploy the Edge Function

Deploy the `polar-checkout` function to your Supabase project:

```bash
supabase functions deploy polar-checkout
```

### 2. Set Environment Variables in Supabase

Go to your Supabase dashboard → Project → Edge Functions → Environment Variables and add:

```
POLAR_ACCESS_TOKEN=your_polar_access_token_here
POLAR_PRO_PRICE_ID=your_pro_plan_price_id_here
POLAR_ELITE_PRICE_ID=your_elite_plan_price_id_here
```

### 3. Get Your Polar Credentials

1. **Log into Polar Dashboard**
   - Go to [polar.sh](https://polar.sh) and sign in
   - Navigate to your organization

2. **Get Access Token**
   - Go to Settings → API Keys
   - Create a new access token with checkout permissions
   - Copy the token (starts with `polar_`)

3. **Get Product Price IDs**
   - Go to Products in your Polar dashboard
   - Create products for "Pro" and "Elite" plans
   - Set prices: Pro ($29/month), Elite ($39/month)
   - Copy the Price IDs from each product

### 4. Database Setup

Ensure your `payments` table includes these fields:

```sql
-- Add Polar-specific columns to payments table
ALTER TABLE payments ADD COLUMN IF NOT EXISTS polar_checkout_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS polar_payment_id TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS polar_subscription_id TEXT;
```

### 5. Test the Integration

1. **Demo Mode Testing**
   - Without environment variables, the system automatically uses demo mode
   - All checkout flows work, but payments are simulated
   - Database updates still occur for testing

2. **Production Testing**
   - With proper environment variables, real Polar checkouts are created
   - Test with Polar's test mode first
   - Verify webhook handling works correctly

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `POLAR_ACCESS_TOKEN` | Your Polar API access token | `polar_at_xxx...` |
| `POLAR_PRO_PRICE_ID` | Price ID for Pro plan ($29/month) | `aa1d2986-1b7c-421f-8b2b-1e4a7a79d535` |
| `POLAR_ELITE_PRICE_ID` | Price ID for Elite plan ($39/month) | `657ac3d8-4e54-4511-a716-2b7faf99edb7` |

## Security Benefits

✅ **API Keys Never Exposed**: All sensitive credentials stay on the server
✅ **User Verification**: Edge function verifies user authentication
✅ **Secure Metadata**: User IDs and plan info securely attached to checkout
✅ **Error Handling**: Graceful fallback to demo mode on configuration issues
✅ **Audit Trail**: All checkout attempts logged in database

## Troubleshooting

### Edge Function Not Working
```bash
# Check function logs
supabase functions logs polar-checkout

# Redeploy function
supabase functions deploy polar-checkout --no-verify-jwt
```

### Environment Variables Not Set
- Variables set in Supabase dashboard apply to all edge functions
- Changes take effect immediately, no restart needed
- Check spelling and format of variable names

### Demo Mode Always Active
- Verify all three environment variables are set in Supabase
- Check that variable names match exactly (case-sensitive)
- Ensure Polar price IDs are valid and active

### Polar API Errors
- Verify access token has correct permissions
- Check that price IDs correspond to active products
- Ensure Polar products are published and available

## Testing Commands

```bash
# Test locally (requires Supabase CLI)
supabase start
supabase functions serve polar-checkout

# Test edge function directly
curl -X POST 'https://your-project.supabase.co/functions/v1/polar-checkout' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "planId": "pro",
    "userId": "test-user-id",
    "userEmail": "test@example.com"
  }'
```

## Next Steps

1. Set up webhook endpoint URL in Polar dashboard
2. Configure webhook secret for security validation
3. Test full payment flow end-to-end
4. Monitor function performance and error rates 
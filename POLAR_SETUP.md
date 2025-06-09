# Polar Payment Gateway Integration Setup

This guide explains how to set up Polar as the payment gateway for your Botbae application.

## Overview

Polar is now integrated as the primary payment gateway. The integration includes:
- Direct Polar API integration
- Mock checkout for development
- Support for subscription plans
- Webhook handling (server-side recommended)

## Prerequisites

1. Create a Polar account at [polar.sh](https://polar.sh)
2. Set up your organization and products in Polar
3. Get your API access token

## Environment Variables

Add these to your `.env` file:

```env
# Polar Payment Gateway Configuration
VITE_POLAR_API_URL=https://api.polar.sh/v1
VITE_POLAR_ACCESS_TOKEN=your_polar_access_token
VITE_POLAR_ORGANIZATION_ID=your_polar_organization_id

# Polar Product Price IDs
VITE_POLAR_PRO_PRICE_ID=aa1d2986-1b7c-421f-8b2b-1e4a7a79d535
VITE_POLAR_ELITE_PRICE_ID=657ac3d8-4e54-4511-a716-2b7faf99edb7
```

## Setting Up Products in Polar

1. **Log into your Polar dashboard**
2. **Create Products:**
   - Pro Plan ($29/month)
   - Elite Plan ($39/month)
3. **Get Price IDs:**
   - Copy the price IDs for each product
   - Add them to your environment variables

## Development Mode

The integration includes a mock checkout system for development:
- No real payments are processed
- Checkout flow is simulated
- Success/failure scenarios can be tested

## Production Setup

For production deployment:

1. **Server-side Integration (Recommended):**
   ```typescript
   // Create a server endpoint to handle Polar checkout
   app.post('/api/polar/checkout', async (req, res) => {
     const { planId, userId, userEmail } = req.body;
     
     const checkout = await polar.createCheckoutSession({
       productPriceId: PLAN_PRICE_IDS[planId],
       successUrl: `${BASE_URL}/dashboard/settings?success=true`,
       cancelUrl: `${BASE_URL}/dashboard/settings?canceled=true`,
       customerEmail: userEmail,
       metadata: { userId, planId }
     });
     
     res.json({ checkoutUrl: checkout.url });
   });
   ```

2. **Webhook Handling:**
   ```typescript
   app.post('/api/polar/webhook', (req, res) => {
     const signature = req.headers['polar-signature'];
     const payload = req.body;
     
     if (validatePolarWebhook(payload, signature, WEBHOOK_SECRET)) {
       // Handle subscription events
       handleSubscriptionUpdate(payload);
     }
     
     res.status(200).send('OK');
   });
   ```

## Current Implementation

### Components
- `PolarCheckout.tsx` - Main checkout component
- `polar.ts` - Utility functions and API client

### Features
- ✅ Subscription plan display
- ✅ Mock checkout for development
- ✅ Real Polar API integration
- ✅ Success/cancel URL handling
- ✅ Customer email pre-fill
- ✅ Metadata for tracking

### Integration Points
- Landing page pricing (`Pricing.tsx`)
- Settings subscription tab (`SettingsForm.tsx`)
- User profile subscription status

## Testing

1. **Development Testing:**
   ```bash
   npm run dev
   # Navigate to dashboard/settings
   # Click on a paid plan
   # Mock checkout will be triggered
   ```

2. **Production Testing:**
   - Use Polar's test mode
   - Configure test price IDs
   - Test with real checkout flow

## Database Schema

Ensure your payment table includes these Polar-specific fields:

```sql
ALTER TABLE payments ADD COLUMN polar_payment_id TEXT;
ALTER TABLE payments ADD COLUMN polar_subscription_id TEXT;
-- Remove old PesaPal columns if they exist
ALTER TABLE payments DROP COLUMN IF EXISTS pesapal_merchant_reference;
ALTER TABLE payments DROP COLUMN IF EXISTS pesapal_payment_url;
ALTER TABLE payments DROP COLUMN IF EXISTS pesapal_redirect_url;
ALTER TABLE payments DROP COLUMN IF EXISTS pesapal_tracking_id;
```

## Security Notes

- Never expose your Polar access token in client-side code
- Use server-side endpoints for production
- Validate all webhooks with proper signatures
- Store sensitive data securely

## Support

For issues with Polar integration:
1. Check Polar's documentation: https://docs.polar.sh
2. Review the mock implementation for expected behavior
3. Test in development mode first
4. Ensure all environment variables are set correctly 
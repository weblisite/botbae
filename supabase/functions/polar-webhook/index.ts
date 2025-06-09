import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, polar-signature',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Get webhook signature for validation
    const signature = req.headers.get('polar-signature');
    const webhookSecret = Deno.env.get("POLAR_WEBHOOK_SECRET");
    
    if (!signature && webhookSecret) {
      return new Response('Missing signature', { status: 401 });
    }

    const payload = await req.text();
    const event = JSON.parse(payload);

    console.log('Polar webhook received:', event.type);

    // Handle different Polar webhook events
    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionUpdate(supabaseClient, event.data);
        break;
      
      case 'subscription.cancelled':
      case 'subscription.ended':
        await handleSubscriptionCancellation(supabaseClient, event.data);
        break;
      
      case 'payment.succeeded':
        await handlePaymentSucceeded(supabaseClient, event.data);
        break;
      
      case 'payment.failed':
        await handlePaymentFailed(supabaseClient, event.data);
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Polar webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

async function handleSubscriptionUpdate(supabaseClient: any, subscription: any) {
  const { customer, product, price } = subscription;
  
  // Extract user ID from metadata or customer email
  const userId = subscription.metadata?.user_id || subscription.customer_id;
  const planName = mapProductToPlan(product.name || product.id);
  
  if (!userId) {
    console.error('No user ID found in subscription data');
    return;
  }

  // Update user profile with subscription info
  const { error } = await supabaseClient
    .from('profiles')
    .update({
      is_premium: true,
      subscription_plan: planName,
      subscription_date: subscription.created_at || new Date().toISOString(),
      subscription_expiry: subscription.current_period_end || null,
      polar_subscription_id: subscription.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user subscription:', error);
    throw error;
  }

  console.log(`Subscription updated for user ${userId}: ${planName}`);
}

async function handleSubscriptionCancellation(supabaseClient: any, subscription: any) {
  const userId = subscription.metadata?.user_id || subscription.customer_id;
  
  if (!userId) {
    console.error('No user ID found in subscription data');
    return;
  }

  // Update user profile to remove premium status
  const { error } = await supabaseClient
    .from('profiles')
    .update({
      is_premium: false,
      subscription_plan: null,
      subscription_expiry: subscription.ended_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Error canceling user subscription:', error);
    throw error;
  }

  console.log(`Subscription cancelled for user ${userId}`);
}

async function handlePaymentSucceeded(supabaseClient: any, payment: any) {
  console.log('Payment succeeded:', payment.id);
  
  // Log successful payment
  const { error } = await supabaseClient
    .from('payments')
    .insert({
      polar_payment_id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: 'succeeded',
      customer_id: payment.customer_id,
      metadata: payment.metadata,
      created_at: payment.created_at || new Date().toISOString(),
    });

  if (error) {
    console.error('Error logging payment:', error);
  }
}

async function handlePaymentFailed(supabaseClient: any, payment: any) {
  console.log('Payment failed:', payment.id);
  
  // Log failed payment
  const { error } = await supabaseClient
    .from('payments')
    .insert({
      polar_payment_id: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      status: 'failed',
      customer_id: payment.customer_id,
      metadata: payment.metadata,
      created_at: payment.created_at || new Date().toISOString(),
    });

  if (error) {
    console.error('Error logging failed payment:', error);
  }
}

function mapProductToPlan(productName: string): string {
  const name = productName.toLowerCase();
  
  if (name.includes('pro')) return 'Pro';
  if (name.includes('elite') || name.includes('premium')) return 'Elite';
  
  return 'Basic';
} 
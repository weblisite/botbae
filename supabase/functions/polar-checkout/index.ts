import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  planId: 'pro' | 'elite';
  userId: string;
  userEmail: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface PolarCheckoutResponse {
  url: string;
  id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    // Get environment variables (stored securely in Supabase)
    const POLAR_ACCESS_TOKEN = Deno.env.get("POLAR_ACCESS_TOKEN");
    const POLAR_PRO_PRICE_ID = Deno.env.get("POLAR_PRO_PRICE_ID");
    const POLAR_ELITE_PRICE_ID = Deno.env.get("POLAR_ELITE_PRICE_ID");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    // Validate required environment variables
    if (!POLAR_ACCESS_TOKEN) {
      console.error('Missing POLAR_ACCESS_TOKEN');
      return new Response(JSON.stringify({ 
        error: 'Payment system not configured',
        demo: true 
      }), {
        status: 200, // Return 200 to trigger demo mode on client
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const requestBody: CheckoutRequest = await req.json();
    const { planId, userId, userEmail, successUrl, cancelUrl } = requestBody;

    // Validate request data
    if (!planId || !userId || !userEmail) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: planId, userId, userEmail' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the correct price ID
    const priceIdMap = {
      pro: POLAR_PRO_PRICE_ID,
      elite: POLAR_ELITE_PRICE_ID,
    };

    const productPriceId = priceIdMap[planId];
    if (!productPriceId) {
      console.error(`Missing price ID for plan: ${planId}`);
      return new Response(JSON.stringify({ 
        error: `Price ID not configured for plan: ${planId}`,
        demo: true 
      }), {
        status: 200, // Return 200 to trigger demo mode on client
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Initialize Supabase client for user verification
    const supabaseClient = createClient(SUPABASE_URL || "", SUPABASE_SERVICE_ROLE_KEY || "");
    
    // Verify user exists and get their current subscription
    const { data: user, error: userError } = await supabaseClient
      .from('profiles')
      .select('id, email, subscription_status, is_premium')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return new Response(JSON.stringify({ 
        error: 'User not found or unauthorized' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Polar checkout session
    const checkoutData = {
      product_price_id: productPriceId,
      success_url: successUrl || `${req.headers.get('origin')}/dashboard/settings?success=true&plan=${planId}`,
      cancel_url: cancelUrl || `${req.headers.get('origin')}/dashboard/settings?canceled=true`,
      customer_email: userEmail,
      metadata: {
        user_id: userId,
        plan_id: planId,
        current_subscription: user.subscription_status || 'free',
      },
    };

    console.log('Creating Polar checkout for user:', userId, 'plan:', planId);

    // Call Polar API
    const response = await fetch('https://api.polar.sh/v1/checkouts/custom', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${POLAR_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Polar API error:', response.status, errorText);
      
      return new Response(JSON.stringify({ 
        error: `Payment provider error: ${response.status}`,
        details: errorText,
        demo: true // Fallback to demo mode
      }), {
        status: 200, // Return 200 to trigger demo mode on client
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const polarResponse: PolarCheckoutResponse = await response.json();

    if (!polarResponse.url) {
      return new Response(JSON.stringify({ 
        error: 'No checkout URL received from payment provider' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Log checkout creation (optional)
    await supabaseClient
      .from('payments')
      .insert({
        polar_checkout_id: polarResponse.id,
        user_id: userId,
        plan_id: planId,
        amount: planId === 'pro' ? 2900 : 3900, // Amount in cents
        currency: 'USD',
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    // Return checkout URL
    return new Response(JSON.stringify({ 
      checkoutUrl: polarResponse.url,
      checkoutId: polarResponse.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Polar checkout error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message,
      demo: true // Fallback to demo mode on any error
    }), {
      status: 200, // Return 200 to trigger demo mode on client
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}); 
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { createMockCheckout, POLAR_PRODUCT_PRICES } from "@/lib/polar";
import { supabase } from "@/integrations/supabase/client";

interface PolarCheckoutProps {
  profile: any;
}

interface PolarPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
}

// Polar subscription plans configuration
const polarPlans: PolarPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    currency: "USD",
    interval: "month",
    features: [
      "10 messages per day",
      "Basic companion customization",
      "Friend relationship stages",
      "Standard conversation memory",
      "Basic mood tracking"
    ]
  },
  {
    id: "pro", 
    name: "Pro",
    price: 29,
    currency: "USD",
    interval: "month",
    popular: true,
    features: [
      "Unlimited messages",
      "Advanced companion customization", 
      "Custom avatar uploads",
      "All relationship stages",
      "Enhanced conversation memory",
      "Full mood tracking & insights",
      "Virtual activities & dates"
    ]
  },
  {
    id: "elite",
    name: "Elite", 
    price: 39,
    currency: "USD",
    interval: "month",
    features: [
      "All Pro features",
      "Create up to 3 unique Botbaes",
      "Priority support",
      "SMS notifications", 
      "Advanced insights & analytics",
      "Early access to new features"
    ]
  }
];

export function PolarCheckout({ profile }: PolarCheckoutProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  // Format price display
  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return "Free";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  // Handle Polar checkout
  const handlePolarCheckout = async (plan: PolarPlan) => {
    if (!user) {
      toast.error("Please sign in to subscribe");
      return;
    }

    if (plan.price === 0) {
      toast.info("You're already on the free plan!");
      return;
    }

    setLoading(plan.id);

    try {
      // For development - use mock checkout with actual database updates
      if (import.meta.env.DEV) {
        const mockCheckout = await createMockCheckout(plan.id, user.email || 'user@example.com');
        toast.success(`Mock checkout created for ${plan.name}!`);
        console.log('Mock Polar checkout:', mockCheckout);
        
        // Simulate successful subscription with actual database update
        setTimeout(async () => {
          try {
            // Plan configurations matching SettingsForm
            const PLAN_CONFIGS = {
              basic: { name: "Basic", messageLimit: 3, subscriptionStatus: "free", isPremium: false },
              pro: { name: "Pro", messageLimit: 1000, subscriptionStatus: "pro", isPremium: true },
              elite: { name: "Elite", messageLimit: -1, subscriptionStatus: "elite", isPremium: true }
            };

            const planConfig = PLAN_CONFIGS[plan.id as keyof typeof PLAN_CONFIGS];
            
            if (planConfig) {
              // Update user's subscription in database
              const { error } = await supabase.from('profiles').update({
                subscription_status: planConfig.subscriptionStatus,
                message_limit: planConfig.messageLimit === -1 ? 999999 : planConfig.messageLimit,
                messages_used: 0, // Reset message count on upgrade
                is_premium: planConfig.isPremium,
                subscription_plan: planConfig.name,
                updated_at: new Date().toISOString()
              }).eq('id', user.id);

              if (error) throw error;

              toast.success(`🎉 Successfully upgraded to ${plan.name} plan! Your message limit has been ${planConfig.messageLimit === -1 ? 'removed' : `increased to ${planConfig.messageLimit}`}.`);
              
              // Refresh the page to show updated subscription status
              setTimeout(() => window.location.reload(), 1500);
            }
          } catch (error) {
            console.error('Error updating subscription:', error);
            toast.error("Mock payment successful but failed to update your account.");
          }
        }, 2000);
        
        return;
      }

      // Production Polar checkout
      const productPriceId = POLAR_PRODUCT_PRICES[plan.id as keyof typeof POLAR_PRODUCT_PRICES];
      
      if (!productPriceId) {
        throw new Error(`No product price ID configured for plan: ${plan.id}`);
      }

      // Call Polar API directly (in production, this should be done server-side)
      const checkoutData = {
        product_price_id: productPriceId,
        success_url: `${window.location.origin}/dashboard/settings?success=true&plan=${plan.id}`,
        cancel_url: `${window.location.origin}/dashboard/settings?canceled=true`,
        customer_email: user.email,
        metadata: {
          user_id: user.id,
          plan_id: plan.id,
        },
      };

      const response = await fetch('https://api.polar.sh/v1/checkouts/custom', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_POLAR_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url: checkoutUrl } = await response.json();
      
      // Redirect to Polar checkout
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('Polar checkout error:', error);
      toast.error("Failed to initiate checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  // Get current plan
  const getCurrentPlan = () => {
    if (!profile?.is_premium) return "basic";
    return profile.subscription_plan?.toLowerCase() || "pro";
  };

  const currentPlan = getCurrentPlan();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
        <CardDescription>
          Choose the plan that works best for you. Powered by Polar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Current subscription status */}
        {profile?.is_premium ? (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Current Plan:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                {profile.subscription_plan || "Premium"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Your subscription is active and renews automatically.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Current Plan:</span>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                Free
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock unlimited features and enhance your experience.
            </p>
          </div>
        )}
        
        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {polarPlans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${
                  isCurrentPlan ? 'border-2 border-green-500' : ''
                } ${isPopular ? 'border-2 border-blue-500' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {formatPrice(plan.price, plan.currency)}
                    {plan.price > 0 && (
                      <span className="text-sm font-normal text-muted-foreground">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={isCurrentPlan ? "outline" : "default"}
                    disabled={isCurrentPlan || loading === plan.id}
                    onClick={() => handlePolarCheckout(plan)}
                  >
                    {loading === plan.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : plan.price === 0 ? (
                      "Current Plan"
                    ) : (
                      `Upgrade to ${plan.name}`
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        {/* Polar branding */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Secure payments powered by{" "}
            <a 
              href="https://polar.sh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Polar
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 
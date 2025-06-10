import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CreditCard, User, AlertCircle } from "lucide-react";

interface UserSubscriptionProps {
  profile: any;
}

export function UserSubscription({ profile }: UserSubscriptionProps) {
  const { user } = useAuth();
  const [daysUntilRenewal, setDaysUntilRenewal] = useState<number | null>(null);
  
  useEffect(() => {
    if (profile?.subscription_expiry) {
      const expiryDate = new Date(profile.subscription_expiry);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilRenewal(diffDays);
    }
  }, [profile]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleCancelSubscription = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, you would call your backend to cancel the subscription
      // For now, we'll just show a message directing users to Polar
      toast.info("To cancel your subscription, please contact support or manage it through your Polar dashboard.");
      
      // You could also open the Polar customer portal here
      // window.open('https://polar.sh/customer-portal', '_blank');
    } catch (error) {
      console.error('Cancellation error:', error);
      toast.error("Failed to process cancellation request");
    }
  };

  return (
    <Card className="botbae-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Subscription Status
        </CardTitle>
        <CardDescription>
          View and manage your current subscription plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {profile?.is_premium ? (
          <div className="space-y-6">
            {/* Active Subscription Info */}
            <div className="p-4 bg-card/70 backdrop-blur-sm border border-border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-botbae-accent" />
                  <span className="font-medium text-foreground">Active Subscription</span>
                </div>
                <Badge className="bg-botbae-accent/20 text-botbae-accent border-botbae-accent/30">
                  {profile.subscription_plan || "Premium"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-botbae-accent" />
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium text-foreground">{formatDate(profile.subscription_date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-botbae-accent" />
                  <span className="text-muted-foreground">Renews:</span>
                  <span className="font-medium text-foreground">{formatDate(profile.subscription_expiry)}</span>
                </div>
              </div>
              
              {daysUntilRenewal !== null && (
                <div className="mt-3 p-3 bg-muted/50 rounded border border-border">
                  <div className="flex items-center gap-2">
                    {daysUntilRenewal > 7 ? (
                      <Calendar className="w-4 h-4 text-botbae-secondary" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-foreground">
                      {daysUntilRenewal > 0 
                        ? `Renews in ${daysUntilRenewal} day${daysUntilRenewal !== 1 ? 's' : ''}`
                        : daysUntilRenewal === 0 
                        ? "Renews today"
                        : `Expired ${Math.abs(daysUntilRenewal)} day${Math.abs(daysUntilRenewal) !== 1 ? 's' : ''} ago`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Subscription Benefits */}
            <div className="p-4 bg-card/70 backdrop-blur-sm border border-border rounded-lg">
              <h4 className="font-medium text-foreground mb-2">Current Plan Benefits</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {profile.subscription_plan?.toLowerCase() === 'pro' ? (
                  <>
                    <li className="text-foreground">• 1,000 messages per month with your Botbae</li>
                    <li className="text-foreground">• Advanced companion customization</li>
                    <li className="text-foreground">• All relationship stages unlocked</li>
                    <li className="text-foreground">• Enhanced conversation memory</li>
                    <li className="text-foreground">• Full mood tracking & insights</li>
                    <li className="text-foreground">• Virtual activities & dates</li>
                  </>
                ) : (
                  <>
                    <li className="text-foreground">• Unlimited messages with your Botbae</li>
                    <li className="text-foreground">• Advanced companion customization</li>
                    <li className="text-foreground">• All relationship stages unlocked</li>
                    <li className="text-foreground">• Enhanced conversation memory</li>
                    <li className="text-foreground">• Full mood tracking & insights</li>
                    <li className="text-foreground">• Virtual activities & dates</li>
                  </>
                )}
                {profile.subscription_plan?.toLowerCase() === 'elite' && (
                  <>
                    <li className="text-foreground">• Create up to 3 unique Botbaes</li>
                    <li className="text-foreground">• Priority support</li>
                    <li className="text-foreground">• Advanced insights & analytics</li>
                  </>
                )}
              </ul>
            </div>

            {/* Management Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="outline"
                onClick={handleCancelSubscription}
                className="flex-1 border-border hover:bg-muted/50"
              >
                Manage Subscription
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.info("For billing inquiries, please contact support or check your Polar dashboard.");
                }}
                className="flex-1 border-border hover:bg-muted/50"
              >
                View Billing History
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Free Plan Status */}
            <div className="p-4 bg-card/70 backdrop-blur-sm border border-border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Free Plan</span>
                <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                  Basic
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                You're currently on the free plan with limited features.
              </p>
            </div>

            {/* Free Plan Limitations */}
            <div className="p-4 bg-card/70 backdrop-blur-sm border border-border rounded-lg">
              <h4 className="font-medium mb-2 text-foreground">Current Plan Includes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="text-foreground">• 10 messages per day</li>
                <li className="text-foreground">• Basic companion customization</li>
                <li className="text-foreground">• Friend relationship stages only</li>
                <li className="text-foreground">• Standard conversation memory</li>
                <li className="text-foreground">• Basic mood tracking</li>
              </ul>
            </div>

            {/* Upgrade Prompt */}
            <div className="p-4 bg-gradient-to-r from-botbae-accent/10 to-botbae-secondary/10 border border-botbae-accent/20 rounded-lg">
              <h4 className="font-medium mb-2 text-foreground">Unlock Premium Features</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to Pro (1,000 messages/month) or Elite (unlimited messages) for advanced features and deeper connections.
              </p>
              <Button 
                onClick={() => {
                  // Scroll to the top Polar checkout component
                  const polarCheckout = document.querySelector('[data-component="polar-checkout"]');
                  if (polarCheckout) {
                    polarCheckout.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto botbae-button"
              >
                View Upgrade Options
              </Button>
            </div>
          </div>
        )}
        
        {/* Polar Attribution */}
        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Subscription managed through{" "}
            <a 
              href="https://polar.sh" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-botbae-accent hover:underline"
            >
              Polar
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

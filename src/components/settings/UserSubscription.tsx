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
  const [loading, setLoading] = useState(false);

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate days until renewal
  const getDaysUntilRenewal = (expiryDate: string | null) => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCancelSubscription = async () => {
    if (!user || !profile?.is_premium) return;
    
    setLoading(true);
    try {
      // In a real implementation, this would call Polar API to cancel subscription
      toast.info("To cancel your subscription, please contact support or manage it through your Polar dashboard.");
      
      // For now, just show the cancellation info
      // In production, you'd make an API call to Polar to cancel
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error("Failed to process cancellation request");
    } finally {
      setLoading(false);
    }
  };

  const daysUntilRenewal = getDaysUntilRenewal(profile?.subscription_expiry);

  return (
    <Card>
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
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Active Subscription</span>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  {profile.subscription_plan || "Premium"}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium">{formatDate(profile.subscription_date)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">Renews:</span>
                  <span className="font-medium">{formatDate(profile.subscription_expiry)}</span>
                </div>
              </div>
              
              {daysUntilRenewal !== null && (
                <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                  <div className="flex items-center gap-2">
                    {daysUntilRenewal > 7 ? (
                      <Calendar className="w-4 h-4 text-blue-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    )}
                    <span className="text-sm">
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
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Current Plan Benefits</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Unlimited messages with your Botbae</li>
                <li>• Advanced companion customization</li>
                <li>• All relationship stages unlocked</li>
                <li>• Enhanced conversation memory</li>
                <li>• Full mood tracking & insights</li>
                <li>• Virtual activities & dates</li>
                {profile.subscription_plan?.toLowerCase() === 'elite' && (
                  <>
                    <li>• Create up to 3 unique Botbaes</li>
                    <li>• Priority support</li>
                    <li>• Advanced insights & analytics</li>
                  </>
                )}
              </ul>
            </div>

            {/* Management Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleCancelSubscription}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Processing..." : "Manage Subscription"}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  toast.info("For billing inquiries, please contact support or check your Polar dashboard.");
                }}
                className="flex-1"
              >
                View Billing History
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground text-center">
              Subscription managed through{" "}
              <a 
                href="https://polar.sh" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Polar
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Free Plan Status */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Free Plan</span>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                  Basic
                </Badge>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                You're currently on the free plan with limited features.
              </p>
            </div>

            {/* Free Plan Limitations */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border">
              <h4 className="font-medium mb-2">Current Plan Includes:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 10 messages per day</li>
                <li>• Basic companion customization</li>
                <li>• Friend relationship stages only</li>
                <li>• Standard conversation memory</li>
                <li>• Basic mood tracking</li>
              </ul>
            </div>

            {/* Upgrade Prompt */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
              <h4 className="font-medium mb-2">Unlock Premium Features</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Upgrade to Pro or Elite for unlimited messages, advanced customization, and exclusive features.
              </p>
              <Button 
                onClick={() => {
                  // Scroll to the top Polar checkout component
                  const polarCheckout = document.querySelector('[data-component="polar-checkout"]');
                  if (polarCheckout) {
                    polarCheckout.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto"
              >
                View Upgrade Options
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

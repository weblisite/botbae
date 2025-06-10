import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Zap, Clock, MessageCircle, TrendingUp, Star } from "lucide-react";
import { PolarCheckout } from "@/components/payments/PolarCheckout";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  messagesUsed: number;
  messagesRemaining: number;
  companionName: string;
  onUpgradeSuccess?: () => void;
}

export function ProUpgradeModal({ 
  isOpen, 
  onClose, 
  messagesUsed, 
  messagesRemaining,
  companionName,
  onUpgradeSuccess
}: ProUpgradeModalProps) {
  const urgencyLevel = messagesRemaining === 0 ? 'depleted' : messagesRemaining === 1 ? 'critical' : messagesRemaining <= 10 ? 'high' : messagesRemaining <= 50 ? 'medium' : 'low';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-w-[95vw] max-h-[95vh] overflow-y-auto bg-background/95 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20">
              <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
            </div>
            Upgrade to Elite
          </DialogTitle>
          <DialogDescription className="text-base md:text-lg text-muted-foreground">
            {messagesRemaining === 0 ? 'You\'ve reached your Pro plan limit!' : `Only ${messagesRemaining} messages remaining this month.`}
            <br />
            <span className="text-sm text-muted-foreground/80 mt-2 block">
              Upgrade to Elite for unlimited conversations with <span className="font-semibold text-botbae-accent">{companionName}</span>
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Usage Progress - Compact */}
          <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-lg p-3 md:p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pro Plan Usage This Month</span>
              <Badge 
                variant={urgencyLevel === 'depleted' || urgencyLevel === 'critical' ? "destructive" : 
                        urgencyLevel === 'high' ? "secondary" : "outline"}
                className="flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                {messagesUsed}/1,000
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div 
                className={`bg-gradient-to-r ${
                  urgencyLevel === 'depleted' || urgencyLevel === 'critical' 
                    ? 'from-red-500 to-red-600' 
                    : urgencyLevel === 'high' 
                      ? 'from-orange-500 to-red-500'
                      : 'from-orange-500 to-purple-500'
                } h-3 rounded-full transition-all duration-300`}
                style={{ width: `${Math.min((messagesUsed / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Direct Polar Checkout Integration */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Upgrade to Elite Plan</h3>
              <p className="text-muted-foreground text-sm">
                Get unlimited messages and premium features - never worry about limits again!
              </p>
            </div>

            {/* Horizontal Polar Checkout */}
            <div className="w-full">
              <PolarCheckout profile={{ is_premium: true, subscription_plan: 'Pro' }} />
            </div>
          </div>

          {/* Quick Benefits Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Your Pro Plan
              </h4>
              <div className="space-y-1 text-muted-foreground">
                <div>✅ 1,000 messages/month</div>
                <div>✅ Advanced customization</div>
                <div>✅ Priority responses</div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Elite Upgrade Benefits
              </h4>
              <div className="space-y-1 text-muted-foreground">
                <div>🚀 UNLIMITED messages</div>
                <div>🎭 Multiple companions (up to 3)</div>
                <div>⭐ VIP support & early access</div>
              </div>
            </div>
          </div>

          {/* Urgency Notice */}
          {(urgencyLevel === 'critical' || urgencyLevel === 'depleted') && (
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold">
                <Clock className="w-4 h-4" />
                {urgencyLevel === 'depleted' ? 'Immediate Action Required' : 'Urgent: Last Message'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {urgencyLevel === 'depleted' 
                  ? `You can't send more messages until next month or upgrade to Elite now for immediate unlimited access.`
                  : `This is your final Pro message this month. Upgrade to Elite to continue unlimited conversations with ${companionName}.`
                }
              </p>
            </div>
          )}

          {/* Security & Trust */}
          <div className="text-center text-xs text-muted-foreground bg-muted/20 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-3 h-3" />
              <span className="font-medium">Secure Payment by Polar</span>
              <Star className="w-3 h-3" />
            </div>
            <div>Cancel anytime • 30-day money-back guarantee • Secure checkout</div>
          </div>

          {/* Maybe Later Button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8 py-2 border-2 hover:bg-muted/50 transition-all duration-200"
            >
              {urgencyLevel === 'depleted' ? 'Wait for Reset' : 'Continue with Pro'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
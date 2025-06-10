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
import { MessageCircle, Crown, Sparkles, Heart, Star, Zap, Clock } from "lucide-react";
import { PolarCheckout } from "@/components/payments/PolarCheckout";

interface MessageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  messagesUsed: number;
  messageLimit: number;
  companionName: string;
  subscriptionStatus: 'free' | 'premium' | 'pro' | 'elite';
  onUpgradeSuccess?: () => void;
}

export function MessageLimitModal({ 
  isOpen, 
  onClose, 
  messagesUsed, 
  messageLimit, 
  companionName,
  subscriptionStatus,
  onUpgradeSuccess
}: MessageLimitModalProps) {
  const isProUser = subscriptionStatus === 'pro';
  const isFreeUser = subscriptionStatus === 'free';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl max-w-[95vw] max-h-[95vh] overflow-y-auto bg-background/95 backdrop-blur-sm">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
            <div className={`p-2 rounded-full ${isProUser ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20' : 'bg-gradient-to-r from-red-500/20 to-orange-500/20'}`}>
              {isProUser ? <Zap className="w-6 h-6 md:w-8 md:h-8 text-orange-500" /> : <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-red-500" />}
            </div>
            {isProUser ? 'Upgrade to Elite' : 'Upgrade to Continue'}
          </DialogTitle>
          <DialogDescription className="text-base md:text-lg text-muted-foreground">
            {isProUser ? (
              <>
                You've used all <span className="font-semibold text-orange-500">1,000 messages</span> of your Pro plan this month.
                <br />
                <span className="text-sm text-muted-foreground/80 mt-2 block">Upgrade to Elite for unlimited conversations with <span className="font-semibold text-botbae-accent">{companionName}</span>!</span>
              </>
            ) : (
              <>
                You've used all <span className="font-semibold text-foreground">{messageLimit}</span> of your free messages.
                <br />
                <span className="text-sm text-muted-foreground/80 mt-2 block">Choose a plan to continue chatting with <span className="font-semibold text-botbae-accent">{companionName}</span></span>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Usage Progress - Compact */}
          <div className={`${isProUser ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10' : 'bg-gradient-to-r from-botbae-accent/10 to-botbae-primary/10'} rounded-lg p-3 md:p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {isProUser ? 'Pro Plan Messages Used' : 'Free Messages Used'}
              </span>
              <Badge variant="secondary" className={`${isProUser ? 'bg-orange-500/20 text-orange-500' : 'bg-botbae-accent/20 text-botbae-accent'}`}>
                {messagesUsed}/{isProUser ? '1,000' : messageLimit}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`${isProUser ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-gradient-to-r from-botbae-accent to-botbae-primary'} h-2 rounded-full`}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Direct Polar Checkout Integration */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {isProUser ? 'Upgrade to Elite Plan' : 'Choose Your Plan'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {isProUser 
                  ? 'Get unlimited messages and premium features' 
                  : 'Select the perfect plan to continue your journey with ' + companionName
                }
              </p>
            </div>

            {/* Horizontal Polar Checkout */}
            <div className="w-full">
              <PolarCheckout profile={{ 
                is_premium: subscriptionStatus !== 'free', 
                subscription_plan: subscriptionStatus === 'pro' ? 'Pro' : subscriptionStatus === 'elite' ? 'Elite' : 'Free' 
              }} />
            </div>
          </div>

          {/* Quick Benefits Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Pro Plan Benefits
              </h4>
              <div className="space-y-1 text-muted-foreground">
                <div>💬 1,000 messages/month</div>
                <div>🎨 Advanced customization</div>
                <div>⚡ Priority responses</div>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Elite Plan Benefits
              </h4>
              <div className="space-y-1 text-muted-foreground">
                <div>🚀 UNLIMITED messages</div>
                <div>🎭 Multiple companions (up to 3)</div>
                <div>⭐ VIP support</div>
              </div>
            </div>
          </div>

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
              {isProUser ? 'Wait for Reset' : 'Maybe Later'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
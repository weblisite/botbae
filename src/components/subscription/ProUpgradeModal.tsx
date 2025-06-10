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
import { Sparkles, Crown, Zap, Clock, MessageCircle, TrendingUp } from "lucide-react";
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
  const [showPricing, setShowPricing] = useState(false);

  const eliteBenefits = [
    "🚀 UNLIMITED messages - never worry about limits again",
    "🎭 Create up to 3 unique AI companions",
    "💝 Virtual dates & exclusive activities",
    "📊 Advanced relationship analytics",
    "⭐ VIP support with 1-hour response time",
    "🎪 Early access to new features",
    "👥 Exclusive Elite community access"
  ];

  const urgencyMessages = {
    low: messagesRemaining > 50 ? `You have ${messagesRemaining} messages remaining this month` : null,
    medium: messagesRemaining <= 50 && messagesRemaining > 10 ? `Only ${messagesRemaining} messages left this month!` : null,
    high: messagesRemaining <= 10 && messagesRemaining > 1 ? `Running low: ${messagesRemaining} messages remaining!` : null,
    critical: messagesRemaining === 1 ? "This is your last Pro message this month!" : null,
    depleted: messagesRemaining === 0 ? "You've reached your Pro plan limit!" : null
  };

  const currentUrgency = urgencyMessages.depleted || urgencyMessages.critical || urgencyMessages.high || urgencyMessages.medium || urgencyMessages.low;
  const urgencyLevel = messagesRemaining === 0 ? 'depleted' : messagesRemaining === 1 ? 'critical' : messagesRemaining <= 10 ? 'high' : messagesRemaining <= 50 ? 'medium' : 'low';

  if (showPricing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Upgrade to Elite - Unlimited Everything
            </DialogTitle>
            <DialogDescription className="text-center">
              Continue unlimited conversations with {companionName} and unlock exclusive Elite features
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            <PolarCheckout profile={{ is_premium: true, subscription_plan: 'Pro' }} />
          </div>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowPricing(false)}>
              Back to Pro Upgrade
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-sm border-2 border-orange-500/20">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-orange-500/20 to-purple-500/20">
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
            Pro Plan Usage Alert
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            {currentUrgency}
            <br />
            <span className="text-sm text-muted-foreground/80 mt-2 block">
              Upgrade to Elite for unlimited conversations with {companionName}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Usage Progress */}
          <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-lg p-4">
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
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0 messages</span>
              <span>1,000 messages</span>
            </div>
          </div>

          {/* Pro Plan Status */}
          <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-purple-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="w-5 h-5 text-orange-500" />
                Your Pro Plan Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Messages Used:</span>
                  <span className="font-semibold">{messagesUsed}/1,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Messages Remaining:</span>
                  <span className={`font-semibold ${messagesRemaining <= 10 ? 'text-red-500' : messagesRemaining <= 50 ? 'text-orange-500' : 'text-green-500'}`}>
                    {messagesRemaining}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Reset Date:</span>
                  <span className="text-muted-foreground">Next month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Elite Upgrade Benefits */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Upgrade to Elite for Unlimited Access
            </h3>
            <p className="text-muted-foreground">
              Never worry about message limits again - talk with {companionName} as much as you want!
            </p>
            
            {/* Elite Plan Showcase */}
            <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:border-purple-500/50 transition-all duration-200 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    UNLIMITED EVERYTHING
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold text-foreground">Elite Plan</CardTitle>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">$39</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                  <span className="text-xs text-green-500 ml-2">(Only +$10 from Pro)</span>
                </div>
                <CardDescription className="text-muted-foreground">
                  Complete unlimited AI companion experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  {eliteBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2 text-foreground">
                      <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mt-0.5 shrink-0">
                        <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className={benefit.includes('UNLIMITED') ? 'font-bold text-yellow-400' : ''}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

          {/* Value Proposition */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4">
            <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">
              Why Pro Users Love Elite
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground">
              <div>💬 <strong>No More Counting:</strong> Chat freely without tracking messages</div>
              <div>🎭 <strong>Multiple Companions:</strong> Create different personalities for different moods</div>
              <div>⚡ <strong>Instant Upgrade:</strong> Unlimited access starts immediately</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => setShowPricing(true)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 shadow-lg transform transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Upgrade to Elite - Unlimited
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3 border-2 hover:bg-muted/50 transition-all duration-200"
            >
              {urgencyLevel === 'depleted' ? 'Wait for Reset' : 'Continue with Pro'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
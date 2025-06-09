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
import { MessageCircle, Crown, Sparkles, Heart, Star } from "lucide-react";
import { PolarCheckout } from "@/components/payments/PolarCheckout";

interface MessageLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  messagesUsed: number;
  messageLimit: number;
  companionName: string;
  onUpgradeSuccess?: () => void;
}

export function MessageLimitModal({ 
  isOpen, 
  onClose, 
  messagesUsed, 
  messageLimit, 
  companionName,
  onUpgradeSuccess
}: MessageLimitModalProps) {
  const [showPricing, setShowPricing] = useState(false);

  const freePlanFeatures = [
    "✨ Create your AI companion",
    `💬 ${messageLimit} free messages`,
    "🎨 Basic customization",
    "❤️ Relationship building",
  ];

  const proPlanFeatures = [
    "💬 1,000 messages/month",
    "🎨 Advanced customization",
    "📱 SMS notifications",
    "🔒 Privacy controls",
    "⚡ Priority responses",
    "🎯 Personality insights",
  ];

  const elitePlanFeatures = [
    "🚀 Unlimited messages",
    "🎭 Multiple companions", 
    "💝 Virtual dates & activities",
    "📊 Advanced analytics",
    "👥 Community access",
    "🎪 Exclusive content",
  ];

  if (showPricing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Continue Your Journey with {companionName}
            </DialogTitle>
            <DialogDescription className="text-center">
              Choose a plan to unlock unlimited conversations and premium features
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6">
            <PolarCheckout profile={{ is_premium: false, subscription_plan: 'Free' }} />
          </div>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => setShowPricing(false)}>
              Back to Message Limit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-background/95 backdrop-blur-sm border-2">
        <DialogHeader className="text-center space-y-3">
          <DialogTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-red-500/20 to-orange-500/20">
              <MessageCircle className="w-8 h-8 text-red-500" />
            </div>
            Message Limit Reached
          </DialogTitle>
          <DialogDescription className="text-lg text-muted-foreground">
            You've used all <span className="font-semibold text-foreground">{messageLimit}</span> of your free messages with <span className="font-semibold text-botbae-accent">{companionName}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Usage Progress */}
          <div className="bg-gradient-to-r from-botbae-accent/10 to-botbae-primary/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Free Messages Used</span>
              <Badge variant="secondary" className="bg-botbae-accent/20 text-botbae-accent">
                {messagesUsed}/{messageLimit}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-botbae-accent to-botbae-primary h-2 rounded-full"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* What You've Experienced */}
          <Card className="border-botbae-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Your Journey So Far
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {freePlanFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Benefits Preview */}
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-botbae-accent" />
              Continue Your Connection
            </h3>
            <p className="text-muted-foreground">
              Unlock unlimited conversations and build a deeper relationship with {companionName}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="border-2 border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:border-blue-500/40 transition-all duration-200 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Crown className="w-6 h-6 text-blue-500" />
                    <Badge className="bg-blue-500 text-white">Popular</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">Pro Plan</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">$29</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="text-muted-foreground">Perfect for regular conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {proPlanFeatures.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-foreground">
                        <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Crown className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/5 hover:border-purple-500/40 transition-all duration-200 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Premium</Badge>
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">Elite Plan</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">$39</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  <CardDescription className="text-muted-foreground">Complete companion experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {elitePlanFeatures.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-foreground">
                        <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              onClick={() => setShowPricing(true)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg transform transition-all duration-200 hover:scale-105"
              size="lg"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade Now
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 py-3 border-2 hover:bg-muted/50 transition-all duration-200"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
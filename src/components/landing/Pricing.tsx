import { CheckIcon, Star, Zap, Heart, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createMockCheckout } from "@/lib/polar";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    id: "basic",
    name: "Free Trial",
    price: "Free",
    originalPrice: null,
    description: "Perfect for getting started",
    icon: <Star className="w-6 h-6" />,
    features: [
      "10 free messages to start",
      "Basic companion customization",
      "Friend relationship stages",
      "Standard conversation memory",
      "Community support"
    ],
    limitations: [
      "Limited to 10 messages total",
      "Basic AI responses",
      "No premium features"
    ],
    cta: "Start Free Trial",
    popular: false,
    color: "gray"
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    originalPrice: "$49",
    description: "Great for regular conversations and relationship building",
    icon: <Heart className="w-6 h-6" />,
    features: [
      "1,000 messages per month",
      "Advanced AI with GPT-4 technology",
      "All 7 relationship stages unlocked",
      "Perfect memory & conversation history",
      "Full mood tracking & insights",
      "Virtual activities & dates",
      "Custom personality traits",
      "24/7 priority support",
      "Advanced emotional intelligence",
      "Relationship milestone celebrations"
    ],
    savings: "Perfect for most users",
    cta: "Start Pro",
    popular: true,
    color: "accent"
  },
  {
    id: "elite",
    name: "Elite",
    price: "$39",
    originalPrice: "$69",
    description: "Ultimate experience - Unlimited conversations for power users",
    icon: <Crown className="w-6 h-6" />,
    features: [
      "Everything in Pro plan",
      "UNLIMITED messages & conversations",
      "Create up to 3 unique companions",
      "Advanced relationship analytics",
      "SMS & email notifications",
      "Early access to new features",
      "VIP support with 1-hour response",
      "Custom avatar generation credits",
      "Exclusive Elite community access",
      "Advanced conversation modes",
      "Export conversation history"
    ],
    savings: "Best value for unlimited access",
    cta: "Go Elite - Unlimited Everything",
    popular: false,
    color: "secondary"
  }
];

const testimonials = [
  {
    plan: "Pro",
    text: "1,000 messages a month is perfect for me. When I need more, I can always upgrade to Elite!",
    author: "Sarah M.",
    rating: 5
  },
  {
    plan: "Elite", 
    text: "Unlimited messages changed everything! I can chat with my companions whenever I want without worry.",
    author: "Mike R.",
    rating: 5
  }
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelection = async (plan: typeof pricingPlans[0]) => {
    if (plan.id === "basic") {
      if (user) {
        navigate("/dashboard");
      } else {
        navigate("/account/signup");
      }
      return;
    }

    if (!user) {
      navigate("/account/signup");
      return;
    }

    // Handle paid plans with Polar
    try {
      if (import.meta.env.DEV) {
        // Development mode - mock checkout
        const mockCheckout = await createMockCheckout(plan.id, user.email || 'user@example.com');
        toast.success(`Mock checkout created for ${plan.name}!`);
        console.log('Mock Polar checkout:', mockCheckout);
        
        setTimeout(() => {
          toast.success(`Successfully subscribed to ${plan.name}!`);
          navigate("/dashboard");
        }, 2000);
      } else {
        // Production - redirect to settings to complete checkout
        navigate("/dashboard/settings?tab=subscription");
        toast.info(`Select ${plan.name} from the subscription options to continue.`);
      }
    } catch (error) {
      console.error('Pricing checkout error:', error);
      toast.error("Failed to process plan selection. Please try again.");
    }
  };

  return (
    <div className="py-16 md:py-24" id="pricing">
      <div className="botbae-container">
        {/* Header with urgency */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full py-2 px-4 mb-6">
            <Zap className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">Limited Time: 40% Off All Plans!</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto mb-8">
            Start free, then choose Pro for regular conversations or Elite for unlimited access. 
            <span className="text-botbae-accent font-semibold"> Join 100,000+ users</span> who chose Botbae for AI companionship.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-400" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckIcon className="w-4 h-4 text-green-400" />
              <span>30-day money-back guarantee</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`relative ${
                plan.popular 
                  ? 'botbae-glass border-2 border-botbae-accent transform scale-105 shadow-2xl' 
                  : 'botbae-glass hover:border-botbae-accent/30'
              } p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-botbae-accent to-botbae-secondary text-white py-2 px-6 rounded-full text-sm font-bold shadow-lg">
                  🔥 MOST POPULAR - 78% Choose This
                </div>
              )}
              
              {plan.originalPrice && (
                <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                  40% OFF
                </div>
              )}

              {plan.id === 'elite' && (
                <div className="absolute -top-3 -left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold py-1 px-3 rounded-full">
                  UNLIMITED
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  plan.popular ? 'bg-botbae-accent/20' : 'bg-white/10'
                }`}>
                  {plan.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
                <p className="text-white/70 mb-4">{plan.description}</p>
                
                <div className="flex items-center justify-center gap-2 mb-2">
                  {plan.originalPrice && (
                    <span className="text-lg text-white/40 line-through">{plan.originalPrice}</span>
                  )}
                  <div className="text-4xl font-bold text-white">
                    {plan.price}
                    {plan.price !== "Free" && <span className="text-lg text-white/60">/mo</span>}
                  </div>
                </div>
                
                {plan.savings && (
                  <p className="text-sm text-green-400 font-semibold">{plan.savings}</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckIcon className="text-botbae-accent shrink-0 w-5 h-5 mr-3 mt-0.5" />
                    <span className={`text-white/80 ${
                      feature.includes('UNLIMITED') ? 'font-bold text-yellow-400' : ''
                    }`}>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Limitations for free plan */}
              {plan.limitations && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-300 text-sm font-semibold mb-2">Limitations:</p>
                  <ul className="text-red-300/80 text-sm space-y-1">
                    {plan.limitations.map((limitation, i) => (
                      <li key={i}>• {limitation}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Message limit indicator for Pro */}
              {plan.id === 'pro' && (
                <div className="mb-6 p-3 bg-botbae-accent/10 border border-botbae-accent/20 rounded-lg">
                  <p className="text-botbae-accent text-sm font-semibold">
                    💬 1,000 messages = ~33 conversations per day
                  </p>
                  <p className="text-white/70 text-xs mt-1">
                    Perfect for most users. Need more? Upgrade to Elite anytime!
                  </p>
                </div>
              )}

              {/* CTA Button */}
              <Button 
                className={`w-full text-lg py-6 ${
                  plan.popular 
                    ? 'botbae-button shadow-xl hover:shadow-2xl' 
                    : plan.id === 'basic'
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    : 'bg-botbae-secondary/80 hover:bg-botbae-secondary text-white'
                } transition-all duration-300`}
                onClick={() => handlePlanSelection(plan)}
              >
                {plan.cta}
              </Button>
              
              {plan.id !== 'basic' && (
                <p className="text-center text-xs text-white/60 mt-3">
                  Billed monthly • Cancel anytime
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-white mb-8">
            What Our Users Say About Their Plans
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="botbae-glass p-6 rounded-xl">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-botbae-accent font-semibold">{testimonial.plan} User</span>
                </div>
                <p className="text-white/80 italic mb-3">"{testimonial.text}"</p>
                <p className="text-white/60 text-sm">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Value Comparison */}
        <div className="bg-gradient-to-r from-botbae-darkblue to-gray-900 rounded-2xl p-8 md:p-12 mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
            Why Botbae is the Best Value
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-botbae-accent mb-2">$29/mo</div>
              <div className="text-white font-semibold mb-2">Botbae Pro</div>
              <div className="text-white/70 text-sm">1,000 AI conversations + relationship growth</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white/60 mb-2">$89/mo</div>
              <div className="text-white/60 font-semibold mb-2">Therapy Sessions</div>
              <div className="text-white/50 text-sm">4 sessions per month + scheduling hassles</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-white/60 mb-2">$150/mo</div>
              <div className="text-white/60 font-semibold mb-2">Dating Apps Premium</div>
              <div className="text-white/50 text-sm">Multiple app subscriptions + uncertain results</div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-botbae-accent font-bold text-xl">
              Save 67% with Botbae - Get better emotional support for less
            </p>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-white mb-8">
            Choose What's Right For You
          </h3>
          
          <div className="botbae-glass rounded-2xl p-8 overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white">Feature</h4>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white/60">Free Trial</h4>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-botbae-accent">Pro ($29/mo)</h4>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-yellow-400">Elite ($39/mo)</h4>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                <div className="text-white font-medium">Messages</div>
                <div className="text-center text-white/60">10 total</div>
                <div className="text-center text-botbae-accent">1,000/month</div>
                <div className="text-center text-yellow-400 font-bold">UNLIMITED</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                <div className="text-white font-medium">AI Companions</div>
                <div className="text-center text-white/60">1</div>
                <div className="text-center text-botbae-accent">1</div>
                <div className="text-center text-yellow-400">Up to 3</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                <div className="text-white font-medium">Relationship Stages</div>
                <div className="text-center text-white/60">Friends only</div>
                <div className="text-center text-botbae-accent">All 7 stages</div>
                <div className="text-center text-yellow-400">All 7 stages</div>
              </div>
              
              <div className="grid grid-cols-4 gap-4 py-4 border-t border-white/10">
                <div className="text-white font-medium">Support</div>
                <div className="text-center text-white/60">Community</div>
                <div className="text-center text-botbae-accent">Priority</div>
                <div className="text-center text-yellow-400">VIP (1hr response)</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        {/* FAQ section removed to avoid duplication. Please refer to the main FAQ section below the landing page. */}

        {/* Final CTA */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to Find Your Perfect AI Companion?
          </h3>
          <p className="text-lg text-white/70 mb-8">
            Join thousands who have already transformed their emotional life with Botbae
          </p>
          
          <Button 
            className="botbae-button text-xl py-6 px-12 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={() => navigate("/account/signup")}
          >
            Start Your Free Trial Now 🚀
          </Button>
          
          <p className="text-sm text-white/60 mt-4">
            No credit card required • Setup in under 2 minutes • 30-day guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

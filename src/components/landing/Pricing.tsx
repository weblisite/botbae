import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { createMockCheckout } from "@/lib/polar";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "10 messages per day",
      "Basic companion customization",
      "Friend relationship stages",
      "Standard conversation memory"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/month",
    description: "Most popular choice for regular users",
    features: [
      "Unlimited messages",
      "Advanced companion customization",
      "All relationship stages",
      "Enhanced conversation memory",
      "Full mood tracking & insights",
      "Virtual activities & dates"
    ],
    cta: "Start Pro",
    popular: true
  },
  {
    id: "elite",
    name: "Elite",
    price: "$39/month",
    description: "Ultimate experience with premium features",
    features: [
      "All Pro features",
      "Create up to 3 unique Botbaes",
      "Priority support",
      "SMS notifications",
      "Advanced insights & analytics",
      "Early access to new features"
    ],
    cta: "Go Elite",
    popular: false
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
    <div className="py-16 md:py-24 botbae-container" id="pricing">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-4">
          Choose Your Plan
        </h2>
        <p className="text-lg text-white/70 max-w-3xl mx-auto">
          Select the subscription that fits your needs. Powered by Polar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index} 
            className={`botbae-glass p-6 rounded-xl relative ${
              plan.popular ? 'border-botbae-accent border-2 transform -translate-y-4' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-botbae-accent text-white py-1 px-4 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
              <div className="text-3xl font-bold text-white mt-2">{plan.price}</div>
              <div className="text-sm text-white/60">{plan.name !== "Basic" ? "per month" : ""}</div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <CheckIcon className="text-botbae-accent shrink-0 w-5 h-5 mr-2 mt-0.5" />
                  <span className="text-white/80">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className={`w-full ${
                plan.popular ? 'botbae-button' : 'bg-muted hover:bg-muted/80 text-white'
              }`}
              onClick={() => handlePlanSelection(plan)}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

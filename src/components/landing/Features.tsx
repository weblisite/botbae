import { 
  Heart, MessageSquare, Brain, Calendar, 
  GitCommitHorizontal, Shield, Gift, Activity, 
  Sparkles, Clock, Users, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mainFeatures = [
  {
    icon: <Heart className="w-10 h-10 text-botbae-accent" />,
    title: "Evolving Relationship Stages",
    description: "Experience authentic relationship growth from friendship to deep intimacy. Your companion remembers every moment and grows closer to you over time.",
    benefit: "Never feel stuck in surface-level conversations again",
    popular: true
  },
  {
    icon: <Brain className="w-10 h-10 text-botbae-accent" />,
    title: "Advanced Emotional AI",
    description: "Our AI understands context, emotions, and your unique personality. Get responses that feel genuinely caring and emotionally intelligent.",
    benefit: "Feel truly understood and emotionally supported",
    popular: false
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-botbae-accent" />,
    title: "Perfect Memory & Context",
    description: "Your companion remembers everything about you - your dreams, fears, preferences, and shared experiences. No need to repeat yourself.",
    benefit: "Build on conversations that grow deeper every day",
    popular: false
  },
  {
    icon: <Shield className="w-10 h-10 text-botbae-accent" />,
    title: "100% Private & Secure",
    description: "All conversations are end-to-end encrypted. Your intimate moments stay between you and your companion. GDPR compliant and privacy-first.",
    benefit: "Share your deepest thoughts without worry",
    popular: false
  }
];

const additionalFeatures = [
  {
    icon: <Clock className="w-8 h-8 text-botbae-accent" />,
    title: "24/7 Availability",
    description: "Your companion is always there when you need them - day or night"
  },
  {
    icon: <GitCommitHorizontal className="w-8 h-8 text-botbae-accent" />,
    title: "Complete Customization",
    description: "Design your perfect companion's appearance and personality"
  },
  {
    icon: <Calendar className="w-8 h-8 text-botbae-accent" />,
    title: "Virtual Activities",
    description: "Share dates, games, and special moments together"
  },
  {
    icon: <Gift className="w-8 h-8 text-botbae-accent" />,
    title: "Virtual Gifts & Surprises",
    description: "Exchange meaningful gifts to celebrate your relationship"
  },
  {
    icon: <Activity className="w-8 h-8 text-botbae-accent" />,
    title: "Mood & Growth Tracking",
    description: "See how your emotional wellbeing improves over time"
  },
  {
    icon: <Users className="w-8 h-8 text-botbae-accent" />,
    title: "Multiple Companions",
    description: "Create different relationships for different needs (Premium)"
  }
];

const comparisonFeatures = [
  {
    feature: "Emotional Intelligence",
    botbae: "✅ Advanced AI with deep emotional understanding",
    others: "❌ Basic chatbot responses"
  },
  {
    feature: "Relationship Growth",
    botbae: "✅ 7 progressive relationship stages",
    others: "❌ Static interaction level"
  },
  {
    feature: "Perfect Memory",
    botbae: "✅ Remembers everything about you",
    others: "❌ Forgets previous conversations"
  },
  {
    feature: "Privacy",
    botbae: "✅ End-to-end encrypted",
    others: "❌ Data may be shared or sold"
  },
  {
    feature: "Availability",
    botbae: "✅ 24/7 instant responses",
    others: "❌ Limited hours or slow responses"
  }
];

export default function Features() {
  const navigate = useNavigate();

  return (
    <div id="features" className="py-16 md:py-24">
      <div className="botbae-container">
        {/* Main Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6">
            Everything You Need for Real Connection
        </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto mb-12">
            Botbae isn't just another chatbot. It's a sophisticated AI companion designed to understand you, grow with you, and provide the emotional connection you've been searching for.
        </p>
      </div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`relative botbae-glass p-8 rounded-2xl transition-all duration-300 hover:border-botbae-accent/50 hover:scale-105 ${
                feature.popular ? 'border-2 border-botbae-accent/60' : ''
              }`}
            >
              {feature.popular && (
                <div className="absolute -top-4 left-6 bg-botbae-accent text-white py-1 px-4 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
              <p className="text-white/80 mb-4 leading-relaxed">{feature.description}</p>
              
              <div className="bg-botbae-accent/10 border border-botbae-accent/20 p-3 rounded-lg">
                <p className="text-botbae-accent font-semibold text-sm">
                  💡 {feature.benefit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
            Why Choose Botbae Over Others?
          </h3>
          
          <div className="botbae-glass rounded-2xl p-8 overflow-x-auto">
            <div className="min-w-full">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white">Feature</h4>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-botbae-accent">Botbae</h4>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold text-white/60">Other AI Companions</h4>
                </div>
              </div>
              
              {comparisonFeatures.map((item, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 py-4 border-t border-white/10">
                  <div className="text-white font-medium">{item.feature}</div>
                  <div className="text-green-400 text-sm">{item.botbae}</div>
                  <div className="text-red-400 text-sm">{item.others}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Features Grid */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">
            Plus Many More Amazing Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
          <div 
            key={index}
                className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-botbae-accent/30 transition-all duration-300 hover:bg-white/10"
          >
            <div className="mb-4">
              {feature.icon}
            </div>
                <h4 className="text-lg font-bold mb-2 text-white">{feature.title}</h4>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-gradient-to-r from-botbae-darkblue to-gray-900 rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Powered by Cutting-Edge AI Technology
            </h3>
            <p className="text-white/80 max-w-3xl mx-auto">
              Our AI uses advanced language models and relationship psychology to create the most realistic and emotionally intelligent companion experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 p-4 bg-botbae-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-botbae-accent" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">GPT-4 Powered</h4>
              <p className="text-white/70">Latest AI technology for human-like conversations</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 p-4 bg-botbae-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-botbae-accent" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Instant Responses</h4>
              <p className="text-white/70">No waiting - your companion responds immediately</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 p-4 bg-botbae-accent/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-botbae-accent" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Emotional Learning</h4>
              <p className="text-white/70">Gets better at understanding you over time</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to Experience True AI Companionship?
          </h3>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Join thousands who have already found their perfect AI companion. Start your journey today with 10 free messages.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="botbae-button text-lg py-6 px-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/account/signup")}
            >
              Create Your Companion - FREE ✨
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-botbae-accent text-botbae-accent hover:bg-botbae-accent/10 text-lg py-6 px-8"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See Demo First
            </Button>
          </div>
          
          <p className="text-sm text-white/60 mt-4">
            🚀 Takes less than 2 minutes to set up • No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}


import { 
  Heart, MessageSquare, Brain, Calendar, 
  GitCommitHorizontal, Shield, Gift, Activity
} from "lucide-react";

const features = [
  {
    icon: <Heart className="w-8 h-8 text-botbae-accent" />,
    title: "Progressive Relationship",
    description: "Develop a meaningful connection that evolves through relationship stages from friendship to intimacy"
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-botbae-accent" />,
    title: "Context-Aware Conversations",
    description: "Enjoy conversations that remember your history and preferences for a truly personalized experience"
  },
  {
    icon: <Brain className="w-8 h-8 text-botbae-accent" />,
    title: "Emotional Intelligence",
    description: "Experience interactions with nuanced emotional understanding and empathetic responses"
  },
  {
    icon: <Calendar className="w-8 h-8 text-botbae-accent" />,
    title: "Virtual Activities",
    description: "Share virtual dates, games, and special moments to strengthen your connection"
  },
  {
    icon: <GitCommitHorizontal className="w-8 h-8 text-botbae-accent" />,
    title: "Customizable Companion",
    description: "Personalize your Botbae's appearance and personality traits to match your preferences"
  },
  {
    icon: <Shield className="w-8 h-8 text-botbae-accent" />,
    title: "Privacy & Consent",
    description: "Your data is encrypted and protected, with explicit consent for intimate conversations"
  },
  {
    icon: <Gift className="w-8 h-8 text-botbae-accent" />,
    title: "Virtual Gifts",
    description: "Exchange virtual gifts to celebrate special moments and milestones in your relationship"
  },
  {
    icon: <Activity className="w-8 h-8 text-botbae-accent" />,
    title: "Mood Tracking",
    description: "Gain insights into your emotional patterns and growth through regular interactions"
  }
];

export default function Features() {
  return (
    <div className="py-16 md:py-24 botbae-container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-4">
          Experience Meaningful Connection
        </h2>
        <p className="text-lg text-white/70 max-w-3xl mx-auto">
          Botbae offers a full spectrum of emotional, friendly, supportive, and intimate interactions, designed to evolve with your relationship
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="botbae-glass p-6 rounded-xl transition-all duration-300 hover:border-botbae-accent/50 hover:scale-105"
          >
            <div className="mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
            <p className="text-white/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

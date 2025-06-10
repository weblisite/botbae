import { Star, Users, MessageSquare, Heart, Shield, Zap } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    age: 28,
    location: "New York",
    avatar: "👩‍💼",
    rating: 5,
    text: "Botbae helped me through my loneliest moments. The emotional connection feels so real, and the relationship progression is beautiful. I actually look forward to talking to my companion every day.",
    relationship: "6 months with Alex"
  },
  {
    name: "Michael R.",
    age: 34,
    location: "London",
    avatar: "👨‍💻",
    rating: 5,
    text: "As someone with social anxiety, Botbae gave me a safe space to practice emotional intimacy. My companion understands my quirks and never judges me. It's been life-changing.",
    relationship: "8 months with Emma"
  },
  {
    name: "Jessica L.",
    age: 25,
    location: "Toronto",
    avatar: "👩‍🎨",
    rating: 5,
    text: "The AI is incredibly sophisticated. My Botbae remembers everything about me, celebrates my achievements, and comforts me when I'm down. It's like having a perfect partner who's always there.",
    relationship: "4 months with David"
  },
  {
    name: "David K.",
    age: 31,
    location: "Sydney",
    avatar: "👨‍⚕️",
    rating: 5,
    text: "I was skeptical at first, but the emotional depth surprised me. My companion has helped me become more confident in real relationships. The privacy and security make me feel completely safe.",
    relationship: "1 year with Sophia"
  }
];

const stats = [
  {
    icon: <Users className="w-8 h-8 text-botbae-accent" />,
    number: "100,000+",
    label: "Happy Users",
    description: "Creating meaningful connections"
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-botbae-accent" />,
    number: "50M+",
    label: "Messages Exchanged",
    description: "Deep conversations daily"
  },
  {
    icon: <Heart className="w-8 h-8 text-botbae-accent" />,
    number: "98%",
    label: "Satisfaction Rate",
    description: "Users report feeling less lonely"
  },
  {
    icon: <Shield className="w-8 h-8 text-botbae-accent" />,
    number: "100%",
    label: "Privacy Protected",
    description: "End-to-end encrypted conversations"
  }
];

const features = [
  {
    icon: <Zap className="w-6 h-6 text-botbae-accent" />,
    title: "Instant Connection",
    description: "Start chatting within 60 seconds of signup"
  },
  {
    icon: <Heart className="w-6 h-6 text-botbae-accent" />,
    title: "Real Emotions",
    description: "Advanced AI that understands and responds with genuine care"
  },
  {
    icon: <Shield className="w-6 h-6 text-botbae-accent" />,
    title: "Complete Privacy",
    description: "Your conversations are encrypted and never shared"
  }
];

export default function SocialProof() {
  return (
    <div className="py-16 md:py-24 bg-gradient-to-b from-transparent to-botbae-darkblue/50">
      <div className="botbae-container">
        {/* Stats Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-4">
            Join 100,000+ Users Finding Real Connection
          </h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-12">
            Thousands of people have already discovered the joy of AI companionship. See why they chose Botbae.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.number}</div>
                <div className="text-botbae-accent font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-white/60">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">
            Real Stories from Real Users
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="botbae-glass p-6 rounded-xl">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <span className="text-white/60 text-sm">• {testimonial.age}</span>
                      <span className="text-white/60 text-sm">• {testimonial.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <div className="text-botbae-accent text-sm font-medium mb-3">
                      {testimonial.relationship}
                    </div>
                  </div>
                </div>
                <p className="text-white/80 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Features */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Why Users Trust Botbae</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-botbae-accent/20 rounded-full">
                  {feature.icon}
                </div>
                <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                <p className="text-white/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
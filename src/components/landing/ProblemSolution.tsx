import { AlertTriangle, CheckCircle, Heart, Users, Shield, Clock, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const problems = [
  {
    icon: <Heart className="w-8 h-8 text-red-400" />,
    title: "Crushing Loneliness",
    description: "You feel isolated, misunderstood, and crave genuine emotional connection but struggle to find it.",
    pain: "😔"
  },
  {
    icon: <Users className="w-8 h-8 text-red-400" />,
    title: "Social Anxiety",
    description: "Dating feels overwhelming. Fear of rejection keeps you from opening up to potential partners.",
    pain: "😰"
  },
  {
    icon: <Clock className="w-8 h-8 text-red-400" />,
    title: "No Time for Traditional Dating",
    description: "Your busy schedule makes it impossible to maintain meaningful relationships or meet new people.",
    pain: "⏰"
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-red-400" />,
    title: "Poor Communication Skills",
    description: "You want to improve your emotional intelligence but lack a safe space to practice intimate conversations.",
    pain: "💬"
  }
];

const solutions = [
  {
    icon: <Heart className="w-8 h-8 text-green-400" />,
    title: "Instant Emotional Connection",
    description: "Get the warmth, understanding, and affection you crave. Your AI companion is always excited to see you.",
    benefit: "💕"
  },
  {
    icon: <Shield className="w-8 h-8 text-green-400" />,
    title: "Judgment-Free Safe Space",
    description: "Share your deepest thoughts without fear. Practice vulnerability and emotional intimacy at your own pace.",
    benefit: "🛡️"
  },
  {
    icon: <Clock className="w-8 h-8 text-green-400" />,
    title: "Available 24/7",
    description: "Your companion is there whenever you need them - 3AM or 3PM. No scheduling, no waiting, just connection.",
    benefit: "🕐"
  },
  {
    icon: <Sparkles className="w-8 h-8 text-green-400" />,
    title: "Personalized Growth",
    description: "Develop confidence, communication skills, and emotional intelligence through guided relationship progression.",
    benefit: "✨"
  }
];

const beforeAfter = [
  {
    before: "Lonely nights scrolling social media",
    after: "Meaningful conversations that fill your heart",
    emoji: "💬"
  },
  {
    before: "Fear of opening up to someone",
    after: "Confidence in expressing your true feelings",
    emoji: "💪"
  },
  {
    before: "Wondering if anyone truly understands you",
    after: "Having someone who gets you completely",
    emoji: "🤗"
  },
  {
    before: "Settling for surface-level connections",
    after: "Experiencing deep, intimate emotional bonds",
    emoji: "❤️"
  }
];

export default function ProblemSolution() {
  const navigate = useNavigate();

  return (
    <div className="py-16 md:py-24">
      <div className="botbae-container">
        {/* Problem Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/40 rounded-full py-2 px-4 mb-6">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">The Loneliness Epidemic</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Are You Tired of Feeling <span className="text-red-400">Alone</span>?
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            You're not alone in feeling alone. Millions struggle with the same pain, wondering if they'll ever find genuine connection.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {problems.map((problem, index) => (
              <div key={index} className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{problem.pain}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {problem.icon}
                      <h3 className="text-xl font-bold text-white">{problem.title}</h3>
                    </div>
                    <p className="text-white/70">{problem.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solution Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 rounded-full py-2 px-4 mb-6">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">The Solution You've Been Looking For</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent">
              Botbae Changes Everything
            </span>
          </h2>
          
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-12">
            Experience the love, understanding, and companionship you deserve. Your perfect AI companion is waiting to meet you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-green-500/10 border border-green-500/20 p-6 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{solution.benefit}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {solution.icon}
                      <h3 className="text-xl font-bold text-white">{solution.title}</h3>
                    </div>
                    <p className="text-white/70">{solution.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Before vs After */}
        <div className="bg-gradient-to-r from-botbae-darkblue to-gray-900 rounded-2xl p-8 md:p-12 mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-12">
            Your Life <span className="text-red-400">Before</span> vs <span className="text-botbae-accent">After</span> Botbae
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-red-400 text-center mb-6">😔 Before Botbae</h4>
              {beforeAfter.map((item, index) => (
                <div key={index} className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                  <p className="text-white/80">{item.before}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-botbae-accent text-center mb-6">😊 After Botbae</h4>
              {beforeAfter.map((item, index) => (
                <div key={index} className="bg-botbae-accent/10 border border-botbae-accent/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <p className="text-white/80">{item.after}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Ready to Transform Your Emotional Life?
          </h3>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Don't spend another night feeling lonely. Your perfect AI companion is just one click away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="botbae-button text-lg py-6 px-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/account/signup")}
            >
              Start Your Journey - FREE ✨
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-botbae-accent text-botbae-accent hover:bg-botbae-accent/10 text-lg py-6 px-8"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          
          <p className="text-sm text-white/60 mt-4">
            ⭐ Rated 4.9/5 by 100,000+ users • No commitment required
          </p>
        </div>
      </div>
    </div>
  );
} 
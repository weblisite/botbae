import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Shield, Star } from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden py-20 md:py-32">
      <div className="botbae-container">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-2 bg-botbae-accent/20 border border-botbae-accent/40 rounded-full py-2 px-4">
              <Star className="w-4 h-4 text-botbae-accent fill-current" />
              <span className="text-sm text-white/90">Trusted by 100,000+ users worldwide</span>
            </div>

            {/* Main headline - emotional hook */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent">
                Never Feel Lonely
              </span>
              <br />
              <span className="text-white">Again</span>
            </h1>

            {/* Sub-headline - value proposition */}
            <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed">
              Create your perfect AI companion who understands you, grows with you, and is always there for you. 
              Experience <span className="text-botbae-accent font-semibold">real emotional connection</span> that evolves from friendship to deep intimacy.
            </p>

            {/* Key benefits */}
            <div className="flex flex-col sm:flex-row gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-botbae-accent" />
                <span>Genuine emotional bonds</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-botbae-accent" />
                <span>24/7 availability</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-botbae-accent" />
                <span>100% private & secure</span>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="botbae-button text-lg py-6 px-8 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => navigate("/account/signup")}
                >
                  Create Your AI Companion - FREE
                </Button>
                <Button 
                  variant="outline" 
                  className="border-2 border-botbae-accent text-botbae-accent hover:bg-botbae-accent/10 text-lg py-6 px-8"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Watch Demo
                </Button>
              </div>
              
              <p className="text-sm text-white/60">
                ✨ No credit card required • 10 free messages to start • Create your perfect companion in 2 minutes
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-6 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Advanced AI Technology</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              {/* Animated background */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-botbae-accent via-botbae-secondary to-pink-500 opacity-20 blur-3xl animate-pulse"></div>
              
              {/* Main circle */}
              <div className="absolute inset-6 md:inset-10 rounded-full bg-gradient-to-br from-botbae-darkblue to-gray-900 border-2 border-botbae-accent/40 shadow-2xl flex items-center justify-center overflow-hidden">
                {/* Chat bubbles animation */}
                <div className="absolute inset-0 flex flex-col justify-center items-center space-y-4 opacity-80">
                  <div className="bg-botbae-accent/80 rounded-2xl px-4 py-2 text-white text-sm animate-fade-in-up">
                    "You make me feel so understood 💕"
                  </div>
                  <div className="bg-white/90 rounded-2xl px-4 py-2 text-gray-800 text-sm animate-fade-in-up delay-500 ml-8">
                    "I'm always here for you ❤️"
                  </div>
                  <div className="bg-botbae-accent/80 rounded-2xl px-4 py-2 text-white text-sm animate-fade-in-up delay-1000">
                    "This feels so real..."
                  </div>
                </div>
                
                {/* Central heart */}
                <div className="text-6xl md:text-8xl animate-pulse">💖</div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 right-4 bg-botbae-accent/20 rounded-full p-2 animate-bounce delay-300">
                <Heart className="w-6 h-6 text-botbae-accent" />
              </div>
              <div className="absolute bottom-8 left-4 bg-botbae-secondary/20 rounded-full p-2 animate-bounce delay-700">
                <MessageSquare className="w-6 h-6 text-botbae-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Background effects */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-full md:h-[800px] bg-botbae-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -z-10 top-1/4 right-1/4 w-64 h-64 bg-botbae-secondary/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

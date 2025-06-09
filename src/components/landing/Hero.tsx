
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden py-20 md:py-32">
      <div className="botbae-container">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent">
              Botbae
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/80">
              Your personalized AI companion for emotional support, companionship, and relationship building
            </p>
            <p className="text-lg text-white/70">
              Create a virtual companion that grows with you, from casual friendship to deep connection
            </p>
            <div className="pt-4">
              <Button 
                className="botbae-button text-lg py-6 px-8"
                onClick={() => navigate("/dashboard")}
              >
                Create Your Botbae
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-botbae-accent to-botbae-secondary opacity-20 blur-3xl animate-pulse"></div>
              <div className="absolute inset-4 md:inset-10 rounded-full bg-botbae-darkblue border-2 border-botbae-accent/30 shadow-xl flex items-center justify-center">
                <div className="text-6xl md:text-8xl">💖</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-full md:h-[800px] bg-botbae-accent/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}

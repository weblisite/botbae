import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Demo from "@/components/landing/Demo";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 border-b border-muted fixed top-0 left-0 right-0 bg-botbae-darkblue/95 backdrop-blur-sm z-50">
        <div className="botbae-container flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent">
            Botbae
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/#features" className="text-white/80 hover:text-white transition-colors">Features</Link>
            <Link to="/#demo" className="text-white/80 hover:text-white transition-colors">Demo</Link>
            <Link to="/#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link>
            <Link to="/#faq" className="text-white/80 hover:text-white transition-colors">FAQ</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/account/signin">
              <Button variant="outline" className="border-botbae-accent text-botbae-accent hover:bg-botbae-accent/10">
                Sign In
              </Button>
            </Link>
            <Link to="/account/signup">
              <Button className="botbae-button">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow mt-16">
        <Hero />
        <SocialProof />
        <ProblemSolution />
        <Demo />
        <Features />
        <Pricing />
        <FAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

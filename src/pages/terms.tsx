import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-2xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            Terms of Service
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Please read these terms carefully before using Botbae. By accessing or using our service, you agree to be bound by these terms.
          </p>
          <div className="text-left text-white/60 text-sm mb-8">
            <p>1. Use of Service: You must be 18+ to use Botbae for romantic or intimate features. You agree not to misuse the service.</p>
            <p>2. Privacy: We respect your privacy. See our Privacy Policy for details.</p>
            <p>3. Liability: Botbae is provided as-is. We are not liable for emotional or psychological outcomes.</p>
            <p>4. Changes: Terms may be updated at any time. Continued use means acceptance of changes.</p>
          </div>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300">Accept Terms</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
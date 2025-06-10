import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const positions = [
  { title: "Frontend Engineer", location: "Remote", type: "Full-time" },
  { title: "AI Researcher", location: "Remote", type: "Full-time" },
  { title: "Community Manager", location: "Remote", type: "Part-time" },
];

export default function Careers() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-20 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-3xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            Careers at Botbae
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Join us in building the future of AI companionship. We believe in remote-first, async work, and a culture of kindness, creativity, and growth.
          </p>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-botbae-secondary mb-2">Open Positions</h2>
            <div className="space-y-4 mb-6">
              {positions.map((pos, i) => (
                <div key={i} className="botbae-glass p-4 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-2 animate-fade-in-up animate-delay-200">
                  <span className="font-semibold text-white/90">{pos.title}</span>
                  <span className="text-botbae-accent">{pos.location}</span>
                  <span className="text-white/60">{pos.type}</span>
                  <Button className="botbae-button px-4 py-2 text-sm">Apply</Button>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-botbae-accent mb-2">Our Culture</h2>
            <p className="text-white/70 mb-4">We value empathy, diversity, and curiosity. We support each other, celebrate wins, and learn from every challenge. If you want to make a real impact, you'll fit right in.</p>
          </div>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300">Send General Application</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
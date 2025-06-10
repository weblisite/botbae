import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const tutorials = [
  { title: "Getting Started with Botbae", desc: "Learn how to create your first AI companion and start chatting." },
  { title: "Customizing Your Companion", desc: "Personalize your Botbae's look and personality for a unique experience." },
  { title: "Relationship Stages Explained", desc: "Understand how your connection evolves and unlocks new features." },
  { title: "Managing Your Subscription", desc: "Upgrade, downgrade, or cancel your plan with ease." },
];

export default function Tutorials() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36">
        <div className="botbae-glass max-w-4xl mx-auto p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-8 animate-gradient-shift">
            Tutorials
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tutorials.map((tut, i) => (
              <div key={i} className="botbae-glass p-6 rounded-2xl text-left flex flex-col justify-between animate-fade-in-up animate-delay-200">
                <div>
                  <h2 className="text-2xl font-bold text-botbae-accent mb-2">{tut.title}</h2>
                  <p className="text-white/80 mb-4">{tut.desc}</p>
                </div>
                <Button className="botbae-button px-4 py-2 text-sm self-start">Watch</Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const topics = [
  "Getting Started with Botbae",
  "Managing Your Subscription",
  "Customizing Your Companion",
  "Privacy & Security",
  "Troubleshooting & Support",
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36">
        <div className="botbae-glass max-w-3xl mx-auto p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            Help Center
          </h1>
          <input
            className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-botbae-accent mb-6"
            type="text"
            placeholder="Search help topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="space-y-4 mb-8">
            {topics.filter(t => t.toLowerCase().includes(search.toLowerCase())).map((topic, i) => (
              <div key={i} className="botbae-glass p-4 rounded-xl text-white/80 text-lg animate-fade-in-up animate-delay-200">
                {topic}
              </div>
            ))}
          </div>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300" onClick={() => window.location.href='/contact'}>
            Contact Support
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
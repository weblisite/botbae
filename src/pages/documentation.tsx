import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const endpoints = [
  { method: "POST", path: "/api/message", desc: "Send a message to your Botbae and receive a response." },
  { method: "GET", path: "/api/companions", desc: "List your AI companions." },
  { method: "POST", path: "/api/companions", desc: "Create a new AI companion." },
  { method: "GET", path: "/api/relationship", desc: "Get your current relationship stage." },
];

export default function Documentation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36">
        <div className="botbae-glass max-w-3xl mx-auto p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            Documentation
          </h1>
          <h2 className="text-xl font-bold text-botbae-accent mb-4">API Endpoints</h2>
          <div className="space-y-4 mb-8">
            {endpoints.map((ep, i) => (
              <div key={i} className="botbae-glass p-4 rounded-xl text-left animate-fade-in-up animate-delay-200">
                <span className="font-mono text-botbae-secondary font-bold mr-2">{ep.method}</span>
                <span className="font-mono text-white/90 mr-2">{ep.path}</span>
                <span className="text-white/70">{ep.desc}</span>
              </div>
            ))}
          </div>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300">View Full API Docs</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
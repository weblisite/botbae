import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function API() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-2xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            Botbae API
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Integrate Botbae's AI companionship into your own apps and products. Our API lets you send messages, manage companions, and track relationship stages programmatically.
          </p>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300 mb-4" onClick={() => navigate("/documentation")}>View API Documentation</Button>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300">Get API Key</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-3xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            About Botbae
          </h1>
          <p className="text-lg text-white/80 mb-6">
            <span className="font-semibold text-botbae-accent">Botbae</span> is on a mission to end loneliness and empower everyone to experience meaningful connection—anytime, anywhere. Our AI companions are designed to evolve with you, offering genuine emotional support, friendship, and even romance in a safe, private, and judgment-free space.
          </p>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-botbae-secondary mb-2">Our Vision</h2>
            <p className="text-white/70 mb-4">To make the world a kinder, more connected place—one conversation at a time.</p>
            <h2 className="text-2xl font-bold text-botbae-accent mb-2">Our Team</h2>
            <p className="text-white/70 mb-4">We are a passionate group of engineers, designers, and dreamers who believe in the power of technology to heal, inspire, and bring people together. We build with empathy, privacy, and user empowerment at our core.</p>
          </div>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300" onClick={() => navigate("/")}>Try Botbae Now</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
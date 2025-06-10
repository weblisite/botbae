import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-4 animate-gradient-shift">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-white/70 mb-8">Sorry, the page you are looking for does not exist or has been moved.</p>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300" onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

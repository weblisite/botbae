import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-2xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            Cookie Policy
          </h1>
          <p className="text-lg text-white/80 mb-6">
            We use cookies to enhance your experience and keep you logged in. You can manage your preferences at any time.
          </p>
          <div className="text-left text-white/60 text-sm mb-8">
            <p>1. Usage: Cookies help us remember your settings and keep you logged in securely.</p>
            <p>2. Control: You can disable cookies in your browser, but some features may not work.</p>
            <p>3. Analytics: We use cookies for anonymous analytics to improve Botbae.</p>
          </div>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300">Manage Cookie Preferences</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function GDPR() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-2xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            GDPR Compliance
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Botbae is fully GDPR compliant. You have the right to access, export, or delete your data at any time.
          </p>
          <div className="text-left text-white/60 text-sm mb-8">
            <p>1. Data Rights: You can request a copy of your data or delete it at any time.</p>
            <p>2. Transparency: We are clear about what we collect and why.</p>
            <p>3. Security: We use industry-standard encryption and security practices.</p>
          </div>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300">Request/Export/Delete My Data</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
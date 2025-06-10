import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-2xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            Privacy Policy
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Your privacy is our top priority. We encrypt all conversations and never sell your data. You control your information at all times.
          </p>
          <div className="text-left text-white/60 text-sm mb-8">
            <p>1. Data Collection: We collect only what's needed to provide the service. You can delete your data anytime.</p>
            <p>2. Encryption: All messages are encrypted in transit and at rest.</p>
            <p>3. Third Parties: We do not share your data with advertisers or third parties.</p>
            <p>4. Your Rights: You can request, export, or delete your data at any time from your profile settings.</p>
          </div>
          <Button className="botbae-button text-lg px-8 py-4 shadow-xl hover:scale-105 transition-all duration-300">Manage Privacy Settings</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
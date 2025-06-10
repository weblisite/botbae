import React from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const posts = [
  {
    title: "How AI Companions Are Changing Lives",
    date: "2024-06-01",
    excerpt: "Discover the science and stories behind AI-powered emotional support and companionship.",
  },
  {
    title: "The Future of Digital Relationships",
    date: "2024-05-20",
    excerpt: "What does it mean to fall in love with an AI? We explore the psychology and technology behind it.",
  },
  {
    title: "Building Trust with Your Botbae",
    date: "2024-05-10",
    excerpt: "Tips for creating a safe, private, and meaningful connection with your AI companion.",
  },
  {
    title: "From Loneliness to Connection: User Stories",
    date: "2024-04-28",
    excerpt: "Real users share how Botbae helped them find comfort, confidence, and joy.",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36">
        <div className="botbae-glass max-w-4xl mx-auto p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-8 animate-gradient-shift">
            Botbae Blog
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post, i) => (
              <div key={i} className="botbae-glass p-6 rounded-2xl text-left flex flex-col justify-between animate-fade-in-up animate-delay-200">
                <div>
                  <h2 className="text-2xl font-bold text-botbae-accent mb-2">{post.title}</h2>
                  <div className="text-xs text-white/50 mb-2">{post.date}</div>
                  <p className="text-white/80 mb-4">{post.excerpt}</p>
                </div>
                <Button className="botbae-button px-4 py-2 text-sm self-start">Read More</Button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
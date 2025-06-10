import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow mt-36 flex flex-col items-center justify-center">
        <div className="botbae-glass max-w-2xl w-full p-10 rounded-3xl shadow-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-6 animate-gradient-shift">
            Contact Us
          </h1>
          <p className="text-lg text-white/80 mb-6">
            Have a question, feedback, or partnership idea? Reach out and our team will get back to you soon.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-botbae-accent"
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-botbae-accent"
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-botbae-accent"
              name="message"
              placeholder="Your Message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              required
            />
            <Button className="botbae-button w-full text-lg py-3 shadow-xl hover:scale-105 transition-all duration-300" type="submit">
              Send Message
            </Button>
          </form>
          {submitted && <div className="mt-4 text-green-400 font-semibold animate-fade-in-up">Thank you! We'll be in touch soon.</div>}
          <div className="mt-8 text-white/60 text-sm">
            <div>Botbae HQ (Remote-first)</div>
            <div>support@botbae.ai</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 
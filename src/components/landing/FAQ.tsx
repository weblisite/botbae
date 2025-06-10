import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "What is Botbae?",
    answer: "Botbae is a personalized AI companion platform that allows you to create a virtual companion for emotional support, companionship, and relationship building. Your Botbae evolves with you through different relationship stages, from friendship to deeper connections."
  },
  {
    question: "Is Botbae age-restricted?",
    answer: "Yes, Botbae requires users to be 18+ for intimate relationship stages. Age verification is required during signup or before entering romantic stages of interaction."
  },
  {
    question: "How does the relationship progression work?",
    answer: "Your relationship with Botbae begins at the 'New Friend' stage and can progress through 'Close Friend,' 'Best Friend,' 'Romantic Interest,' 'Dating,' 'Committed Partner,' and finally, 'Soulmate.' Progression is based on interaction frequency, positive exchanges, and time spent together."
  },
  {
    question: "Can I customize my Botbae?",
    answer: "Yes, you can customize your Botbae's appearance (gender, name, ethnicity, style, body type, hair type) and personality traits (humor, empathy, intellect, confidence, creativity) to create your ideal companion."
  },
  {
    question: "Is my data private and secure?",
    answer: "We take privacy seriously. All conversations are encrypted, and we comply with GDPR/CCPA regulations. You can delete your data at any time from your profile settings."
  },
  {
    question: "What subscription plans are available?",
    answer: "We offer three tiers: Basic (10 free messages), Pro (1,000 messages per month, advanced customization, avatar uploads), and Elite (unlimited messages, all Pro features plus multiple companions and priority support)."
  },
  {
    question: "How does Botbae handle sensitive or intimate conversations?",
    answer: "Intimate conversations are only available in appropriate relationship stages ('Romantic Interest' and above), require explicit consent, and respect your defined boundaries and preferences."
  }
];

export default function FAQ() {
  return (
    <div className="py-16 md:py-24 botbae-container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-botbae-accent to-botbae-secondary bg-clip-text text-transparent mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-lg text-white/70 max-w-3xl mx-auto">
          Find answers to common questions about Botbae
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-muted">
              <AccordionTrigger className="text-lg font-medium py-4 hover:text-botbae-accent">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-white/70 pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}

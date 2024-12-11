"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { faqData } from "@/lib/constants";
import Link from "next/link";
import { contactInfo } from "@/lib/constants";

// Helper function to remove diacritics
const removeDiacritics = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

export default function FaqSection() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqData = faqData.filter((faq) => {
    const normalizedSearch = removeDiacritics(searchTerm.toLowerCase());
    const normalizedQuestion = removeDiacritics(faq.question.toLowerCase());
    const normalizedAnswer = removeDiacritics(faq.answer.toLowerCase());

    return (
      normalizedQuestion.includes(normalizedSearch) ||
      normalizedAnswer.includes(normalizedSearch)
    );
  });

  return (
    <section className="bg-primary py-16 sm:py-32">
      <div className="container mx-auto grid lg:grid-cols-2 gap-10">
        {/* Left Column */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-5 items-center lg:items-start">
            <h4 className="text-sm uppercase text-white font-inter">Locație</h4>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-lemon text-third">
              Întrebări frecvente
            </h2>

            <p className="font-inter text-center lg:text-start text-white">
              Ai vreo întrebare legată de regulament? Sau poate vrei să afli mai
              multe despre programul taberei, cazare, transport sau orice alt
              detaliu important? Găsești răspunsuri la cele mai frecvente
              întrebări mai jos. Dacă nu găsești ceea ce căutai, nu ezita să ne
              contactezi!
            </p>

            <div className="flex flex-col lg:flex-row items-center w-full gap-5 lg:gap-4">
              <input
                type="text"
                placeholder="caută..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary w-full"
              />
              <Button
                variant="default"
                size="lg"
                className="flex items-center gap-2 whitespace-nowrap w-full lg:w-auto"
                onClick={() => window.open("/assets/Regulament_HopeCamp.pdf")}
              >
                Regulament
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Contact Card - Desktop */}
          <div className="bg-secondary rounded-lg p-8 hidden lg:flex flex-col gap-6">
            <div>
              <h2 className="text-white text-5xl font-lemon mb-2">Contact</h2>
              <p className="text-white/90 font-inter">
                Îți stăm la dispoziție pentru orice întrebare!
              </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <Link
                href={`tel:${contactInfo.phone}`}
                className="bg-white text-primary rounded-lg p-4 flex items-center gap-3 transition-colors hover:bg-white/90"
              >
                <div className="bg-secondary/10 p-2 rounded-full">
                  <i className="bi bi-telephone-fill text-xl"></i>
                </div>
                <span className="font-inter">{contactInfo.phone}</span>
              </Link>
              <Link
                href={`mailto:${contactInfo.email}`}
                className="bg-white text-primary rounded-lg p-4 flex items-center gap-3 transition-colors hover:bg-white/90"
              >
                <div className="bg-secondary/10 p-2 rounded-full">
                  <i className="bi bi-envelope-fill text-xl"></i>
                </div>
                <span className="font-inter">{contactInfo.email}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column - FAQ Accordion */}
        <div className="flex flex-col">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index + 1}`}
                className="border-b border-white/20"
              >
                <AccordionTrigger className="text-white text-lg text-left hover:text-third">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Card - Mobile */}
        <div className="bg-secondary rounded-lg p-8 lg:hidden flex flex-col gap-6">
          <div>
            <h2 className="text-white text-5xl font-lemon mb-2 text-center lg:text-left">
              Contact
            </h2>
            <p className="text-white/90 font-inter text-center lg:text-left">
              Îți stăm la dispoziție pentru orice întrebare!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={`tel:${contactInfo.phone}`}
              className="bg-white text-primary rounded-lg p-4 flex items-center gap-3 transition-colors hover:bg-white/90"
            >
              <div className="bg-secondary/10 p-2 rounded-full">
                <i className="bi bi-telephone-fill text-xl"></i>
              </div>
              <span className="font-inter">{contactInfo.phone}</span>
            </Link>
            <Link
              href={`mailto:${contactInfo.email}`}
              className="bg-white text-primary rounded-lg p-4 flex items-center gap-3 transition-colors hover:bg-white/90"
            >
              <div className="bg-secondary/10 p-2 rounded-full">
                <i className="bi bi-envelope-fill text-xl"></i>
              </div>
              <span className="font-inter">{contactInfo.email}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

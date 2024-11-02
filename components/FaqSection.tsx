"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { faqData } from "@/app/constants";

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
    <section className="bg-white">
      <div className="container mx-auto px-8 py-16">
        <div className="flex flex-col gap-5 items-center">
          <h2 className="text-[#1B4D3E] text-center text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            Întrebări
            <br />
            frecvente
          </h2>

          <Button
            variant="default"
            size="lg"
            className="flex items-center gap-2"
            onClick={() => window.open("/assets/Regulament_HopeCamp.pdf")}
          >
            Descarcă regulamentul
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
            </svg>
          </Button>

          <input
            type="text"
            placeholder="caută..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#F97316] max-w-sm w-full"
          />

          <Accordion type="single" collapsible className="w-full max-w-2xl">
            {filteredFaqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-[#1B4D3E] text-lg text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#1B4D3E]/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

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
    <section className="bg-primary py-16 sm:py-32">
      <div className="container mx-auto flex flex-col lg:flex-row items-stretch gap-10">
        <div className="w-full lg:w-1/2 flex flex-col justify-between gap-10 text-white">
          <div className="flex flex-col gap-5 items-center lg:items-start ">
            <h4 className="text-sm uppercase text-white font-inter">Locație</h4>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-lemon text-third">
              Întrebări frecvente
            </h2>

            <p className="font-inter text-center lg:text-start">
              Ai vreo întrebare legată de regulament? Sau poate vrei să afli mai
              multe despre programul taberei, cazare, transport sau orice alt
              detaliu important? Găsești răspunsuri la cele mai frecvente
              întrebări mai jos. Dacă nu găsești ceea ce căutai, nu ezita să ne
              contactezi!
            </p>
            <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-5 lg:gap-2">
              <input
                type="text"
                placeholder="caută..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-primary rounded-lg  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary w-full"
              />
              <Button
                variant="default"
                size="lg"
                className="flex items-center gap-2"
                onClick={() => window.open("/assets/Regulament_HopeCamp.pdf")}
              >
                Regulament
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="0.5"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
              </Button>
            </div>
          </div>

          <div className="bg-secondary flex-col p-5 gap-2 rounded-lg h-full justify-center hidden lg:flex">
            <h2 className="text-white text-6xl font-lemon">Contact</h2>
            <p className="text-white font-inter">
              Iti stam la dispozitie pentru orice intrebare!
            </p>
            <div className="flex flex-col xl:flex-row gap-5 justify-between pt-5">
              <div className="bg-white text-primary flex gap-2 items-center text-lg p-5 rounded-lg font-inter w-full">
                <i className="bi bi-telephone-fill bg-secondary/20 px-3 py-2 rounded-full"></i>
                <p>+40 773 311 577</p>
              </div>
              <div className="bg-white text-primary flex gap-2 items-center text-lg p-5 rounded-lg font-inter w-full">
                <i className="bi bi-envelope-fill bg-secondary/20 px-3 py-2 rounded-full"></i>
                <p>tsomediateam@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col order-2">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-white text-lg text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="bg-secondary flex flex-col p-5 gap-2 rounded-lg h-full justify-center order-last lg:hidden">
          <h2 className="text-white text-center lg:text-start text-6xl font-lemon">
            Contact
          </h2>
          <p className="text-white text-center lg:text-start font-inter">
            Iti stam la dispozitie pentru orice intrebare!
          </p>
          <div className="flex flex-col md:flex-row gap-5 justify-between pt-5">
            <div className="bg-white text-primary text-lg p-5 rounded-lg font-inter w-full">
              +40 773 311 577
            </div>
            <div className="bg-white text-primary flex items-center gap-2 text-lg p-5 rounded-lg font-inter w-full">
              <i className="bi bi-envelope-fill"></i>
              <p>tsomediateam@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

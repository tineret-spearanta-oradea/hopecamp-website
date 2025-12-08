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
import { cn } from "@/lib/utils";

// Define the type for FAQ items including tags
interface FaqItem {
  question: string;
  answer: string;
  tags: string[];
}

// Helper function to remove diacritics
const removeDiacritics = (str: string): string => {
  return str.normalize("NFD").replace(/[̀-\u036f]/g, "");
};

// Define available tags based on constants.ts (or manually)
const availableTags = ["înscriere", "reguli", "financiar", "transport"];

export default function FaqSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null); // Single selection state
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
    setOpenItem(null); // Close any open items when changing filters
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setOpenItem(null); // Close any open items when searching
  };

  const filteredFaqData = (faqData as FaqItem[]) // Type assertion
    .filter((faq) => {
      // Filter by selected tag
      if (selectedTag && !faq.tags.includes(selectedTag)) {
        return false;
      }
      return true;
    })
    .filter((faq) => {
      // Filter by search term
      const normalizedSearch = removeDiacritics(searchTerm.toLowerCase());
      if (!normalizedSearch) return true; // Show all if search is empty

      const normalizedQuestion = removeDiacritics(faq.question.toLowerCase());
      const normalizedAnswer = removeDiacritics(faq.answer.toLowerCase());

      return (
        normalizedQuestion.includes(normalizedSearch) ||
        normalizedAnswer.includes(normalizedSearch)
      );
    });

  return (
    <section className="relative bg-gradient-to-b from-[#0d2847] via-[#1a3a5c] to-[#0d2847] py-20 sm:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[300px] bg-gradient-to-b from-cyan-500/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[250px] bg-gradient-to-t from-purple-500/10 to-transparent rounded-full blur-3xl" />

        {/* Ice crystals */}
        <div className="absolute top-[15%] left-[8%] w-3 h-3 bg-white/15 rotate-45 animate-float-slow" />
        <div className="absolute bottom-[20%] right-[10%] w-2.5 h-2.5 bg-cyan-300/20 rotate-45 animate-drift animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-cyan-200 text-sm font-medium tracking-wider uppercase">
              Ai întrebări?
            </span>
          </div>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-4">
            <span className="text-ice">Întrebări</span>{" "}
            <span className="text-white/90">frecvente</span>
          </h2>
        </div>

        {/* Search and Buttons Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <div className="relative w-full md:w-auto">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Caută..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="glass font-nunito text-white placeholder:text-white/50 rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-cyan-300/50 w-full md:w-64 transition-all"
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            className="glass border-white/30 text-white hover:bg-white/10 hover:border-white/50 flex items-center gap-2 whitespace-nowrap w-full md:w-auto rounded-xl transition-all"
            onClick={() =>
              window.open("/assets/documents/Regulament_HopeCamp.pdf")
            }
          >
            <i className="bi bi-file-earmark-text"></i>
            Regulament
          </Button>
        </div>

        {/* Tag Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            onClick={() => handleTagClick(null)}
            className={cn(
              "rounded-full capitalize transition-all duration-300",
              selectedTag === null
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/20"
                : "glass border-white/30 text-white/80 hover:text-white hover:border-white/50"
            )}
          >
            Toate
          </Button>
          {availableTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => handleTagClick(tag)}
              className={cn(
                "rounded-full capitalize transition-all duration-300",
                selectedTag === tag
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg shadow-cyan-500/20"
                  : "glass border-white/30 text-white/80 hover:text-white hover:border-white/50"
              )}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion
            type="single"
            collapsible
            className="w-full"
            value={openItem || undefined}
            onValueChange={setOpenItem}
          >
            {filteredFaqData.length > 0 ? (
              filteredFaqData.map((faq, index) => {
                // Create a unique ID for each FAQ based on the question
                const faqId = `faq-${removeDiacritics(faq.question)
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .substring(0, 20)}-${index}`;

                return (
                  <AccordionItem
                    key={faqId}
                    value={faqId}
                    className="glass-card rounded-2xl mb-3 overflow-hidden transition-all duration-300 hover-ice"
                  >
                    <AccordionTrigger className="text-white hover:text-cyan-200 px-6 py-4 text-left font-semibold text-base sm:text-lg hover:no-underline transition-all [&[data-state=open]>svg]:text-cyan-300">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70 px-6 pb-4 pt-0 leading-relaxed">
                      <div
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      ></div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })
            ) : (
              <p className="text-center text-white/80 italic">
                Nu s-au găsit întrebări care să corespundă filtrelor selectate.
              </p>
            )}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

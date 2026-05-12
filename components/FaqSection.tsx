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

interface FaqItem {
  question: string;
  answer: string;
  tags: string[];
}

const removeDiacritics = (str: string): string => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const availableTags = ["inscriere", "reguli", "financiar", "transport"];

export default function FaqSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
    setOpenItem(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setOpenItem(null);
  };

  const filteredFaqData = (faqData as FaqItem[])
    .filter((faq) => {
      if (
        selectedTag &&
        !faq.tags.some(
          (tag) => removeDiacritics(tag.toLowerCase()) === selectedTag
        )
      ) {
        return false;
      }
      return true;
    })
    .filter((faq) => {
      const normalizedSearch = removeDiacritics(searchTerm.toLowerCase());
      if (!normalizedSearch) return true;

      const normalizedQuestion = removeDiacritics(faq.question.toLowerCase());
      const normalizedAnswer = removeDiacritics(faq.answer.toLowerCase());

      return (
        normalizedQuestion.includes(normalizedSearch) ||
        normalizedAnswer.includes(normalizedSearch)
      );
    });

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#1a1a1a]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-archivo text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-white mb-2">
            INTREBARI
          </h2>
          <div className="w-28 h-2 bg-[#FFD600] mx-auto mt-1 rounded-sm -rotate-1" />
        </div>

        {/* Search and Buttons Row */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
          <div className="relative w-full md:w-auto">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cauta..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="bg-[#2a2a2a] border-2 border-[#333] text-white placeholder:text-gray-500 pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#FFD600] w-full md:w-64 transition-colors"
            />
          </div>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-[#FFD600] text-[#FFD600] hover:bg-[#FFD600] hover:text-[#1a1a1a] flex items-center gap-2 whitespace-nowrap w-full md:w-auto transition-colors bg-transparent"
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
              "capitalize transition-colors",
              selectedTag === null
                ? "bg-[#FFD600] text-[#1a1a1a] border-2 border-[#FFD600] hover:bg-[#e6c200]"
                : "border-2 border-[#444] text-gray-400 bg-transparent hover:border-[#FFD600] hover:text-white"
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
                "capitalize transition-colors",
                selectedTag === tag
                  ? "bg-[#FFD600] text-[#1a1a1a] border-2 border-[#FFD600] hover:bg-[#e6c200]"
                  : "border-2 border-[#444] text-gray-400 bg-transparent hover:border-[#FFD600] hover:text-white"
              )}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <Accordion
          type="single"
          collapsible
          className="w-full"
          value={openItem || undefined}
          onValueChange={setOpenItem}
        >
          {filteredFaqData.length > 0 ? (
            filteredFaqData.map((faq, index) => {
              const faqId = `faq-${removeDiacritics(faq.question)
                .toLowerCase()
                .replace(/\s+/g, "-")
                .substring(0, 20)}-${index}`;

              return (
                <AccordionItem
                  key={faqId}
                  value={faqId}
                  className="border-2 border-[#333] bg-[#222] mb-3 overflow-hidden transition-colors hover:border-[#FFD600]"
                >
                  <AccordionTrigger className="text-white hover:text-white px-6 py-4 text-left font-semibold text-base sm:text-lg hover:no-underline transition-colors [&[data-state=open]]:text-[#FFD600] [&[data-state=open]>svg]:text-[#FFD600]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 px-6 pb-4 pt-0 leading-relaxed">
                    <div
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    ></div>
                  </AccordionContent>
                </AccordionItem>
              );
            })
          ) : (
            <p className="text-center text-gray-500 italic">
              Nu s-au gasit intrebari care sa corespunda filtrelor selectate.
            </p>
          )}
        </Accordion>
      </div>
    </section>
  );
}

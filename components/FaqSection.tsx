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

  const handleTagClick = (tag: string | null) => {
    setSelectedTag(tag);
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
    <section className="bg-primary py-16 sm:py-24">
      <div className="container mx-auto px-4">
        {/* Centered Title */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-poppins uppercase font-bold text-white">
            Întrebări frecvente
          </h2>
        </div>

        {/* Search and Buttons Row */}
        <div className="flex flex-col md:flex-row items-center justify-center  gap-4 mb-8">
          <input
            type="text"
            placeholder="caută..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Adjusted styling for better contrast on primary bg
            className="bg-white font-nunito text-primary placeholder:text-primary/60 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 w-full md:w-auto"
          />
          <Button
            variant="outline"
            size="lg"
            // Adjusted styling for button on primary bg
            className="border-white text-white hover:bg-white hover:text-primary flex items-center gap-2 whitespace-nowrap w-full md:w-auto"
            onClick={() =>
              window.open("/assets/documents/Regulament_HopeCamp.pdf")
            }
          >
            Regulament
            <i className="bi bi-download"></i> {/* Use Bootstrap Icon */}
          </Button>
        </div>

        {/* Tag Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 sm:mb-12">
          <Button
            // Use 'default' for active, 'outline' for inactive
            variant={selectedTag === null ? "default" : "outline"}
            onClick={() => handleTagClick(null)}
            // Adjusted styling for tags
            className={cn(
              "rounded-full capitalize transition-colors duration-200",
              selectedTag === null
                ? // Style for active 'default' button (white text on primary bg)
                  "bg-white text-primary hover:bg-white/90"
                : // Style for inactive 'outline' button (white text/border on primary bg)
                  "border-white text-white hover:bg-white hover:text-primary"
            )}
          >
            Toate Întrebările
          </Button>
          {availableTags.map((tag) => (
            <Button
              key={tag}
              // Use 'default' for active, 'outline' for inactive
              variant={selectedTag === tag ? "default" : "outline"}
              onClick={() => handleTagClick(tag)}
              className={cn(
                "rounded-full capitalize transition-colors duration-200",
                selectedTag === tag
                  ? // Style for active 'default' button
                    "bg-white text-primary hover:bg-white/90"
                  : // Style for inactive 'outline' button
                    "border-white text-white hover:bg-white hover:text-primary"
              )}
            >
              {tag}
            </Button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqData.length > 0 ? (
              filteredFaqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index + 1}`}
                  // Style accordion items for contrast
                  className="bg-white rounded-lg mb-3 shadow-sm overflow-hidden border-none"
                >
                  <AccordionTrigger className="text-primary hover:bg-secondary/10 px-6 py-4 text-left font-semibold text-lg hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 px-6 pb-4 pt-0">
                    <div dangerouslySetInnerHTML={{ __html: faq.answer }}></div>
                  </AccordionContent>
                </AccordionItem>
              ))
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

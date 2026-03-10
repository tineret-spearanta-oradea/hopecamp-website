"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";

export default function VideoSection() {
  return (
    <section id="video" className="py-20 sm:py-28 px-6 sm:px-12 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-archivo text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1a1a1a] mb-2">
            AFTERMOVIE
          </h2>
          <div className="w-16 h-1 bg-[#FFD600] mx-auto" />
        </div>

        {/* YouTube Video Container */}
        <div className="border-2 border-gray-200 mb-12">
          <div className="relative w-full aspect-video">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/POM5iyjIf9g?si=VqTiG3xSxe2kv5QD"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </div>

        {/* Instagram Reels Link */}
        <div className="flex justify-center">
          <Link
            href="https://www.instagram.com/tineret_speranta_oradea/reels/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1a1a1a] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#333] transition-colors"
          >
            <Instagram className="h-5 w-5" />
            <span>Vezi reels din tabara</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

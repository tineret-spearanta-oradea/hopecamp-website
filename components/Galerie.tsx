"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Galerie() {
  const images = [
    { src: "/assets/images/hopecamp/gratiadei/ELI00154.jpg", span: "col-span-2 row-span-2" },
    { src: "/assets/images/hopecamp/gratiadei/ELI05180.jpg", span: "col-span-1 row-span-1" },
    { src: "/assets/images/hopecamp/gratiadei/ELI03933.jpg", span: "col-span-1 row-span-1" },
    { src: "/assets/images/hopecamp/gratiadei/ELI03065.jpg", span: "col-span-1 row-span-2" },
    { src: "/assets/images/hopecamp/gratiadei/ELI02865.jpg", span: "col-span-1 row-span-1" },
    { src: "/assets/images/hopecamp/gratiadei/ELI03745.jpg", span: "col-span-2 row-span-1" },
    { src: "/assets/images/hopecamp/gratiadei/ELI02036.jpg", span: "col-span-1 row-span-1" },
    { src: "/assets/images/hopecamp/gratiadei/ELI09793.jpg", span: "col-span-1 row-span-1" },
    { src: "/assets/images/hopecamp/gratiadei/ELI09640.jpg", span: "col-span-1 row-span-1" },
    { src: "/assets/images/hopecamp/gratiadei/ELI00180.jpg", span: "col-span-1 row-span-1" },
  ];

  return (
    <section className="relative bg-frost-light py-20 sm:py-28 overflow-hidden" id="galerie">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-blue-200/15 rounded-full blur-3xl" />

        {/* Floating crystals */}
        <div className="absolute top-32 right-[15%] w-2.5 h-2.5 bg-cyan-300/30 rotate-45 animate-float-slow" />
        <div className="absolute bottom-40 left-[20%] w-2 h-2 bg-blue-300/25 rotate-45 animate-drift animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <span className="text-primary/70 text-sm font-medium tracking-wider uppercase">
              Amintiri
            </span>
          </div>
          <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-4">
            ❄️ Galerie ❄️
          </h2>
          <p className="font-nunito text-foreground/70 max-w-xl mx-auto">
            Momente de neuitat din edițiile anterioare HopeCamp
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto auto-rows-[120px] sm:auto-rows-[150px]">
          {images.map((image, index) => (
            <div
              key={index}
              className={`
                ${image.span}
                relative rounded-2xl overflow-hidden group cursor-pointer
                glass-card hover-ice
                transition-all duration-500
              `}
            >
              <Image
                loading="lazy"
                src={image.src}
                alt={`Galerie imagine ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                className="transition-transform duration-700 group-hover:scale-110"
              />

              {/* Frost overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Frost border */}
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-colors duration-500" />

              {/* Ice crystal on hover */}
              <div className="absolute top-3 right-3 w-2 h-2 bg-white/0 group-hover:bg-white/50 rotate-45 transition-all duration-500 animate-twinkle" />

              {/* View icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="glass rounded-full p-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 sm:mt-16">
          <Button
            size="lg"
            asChild
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 transition-all duration-300 hover:scale-105 rounded-xl"
          >
            <Link
              href="https://princessphoto-ro.wfolio.pro/disk/hope-camp-f9tz0m"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <span>Vezi toate pozele</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

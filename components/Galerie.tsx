"use client";

import Image from "next/image";
import Link from "next/link";

export default function Galerie() {
  const images = [
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-7.jpg",
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-9.jpg",
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-12.jpg",
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-10.jpg",
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-14.jpg",
    "/assets/images/hopecamp/gratiadei/compressed/gratiadei-18.jpg",
  ];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 bg-white" id="galerie">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-archivo text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#1a1a1a] mb-2">
            GALERIE
          </h2>
          <div className="w-16 h-1 bg-[#FFD600] mx-auto" />
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden group cursor-pointer aspect-square ${
                index === images.length - 1 ? "hidden sm:block" : ""
              }`}
            >
              <Image
                loading="lazy"
                src={image}
                alt={`Galerie imagine ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                className={`transition-all duration-500 group-hover:scale-105 ${
                  index % 2 !== 0 ? "grayscale group-hover:grayscale-0" : ""
                }`}
              />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 sm:mt-16">
          <Link
            href="https://drive.google.com/drive/folders/1IciNY7hsz2PV0Na-uhtpwJzDttEKcr-c?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 bg-[#1a1a1a] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#333] transition-colors"
          >
            Vezi toate pozele →
          </Link>
        </div>
      </div>
    </section>
  );
}

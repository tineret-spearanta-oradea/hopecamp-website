"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Galerie() {
  const images = [
    "/assets/images/hopecamp/paxchristi/ZVE07821.jpg",
    "/assets/images/hopecamp/paxchristi/ZVE07869.jpg",
    "/assets/images/hopecamp/paxchristi/ZVE07946.jpg",
    "/assets/images/hopecamp/paxchristi/ZVE08042.jpg",
    "/assets/images/hopecamp/paxchristi/ZVE08798.jpg",
    "/assets/images/hopecamp/paxchristi/ZVE08191.jpg",
    "/assets/images/hopecamp/paxchristi/ZVE08359.jpg",
    "/assets/images/hopecamp/paxchristi/ZVE08650.jpg",
    "/assets/images/hopecamp/paxchristi/9.png",
    "/assets/images/hopecamp/paxchristi/ZVE09213.jpg",
    
  ];

  return (
    <>
      {/* Gallery Section - Updated background and padding */}
      <section className="bg-secondary py-16 sm:py-24">
        <div className="container mx-auto px-4 text-center">
          {/* Updated title styling */}
          <h3 className="font-poppins font-bold uppercase text-foreground text-3xl tracking-wider mb-10 sm:mb-16">
            GALERIE
          </h3>

          {/* Simple Image Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10 sm:mb-16">
            {images.map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-md aspect-square"
              >
                <Image
                  src={src}
                  alt={`Galerie imagine ${index + 1}`}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300 ease-in-out"
                />
              </div>
            ))}
          </div>

          {/* Updated Button */}
          <Button
            variant="default"
            size="lg"
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/galerie">Vezi toată galeria</Link>
          </Button>
        </div>
      </section>
    </>
  );
}

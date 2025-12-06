"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  const navLinks = [
    { href: "/", label: "acasă" },
    // { href: "/inscrie-te", label: "înscrie-te" },
    { href: "/doneaza", label: "donează" },
    { href: "/cont", label: "contul meu" },
    { href: "/galerie", label: "galerie" },
  ];

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
        setIsNearBottom(
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 100
        );
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="bg-primary p-3 block lg:hidden w-full top-0 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-8 h-8"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              viewBox="0 0 16 16"
              className="w-8 h-8"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className={`bg-primary min-h-screen text-white font-bold flex flex-col fixed top-0 left-0 w-full h-full z-50 transition-all duration-600  ${
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full"
          }`}
        >
          <div className="text-5xl flex pt-5 pl-4">
            <button onClick={() => setIsOpen(false)} className="text-white ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-startjustify-start capitalize pl-4 h-full">
            <div className="flex flex-col gap-8 mt-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xl ml-4 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Navbar */}
      <nav
        className={`hidden lg:block fixed w-full z-50 transition-colors duration-300 border-b-2 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-sm text-primary border-primary/20 shadow-lg" 
            : "bg-primary text-white border-white/20"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between text-lg font-inter p-5 gap-5 lg:flex">
          <div className="flex gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-all duration-300 hover:opacity-80 relative group ${
                  isScrolled ? "hover:text-primary/80" : "hover:text-white/80"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>
          {/* <Button variant="default" asChild>
            <Link href="/inscrie-te">
              <p>Înscrie-te</p>
            </Link>
          </Button> */}
        </div>
      </nav>
    </>
  );
}

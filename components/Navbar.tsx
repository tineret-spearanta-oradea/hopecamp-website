"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { href: "/", label: "acasă" },
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
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {/* Mobile Navbar - Glassmorphism */}
      <div className={`
        fixed top-0 left-0 right-0 p-3 block lg:hidden z-50
        transition-all duration-300
        ${isScrolled
          ? "glass-dark shadow-lg"
          : "bg-gradient-to-b from-black/30 to-transparent"
        }
      `}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 glass rounded-xl hover:bg-white/10 transition-colors"
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay - Full Winter Theme */}
      {isOpen && (
        <div
          className={`
            fixed inset-0 z-50
            bg-gradient-to-b from-[#0a1628] via-[#1a3a5c] to-[#0d2847]
            transition-all duration-300
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
        >
          {/* Aurora background effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-cyan-500/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-[400px] h-[200px] bg-gradient-to-l from-purple-500/15 to-transparent rounded-full blur-3xl" />
          </div>

          {/* Close button */}
          <div className="relative z-10 pt-5 px-4">
            <button
              onClick={() => setIsOpen(false)}
              className="text-white glass rounded-xl p-2 hover:bg-white/10 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>

          {/* Navigation links */}
          <div className="relative z-10 flex flex-col items-center justify-center h-[80%] px-4">
            <div className="flex flex-col gap-6">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-2xl text-white/90 hover:text-cyan-200 transition-colors capitalize font-medium text-center"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Decorative ice crystals */}
            <div className="absolute top-[20%] left-[15%] w-2 h-2 bg-white/20 rotate-45 animate-float-slow" />
            <div className="absolute bottom-[30%] right-[20%] w-1.5 h-1.5 bg-cyan-300/30 rotate-45 animate-drift" />
          </div>
        </div>
      )}

      {/* Desktop Navbar - Glassmorphism */}
      <nav
        className={`
          hidden lg:block fixed w-full z-50
          transition-all duration-500
          ${isScrolled
            ? "glass-dark shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/10"
            : "bg-gradient-to-b from-black/40 to-transparent"
          }
        `}
      >
        <div className="container mx-auto flex items-center justify-between text-base font-medium py-4 px-6">
          {/* Logo/Brand area */}
          <Link href="/" className="text-white font-poppins font-bold text-lg hover:text-cyan-200 transition-colors">
            HopeCamp
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 capitalize relative group"
              >
                <span className="relative z-10">{link.label}</span>
                {/* Underline effect */}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>
        </div>

        {/* Frost bottom edge when scrolled */}
        {isScrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />
        )}
      </nav>
    </>
  );
}

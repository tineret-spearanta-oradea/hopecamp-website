"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const navLinks: {
    href: string;
    label: string;
    external?: boolean;
    unavailable?: boolean;
  }[] = [
    { href: "https://tineretsperantaoradea.ro", label: "TSO.RO", external: true },
    { href: "/", label: "acasa" },
    { href: "/doneaza", label: "doneaza" },
    { href: "https://app.camppromax.com/r/tso/hope-camp-7", label: "contul meu", external: true },
  ];

  const registrationUrl = "https://app.camppromax.com/r/tso/hope-camp-7";

  const openUnavailable = () => {
    setIsOpen(false);
    setShowUnavailable(true);
  };

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
      {/* Navbar */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50 px-6 sm:px-12 py-5
          flex justify-between items-center bg-white
          transition-all duration-300
          ${isScrolled ? "border-b-2 border-gray-100" : ""}
        `}
      >
        {/* Left: Cross logo */}
        <Link href="/" className="flex-shrink-0">
          <svg viewBox="0 0 28 40" width="28" height="40">
            <rect x="12" y="0" width="4" height="40" fill="#1a1a2e" />
            <rect x="4" y="8" width="20" height="4" fill="#1a1a2e" />
          </svg>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) =>
            link.unavailable ? (
              <button
                key={link.href}
                onClick={openUnavailable}
                className="text-[13px] font-bold uppercase tracking-wide text-[#1a1a1a] hover:text-gray-500 transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`
                  text-[13px] font-bold uppercase tracking-wide text-[#1a1a1a]
                  hover:text-gray-500 transition-colors
                  ${link.label === "doneaza" ? "border-2 border-[#1a1a1a] px-3.5 py-1.5" : ""}
                `}
              >
                {link.label}
              </Link>
            )
          )}

          {/* CTA button */}
          <Link
            href={registrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#FFD600] border-2 border-[#1a1a1a] px-4 py-2 text-[12px] font-bold uppercase tracking-wide text-[#1a1a1a] hover:opacity-80 transition-opacity"
          >
            Inscrie-te acum
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-[#1a1a1a]"
          aria-label="Toggle menu"
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
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          {/* Mobile menu header */}
          <div className="flex justify-between items-center px-6 sm:px-12 py-5">
            <Link href="/" onClick={() => setIsOpen(false)} className="flex-shrink-0">
              <svg viewBox="0 0 28 40" width="28" height="40">
                <rect x="12" y="0" width="4" height="40" fill="#1a1a2e" />
                <rect x="4" y="8" width="20" height="4" fill="#1a1a2e" />
              </svg>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-[#1a1a1a]"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </button>
          </div>

          {/* Centered navigation links */}
          <div className="flex-1 flex flex-col items-center justify-center gap-8">
            {navLinks.map((link) =>
              link.unavailable ? (
                <button
                  key={link.href}
                  onClick={openUnavailable}
                  className="text-[15px] font-bold uppercase tracking-wide text-[#1a1a1a] hover:text-gray-500 transition-colors"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`
                    text-[15px] font-bold uppercase tracking-wide text-[#1a1a1a]
                    hover:text-gray-500 transition-colors
                    ${link.label === "doneaza" ? "border-2 border-[#1a1a1a] px-3.5 py-1.5" : ""}
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* CTA button */}
            <Link
              href={registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="bg-[#FFD600] border-2 border-[#1a1a1a] px-5 py-3 text-[13px] font-bold uppercase tracking-wide text-[#1a1a1a] hover:opacity-80 transition-opacity"
            >
              Inscrie-te acum
            </Link>
          </div>
        </div>
      )}

      <Dialog open={showUnavailable} onOpenChange={setShowUnavailable}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Înscrierea nu e disponibilă încă</DialogTitle>
            <DialogDescription>
              Revino mai târziu — vom anunța când se deschid înscrierile.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { contactInfo } from "@/lib/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Footer() {
  const [showUnavailable, setShowUnavailable] = useState(false);

  const socialLinks = [
    { href: contactInfo.instagram, icon: "instagram", label: "Instagram" },
    { href: contactInfo.facebook, icon: "facebook", label: "Facebook" },
    { href: contactInfo.whatsapp, icon: "whatsapp", label: "WhatsApp" },
    { href: contactInfo.youtube, icon: "youtube", label: "YouTube" },
  ];

  const openUnavailable = () => setShowUnavailable(true);

  const unavailableLinkClass =
    "block text-[#1a1a1a] text-sm mb-2.5 hover:opacity-60 transition-opacity text-left";

  return (
    <footer>
      {/* Yellow section */}
      <div className="bg-[#FFD600] px-6 sm:px-12 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <svg viewBox="0 0 28 40" width="28" height="40">
              <rect x="12" y="0" width="4" height="40" fill="#1a1a1a" />
              <rect x="4" y="8" width="20" height="4" fill="#1a1a1a" />
            </svg>
            <p className="text-sm text-[#1a1a1a]/60 mt-3 leading-relaxed">
              Tabara de tineret a Bisericii Speranta Oradea.
            </p>
          </div>

          {/* Navigare */}
          <div>
            <h4 className="font-archivo text-xs uppercase tracking-wider mb-4">
              Navigare
            </h4>
            <Link
              href="/"
              className="block text-[#1a1a1a] text-sm mb-2.5 hover:opacity-60 transition-opacity"
            >
              Acasa
            </Link>
            <button
              type="button"
              onClick={openUnavailable}
              className={unavailableLinkClass}
            >
              Despre
            </button>
            <Link
              href="https://app.camppromax.com/r/tso/hope-camp-7"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#1a1a1a] text-sm mb-2.5 hover:opacity-60 transition-opacity"
            >
              Contul meu
            </Link>
          </div>

          {/* Resurse */}
          <div>
            <h4 className="font-archivo text-xs uppercase tracking-wider mb-4">
              Resurse
            </h4>
            <button
              type="button"
              onClick={openUnavailable}
              className={unavailableLinkClass}
            >
              Regulament
            </button>
            <button
              type="button"
              onClick={openUnavailable}
              className={unavailableLinkClass}
            >
              Intrebari frecvente
            </button>
            <Link
              href="/privacy-policy"
              className="block text-[#1a1a1a] text-sm mb-2.5 hover:opacity-60 transition-opacity"
            >
              Politica de Confidentialitate
            </Link>
            <Link
              href="/terms-of-service"
              className="block text-[#1a1a1a] text-sm mb-2.5 hover:opacity-60 transition-opacity"
            >
              Termeni si Conditii
            </Link>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-archivo text-xs uppercase tracking-wider mb-4">
              Social
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center hover:bg-white hover:text-[#1a1a1a] transition-colors"
                  aria-label={social.label}
                >
                  <i className={`bi bi-${social.icon} text-lg`}></i>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dark bottom bar */}
      <div className="bg-[#1a1a1a] px-6 sm:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
        <p>FUNDATIA &quot;BUCURIA SPERANTEI&quot;</p>
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link
            href="https://tineretsperantaoradea.ro"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Tineret Speranta Oradea
          </Link>
        </p>
        <p>
          Made with <span className="text-[#FFD600]">&hearts;</span> for the
          community
        </p>
      </div>

      <Dialog open={showUnavailable} onOpenChange={setShowUnavailable}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Momentan indisponibil</DialogTitle>
            <DialogDescription>
              Revino mai târziu — această secțiune va fi disponibilă în curând.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </footer>
  );
}

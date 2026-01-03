import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/lib/constants";

export default function Footer() {
  const socialLinks = [
    { href: contactInfo.instagram, icon: "instagram", label: "Instagram" },
    { href: contactInfo.facebook, icon: "facebook", label: "Facebook" },
    { href: contactInfo.whatsapp, icon: "whatsapp", label: "WhatsApp" },
    { href: contactInfo.youtube, icon: "youtube", label: "YouTube" },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-[#0a1628] to-[#060d18] pt-16 pb-8 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[200px] bg-gradient-to-b from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-[300px] h-[150px] bg-gradient-to-b from-purple-500/5 to-transparent rounded-full blur-3xl" />

        {/* Ice crystals */}
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-white/10 rotate-45 animate-float-slow" />
        <div className="absolute top-[30%] right-[15%] w-1.5 h-1.5 bg-cyan-300/15 rotate-45 animate-drift" />
      </div>

      {/* Frost top edge */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Logo and Contact */}
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/assets/images/Full_Logo_White_PNG.png"
              alt="HopeCamp Logo"
              width={180}
              height={180}
              className="w-40 h-40 opacity-90"
            />
            <div className="text-center md:text-left -mt-2 space-y-1">
              <p className="text-white/70 text-sm">{contactInfo.email}</p>
              <p className="text-white/70 text-sm">{contactInfo.phone}</p>
            </div>
          </div>

          {/* Links and Social */}
          <div className="flex flex-col items-center md:items-end gap-6">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/privacy-policy"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Politica de Confidențialitate
              </Link>
              <Link
                href="/terms-of-service"
                className="text-white/60 hover:text-white text-sm transition-colors"
              >
                Termeni și Condiții
              </Link>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/70 hover:text-cyan-300 hover:bg-white/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <i className={`bi bi-${social.icon} text-lg`}></i>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs">
          <p>FUNDAȚIA &quot;BUCURIA SPERANȚEI&quot;</p>
          <p>© {new Date().getFullYear()} Tineret Speranta Oradea</p>
          <p className="flex items-center gap-1">
            Made with
            <span className="text-cyan-400">❄️</span>
            for the community
          </p>
        </div>
      </div>
    </footer>
  );
}

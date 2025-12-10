import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/lib/constants";

export default function AboutSection() {
  return (
    <>
    <section className="relative bg-gradient-to-b from-[#0d2847] via-[#1a3a5c] to-[#0d2847] py-20 sm:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[600px] h-[300px] bg-gradient-to-b from-cyan-500/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-gradient-to-t from-purple-500/10 to-transparent rounded-full blur-3xl" />

        {/* Ice crystals */}
        <div className="absolute top-[15%] right-[10%] w-3 h-3 bg-white/15 rotate-45 animate-float-slow" />
        <div className="absolute bottom-[25%] left-[8%] w-2.5 h-2.5 bg-cyan-300/20 rotate-45 animate-drift animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* --- First Row: About Text + Image --- */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16 lg:mb-24">
          {/* About Text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <span className="text-cyan-200 text-sm font-medium tracking-wider uppercase">
                Despre noi
              </span>
            </div>

            <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
              <span className="text-ice">Cine e în spatele</span>
              <br />
              <span className="text-white/90">cortinei?</span>
            </h2>

            <p className="font-nunito text-white/70 leading-relaxed">
              Suntem o comunitate prietenoasă cu impact în Oradea, punând
              accentul pe conducerea tinerilor de la întâlnirea personală spre o
              relație autentică în Hristos. Noi creăm un mediu plăcut tinerilor
              pentru distracție și socializare, dar și un spațiu propice pentru
              închinare și cunoașterea lui Dumnezeu!
            </p>
          </div>

          {/* Image with Glass Frame */}
          <div className="glass-card rounded-3xl p-3 sm:p-4 ice-glow">
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/assets/images/lideri.jpg"
                alt="Echipa Hope Camp"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Wave transition to light section */}
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-full"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C360,80 720,20 1080,60 C1260,80 1380,40 1440,55 L1440,80 L0,80 Z"
            fill="rgba(240, 247, 255, 1)"
          />
        </svg>
      </div>
    </section>

    {/* Contact Section - White background */}
    <section className="relative bg-frost-light py-20 sm:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Frost radial gradient */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl" />

        {/* Decorative ice crystals */}
        <div className="absolute top-20 left-[5%] w-3 h-3 bg-cyan-300/30 rotate-45 animate-float-slow" />
        <div className="absolute bottom-32 right-[10%] w-2.5 h-2.5 bg-blue-300/30 rotate-45 animate-drift animation-delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Contact Section */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-5xl mx-auto">
          {/* Contact Text */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <span className="text-primary/70 text-sm font-medium tracking-wider uppercase">
                Contact
              </span>
            </div>

            <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-4">
              Contactează-ne
            </h2>

            <p className="font-nunito text-foreground/70 leading-relaxed mb-6">
              Ai vreo întrebare legată de regulament? Sau poate vrei să afli mai
              multe despre programul taberei, cazare, transport sau orice alt
              detaliu important? Găsești răspunsuri la secțiunea &ldquo;Întrebări
              frecvente&rdquo;. Dacă nu găsești ceea ce căutai, nu ezita să ne
              contactezi!
            </p>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col gap-4 w-full">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="glass-card rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center transition-all">
                <i className="bi bi-envelope-fill text-xl text-primary transition-colors"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground/50 uppercase tracking-wider">Email</span>
                <span className="font-medium text-foreground transition-colors">
                  {contactInfo.email}
                </span>
              </div>
            </Link>

            <Link
              href={`${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center transition-all">
                <i className="bi bi-whatsapp text-xl text-green-700 transition-colors"></i>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground/50 uppercase tracking-wider">WhatsApp</span>
                <span className="font-medium text-foreground transition-colors">
                  {contactInfo.phone}
                </span>
              </div>
            </Link>

            {/* Social Media Buttons */}
            <div className="flex items-center gap-3 mt-2">
              <Link
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-foreground/70 hover:text-pink-500 hover:bg-white/10 transition-all duration-300"
                aria-label="Instagram"
              >
                <i className="bi bi-instagram text-xl"></i>
              </Link>
              <Link
                href={contactInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-foreground/70 hover:text-blue-600 hover:bg-white/10 transition-all duration-300"
                aria-label="Facebook"
              >
                <i className="bi bi-facebook text-xl"></i>
              </Link>
              <Link
                href={contactInfo.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-xl glass flex items-center justify-center text-foreground/70 hover:text-red-600 hover:bg-white/10 transition-all duration-300"
                aria-label="YouTube"
              >
                <i className="bi bi-youtube text-xl"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
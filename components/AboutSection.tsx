import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/lib/constants";

export default function AboutSection() {
  return (
    <section className="bg-gradient-to-b from-white via-secondary/30 to-white py-16 sm:py-24 border-y-2 border-primary/20">
      {/* Main container */}
      <div className="container mx-auto flex flex-col gap-10 lg:gap-16">
        {/* --- First Row: About Text + Image --- */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* About Text */}
          <div className="flex flex-col items-center text-center gap-3 md:items-start md:text-left">
            <h4 className="font-jersey text-base uppercase text-primary font-semibold tracking-wider relative">
              <span className="relative z-10">✨ DESPRE NOI ✨</span>
            </h4>
            <h2 className="font-poppins uppercase font-bold text-3xl sm:text-4xl text-primary relative">
              <span className="relative z-10">CINE E ÎN SPATELE CORTINEI?</span>
            </h2>
            <p className="font-nunito text-foreground">
              Suntem o comunitate prietenoasă cu impact în Oradea, punând
              accentul pe conducerea tinerilor de la întâlnirea personală spre o
              relație autentică în Hristos. Noi creăm un mediu plăcut tinerilor
              pentru distracție și socializare, dar și un spațiu propice pentru
              închinare și cunoașterea lui Dumnezeu! Lucrăm cu drag și entuziasm
              pentru a oferi experiențe memorabile unde fiecare se simte acasă.
              Aici, fiecare este binevenit și contribuie la o atmosferă plăcută.
            </p>
          </div>
          {/* Image */}
          <div className="overflow-hidden rounded-lg shadow-xl border-2 border-primary/20 ring-1 ring-primary/10">
            <Image
              src="/assets/images/gallery/ZVE08483.jpg"
              alt="Echipa Hope Camp"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* --- Second Row: Contact Links + Contact Text --- */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Contact Links */}
          <div className="flex flex-col gap-4 w-full max-w-80 order-2 md:order-1 md:max-w-full">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-4 flex items-center gap-4 transition-all duration-300 shadow-xl border-2 border-white/30 ring-1 ring-primary/50 hover:scale-[1.02] hover:shadow-2xl hover:border-white/50 w-full group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <i className="bi bi-envelope-fill text-3xl relative z-10 group-hover:scale-110 transition-transform"></i>
              <span className="font-semibold text-lg tracking-wider text-ellipsis overflow-hidden relative z-10">
                {contactInfo.email.toUpperCase()}
              </span>
            </Link>
            <Link
              href={`${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-4 flex items-center gap-4 transition-all duration-300 shadow-xl border-2 border-white/30 ring-1 ring-primary/50 hover:scale-[1.02] hover:shadow-2xl hover:border-white/50 w-full group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <i className="bi bi-whatsapp text-3xl relative z-10 group-hover:scale-110 transition-transform"></i>
              <span className="font-semibold text-lg tracking-wider text-ellipsis overflow-hidden relative z-10">
                {contactInfo.phone}
              </span>
            </Link>
          </div>

          {/* Contact Text */}
          <div className="flex flex-col items-center text-center gap-3 md:items-start md:text-left order-1 md:order-2">
            <h2 className="font-poppins uppercase font-bold text-3xl sm:text-4xl text-primary relative">
              <span className="relative z-10">📧 CONTACTEAZĂ-NE</span>
            </h2>
            <p className="font-nunito text-foreground">
              Ai vreo întrebare legată de regulament? Sau poate vrei să afli mai
              multe despre programul taberei, cazare, transport sau orice alt
              detaliu important? Găsești răspunsuri la secțiunea „Întrebări
              frecvente”. Dacă nu găsești ceea ce căutai, nu ezita să ne
              contactezi!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
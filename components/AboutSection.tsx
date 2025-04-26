import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/lib/constants";
// Removed Button import as it's not used

export default function AboutSection() {
  return (
    // Using bg-white for alternation
    <section className="bg-white py-16 sm:py-24">
      {/* Main container - changed layout approach */}
      <div className="container mx-auto flex flex-col gap-10 lg:gap-16">
        {/* --- First Row: About Text + Image --- */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* About Text */}
          <div className="flex flex-col items-start gap-3">
            <h4 className="text-sm uppercase text-primary font-semibold tracking-wider">
              DESPRE NOI
            </h4>
            <h2 className="font-lemon text-3xl sm:text-4xl text-primary">
              CINE E ÎN SPATELE CORTINEI?
            </h2>
            <p className="font-inter text-foreground">
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
          <div className="overflow-hidden rounded-lg shadow-md">
            <Image
              src="/assets/images/gallery/ZVE08483.jpg" // Using an existing relevant image
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
          <div className="flex flex-col gap-4">
            <Link
              href={`mailto:${contactInfo.email}`}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-4 flex items-center gap-4 transition-colors duration-200 shadow-md"
            >
              <i className="bi bi-envelope-fill text-3xl"></i>
              <span className="font-semibold text-lg tracking-wider">
                {contactInfo.email.toUpperCase()}
              </span>
            </Link>
            <Link
              href={`tel:${contactInfo.phone}`}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-4 flex items-center gap-4 transition-colors duration-200 shadow-md"
            >
              <i className="bi bi-telephone-fill text-3xl"></i>
              <span className="font-semibold text-lg tracking-wider">
                {contactInfo.phone}
              </span>
            </Link>
          </div>
          {/* Contact Text */}
          <div className="flex flex-col items-start gap-3">
            <h2 className="font-lemon text-3xl sm:text-4xl text-primary">
              CONTACTEAZĂ-NE
            </h2>
            <p className="font-inter text-foreground">
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

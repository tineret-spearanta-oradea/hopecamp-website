import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/lib/constants";

export default function AboutSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      {/* Main container */}
      <div className="container mx-auto flex flex-col gap-10 lg:gap-16">
        {/* --- First Row: About Text + Image --- */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* About Text */}
          <div className="flex flex-col items-center text-center gap-3 md:items-start md:text-left">
            <h4 className="font-jersey text-base uppercase text-primary font-semibold tracking-wider">
              DESPRE NOI
            </h4>
            <h2 className="font-poppins uppercase font-bold text-3xl sm:text-4xl text-primary">
              CINE E ÎN SPATELE CORTINEI?
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
          <div className="overflow-hidden rounded-lg shadow-md">
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-4 flex items-center gap-4 transition-colors duration-200 shadow-md w-full"
            >
              <i className="bi bi-envelope-fill text-3xl"></i>
              <span className="font-semibold text-lg tracking-wider text-ellipsis overflow-hidden">
                {contactInfo.email.toUpperCase()}
              </span>
            </Link>
            <Link
              href={`${contactInfo.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-4 flex items-center gap-4 transition-colors duration-200 shadow-md w-full"
            >
              <i className="bi bi-whatsapp text-3xl"></i>
              <span className="font-semibold text-lg tracking-wider text-ellipsis overflow-hidden">
                {contactInfo.phone}
              </span>
            </Link>
          </div>

          {/* Contact Text */}
          <div className="flex flex-col items-center text-center gap-3 md:items-start md:text-left order-1 md:order-2">
            <h2 className="font-poppins uppercase font-bold text-3xl sm:text-4xl text-primary">
              CONTACTEAZĂ-NE
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
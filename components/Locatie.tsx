import { location } from "@/lib/constants";
import Link from "next/link";

export default function Locatie() {
  return (
    <section className="relative bg-frost-light py-20 sm:py-28 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-200/10 rounded-full blur-3xl" />

        {/* Ice crystals */}
        <div className="absolute top-[25%] left-[5%] w-2.5 h-2.5 bg-cyan-300/25 rotate-45 animate-float-slow" />
        <div className="absolute bottom-[20%] right-[8%] w-2 h-2 bg-blue-300/20 rotate-45 animate-drift animation-delay-300" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
              <svg className="w-4 h-4 text-primary/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-primary/70 text-sm font-medium tracking-wider uppercase">
                Locație
              </span>
            </div>

            <h2 className="font-poppins font-bold text-3xl sm:text-4xl md:text-5xl text-primary mb-6">
              Unde mergem anul acesta?
            </h2>

            <p className="font-nunito text-foreground/80 mb-6 leading-relaxed">
              Tabăra se va desfășura în <strong className="text-primary">{location.addressLine}</strong>,
              la <strong className="text-primary">{location.campusName}</strong>, oferind un cadru ideal
              pentru relaxare, reflecție și socializare. Cu aer limpede de
              natură și cu o echipă de prieteni în jur, vei putea trăi cele mai
              intense momente de vacanță.
            </p>

            <Link
              href={location.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-cyan-600 transition-colors font-medium"
            >
              <span>Vezi pe Google Maps</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>

          {/* Map Container with Glass Frame */}
          <div className="w-full lg:w-1/2">
            <div className="glass-card rounded-3xl p-3 sm:p-4 ice-glow">
              <iframe
                className="rounded-2xl w-full h-64 sm:h-72 md:h-80 lg:h-96"
                src={location.iframeSrc}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

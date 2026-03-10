import { location } from "@/lib/constants";
import Link from "next/link";

export default function Locatie() {
  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-archivo text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-[#1a1a1a] mb-4">
            Locatie:<br/><span className="text-[#FFD600]">{location.name}</span>, {location.addressLine}
          </h2>
          <p className="text-gray-500 leading-relaxed mb-8">
            Tabara se desfasoara la {location.campusName}, in {location.addressLine}. Un loc perfect pentru aventura, liniste si comunitate crestina autentica.
          </p>
          <Link href={location.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-3.5 bg-[#1a1a1a] text-white text-sm font-bold uppercase tracking-wider hover:bg-[#333] transition-colors">
            Vezi pe Google Maps →
          </Link>
        </div>
        <div>
          {location.iframeSrc ? (
            <iframe className="w-full h-72 sm:h-80 lg:h-96 border-2 border-gray-200" src={location.iframeSrc} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          ) : (
            <div className="w-full h-72 sm:h-80 lg:h-96 border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
              [ Google Maps Embed ]
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

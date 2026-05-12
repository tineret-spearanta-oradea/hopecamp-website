import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/lib/constants";

export default function AboutSection() {
  return (
    <>
      {/* About Section */}
      <section className="bg-white py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* About Text */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="font-archivo uppercase font-bold text-3xl sm:text-4xl md:text-5xl text-black mb-6 leading-tight">
                Tineret Speranta Oradea
              </h2>

              <p className="text-neutral-600 leading-relaxed">
                Vrem o comunitate daruita, care se inchina autentic si are impact real in propria generatie. Mai multe pe{" "}
                <Link
                  href="https://tineretsperantaoradea.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-500 hover:text-yellow-600 underline transition-colors"
                >
                  website-ul nostru
                </Link>
                .
              </p>
            </div>

            {/* Team Image */}
            <div className="border-2 border-black rounded-xl p-3">
              <div className="overflow-hidden rounded-lg">
                <Image
                  src="/assets/images/hopecamp/gratiadei/compressed/gratiadei-13.jpg"
                  alt="Echipa Hope Camp"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#fafafa] py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-5xl mx-auto">
            {/* Contact Text */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <h2 className="font-archivo uppercase font-bold text-3xl sm:text-4xl md:text-5xl text-black mb-4">
                Contacteaza-ne
              </h2>

              <p className="text-neutral-600 leading-relaxed mb-6">
                Ai vreo intrebare legata de regulament? Sau poate vrei sa afli mai
                multe despre programul taberei, cazare, transport sau orice alt
                detaliu important? Gasesti raspunsuri la sectiunea &ldquo;Intrebari
                frecvente&rdquo;. Daca nu gasesti ceea ce cautai, nu ezita sa ne
                contactezi!
              </p>
            </div>

            {/* Contact Links */}
            <div className="flex flex-col gap-4 w-full">
              <Link
                href={`mailto:${contactInfo.email}`}
                className="border-2 border-neutral-200 rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-black group bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                  <i className="bi bi-envelope-fill text-xl text-black"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Email</span>
                  <span className="font-medium text-black">
                    {contactInfo.email}
                  </span>
                </div>
              </Link>

              <Link
                href={`${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-neutral-200 rounded-xl p-5 flex items-center gap-4 transition-all duration-300 hover:border-black group bg-white"
              >
                <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
                  <i className="bi bi-whatsapp text-xl text-black"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">WhatsApp</span>
                  <span className="font-medium text-black">
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
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300"
                  aria-label="Instagram"
                >
                  <i className="bi bi-instagram text-xl"></i>
                </Link>
                <Link
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300"
                  aria-label="Facebook"
                >
                  <i className="bi bi-facebook text-xl"></i>
                </Link>
                <Link
                  href={contactInfo.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all duration-300"
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

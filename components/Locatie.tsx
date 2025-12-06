import { location } from "@/lib/constants";

export default function Locatie() {
  return (
    <>
      <section className="bg-gradient-to-b from-white via-secondary/30 to-white py-16 sm:py-32 border-y-2 border-primary/20">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="w-full text-center  md:text-start lg:w-1/2 flex flex-col gap-5">
            <h4 className="font-jersey text-base uppercase text-primary font-semibold tracking-wider relative">
              <span className="relative z-10">📍 Locație</span>
            </h4>
            <h2 className="text-primary font-poppins uppercase font-bold text-3xl sm:text-4xl md:text-5xl drop-shadow-sm relative">
              <span className="relative z-10">Unde mergem anul acesta?</span>
            </h2>
            <p className="font-nunito">
              Tabăra se va desfășura în <strong>{location.addressLine}</strong>,
              la <strong>{location.campusName}</strong>, oferind un cadru ideal
              pentru relaxare, reflecție și socializare. Cu aer limpede de
              natură și cu o echipă de prieteni în jur, vei putea trăi cele mai
              intense momente de vacanță.
            </p>
          </div>

          <div className="w-full lg:w-1/2 h-auto order-first md:order-last">
            <iframe
              className="rounded-lg w-full h-64 sm:h-72 md:h-80 lg:h-96 shadow-xl border-2 border-primary/20 ring-1 ring-primary/10"
              src={location.iframeSrc}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}

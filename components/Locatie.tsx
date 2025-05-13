export default function Locatie() {
  return (
    <>
      <section className="bg-white py-16 sm:py-32">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="w-full text-center  md:text-start lg:w-1/2 flex flex-col gap-5">
            <h4 className="font-jersey text-base uppercase text-primary font-semibold tracking-wider">
              Locație
            </h4>
            <h2 className="text-primary font-poppins uppercase font-bold text-3xl sm:text-4xl md:text-5xl">
              Unde mergem anul acesta?
            </h2>
            <p className="font-nunito">
              Tabăra se va desfășura în localitatea Mărișel din județul Cluj, la
              Campus Mărișel, oferind un cadru ideal pentru relaxare, reflecție
              și socializare. Cu aer limpede de natură și cu o echipă de
              prieteni în jur, vei putea trăi cele mai intense momente de
              vacanță.
            </p>
          </div>

          <div className="w-full lg:w-1/2 h-auto order-first md:order-last">
            <iframe
              className="rounded-lg w-full h-64 sm:h-72 md:h-80 lg:h-96"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2736.3146723274435!2d23.183039977602224!3d46.699525571121065!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47491e408ad19e71%3A0x5ac3f5b1a6fb26a3!2zQ2FtcHVzIE3Eg3JpyJllbA!5e0!3m2!1sro!2sro!4v1733930231713!5m2!1sro!2sro"
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

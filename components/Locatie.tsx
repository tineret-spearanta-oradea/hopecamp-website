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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11134.621256157536!2d22.135968478728515!3d45.75805570813609!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x474fafec73045557%3A0x446e222c52488df1!2sPrecept%20Ministries%20Rom%C3%A2nia!5e0!3m2!1sro!2sro!4v1746890986650!5m2!1sro!2sro"
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

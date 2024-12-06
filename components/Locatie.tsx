export default function Locatie() {
  return (
    <>
      <section className="bg-hope-lightcyan py-16 sm:py-32">
        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="w-full text-center  md:text-start lg:w-1/2 flex flex-col gap-5">
            <h2 className="text-white font-lemon text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
              Locație
            </h2>
            <p className="text-white">
              Tabăra se va desfășura în localitatea Mărișel din județul Cluj,
              oferind un cadru ideal pentru relaxare, reflecție și socializare.
              Cu aer limpede de natură și cu o echipă de prieteni în jur, vei
              putea trăi cele mai intense momente de vacanță.
            </p>
          </div>

          <div className="w-full lg:w-1/2 h-auto order-first md:order-last">
            <iframe
              className="rounded-lg w-full h-64 sm:h-72 md:h-80 lg:h-96"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d43801.21619082106!2d23.06572053848899!3d46.67463137714606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4748e011acc19fc7%3A0x7dc385dce379b5f9!2zNDA3MzkwIE3Eg3JpyJllbA!5e0!3m2!1sro!2sro!4v1733436475914!5m2!1sro!2sro"
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

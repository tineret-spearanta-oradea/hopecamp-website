import YoutubeVideo from "./YoutubeVideo";

function LocationSection() {
  return (
    <>
      <section className="py-14">
        <div className="flex justify-center lg:pt-14 lg:pb-32">
          <YoutubeVideo />
        </div>
        <div className="spacer location-divider-up z-0 relative inset-0" />
        <div className="bg-hope-darkcyan">
          <div className="container mx-auto flex flex-col items-center py-14 px-8 gap-5 sm:py-8 lg:flex-row lg:justify-around lg:gap-0 xl:py-0">
            <div className="flex flex-col items-center gap-3 lg:items-start lg:order-last">
              <h2 className="text-white text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
                Locație
              </h2>
              <p className="text-white text-center  max-w-sm sm:text-sm md:max-w-md md:text-md lg:max-w-lg lg:text-lg lg:text-start xl:max-w-xl xl:text-xl">
              Tabăra se va desfășura în localitatea Someșu Rece din județul Cluj, oferind un cadru ideal pentru relaxare, reflecție și socializare. Cu peisaje fermecătoare și atmosferă relaxantă, vei avea ocazia să te reconectezi cu &ldquo;tine din vacanță&ldquo; 🤭 și să îți încarci bateriile în mijlocul naturii. În plus, atmosfera prietenoasă și plină de bucurie a taberei va facilita interacțiunea și legăturile cu ceilalți participanți, creând amintiri de neuitat și relații noi.
              </p>
            </div>
            <iframe
              className="w-60 h-60 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-100 xl:h-100"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2736.6649349845015!2d23.311087599999997!3d46.692613699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4749196164acd61d%3A0x8b3cca28a1e12774!2sComplex%20Turistic%20Puiu!5e0!3m2!1sro!2sro!4v1714846979815!5m2!1sro!2sro"
            ></iframe>
          </div>
        </div>
        <div className="spacer location-divider-down" />
      </section>
    </>
  );
}

export default LocationSection;

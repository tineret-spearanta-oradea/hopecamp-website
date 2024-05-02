function LocationSection() {
  return (
    <>
      <section>
        <div className="px-8 flex justify-center">
          <div className="bg-hope-orange w-full max-w-2xl h-32 z-10 relative -mb-10 sm:h-36 md:h-44 md:-mb-14 lg:h-60 lg:-mb-24 xl:h-72 2xl:h-80"></div>
        </div>
        <div className="spacer location-divider-up z-0 relative inset-0" />
        <div className="bg-hope-darkcyan">
          <div className="container mx-auto flex flex-col items-center py-14 px-8 gap-5 sm:py-8 lg:flex-row lg:justify-around lg:gap-0 xl:py-0">
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <h2 className="text-white text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
                Locație
              </h2>
              <p className="text-white text-center  max-w-sm sm:text-sm md:max-w-md md:text-md lg:max-w-lg lg:text-lg lg:text-start xl:max-w-xl xl:text-xl">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi
                dolore mollitia, numquam nesciunt omnis est excepturi nostrum.
                Tempora debitis veniam nihil eos? Tempora, dignissimos ducimus
                quidem corporis pariatur deserunt blanditiis?
              </p>
            </div>
            <iframe
              className="w-60 h-60 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2716.698588278047!2d21.92494277665897!3d47.08537407114672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47464867544e469b%3A0x4c81f617c162bed1!2sBiserica%20Penticostala%20Speran%C8%9Ba!5e0!3m2!1sro!2sro!4v1714657201589!5m2!1sro!2sro"
            ></iframe>
          </div>
        </div>
        <div className="spacer location-divider-down" />
      </section>
    </>
  );
}

export default LocationSection;

function AboutSection() {
  return (
    <>
      <section className="py-14 px-8">
        <div className="container mx-auto flex flex-col items-center justify-around gap-5 lg:flex-row">
          <div className="flex flex-col items-center lg:items-start gap-5">
            <h2 className="text-hope-blackcyan text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              Despre noi
            </h2>
            <p className="text-hope-blackcyan text-center max-w-sm sm:text-sm md:max-w-md md:text-md lg:max-w-lg lg:text-lg lg:text-start xl:max-w-xl xl:text-xl">
              Bine ai venit în minunata noastră comunitate plină de entuziasm și
              bucurie! 🎉 Suntem echipa taberei crestine din cadrul Tineret
              Speranța Oradea, alcătuită din tineri din diverse biserici locale.
              Ne-am unit cu viziunea de a crea un mediu plăcut lui Dumnezeu și
              propice pentru socializare! 🙏 Lucrăm cu drag și entuziasm pentru
              a oferi experiențe memorabile și motivate, unde fiecare se simte
              acasă. Aici, fiecare este binevenit și contribuie la o atmosferă
              plăcută. Te așteptăm să ni te alături și să creăm împreună
              amintiri frumoase și momente spirituale de neuitat! 🌟
            </p>
          </div>
          <div
            className="h-40 w-full max-w-xl rounded-lg bg-center bg-no-repeat bg-cover lg:h-96 lg:w-1/2 xl:h-96"
            style={{
              backgroundImage: "url('/assets/images/gallery/ZVE03429.jpg')",
            }}
          />
        </div>
      </section>
    </>
  );
}

export default AboutSection;

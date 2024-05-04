import FilledButton from "../general-components/FilledButton";
import "/src/styles/dividers.css";

function HeroSection() {
  return (
    <>
      <section className="bg-hope-beige py-14 px-8">
        <div className="container mx-auto flex flex-col justify-center items-center gap-2 lg:gap-4">
          <h1 className="text-hope-darkcyan text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            HopeCamp
          </h1>
          <p className="text-black text-center text-sm font-medium max-w-44 sm:text-base  lg:text-lg lg:max-w-lg xl:text-xl 2xl:text-2xl">
            Tabăra pe care nu vrei să o ratezi
          </p>
          <p className="text-hope-lightcyan font-black text-3xl lg:text-5xl xl:text-7xl">
            00:00:00
          </p>
          <div className="pt-10">
            <FilledButton text="Înscrie-te" route="/login" />
          </div>
        </div>
      </section>
      <div className="spacer hero-divider"></div>
    </>
  );
}
export default HeroSection;

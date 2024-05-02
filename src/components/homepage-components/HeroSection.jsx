import FilledButton from "../general-components/FilledButton";
import '/src/styles/dividers.css'

function HeroSection() {
  return (
    <>
      <section className="bg-hope-beige py-14 px-10">
        <div className="container mx-auto flex flex-col justify-center items-center gap-5">
          <h1 className="text-hope-darkcyan text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">HopeCamp</h1>
          <p className="text-black text-center text-sm font-semibold max-w-44 sm:text-sm md:text-md lg:text-lg lg:max-w-lg xl:text-xl 2xl:text-2xl">
            The one camp you don&apos;t want to miss
          </p>
          <FilledButton text="Înscrie-te" />
        </div>
      </section>
      <div className="spacer hero-divider"></div>
    </>
  );
}
export default HeroSection;

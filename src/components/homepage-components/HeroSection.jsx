import FilledButton from "../general-components/FilledButton";
import '/src/styles/dividers.css'

function HeroSection() {
  return (
    <>
      <section className="bg-hope-beige py-14 px-10">
        <div className="container mx-auto flex flex-col justify-center items-center gap-5">
          <h1 className="text-hope-darkcyan text-3xl font-black">HopeCamp</h1>
          <p className="text-black text-center font-semibold max-w-52">
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

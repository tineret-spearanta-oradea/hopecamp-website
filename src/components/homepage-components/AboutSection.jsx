function AboutSection() {
  return (
    <>
      <section className="py-14 px-8">
        <div className="container mx-auto flex flex-col items-center justify-around gap-5 lg:flex-row">
          <div className="flex flex-col items-center lg:items-start gap-5">
            <h2 className="text-black text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              Despre noi
            </h2>
            <p className="text-center font-medium max-w-sm sm:text-sm md:max-w-md md:text-md lg:max-w-lg lg:text-lg lg:text-start xl:max-w-xl xl:text-xl">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quod
              porro sapiente doloremque, beatae necessitatibus libero. Debitis
              error atque iste alias, distinctio doloribus magni, doloremque,
              fuga odit odio quam vero?
            </p>
          </div>
          <div
            className="h-40 w-full max-w-xl rounded-lg bg-center bg-no-repeat bg-cover lg:h-80 lg:w-1/2 xl:h-96"
            style={{
              backgroundImage: "url('/src/assets/images/ZVE03429.jpg')",
            }}
          />
        </div>
      </section>
    </>
  );
}

export default AboutSection;

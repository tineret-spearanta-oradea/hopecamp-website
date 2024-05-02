function AboutSection() {
  return (
    <>
      <section className="px-5">
        <div className="container mx-auto flex flex-col items-center gap-5">
          <h2 className="text-black text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            Despre noi
          </h2>
          <p className="text-center font-medium max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quod
            porro sapiente doloremque, beatae necessitatibus libero. Debitis
            error atque iste alias, distinctio doloribus magni, doloremque, fuga
            odit odio quam vero?
          </p>
          <div
            className="h-32 w-full max-w-xl rounded-lg"
            style={{
              backgroundImage: "url('/src/assets/images/ZVE03429.jpg')",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          />
        </div>
      </section>
    </>
  );
}

export default AboutSection;

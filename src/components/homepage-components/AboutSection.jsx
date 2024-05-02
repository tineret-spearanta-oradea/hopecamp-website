function AboutSection() {
  return (
    <>
      <section className="px-5">
        <div className="container mx-auto flex flex-col items-center gap-5">
          <h2 className="text-black text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
            Despre noi
          </h2>
          <p className="text-center font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic quod
            porro sapiente doloremque, beatae necessitatibus libero. Debitis
            error atque iste alias, distinctio doloribus magni, doloremque, fuga
            odit odio quam vero?
          </p>
        </div>
        
        <div
          className="h-32"
          style={{
            backgroundImage: "url('/src/assets/images/ZVE03429.jpg')",
            backgroundPosition: "center",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        />
      </section>
    </>
  );
}

export default AboutSection;

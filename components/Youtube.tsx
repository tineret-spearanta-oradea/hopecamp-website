export default function Youtube() {
    return(<>
    <section className="bg-white pb-32 relative">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="bg-hope-orange rounded-lg w-64 h-52 sm:w-80 sm:h-52 md:w-96 md:h-64 lg:w-1/2 lg:h-80 xl:h-96 2xl:h-96 flex justify-center items-center relative z-10">
            <iframe
              className="w-56 h-44 sm:w-72 sm:h-44 md:w-80 md:h-52 lg:w-full lg:px-5 lg:h-72 xl:h-80 2xl:h-80"
              src="https://www.youtube.com/embed/POM5iyjIf9g?si=CtWh5yZce36Fkktc"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      </section>
    </>)
}
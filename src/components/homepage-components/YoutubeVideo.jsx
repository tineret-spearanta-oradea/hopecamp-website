export default function YoutubeVideo() {
  return (
    <>
      <div className="bg-hope-orange flex  justify-center items-center rounded-lg w-80 h-52 z-10 max-w-2xl relative -mb-10 sm:w-80 sm:h-52 md:w-96 md:h-64 md:-mb-14 lg:w-1/2 lg:h-80 lg:mb-0 xl:h-96 2xl:h-96">
        <iframe
          className=" w-72 h-44 sm:w-72 sm:h-44 md:w-80 md:h-52 lg:w-full lg:px-5 lg:h-72 xl:h-80 2xl:h-80"
          src="https://www.youtube.com/embed/ijG3dMxv95c?si=z1ky1-dAkml-Y8wL"
          // TODO: Add this to galery https://www.youtube.com/embed/Mf2VL8RWjq0?si=ZGsuLUM_za1veZvy
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen={true}
        ></iframe>
      </div>
    </>
  );
}

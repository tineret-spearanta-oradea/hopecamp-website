export default function YoutubeVideo() {
  return (
    <>
      <div className="bg-hope-orange rounded-lg w-60  h-52 z-10 relative -mb-10 sm:h-52 sm:w-80 md:h-52 md:w-96 md:-mb-14 lg:h-60 lg:-mb-24 xl:h-72 2xl:h-80">
        <iframe
          className=" rounded-lg w-60  h-52 z-10 relative -mb-10 sm:h-52 sm:w-80 md:h-52 md:w-96 md:-mb-14 lg:h-60 lg:-mb-24 xl:h-72 2xl:h-80"
          src="https://www.youtube.com/embed/Mf2VL8RWjq0?si=ZGsuLUM_za1veZvy"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    </>
  );
}

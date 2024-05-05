import { Link } from "react-router-dom";
export default function JoinWhatsappSection() {
  return (
    <>
      <section className="flex justify-center items-center py-14">
        <div className="bg-hope-darkcyan flex items-center justify-around rounded-lg w-60 h-32 sm:w-80 sm:h-40 md:w-96 md:h-52 lg:w-80 lg:h-48 xl:w-96 xl:h-60">
          <div className="bg-hope-orange flex items-center justify-center w-28 h-28 rounded-lg bg-center bg-no-repeat bg-cover sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-32 lg:h-32 xl:w-44 xl:h-44">
            <div
              className="w-24 h-24 rounded-lg bg-center bg-no-repeat bg-cover sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-28 lg:h-28 xl:w-40 xl:h-40"
              style={{
                backgroundImage: "url('/src/assets/images/logo-tso.png')",
              }}
            />
          </div>
          <div className="flex flex-col justify-around items-start gap-2">
            <p className="text-white text-xl font-semibold sm:text-2xl md:text-3xl">
              Alătură-te
              <br />
              comunitații
            </p>
            <Link className="bg-hope-orange text-white text-base font-semibold rounded-lg px-8 py-2 lg:text-xl">
              join
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router-dom";
import { contactInfo } from "../../constants";

export default function JoinSocialsSection() {
  return (
    <>
      <div
        className="mb-10 w-60 h-32 sm:w-80 sm:h-40 md:w-96 md:h-52 lg:w-80 lg:h-48 xl:w-96 xl:h-60 mx-auto bg-gradient-to-r 
                    from-hope-darkcyan  to-hope-orange shadow-lg p-0.5 rounded-lg"
      >
        <div class="h-full w-full bg-hope-beige flex flex-col justify-center items-center content-center rounded-lg">
          <p className="text-hope-blackcyan text-xl font-bold sm:text-2xl md:text-3xl mb-2">
            Urmăreşte-ne!
          </p>
          <div className="flex items-center gap-4 text-hope-blackcyan ">
            <span className="text-xl hover:text-hope-orange">
              <Link to={contactInfo.instagram}>
                <i className="bi bi-instagram"></i>
              </Link>
            </span>
            <span className="text-xl hover:text-hope-orange">
              <Link to={contactInfo.facebook}>
                <i className="bi bi-facebook"></i>
              </Link>
            </span>
            <span className="text-xl hover:text-hope-orange">
              <Link to={contactInfo.whatsappCommunity}>
                <i className="bi bi-whatsapp"></i>
              </Link>
            </span>
            <span className="text-xl hover:text-hope-orange">
              <Link to={contactInfo.youtube}>
                <i className="bi bi-youtube"></i>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

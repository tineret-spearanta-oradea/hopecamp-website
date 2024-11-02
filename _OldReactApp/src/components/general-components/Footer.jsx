import FilledButton from "./FilledButton";
import { pages, contactInfo } from "../../constants";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <>
      <div className="spacer schedule-divider-up"></div>
      <footer className="bg-hope-beige">
        <div className="container mx-auto flex flex-col justify-around gap-5 px-8 py-4 sm:flex-row">
          <div className="flex flex-col items-center gap-5">
            <img
              src="/assets/images/footer-logo.png"
              alt="footer logo"
              className="lg:h-24"
            />
            <div className="text-sm sm:text-base md:text-lg lg:text-xl">
              <p className="text-hope-blackcyan text-center sm:text-left font-medium">
                {contactInfo.email}
              </p>
              <p className="text-hope-blackcyan text-center sm:text-left font-medium">
                {contactInfo.phone}
              </p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-5 sm:flex-col">
            <FilledButton text="Înscrie-te" route={pages.register} />
            <div className="flex items-center gap-2">
              <span className="text-hope-blackcyan text-xl">
                <Link to={contactInfo.instagram}>
                  <i className="bi bi-instagram"></i>
                </Link>
              </span>
              <span className="text-hope-blackcyan text-xl">
                <Link to={contactInfo.facebook}>
                  <i className="bi bi-facebook"></i>
                </Link>
              </span>
              <span className="text-hope-blackcyan text-xl">
                <Link to={contactInfo.whatsapp}>
                  <i className="bi bi-whatsapp"></i>
                </Link>
              </span>
              <span className="text-hope-blackcyan text-xl">
                <Link to={contactInfo.youtube}>
                  <i className="bi bi-youtube"></i>
                </Link>
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-center  pt-2">
          <p className="text-hope-darkcyan text-xs text-center mb-2 mt-5">
            &#169; 2024 copyright
            <br /> Tineret Speranta Oradea
          </p>
        </div>
      </footer>
    </>
  );
}

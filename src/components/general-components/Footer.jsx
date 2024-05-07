import FilledButton from "./FilledButton";
import { pages } from "../../constants";

export default function Footer() {
  return (
    <>
      <div className="spacer schedule-divider-up"></div>
      <footer className="bg-hope-beige">
        <div className="container mx-auto flex flex-col justify-around gap-5 px-8 py-14 sm:flex-row">
          <div className="flex flex-col items-center gap-5">
            <img
              src="./assets/images/footer-logo.png"
              alt="footer logo"
              className="lg:h-24"
            />
            <div className="text-sm sm:text-base md:text-lg lg:text-xl">
              <p className="text-center sm:text-left font-medium">
                tsomediateam@gmail.com
              </p>
              <p className="text-center sm:text-left font-medium">0756433838</p>
            </div>
          </div>
          <div className="flex justify-center items-center gap-5 sm:flex-col">
            <FilledButton text="Înscrie-te" route={pages.register} />
            <div className="flex items-center gap-2">
              <span className="text-xl">
                <i className="bi bi-instagram"></i>
              </span>
              <span className="text-xl">
                <i className="bi bi-facebook"></i>
              </span>
              <span className="text-xl">
                <i className="bi bi-whatsapp"></i>
              </span>
              <span className="text-xl">
                <i className="bi bi-youtube"></i>
              </span>
            </div>
          </div>
          {/* <div className="flex justify-between pt-12">
            <p className="text-sm">2024 copyright</p>
            <p className="text-sm">Tineret Speranta Oradea</p>
        </div> */}
        </div>
      </footer>
    </>
  );
}

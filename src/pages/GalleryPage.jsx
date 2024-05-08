import Navbar from "../components/general-components/Navbar";
import GalleryCard from "../components/gallery-components/GalleryCard";
import Footer from "../components/general-components/Footer";

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <section>
        <div className="p-10 bg-hope-beige flex-1 justify-center items-center text-center">
          <div className="text-4xl font-bold text-hope-darkcyan">
            Galerie - tabere trecute
          </div>
        </div>
        <div className="spacer button-divider-down" />
      </section>
      <section>
        <div className="flex-1 justify-center mt-10 flex flex-col items-center lg:flex-row">
          <GalleryCard
            imageUrl={"/assets/images/gallery/HC4.jpg"}
            title={"Hope Camp #4"}
            description={"Aprins - iulie 2023, Arieșeni"}
            buttonUrl={
              "https://drive.google.com/drive/folders/1zQv3lSDOoOXek6A79AurpHQg2VYnd7Qv?usp=drive_link"
            }
          />
          <GalleryCard
            imageUrl={"/assets/images/gallery/HC3.jpg"}
            title={"Hope Camp #3"}
            description={"Imitatio Christi - iulie 2022, Lacul Surduc"}
            buttonUrl={
              "https://drive.google.com/drive/folders/1CQ6wtsYh7XfsQGBaRZpDSOwPtZkjrupE?usp=drive_link"
            }
          />
          <GalleryCard
            imageUrl={"/assets/images/gallery/HC2.jpg"}
            title={"Hope Camp #2.1"}
            description={"euCRED - iulie 2021, Lacul Surduc"}
            buttonUrl={
              "https://drive.google.com/drive/folders/1qpsH-D8pn3VRIv7KY6paIYG6dLbFu-4h?usp=drive_link"
            }
          />
        </div>
      </section>
      <Footer />
    </>
  );
}

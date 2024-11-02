"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-hope-beige">
      <Navbar />
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 pt-20 pb-32">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-hope-darkcyan">
            Hope Camp #5
          </h1>
          <p className="text-xl text-hope-orange">
            17-22 iulie @ Someșu Rece - Cluj
          </p>
          <p className="text-hope-darkcyan text-lg">
            Tabăra pe care nu vrei să o ratezi
          </p>
          <Button
            variant="default"
            className="bg-hope-orange hover:bg-hope-orange/90 text-white rounded-full px-8 py-6 text-lg mt-4"
            asChild
          >
            <Link
              href="https://drive.google.com/drive/u/1/folders/1eh_ifVkcLBtLQSwsrnO7iNoe1uyUpyj_"
              target="_blank"
            >
              GALERIE HC#5
            </Link>
          </Button>
          <p className="text-sm text-hope-darkcyan/80 mt-2">
            Apasă butonul de mai sus pentru a vedea galeria din tabără!
          </p>
        </div>
      </section>
      {/* Wave transition */}
      <div className="w-full">
        <svg
          viewBox="0 0 1440 320"
          className="w-full block"
          preserveAspectRatio="none"
          fill="#FFFFFF"
        >
          <path d="M0,96L80,106.7C160,117,320,139,480,133.3C640,128,800,96,960,101.3C1120,107,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
      {/* About Section */}
      <section className="bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 max-w-2xl">
              <h2 className="text-4xl font-bold text-hope-darkcyan mb-6">
                Despre noi
              </h2>
              <p className="text-hope-darkcyan text-lg leading-relaxed">
                Bine ai venit în comunitatea noastră de tineri pasionați și
                plini de energie. Suntem echipa taberei creștine Hope Camp din
                cadrul Tineret Speranța Oradea, alcătuită din tineri din diverse
                biserici locale. 🙏
                <br />
                <br />
                Noi creăm un mediu plăcut tinerilor pentru distracție și
                socializare, dar și un spațiu propice pentru închinare și
                cunoașterea lui Dumnezeu! Lucrăm cu drag și entuziasm pentru a
                oferi experiențe memorabile unde fiecare se simte acasă. Aici,
                fiecare este binevenit și contribuie la o atmosferă plăcută.
                <br />
                <br />
                Scopul nostru este ca tinerii să aibă o experiență personală și
                autentică cu Dumnezeu, să-L aleagă pe Hristos ca Domn al vieții
                personale și să crească spiritual prin ucenicie. Te așteptăm să
                ni te alături și să creăm împreună amintiri frumoase și momente
                spirituale de neuitat!🌟
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="w-full max-w-xl">
                <Image
                  src="/assets/images/gallery/ZVE03429.jpg"
                  alt="Group photo from Hope Camp"
                  width={600}
                  height={400}
                  className="rounded-lg w-full h-auto object-cover shadow-lg"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Wave transition */}
      <div className="w-full bg-white">
        <svg
          viewBox="0 0 1440 320"
          className="w-full block"
          preserveAspectRatio="none"
          fill="#FFF0C8"
        >
          <path d="M0,96L80,106.7C160,117,320,139,480,133.3C640,128,800,96,960,101.3C1120,107,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
      {/* Join Socials Section */}
      <section className="bg-hope-beige">
        <div className="container mx-auto flex justify-center py-8">
          <div className="relative group">
            <div className="absolute inset-0.5 bg-gradient-to-r from-hope-darkcyan to-hope-orange rounded-lg blur opacity-75 "></div>
            <div
              className="w-60 h-32 sm:w-80 sm:h-40 md:w-96 md:h-52 lg:w-80 lg:h-48 xl:w-96 xl:h-60 
                          bg-hope-beige relative rounded-lg flex flex-col justify-center items-center"
            >
              <h3 className="text-hope-darkcyan text-xl font-bold sm:text-2xl md:text-3xl mb-4">
                Urmărește-ne!
              </h3>
              <div className="flex items-center gap-6">
                <Link
                  href="https://www.instagram.com/hopecamp"
                  className="text-hope-darkcyan hover:text-hope-orange transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </Link>
                <Link
                  href="https://www.facebook.com/hopecamp"
                  className="text-hope-darkcyan hover:text-hope-orange transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
                  </svg>
                </Link>
                <Link
                  href="https://chat.whatsapp.com/hopecamp"
                  className="text-hope-darkcyan hover:text-hope-orange transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.youtube.com/hopecamp"
                  className="text-hope-darkcyan hover:text-hope-orange transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Wave transition */}
      <div className="w-full bg-hope-beige">
        <svg
          viewBox="0 0 1440 320"
          className="w-full block"
          preserveAspectRatio="none"
          fill="#FFFFFF"
        >
          <path d="M0,96L80,106.7C160,117,320,139,480,133.3C640,128,800,96,960,101.3C1120,107,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>
      {/* Gallery Section */}
      <section className="bg-white">
        <div className="container mx-auto py-16">
          <h2 className="text-4xl font-bold text-hope-darkcyan text-center mb-12">
            Galerie
          </h2>

          <div className="flex justify-center mb-12">
            <div className="grid grid-cols-2 gap-3 max-w-[1000px]">
              <div className="flex flex-col gap-3">
                <div className="w-32 h-24 sm:w-44 sm:h-32 md:w-48 md:h-36 lg:w-56 lg:h-40 xl:w-64 xl:h-48">
                  <Image
                    src="/assets/images/gallery/DSC09815.jpg"
                    alt="Hope Camp Photo 1"
                    width={600}
                    height={400}
                    className="rounded-lg w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="w-32 h-52 sm:w-44 sm:h-60 md:w-48 md:h-64 lg:w-56 lg:h-72 xl:w-64 xl:h-80">
                  <Image
                    src="/assets/images/gallery/DSC_6819.jpg"
                    alt="Hope Camp Photo 2"
                    width={600}
                    height={800}
                    className="rounded-lg w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="w-32 h-32 sm:w-44 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-64 xl:w-64 xl:h-72">
                  <Image
                    src="/assets/images/gallery/DSC09865.jpg"
                    alt="Hope Camp Photo 3"
                    width={600}
                    height={600}
                    className="rounded-lg w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="w-32 h-44 sm:w-44 sm:h-52 md:w-48 md:h-56 lg:w-56 lg:h-64 xl:w-64 xl:h-72">
                  <Image
                    src="/assets/images/gallery/ZVE03423.jpg"
                    alt="Hope Camp Photo 4"
                    width={600}
                    height={700}
                    className="rounded-lg w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="w-32 h-20 sm:w-44 sm:h-24 md:w-48 md:h-28 lg:w-56 lg:h-32 xl:w-64 xl:h-36">
                  <Image
                    src="/assets/images/gallery/ZVE03409.jpg"
                    alt="Hope Camp Photo 5"
                    width={600}
                    height={300}
                    className="rounded-lg w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="w-32 h-44 sm:w-44 sm:h-52 md:w-48 md:h-64 lg:w-56 lg:h-80 xl:w-64 xl:h-88">
                  <Image
                    src="/assets/images/gallery/ZVE02847.jpg"
                    alt="Hope Camp Photo 6"
                    width={600}
                    height={800}
                    className="rounded-lg w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              variant="default"
              className="bg-hope-orange hover:bg-hope-orange/90 text-white rounded-full px-8 py-2 transition-transform hover:scale-105"
            >
              Galerie tabere trecute
            </Button>
          </div>
        </div>
      </section>

      {/* Wave transition from Gallery to Program section */}
      <div className="w-full bg-white">
        <svg
          viewBox="0 0 1440 320"
          className="w-full block"
          preserveAspectRatio="none"
          fill="#FFF0C8"
        >
          <path d="M0,96L80,106.7C160,117,320,139,480,133.3C640,128,800,96,960,101.3C1120,107,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      {/* Program Section */}
      <section className="bg-hope-beige py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-hope-darkcyan mb-6">
                Program
              </h2>
              <p className="text-hope-darkcyan text-lg leading-relaxed">
                Bucură-te de fiecare moment al zilei în cadrul taberei! 🏕️
                Fiecare seară este unică, plină de emoții și aduce cu sine o
                experiență specială de închinare și învățătură biblică și
                momente distractive.
                <br />
                <br />
                În Hope Camp avem momente de rugăciune, închinare, ascultarea
                mesajului biblic, întâlniri pe grupe, activități distractive,
                quizz, momente de relaxare, activități sportive, ieșiri,
                drumeție etc. Hai să ne întâlnim și să trăim împreună aceste
                momente spirituale de neuitat! 🙏✨
              </p>
            </div>

            <div className="lg:w-1/3 flex flex-col items-center">
              <div className="text-6xl mb-2">🤫</div>
              <p className="text-hope-darkcyan text-xl font-medium">
                coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Wave transition from Program to Video section */}
      <div className="w-full bg-hope-beige">
        <svg
          viewBox="0 0 1440 320"
          className="w-full block"
          preserveAspectRatio="none"
          fill="#FFFFFF"
        >
          <path d="M0,96L80,106.7C160,117,320,139,480,133.3C640,128,800,96,960,101.3C1120,107,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      {/* YouTube Video Section */}
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

      {/* Wave transition to Location section */}
      <div className="w-full bg-white">
        <svg
          viewBox="0 0 1440 320"
          className="w-full block"
          preserveAspectRatio="none"
          fill="#0E7E6F"
        >
          <path d="M0,96L80,106.7C160,117,320,139,480,133.3C640,128,800,96,960,101.3C1120,107,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      {/* Location Section */}
      <section className="bg-hope-darkcyan">
        <div className="container mx-auto flex flex-col lg:flex-row lg:justify-around items-center py-14 px-8 gap-5 sm:py-8 xl:py-0">
          <div className="flex flex-col items-center gap-3 lg:items-start lg:order-last">
            <h2 className="text-white text-3xl font-bold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
              Locație
            </h2>
            <p className="text-white text-center max-w-sm sm:text-sm md:max-w-md md:text-md lg:text-lg lg:text-start xl:max-w-xl xl:text-xl">
              Tabăra se va desfășura în localitatea Someșu Rece din județul
              Cluj, oferind un cadru ideal pentru relaxare, reflecție și
              socializare. Cu aer limpede de natură și cu o echipă de prieteni
              în jur, vei putea trăi cele mai intense momente de vacanță.🌅
            </p>
          </div>

          <iframe
            className="rounded-lg w-60 h-60 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 xl:w-[400px] xl:h-[400px]"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2736.6649349845015!2d23.311087599999997!3d46.692613699999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4749196164acd61d%3A0x8b3cca28a1e12774!2sComplex%20Turistic%20Puiu!5e0!3m2!1sro!2sro!4v1714846979815!5m2!1sro!2sro"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Wave transition from Location section */}
      <div className="w-full bg-hope-darkcyan">
        <svg
          viewBox="0 0 1440 320"
          className="w-full block"
          preserveAspectRatio="none"
          fill="#FFFFFF"
        >
          <path d="M0,96L80,106.7C160,117,320,139,480,133.3C640,128,800,96,960,101.3C1120,107,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      <FaqSection />

      <Footer />
    </main>
  );
}

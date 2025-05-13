import Navbar from "@/components/Navbar";
import {
  FiExternalLink,
  FiMapPin,
  FiCalendar,
  FiBookOpen,
} from "react-icons/fi";

export default function GaleriePage() {
  const galleryFolders = [
    {
      title: "Hope Camp 2.1",
      year: "2021",
      edition: "Eu Cred",
      location: "Lacul Surduc",
      link: "https://drive.google.com/drive/folders/1qpsH-D8pn3VRIv7KY6paIYG6dLbFu-4h?usp=drive_link",
    },
    {
      title: "Hope Camp 3",
      year: "2022",
      edition: "Imitatio Christi",
      location: "Lacul Surduc",
      link: "https://drive.google.com/drive/folders/1CQ6wtsYh7XfsQGBaRZpDSOwPtZkjrupE?usp=drive_link",
    },
    {
      title: "Hope Camp 4",
      year: "2023",
      edition: "Aprins",
      location: "Arieșeni",
      link: "https://drive.google.com/drive/folders/1zQv3lSDOoOXek6A79AurpHQg2VYnd7Qv?usp=drive_link",
    },
    {
      title: "Winter Camp 1",
      year: "2024",
      edition: "",
      location: "Arieșeni",
      link: "https://drive.google.com/drive/folders/1uAxPVjWY0st0DLp4M9fJVof35dx6fLkP?usp=drive_link",
    },
    {
      title: "Hope Camp 5",
      year: "2024",
      edition: "Pax Christi",
      location: "Someșu Rece",
      link: "https://drive.google.com/drive/folders/1eh_ifVkcLBtLQSwsrnO7iNoe1uyUpyj_?usp=drive_link",
    },
    {
      title: "Winter Camp 2",
      year: "2025",
      edition: "Remade",
      location: "Mărișel",
      link: "https://drive.google.com/drive/folders/13Jlf7CUDcObvP62vGglZ-FN7kqIpHTsC?usp=drive_link",
    },
  ];

  return (
    <>
      <Navbar />
      <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h1 className="font-poppins text-4xl md:text-5xl font-bold text-primary mb-4">
              Galerie Foto
            </h1>
            <p className="text-muted-foreground font-nunito max-w-2xl mx-auto">
              Descoperă amintirile create la Hope Camp și Winter Camp de-a
              lungul anilor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryFolders.map((folder, index) => (
              <a
                key={index}
                href={folder.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-card hover:bg-primary/5 transition-all duration-300 rounded-xl shadow-md overflow-hidden flex flex-col h-full border border-border hover:border-primary/30 hover:shadow-lg"
              >
                {/* Card Top Section */}
                <div className="bg-primary p-6 relative">
                  <div className="absolute top-0 right-0 bg-white/10 p-2 m-2 rounded-full">
                    <FiExternalLink className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white font-poppins mb-1">
                    {folder.title}
                  </h2>
                  <div className="flex items-center space-x-2 text-white/80">
                    <FiCalendar className="w-4 h-4" />
                    <span className="text-sm font-nunito">{folder.year}</span>
                  </div>
                </div>

                {/* Card Bottom Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="space-y-3 mb-4">
                    {folder.edition && (
                      <div className="flex items-center text-foreground/80">
                        <FiBookOpen className="w-4 h-4 mr-2 text-primary/70" />
                        <p className="text-sm font-nunito">
                          <span className="text-foreground/60 mr-1"></span>
                          {folder.edition}
                        </p>
                      </div>
                    )}
                    <div className="flex items-center text-foreground/80">
                      <FiMapPin className="w-4 h-4 mr-2 text-primary/70" />
                      <p className="text-sm font-nunito">
                        <span className="text-foreground/60 mr-1"></span>
                        {folder.location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="relative overflow-hidden">
                      <span className="inline-block w-full text-sm font-medium text-primary py-2 px-4 bg-primary/10 rounded-md group-hover:bg-primary/20 transition-all duration-300">
                        Vezi fotografii
                      </span>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

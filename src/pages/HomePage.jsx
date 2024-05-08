import Navbar from "../components/general-components/Navbar";
import HeroSection from "../components/homepage-components/HeroSection";
import AboutSection from "../components/homepage-components/AboutSection";
import SignUpSection from "../components/homepage-components/SignUpSection";
import GallerySection from "../components/homepage-components/GallerySection";
import ScheduleSection from "../components/homepage-components/ScheduleSection";
import LocationSection from "../components/homepage-components/LocationSection";
import FaqSection from "../components/homepage-components/FaqSection";
import Footer from "../components/general-components/Footer";
import { useSpring, animated, config } from "react-spring";

function HomePage() {
  const heroProps = useSpring({
    from: { transform: "translateY(-100%)" },
    to: { transform: "translateY(0)" },
    config: config.slow,
  });

  const aboutProps = useSpring({
    delay: 600,
    opacity: 1,
    from: { opacity: 0 },
    config: config.slow,
  });

  //TODO: Maybe add the animations in the components themselves
  return (
    <>
      <animated.div style={heroProps}>
        <Navbar />
        <HeroSection />
      </animated.div>
      <animated.div style={aboutProps}>
        <AboutSection />
      </animated.div>
      <SignUpSection />
      <GallerySection />
      <ScheduleSection />
      <LocationSection />
      <FaqSection />
      <Footer />
    </>
  );
}

export default HomePage;

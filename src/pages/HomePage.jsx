import Navbar from "../components/general-components/Navbar";
import HeroSection from "../components/homepage-components/HeroSection";
import AboutSection from "../components/homepage-components/AboutSection";
import SignUpSection from "../components/homepage-components/SignUpSection";
import GallerySection from "../components/homepage-components/GallerySection";
import ScheduleSection from "../components/homepage-components/ScheduleSection";
import LocationSection from "../components/homepage-components/LocationSection";
import FAQ from "../components/homepage-components/FAQ";
import Footer from "../components/general-components/Footer";

function HomePage() {
    return(
        <>
        <Navbar/>
        <HeroSection/>
        <AboutSection/>
        <SignUpSection/>
        <GallerySection/>
        <ScheduleSection/>
        <LocationSection/>
        <FAQ/>    
        <Footer/>    
        </>
    );
}

export default HomePage
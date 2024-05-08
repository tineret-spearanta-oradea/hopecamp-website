import { Link } from "react-router-dom";
import { pages } from "../../constants";

function DesktopNavbar() {
  return (
    <>
      <nav className="bg-hope-beige text-hope-darkcyan hidden lowercase text-lg font-bold p-5 gap-5 lg:flex">
        <Link to={pages.home}>home</Link>
        <Link to={pages.register}>înscrie-te</Link>
        <Link to={pages.account}>cont</Link>
        <Link to={pages.gallery}>galerie</Link>
      </nav>
    </>
  );
}

export default DesktopNavbar;

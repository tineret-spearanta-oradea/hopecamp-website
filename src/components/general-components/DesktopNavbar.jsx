import { Link } from "react-router-dom";

function DesktopNavbar() {
  return (
    <>
      <nav className="bg-hope-beige text-hope-darkcyan hidden uppercase font-bold p-5 gap-5 lg:flex">
        <Link to="/">home</Link>
        <Link to="/inscrie-te">inscrie-te</Link>
      </nav>
    </>
  );
}

export default DesktopNavbar;

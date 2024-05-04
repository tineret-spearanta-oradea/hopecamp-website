import { Link } from "react-router-dom";

function DesktopNavbar() {
  return (
    <>
      <nav className="bg-hope-beige lg:flex hidden gap-5">
        <Link to="/">home</Link>
        <Link to="/inscrie-te">inscrie-te</Link>
        <Link to="/login">login</Link>
        <Link to="/cont">cont</Link>
        <Link to="/logout">logout</Link>
      </nav>
    </>
  );
}

export default DesktopNavbar;

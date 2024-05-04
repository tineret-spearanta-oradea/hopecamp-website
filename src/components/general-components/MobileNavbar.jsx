import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

//   prevent scrolling when open
  useEffect(() => {
    const handleScroll = (event) => {
      if (isOpen) {
        event.preventDefault();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("scroll", handleScroll);
    } else {
      document.body.style.overflow = ""; // Reset overflow style when navbar is closed
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);


  return (
    <>
      <div className="bg-hope-beige p-3 block lg:hidden">
        <span className="text-hope-darkcyan text-3xl">
          <i onClick={toggleNavbar} className="bi bi-list"></i>
        </span>
      </div>
      {isOpen && (
        <div className="bg-hope-darkcyan text-white font-bold absolute flex flex-col -mt-16 items-center justify-center w-full h-96">
          <span onClick={toggleNavbar} className="text-4xl"><i className="bi bi-x"></i></span>
          <Link to="/">home</Link>
          <Link to="/inscrie-te">inscrie-te</Link>
        </div>
      )}
    </>
  );
}

export default MobileNavbar;

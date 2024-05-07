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
      document.body.style.overflow = "";
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
        <div className="bg-hope-darkcyan min-h-screen text-white font-bold flex flex-col absolute top-0 left-0 w-full h-full">
          <div  className="text-5xl flex justify-center pt-5">
            <i onClick={toggleNavbar} className="bi bi-x"></i>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center -mt-5">
              <Link onClick={toggleNavbar} to="/" className="text-xl mb-4">
                acasă
              </Link>
              <Link to="/inscrie-te" className="text-xl">
                înscrie-te
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MobileNavbar;
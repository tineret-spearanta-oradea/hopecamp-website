import PropTypes from "prop-types";
import { useState } from "react";

ScheduleDays.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

function ScheduleDays(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [relativeHeight, setRelativeHeight] = useState("h-14");
  const [relativeJustify, setrelativeJustify] = useState("justify-center")

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setRelativeHeight(isOpen ? "h-14" : "h-52");
    setrelativeJustify(isOpen ? "justify-center" : "justify-around")
  };

  return (
    <>
      <div
        onClick={toggleOpen}
        className={`bg-hope-darkcyan w-full ${relativeHeight} rounded-lg flex flex-col ${relativeJustify} px-3 py-2`}
      >
        <div className="flex justify-between">
          <p className="text-white font-bold opacity-50">{props.day}</p>
          <p className="text-white text-sm opacity-50">{props.date}</p>
        </div>
        {isOpen && <div className="bg-hope-orange w-full h-32 rounded-lg"></div>}
      </div>
    </>
  );
}

export default ScheduleDays;

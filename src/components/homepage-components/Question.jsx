import { useState } from "react";
import PropTypes from "prop-types";

function Question(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [iconDirection, setIconDirection] = useState("down");

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setIconDirection(isOpen ? "down" : "up");
  };

  return (
    <>
      <div>
        <div
          onClick={toggleOpen}
          className="bg-hope-darkcyan max-w-100 flex items-center cursor-pointer justify-between rounded-lg overflow-hidden w-full h-14  px-3 lg:w-96 lg:h-20 xl:w-100  "
        >
          <p className="text-white text-sm lg:text-base ">{props.question}</p>
          <span className="text-white">
            <i className={`bi bi-caret-${iconDirection}-fill`}></i>
          </span>
        </div>
        {isOpen && (
          <div className="bg-hope-orange flex text-lg max-w-100 rounded-lg p-3 my-1 lg:text-sm w-full lg:w-96 xl:w-100">
            <p className="text-hope-blackcyan">{props.answer}</p>
          </div>
        )}
      </div>
    </>
  );
}

Question.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export default Question;

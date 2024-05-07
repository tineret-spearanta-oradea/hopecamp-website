import PropTypes from "prop-types";
import { Link } from "react-router-dom";

FilledButton.propTypes = {
  text: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  isHeroButton: false,
};

function FilledButton(props) {
  const buttonClassName = props.isHeroButton
    ? "bg-hope-orange text-white text-base font-semibold rounded-full px-8 py-2 lg:text-lg xl:text-xl hover:bg-hope-darkcyan hover:text-hope-orange transition duration-300 ease-in-out"
    : "bg-hope-orange text-white text-base font-semibold rounded-full px-8 py-2 lg:text-lg xl:text-xl hover:bg-hope-darkcyan hover:text-hope-orange transition duration-300 ease-in-out";

  return (
    <>
      <Link
        className={`bg-hope-orange text-white text-base font-semibold rounded-full px-8 py-2 lg:text-lg xl:text-xl
                  hover:bg-hope-darkcyan hover:text-hope-orange transition duration-300 ease-in-out 
                  ${
                    props.isHeroButton
                      ? "shadow-sm border-2 border-hope-lightcyan uppercase shadow-hope-lightcyan"
                      : "shadow-lg"
                  }`}
        to={props.route}
      >
        {props.text}
      </Link>
    </>
  );
}

export default FilledButton;

import PropTypes from "prop-types";
import { Link } from "react-router-dom";

FilledButton.propTypes = {
  text: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
};

function FilledButton(props) {
  return (
    <>
      <Link
        className="bg-hope-orange text-white text-base font-semibold rounded-full px-8 py-2 lg:text-lg xl:text-xl"
        to={props.route}
      >
        {props.text}
      </Link>
    </>
  );
}

export default FilledButton;

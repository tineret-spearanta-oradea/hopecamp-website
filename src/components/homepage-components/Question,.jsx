import PropTypes from "prop-types";

Question.propTypes = {
  question: PropTypes.string.isRequired,
};

export default function Question(props) {
  return (
    <>
      <div className="bg-hope-darkcyan flex items-center rounded-lg w-full h-14 pl-3">
        <p className="text-white text-xs lg:text-sm">{props.question}</p>
      </div>
    </>
  );
}

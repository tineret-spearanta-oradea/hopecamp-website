import PropTypes from "prop-types";

ScheduleDays.propTypes = {
  day: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

function ScheduleDays(props) {
  return (
    <>
      <div className="bg-hope-darkcyan w-full h-14 rounded-lg flex items-center justify-between px-3">
        <p className="text-white font-bold opacity-50">{props.day}</p>
        <p className="text-white text-sm opacity-50">{props.date}</p>
      </div>
    </>
  );
}

export default ScheduleDays;

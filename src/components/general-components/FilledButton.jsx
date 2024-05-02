import PropTypes from 'prop-types';


FilledButton.propTypes = {
  text: PropTypes.string.isRequired,
};

function FilledButton(props) {
    return <>
        <button>{props.text}</button>
    </>
}

export default FilledButton
import PropTypes from 'prop-types';


FilledButton.propTypes = {
  text: PropTypes.string.isRequired,
};

function FilledButton(props) {
    return <>
        <button className='bg-hope-orange font-semibold rounded-full px-8 py-2'>{props.text}</button>
    </>
}

export default FilledButton
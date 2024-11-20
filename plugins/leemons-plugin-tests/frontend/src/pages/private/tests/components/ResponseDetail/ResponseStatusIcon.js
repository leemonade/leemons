import PropTypes from 'prop-types';

function ResponseStatusIcon({ isCorrect }) {
  const src = isCorrect
    ? '/public/tests/responseDetail/correct.svg'
    : '/public/tests/responseDetail/incorrect.svg';

  return <img src={src} alt={`${isCorrect ? 'correct' : 'incorrect'}-response-icon`} />;
}

ResponseStatusIcon.propTypes = {
  isCorrect: PropTypes.bool,
};

export default ResponseStatusIcon;
export { ResponseStatusIcon };

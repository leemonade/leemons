import PropTypes from 'prop-types';

import { QUESTION_RESPONSE_STATUS } from '@tests/constants';

const questionStatusIcons = {
  [QUESTION_RESPONSE_STATUS.OK]: '/public/tests/responseDetail/correct.svg',
  [QUESTION_RESPONSE_STATUS.KO]: '/public/tests/responseDetail/incorrect.svg',
  [QUESTION_RESPONSE_STATUS.PARTIAL]: '/public/tests/responseDetail/partial.svg',
  [QUESTION_RESPONSE_STATUS.NOT_GRADED]: '/public/tests/responseDetail/not-graded.svg',
  'not-answered': '/public/tests/responseDetail/not-answered.svg',
};

const questionStatusAltTextPrefix = {
  [QUESTION_RESPONSE_STATUS.OK]: 'correct',
  [QUESTION_RESPONSE_STATUS.KO]: 'incorrect',
  [QUESTION_RESPONSE_STATUS.PARTIAL]: 'partial',
  [QUESTION_RESPONSE_STATUS.NOT_GRADED]: 'not graded yet',
  'not-answered': 'not answered',
};

function ResponseStatusIcon({ status }) {
  const src = questionStatusIcons[status ?? 'not-answered'];

  return <img src={src} alt={`${questionStatusAltTextPrefix[status]} response Icon`} />;
}

ResponseStatusIcon.propTypes = {
  status: PropTypes.string,
};

export default ResponseStatusIcon;
export { ResponseStatusIcon };

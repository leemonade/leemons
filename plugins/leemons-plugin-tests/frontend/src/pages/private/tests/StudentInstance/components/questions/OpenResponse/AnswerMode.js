import PropTypes from 'prop-types';

import AnswerModeResponsesLayout from '../AnswerModeResponsesLayout';

import Responses from './Responses';

const AnswerMode = (props) => {
  return <AnswerModeResponsesLayout {...props} ResponsesComponent={Responses} />;
};

AnswerMode.propTypes = {
  question: PropTypes.object,
};

export default AnswerMode;

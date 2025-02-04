import PropTypes from 'prop-types';

import AnswerModeResponsesLayout from '../AnswerModeResponsesLayout';

import Responses from './Responses';

const AnswerMode = (props) => {
  const { question } = props;
  const resourceIsImage = (question?.stemResource?.file?.type || '').startsWith('image');

  return (
    <AnswerModeResponsesLayout
      {...props}
      displayStemMediaHorizontally={resourceIsImage}
      ResponsesComponent={Responses}
    />
  );
};

AnswerMode.propTypes = {
  question: PropTypes.object,
};

export default AnswerMode;

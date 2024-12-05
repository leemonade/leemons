import PropTypes from 'prop-types';

import AnswerModeResponsesLayout from '../AnswerModeResponsesLayout';

import Responses from './Responses';

const AnswerMode = (props) => {
  const { question } = props;
  const resourceIsImage = (question?.stemResource?.file?.type || '').startsWith('image');
  const imageAnswers = question?.hasImageAnswers;

  return (
    <AnswerModeResponsesLayout
      {...props}
      displayStemMediaHorizontally={resourceIsImage && !imageAnswers}
      ResponsesComponent={Responses}
    />
  );
};

AnswerMode.propTypes = {
  question: PropTypes.object,
};

export default AnswerMode;

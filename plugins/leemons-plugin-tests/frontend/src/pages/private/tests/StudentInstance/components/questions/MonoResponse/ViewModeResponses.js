import PropTypes from 'prop-types';

import ResponseDetail from '@tests/pages/private/tests/components/ResponseDetail';

function ViewModeResponses(props) {
  const { question, store } = props;

  const userAnswer = store?.questionResponses?.[question.id]?.properties?.response;
  const userSkippedQuestion = !store?.questionResponses[question.id]?.status;

  const solutionLabel = question.choices.find((choice) => choice.isCorrect).text.text;

  const responses = question.choices.map((choice, index) => ({
    choice: choice.text.text,
    isUserAnswer: index === userAnswer,
    isCorrect: choice.isCorrect,
  }));

  const feedback = question.globalFeedback?.text || null;
  const stemResourceIsImage = (question?.stemResource?.file?.type || '').startsWith('image');
  const hasImageAnswers = question?.hasImageAnswers;

  return (
    <ResponseDetail
      questionStatus={store?.questionResponses[question.id]?.status}
      solutionLabel={solutionLabel}
      userSkipped={userSkippedQuestion}
      responses={responses}
      globalFeedback={question?.hasAnswerFeedback ? null : feedback}
      questionType={question.type}
      stemResource={question.stemResource}
      displayStemMediaHorizontally={stemResourceIsImage && !hasImageAnswers}
    />
  );
}

ViewModeResponses.propTypes = {
  store: PropTypes.any,
  question: PropTypes.any,
};

export default ViewModeResponses;

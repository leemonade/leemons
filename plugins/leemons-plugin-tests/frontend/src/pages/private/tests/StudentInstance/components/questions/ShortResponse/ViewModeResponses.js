import PropTypes from 'prop-types';

import ResponseDetail from '@tests/pages/private/tests/components/ResponseDetail';

function ViewModeResponses(props) {
  const { question, store } = props;

  const userAnswer = store?.questionResponses?.[question.id]?.properties?.response;
  const userAnswerIsCorrect = store?.questionResponses[question.id]?.status === 'ok';
  const userSkippedQuestion = !store?.questionResponses[question.id]?.status;

  const solutionLabel = question.choices.find((choice) => choice.isMainChoice).text.text;

  const responses = [
    {
      choice: userAnswer || '-',
      isUserAnswer: true,
      isCorrect: userAnswerIsCorrect,
    },
  ];

  const feedback = question.globalFeedback?.text || null;

  return (
    <ResponseDetail
      isCorrect={userAnswerIsCorrect}
      solutionLabel={solutionLabel}
      userSkipped={userSkippedQuestion}
      responses={responses}
      globalFeedback={question?.hasAnswerFeedback ? null : feedback}
      questionType={question.type}
    />
  );
}

ViewModeResponses.propTypes = {
  store: PropTypes.any,
  question: PropTypes.any,
};

export default ViewModeResponses;

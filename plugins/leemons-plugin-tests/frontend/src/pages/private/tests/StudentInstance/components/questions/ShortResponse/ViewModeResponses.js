import PropTypes from 'prop-types';

import ResponseDetail from '@tests/pages/private/tests/components/ResponseDetail';

function ViewModeResponses(props) {
  const { question, store, t } = props;

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
  const stemResourceIsImage = (question?.stemResource?.file?.type || '').startsWith('image');

  return (
    <ResponseDetail
      questionStatus={store?.questionResponses[question.id]?.status}
      solutionLabel={solutionLabel}
      userSkipped={userSkippedQuestion}
      responses={responses}
      globalFeedback={question?.hasAnswerFeedback ? null : feedback}
      questionType={question.type}
      stemResource={question.stemResource}
      displayStemMediaHorizontally={stemResourceIsImage}
    />
  );
}

ViewModeResponses.propTypes = {
  store: PropTypes.any,
  question: PropTypes.any,
  t: PropTypes.func,
};

export default ViewModeResponses;

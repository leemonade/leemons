import PropTypes from 'prop-types';

import ResponseDetail from '@tests/pages/private/tests/components/ResponseDetail';

export default function ViewModeResponses(props) {
  const { question, store } = props;

  const userAnswer = store?.questionResponses?.[question.id]?.properties?.response || '-';
  const teacherFeedback = store?.questionResponses?.[question.id]?.properties?.teacherFeedback;
  const userSkippedQuestion = !store?.questionResponses[question.id]?.status;

  const responses = [
    {
      choice: userAnswer,
      teacherFeedback,
    },
  ];

  const questionGlobalFeedback = question.globalFeedback?.text || null;

  return (
    <ResponseDetail
      questionStatus={store?.questionResponses[question.id]?.status}
      userSkipped={userSkippedQuestion}
      responses={responses}
      globalFeedback={question?.hasAnswerFeedback ? null : questionGlobalFeedback}
      questionType={question.type}
      displayStemMediaHorizontally={false}
      stemResource={question.stemResource}
    />
  );
}

ViewModeResponses.propTypes = {
  question: PropTypes.any,
  store: PropTypes.any,
};

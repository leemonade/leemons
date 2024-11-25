import PropTypes from 'prop-types';

import TeacherReview from './TeacherReview';

import ResponseDetail from '@tests/pages/private/tests/components/ResponseDetail';

export default function ViewModeResponses(props) {
  const { question, store, t, isStudent } = props;

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
    <>
      {isStudent ? (
        <ResponseDetail
          questionStatus={store?.questionResponses[question.id]?.status}
          userSkipped={userSkippedQuestion}
          responses={responses}
          globalFeedback={question?.hasAnswerFeedback ? null : questionGlobalFeedback}
          questionType={question.type}
        />
      ) : (
        <TeacherReview
          userAnswer={userAnswer}
          responseProperties={store?.questionResponses?.[question.id]?.properties}
          studentSkipped={userSkippedQuestion}
        />
      )}
    </>
  );
}

ViewModeResponses.propTypes = {
  question: PropTypes.any,
  store: PropTypes.any,
  t: PropTypes.func,
  isStudent: PropTypes.bool,
};

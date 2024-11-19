import React from 'react';

import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import prefixPN from '@tests/helpers/prefixPN';
import ResponseDetail from '@tests/pages/private/tests/components/ResponseDetail';

function ViewModeResponses(props) {
  const [t] = useTranslateLoader(prefixPN('questionsBanksDetail.questionLabels.trueFalse'));
  const { question, store } = props;

  const userAnswer = store?.questionResponses?.[question.id]?.properties?.response;

  const correctAnswer = {
    value: question.trueFalseProperties?.isTrue,
    label: question.trueFalseProperties?.isTrue ? t('true') : t('false'),
  };

  const userAnswerIsCorrect = store?.questionResponses[question.id]?.status === 'ok';
  const userSkippedQuestion = !store?.questionResponses[question.id]?.status;

  const responses = [
    {
      choice: t('true'),
      isUserAnswer: userAnswer === true,
      isCorrect: question.trueFalseProperties?.isTrue,
    },
    {
      choice: t('false'),
      isUserAnswer: userAnswer === false,
      isCorrect: !question.trueFalseProperties?.isTrue,
    },
  ];

  const feedback = question.globalFeedback?.text || null;

  return (
    <ResponseDetail
      isCorrect={userAnswerIsCorrect}
      solutionLabel={correctAnswer.label}
      userSkipped={userSkippedQuestion}
      responses={responses}
      globalFeedback={question?.hasAnswerFeedback ? null : feedback}
    />
  );
}

ViewModeResponses.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  question: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  render: PropTypes.func,
  isPreviewMode: PropTypes.bool,
};

export default ViewModeResponses;

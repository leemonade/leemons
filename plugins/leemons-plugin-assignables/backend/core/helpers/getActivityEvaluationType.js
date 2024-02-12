const { isEqual } = require('lodash');

function getActivityEvaluationType(activity) {
  const evaluationTypes = {
    calificable: {
      gradable: true,
      requiresScoring: true,
      allowFeedback: true,
    },
    punctuable: {
      gradable: false,
      requiresScoring: true,
      allowFeedback: true,
    },
    feedbackOnly: {
      gradable: false,
      requiresScoring: false,
      allowFeedback: true,
    },
    nonEvaluable: {
      gradable: false,
      requiresScoring: false,
      allowFeedback: false,
    },
  };

  const typeValues = {
    requiresScoring: !!activity.requiresScoring,
    allowFeedback: !!activity.allowFeedback,
    gradable: !!activity.gradable,
  };

  return Object.fromEntries(
    Object.entries(evaluationTypes).map(([key, value]) => [key, isEqual(typeValues, value)])
  );
}

module.exports = {
  getActivityEvaluationType,
};

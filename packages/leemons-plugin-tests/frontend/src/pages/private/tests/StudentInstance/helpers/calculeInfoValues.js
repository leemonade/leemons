export function calculeInfoValues(nQuestions, maxPoints, minPointsToApprove) {
  return {
    questions: nQuestions,
    totalPoints: maxPoints,
    minToApprove: minPointsToApprove,
    perQuestion: `+${(maxPoints / nQuestions).toFixed(2)}`,
    perQuestionNumber: maxPoints / nQuestions,
  };
}

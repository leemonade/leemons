export function calculeInfoValues(nQuestions, maxPoints, minPoints, minPointsToApprove) {
  return {
    questions: nQuestions,
    totalPoints: maxPoints,
    minPoints,
    minToApprove: minPointsToApprove,
    perQuestion: `+${((maxPoints - minPoints) / nQuestions).toFixed(2)}`,
    perQuestionNumber: (maxPoints - minPoints) / nQuestions,
    perErrorQuestion: `-${((maxPoints - minPoints) / nQuestions / 2).toFixed(2)}`,
    perErrorQuestionNumber: (maxPoints - minPoints) / nQuestions / 2,
  };
}

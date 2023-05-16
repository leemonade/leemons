import { getConfigByInstance } from './getConfigByInstance';

export function calculeInfoValues(nQuestions, maxPoints, minPoints, minPointsToApprove, instance) {
  const config = getConfigByInstance(instance);
  const perQuestion = (maxPoints - minPoints) / nQuestions;
  const perErrorQuestion = perQuestion * (config.wrong / 100);
  const perOmitQuestion = perQuestion * (config.omit / 100);
  return {
    questions: nQuestions,
    totalPoints: maxPoints,
    minPoints,
    minToApprove: minPointsToApprove,
    perQuestion: `+${perQuestion.toFixed(2)}`,
    perQuestionNumber: perQuestion,
    perErrorQuestion: `-${perErrorQuestion.toFixed(2)}`,
    perErrorQuestionNumber: perErrorQuestion,
    perOmitQuestion: `-${perOmitQuestion.toFixed(2)}`,
    perOmitQuestionNumber: perOmitQuestion,
  };
}

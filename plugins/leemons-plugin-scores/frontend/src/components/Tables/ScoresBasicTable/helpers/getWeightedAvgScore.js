import { sortBy } from 'lodash';

import { findGradeLetter } from './findGradeLetter';

export function getWeightedAvgScore({ studentActivities, activities, grades, useNumbers }) {
  let weightedScore = 0;

  const minGrade = sortBy(grades, 'number')[0].number;

  studentActivities.forEach((studentActivity) => {
    weightedScore +=
      (studentActivity.score ? studentActivity.score : minGrade) *
      (activities.find((activity) => activity.id === studentActivity.id)?.weight || 0);
  });

  let sumOfWeights = 0;
  activities.forEach((activity) => {
    sumOfWeights += activity.weight;
  });

  const weightedAverage = (weightedScore / sumOfWeights).toFixed(2);
  return useNumbers ? weightedAverage : findGradeLetter({ score: weightedAverage, grades });
}

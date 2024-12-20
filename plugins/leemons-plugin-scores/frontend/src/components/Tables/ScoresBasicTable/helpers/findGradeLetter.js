export function findGradeLetter({ score, grades }) {
  let nearestGrade = grades[0];
  let nearestDifference = Math.abs(nearestGrade.number - score);

  grades.forEach((grade) => {
    const difference = Math.abs(grade.number - score);
    if (difference < nearestDifference) {
      nearestDifference = difference;
      nearestGrade = grade;
    }
  });

  return nearestGrade.letter;
}

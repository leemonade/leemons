import { orderBy } from 'lodash';

export function getNearestScale({ grade, evaluationSystem }) {
  const numericGrade = parseFloat(grade);
  const orderedScales = orderBy(evaluationSystem?.scales, ['number'], ['asc']);
  let nearestScale = null;

  const isBelow = numericGrade < evaluationSystem?.minScale?.number;
  const isAbove = numericGrade > evaluationSystem?.maxScale?.number;

  if (isBelow || isAbove || !grade) {
    nearestScale = isBelow || !grade ? evaluationSystem?.minScale : evaluationSystem?.maxScale;
  } else {
    for (let i = 0, scalesLength = orderedScales?.length ?? 0; i < scalesLength; i++) {
      const scale = orderedScales?.[i];

      if (numericGrade >= scale?.number) {
        nearestScale = scale;
      } else if (nearestScale) {
        const diff = Math.abs(numericGrade - scale.number);
        const currentDiff = Math.abs(numericGrade - nearestScale.number);

        if (diff < currentDiff) {
          nearestScale = scale;
        }
        break;
      }
    }
  }

  return {
    ...nearestScale,
    grade: isBelow || isAbove || !grade ? nearestScale?.number : numericGrade ?? 0,
  };
}

export default getNearestScale;

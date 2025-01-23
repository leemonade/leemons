import type { TableData, StudentScores, GradedRetake } from '../types';

export function getRetakeGrades({
  student,
  default: defaultGrade,
}: {
  student: TableData['activitiesData']['value'][number];
  default?: number;
}) {
  let maxGradedRetake: GradedRetake | null = defaultGrade
    ? {
        id: null,
        order: 0,
        grade: defaultGrade,
      }
    : null;

  if (!student.retakeScores?.length) {
    return {
      maxGradedRetake,
      retakeGrades: {},
    };
  }

  const retakeGrades = student.retakeScores.reduce<
    Record<string, StudentScores['retakes'][number]>
  >((acc, retake) => {
    if (!maxGradedRetake || retake.grade > maxGradedRetake.grade) {
      maxGradedRetake = {
        id: retake.retakeId,
        order: retake.retakeIndex,
        grade: retake.grade,
      };
    }

    acc[retake.retakeId ?? null] = {
      id: retake.retakeId,
      order: retake.retakeIndex,
      grade: retake.grade,
    };

    return acc;
  }, {});

  return {
    maxGradedRetake,
    retakeGrades,
  };
}

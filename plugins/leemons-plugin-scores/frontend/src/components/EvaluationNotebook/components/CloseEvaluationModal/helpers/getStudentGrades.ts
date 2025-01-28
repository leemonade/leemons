import { findNearestFloorScore } from '@assignables/widgets/dashboard/nya/components/EvaluationCardStudent/components/ScoreFeedback';
import { sortBy } from 'lodash';

import { TableData } from '../types';

interface Scale {
  number: number;
}

interface Props {
  activities: TableData['activitiesData']['activities'];
  students: TableData['activitiesData']['value'];
  grades: Scale[];
}

export function getStudentGrades({ activities, students, grades }: Props): Record<string, number> {
  const studentsGrades = {};

  const weightPerActivity = activities.reduce((acc, activity) => {
    acc[activity.id] = activity.weight;
    return acc;
  }, {});

  const minScore = sortBy(grades, 'number')[0].number;
  const maxScore = sortBy(grades, 'number').reverse()[0].number;

  students.forEach((student) => {
    const grade = student.activities.reduce((acc, activity) => {
      const weight = weightPerActivity[activity.id];
      const score = Math.max(Math.min(maxScore, activity.score ?? minScore), minScore);

      return acc + score * (weight ?? 0);
    }, 0);

    const scale = findNearestFloorScore(grade, grades) as Scale;

    studentsGrades[student.id] = scale.number;
  });

  return studentsGrades;
}

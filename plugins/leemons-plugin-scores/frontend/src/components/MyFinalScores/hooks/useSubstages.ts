import { useUserAgents } from '@users/hooks';
import { keyBy } from 'lodash';

import { Class } from '../types/class';

import { useScores } from '@scores/requests/hooks/queries';

export function useSubstages(classData: Class) {
  const substages = classData.program.substages;
  const student = useUserAgents();

  const substagesIds = substages?.map((substage) => substage.id);

  const { data: scores } = useScores(
    {
      students: student,
      classes: [classData.id],
      periods: substagesIds,
      published: true,
    },
    {
      select: (scores) => keyBy(scores, 'period'),
    }
  );

  return substages?.map((substage) => ({
    id: substage.id,
    name: substage.name,
    score: scores?.[substage.id]?.grade,
    retake: scores?.[substage.id]?.retake,
  })) ?? [];
}

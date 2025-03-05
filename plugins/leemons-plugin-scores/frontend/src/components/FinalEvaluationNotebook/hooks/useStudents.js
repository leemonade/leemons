import { useMemo } from 'react';

import { useUserAgentsInfo } from '@users/hooks';
import { keyBy, map } from 'lodash';

import { useScores } from '@scores/requests/hooks/queries';

export default function useStudents({ class: klass, filters: { search }, periods }) {
  const { data: students, isLoading: userAgentsLoading } = useUserAgentsInfo(klass?.students, {
    enabled: !!klass?.students?.length,
  });

  const periodsIds = map(
    periods,
    (period) => period.periods[klass.program][klass.courses.id ?? klass.courses[0].id]
  );

  const { data: scores, isLoading: scoresLoading } = useScores(
    {
      students: klass?.students,
      classes: [klass?.id],
      periods: [...periodsIds, 'final'],
      published: true,
    },
    {
      select: (result) => keyBy(result, (score) => `${score.student}|${score.period}`),
    }
  );

  const { data: finalScores, isLoading: finalScoresLoading } = useScores(
    {
      students: klass?.students,
      classes: [klass?.id],
      periods: ['final'],
    },
    {
      select: (result) => keyBy(result, (score) => score.student),
    }
  );

  const studentsData = useMemo(() => {
    if (!students || !periodsIds?.length) {
      return [];
    }

    let filteredStudents = students;

    if (search) {
      filteredStudents = students.filter(({ user: { name, surnames } }) => {
        const fullName = `${name} ${surnames}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        const fullNameReverse = `${surnames} ${name}`
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        const normalizedSearch = search
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');

        return fullName.includes(normalizedSearch) || fullNameReverse.includes(normalizedSearch);
      });
    }

    return filteredStudents.map(({ id, user }) => {
      const score = finalScores?.[id];

      return {
        id,
        name: user.name,
        surname: user.surnames,
        image: user.avatar,
        customScore: score?.grade ?? null,
        allowCustomChange: !score?.published ?? true,
        activities: periodsIds.map((period) => ({
          id: period,
          score: scores?.[`${id}|${period}`]?.grade ?? null,
          isSubmitted: true,
        })),
        retakeScores: !score
          ? []
          : [
              {
                retakeId: '0',
                retakeIndex: 0,
                grade: score?.grade ?? null,
              },
            ],
      };
    });
  }, [students, periodsIds, scores, search, finalScores]);

  return {
    data: studentsData,
    isLoading: userAgentsLoading || scoresLoading || finalScoresLoading,
  };
}

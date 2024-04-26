import { useScores } from '@scores/requests/hooks/queries';
import { useUserAgentsInfo } from '@users/hooks';
import { keyBy, map } from 'lodash';
import { useMemo } from 'react';

export default function useStudents({ class: klass, filters: { search }, periods }) {
  const { data: students, isLoading: userAgentsLoading } = useUserAgentsInfo(klass?.students, {
    enabled: !!klass?.students?.length,
  });

  const periodsIds = map(periods, (period) => period.periods[klass.program][klass.courses.id]);

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

    return filteredStudents.map(({ id, user }) => ({
      id,
      name: user.name,
      surname: user.surnames,
      image: user.avatar,
      customScore: scores?.[`${id}|final`]?.grade ?? null,
      allowCustomChange: true,
      activities: periodsIds.map((period) => ({
        id: period,
        score: scores?.[`${id}|${period}`]?.grade ?? null,
        isSubmitted: true,
      })),
    }));
  }, [students, periodsIds, scores, search]);

  return { data: studentsData, isLoading: userAgentsLoading || scoresLoading };
}

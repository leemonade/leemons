import { useMemo } from 'react';

import { useUserAgentsInfo } from '@users/hooks';
import { keyBy } from 'lodash';

import { useScores } from '@scores/requests/hooks/queries';
import { useRetakesScores } from '@scores/requests/hooks/queries/useRetakesScores';

export default function useStudents({
  activities,
  class: klass,
  filters: { searchType, search },
  period,
}) {
  const { data: students, isLoading: userAgentsLoading } = useUserAgentsInfo(klass?.students, {
    enabled: !!klass?.students?.length,
  });

  const { data: retakeScores } = useRetakesScores({
    classId: klass?.id,
    period,
    enabled: !!klass?.id && !!period,
  });

  const { data: scores, isLoading: scoresLoading } = useScores(
    {
      students: klass?.students,
      classes: [klass?.id],
      periods: [period],
    },
    {
      select: (result) => keyBy(result, 'student'),
    }
  );

  const studentsData = useMemo(() => {
    if (!students || !activities) {
      return [];
    }

    let filteredStudents = students;

    if (searchType === 'student' && search) {
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

    return filteredStudents?.map(({ id, user }) => ({
      id,
      name: user.name,
      surname: user.surnames,
      image: user.avatar,
      activities: activities?.map((activity) => {
        const studentData = activity.students.find((assignation) => id === assignation.user);

        const mainGrade = studentData?.grades?.find(
          (grade) => grade.type === 'main' && grade.subject === klass.subject.id
        );

        return {
          id: activity.id,
          score: mainGrade?.grade ?? null,
          isSubmitted: !!studentData?.timestamps?.end,
          grade: mainGrade,
        };
      }),

      retakeScores: retakeScores?.[id],
      customScore: scores?.[id]?.grade ?? null,
      customScoreRetake: scores?.[id]?.retake ?? null,
      allowCustomChange: !scores?.[id]?.published,
    }));
  }, [students, activities, search, searchType, klass?.subject?.id, scores, retakeScores]);

  return {
    data: studentsData,
    isLoading: (userAgentsLoading && klass?.students?.length) || scoresLoading,
  };
}

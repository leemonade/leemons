import React from 'react';

import { useCache } from '@common';

import { getClassIcon } from '@academic-portfolio/helpers/getClassIcon';
import usePermissions from '@users/hooks/usePermissions';

export function useParsedData({ classes, periods, students, scores, courseScores }) {
  const { data: permissions } = usePermissions({ name: 'scores.reviewer' });
  const isScoresAdmin = !!permissions?.actionNames?.includes('admin');

  const cache = useCache();
  const parsedClasses = cache(
    'parsedClasses',
    React.useMemo(
      () =>
        classes?.map((klass) => ({
          id: klass.id,
          name: klass.subject.name,
          group: klass.groups?.name,
          icon: getClassIcon(klass),
          color: klass.color,
          periods: periods.map((period) => ({
            id: period.id,
            name: period.name,
            allowChange: false,
          })),
        })),
      [classes, periods]
    )
  );

  const parsedStudents = cache(
    'parsedStudents',
    React.useMemo(
      () =>
        students?.map((student) => ({
          ...student,
          subjects: classes?.map((klass) => ({
            id: klass.id,
            periodScores: periods?.map((period) => {
              const grade =
                scores?.find(
                  (score) =>
                    score.student === student.id &&
                    score.class === klass.id &&
                    score.period === period.id
                )?.grade || undefined;

              return {
                id: period?.id,
                score: grade,
                name: period?.name,
                isSubmitted: !!grade,
              };
            }),
          })),
          customScore: courseScores?.find((score) => score.student === student.id)?.grade,
          allowCustomChange: isScoresAdmin,
        })),
      [students, classes, periods, isScoresAdmin, courseScores, scores]
    )
  );

  const { startDate, endDate } = React.useMemo(
    () =>
      periods?.reduce((dates, period) => {
        const newDates = {};
        if (period.startDate < dates.startDate || !dates.startDate) {
          newDates.startDate = period.startDate;
        }

        if (period.endDate > dates.endDate || !dates.endDate) {
          newDates.endDate = period.endDate;
        }

        return {
          ...dates,
          ...newDates,
        };
      }, {}),
    [periods]
  );

  return {
    classes: parsedClasses,
    students: parsedStudents,
    startDate,
    endDate,
  };
}

export default useParsedData;

import { useMemo } from 'react';

import useClassStudents from '@academic-portfolio/hooks/queries/useClassStudents';
import useRolesList from '@assignables/requests/hooks/queries/useRolesList';
import { keyBy } from 'lodash';

import { useManualActivities } from '@scores/requests/hooks/queries/useManualActivities';
import { useManualActivitiesScores } from '@scores/requests/hooks/queries/useManualActivitiesScores';

function parseActivity({ activity, roles, students, subject, scores }) {
  return {
    id: activity.id,
    name: activity.name,
    deadline: activity.date,
    role: activity.role,
    roleIcon: roles[activity.role]?.icon,

    allowChange: true,
    expandable: false,
    type: 'evaluable',
    isEvaluable: true,

    instance: null,
    students: students.map((student) => ({
      id: `${activity.id}-${student}`,
      user: student,

      isSubmitted: true,

      timestamps: {
        end: new Date(),
      },

      score: scores[activity.id]?.[student]?.grade,

      grades: scores[activity.id]?.[student]
        ? [
            {
              type: 'main',
              subject,
              grade: scores[activity.id]?.[student]?.grade,
            },
          ]
        : [],
    })),

    source: 'manualActivities',
  };
}

export function useManualActivitesForNotebook({ klass, period, filters }) {
  const hasAllData = !!klass?.id && !!period?.startDate && !!period?.endDate;
  const { data: roles } = useRolesList({ details: true, select: (data) => keyBy(data, 'name') });

  const { data: classStudents } = useClassStudents({ classId: klass?.id });

  const { data: manualActivities, isLoading: manualActivitiesLoading } = useManualActivities({
    search: filters?.searchType === 'activity' && filters?.search ? filters?.search : undefined,
    classId: klass?.id,
    startDate: period?.startDate,
    endDate: period?.endDate,
    enabled: hasAllData,
  });
  const { data: manualActivitiesScores } = useManualActivitiesScores({
    classId: klass?.id,
    enabled: hasAllData,
  });

  const parsedActivities = useMemo(
    () =>
      manualActivities?.map((activity) =>
        parseActivity({
          activity,
          roles,
          students: classStudents ?? [],
          subject: filters?.subject,
          scores: manualActivitiesScores,
        })
      ),
    [manualActivities, roles, classStudents, filters?.subject, manualActivitiesScores]
  );

  return { manualActivities: parsedActivities ?? [], isLoading: manualActivitiesLoading };
}

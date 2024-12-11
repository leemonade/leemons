import { useMemo } from 'react';

import useRolesList from '@assignables/requests/hooks/queries/useRolesList';
import { getCookieToken } from '@users/session';
import { keyBy } from 'lodash';

import { useManualActivities } from '@scores/requests/hooks/queries/useManualActivities';
import { useMyManualActivitiesScores } from '@scores/requests/hooks/queries/useMyManualActivitiesScores';

function parseActivity({ activity, user, roles, subject, scores }) {
  return {
    id: `${activity.id}-${user}`,
    grades: scores
      ? [
          {
            type: 'main',
            subject,
            grade: scores?.grade ?? null,
            feedback: scores?.feedback ?? null,
          },
        ]
      : [],
    isSubmitted: true,
    user,
    instance: {
      dates: {
        deadline: activity.date,
      },
      assignable: {
        role: activity.role,
        roleDetails: roles?.[activity.role] ?? {},
        asset: {
          name: activity.name,
        },
      },
      gradable: true,
    },
    source: 'manualActivities',
  };
}

export function useManualActivitiesForStudent({ klass, period, search }) {
  const hasAllData = !!klass?.id && !!period?.startDate && !!period?.endDate;

  const token = getCookieToken(true);
  const user = token.centers[0].userAgentId;

  const { data: manualActivities, isLoading: manualActivitiesLoading } = useManualActivities({
    search: search ?? undefined,
    classId: klass?.id,
    startDate: period?.startDate,
    endDate: period?.endDate,
    enabled: hasAllData,
  });

  const { data: manualActivitiesScores } = useMyManualActivitiesScores({
    classId: klass?.id,
  });

  const { data: roles } = useRolesList({ details: true, select: (data) => keyBy(data, 'name') });

  const parsedActivities = useMemo(
    () =>
      manualActivities
        ?.map((activity) =>
          parseActivity({
            activity,
            user,
            roles,
            subject: klass?.subject?.id,
            scores: manualActivitiesScores?.[activity.id],
          })
        )
        .filter((activity) => activity.grades.length > 0),
    [manualActivities, user, roles, manualActivitiesScores, klass?.subject?.id]
  );

  return {
    manualActivities: parsedActivities ?? [],
    isLoading: manualActivitiesLoading,
  };
}

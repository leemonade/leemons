import { useMemo } from 'react';

import useRolesList from '@assignables/requests/hooks/queries/useRolesList';
import { getCookieToken } from '@users/session';
import { keyBy } from 'lodash';

import { useManualActivities } from '@scores/requests/hooks/queries/useManualActivities';

function parseActivity({ activity, user, roles }) {
  return {
    id: `${activity.id}-${user}`,
    grades: [],
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

  const { data: roles } = useRolesList({ details: true, select: (data) => keyBy(data, 'name') });

  const parsedActivities = useMemo(
    () =>
      manualActivities?.map((activity) =>
        parseActivity({
          activity,
          user,
          roles,
          // students: classStudents ?? [],
          // subject: filters?.subject,
          // scores: manualActivitiesScores,
        })
      ),
    [manualActivities, user, roles]
  );

  return {
    manualActivities: parsedActivities ?? [],
    isLoading: manualActivitiesLoading,
  };
}

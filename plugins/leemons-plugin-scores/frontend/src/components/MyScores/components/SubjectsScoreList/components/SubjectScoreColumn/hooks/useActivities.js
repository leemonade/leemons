import { useMemo } from 'react';

import { without } from 'lodash';

import useSearchAssignableInstances from '@assignables/requests/hooks/queries/useSearchAssignableInstancesQuery';
import {
  getNextDayFirstMillisecond,
  getPreviousDayLastMillisecond,
} from '@scores/components/EvaluationNotebook/ScoresTable/hooks/useActivities';
import useRolesList from '@assignables/requests/hooks/queries/useRolesList';
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';

export default function useActivities({ class: klass, period, showNonEvaluable, weights, search }) {
  const { data: roles } = useRolesList({
    details: false,
    select: (result) => without(result, 'learningpaths.module'),
  });

  const { data: activitiesIds, isLoading: activitiesIdsLoading } = useSearchAssignableInstances({
    query: {
      query: search || undefined,
      finished: true,
      finished_$gt: getPreviousDayLastMillisecond(period?.startDate),
      finished_$lt: getNextDayFirstMillisecond(period?.endDate),

      role: weights?.type === 'modules' ? 'learningpaths.module' : roles,
      classes: klass?.id,

      isEvaluable: !showNonEvaluable,
    },
    select: (result) => result.items,
  });

  const { data: activities, isLoading: activitiesLoading } = useAssignationsByProfile(
    activitiesIds,
    {
      enabled: !!activitiesIds?.length,
    }
  );

  const activitiesWithGrades = useMemo(
    () =>
      activities?.map((activity) => {
        const mainGrade = activity.grades?.find(
          (grade) => grade.type === 'main' && grade.subject === klass.subject.id
        );
        return {
          ...activity,
          mainGrade: mainGrade?.grade ?? null,
          feedback: mainGrade?.feedback ?? null,
        };
      }),
    [activities, klass.subject.id]
  );

  return {
    activities: activitiesWithGrades ?? [],
    isLoading: activitiesIdsLoading || (activitiesLoading && activitiesIds?.length),
  };
}

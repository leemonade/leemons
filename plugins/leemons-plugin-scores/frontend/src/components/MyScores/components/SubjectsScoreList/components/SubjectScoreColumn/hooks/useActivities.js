import { useMemo } from 'react';

import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';
import useRolesList from '@assignables/requests/hooks/queries/useRolesList';
import useSearchAssignableInstances from '@assignables/requests/hooks/queries/useSearchAssignableInstancesQuery';
import { without } from 'lodash';

import { useManualActivitiesForStudent } from './useManualActivitiesForStudent';

import {
  getNextDayFirstMillisecond,
  getPreviousDayLastMillisecond,
} from '@scores/components/EvaluationNotebook/ScoresTable/hooks/useActivities';

export default function useActivities({ class: klass, period, showNonEvaluable, weights, search }) {
  const { data: roles } = useRolesList({
    details: false,
    select: (result) => without(result, 'learningpaths.module'),
  });

  const { data: activitiesIds, isLoading: activitiesIdsLoading } = useSearchAssignableInstances({
    query: {
      query: search || undefined,
      deadline_$gt: getPreviousDayLastMillisecond(period?.startDate),
      deadline_$lt: getNextDayFirstMillisecond(period?.endDate),
      alwaysAvailable_$gt: getPreviousDayLastMillisecond(period?.startDate),
      alwaysAvailable_$lt: getNextDayFirstMillisecond(period?.endDate),

      role: weights?.type === 'modules' ? 'learningpaths.module' : roles,
      classes: klass?.id,

      isEvaluable: true,
      calificableOnly: !showNonEvaluable,
    },
    select: (result) => result.items,
  });

  const { data: assignations, isLoading: activitiesLoading } = useAssignationsByProfile(
    activitiesIds,
    {
      enabled: !!activitiesIds?.length,
    }
  );

  const { manualActivities, isLoading: manualActivitiesLoading } = useManualActivitiesForStudent({
    klass,
    period,
    search,
  });

  const activities = (assignations ?? []).concat(manualActivities ?? []);

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
    isLoading:
      activitiesIdsLoading ||
      manualActivitiesLoading ||
      (activitiesLoading && activitiesIds?.length),
  };
}

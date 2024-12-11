import { useMemo } from 'react';

import useInstances from '@assignables/requests/hooks/queries/useInstances';
import useRolesList from '@assignables/requests/hooks/queries/useRolesList';
import useSearchAssignableInstances from '@assignables/requests/hooks/queries/useSearchAssignableInstancesQuery';
import dayjs from 'dayjs';
import { map, without } from 'lodash';

export function getNextDayFirstMillisecond(date) {
  return dayjs(date)
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0)
    .add(1, 'day')
    .toDate();
}

export function getPreviousDayLastMillisecond(date) {
  return dayjs(date)
    .set('hour', 23)
    .set('minute', 59)
    .set('second', 59)
    .set('millisecond', 999)
    .subtract(1, 'day')
    .toDate();
}

export default function useActivities({
  program,
  class: klass,
  weights,
  period,
  filters: { search, searchType, showNonEvaluable },
}) {
  const { data: roles } = useRolesList({
    details: false,
    select: (result) => without(result, 'learningpaths.module'),
  });

  const { data: instancesIds, isLoading: instancesIdsLoading } = useSearchAssignableInstances({
    query: {
      query: searchType === 'activity' ? search : undefined,
      finished: true,
      finished_$gt: getPreviousDayLastMillisecond(period.startDate),
      finished_$lt: getNextDayFirstMillisecond(period.endDate),

      role: weights?.type === 'modules' ? 'learningpaths.module' : roles,
      programs: program,
      classes: klass?.id,

      isEvaluable: true,
      calificableOnly: !showNonEvaluable,
    },
    select: (result) => result.items,
  });

  const { data: instances, isLoading: instancesLoading } = useInstances({
    ids: instancesIds,
    enabled: !!instancesIds?.length,
  });

  const activities = useMemo(
    () =>
      map(instances, (instance) => ({
        id: instance.id,
        name: instance.assignable.asset.name,
        deadline: instance.alwaysAvailable ? null : instance.dates.deadline,
        expandable: false,
        allowChange: instance.metadata.evaluationType !== 'auto',
        type: instance.gradable ? 'evaluable' : 'non-evaluable',

        source: 'assignables',

        role: instance.assignable.role,
        roleIcon: instance.assignable.roleDetails.icon,
        isEvaluable: instance.gradable,
        students: instance.students,

        instance,
      })),
    [instances]
  );

  return {
    activities,
    isLoading: instancesIdsLoading || (instancesIds?.length && instancesLoading),
  };
}

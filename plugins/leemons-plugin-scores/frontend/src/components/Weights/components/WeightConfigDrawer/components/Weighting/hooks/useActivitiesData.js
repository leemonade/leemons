import { useMemo } from 'react';

import useRolesList from '@assignables/requests/hooks/queries/useRolesList';
import { ImageLoader } from '@bubbles-ui/components';
import { keyBy } from 'lodash';

import useActivities from '@scores/components/EvaluationNotebook/ScoresTable/hooks/useActivities';
import useAcademicCalendarDates from '@scores/components/__DEPRECATED__/ScoresPage/Filters/hooks/useAcademicCalendarDates';
import { useManualActivities } from '@scores/requests/hooks/queries/useManualActivities';
import useWeights from '@scores/requests/hooks/queries/useWeights';

function useManualActivitiesAsInstances({ classId }) {
  const { data: manualActivities, isLoading: manualActivitiesLoading } = useManualActivities({
    classId,
    enabled: !!classId,
  });

  const { data: roles } = useRolesList({ details: true });
  const rolesByKey = keyBy(roles, 'value');

  const instances = manualActivities?.map((activity) => ({
    id: activity.id,
    name: activity.name,
    roleIcon: rolesByKey[activity.type]?.icon ?? null,
  }));

  return {
    isLoading: manualActivitiesLoading,
    data: instances,
  };
}

export default function useActivitiesData({ class: klass }) {
  const { data: weights, isLoading: weightsLoading } = useWeights({
    classId: klass.id,
    enabled: !!klass,
  });
  const { startDate, endDate } = useAcademicCalendarDates({ selectedClass: klass });
  const { activities: assignableActivities, isLoading: activitiesLoading } = useActivities({
    program: klass?.program,
    class: klass,
    period: { startDate, endDate },
    filters: { search: '', searchType: 'activity', showNonEvaluable: false },
  });
  const { data: manualActivitiesInstances, isLoading: manualActivitiesInstancesLoading } =
    useManualActivitiesAsInstances({ classId: klass.id });

  const activities = (assignableActivities ?? [])?.concat(manualActivitiesInstances ?? []);

  const weightsByActivity = keyBy(weights?.weights, 'id');

  const data = useMemo(() => {
    if (!activities?.length) return [];

    return activities?.map((activity) => {
      return {
        id: activity.id,
        name: activity.name,
        icon: !!activity.roleIcon && <ImageLoader src={activity.roleIcon} />,

        weight: weightsByActivity[activity.id]?.weight ?? 0,
        isLocked: weightsByActivity[activity.id]?.isLocked ?? false,
      };
    });
  }, [activities, weightsByActivity]);

  return {
    isLoading:
      activitiesLoading ||
      weightsLoading ||
      startDate === undefined ||
      manualActivitiesInstancesLoading,
    data,
  };
}

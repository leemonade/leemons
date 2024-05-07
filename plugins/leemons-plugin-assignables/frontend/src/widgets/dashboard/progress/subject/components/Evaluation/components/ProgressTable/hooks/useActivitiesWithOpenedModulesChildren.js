import { filter, groupBy, isEmpty } from 'lodash';

import useActivitiesWithWeights from '@scores/components/MyScores/components/SubjectsScoreList/components/SubjectScoreColumn/hooks/useActivitiesWithWeights';
import useAcademicCalendarDates from '@scores/components/__DEPRECATED__/ScoresPage/Filters/hooks/useAcademicCalendarDates';
import useAssignationsByProfile from '@assignables/hooks/assignations/useAssignationsByProfile';
import { useMemo } from 'react';

function parseChildAssignation({ activity, childrenAssignationsByModuleId }) {
  const isModule = activity.instance.metadata.module.type === 'module';

  if (!isModule) {
    return activity;
  }

  const { weight } = activity;
  const childrenAssignations = childrenAssignationsByModuleId[activity.instance.id] ?? [];

  const calificableChildren = filter(childrenAssignations, 'instance.gradable');
  const weightPerCalificable = calificableChildren.length ? weight / calificableChildren.length : 0;

  const childrenWithWeightsAndScore = childrenAssignations.map((assignation) => {
    const mainGrade = assignation.grades?.find((grade) => grade.type === 'main');
    const activityWeight = assignation.instance.gradable ? weightPerCalificable : 0;
    return {
      ...assignation,
      weight: activityWeight,
      totalWeight: weight * activityWeight,
      mainGrade: mainGrade?.grade,
      feedback: mainGrade?.feedback,
    };
  });

  return [activity, ...(childrenWithWeightsAndScore ?? [])];
}

export default function useActivitiesWithOpenedModulesChildren({
  class: classroom,
  weights,
  filters,
  modulesOpened,
  page,
  size,
}) {
  const { startDate, endDate } = useAcademicCalendarDates({
    selectedClass: classroom,
  });

  const { activities, isLoading: isLoadingActivities } = useActivitiesWithWeights({
    class: classroom,
    weights,
    showNonEvaluable: filters.showNonEvaluable ?? false,
    period: {
      startDate,
      endDate,
    },
  });

  const paginatedActivities = useMemo(
    () => activities.slice((page - 1) * size, page * size),
    [activities, page, size]
  );

  const openedModulesChildren = useMemo(
    () =>
      paginatedActivities
        .filter((activity) => modulesOpened.includes(activity.instance.id))
        .flatMap((activity) => activity.instance.metadata.module.activities)
        .map((activity) => activity.id),
    [paginatedActivities, modulesOpened]
  );

  const { data: childrenAssignationsByModuleId, isLoading: isLoadingAssignations } =
    useAssignationsByProfile(openedModulesChildren, {
      enabled: !!openedModulesChildren.length,
      select: (assignations) => groupBy(assignations, 'instance.metadata.module.id'),
    });

  const result = useMemo(() => {
    if (!isEmpty(childrenAssignationsByModuleId)) {
      return paginatedActivities.flatMap((activity) =>
        parseChildAssignation({ activity, childrenAssignationsByModuleId })
      );
    }

    return paginatedActivities;
  }, [paginatedActivities, childrenAssignationsByModuleId]);

  return {
    activities: result,
    totalCount: activities.length,
    isLoading:
      isLoadingActivities ||
      (startDate === undefined && endDate === undefined) ||
      (isLoadingAssignations && !!openedModulesChildren.length),
  };
}

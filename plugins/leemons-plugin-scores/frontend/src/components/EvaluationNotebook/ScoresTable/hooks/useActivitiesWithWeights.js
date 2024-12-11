import { useMemo } from 'react';

import { filter, groupBy, keyBy, sortBy } from 'lodash';

import getApplySameValueWeightForUnlocked from '../helpers/getApplySameValueWeightForUnlocked';

import useActivities from './useActivities';
import { useManualActivitesForNotebook } from './useManualActivitesForNotebook';

import useWeights from '@scores/requests/hooks/queries/useWeights';

function getActivitiesWeightsByModules({ weights, activities }) {
  const evaluableActivities = filter(activities, 'isEvaluable');

  const { applySameValue } = weights;
  const weightsPerModuleId = keyBy(weights.weights, 'id');
  const modulesCount = Math.max(evaluableActivities.length, weights.weights.length);

  return activities.map((activity) => {
    const weight = weightsPerModuleId[activity.id];
    let weightValue = weight?.weight;

    if (!weight?.isLocked && applySameValue && activity.isEvaluable) {
      weightValue = getApplySameValueWeightForUnlocked(weights, modulesCount);
    }

    return {
      ...activity,
      hasNoWeight: !applySameValue && !weight,
      weight: weightValue ?? 0,
    };
  });
}

function getActivitiesWeightsByRoles({ weights, activities }) {
  const evaluableActivities = filter(activities, 'isEvaluable');

  const { applySameValue } = weights;
  const weightsPerType = keyBy(weights.weights, 'id');

  const roles = groupBy(evaluableActivities, 'role');
  const rolesCount = Math.max(Object.keys(roles).length, weights.weights.length);

  return activities.map((activity) => {
    const roleWeight = weightsPerType[activity.role];
    let weightValue = roleWeight?.weight;

    if (!roleWeight?.isLocked && applySameValue && activity.isEvaluable) {
      weightValue = getApplySameValueWeightForUnlocked(weights, rolesCount);
    }

    const weight = !roles[activity.role]
      ? 0
      : Number((weightValue / roles[activity.role].length).toFixed(4));

    return {
      ...activity,
      weight: weight ?? 0,
    };
  });
}

function getActivitiesWeightsWithSameValue({ activities }) {
  const evaluableActivities = filter(activities, 'isEvaluable');
  const activitiesCount = evaluableActivities?.length;
  const weightPerActivity = Number((1 / activitiesCount).toFixed(4));

  return activities.map((activity) => ({
    ...activity,
    weight: (activity.isEvaluable ? weightPerActivity : 0) ?? 0,
  }));
}

export default function useActivitiesWithWeights({ program, class: klass, period, filters }) {
  const { data: weights, isLoading: weightsLoading } = useWeights({ classId: klass?.id });

  const { activities: assignablesActivities, isLoading: activitiesLoading } = useActivities({
    program,
    class: klass,
    period,
    filters,
    weights,
  });

  const { manualActivities, isLoading: manualActivitiesLoading } = useManualActivitesForNotebook({
    klass,
    filters,
    period,
  });

  const activities = useMemo(
    () => sortBy([...assignablesActivities, ...manualActivities], 'deadline'),
    [assignablesActivities, manualActivities]
  );

  let activitiesWithWeights;

  if (weights?.type === 'modules') {
    activitiesWithWeights = getActivitiesWeightsByModules({ weights, activities });
  } else if (weights?.type === 'roles') {
    activitiesWithWeights = getActivitiesWeightsByRoles({ weights, activities });
  } else {
    activitiesWithWeights = getActivitiesWeightsWithSameValue({ activities });
  }

  return {
    activities: activitiesWithWeights,
    isLoading: activitiesLoading || manualActivitiesLoading || weightsLoading,
  };
}

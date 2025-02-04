import { filter, keyBy, groupBy } from 'lodash';

import useActivities from './useActivities';

import getApplySameValueWeightForUnlocked from '@scores/components/EvaluationNotebook/ScoresTable/helpers/getApplySameValueWeightForUnlocked';

function getActivitiesWeightsByModules({ weights, activities }) {
  const evaluableActivities = filter(activities, 'instance.gradable');

  const { applySameValue } = weights;
  const weightsPerModuleId = keyBy(weights.weights, 'id');
  const modulesCount = Math.max(evaluableActivities.length, weights.weights.length);

  return activities.map((activity) => {
    const weight = weightsPerModuleId[activity.instance.id];

    let weightValue = weight?.weight;

    if (!weight?.isLocked && applySameValue && activity?.instance?.gradable) {
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
  const evaluableActivities = filter(activities, 'instance.gradable');

  const { applySameValue } = weights;
  const weightsPerType = keyBy(weights.weights, 'id');

  const roles = groupBy(evaluableActivities, 'instance.assignable.role');
  const rolesCount = Math.max(Object.keys(roles).length, weights.weights.length);

  return activities.map((activity) => {
    const { role } = activity.instance.assignable;
    const roleWeight = weightsPerType[role];
    let weightValue = roleWeight?.weight;

    if (!roleWeight?.isLocked && applySameValue && activity?.instance?.gradable) {
      weightValue = getApplySameValueWeightForUnlocked(weights, rolesCount);
    }

    const weight = !roles[role] ? 0 : Number((weightValue / roles[role].length).toFixed(4));

    return {
      ...activity,
      weight: weight ?? 0,
    };
  });
}

function getActivitiesWeightsWithSameValue({ activities }) {
  const evaluableActivities = filter(activities, 'instance.gradable');
  const activitiesCount = evaluableActivities?.length;
  const weightPerActivity = Number((1 / activitiesCount).toFixed(4));

  return activities.map((activity) => ({
    ...activity,
    weight: (activity?.instance?.gradable ? weightPerActivity : 0) ?? 0,
  }));
}

export default function useActivitiesWithWeights({
  class: klass,
  period,
  showNonEvaluable,
  weights,
  search,
}) {
  const { activities, isLoading: activitiesLoading } = useActivities({
    class: klass,
    period,
    showNonEvaluable,
    weights,
    search,
  });

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
    isLoading: activitiesLoading,
  };
}

/* eslint-disable import/prefer-default-export */
import { useMemo } from 'react';

function usePendingEvaluationsCount({ instance }) {
  const moduleTotal = useMemo(() => {
    let requireScoringCounter = 0;
    const activitiesStatus = instance?.students?.[0]?.metadata?.moduleStatus || [];
    if (activitiesStatus) {
      activitiesStatus.forEach((activity) => {
        if (activity.requiresScoring) {
          requireScoringCounter += 1;
        }
      });
    }
    return requireScoringCounter;
  }, [instance.students]);

  const pendingEvaluationActivitiesCount = useMemo(() => {
    const activitiesCompleted = {};
    const activitiesFullyEvaluated = {};

    instance?.students?.forEach((student) => {
      const activities = student?.metadata?.moduleStatus;

      activities?.forEach((activityStatus) => {
        if (activityStatus.completed || activityStatus.activityClosed) {
          activitiesCompleted[activityStatus.instance] =
            (activitiesCompleted[activityStatus.instance] || 0) + 1;
        }

        activitiesFullyEvaluated[activityStatus.instance] ??= 0;
        if (activityStatus.fullyEvaluated) {
          activitiesFullyEvaluated[activityStatus.instance] += 1;
        }
      });
    });

    const activitiestoEvaluateIds = Object.keys(activitiesFullyEvaluated).filter(
      (id) => activitiesCompleted[id] > activitiesFullyEvaluated[id]
    );

    return activitiestoEvaluateIds.length ?? 0;
  }, [instance?.students]);

  return { moduleTotal, pendingEvaluationActivitiesCount };
}

export { usePendingEvaluationsCount };

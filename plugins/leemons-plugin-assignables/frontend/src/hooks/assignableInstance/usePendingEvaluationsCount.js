/* eslint-disable import/prefer-default-export */
import { difference } from 'lodash';
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
    const activitiesCompleted = [];
    const activitiesFullyEvaluated = [];

    instance?.students?.forEach((student) => {
      const activities = student?.metadata?.moduleStatus;

      activities?.forEach((activityStatus) => {
        if (activityStatus.completed) {
          activitiesCompleted.push(activityStatus.instance);
        }

        if (activityStatus.fullyEvaluated) {
          activitiesFullyEvaluated.push(activityStatus.instance);
        }
      });
    });

    return difference(activitiesCompleted, activitiesFullyEvaluated).length ?? 0;
  }, [instance?.students]);

  return { moduleTotal, pendingEvaluationActivitiesCount };
}

export { usePendingEvaluationsCount };

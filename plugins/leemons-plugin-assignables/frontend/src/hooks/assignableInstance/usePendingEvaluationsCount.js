/* eslint-disable import/prefer-default-export */
import { difference } from 'lodash';
import { useMemo } from 'react';

function usePendingEvaluationsCount({ instance }) {
  const moduleTotal = useMemo(
    () => instance.assignable?.submission?.activities?.length,
    [instance.assignable?.submission?.activities]
  );

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

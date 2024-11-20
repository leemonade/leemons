import { useMemo } from 'react';

import useAssignations from '@assignables/hooks/assignations/useAssignations';

export function useBlockingActivitiesStatus({ instance, user }) {
  const blockingActivities = useMemo(
    () =>
      instance?.relatedAssignableInstances?.blocking?.map((id) => ({ user, instance: id })) ?? [],
    [instance, user]
  );

  const queryIsEnabled = !!blockingActivities.length && !!user;
  const blockingActivitiesAssignations = useAssignations(blockingActivities, true, {
    enabled: queryIsEnabled,
  });

  const { assignations, blockedActivitiesAreFinished } = useMemo(() => {
    return {
      isLoading: blockingActivitiesAssignations.some(({ isLoading }) => isLoading),
      assignations: blockingActivitiesAssignations.map(({ data }) => data),
      blockedActivitiesAreFinished: blockingActivitiesAssignations.every(
        ({ data }) => data?.finished
      ),
    };
  }, [blockingActivitiesAssignations]);

  const isBlocked = queryIsEnabled && !blockedActivitiesAreFinished;

  return { isBlocked, blockingActivities: assignations };
}

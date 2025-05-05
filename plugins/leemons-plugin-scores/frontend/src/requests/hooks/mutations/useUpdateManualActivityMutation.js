import { useMutation, useQueryClient } from '@tanstack/react-query';

import { classManualActivitiesKey } from '../keys/manualActivities';

import { updateManualActivity } from '@scores/requests/manualActivities/update';

export function useUpdateManualActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateManualActivity,
    onSuccess: (_, { classId }) => {
      if (classId) {
        queryClient.invalidateQueries({
          queryKey: classManualActivitiesKey({ classId }),
        });
      }
    },
  });
}

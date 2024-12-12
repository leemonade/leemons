import { useMutation, useQueryClient } from '@tanstack/react-query';

import { classManualActivitiesKey } from '../keys/manualActivities';

import { createManualActivity } from '@scores/requests/manualActivities/create';

export function useCreateManualActivityMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManualActivity,
    onSuccess: (_, { classId }) => {
      queryClient.invalidateQueries({
        queryKey: classManualActivitiesKey({ classId }),
      });
    },
  });
}
